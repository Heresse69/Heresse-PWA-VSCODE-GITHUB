import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { motion } from 'framer-motion';
    import { Camera, Lock, TrendingUp } from 'lucide-react';

    const FeatureCard = ({ icon: Icon, title, description, delay }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-white/10 backdrop-blur-md p-3 rounded-xl shadow-lg text-center h-full flex flex-col justify-start items-center"
      >
        <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
        <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
        <p className="text-gray-200 text-[11px] leading-snug">{description}</p>
      </motion.div>
    );

    const LandingPage = () => {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-700 via-red-600 to-yellow-500 p-4 text-white overflow-hidden">
          <div className="w-full max-w-xs flex flex-col items-center justify-center flex-grow">
            <motion.header
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6"
            >
              <img  src="https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/5138cf96bf2e5ed01f731b2cf8cec2c1.png" alt="Heresse Logo" className="w-28 h-28 mx-auto mb-2 rounded-full shadow-lg border-2 border-white/50" />
              <h1 className="text-4xl font-extrabold tracking-tight text-shadow-lg">
                Heresse
              </h1>
              <p className="mt-1 text-sm text-gray-200 max-w-xs mx-auto text-shadow-sm">
                L'application de rencontre la plus sexy du web
              </p>
            </motion.header>

            <div className="grid grid-cols-3 gap-2 mb-6 w-full">
              <FeatureCard
                icon={Camera}
                title="Éphémère"
                description="Médias éphémères supprimés après ouverture"
                delay={0.2}
              />
              <FeatureCard
                icon={Lock}
                title="Privé"
                description="Galeries exclusives à votre prix."
                delay={0.4}
              />
              <FeatureCard
                icon={TrendingUp}
                title="Monétisé"
                description="Revenus via médias & lives."
                delay={0.6}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col gap-3 w-full"
            >
              <Button asChild className="w-full text-base py-2.5 bg-white text-pink-600 hover:bg-gray-100 shadow-xl rounded-full font-semibold">
                <Link to="/signup">Créer un compte</Link>
              </Button>
              <Button asChild variant="outline" className="w-full text-base py-2.5 text-white border-white hover:bg-white/10 shadow-xl rounded-full font-semibold">
                <Link to="/login">Se connecter</Link>
              </Button>
            </motion.div>
          </div>

          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="py-3 text-center text-gray-300 text-xs"
          >
            <p>&copy; {new Date().getFullYear()} Heresse. Tous droits réservés.</p>
          </motion.footer>
        </div>
      );
    };

    export default LandingPage;