import React, { useState, useEffect, useRef, useCallback } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { motion, AnimatePresence, useDragControls } from 'framer-motion';
    import { X, Volume2, VolumeX, Pause, Play, Send, Paperclip } from 'lucide-react';
    import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useUser } from '@/contexts/UserContext';
    import { useToast } from '@/components/ui/use-toast';
    import { 
        useStoryNavigation, 
        useStoryTimer,
        useStoryInteractions
    } from '@/hooks/useStoryPlayerLogic';

    const StoryProgressBar = ({ groups, currentGroupIndex, currentStoryIndex, progress }) => (
        <div className="absolute top-2 left-2 right-2 flex space-x-1 z-20 px-1 max-w-md mx-auto" 
             style={{ marginTop: `calc(env(safe-area-inset-top) + 0.5rem)` }}
             onClick={(e) => e.stopPropagation()}
        >
            {groups[currentGroupIndex]?.stories.map((story, index) => (
                <div key={story.id || index} className="h-1 bg-white/30 rounded-full flex-1">
                    <motion.div 
                        className="h-1 bg-white rounded-full" 
                        initial={{ width: '0%' }}
                        animate={{ width: index === currentStoryIndex ? `${progress}%` : (index < currentStoryIndex ? '100%' : '0%') }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                </div>
            ))}
        </div>
    );

    const StoryHeader = ({ author, group, onClose }) => (
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20 max-w-md mx-auto" 
             style={{ marginTop: `calc(env(safe-area-inset-top) + 1.5rem)` }} 
             onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 border-2 border-white/50">
                   <AvatarImage src={author?.profilePicture || author?.avatar_url} />
                   <AvatarFallback>{author?.name?.substring(0,1)?.toUpperCase() || group.userName?.substring(0,1)?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-white text-sm font-semibold shadow-sm">{author?.name || group.userName}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onClose();}} className="text-white/80 hover:text-white">
                <X size={24} />
            </Button>
        </div>
    );

    const StoryMedia = ({ content, videoRef, onClick }) => {
        const handleMediaClick = (e) => {
            if(onClick) onClick(e);
        };
        return (
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={content.id}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="w-full h-full cursor-pointer"
                    onClick={handleMediaClick}
                >
                    {content.type === 'image' && (
                        <img src={content.url} alt={`Story de ${content.userName}`} className="w-full h-full object-cover rounded-b-lg sm:rounded-lg" />
                    )}
                    {content.type === 'video' && (
                        <video ref={videoRef} src={content.url} className="w-full h-full object-cover rounded-b-lg sm:rounded-lg" playsInline muted={false} loop={false} />
                    )}
                </motion.div>
            </AnimatePresence>
        );
    }


    const StoryInput = ({ authorName, groupUserId, onSend, onInteractionStart, onInteractionEnd, onAttach }) => {
        const [newMessage, setNewMessage] = useState('');
        const navigate = useNavigate();
        const { toast } = useToast();

        const handleSendMessage = (e) => {
            e.preventDefault();
            if (!newMessage.trim()) return;
            toast({
                title: "Message envoyé!",
                description: `À ${authorName || 'Utilisateur'}: "${newMessage}"`,
            });
            onSend(newMessage);
            setNewMessage('');
            navigate(`/chat/${groupUserId}?message=${encodeURIComponent(newMessage)}`);
        };
        
        return (
            <form 
                onSubmit={handleSendMessage} 
                className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm flex items-center space-x-2 z-20 max-w-md mx-auto"
                style={{ paddingBottom: `calc(0.5rem + env(safe-area-inset-bottom))` }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={onInteractionStart}
                onMouseUp={onInteractionEnd}
                onTouchStart={onInteractionStart}
                onTouchEnd={onInteractionEnd}
            >
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white" onClick={(e) => {e.stopPropagation(); onAttach();}}>
                    <Paperclip size={20} />
                </Button>
                <Input
                    type="text"
                    placeholder={`Répondre à ${authorName}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow bg-white/20 border-none text-white placeholder-gray-300/80 focus:ring-primary focus:border-primary rounded-full px-4 py-2 text-sm"
                />
                <Button type="submit" size="icon" className="bg-primary hover:bg-primary-hover rounded-full w-9 h-9">
                    <Send size={18} />
                </Button>
            </form>
        );
    };


    const ViewStoryPage = () => {
        const { storyId: initialStoryIdFromParam } = useParams();
        const navigate = useNavigate();
        const { stories: allStories, markStoryAsSeen, currentUser } = useUser();
        const { toast } = useToast();
        
        const storyContainerRef = useRef(null);
        const videoRef = useRef(null); 
        const dragControls = useDragControls();

        const handleCloseStory = useCallback(() => navigate(-1), [navigate]);

        const {
            orderedStoryUsers,
            currentUserStoryGroupIndex,
            currentStoryInGroupIndex,
            currentStoryGroup,
            currentStoryContent,
            goToNextStoryItem,
            goToPrevStoryItem,
            isReady,
        } = useStoryNavigation(initialStoryIdFromParam, allStories, markStoryAsSeen, currentUser?.id);

        const { progress, isPaused, setIsPaused } = useStoryTimer(
            currentStoryContent,
            goToNextStoryItem,
            videoRef 
        );

        const { 
            handleTap, 
            handleInteractionStart, 
            handleInteractionEnd,
            handleDragEnd
        } = useStoryInteractions(
            storyContainerRef, 
            goToPrevStoryItem, 
            goToNextStoryItem, 
            () => setIsPaused(p => !p), 
            handleCloseStory, 
            videoRef,
            isPaused
        );
        
        useEffect(() => {
          if(!isReady && allStories && allStories.length > 0) {
             // Story navigation logic handles initial setup
          } else if (allStories && allStories.length === 0 && !isReady) {
             navigate('/chat');
          }
        }, [isReady, allStories, navigate]);


        if (!isReady || !currentStoryContent || !currentStoryGroup) {
            return <div className="h-full w-full bg-black flex items-center justify-center text-white">Chargement de la story...</div>;
        }
        
        const storyAuthor = currentStoryGroup.userId === currentUser.id ? currentUser : { name: currentStoryGroup.userName, profilePicture: currentStoryGroup.stories[0]?.userProfilePicture, avatar_url: currentStoryGroup.stories[0]?.userProfilePicture };

        return (
            <motion.div 
                ref={storyContainerRef}
                drag="y"
                dragControls={dragControls}
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={handleDragEnd}
                dragElastic={{ top: 0, bottom: 0.5 }}
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: "0%" }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 select-none overflow-hidden"
                style={{ paddingTop: `env(safe-area-inset-top)`}}
                
            >
                <div className="absolute top-0 left-0 right-0 h-[env(safe-area-inset-top)] bg-black z-30"></div>

                <StoryProgressBar 
                    groups={orderedStoryUsers} 
                    currentGroupIndex={currentUserStoryGroupIndex} 
                    currentStoryIndex={currentStoryInGroupIndex}
                    progress={progress}
                />
                
                <div 
                    className="w-full h-full max-w-md max-h-screen relative"
                    style={{ 
                        height: `calc(100% - env(safe-area-inset-top) - env(safe-area-inset-bottom))`,
                        paddingBottom: `env(safe-area-inset-bottom)`
                    }}
                    onClick={handleTap} 
                >
                   <StoryMedia 
                        content={currentStoryContent} 
                        videoRef={videoRef}
                   />
                </div>

                <StoryHeader 
                    author={storyAuthor} 
                    group={currentStoryGroup} 
                    onClose={handleCloseStory} 
                />
                
                <StoryInput 
                    authorName={storyAuthor?.name || currentStoryGroup.userName}
                    groupUserId={currentStoryGroup.userId}
                    onSend={(message) => { /* Logic handled in component */ }}
                    onInteractionStart={handleInteractionStart}
                    onInteractionEnd={handleInteractionEnd}
                    onAttach={() => toast({title: "Option à venir", description: "Envoyer des médias depuis les stories sera bientôt disponible."})}
                />

                 <div className="hidden">
                    <Button onClick={() => setIsPaused(p => !p)}>{isPaused ? <Play size={20} /> : <Pause size={20} />}</Button>
                 </div>
            </motion.div>
        );
    };

    export default ViewStoryPage;