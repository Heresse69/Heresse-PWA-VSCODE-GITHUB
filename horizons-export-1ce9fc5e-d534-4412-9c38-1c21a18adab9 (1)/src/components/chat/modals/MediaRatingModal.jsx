import React from 'react';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from '@/components/ui/alert-dialog';
    import { Button } from '@/components/ui/button';
    import { Star, XCircle, CheckCircle } from 'lucide-react';

    const MediaRatingModal = ({ isOpen, onOpenChange, currentRating, onRatingChange, onSubmit }) => {
      return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
          <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center text-xl">
                <Star size={24} className="mr-2 text-yellow-400" />
                Noter ce Média
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400 pt-2">
                Votre avis est important ! Veuillez attribuer une note à ce média.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="my-6 flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="icon"
                  onClick={() => onRatingChange(star)}
                  className={`h-12 w-12 transition-all duration-150 ease-in-out transform hover:scale-110 ${currentRating >= star ? 'text-yellow-400' : 'text-slate-500 hover:text-yellow-300'}`}
                >
                  <Star fill={currentRating >= star ? "currentColor" : "none"} size={36} />
                </Button>
              ))}
            </div>

            <AlertDialogFooter className="mt-2">
              <AlertDialogCancel asChild>
                 <Button variant="outline" className="bg-slate-600 hover:bg-slate-500 border-slate-500 text-white">
                    <XCircle size={18} className="mr-2" /> Plus tard
                 </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button 
                  onClick={() => onSubmit(currentRating)} 
                  disabled={currentRating === 0}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle size={18} className="mr-2" />Valider la Note
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    };

    export default MediaRatingModal;