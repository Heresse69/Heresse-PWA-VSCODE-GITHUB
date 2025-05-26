import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Mail, Lock, Phone } from 'lucide-react';
    import { authenticateUser, authenticateUserBySMS } from '@/utils/userDatabase';

    const LoginPage = ({ onLogin }) => {
      const [loginMethod, setLoginMethod] = useState('email'); 
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [phoneNumber, setPhoneNumber] = useState('');
      const [smsCode, setSmsCode] = useState('');
      const [smsSent, setSmsSent] = useState(false);
      const { toast } = useToast();
  const navigate = useNavigate();
      
      const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
          toast({ title: 'Erreur', description: 'Veuillez remplir tous les champs.', variant: 'destructive' });
          return;
        }

        // Authentifier l'utilisateur avec la base de données simulée
        const authResult = authenticateUser(email, password);
        
        if (authResult.success) {
          setTimeout(() => {
            toast({ title: 'Connexion réussie!', description: 'Bienvenue de retour!' });
            onLogin(authResult.user); // Passer les données utilisateur
          }, 1000);
        } else { 
          toast({ title: 'Erreur', description: authResult.error, variant: 'destructive' });
        }
      };

  const handleSmsSubmit = (e) => {
    e.preventDefault();
    if (!smsSent) {
      if (!phoneNumber) {
        toast({ title: 'Erreur', description: 'Veuillez entrer votre numéro de téléphone.', variant: 'destructive' });
        return;
      }
      
      // Vérifier si l'utilisateur existe avec ce numéro
      const authResult = authenticateUserBySMS(phoneNumber);
      
      if (authResult.success) {
        setSmsSent(true);
        toast({ title: 'Code SMS envoyé (simulation)', description: 'Un code a été envoyé à votre numéro.' });
      } else {
        toast({ title: 'Erreur', description: authResult.error, variant: 'destructive' });
      }
    } else {
      if (!smsCode || smsCode.length < 4) {
        toast({ title: 'Erreur', description: 'Veuillez entrer un code valide.', variant: 'destructive' });
        return;
      }
      
      // Récupérer les données utilisateur et se connecter
      const authResult = authenticateUserBySMS(phoneNumber);
      if (authResult.success) {
        setTimeout(() => {
          toast({ title: 'Connexion réussie!', description: 'Bienvenue de retour!' });
          onLogin(authResult.user);
        }, 1000);
      }
    }
    };

  const handleSignupNavigation = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-700 via-red-600 to-yellow-500 p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xs bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl p-5 space-y-5"
      >
        <div className="text-center">
          <img
            src="https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/5138cf96bf2e5ed01f731b2cf8cec2c1.png"
            alt="Heresse Logo"
            className="w-16 h-16 mx-auto mb-2 rounded-full shadow-md border-white/30 border"
          />
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Connectez-vous</h2>
          <p className="mt-1 text-center text-[11px] text-gray-200">
            Pas encore de compte?{' '}
            <Button variant="link" onClick={handleSignupNavigation} className="font-medium text-pink-300 hover:text-pink-200">
              Inscrivez-vous
            </Button>
          </p>
        </div>

        <div className="flex border border-white/20 rounded-full p-0.5 bg-black/10">
          <Button
            onClick={() => {
              setLoginMethod('email');
              setSmsSent(false);
            }}
            className={`flex-1 text-xs rounded-full py-1.5 h-auto ${loginMethod === 'email' ? 'bg-primary text-white shadow-md' : 'bg-transparent text-gray-300 hover:text-white'}`}
          >
            Email
          </Button>
          <Button
            onClick={() => {
              setLoginMethod('sms');
              setEmail('');
              setPassword('');
            }}
            className={`flex-1 text-xs rounded-full py-1.5 h-auto ${loginMethod === 'sms' ? 'bg-primary text-white shadow-md' : 'bg-transparent text-gray-300 hover:text-white'}`}
          >
            Téléphone
          </Button>
        </div>

        {loginMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <Label htmlFor="email-login" className="block text-[11px] font-medium text-gray-200">
                Adresse e-mail
              </Label>
              <div className="mt-0.5 relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  id="email-login"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="vous@exemple.com"
                  className="bg-white/20 text-white pl-8 text-xs h-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password-login" className="block text-[11px] font-medium text-gray-200">
                Mot de passe
              </Label>
              <div className="mt-0.5 relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  id="password-login"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="bg-white/20 text-white pl-8 text-xs h-9"
                />
              </div>
              <div className="text-right mt-1">
                <Link to="#" className="text-[10px] font-medium text-pink-300 hover:text-pink-200">
                  Mot de passe oublié?
                </Link>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-sm py-2 rounded-full"
              >
                Se connecter
              </Button>
            </motion.div>
          </form>
        )}

        {loginMethod === 'sms' && (
          <form onSubmit={handleSmsSubmit} className="space-y-3">
            <div>
              <Label htmlFor="phone-login" className="block text-[11px] font-medium text-gray-200">
                Numéro de téléphone
              </Label>
              <div className="mt-0.5 relative">
                <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  id="phone-login"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  placeholder="+33 6 12 34 56 78"
                  className="bg-white/20 text-white pl-8 text-xs h-9"
                  disabled={smsSent}
                />
              </div>
            </div>
            {smsSent && (
              <div>
                <Label htmlFor="sms-code-login" className="block text-[11px] font-medium text-gray-200">
                  Code SMS
                </Label>
                <div className="mt-0.5 relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <Input
                    id="sms-code-login"
                    type="text"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    required
                    placeholder="••••"
                    className="bg-white/20 text-white pl-8 text-xs h-9"
                  />
                </div>
              </div>
            )}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-sm py-2 rounded-full"
              >
                {smsSent ? 'Vérifier le code' : 'Envoyer le code'}
              </Button>
            </motion.div>
            {smsSent && (
              <Button variant="link" onClick={() => setSmsSent(false)} className="text-pink-300 hover:text-pink-200 text-xs p-0 h-auto w-full">
                Modifier numéro
              </Button>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
};

    export default LoginPage;