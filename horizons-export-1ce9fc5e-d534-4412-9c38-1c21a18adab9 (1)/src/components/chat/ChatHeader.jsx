import React from 'react';
    import { Link } from 'react-router-dom';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { ChevronLeft, Video } from 'lucide-react';

    const ChatHeader = ({ currentChat, onBack, onStartLiveCall }) => {
      if (!currentChat) return null;

      return (
        <header className="p-3 flex items-center space-x-3 bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-300 hover:text-white">
            <ChevronLeft size={28} />
          </Button>
          <Link to={`/profile/${currentChat.id}`} className="flex items-center space-x-2">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src={currentChat.avatarImage} alt={currentChat.name} />
              <AvatarFallback className="bg-primary text-white">{currentChat.name.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-white">{currentChat.name}</h3>
              <p className={`text-xs ${currentChat.online ? 'text-green-400' : 'text-gray-400'}`}>
                {currentChat.online ? 'En ligne' : 'Hors ligne'}
              </p>
            </div>
          </Link>
          <div className="flex-grow"></div>
          <Button variant="ghost" size="icon" onClick={onStartLiveCall} className="text-primary hover:text-primary-hover">
            <Video size={22} />
          </Button>
        </header>
      );
    };

    export default ChatHeader;