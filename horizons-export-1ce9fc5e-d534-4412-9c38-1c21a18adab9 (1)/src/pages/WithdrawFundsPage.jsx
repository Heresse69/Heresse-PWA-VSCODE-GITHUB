import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, CreditCard, DollarSign, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const PaymentMethodCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  selected, 
  fees,
  processingTime 
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`
      relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
      ${selected 
        ? 'border-primary bg-primary/10 shadow-lg' 
        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
      }
    `}
    onClick={onClick}
  >
    <div className="flex items-start space-x-3">
      <div className={`
        p-2 rounded-lg 
        ${selected ? 'bg-primary text-white' : 'bg-slate-700 text-gray-300'}
      `}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
        <div className="flex justify-between items-center mt-2 text-xs">
          <span className="text-gray-500">Frais: {fees}</span>
          <span className="text-gray-500">{processingTime}</span>
        </div>
      </div>
    </div>
    {selected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-2 right-2"
      >
        <CheckCircle size={20} className="text-primary" />
      </motion.div>
    )}
  </motion.div>
);

const WithdrawFundsPage = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState('');
  const [accountInfo, setAccountInfo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const paymentMethods = [
    {
      id: 'stripe',
      title: 'Stripe',
      description: 'Retrait direct sur carte bancaire',
      icon: CreditCard,
      fees: '2.9% + 0.30€',
      processingTime: '1-3 jours',
      placeholder: 'Numéro de carte (4 derniers chiffres)'
    },
    {
      id: 'paypal',
      title: 'PayPal',
      description: 'Retrait vers votre compte PayPal',
      icon: DollarSign,
      fees: '2.5%',
      processingTime: '1-2 jours',
      placeholder: 'Adresse email PayPal'
    },
    {
      id: 'bank',
      title: 'Virement bancaire',
      description: 'Virement SEPA vers votre compte',
      icon: Building2,
      fees: '1€',
      processingTime: '3-5 jours',
      placeholder: 'IBAN (FR76...)'
    }
  ];

  const availableBalance = currentUser?.wallet?.balance || 0;
  const minWithdraw = 10;

  const handleWithdraw = async () => {
    if (!selectedMethod) {
      toast({
        title: "Méthode requise",
        description: "Veuillez sélectionner une méthode de retrait.",
        variant: "destructive"
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < minWithdraw) {
      toast({
        title: "Montant invalide",
        description: `Le montant minimum de retrait est de ${minWithdraw}€.`,
        variant: "destructive"
      });
      return;
    }

    if (withdrawAmount > availableBalance) {
      toast({
        title: "Solde insuffisant",
        description: "Vous ne pouvez pas retirer plus que votre solde disponible.",
        variant: "destructive"
      });
      return;
    }

    if (!accountInfo.trim()) {
      toast({
        title: "Informations de compte requises",
        description: "Veuillez renseigner vos informations de compte.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulation d'une demande de retrait
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Demande de retrait envoyée",
        description: `Votre demande de retrait de ${withdrawAmount}€ a été envoyée. Vous recevrez une confirmation par email.`,
      });
      navigate('/profile');
    }, 2000);
  };

  const selectedMethodData = paymentMethods.find(method => method.id === selectedMethod);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-900 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
            className="mr-3 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold">Retirer des fonds</h1>
        </div>

        {/* Solde disponible */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Solde disponible</p>
              <p className="text-2xl font-bold text-primary">{availableBalance.toFixed(2)}€</p>
              <p className="text-xs text-gray-500 mt-1">
                Montant minimum: {minWithdraw}€
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Montant à retirer */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Montant à retirer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-8 bg-slate-700 border-slate-600 text-white"
                step="0.01"
                min={minWithdraw}
                max={availableBalance}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                €
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              {[25, 50, 100].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(Math.min(preset, availableBalance).toString())}
                  className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
                  disabled={preset > availableBalance}
                >
                  {preset}€
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Méthodes de paiement */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Méthode de retrait</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                title={method.title}
                description={method.description}
                icon={method.icon}
                onClick={() => setSelectedMethod(method.id)}
                selected={selectedMethod === method.id}
                fees={method.fees}
                processingTime={method.processingTime}
              />
            ))}
          </CardContent>
        </Card>

        {/* Informations de compte */}
        <AnimatePresence>
          {selectedMethodData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="bg-slate-800/50 border-slate-700 mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Informations de compte</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder={selectedMethodData.placeholder}
                    value={accountInfo}
                    onChange={(e) => setAccountInfo(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <div className="flex items-start space-x-2 mt-3 p-3 bg-blue-900/20 rounded-lg">
                    <AlertCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-300">
                      Assurez-vous que les informations de compte sont correctes. 
                      Les erreurs peuvent entraîner des retards ou des échecs de traitement.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bouton de retrait */}
        <Button
          onClick={handleWithdraw}
          disabled={isProcessing || !selectedMethod || !amount || !accountInfo}
          className="w-full bg-primary hover:bg-primary-hover text-white py-3 text-lg font-semibold"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Traitement en cours...</span>
            </div>
          ) : (
            `Retirer ${amount || '0.00'}€`
          )}
        </Button>

        {/* Note légale */}
        <p className="text-xs text-gray-500 text-center mt-4 px-4">
          Les retraits sont traités selon les délais indiqués. Des frais peuvent s'appliquer selon la méthode choisie.
        </p>
      </motion.div>
    </div>
  );
};

export default WithdrawFundsPage;
