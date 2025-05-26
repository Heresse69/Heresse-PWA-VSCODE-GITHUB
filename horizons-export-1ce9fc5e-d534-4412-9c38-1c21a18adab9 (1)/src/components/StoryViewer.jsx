import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StoryViewer = ({ stories, onClose }) => {
  const navigate = useNavigate();
  const [currentStoryIdx, setCurrentStoryIdx] = useState(0);
  const [message, setMessage] = useState('');

  const handleNext = () => {
    if (currentStoryIdx < stories.length - 1) {
      setCurrentStoryIdx(currentStoryIdx + 1);
    } else {
      // Logic to move to the next user's story
      navigate('/next-user-story'); // Replace with actual user navigation logic
    }
  };

  const handlePrevious = () => {
    if (currentStoryIdx > 0) {
      setCurrentStoryIdx(currentStoryIdx - 1);
    } else {
      // Optionally handle going to the previous user's last story
      navigate('/previous-user-last-story'); // Replace with actual user navigation logic
    }
  };

  const handleLike = () => {
    // Logic to like the story and send notification
    console.log('Story liked');
    closeStoryViewer();
  };

  const handleMessageSend = () => {
    if(message.trim()) {
      // Send a message into the conversation
      console.log(`Message sent: ${message}`);
      setMessage('');
    }
    closeStoryViewer();
  };

  const closeStoryViewer = () => {
    // For slide to close logic, you can use additional touch event listeners
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-between">
      <motion.div 
        className="p-4 flex-grow"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onSwipe={() => closeStoryViewer()}
      >
        <img 
          src={stories[currentStoryIdx].image} 
          alt={stories[currentStoryIdx].user}
          className="w-full h-auto object-cover"
          onClick={(e) => e.clientX > window.innerWidth / 2 ? handleNext() : handlePrevious()}
        />
      </motion.div>
      <div className="p-4 bg-gray-800 flex justify-between items-center">
        <input
          type="text"
          placeholder="Reply..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow mr-2 p-2 bg-black text-white rounded"
        />
        <button onClick={handleLike} className="mr-2 text-white">❤ Like</button>
        <button onClick={handleMessageSend} className="text-white">Send</button>
      </div>
    </div>
  );
};

export default StoryViewer;