import React from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ 
  title = "Heresse", 
  showBack = false, 
  showMenu = false, 
  onMenuClick,
  className = "" 
}) => {
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Bouton retour */}
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-300" />
          </button>
        )}
        
        {/* Titre */}
        <h1 className="text-xl font-bold text-white flex-1 text-center">
          {title}
        </h1>
        
        {/* Menu */}
        {showMenu && (
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <MoreVertical size={24} className="text-gray-300" />
          </button>
        )}
        
        {/* Spacer si pas de menu */}
        {!showMenu && !showBack && <div className="w-10" />}
      </div>
    </header>
  );
};

export default Header;