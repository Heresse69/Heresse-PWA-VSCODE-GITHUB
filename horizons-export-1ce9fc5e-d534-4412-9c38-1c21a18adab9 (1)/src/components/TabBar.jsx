import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, MessageSquare, Lock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const TabBar = () => {
  const location = useLocation();
  
  const tabs = [
    { path: '/', icon: Home, label: 'Découvrir' },
    { path: '/matches', icon: Heart, label: 'Matchs' },
    { path: '/chat', icon: MessageSquare, label: 'Messages' },
    { path: '/galleries', icon: Lock, label: 'Galeries' },
    { path: '/profile', icon: User, label: 'Profil' }
  ];

  return (
    <nav 
  className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md py-2 px-4 border-t border-border shadow-2xl max-w-md mx-auto z-50 pwa-safe-bottom"
  style={{ backgroundColor: 'red', minHeight: '70px' }}
>
      <div className="flex justify-around items-center">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-colors min-w-[60px]",
                isActive 
                  ? "text-primary" 
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default TabBar;