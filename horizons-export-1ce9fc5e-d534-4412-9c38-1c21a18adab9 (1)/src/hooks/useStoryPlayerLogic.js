import { useState, useEffect, useCallback, useRef } from 'react';
    import { useNavigate } from 'react-router-dom';

    export const useStoryNavigation = (initialStoryIdFromParam, allStories, markStoryAsSeen, currentUserId) => {
        const navigate = useNavigate();
        const [orderedStoryUsers, setOrderedStoryUsers] = useState([]);
        const [currentUserStoryGroupIndex, setCurrentUserStoryGroupIndex] = useState(0);
        const [currentStoryInGroupIndex, setCurrentStoryInGroupIndex] = useState(0);
        const [isReady, setIsReady] = useState(false);

        useEffect(() => {
            if (!allStories || allStories.length === 0) {
                if (isReady && !initialStoryIdFromParam) navigate('/chat'); 
                return;
            }
    
            const uniqueUserIdsWithStories = [...new Set(allStories.map(s => s.userId))];
            const storyGroups = uniqueUserIdsWithStories.map(userId => {
                const userStories = allStories
                    .filter(s => s.userId === userId)
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                return { userId, stories: userStories, userName: userStories[0]?.userName || 'Utilisateur' };
            });

            storyGroups.sort((a, b) => {
                if (a.userId === currentUserId) return -1; 
                if (b.userId === currentUserId) return 1;
                const lastStoryA = a.stories[a.stories.length - 1]?.timestamp || 0;
                const lastStoryB = b.stories[b.stories.length - 1]?.timestamp || 0;
                return new Date(lastStoryB).getTime() - new Date(lastStoryA).getTime(); 
            });
            
            setOrderedStoryUsers(storyGroups);
    
            const initialStory = allStories.find(s => s.id === initialStoryIdFromParam);
            if (initialStory) {
                const groupIndex = storyGroups.findIndex(group => group.userId === initialStory.userId);
                if (groupIndex !== -1) {
                    const storyIndex = storyGroups[groupIndex].stories.findIndex(s => s.id === initialStory.id);
                    setCurrentUserStoryGroupIndex(groupIndex);
                    setCurrentStoryInGroupIndex(storyIndex >= 0 ? storyIndex : 0);
                    if(!initialStory.seen && initialStory.userId !== currentUserId) markStoryAsSeen(initialStory.id);
                    setIsReady(true);
                } else {
                     if (isReady) navigate('/chat');
                }
            } else {
                 if (storyGroups.length > 0) { 
                    setCurrentUserStoryGroupIndex(0);
                    setCurrentStoryInGroupIndex(0);
                    if(storyGroups[0].stories[0] && !storyGroups[0].stories[0].seen && storyGroups[0].stories[0].userId !== currentUserId) {
                        markStoryAsSeen(storyGroups[0].stories[0].id);
                    }
                    setIsReady(true);
                 } else {
                    if (isReady) navigate('/chat'); 
                 }
            }
        }, [initialStoryIdFromParam, allStories, markStoryAsSeen, navigate, isReady, currentUserId]);

        const currentStoryGroup = orderedStoryUsers[currentUserStoryGroupIndex];
        const currentStoryContent = currentStoryGroup?.stories[currentStoryInGroupIndex];

        const goToNextStoryItem = useCallback(() => {
            if (currentStoryGroup && currentStoryInGroupIndex < currentStoryGroup.stories.length - 1) {
                setCurrentStoryInGroupIndex(prev => prev + 1);
                const nextStory = currentStoryGroup.stories[currentStoryInGroupIndex + 1];
                if(nextStory && !nextStory.seen && nextStory.userId !== currentUserId) {
                    markStoryAsSeen(nextStory.id);
                }
            } else if (currentUserStoryGroupIndex < orderedStoryUsers.length - 1) {
                setCurrentUserStoryGroupIndex(prev => prev + 1);
                setCurrentStoryInGroupIndex(0);
                const nextGroupFirstStory = orderedStoryUsers[currentUserStoryGroupIndex + 1]?.stories[0];
                 if(nextGroupFirstStory && !nextGroupFirstStory.seen && nextGroupFirstStory.userId !== currentUserId) {
                    markStoryAsSeen(nextGroupFirstStory.id);
                 }
            } else {
                navigate('/chat');
            }
        }, [currentStoryGroup, currentStoryInGroupIndex, currentUserStoryGroupIndex, orderedStoryUsers, markStoryAsSeen, navigate, currentUserId]);

        const goToPrevStoryItem = useCallback(() => {
            if (currentStoryInGroupIndex > 0) {
                setCurrentStoryInGroupIndex(prev => prev - 1);
            } else if (currentUserStoryGroupIndex > 0) {
                const prevGroup = orderedStoryUsers[currentUserStoryGroupIndex - 1];
                setCurrentUserStoryGroupIndex(prev => prev - 1);
                setCurrentStoryInGroupIndex(prevGroup.stories.length - 1);
            }
        }, [currentStoryInGroupIndex, currentUserStoryGroupIndex, orderedStoryUsers]);
        
        return { 
            orderedStoryUsers, 
            currentUserStoryGroupIndex, 
            currentStoryInGroupIndex, 
            currentStoryGroup, 
            currentStoryContent, 
            goToNextStoryItem, 
            goToPrevStoryItem,
            isReady
        };
    };

    export const useStoryTimer = (currentStoryContent, onTimerEnd, videoRef) => {
        const [progress, setProgress] = useState(0);
        const [isPaused, setIsPaused] = useState(false);
        const timerRef = useRef(null);
        const videoDurationRef = useRef(null);

        useEffect(() => {
            if (!currentStoryContent || isPaused) {
                if (timerRef.current) clearInterval(timerRef.current);
                return;
            }

            setProgress(0);
            let duration = currentStoryContent.duration || 5000;
            
            if (currentStoryContent.type === 'video' && videoRef && videoRef.current) {
                const videoElement = videoRef.current;
                const onLoadedMetadata = () => {
                    videoDurationRef.current = videoElement.duration * 1000;
                    duration = videoDurationRef.current;
                    videoElement.play().catch(e => console.error("Video play error:", e));
                    startTimer(duration);
                };
                videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
                videoElement.currentTime = 0; 
                if (videoElement.readyState >= 2) { // HAVE_CURRENT_DATA or more
                    onLoadedMetadata(); // Already loaded
                } else {
                    videoElement.load(); // Ensure it loads if not already
                }
                 return () => {
                    videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
                    clearInterval(timerRef.current);
                };
            } else {
                 startTimer(duration);
            }
            
            function startTimer(effectiveDuration) {
                const intervalTime = 50; 
                const steps = effectiveDuration / intervalTime;
                let currentStep = 0;

                if (timerRef.current) clearInterval(timerRef.current);
                timerRef.current = setInterval(() => {
                    currentStep++;
                    setProgress((currentStep / steps) * 100);
                    if (currentStep >= steps) {
                        onTimerEnd();
                    }
                }, intervalTime);
            }
            
            return () => clearInterval(timerRef.current);
        }, [currentStoryContent, isPaused, onTimerEnd, videoRef]);

        return { progress, isPaused, setIsPaused };
    };

    export const useStoryInteractions = (storyContainerRef, onPrev, onNext, onTogglePause, onClose, videoRef, isPaused) => {
        
        const handleTap = useCallback((event) => {
            if (!storyContainerRef.current) return;
            const rect = storyContainerRef.current.getBoundingClientRect();
            const tapX = event.clientX - rect.left;

            const tapY = event.clientY - rect.top;
            if (tapY > rect.height * 0.85 && tapY < rect.height) { // Ignore taps on bottom 15% (input area)
                 event.stopPropagation();
                 return;
            }

            if (tapX < rect.width / 3) { 
                onPrev();
            } else if (tapX > rect.width * 2 / 3) { 
                onNext();
            } else { 
                 onTogglePause();
            }
        }, [storyContainerRef, onPrev, onNext, onTogglePause]);
        
        const handleInteractionStart = useCallback(() => { 
            onTogglePause(true); 
            if (videoRef && videoRef.current && videoRef.current.pause) videoRef.current.pause();
        }, [onTogglePause, videoRef]);

        const handleInteractionEnd = useCallback(() => { 
            onTogglePause(false); 
            if (videoRef && videoRef.current && videoRef.current.play && !isPaused) videoRef.current.play().catch(err => {});
        }, [onTogglePause, videoRef, isPaused]);

        const handleDragEnd = useCallback((event, info) => {
            if (info.offset.y > 100 && Math.abs(info.offset.x) < 50) { 
                onClose();
            }
        }, [onClose]);
        
        return { handleTap, handleInteractionStart, handleInteractionEnd, handleDragEnd };
    };