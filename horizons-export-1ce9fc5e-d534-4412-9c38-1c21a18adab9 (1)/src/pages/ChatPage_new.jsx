import React, { useState, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Search, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import useChatLogic from '@/hooks/useChatLogic';
import useChatModals from '@/hooks/useChatModals';
import { getConversations, getConversation } from '@/data/mockChatData';
import StoryViewer from '@/components/StoryViewer';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatInputArea from '@/components/chat/ChatInputArea';
import FullScreenMediaViewer from '@/components/chat/FullScreenMediaViewer';
import MediaPaymentModal from '@/components/chat/MediaPaymentModal';
import MediaRatingModal from '@/components/chat/MediaRatingModal';
import SendMediaModal from '@/components/chat/SendMediaModal';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const StoryBubble = ({ story, isOwnStory, isAddButton }) => {
  if (isAddButton) {
    return (
      <Link to="/stories/create" className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center" style={{width: '140px !important', minWidth: '140px'}}>
        <Button variant="outline" className="rounded-full border-dashed border-primary/50 bg-slate-700/50 text-primary hover:bg-primary/10 flex items-center justify-center" style={{width: '120px !important', height: '120px !important', minWidth: '120px', minHeight: '120px'}}>
          <PlusCircle size={50} />
        </Button>
        <span className="text-xs text-gray-300">Ajouter</span>
      </Link>
    );
  }

  return (
    <Link to={`/stories/${story.id}`} className="flex-shrink-0 flex flex-col items-center space-y-1.5 text-center" style={{width: '140px !important', minWidth: '140px'}}>
      <Avatar className={`border-4 ${!story.seen && !isOwnStory ? 'border-pink-500' : 'border-red-500'}`} style={{width: '120px !important', height: '120px !important', minWidth: '120px', minHeight: '120px', borderWidth: '4px !important'}}>
        <AvatarImage src={story.url} alt={story.userName} />
        <AvatarFallback className="bg-slate-600" style={{fontSize: '24px !important'}}>{story.userName.substring(0, 1)}</AvatarFallback>
      </Avatar>
      <span className="text-xs text-gray-300 truncate w-full">{isOwnStory ? 'Ma Story' : story.userName}</span>
    </Link>
  );
};

const ConversationCard = ({ conversation, index }) => {
  const formatTimestamp = (timestamp) => {
    if (timestamp.includes(':')) return timestamp;
    return timestamp;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/70 transition-colors"
    >
      <Link to={`/chat/${conversation.id}`} className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="w-16 h-16">
            <AvatarImage src={conversation.avatarImage} alt={conversation.name} />
            <AvatarFallback className="bg-slate-600 text-lg">{conversation.avatarText}</AvatarFallback>
          </Avatar>
          {conversation.online && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-700 rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-white truncate">{conversation.name}</h3>
            <span className="text-xs text-gray-400 flex-shrink-0">{formatTimestamp(conversation.timestamp)}</span>
          </div>
          <p className="text-sm text-gray-300 truncate">{conversation.lastMessage}</p>
        </div>
        
        <div className="flex flex-col items-end space-y-1">
          {conversation.unread > 0 && (
            <Badge variant="destructive" className="bg-pink-500 hover:bg-pink-600 text-xs px-2 py-1 min-w-[20px] h-5 flex items-center justify-center rounded-full">
              {conversation.unread}
            </Badge>
          )}
          <MessageSquare size={16} className="text-gray-400" />
        </div>
      </Link>
    </motion.div>
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
  } = useChatLogic(getConversations(), currentUser, matchId);

  const {
    showPaymentModal, openPaymentModal, closePaymentModal, mediaToUnlock,
    showFullScreenViewer, openFullScreenViewer, closeFullScreenViewer, fullScreenMediaUrl,
    showRatingModal, openRatingModal, closeRatingModal, photoToRate, setPhotoToRate, ratingForPhoto, setRatingForPhoto,
    showSendMediaModal, openSendMediaModal, closeSendMediaModal
  } = useChatModals();

  const [searchTerm, setSearchTerm] = useState('');
  const [conversationsList, setConversationsList] = useState([]);
  const [displayableStories, setDisplayableStories] = useState([]);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [newMessage, setNewMessage] = useState('');

  // Charger les conversations et enrichir avec les données utilisateur
  useEffect(() => {
    const conversations = getConversations();
    const enrichedConversations = conversations.map(conv => {
      const userProfile = matches.find(m => m.id === conv.userId);
      if (userProfile) {
        return {
          ...conv,
          name: userProfile.name,
          avatarImage: userProfile.avatarImage,
          avatarText: userProfile.avatarText,
          online: userProfile.online
        };
      }
      return conv;
    });
    setConversationsList(enrichedConversations);
  }, [matches]);

  useEffect(() => {
    if (currentUser && allStoriesFromContext) {
      const matchedUserIds = new Set(conversationsList.map(conv => conv.userId || conv.id));
      const currentUserStory = allStoriesFromContext.find(s => s.userId === currentUser.id && s.userName === "Moi");
      const storiesFromMatches = allStoriesFromContext.filter(story => 
        matchedUserIds.has(story.userId) && story.userId !== currentUser.id
      );
      const uniqueStoriesFromMatches = Array.from(new Map(storiesFromMatches.map(story => [story.userId, story])).values());
      const sortedStories = [
        ...(currentUserStory ? [{ ...currentUserStory, isOwnStory: true }] : []),
        ...uniqueStoriesFromMatches.sort((a, b) => (a.seen === b.seen) ? 0 : a.seen ? 1 : -1)
      ];
      setDisplayableStories(sortedStories);
    }
  }, [currentUser, allStoriesFromContext, conversationsList]);

  const openStoryViewer = (storyIndex) => {
    setCurrentStoryIndex(storyIndex);
    setIsStoryViewerOpen(true);
  };

  const closeStoryViewer = () => {
    setIsStoryViewerOpen(false);
  };

  const filteredConversations = conversationsList.filter(conversation =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logique pour la page de chat individuel
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
      toast({ title: "Solde insuffisant", description: `Vous avez besoin de ${priceToPay.toFixed(2)}€ pour voir ce média. Rechargez votre portefeuille.`, variant: "destructive" }); 
      return;
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

  // Si on a un matchId dans l'URL, afficher la vue de chat individuel
  if (matchId && currentChat && currentUser) { 
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

  // Sinon, afficher la liste des conversations (exactement comme MatchesPage)
  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden fixed inset-0">
      {/* Section fixe en haut - Stories */}
      <div className="flex-shrink-0 h-[140px] p-3 pb-2 overflow-hidden">
        <h2 className="text-sm font-semibold text-gray-400 mb-2 px-1">Stories</h2>
        <div className="flex space-x-3 overflow-x-auto overflow-y-hidden pb-2 -mx-3 px-3 no-scrollbar h-[96px] items-start">
          <StoryBubble isAddButton={true} />
          {(displayableStories || []).map((story, index) => (
            <div key={story.id} onClick={() => openStoryViewer(index)}>
              <StoryBubble
                story={story}
                isOwnStory={story.isOwnStory || (currentUser && story.userId === currentUser.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section fixe - Barre de recherche */}
      <div className="flex-shrink-0 h-[64px] px-3 pb-3 overflow-hidden">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
          <Input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-pink-500 focus:border-pink-500 pl-10 pr-4 rounded-full py-2 w-full text-sm"
          />
        </div>
      </div>      {/* Section scrollable - Liste des conversations */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full px-3 pb-20 overflow-y-auto overflow-x-hidden mobile-scroll prevent-bounce">
          {isStoryViewerOpen && (
            <StoryViewer
              stories={displayableStories}
              initialIndex={currentStoryIndex}
              onClose={closeStoryViewer}
            />
          )}
        
          <div className="w-full">
            <h2 className="text-lg font-semibold text-white mb-3 sticky top-0 bg-gradient-to-b from-slate-900 to-transparent py-2">
              Vos Conversations ({filteredConversations.length})
            </h2>
            {filteredConversations.length > 0 ? (
              <div className="space-y-3 pb-4">
                {filteredConversations.map((conversation, index) => (
                  <ConversationCard key={conversation.id} conversation={conversation} index={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-gray-400 py-10 h-full">
                <MessageSquare size={64} className="mb-4 opacity-50 text-pink-500/70" />
                <h2 className="text-xl font-semibold text-white mb-2">
                  {searchTerm ? `Aucune conversation trouvée pour "${searchTerm}"` : "Aucune conversation pour le moment"}
                </h2>
                <p className="text-sm px-4">
                  {searchTerm ? "Essayez un autre terme de recherche." : "Commencez à matcher pour démarrer des conversations !"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
