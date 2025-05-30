import React, { useState, useEffect } from 'react';
import { getMatches, startConversation } from '../data/mockChatData';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    setMatches(getMatches());
    
    const interval = setInterval(() => {
      setMatches([...getMatches()]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartConversation = (matchId) => {
    startConversation(matchId);
    console.log('Conversation démarrée avec le match:', matchId);
  };

  return (
    <div className="matches-page">
      <h1>Mes Matchs</h1>
      <div className="matches-container">
        {matches.length === 0 ? (
          <p>Aucun match pour le moment</p>
        ) : (
          matches.map(match => (
            <div key={match.id} className="match-card">
              <img src={match.avatar} alt={match.name} />
              <div className="match-info">
                <h3>{match.name}</h3>
                <p>{match.age} ans • {match.distance} km</p>
                <p>Matché le {new Date(match.matchedAt).toLocaleDateString()}</p>
              </div>
              {!match.hasConversation && (
                <button 
                  onClick={() => handleStartConversation(match.id)}
                  className="start-chat-btn"
                >
                  Démarrer la conversation
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MatchesPage;
