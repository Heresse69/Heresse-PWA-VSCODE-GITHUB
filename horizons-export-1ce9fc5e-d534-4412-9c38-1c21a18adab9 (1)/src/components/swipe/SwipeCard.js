import React from 'react';
import { addMatch } from '../../data/mockChatData';

const SwipeCard = ({ user, onSwipe }) => {
  
  const handleSwipeRight = () => {
    // Ajouter le match quand on swipe à droite
    addMatch(user);
    onSwipe && onSwipe('right', user);
    console.log('Match ajouté:', user.name);
  };

  const handleSwipeLeft = () => {
    onSwipe && onSwipe('left', user);
  };

  return (
    <div className="swipe-card">
      <img src={user.avatar} alt={user.name} />
      <div className="card-info">
        <h3>{user.name}, {user.age}</h3>
        <p>{user.distance} km</p>
      </div>
      <div className="card-actions">
        <button onClick={handleSwipeLeft} className="reject-btn">❌</button>
        <button onClick={handleSwipeRight} className="like-btn">💕</button>
      </div>
    </div>
  );
};

export default SwipeCard;
