import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/contexts/UserContext'; 
import { getMatches, getConversations } from '@/data/mockChatData'; 
import StoryViewer from '@/components/StoryViewer';
import StoriesSection from '@/components/StoriesSection';

// Composant MatchCard pour afficher chaque profil de match
const MatchCard = ({ profile, index, conversationId }) => {
  const chatLink = conversationId ? `/chat/${conversationId}` : `/matches/${profile.id}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative aspect-[3/4] bg-slate-700 rounded-xl overflow-hidden shadow-lg group"
    >
      <img 
        alt={profile.name} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        src={profile.avatarImage || `https://source.unsplash.com/random/400x600?person&sig=${profile.id}`} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white">{profile.name}, {profile.age || 'N/A'}</h3>
        <p className={`text-xs mb-1 ${profile.online ? 'text-green-300' : 'text-gray-400'}`}>
          {profile.online ? 'En ligne' : (profile.lastActivity || 'Actif récemment')}
        </p>
        {profile.commonInterests > 0 && (
          <p className="text-xs text-gray-200 flex items-center">
            <Heart size={12} className="mr-1 text-pink-400 fill-current" /> 
            {profile.commonInterests} centres d'intérêt en commun
          </p>
        )}
        {conversationId && (
          <p className="text-xs text-green-300 flex items-center mt-1">
            <MessageSquare size={12} className="mr-1" />
            Conversation active
          </p>
        )}
      </div>
      <Link to={chatLink} className="absolute inset-0" aria-label={`Chatter avec ${profile.name}`}></Link>
      <Button 
        size="icon" 
        variant="ghost"
        className="absolute top-2 right-2 bg-black/30 hover:bg-pink-500/70 text-white rounded-full w-9 h-9 opacity-0 group-hover:opacity-100 transition-opacity"
        asChild
      >
        <Link to={chatLink}>
          <MessageSquare size={18} />
        </Link>
      </Button>
    </motion.div>
  );
};

const MatchesPage = () => {
  const { currentUser } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Utiliser les matchs dynamiques au lieu des données statiques
  const [matchedProfilesList, setMatchedProfilesList] = useState([]);
  
  // Mettre à jour la liste des matchs quand elle change
  useEffect(() => {
    const matches = getMatches();
    const conversations = getConversations();
    
    const enrichedMatches = matches.map(match => {
      // Trouver la conversation correspondante à ce match
      const conversation = conversations.find(conv => conv.matchId === match.id);
      
      return {
        ...match,
        avatarImage: match.avatar,
        online: Math.random() > 0.5, // Simulation statut en ligne
        lastActivity: 'Actif récemment',
        commonInterests: Math.floor(Math.random() * 5),
        mediaRating: Math.floor(Math.random() * 5) + 1,
        conversationId: conversation ? conversation.id : null,
        hasConversation: !!conversation
      };
    });
    setMatchedProfilesList(enrichedMatches);
  }, []);

  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [availableStories, setAvailableStories] = useState([]);
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    onlineStatus: 'all', // 'all', 'online', 'offline'
    ageRange: 'all', // 'all', '18-25', '26-30', '31-35', '36+'
    mediaRating: 'all' // 'all', '1', '2', '3', '4', '5'
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleStoriesReady = (stories) => {
    console.log('📚 Stories prêtes dans MatchesPage:', stories.length);
    setAvailableStories(stories);
  };

  const openStoryViewer = (storyIndex) => {
    console.log('🎯 Ouverture story index:', storyIndex, 'Stories disponibles:', availableStories.length);
    if (availableStories.length > 0) {
      setCurrentStoryIndex(storyIndex);
      setIsStoryViewerOpen(true);
    } else {
      console.warn('Aucune story disponible pour le viewer');
    }
  };

  const closeStoryViewer = () => {
    setIsStoryViewerOpen(false);
  };

  const filteredProfiles = matchedProfilesList.filter(profile => {
    // Filtre par nom
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre par statut en ligne
    const matchesOnlineStatus = filters.onlineStatus === 'all' || 
      (filters.onlineStatus === 'online' && profile.online) ||
      (filters.onlineStatus === 'offline' && !profile.online);
    
    // Filtre par âge
    let matchesAge = true;
    if (filters.ageRange !== 'all') {
      const age = profile.age;
      switch (filters.ageRange) {
        case '18-25':
          matchesAge = age >= 18 && age <= 25;
          break;
        case '26-30':
          matchesAge = age >= 26 && age <= 30;
          break;
        case '31-35':
          matchesAge = age >= 31 && age <= 35;
          break;
        case '36+':
          matchesAge = age >= 36;
          break;
      }
    }
    
    // Filtre par note des médias
    const matchesMediaRating = filters.mediaRating === 'all' || 
      profile.mediaRating >= parseInt(filters.mediaRating);
    
    return matchesSearch && matchesOnlineStatus && matchesAge && matchesMediaRating;
  });

  const sortedProfiles = filteredProfiles.sort((a, b) => {
    // Sort by online status first
    if (a.online && !b.online) return -1;
    if (!a.online && b.online) return 1;
    
    // Then by media rating
    if (b.mediaRating !== a.mediaRating) return b.mediaRating - a.mediaRating;
    
    // Then by common interests
    return b.commonInterests - a.commonInterests;
  });

  const resetFilters = () => {
    setFilters({
      onlineStatus: 'all',
      ageRange: 'all',
      mediaRating: 'all'
    });
  };

  const hasActiveFilters = filters.onlineStatus !== 'all' || 
                          filters.ageRange !== 'all' || 
                          filters.mediaRating !== 'all';

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Container des stories uniquement */}
      <div className="flex-shrink-0 px-4 pt-4 pb-0">
        <StoriesSection 
          usersList={matchedProfilesList}
          currentUser={currentUser}
          onStoryClick={openStoryViewer}
          onStoriesReady={handleStoriesReady}
        />
      </div>

      {/* Barre de recherche dans son propre container */}
      <div className="flex-shrink-0 px-4 pb-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Rechercher un match..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-pink-500 focus:border-pink-500 pl-14 pr-4 rounded-full py-2.5 w-full text-sm"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 flex-shrink-0" />
        </div>
      </div>

      {isStoryViewerOpen && availableStories.length > 0 && (
        <StoryViewer
          stories={availableStories}
          initialIndex={currentStoryIndex}
          onClose={closeStoryViewer}
        />
      )}

      <div 
  className="flex-1 overflow-y-auto px-4 pb-20"
  style={{
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    height: 'auto',
    maxHeight: '400px'
  }}
