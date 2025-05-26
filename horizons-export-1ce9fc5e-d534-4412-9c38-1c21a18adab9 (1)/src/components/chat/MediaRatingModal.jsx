import React from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import StarRating from '@/components/StarRating';

    const MediaRatingModal = ({ isOpen, onOpenChange, currentRating, onRatingChange, onSubmit }) => {
      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm w-[90vw]">
            <DialogHeader>
              <DialogTitle className="text-gradient-heresse">Noter le média</DialogTitle>
              <DialogDescription className="text-gray-400">Donnez une note au média que vous venez de voir.</DialogDescription>
            </DialogHeader>
            <div className="py-6 flex justify-center">
              <StarRating currentRating={currentRating} onRatingChange={onRatingChange} />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Plus tard</Button>
              <Button onClick={() => onSubmit(currentRating)} className="bg-primary hover:bg-primary-hover">Soumettre la note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default MediaRatingModal;