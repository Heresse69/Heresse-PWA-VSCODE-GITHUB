import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { motion } from 'framer-motion';
    import { ShieldCheck, EyeOff, Zap, ChevronLeft, CheckCircle } from 'lucide-react';
    import { useUser } from '@/contexts/UserContext';
    import { useToast } from '@/components/ui/use-toast';

    const PremiumCard = ({ icon: Icon, title, description, price, currentPlan, onSelectPlan, planKey, isActive, features = [] }) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`bg-slate-800/70 p-6 rounded-xl shadow-xl border-2 ${isActive ? 'border-primary' : 'border-transparent'} flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center mb-3">
            <Icon size={32} className={`mr-3 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
            <h3 className="text-2xl font-bold text-white">{title}</h3>
          </div>
          <p className="text-gray-300 text-sm mb-4">{description}</p>
          <ul className="space-y-1.5 text-xs text-gray-300 mb-6">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <CheckCircle size={14} className="text-green-400 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center">
          <p className="text-3xl font-extrabold text-gradient-heresse mb-1">{price}</p>
          <p className="text-xs text-gray-400 mb-4">par mois</p>
          <Button 
            onClick={() => onSelectPlan(planKey, price)} 
            className={`w-full ${isActive ? 'bg-primary/80 hover:bg-primary' : 'bg-gradient-to-r from-pink-500 to-red-600 hover:opacity-90'}`}
            disabled={isActive}
          >
            {isActive ? 'Plan Actuel' : 'Choisir ce plan'}
          </Button>
        </div>
      </motion.div>
    );

    const PremiumModesPage = () => {
      const navigate = useNavigate();
      const { currentUser, updatePremiumStatus, updateSubscription } = useUser();
      const { toast } = useToast();

      const handleToggleMode = (mode) => {
        const newValue = !currentUser.premiumStatus[mode];
        if (newValue && !currentUser.premiumStatus.subscriptionType) {
            toast({title: "Abonnement Requis", description: `Vous devez avoir un abonnement pour activer le ${mode === 'safeMode' ? 'Mode Safe' : 'Mode Incognito'}.`, variant: "destructive"});
            return;
        }
        updatePremiumStatus(mode, newValue);
        toast({ title: `${mode === 'safeMode' ? 'Mode Safe' : 'Mode Incognito'} ${newValue ? 'activé' : 'désactivé'}` });
      };

      const handleSelectSubscription = (planKey, price) => {
        // Simulate payment
        toast({title: "Traitement...", description: `Souscription au plan ${planKey} pour ${price}/mois.`});
        setTimeout(() => {
            updateSubscription(planKey);
            toast({title: "Abonnement Activé!", description: `Vous êtes maintenant abonné au plan ${planKey}.`});
        }, 1500);
      };

      return (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="p-4 space-y-8 bg-gradient-to-b from-background to-slate-900 text-white min-h-full"
        >
          <div className="text-center">
            <Zap size={56} className="mx-auto mb-3 text-primary" />
            <h2 className="text-3xl font-bold text-white">Passez à Premium</h2>
            <p className="text-gray-400">Débloquez des fonctionnalités exclusives pour une meilleure expérience.</p>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-lg bg-slate-800/70 flex justify-between items-center shadow-md ${currentUser.premiumStatus.safeMode ? 'border border-green-500/50' : ''}`}>
              <div>
                <h4 className="font-semibold text-lg text-white flex items-center"><ShieldCheck size={20} className="mr-2 text-green-400"/>Mode Safe</h4>
                <p className="text-xs text-gray-400">Cachez votre profil à certains utilisateurs (simulation).</p>
              </div>
              <Button onClick={() => handleToggleMode('safeMode')} variant={currentUser.premiumStatus.safeMode ? "default" : "outline"} className={currentUser.premiumStatus.safeMode ? "bg-green-500 hover:bg-green-600" : "border-primary/50 text-primary hover:bg-primary/10"}>
                {currentUser.premiumStatus.safeMode ? 'Activé' : 'Activer'}
              </Button>
            </div>
            <div className={`p-4 rounded-lg bg-slate-800/70 flex justify-between items-center shadow-md ${currentUser.premiumStatus.incognitoMode ? 'border border-purple-500/50' : ''}`}>
              <div>
                <h4 className="font-semibold text-lg text-white flex items-center"><EyeOff size={20} className="mr-2 text-purple-400"/>Mode Incognito</h4>
                <p className="text-xs text-gray-400">Apparaissez uniquement aux profils que vous avez likés.</p>
              </div>
              <Button onClick={() => handleToggleMode('incognitoMode')} variant={currentUser.premiumStatus.incognitoMode ? "default" : "outline"} className={currentUser.premiumStatus.incognitoMode ? "bg-purple-500 hover:bg-purple-600" : "border-primary/50 text-primary hover:bg-primary/10"}>
                {currentUser.premiumStatus.incognitoMode ? 'Activé' : 'Activer'}
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <PremiumCard 
              icon={ShieldCheck}
              title="Heresse Basic"
              description="L'essentiel pour booster votre expérience."
              price="2,90€"
              currentPlan={currentUser.premiumStatus.subscriptionType}
              onSelectPlan={handleSelectSubscription}
              planKey="basic_monthly"
              isActive={currentUser.premiumStatus.subscriptionType === 'basic_monthly'}
              features={["Mode Incognito", "Filtres avancés", "Support prioritaire (simulé)"]}
            />
            <PremiumCard 
              icon={Zap}
              title="Heresse Pro"
              description="L'expérience ultime pour maximiser vos rencontres et revenus."
              price="9,90€"
              currentPlan={currentUser.premiumStatus.subscriptionType}
              onSelectPlan={handleSelectSubscription}
              planKey="pro_monthly"
              isActive={currentUser.premiumStatus.subscriptionType === 'pro_monthly'}
              features={["Tous les avantages Basic", "Mode Safe", "Boost de profil hebdomadaire (simulé)", "Statistiques détaillées (simulé)"]}
            />
          </div>
          
          <div className="text-center mt-8">
            <Button variant="link" onClick={() => navigate(-1)} className="text-gray-300 hover:text-white">
              <ChevronLeft size={18} className="mr-1" /> Retour
            </Button>
          </div>
        </motion.div>
      );
    };

    export default PremiumModesPage;