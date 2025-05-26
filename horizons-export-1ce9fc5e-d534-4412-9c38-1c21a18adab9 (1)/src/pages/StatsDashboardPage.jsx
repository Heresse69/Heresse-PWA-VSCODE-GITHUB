import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { motion } from 'framer-motion';
    import { BarChart3, DollarSign, Image as ImageIcon, TrendingUp, ChevronLeft, Users, Eye, Video, Clock } from 'lucide-react';
    import { useUser } from '@/contexts/UserContext';

    const StatCard = ({ icon: Icon, label, value, unit, colorClass, delay }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className={`bg-slate-800/70 p-4 rounded-xl shadow-lg flex items-center space-x-3 ${colorClass}`}
      >
        <div className={`p-2.5 rounded-full bg-white/10`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-xs text-gray-300">{label}</p>
          <p className="text-xl font-bold text-white">
            {value} <span className="text-base">{unit}</span>
          </p>
        </div>
      </motion.div>
    );

    const StatsDashboardPage = () => {
      const navigate = useNavigate();
      const { currentUser } = useUser();
      const { 
        photosSold = 0, 
        revenueGenerated = 0, 
        nextTierGoal = 10,
        livesCompleted = 0,
        liveRevenueGenerated = 0,
        avgLiveDurationMinutes = 0 
      } = currentUser.stats || {};


      return (
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="p-3 space-y-4 bg-gradient-to-b from-background to-slate-900 text-white min-h-full"
        >
          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={DollarSign} label="Revenu Total (Photos)" value={revenueGenerated.toFixed(2)} unit="€" colorClass="text-green-400" delay={0.1} />
            <StatCard icon={ImageIcon} label="Photos Achetées" value={photosSold} unit="photos" colorClass="text-blue-400" delay={0.2} />
            <StatCard icon={Video} label="Lives Réalisés" value={livesCompleted} unit="lives" colorClass="text-purple-400" delay={0.3} />
            <StatCard icon={DollarSign} label="Revenu Total (Lives)" value={liveRevenueGenerated.toFixed(2)} unit="€" colorClass="text-teal-400" delay={0.4} />
            <StatCard icon={Clock} label="Durée Moy. Live" value={avgLiveDurationMinutes.toFixed(1)} unit="min" colorClass="text-orange-400" delay={0.5} />
            <StatCard icon={Eye} label="Vues Profil (30j)" value={1250} unit="vues" colorClass="text-pink-400" delay={0.6} />
          </div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="bg-slate-800/70 p-5 rounded-xl shadow-lg text-center"
          >
            <TrendingUp size={28} className="mx-auto mb-2 text-primary" />
            <h3 className="text-lg font-semibold text-white mb-1">Prochain Palier Vendeur</h3>
            <p className="text-xs text-gray-300 mb-2">Vendez encore {Math.max(0, nextTierGoal - photosSold)} photos pour atteindre le prochain niveau !</p>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-1">
              <div 
                className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (photosSold / (nextTierGoal || 1)) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-gray-400">{photosSold} / {nextTierGoal} photos vendues</p>
          </motion.div>
          
        </motion.div>
      );
    };

    export default StatsDashboardPage;