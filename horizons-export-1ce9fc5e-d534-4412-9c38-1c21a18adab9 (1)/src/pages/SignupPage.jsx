import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Checkbox } from '@/components/ui/checkbox';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Mail, Lock, CalendarDays, Phone } from 'lucide-react';

    const SignupPage = ({ onSignup }) => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [birthDate, setBirthDate] = useState('');
      const [phoneNumber, setPhoneNumber] = useState('');
      const [agreedToTerms, setAgreedToTerms] = useState(false);
      const { toast } = useToast();
      
      
      const isAgeVerified = () => {
        if (!birthDate) return false;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age >= 18;
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas.', variant: 'destructive' });
          return;
        }
        if (!agreedToTerms) {
          toast({ title: 'Erreur', description: 'Vous devez accepter les termes et conditions.', variant: 'destructive' });
          return;
        }
        if (!isAgeVerified()) {
            toast({ title: 'Erreur', description: 'Vous devez avoir au moins 18 ans pour vous inscrire.', variant: 'destructive' });
            return;
        }
        
        setTimeout(() => {
          toast({ title: 'Inscription Initiée!', description: 'Veuillez compléter la vérification KYC.' });
          onSignup(); 
        }, 1000);
      };

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-700 via-red-600 to-yellow-500 p-4 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: -30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="w-full max-w-xs bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl p-5 space-y-4"
          >
            <div className="text-center">
              <img  src="https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/5138cf96bf2e5ed01f731b2cf8cec2c1.png" alt="Heresse Logo" className="w-16 h-16 mx-auto mb-2 rounded-full shadow-md border-white/30 border" />
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Créez votre compte</h2>
              <p className="mt-1 text-center text-[11px] text-gray-200"> Déjà un compte?{' '} <Link to="/login" className="font-medium text-pink-300 hover:text-pink-200"> Connectez-vous </Link> </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div> <Label htmlFor="email-signup" className="block text-[11px] font-medium text-gray-200">Adresse e-mail</Label> <div className="mt-0.5 relative"> <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" /> <Input id="email-signup" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@exemple.com" className="bg-white/20 text-white pl-8 text-xs h-9"/> </div> </div>
              <div> <Label htmlFor="phone-signup" className="block text-[11px] font-medium text-gray-200">Numéro de téléphone (Optionnel)</Label> <div className="mt-0.5 relative"> <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" /> <Input id="phone-signup" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+33 6 12 34 56 78" className="bg-white/20 text-white pl-8 text-xs h-9"/> </div> </div>
              <div> <Label htmlFor="birthdate-signup" className="block text-[11px] font-medium text-gray-200">Date de naissance</Label> <div className="mt-0.5 relative"> <CalendarDays className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" /> <Input id="birthdate-signup" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required className="bg-white/20 text-white pl-8 appearance-none text-xs h-9"/> </div> <p className="mt-0.5 text-[10px] text-gray-300">Vous devez avoir au moins 18 ans.</p> </div>
              <div> <Label htmlFor="password-signup" className="block text-[11px] font-medium text-gray-200">Mot de passe</Label> <div className="mt-0.5 relative"> <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" /> <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="bg-white/20 text-white pl-8 text-xs h-9"/> </div> </div>
              <div> <Label htmlFor="confirm-password-signup" className="block text-[11px] font-medium text-gray-200">Confirmer le mot de passe</Label> <div className="mt-0.5 relative"> <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" /> <Input id="confirm-password-signup" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" className="bg-white/20 text-white pl-8 text-xs h-9"/> </div> </div>
              <div className="flex items-center space-x-1.5 pt-1"> <Checkbox id="terms-signup" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} className="border-gray-400 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500 h-3.5 w-3.5"/> <Label htmlFor="terms-signup" className="text-[11px] text-gray-200"> J'accepte les <a href="#" className="underline text-pink-300 hover:text-pink-200">termes et conditions</a>. </Label> </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-1"> <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-sm py-2 rounded-full"> Suivant </Button> </motion.div>
            </form>
          </motion.div>
        </div>
      );
    };

    export default SignupPage;