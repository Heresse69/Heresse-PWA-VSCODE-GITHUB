import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
    import { Send, Paperclip, Camera, Gift } from 'lucide-react';

    const ChatInputArea = ({ newMessage, setNewMessage, onSendMessage, onInitiateSendMedia, onRequestMedia }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      
      const handleSubmit = (e) => {
        e.preventDefault();
        onSendMessage(newMessage);
        setNewMessage('');
      };

      return (
        <div className="p-3 bg-background/80 backdrop-blur-sm border-t border-border flex items-center space-x-1 sticky bottom-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary hover:text-primary-hover">
                <Paperclip size={22} />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-gradient-heresse">Options de Média</DialogTitle>
                <DialogDescription>Que souhaitez-vous faire ?</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-4">
                <Button onClick={() => { onInitiateSendMedia(); setIsDialogOpen(false); }} className="w-full justify-start bg-slate-700 hover:bg-slate-600">
                  <Camera size={18} className="mr-2 text-primary" />Envoyer un média
                </Button>
                <Button onClick={() => { onRequestMedia(); setIsDialogOpen(false); }} className="w-full justify-start bg-slate-700 hover:bg-slate-600">
                  <Gift size={18} className="mr-2 text-primary" />Demander un média
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <form onSubmit={handleSubmit} className="flex-grow flex items-center space-x-1">
            <Input
              type="text"
              placeholder="Votre message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-primary focus:border-primary rounded-full px-4 py-2.5"
            />
            <Button type="submit" size="icon" className="bg-primary hover:bg-primary-hover rounded-full w-11 h-11">
              <Send size={20} />
            </Button>
          </form>
        </div>
      );
    };

    export default ChatInputArea;