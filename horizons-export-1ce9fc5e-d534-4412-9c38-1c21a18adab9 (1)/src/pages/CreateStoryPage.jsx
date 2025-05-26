import React, { useState, useRef } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { ChevronLeft, Camera, Video, Send, Trash2 } from 'lucide-react';
    import { useUser } from '@/contexts/UserContext'; // Assuming stories are part of user context or a global one

    const CreateStoryPage = () => {
        const navigate = useNavigate();
        const { toast } = useToast();
        const { addStory } = useUser(); // Assuming a function to add stories exists in UserContext
        const [mediaType, setMediaType] = useState(null); // 'photo' or 'video'
        const [mediaPreview, setMediaPreview] = useState(null);
        const [mediaFile, setMediaFile] = useState(null);
        const fileInputRef = useRef(null);

        const handleCapture = (type) => {
            setMediaType(type);
            fileInputRef.current.accept = type === 'photo' ? 'image/*' : 'video/*';
            fileInputRef.current.click();
        };

        const handleFileChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                setMediaFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setMediaPreview(reader.result);
                };
                reader.readAsDataURL(file);
                toast({ title: `${mediaType === 'photo' ? 'Photo' : 'Vidéo'} capturée (simulation)!`, description: "Prête à être publiée."});
            }
        };

        const handlePublishStory = () => {
            if (!mediaFile || !mediaType) {
                toast({ title: "Erreur", description: "Aucun média à publier.", variant: "destructive" });
                return;
            }
            
            const newStory = {
                id: `story_${Date.now()}`,
                userId: 'currentUser', // Replace with actual current user ID
                userName: 'Moi', // Replace with actual current user name
                type: mediaType,
                url: mediaPreview, // In real app, upload file and use URL from storage
                timestamp: Date.now(),
                duration: mediaType === 'video' ? 7000 : 5000, // Example durations
            };

            addStory(newStory); // Add to context/state
            toast({ title: "Story Publiée!", description: "Votre story est maintenant visible." });
            navigate('/chat'); // Or back to wherever stories are viewed from
        };
        
        const handleDiscardMedia = () => {
            setMediaType(null);
            setMediaPreview(null);
            setMediaFile(null);
            if(fileInputRef.current) fileInputRef.current.value = null; // Reset file input
        };

        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="flex flex-col h-full bg-black text-white overflow-hidden"
            >
                <header className="p-3 flex items-center justify-between bg-black/80 backdrop-blur-sm sticky top-0 z-10">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-gray-300 hover:text-white">
                        <ChevronLeft size={28} />
                    </Button>
                    <h1 className="text-lg font-semibold text-gradient-heresse">Créer une Story</h1>
                    <div className="w-10"> {} </div>
                </header>

                <div className="flex-grow flex flex-col items-center justify-center p-4">
                    {mediaPreview ? (
                        <div className="relative w-full aspect-[9/16] max-w-xs rounded-lg overflow-hidden bg-slate-800">
                            {mediaType === 'photo' ? (
                                <img  src={mediaPreview} alt="Aperçu Story" className="w-full h-full object-cover" />
                            ) : (
                                <video src={mediaPreview} controls autoPlay loop className="w-full h-full object-cover">Votre navigateur ne supporte pas les vidéos.</video>
                            )}
                            <Button variant="destructive" size="icon" onClick={handleDiscardMedia} className="absolute top-2 right-2 rounded-full w-9 h-9 bg-black/50 hover:bg-red-600">
                                <Trash2 size={18} />
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <p className="mb-6 text-sm">Appuyez sur un bouton pour capturer votre story.</p>
                            <div className="flex space-x-6">
                                <Button onClick={() => handleCapture('photo')} variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary/10 hover:text-primary-hover flex flex-col items-center justify-center w-24 h-24 rounded-xl p-0">
                                    <Camera size={32} className="mb-1" />
                                    <span className="text-xs">Photo</span>
                                </Button>
                                <Button onClick={() => handleCapture('video')} variant="outline" className="bg-transparent border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 flex flex-col items-center justify-center w-24 h-24 rounded-xl p-0">
                                    <Video size={32} className="mb-1" />
                                    <span className="text-xs">Vidéo (30s max)</span>
                                </Button>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        </div>
                    )}
                </div>

                {mediaPreview && (
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="p-4 bg-black/80 backdrop-blur-sm border-t border-slate-700"
                    >
                        <Button onClick={handlePublishStory} className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-full text-base">
                            <Send size={18} className="mr-2" /> Publier la Story
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        );
    };

    export default CreateStoryPage;