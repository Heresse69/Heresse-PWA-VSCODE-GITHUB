import React, { useState, useEffect, useCallback } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Lock, Eye, Search, Image as ImageIcon, DollarSign, AlertTriangle, Info } from 'lucide-react';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
    import { useUser } from '@/contexts/UserContext';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/supabaseClient';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

    const GalleryCard = ({ gallery, onUnlockClick, isUnlocked }) => {
      const navigate = useNavigate();
      
      const handleCardClick = () => {
        if (isUnlocked) {
          navigate(`/profile/${gallery.user_id}/gallery/${gallery.id}`);
        } else {
          onUnlockClick(gallery);
        }
      };

      const galleryDisplayName = gallery.owner_first_name || 'Galerie';

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-[4/3] bg-slate-800 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
          onClick={handleCardClick}
        >
          <img 
            alt={gallery.name || 'Couverture de la galerie'} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            src={gallery.cover_image_url || 'https://source.unsplash.com/random/400x300/?abstract,gallery&sig=' + gallery.id} 
           src="https://images.unsplash.com/photo-1561490497-43bc900ac2d8" />
          {!isUnlocked && <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex flex-col justify-end">
            <div className="flex items-center mb-1">
              <Avatar className="h-6 w-6 mr-2 border-2 border-white/50">
                <AvatarImage src={gallery.owner_avatar} />
                <AvatarFallback>{gallery.owner_first_name?.substring(0,1).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <h3 className="text-md font-bold text-white truncate">{`Galerie de ${galleryDisplayName}`}</h3>
            </div>
            <p className="text-xs text-gray-300 mb-1.5">{gallery.item_count || 0} média(s)</p>
            {isUnlocked ? (
              <span className="text-xs bg-green-500/80 text-white px-2 py-1 rounded-full inline-flex items-center backdrop-blur-sm w-fit">
                <Eye size={12} className="mr-1.5" />
                Débloquée
              </span>
            ) : (
              <span className="text-xs bg-primary/80 text-white px-2 py-1 rounded-full inline-flex items-center backdrop-blur-sm w-fit">
                <Lock size={12} className="mr-1.5" />
                {gallery.price ? `${gallery.price.toFixed(2)}€` : "Gratuit"}
              </span>
            )}
          </div>
          {!isUnlocked && gallery.price > 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-2 text-sm shadow-lg"
                onClick={(e) => { e.stopPropagation(); onUnlockClick(gallery); }}
              >
                <Lock size={14} className="mr-1.5" /> Débloquer
              </Button>
            </div>
          )}
        </motion.div>
      );
    };

    const PrivateGalleriesPage = () => {
      const [searchTerm, setSearchTerm] = useState('');
      const [galleries, setGalleries] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState(null);
      const { currentUser, updateWalletBalance, addUnlockedGallery, unlockedGalleries, loading: userLoading } = useUser();
      const { toast } = useToast();
      const navigate = useNavigate();

      const [showUnlockDialog, setShowUnlockDialog] = useState(false);
      const [galleryToUnlock, setGalleryToUnlock] = useState(null);

      const fetchGalleries = useCallback(async () => {
        if (userLoading) {
            setIsLoading(true);
            return;
        }
        if (!currentUser?.id) {
          setIsLoading(false);
          setError("Utilisateur non authentifié. Veuillez vous connecter.");
          return;
        }

        setIsLoading(true);
        setError(null);

        let matchIds = [];
        try {
            const { data: matchesData, error: matchesError } = await supabase
            .from('matches')
            .select('user1_id, user2_id')
            .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
            .eq('status', 'matched');

            if (matchesError) throw matchesError;
            
            if (matchesData) {
            matchIds = matchesData
                .map(match => match.user1_id === currentUser.id ? match.user2_id : match.user1_id)
                .filter((id, index, self) => id !== undefined && self.indexOf(id) === index);
            }
        } catch (e) {
            console.error("Error fetching matches:", e);
            setError("Impossible de récupérer vos matchs pour afficher les galeries. Vérifiez votre connexion ou les permissions.");
            setGalleries([]);
            setIsLoading(false);
            return;
        }


        if (matchIds.length === 0) {
          setGalleries([]);
          setIsLoading(false);
          return;
        }
        
        try {
            const { data: galleriesData, error: galleriesError } = await supabase
            .from('user_galleries')
            .select(`
                id,
                name,
                cover_image_url,
                price,
                user_id,
                profiles!inner (id, full_name, avatar_url, raw_user_meta_data),
                private_gallery_media (count)
            `)
            .in('user_id', matchIds);

            if (galleriesError) throw galleriesError;

            if (galleriesData) {
                const formattedGalleries = galleriesData.map(g => {
                    const ownerMetaData = g.profiles?.raw_user_meta_data;
                    const ownerFullName = g.profiles?.full_name || ownerMetaData?.full_name || ownerMetaData?.name || 'Utilisateur Inconnu';
                    const firstName = ownerFullName.split(' ')[0];
                    return {
                    ...g,
                    owner_name: ownerFullName,
                    owner_first_name: firstName,
                    owner_avatar: g.profiles?.avatar_url || ownerMetaData?.avatar_url,
                    item_count: g.private_gallery_media[0]?.count || 0,
                    };
                }).filter(g => g.profiles); 
                setGalleries(formattedGalleries);
            } else {
                setGalleries([]);
            }

        } catch (e) {
            console.error("Error fetching galleries:", e);
            setError("Impossible de charger les galeries de vos matchs.");
            toast({ title: "Erreur de chargement", description: "Impossible de charger les galeries. Réessayez plus tard.", variant: "destructive" });
            setGalleries([]);
        }
        setIsLoading(false);
      }, [currentUser?.id, toast, userLoading]);

      useEffect(() => {
        if (!userLoading) {
          fetchGalleries();
        }
      }, [fetchGalleries, userLoading]);

      const handleUnlockGallery = async () => {
        if (!galleryToUnlock || !currentUser) return;

        if (galleryToUnlock.price === 0) {
            addUnlockedGallery(galleryToUnlock.id);
            setShowUnlockDialog(false);
            toast({ title: "Galerie débloquée!", description: `${galleryToUnlock.name || 'Cette galerie'} est maintenant accessible.`, className: "bg-green-500 text-white" });
            setGalleryToUnlock(null);
            return;
        }
        
        if (currentUser.walletBalance < galleryToUnlock.price) {
          toast({ title: "Solde insuffisant", description: `Vous avez besoin de ${galleryToUnlock.price.toFixed(2)}€ pour débloquer cette galerie.`, variant: "destructive" });
          setShowUnlockDialog(false);
          navigate('/wallet');
          return;
        }
        
        const newBalance = currentUser.walletBalance - galleryToUnlock.price;
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ wallet_balance: newBalance })
          .eq('id', currentUser.id);

        if (profileUpdateError) {
            console.error("Error updating wallet balance:", profileUpdateError);
            toast({ title: "Erreur de paiement", description: "Impossible de mettre à jour le solde. Veuillez réessayer.", variant: "destructive" });
            setShowUnlockDialog(false);
            setGalleryToUnlock(null);
            return;
        }
        
        const newUnlockedGalleriesList = [...new Set([...(currentUser.unlockedGalleries || []), galleryToUnlock.id])];
        
        const { error: userUpdateError } = await supabase.rpc('update_user_unlocked_galleries', {
            user_id_param: currentUser.id,
            new_galleries_param: newUnlockedGalleriesList
        });

        if (userUpdateError) {
            console.error("Error updating unlocked galleries via RPC:", userUpdateError);
            await supabase.from('profiles').update({ wallet_balance: currentUser.walletBalance }).eq('id', currentUser.id); // Revert balance
            toast({ title: "Erreur", description: "Impossible de débloquer la galerie après paiement. Contactez le support.", variant: "destructive" });
        } else {
            updateWalletBalance(-galleryToUnlock.price); 
            addUnlockedGallery(galleryToUnlock.id); 
            toast({ title: "Galerie débloquée!", description: `${galleryToUnlock.name || 'Cette galerie'} est maintenant accessible.`, className: "bg-green-500 text-white" });
        }
        setShowUnlockDialog(false);
        setGalleryToUnlock(null);
      };

      const openUnlockDialog = (gallery) => {
        if (gallery.price === 0) {
            addUnlockedGallery(gallery.id); 
            toast({ title: "Galerie débloquée!", description: `${gallery.name || 'Cette galerie'} est maintenant accessible (gratuit).`, className: "bg-green-500 text-white" });
            return;
        }
        setGalleryToUnlock(gallery);
        setShowUnlockDialog(true);
      };

      const filteredGalleries = galleries.filter(gallery =>
        (gallery.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (gallery.owner_first_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
      
      const renderContent = () => {
        if (isLoading) {
          return (
            <div className="h-full w-full flex flex-col items-center justify-center text-white p-4">
              <div className="animate-pulse mb-4">
                <ImageIcon size={64} className="opacity-50 text-primary" />
              </div>
              <p className="text-lg">Chargement des galeries...</p>
            </div>
          );
        }

        if (error) {
          return (
            <div className="flex flex-col items-center justify-center text-center text-red-400 pt-16 px-4">
              <AlertTriangle size={64} className="mb-4 opacity-70" />
              <h2 className="text-xl font-semibold text-white mb-2">Erreur de Chargement</h2>
              <p className="text-sm mb-4">{error}</p>
              <Button onClick={fetchGalleries} className="bg-primary hover:bg-primary/90">Réessayer</Button>
            </div>
          );
        }

        if (filteredGalleries.length > 0) {
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredGalleries.map((gallery) => (
                <GalleryCard 
                    key={gallery.id} 
                    gallery={gallery} 
                    onUnlockClick={openUnlockDialog}
                    isUnlocked={(unlockedGalleries || []).includes(gallery.id) || gallery.user_id === currentUser?.id}
                />
              ))}
            </div>
          );
        }

        return (
          <div className="flex flex-col items-center justify-center text-center text-gray-400 pt-16 px-4">
            <Info size={64} className="mb-4 opacity-50 text-primary/70" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? `Aucune galerie trouvée pour "${searchTerm}"` : "Aucune galerie privée de vos matchs"}
            </h2>
            <p className="text-sm">
              {searchTerm ? "Essayez un autre terme de recherche." : "Explorez les profils et matchez pour découvrir leurs galeries privées ici."}
            </p>
          </div>
        );
      };

      return (
        <div className="flex flex-col h-full bg-gradient-to-b from-background to-slate-900 text-white pt-safe-top">
            <div className="p-4 flex-grow overflow-y-auto pb-20 no-scrollbar">
              <div className="relative mb-6 mt-4">
                <Input 
                  type="text" 
                  placeholder="Rechercher une galerie ou un créateur..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder-gray-400 focus:ring-primary focus:border-primary pl-10 rounded-full py-2.5 shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {renderContent()}
            </div>

            <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
                <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-xs rounded-xl shadow-xl">
                    <DialogHeader className="p-4 pb-0">
                        <DialogTitle className="text-gradient-heresse text-lg mb-1">Débloquer la Galerie</DialogTitle>
                        <DialogDescription className="text-xs text-gray-400">
                            Galerie: <span className="font-medium text-gray-300">{galleryToUnlock?.name || 'Galerie sans nom'}</span><br/>
                            Créateur: <span className="font-medium text-gray-300">{galleryToUnlock?.owner_first_name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 text-center">
                        <img  src={galleryToUnlock?.cover_image_url || 'https://source.unsplash.com/random/400x300/?abstract,cover&sig=dialog' + galleryToUnlock?.id} alt="Couverture de la galerie" className="w-full aspect-video object-cover rounded-md blur-sm opacity-60 mb-3"  src="https://images.unsplash.com/photo-1591298607671-9afec14e39b5" />
                        <p className="text-2xl font-bold text-primary mb-1">{galleryToUnlock?.price?.toFixed(2)}€</p>
                        <p className="text-xs text-gray-400 mb-4">Solde actuel: <span className="font-bold text-white">{currentUser?.walletBalance?.toFixed(2)}€</span></p>
                        
                        <div className="flex flex-col space-y-2">
                            <Button 
                                onClick={handleUnlockGallery} 
                                disabled={!currentUser || currentUser.walletBalance < (galleryToUnlock?.price || 0)} 
                                className="w-full bg-primary hover:bg-primary/90 text-white"
                            >
                                <DollarSign size={16} className="mr-1.5" /> Payer & Débloquer
                            </Button>
                            <Button variant="ghost" onClick={() => setShowUnlockDialog(false)} className="w-full text-gray-400 hover:text-white">Annuler</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
      );
    };

    export default PrivateGalleriesPage;