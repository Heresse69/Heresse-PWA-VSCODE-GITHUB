import React, { useState, useEffect, useCallback } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { useToast } from '@/components/ui/use-toast';
    import { useUser } from '@/contexts/UserContext';
    import { Link } from 'react-router-dom';
    import { PlusCircle } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

    import ChatHeader from '@/components/chat/ChatHeader';
    import ChatInputArea from '@/components/chat/ChatInputArea';
    import ChatMessageList from '@/components/chat/ChatMessageList';
    import MediaPaymentModal from '@/components/chat/modals/MediaPaymentModal';
    import MediaRatingModal from '@/components/chat/modals/MediaRatingModal';
    import SendMediaModal from '@/components/chat/modals/SendMediaModal';
    import ChatList from '@/components/chat/ChatList';
    import FullScreenMediaViewer from '@/components/chat/FullScreenMediaViewer';
    import { Input } from '@/components/ui/input';
    import { Search } from 'lucide-react';
    
    import useChatLogic from '@/hooks/useChatLogic';
    import useChatModals from '@/hooks/useChatModals';
    import { mockMatchesData } from '@/data/mockChatData';

    const StoryBubble = ({ story, isOwnStory, isAddButton }) => {
      if (isAddButton) {
        return (
          <Link to="/stories/create" className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center w-20">
            <Button variant="outline" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-dashed border-primary/50 bg-slate-700/50 text-primary hover:bg-primary/10 flex items-center justify-center">
              <PlusCircle size={30} />
            </Button>
            <span className="text-xs text-gray-300">Ajouter</span>
          </Link>
        );
      }

      return (
        <Link to={`/stories/${story.id}`} className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center w-20">
          <Avatar className={`w-16 h-16 sm:w-20 sm:h-20 border-2 ${!story.seen && !isOwnStory ? 'border-pink-500' : 'border-slate-600'}`}>
            <AvatarImage src={story.url} alt={story.userName} />
            <AvatarFallback className="bg-slate-600 text-lg">{story.userName.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-300 truncate w-full">{isOwnStory ? 'Ma Story' : story.userName}</span>
        </Link>
      );
    };

    const ChatPage = () => {
      const { matchId } = useParams();
      const navigate = useNavigate();
      const { toast } = useToast();
      const { currentUser, updateWalletBalance, updatePhotoRating: updateUserPhotoRatingContext, updateStats, stories: allStoriesFromContext } = useUser(); 
      
      const { 
        matches, 
        setMatches, 
        currentChat, 
        setCurrentChat, 
        addMessageToChat 
      } = useChatLogic(mockMatchesData, currentUser, matchId);

      const {
        showPaymentModal, openPaymentModal, closePaymentModal, mediaToUnlock,
        showFullScreenViewer, openFullScreenViewer, closeFullScreenViewer, fullScreenMediaUrl,
        showRatingModal, openRatingModal, closeRatingModal, photoToRate, setPhotoToRate, ratingForPhoto, setRatingForPhoto,
        showSendMediaModal, openSendMediaModal, closeSendMediaModal
      } = useChatModals();

      const [displayableStories, setDisplayableStories] = useState([]);
      const [searchTerm, setSearchTerm] = useState('');
      const [newMessage, setNewMessage] = useState('');
      
      useEffect(() => {
        if (currentUser && allStoriesFromContext) {
            const matchedUserIds = new Set(matches.map(match => match.id));
            
            const currentUserStory = allStoriesFromContext.find(s => s.userId === currentUser.id && s.userName === "Moi");
            
            const storiesFromMatches = allStoriesFromContext.filter(story => 
                matchedUserIds.has(story.userId) && story.userId !== currentUser.id
            );

            const uniqueStoriesFromMatches = Array.from(new Map(storiesFromMatches.map(story => [story.userId, story])).values());
            
            const sortedStories = [
                ...(currentUserStory ? [{...currentUserStory, isOwnStory: true}] : []),
                ...uniqueStoriesFromMatches.sort((a, b) => (a.seen === b.seen) ? 0 : a.seen ? 1 : -1)
            ];
            setDisplayableStories(sortedStories);
        }
      }, [currentUser, allStoriesFromContext, matches]);
      
      const handleSendMessage = useCallback((text) => {
        if (!text.trim() || !currentChat) return;
        addMessageToChat({ text: text, sender: 'user', type: 'text' });
        setNewMessage('');
        
        setTimeout(() => {
          if (!currentChat) return; 
          const replies = ["Oui, bien sûr !", "Je suis occupé(e) pour le moment.", "Cool !", "Haha, pas mal.", "D'accord.", "Pourquoi pas ?"];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          addMessageToChat({ text: randomReply, sender: currentChat.name, type: 'text' });
        }, 1500 + Math.random() * 2000);
      }, [addMessageToChat, currentChat]);

      const handleConfirmSendMedia = useCallback((price, photoUrl) => {
        if (!currentChat || price < 1 || price > 3) {
            toast({title: "Erreur", description: "Veuillez définir un prix entre 1€ et 3€.", variant: "destructive"});
            return;
        }
        addMessageToChat({ 
            photoUrl: photoUrl, 
            sender: 'user', 
            type: 'photo', 
            isBlurred: false, 
            price: price, 
            viewed: false, 
            rated: false, 
            originalPrice: price,
            status: 'sent_unopened' 
        });
        toast({ title: "Photo envoyée!", description: `Votre photo a été envoyée (prix: ${price.toFixed(2)}€).` });
        closeSendMediaModal();
      }, [addMessageToChat, currentChat, toast, closeSendMediaModal]);
      
      const handleRequestMedia = useCallback(() => {
        if(!currentChat) return;
        addMessageToChat({
            sender: 'user',
            type: 'media_request',
            text: `Vous avez demandé un média à ${currentChat.name}.`
        });
        toast({title: "Demande envoyée", description: `Vous avez demandé un média à ${currentChat.name}.`});

        setTimeout(() => {
            const targetChat = matches.find(m => m.id === currentChat.id);
            if (!targetChat) return;

            if (targetChat.name === 'Claudia' && targetChat.availableMedia && targetChat.availableMedia.length > 0) {
                const mediaToSend = targetChat.availableMedia[Math.floor(Math.random() * targetChat.availableMedia.length)];
                addMessageToChat({
                    sender: targetChat.name,
                    type: 'photo',
                    photoUrl: mediaToSend.url,
                    isBlurred: true,
                    price: mediaToSend.price,
                    viewed: false,
                    rated: false,
                    originalPrice: mediaToSend.originalPrice,
                    status: 'received_unopened',
                    id: `msg_${targetChat.name}_${mediaToSend.id}_${Date.now()}` 
                }, targetChat.id);
                toast({title: "Média Reçu!", description: `${targetChat.name} vous a envoyé un média!`});
            } else {
                const photoPrice = Math.floor(Math.random() * 3) + 1; 
                addMessageToChat({
                    sender: targetChat.name,
                    type: 'photo',
                    photoUrl: `https://source.unsplash.com/random/400x300/?model,fashion&t=${Date.now()}`,
                    isBlurred: true,
                    price: photoPrice,
                    viewed: false,
                    rated: false,
                    originalPrice: photoPrice,
                    status: 'received_unopened',
                    id: `msg_${targetChat.name}_random_${Date.now()}`
                }, targetChat.id);
                toast({title: "Média Reçu!", description: `${targetChat.name} vous a envoyé un média!`});
            }
        }, 3000 + Math.random() * 2000);
      }, [addMessageToChat, currentChat, matches, toast]);

      const handlePhotoClick = useCallback((message) => {
        if (message.sender === 'user' || (message.status === 'received_opened' && !message.isReplayAction && !message.isRateAction)) { 
            openFullScreenViewer(message.photoUrl);
            return;
        }

        if (message.isReplayAction) { 
            openPaymentModal({...message, isReplay: true});
            return;
        }
        if (message.isRateAction) { 
            openRatingModal(message);
            return;
        }

        if (message.status === 'received_unopened') {
            openPaymentModal({...message, isReplay: false});
        }
      }, [openFullScreenViewer, openPaymentModal, openRatingModal]);

      const handleConfirmPaymentAndUnlock = useCallback(() => {
        if (!mediaToUnlock || !currentUser || !currentChat) return;
        const priceToPay = mediaToUnlock.isReplay ? mediaToUnlock.originalPrice / 2 : mediaToUnlock.price;

        if (currentUser.walletBalance < priceToPay) {
          toast({ title: "Solde insuffisant", description: `Vous avez besoin de ${priceToPay.toFixed(2)}€ pour voir ce média. Rechargez votre portefeuille.`, variant: "destructive" }); return;
        }
        updateWalletBalance(-priceToPay); 
        
        if (mediaToUnlock.sender !== 'user') { 
            toast({ title: "Paiement Effectué!", description: `${mediaToUnlock.senderName || mediaToUnlock.sender} a reçu ${priceToPay.toFixed(2)}€.`});
            updateStats({ photosSold: (currentUser.stats?.photosSold || 0) + 1, revenueGenerated: (currentUser.stats?.revenueGenerated || 0) + priceToPay }); 
        }

        const updatedMessages = currentChat.messages.map(msg => 
          msg.id === mediaToUnlock.id ? { 
            ...msg, 
            isBlurred: false, 
            viewed: true, 
            status: 'received_opened', 
            replayed: mediaToUnlock.isReplay ? true : (msg.replayed || false)
          } : msg
        );
        const updatedChat = { ...currentChat, messages: updatedMessages };
        setCurrentChat(updatedChat);
        setMatches(prevMatches => prevMatches.map(match => match.id === currentChat.id ? updatedChat : match ));
        
        toast({ title: `Média débloqué${mediaToUnlock.isReplay ? ' (Replay)' : ''}!`, description: `${priceToPay.toFixed(2)}€ ont été déduits.` });
        
        closePaymentModal();
        openFullScreenViewer(mediaToUnlock.photoUrl);
        
        if (!mediaToUnlock.isReplay && mediaToUnlock.sender !== 'user' && !mediaToUnlock.rated) { 
            setPhotoToRate(mediaToUnlock); 
        }
      }, [mediaToUnlock, currentUser, currentChat, updateWalletBalance, updateStats, setCurrentChat, setMatches, toast, closePaymentModal, openFullScreenViewer, setPhotoToRate]);
      
      const handleRatingSubmit = useCallback((rating) => { 
        if (!photoToRate || rating === 0 || !currentChat) {
            toast({title: "Notation", description: "Veuillez sélectionner une note.", variant: "destructive"});
            return;
        }
        
        updateUserPhotoRatingContext(photoToRate.sender, rating); 
        
        const updatedMessages = currentChat.messages.map(msg => 
          msg.id === photoToRate.id ? { ...msg, rated: true, rating: rating } : msg
        );
        const updatedChat = { ...currentChat, messages: updatedMessages };
        setCurrentChat(updatedChat);
        setMatches(prevMatches => prevMatches.map(match => match.id === currentChat.id ? updatedChat : match ));

        toast({title: "Merci!", description: `Vous avez noté ce média ${rating}/5.`});
        closeRatingModal();
      }, [photoToRate, currentChat, updateUserPhotoRatingContext, setCurrentChat, setMatches, toast, closeRatingModal]);

      const handleStartLiveCall = useCallback(() => { 
        if (!currentChat || !currentUser) return;
        const costPerMinute = currentChat?.liveCallCost || 2; 
        const minDurationMinutes = currentUser?.settings?.minLiveCallDuration || 1; 
        const requiredBalance = costPerMinute * minDurationMinutes;
        if(currentUser.walletBalance < requiredBalance) {
            toast({title: "Solde insuffisant pour l'appel", description: `Vous avez besoin d'au moins ${requiredBalance.toFixed(2)}€ pour ${minDurationMinutes} min d'appel.`, variant: "destructive"});
            return;
        }
        toast({title: "Appel Live (Simulation)", description: `Lancement de l'appel avec ${currentChat.name}. Coût: ${costPerMinute}€/min.`});
      }, [currentChat, currentUser, toast]);
      
      const filteredMatches = matches
        .filter(match => match.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const unreadDiff = (b.unread || 0) - (a.unread || 0);
            if (unreadDiff !== 0) return unreadDiff;
            
            const parseTimestamp = (ts) => {
                if (!ts || typeof ts !== 'string') return 0;
                if (ts.toLowerCase() === 'hier') {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    return yesterday.getTime();
                }
                const parts = ts.split(':');
                if (parts.length === 2) {
                    const today = new Date();
                    today.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
                    return today.getTime();
                }
                return 0; 
            };
            return parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp);
        });


      if (currentChat && currentUser) { 
        return ( 
            <> 
                <div className="flex flex-col h-full bg-gradient-to-b from-background to-slate-900"> 
                    <ChatHeader 
                        currentChat={currentChat} 
                        onBack={() => navigate('/chat')} 
                        onStartLiveCall={handleStartLiveCall} 
                    />
                    <ChatMessageList 
                        messages={currentChat.messages || []} 
                        onPhotoClick={handlePhotoClick} 
                        onInitiateSendMedia={openSendMediaModal}
                        currentUserId={currentUser.id}
                    />
                    <ChatInputArea 
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        onSendMessage={handleSendMessage}
                        onInitiateSendMedia={openSendMediaModal}
                        onRequestMedia={handleRequestMedia}
                    />
                </div> 
                
                {showPaymentModal && mediaToUnlock && currentUser && ( 
                    <MediaPaymentModal
                        isOpen={showPaymentModal}
                        onOpenChange={(isOpen) => { if(!isOpen) closePaymentModal(); }}
                        mediaToUnlock={mediaToUnlock}
                        currentUserWalletBalance={currentUser.walletBalance}
                        onConfirm={handleConfirmPaymentAndUnlock}
                    />
                )}

                {showFullScreenViewer && fullScreenMediaUrl && (
                    <FullScreenMediaViewer mediaUrl={fullScreenMediaUrl} onClose={closeFullScreenViewer} />
                )}
                
                {showRatingModal && photoToRate && (
                    <MediaRatingModal
                        isOpen={showRatingModal}
                        onOpenChange={(isOpen) => { if(!isOpen) closeRatingModal(); }}
                        currentRating={ratingForPhoto}
                        onRatingChange={setRatingForPhoto}
                        onSubmit={handleRatingSubmit}
                    />
                )}
                {showSendMediaModal && (
                    <SendMediaModal
                        isOpen={showSendMediaModal}
                        onOpenChange={closeSendMediaModal}
                        onConfirmSendMedia={handleConfirmSendMedia}
                    />
                )}
            </> 
        ); 
    }

      return (
        <div className="p-4 pb-20 bg-gradient-to-b from-slate-900 to-slate-800 min-h-full text-white">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-400 mb-3 px-1">Stories</h2>
            <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
              <StoryBubble isAddButton={true} />
              {(displayableStories || []).map((story, index) => (
                <div key={story.id}>
                  <StoryBubble
                    story={story}
                    isOwnStory={story.isOwnStory || (currentUser && story.userId === currentUser.id)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="relative mb-5">
            <Input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-pink-500 focus:border-pink-500 pl-10 rounded-full py-2.5"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <ChatList 
            matches={filteredMatches}
            userStories={displayableStories}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
          />
        </div>
      );
    };
    export default ChatPage;