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
    import { CreditCard, Zap, XCircle } from 'lucide-react';

    const MediaPaymentModal = ({ isOpen, onOpenChange, mediaToUnlock, currentUserWalletBalance, onConfirm }) => {
      if (!mediaToUnlock) return null;

      const price = mediaToUnlock.isReplay ? mediaToUnlock.originalPrice / 2 : mediaToUnlock.price;
      const canAfford = currentUserWalletBalance >= price;

      return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
          <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center text-xl">
                <Zap size={24} className="mr-2 text-primary" />
                {mediaToUnlock.isReplay ? 'Revoir ce Média' : 'Débloquer ce Média'}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400 pt-2">
                Pour {mediaToUnlock.isReplay ? 'revoir' : 'voir'} ce média envoyé par {mediaToUnlock.senderName || mediaToUnlock.sender}, vous devez payer {price.toFixed(2)}€.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="my-4 p-4 bg-slate-700/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Prix du média :</span>
                <span className="font-semibold text-primary">{price.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Votre solde actuel :</span>
                <span className={`font-semibold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>{currentUserWalletBalance.toFixed(2)}€</span>
              </div>
              {!canAfford && (
                <p className="text-xs text-red-400 mt-2 text-center">
                  Solde insuffisant. Veuillez recharger votre portefeuille.
                </p>
              )}
            </div>

            <AlertDialogFooter className="mt-2">
              <AlertDialogCancel asChild>
                <Button variant="outline" className="bg-slate-600 hover:bg-slate-500 border-slate-500 text-white">
                  <XCircle size={18} className="mr-2" /> Annuler
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button 
                  onClick={onConfirm} 
                  disabled={!canAfford} 
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <CreditCard size={18} className="mr-2" />Payer {price.toFixed(2)}€
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    };

    export default MediaPaymentModal;