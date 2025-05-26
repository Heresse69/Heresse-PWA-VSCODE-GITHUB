import React from 'react';
    import { useUser } from '@/contexts/UserContext';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { motion } from 'framer-motion';
    import { PlusCircle, Trash2, CheckCircle, ShieldCheck } from 'lucide-react';

    const ProfilePhotosSection = () => {
        const { currentUser, addProfilePhoto, deleteProfilePhoto, setMainProfilePicture, MAX_PROFILE_PHOTOS, MIN_PROFILE_PHOTOS } = useUser();
        const { toast } = useToast();

        if (!currentUser) return null;

        const handleAdd = () => {
            if (currentUser.profilePhotos.length >= MAX_PROFILE_PHOTOS) {
                toast({ title: "Limite atteinte", description: `Vous ne pouvez pas avoir plus de ${MAX_PROFILE_PHOTOS} photos de profil.`, variant: "destructive" });
                return;
            }
            const newImage = { 
                url: `https://source.unsplash.com/random/400x400/?person,model&sig=${Date.now()}`,
                alt: `Nouvelle photo de profil ${currentUser.profilePhotos.length + 1}`
            };
            
            if(addProfilePhoto(newImage)) {
                toast({ title: "Nouvelle photo de profil ajoutée!" });
            }
        };

        const handleDelete = (photoIdToDelete) => {
            const photoToDelete = currentUser.profilePhotos.find(p => p.id === photoIdToDelete);
            if (photoToDelete && photoToDelete.isVerified) {
                toast({ title: "Action impossible", description: "La photo vérifiée ne peut pas être supprimée.", variant: "destructive" });
                return;
            }
            if (currentUser.profilePhotos.length <= MIN_PROFILE_PHOTOS) {
                 toast({ title: "Action impossible", description: `Vous devez avoir au moins ${MIN_PROFILE_PHOTOS} photo de profil.`, variant: "destructive" });
                return;
            }
            if(deleteProfilePhoto(photoIdToDelete)) {
                toast({ title: "Photo de profil supprimée", variant: "destructive" });
            } else {
                 toast({ title: "Erreur", description: "Impossible de supprimer cette photo.", variant: "destructive" });
            }
        };
        
        const handleSetAsMain = (photoIdToSet) => {
            const photoToSet = currentUser.profilePhotos.find(p => p.id === photoIdToSet);
            if (photoToSet && photoToSet.isVerified) {
                 toast({title: "Info", description: "La photo vérifiée est toujours la photo principale par défaut si elle est la première."});
                return;
            }
            if (currentUser.profilePhotos[0].id === photoIdToSet && currentUser.profilePhotos[0].isVerified) {
                 toast({title: "Info", description: "Cette photo est déjà votre photo de profil principale."});
                 return;
            }


            if(setMainProfilePicture(photoIdToSet)) {
                toast({title: "Photo de profil principale modifiée!"});
            } else {
                toast({title: "Info", description: "Cette photo est déjà votre photo de profil principale ou une erreur est survenue."});
            }
        };

        return (
            <section className="pt-4 border-t border-slate-700/50">
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Photos de Profil ({currentUser.profilePhotos.length}/{MAX_PROFILE_PHOTOS})</h2>
                <p className="text-xs text-gray-400 mb-3">Gérez vos photos de profil. La première photo est votre photo principale. La photo vérifiée ne peut être supprimée.</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {currentUser.profilePhotos.map((photo, index) => (
                        <motion.div 
                            key={photo.id}
                            layout
                            className="relative aspect-square rounded-lg overflow-hidden group shadow-lg"
                        >
                            <img-replace src={photo.url} alt={photo.alt || `Photo de profil ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-1 p-1">
                                {index !== 0 && !photo.isVerified && (
                                    <Button size="sm" variant="outline" className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] w-full" onClick={() => handleSetAsMain(photo.id)}>
                                        <CheckCircle size={12} className="mr-1 text-green-400" /> Ppal
                                    </Button>
                                )}
                                {!photo.isVerified && currentUser.profilePhotos.length > MIN_PROFILE_PHOTOS && (
                                    <Button size="sm" variant="outline" className="bg-red-500/40 hover:bg-red-500/60 border-none text-white text-[10px] w-full" onClick={() => handleDelete(photo.id)}>
                                        <Trash2 size={12} className="mr-1" /> Suppr.
                                    </Button>
                                )}
                            </div>
                            {index === 0 && (
                                <div className="absolute top-1 right-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold shadow-md">
                                    Principale
                                </div>
                            )}
                            {photo.isVerified && (
                                <div className="absolute bottom-1 left-1 bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-semibold shadow-md flex items-center">
                                    <ShieldCheck size={10} className="mr-0.5"/> Vérifiée
                                </div>
                            )}
                        </motion.div>
                    ))}
                    {currentUser.profilePhotos.length < MAX_PROFILE_PHOTOS && (
                         <motion.button
                            onClick={handleAdd}
                            className="aspect-square rounded-lg border-2 border-dashed border-primary/50 flex flex-col items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                        >
                            <PlusCircle size={28} />
                            <span className="text-[10px] mt-1 text-center">Ajouter Photo Profil</span>
                        </motion.button>
                    )}
                </div>
            </section>
        );
    };

    export default ProfilePhotosSection;