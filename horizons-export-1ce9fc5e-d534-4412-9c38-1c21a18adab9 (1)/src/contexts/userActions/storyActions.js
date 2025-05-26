export const addStoryLogic = (currentUser, setStories, setCurrentUser, storyData) => {
        const newStory = {
            ...storyData,
            id: `story_${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name.split(' ')[0], 
            timestamp: Date.now(),
            seen: false, 
        };
        setStories(prevStories => [newStory, ...prevStories.filter(s => s.userId !== currentUser.id || s.id !== newStory.id)].sort((a,b) => b.timestamp - a.timestamp));
        setCurrentUser(prevUser => ({
            ...prevUser,
            stories: [newStory, ...prevUser.stories.filter(s => s.userId !== currentUser.id || s.id !== newStory.id)].sort((a,b) => b.timestamp - a.timestamp)
        }));
    };

    export const markStoryAsSeenLogic = (setStories, setCurrentUser, storyId) => {
        setStories(prevStories => 
            prevStories.map(s => s.id === storyId ? { ...s, seen: true } : s)
        );
        setCurrentUser(prevUser => ({
            ...prevUser,
            stories: prevUser.stories.map(s => s.id === storyId ? { ...s, seen: true } : s)
        }));
    };