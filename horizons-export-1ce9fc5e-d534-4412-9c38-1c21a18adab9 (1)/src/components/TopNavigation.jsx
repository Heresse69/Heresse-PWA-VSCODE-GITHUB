import React from 'react';
import { Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopNavigation = ({ showNotifications = true, showSettings = true }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">H</span>
        </div>
        <span className="text-xl font-bold text-white">Heresse</span>
      </div>
      
      {/* Actions */}
      <div className="flex items-center space-x-3">
        {showNotifications && (
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Bell size={20} className="text-white" />
          </button>
        )}
        
        {showSettings && (
          <Link 
            to="/settings" 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Settings size={20} className="text-white" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopNavigation;