import React from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Wallet } from 'lucide-react';

    const MediaPaymentModal = ({ isOpen, onOpenChange, mediaToUnlock, currentUserWalletBalance, onConfirm }) => {
      if (!mediaToUnlock) return null;

      const priceToPay = mediaToUnlock.isReplay ? mediaToUnlock.originalPrice / 2 : mediaToUnlock.price;

      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white p-0 max-w-sm w-[90vw] rounded-xl">
            <DialogHeader className="p-4">
              <DialogTitle className="text-lg text-gradient-heresse">Débloquer le média {mediaToUnlock.isReplay ? "(Replay)" : ""}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Ce média est privé. Pour le voir, vous devez payer {priceToPay.toFixed(2)}€.
                Votre solde: {currentUserWalletBalance.toFixed(2)}€.
              </DialogDescription>
            </DialogHeader>
            <div className="p-4">
              <img className="w-full h-64 object-cover rounded-lg blur-xl opacity-50" alt="Aperçu flouté" src={mediaToUnlock.photoUrl} />
            </div>
            <DialogFooter className="p-4 border-t border-slate-700">
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white">Annuler</Button>
              <Button onClick={onConfirm} disabled={currentUserWalletBalance < priceToPay} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white">
                <Wallet size={16} className="mr-2" /> Payer {priceToPay.toFixed(2)}€ et Voir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default MediaPaymentModal;