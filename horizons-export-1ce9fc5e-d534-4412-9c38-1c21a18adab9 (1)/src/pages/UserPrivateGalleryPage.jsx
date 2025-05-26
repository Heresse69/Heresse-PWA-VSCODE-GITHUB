import React, { useState, useEffect, useCallback } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { ChevronLeft, Lock, Eye, DollarSign, Image as ImageIcon } from 'lucide-react';
    import { useUser } from '@/contexts/UserContext';
    import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
    import { supabase } from '@/lib/supabaseClient';
    import { mockProfiles } from '@/data/mockProfiles'; 
    import FullScreenMediaDisplay from '@/components/gallery/FullScreenMediaDisplay';

    const UserPrivateGalleryPage = () => {
        const { userId, galleryId: routeGalleryId } = useParams(); 
        const navigate = useNavigate();
        const { toast } = useToast();
        const { currentUser, updateWalletBalance, unlockedMedia, addUnlockedMediaItem, loading: userLoading, unlockedGalleries } = useUser();
        
        const [galleryOwner, setGalleryOwner] = useState(null);
        const [galleryMedia, setGalleryMedia] = useState([]);
        const [galleryDetails, setGalleryDetails] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        
        const [showUnlockDialog, setShowUnlockDialog] = useState(false);
        const [mediaToUnlock, setMediaToUnlock] = useState(null);
        const [selectedMediaForView, setSelectedMediaForView] = useState(null);

        const fetchGalleryData = useCallback(async () => {
            if (userLoading || !currentUser?.id) return;
            setIsLoading(true);

            const { data: ownerData, error: ownerError } = await supabase
                .from('profiles') 
                .select('id, raw_user_meta_data')
                .eq('id', userId)
                .single();

            let ownerProfile;
            if (ownerError || !ownerData) {
                const mockOwner = mockProfiles.find(p => p.id === userId);
                if (mockOwner) {
                    ownerProfile = { id: mockOwner.id, name: mockOwner.name, avatar: mockOwner.avatar };
                } else if (userId === currentUser.id) {
                    ownerProfile = { id: currentUser.id, name: currentUser.name, avatar: currentUser.profilePicture };
                } else {
                    toast({ title: "Erreur", description: "Propriétaire de la galerie non trouvé.", variant: "destructive" });
                    navigate(-1);
                    setIsLoading(false);
                    return;
                }
            } else {
                 ownerProfile = {
                    id: ownerData.id,
                    name: ownerData.raw_user_meta_data?.full_name || ownerData.raw_user_meta_data?.name || 'Utilisateur',
                    avatar: ownerData.raw_user_meta_data?.avatar_url
                };
            }
            setGalleryOwner(ownerProfile);

            const { data: galleryInfo, error: galleryInfoError } = await supabase
                .from('user_galleries')
                .select('*')
                .eq('id', routeGalleryId)
                .eq('user_id', userId)
                .single();

            if (galleryInfoError || !galleryInfo) {
                toast({ title: "Erreur", description: "Galerie non trouvée ou accès non autorisé.", variant: "destructive" });
                setIsLoading(false);
                return;
            }
            setGalleryDetails(galleryInfo);

            const isGalleryUnlockedForUser = (unlockedGalleries || []).includes(routeGalleryId) || userId === currentUser.id;

            if (!isGalleryUnlockedForUser && galleryInfo.price > 0) {
                toast({ title: "Galerie Verrouillée", description: "Vous devez d'abord débloquer cette galerie.", variant: "destructive" });
                navigate('/galleries'); 
                setIsLoading(false);
                return;
            }
            
            const { data, error } = await supabase
                .from('private_gallery_media')
                .select('*')
                .eq('gallery_id', routeGalleryId);

            if (error) {
                console.error("Error fetching gallery media:", error);
                toast({ title: "Erreur de chargement", description: "Impossible de charger les médias de la galerie.", variant: "destructive" });
                setGalleryMedia([]);
            } else {
                setGalleryMedia(data || []);
            }
            setIsLoading(false);
        }, [userId, routeGalleryId, currentUser, userLoading, toast, navigate, unlockedGalleries]);

        useEffect(() => {
            fetchGalleryData();
        }, [fetchGalleryData]);

        const handleUnlockMedia = () => {
            if (!mediaToUnlock) return;
            
            if (!mediaToUnlock.price || mediaToUnlock.price === 0) { 
                addUnlockedMediaItem(mediaToUnlock.id);
                setShowUnlockDialog(false);
                setSelectedMediaForView(mediaToUnlock); 
                toast({ title: "Média disponible!", description: `Vous pouvez voir ce média.`, className: "bg-green-500 text-white" });
                return;
            }

            if (currentUser.walletBalance < mediaToUnlock.price) {
                toast({ title: "Solde insuffisant", description: `Vous avez besoin de ${mediaToUnlock.price}€ pour débloquer ce média.`, variant: "destructive" });
                setShowUnlockDialog(false);
                navigate('/wallet');
                return;
            }
            updateWalletBalance(-mediaToUnlock.price);
            addUnlockedMediaItem(mediaToUnlock.id); 
            setShowUnlockDialog(false);
            setSelectedMediaForView(mediaToUnlock); 
            toast({ title: "Média débloqué!", description: `Vous avez payé ${mediaToUnlock.price}€ et avez accès à ce média.`, className: "bg-green-500 text-white" });
        };

        const handleMediaClick = (mediaItem) => {
             if (unlockedMedia.includes(mediaItem.id) || userId === currentUser.id || (galleryDetails && galleryDetails.price === 0) || mediaItem.price === 0) {
                setSelectedMediaForView(mediaItem);
            } else {
                setMediaToUnlock(mediaItem);
                setShowUnlockDialog(true);
            }
        };
        
        const closeMediaViewer = () => {
            setSelectedMediaForView(null);
        };

        if (isLoading || userLoading) {
            return <div className="h-full w-full bg-slate-900 flex items-center justify-center text-white">Chargement de la galerie...</div>;
        }

        if (!galleryOwner || !galleryDetails) {
            return <div className="h-full w-full bg-slate-900 flex items-center justify-center text-white">Galerie introuvable ou accès refusé.</div>;
        }
        
        const effectiveGalleryName = galleryDetails?.name || `Galerie de ${galleryOwner.name}`;
        const effectiveCoverImage = galleryDetails?.cover_image_url || galleryOwner.avatar || "https://source.unsplash.com/random/400x300/?abstract";

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col h-full bg-gradient-to-b from-background to-slate-900 text-white overflow-y-auto no-scrollbar"
            >
                <header className="p-3 flex items-center justify-between bg-black/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-gray-300 hover:text-white">
                        <ChevronLeft size={28} />
                    </Button>
                    <div className="text-center">
                        <h1 className="text-lg font-semibold text-gradient-heresse truncate max-w-[200px]">{effectiveGalleryName}</h1>
                        <p className="text-xs text-gray-400">Par {galleryOwner.name}</p>
                    </div>
                    <div className="w-10"> {} </div>
                </header>

                {galleryMedia.length === 0 && (
                     <div className="relative aspect-video w-full">
                        <img src={effectiveCoverImage} alt={`Couverture de ${effectiveGalleryName}`} className="w-full h-full object-cover blur-md opacity-50"/>
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-6 text-center">
                            <ImageIcon size={48} className="text-primary mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">Galerie Vide</h2>
                            <p className="text-gray-300 mb-4 text-sm">{galleryOwner.name} n'a pas encore ajouté de médias à cette galerie.</p>
                        </div>
                    </div>
                )}

                {galleryMedia.length > 0 && (
                    <div className="p-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {galleryMedia.map((item, index) => {
                            const isItemUnlocked = unlockedMedia.includes(item.id) || userId === currentUser.id || (galleryDetails && galleryDetails.price === 0) || item.price === 0;
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer bg-slate-800"
                                    onClick={() => handleMediaClick(item)}
                                >
                                    <img src={item.url} alt={item.alt_text || `Média ${index+1}`} className={`w-full h-full object-cover transition-all duration-300 ${!isItemUnlocked ? 'blur-md group-hover:blur-sm' : ''}`} />
                                    
                                    {!isItemUnlocked && (
                                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-2 text-center">
                                            <Lock size={24} className="text-primary mb-1" />
                                            <p className="text-xs font-semibold text-white">Débloquer</p>
                                            {item.price > 0 && <p className="text-[10px] text-gray-300">{item.price}€</p>}
                                            {item.price === 0 && <p className="text-[10px] text-gray-300">Gratuit</p>}
                                        </div>
                                    )}
                                     {isItemUnlocked && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Eye size={32} className="text-white"/>
                                        </div>
                                     )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
                
                <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
                    <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-xs rounded-xl">
                         <DialogHeader className="p-4 pb-0">
                            <DialogTitle className="text-gradient-heresse text-lg mb-2">Débloquer ce Média</DialogTitle>
                         </DialogHeader>
                        <div className="p-4 text-center">
                            <p className="text-sm text-gray-300 mb-1">
                                Média de {galleryOwner?.name}.
                            </p>
                            {mediaToUnlock?.price > 0 && (
                                <p className="text-sm text-gray-300 mb-3">
                                    Prix: <span className="font-bold text-primary">{mediaToUnlock?.price?.toFixed(2)}€</span>
                                </p>
                            )}
                             <img 
                                src={mediaToUnlock?.url || 'https://source.unsplash.com/random/400x300/?abstract,blurred&sig=dialogunlock' + mediaToUnlock?.id} 
                                alt="Aperçu flouté" 
                                className="w-full aspect-square object-cover rounded-md blur-lg opacity-70 mb-3" 
                             />
                            <p className="text-xs text-gray-400 mb-4">Solde actuel: <span className="font-bold text-white">{currentUser.walletBalance.toFixed(2)}€</span></p>
                            
                            <div className="flex justify-end space-x-2">
                                <Button variant="ghost" onClick={() => setShowUnlockDialog(false)} className="text-gray-400 hover:text-white">Annuler</Button>
                                <Button onClick={handleUnlockMedia} disabled={currentUser.walletBalance < (mediaToUnlock?.price || 0) && mediaToUnlock?.price > 0} className="bg-primary hover:bg-primary/90 text-white">
                                    {mediaToUnlock?.price > 0 ? (<><DollarSign size={16} className="mr-1.5" /> Payer {mediaToUnlock?.price?.toFixed(2)}€</>) : (<><Eye size={16} className="mr-1.5" /> Voir (Gratuit)</>)}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <FullScreenMediaDisplay
                    mediaItem={selectedMediaForView}
                    onClose={closeMediaViewer}
                />
            </motion.div>
        );
    };

    export default UserPrivateGalleryPage;