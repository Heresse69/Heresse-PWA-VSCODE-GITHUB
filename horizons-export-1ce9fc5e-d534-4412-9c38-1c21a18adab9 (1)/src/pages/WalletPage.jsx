import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Wallet, CreditCard, ChevronLeft, Info, Percent, DollarSign, X } from 'lucide-react';
    import { useUser } from '@/contexts/UserContext';
    import { cn } from '@/lib/utils';

    const WalletPage = () => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const { currentUser, updateWalletBalance } = useUser();
      const [rechargeAmount, setRechargeAmount] = useState(20); // Default recharge amount
      const [withdrawAmount, setWithdrawAmount] = useState('');
      const [showWithdrawModal, setShowWithdrawModal] = useState(false);
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

      const handleWithdraw = () => {
        const amount = parseFloat(withdrawAmount);
        if (!amount || amount < 20) {
          toast({ title: "Montant invalide", description: "Le montant minimum de retrait est de 20€.", variant: "destructive" });
          return;
        }
        if (amount > currentUser.walletBalance) {
          toast({ title: "Solde insuffisant", description: "Le montant demandé dépasse votre solde actuel.", variant: "destructive" });
          return;
        }
        // Simulate withdrawal process
        toast({
          title: "Demande de retrait en cours...",
          description: `Traitement de votre demande de retrait de ${amount.toFixed(2)}€.`,
        });
        setTimeout(() => {
          updateWalletBalance(-amount); // Subtract amount from balance
          setWithdrawAmount('');
          setShowWithdrawModal(false);
          toast({
            title: "Retrait effectué!",
            description: `${amount.toFixed(2)}€ ont été retirés de votre portefeuille.`,
            className: "bg-blue-500 text-white border-blue-600"
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

          {/* Bandeau de retrait des fonds */}
          <Button 
            onClick={() => setShowWithdrawModal(true)} 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 text-base py-2.5 rounded-full shadow-lg h-auto"
          >
            <DollarSign size={18} className="mr-2"/> Retirer des fonds
          </Button>

          <div className="text-center mt-4">
            <Button variant="link" onClick={() => navigate(-1)} className="text-gray-300 hover:text-white text-xs h-auto">
              <ChevronLeft size={16} className="mr-0.5" /> Retour
            </Button>
          </div>

          {/* Modal de retrait avec transparence */}
          <AnimatePresence>
            {showWithdrawModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowWithdrawModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-slate-800/95 backdrop-blur-md border border-slate-600 rounded-xl p-6 w-full max-w-sm mx-auto shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Retirer des fonds</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowWithdrawModal(false)}
                      className="h-8 w-8 text-gray-400 hover:text-white"
                    >
                      <X size={18} />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="withdrawAmount" className="text-gray-300 text-sm mb-2 block">
                        Montant à retirer (min. 20€)
                      </Label>
                      <Input 
                        id="withdrawAmount" 
                        type="number" 
                        value={withdrawAmount} 
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        min="20"
                        max={currentUser.walletBalance}
                        placeholder="Ex: 50"
                        className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Solde disponible: {currentUser.walletBalance.toFixed(2)}€
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowWithdrawModal(false)}
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleWithdraw} 
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90"
                        disabled={!withdrawAmount || parseFloat(withdrawAmount) < 20 || parseFloat(withdrawAmount) > currentUser.walletBalance}
                      >
                        Confirmer
                      </Button>
                    </div>
                    
                    <p className="text-center text-xs text-gray-400">
                      Les retraits sont traités sous 2-3 jours ouvrés.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    };

    export default WalletPage;