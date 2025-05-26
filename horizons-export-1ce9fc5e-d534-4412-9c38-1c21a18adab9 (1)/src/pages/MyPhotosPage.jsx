import React, { useState, useEffect } from 'react';
    import { useUser } from '@/contexts/UserContext';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Textarea } from '@/components/ui/textarea';
    import { motion } from 'framer-motion';
    import ProfilePhotosSection from '@/components/profile/ProfilePhotosSection';
    import PrivateGallerySection from '@/components/profile/PrivateGallerySection';
    import { Save } from 'lucide-react';

    const MyPhotosPage = () => {
        const { currentUser, updateBio } = useUser();
        const { toast } = useToast();
        const [bio, setBio] = useState('');

        useEffect(() => {
            if (currentUser && typeof currentUser.bio !== 'undefined') {
                setBio(currentUser.bio);
            }
        }, [currentUser]);

        if (!currentUser) {
            return (
                <div className="flex items-center justify-center h-full p-4 text-white bg-gradient-to-b from-background to-slate-900">
                    <p>Chargement des informations utilisateur...</p>
                </div>
            );
        }
        
        const handleSaveBio = () => {
            updateBio(bio);
            toast({ title: "Bio mise à jour !" });
        };
        
        const userFirstName = currentUser.name ? currentUser.name.split(' ')[0] : 'Utilisateur';

        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-3 space-y-5 bg-gradient-to-b from-background to-slate-900 text-white min-h-full overflow-y-auto no-scrollbar pb-16"
            >
                <header className="text-center mb-4 pt-2">
                    <h1 className="text-2xl font-bold text-gradient-heresse">Gérer le Profil de {userFirstName}</h1>
                    <p className="text-sm text-gray-400">Modifiez vos photos, votre galerie privée et votre bio.</p>
                </header>

                <ProfilePhotosSection />
                <PrivateGallerySection />

                <section className="pt-4 border-t border-slate-700/50">
                    <h2 className="text-lg font-semibold text-gray-200 mb-3">Ma Bio</h2>
                    <p className="text-xs text-gray-400 mb-3">Racontez quelque chose d'intéressant sur vous. Votre nom d'utilisateur ({userFirstName}) n'est pas modifiable.</p>
                    <Textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Écrivez votre bio ici..."
                        className="bg-slate-800 border-slate-700 min-h-[100px] text-sm"
                        maxLength={250}
                    />
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">{bio.length} / 250 caractères</p>
                        <Button onClick={handleSaveBio} size="sm" className="bg-primary hover:bg-primary-hover text-xs">
                            <Save size={14} className="mr-1.5" /> Enregistrer Bio
                        </Button>
                    </div>
                </section>
            </motion.div>
        );
    };

    export default MyPhotosPage;