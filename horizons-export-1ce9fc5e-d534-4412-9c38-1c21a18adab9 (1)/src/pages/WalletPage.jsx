import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Wallet, CreditCard, ChevronLeft, Info, Percent } from 'lucide-react';
    import { useUser } from '@/contexts/UserContext';
    import { cn } from '@/lib/utils';

    const WalletPage = () => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const { currentUser, updateWalletBalance } = useUser();
      const [rechargeAmount, setRechargeAmount] = useState(20); // Default recharge amount
      const VAT_RATE = 0.20; // 20% TVA

      const quickRechargeAmounts = [5, 10, 20, 50, 100];
      const totalAmountWithVAT = rechargeAmount * (1 + VAT_RATE);

      const handleRecharge = () => {
        if (rechargeAmount <= 0) {
          toast({ title: "Montant invalide", description: "Veuillez entrer un montant positif.", variant: "destructive" });
          return;
        }
        // Simulate Stripe payment process
        toast({
          title: "Redirection vers le paiement...",
          description: `Simulation du processus de paiement pour ${totalAmountWithVAT.toFixed(2)}€ (TVA incluse).`,
        });
        setTimeout(() => {
          updateWalletBalance(rechargeAmount); // Add base amount to balance
          toast({
            title: "Portefeuille rechargé!",
            description: `${rechargeAmount.toFixed(2)}€ (HT) ont été ajoutés à votre portefeuille.`,
            className: "bg-green-500 text-white border-green-600"
          });
        }, 2000);
      };

      return (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="p-3 space-y-6 bg-gradient-to-b from-background to-slate-900 text-white min-h-full overflow-y-auto no-scrollbar"
        >
          <div className="text-center pt-2">
            <Wallet size={48} className="mx-auto mb-3 text-primary" />
            <h2 className="text-2xl font-bold text-white">Mon Portefeuille</h2>
            <p className="text-4xl font-extrabold text-gradient-heresse mt-1">
              {currentUser.walletBalance.toFixed(2)} €
            </p>
            <p className="text-xs text-gray-400">Solde actuel</p>
          </div>

          <div className="bg-slate-800/70 p-4 rounded-xl shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-center text-white">Recharger votre solde</h3>
            
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {quickRechargeAmounts.map(amount => (
                <Button 
                  key={amount}
                  variant={rechargeAmount === amount ? "default" : "outline"}
                  onClick={() => setRechargeAmount(amount)}
                  className={cn(
                    "py-2 text-sm border-primary/50 text-primary hover:bg-primary/10 hover:text-primary-hover h-auto",
                    rechargeAmount === amount && "bg-primary text-primary-foreground hover:bg-primary-hover"
                  )}
                >
                  {amount}€
                </Button>
              ))}
            </div>

            <div>
              <Label htmlFor="customAmount" className="text-gray-300 text-xs mb-0.5 block">Ou montant personnalisé (HT)</Label>
              <Input 
                id="customAmount" 
                type="number" 
                value={rechargeAmount} 
                onChange={(e) => setRechargeAmount(parseFloat(e.target.value) || 0)}
                min="1"
                placeholder="Ex: 25"
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-primary focus:border-primary text-base py-2 h-10"
              />
            </div>
            
            <div className="text-xs text-gray-400 bg-slate-700/50 p-2.5 rounded-md space-y-0.5">
                <div className="flex justify-between"><span>Montant HT:</span> <span className="font-medium text-white">{rechargeAmount.toFixed(2)} €</span></div>
                <div className="flex justify-between"><span>TVA (20%):</span> <span className="font-medium text-white">{(rechargeAmount * VAT_RATE).toFixed(2)} €</span></div>
                <div className="flex justify-between font-bold text-sm border-t border-slate-600 pt-1 mt-1"><span>Total TTC:</span> <span className="text-primary">{totalAmountWithVAT.toFixed(2)} €</span></div>
            </div>
             <p className="text-[10px] text-gray-400 text-center flex items-center justify-center"><Info size={12} className="mr-1 text-primary shrink-0"/>Transactions sécurisées via Stripe (simulation).</p>


            <Button onClick={handleRecharge} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base py-2.5 rounded-full shadow-lg h-auto">
              <CreditCard size={18} className="mr-2"/> Payer {totalAmountWithVAT > 0 ? `${totalAmountWithVAT.toFixed(2)}€` : ''}
            </Button>
            <p className="text-center text-[10px] text-gray-400">Options de paiement simulées : CB, Stripe, Apple Pay, Google Pay.</p>
          </div>

          <div className="text-center mt-4">
            <Button variant="link" onClick={() => navigate(-1)} className="text-gray-300 hover:text-white text-xs h-auto">
              <ChevronLeft size={16} className="mr-0.5" /> Retour
            </Button>
          </div>
        </motion.div>
      );
    };

    export default WalletPage;