>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Vos matchs ({sortedProfiles.length})
          </h2>
          
          {/* Pastille Filtrer - exactement comme celle des messages non lus */}
          <Badge 
            variant="destructive" 
            className="bg-pink-500 text-white cursor-pointer hover:bg-pink-600 transition-colors"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={12} className="mr-1" />
            Filtrer
            {hasActiveFilters && <span className="ml-1">•</span>}
          </Badge>
        </div>

        {/* Panneau de filtres qui s'affiche en dessous */}
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-slate-800 rounded-xl border border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Filtrer vos matchs</h3>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters}
                  className="text-pink-400 hover:text-pink-300 text-xs"
                >
                  <X size={12} className="mr-1" />
                  Tout effacer
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              {/* Filtre statut en ligne */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Statut de connexion
                </label>
                <Select value={filters.onlineStatus} onValueChange={(value) => setFilters({...filters, onlineStatus: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-600">Tous les statuts</SelectItem>
                    <SelectItem value="online" className="text-white hover:bg-slate-600">🟢 En ligne uniquement</SelectItem>
                    <SelectItem value="offline" className="text-white hover:bg-slate-600">⚫ Hors ligne uniquement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-slate-600" />

              {/* Filtre âge */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Tranche d'âge
                </label>
                <Select value={filters.ageRange} onValueChange={(value) => setFilters({...filters, ageRange: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-600">Tous les âges</SelectItem>
                    <SelectItem value="18-25" className="text-white hover:bg-slate-600">18-25 ans</SelectItem>
                    <SelectItem value="26-30" className="text-white hover:bg-slate-600">26-30 ans</SelectItem>
                    <SelectItem value="31-35" className="text-white hover:bg-slate-600">31-35 ans</SelectItem>
                    <SelectItem value="36+" className="text-white hover:bg-slate-600">36 ans et plus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-slate-600" />

              {/* Filtre note des médias */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Note minimale des médias
                </label>
                <Select value={filters.mediaRating} onValueChange={(value) => setFilters({...filters, mediaRating: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all" className="text-white hover:bg-slate-600">Toutes les notes</SelectItem>
                    <SelectItem value="5" className="text-white hover:bg-slate-600">⭐⭐⭐⭐⭐ Excellente (5/5)</SelectItem>
                    <SelectItem value="4" className="text-white hover:bg-slate-600">⭐⭐⭐⭐ Très bonne (4/5+)</SelectItem>
                    <SelectItem value="3" className="text-white hover:bg-slate-600">⭐⭐⭐ Bonne (3/5+)</SelectItem>
                    <SelectItem value="2" className="text-white hover:bg-slate-600">⭐⭐ Moyenne (2/5+)</SelectItem>
                    <SelectItem value="1" className="text-white hover:bg-slate-600">⭐ Toutes notes (1/5+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-600">
              <p className="text-xs text-gray-400">
                {filteredProfiles.length} match{filteredProfiles.length > 1 ? 's' : ''} trouvé{filteredProfiles.length > 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        )}

        {sortedProfiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-4">
            {sortedProfiles.map((profile, index) => (
              <MatchCard 
                key={profile.id} 
                profile={profile} 
                index={index} 
                conversationId={profile.conversationId}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-gray-400 pt-10">
            <Heart size={64} className="mb-4 opacity-50 text-pink-500/70" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {searchTerm || hasActiveFilters ? "Aucun match trouvé" : "Aucun match pour le moment"}
            </h2>
            <p className="text-sm">
              {searchTerm || hasActiveFilters ? "Essayez de modifier vos critères de recherche." : "Continuez à swiper pour trouver des matchs !"}
            </p>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters}
                className="mt-3 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
              >
                Effacer les filtres
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;