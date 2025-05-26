import React, { useState, useEffect } from 'react';
    import { useUser } from '@/contexts/UserContext';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { motion } from 'framer-motion';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
    import { PlusCircle, Trash2, DollarSign, Image as ImageIcon, UploadCloud, Lock, Edit3 } from 'lucide-react';
    import { supabase } from '@/lib/supabaseClient'; 
    import { addPrivateGalleryItemLogic, deletePrivateGalleryItemLogic, updatePrivateGalleryItemPriceLogic, createOrUpdatePrivateGalleryLogic } from '@/contexts/userActions/privateGalleryActions';

    const PrivateGallerySection = () => {
        const { currentUser, setCurrentUser, MAX_PRIVATE_GALLERY_ITEMS } = useUser();
        const { toast } = useToast();

        const userGallery = currentUser.privateGalleries && currentUser.privateGalleries.length > 0 
            ? currentUser.privateGalleries[0] 
            : { id: `pg_${currentUser.id}_default`, name: "Ma galerie privée", items: [], itemCount: 0, price: 5, coverImage: currentUser.profilePhotos.length > 0 ? currentUser.profilePhotos[0].url : '' };

        const [galleryName, setGalleryName] = useState(userGallery.name);
        const [galleryCoverImage, setGalleryCoverImage] = useState(userGallery.coverImage);
        const [galleryPrice, setGalleryPrice] = useState(userGallery.price);
        const [galleryItems, setGalleryItems] = useState(userGallery.items);
        
        const [editingGalleryItem, setEditingGalleryItem] = useState(null);
        const [newGalleryItemPrice, setNewGalleryItemPrice] = useState(0);


        useEffect(() => {
            const currentGallery = currentUser.privateGalleries && currentUser.privateGalleries.length > 0 
                ? currentUser.privateGalleries[0] 
                : { id: `pg_${currentUser.id}_default`, name: "Ma galerie privée", items: [], itemCount: 0, price: 5, coverImage: currentUser.profilePhotos.length > 0 ? currentUser.profilePhotos[0].url : '' };
            
            setGalleryName(currentGallery.name);
            setGalleryCoverImage(currentGallery.coverImage);
            setGalleryPrice(currentGallery.price);
            setGalleryItems(currentGallery.items);
        }, [currentUser.privateGalleries, currentUser.profilePhotos, currentUser.id]);


        const handleAddGalleryItemLocal = async () => {
            if (galleryItems.length >= MAX_PRIVATE_GALLERY_ITEMS) {
                toast({ title: "Limite atteinte", description: `Votre galerie privée ne peut pas contenir plus de ${MAX_PRIVATE_GALLERY_ITEMS} médias.`, variant: "destructive" });
                return;
            }
            
            const newItemUrl = `https://source.unsplash.com/random/600x800/?boudoir,artistic&sig=${Date.now()}`; 
            const newItem = {
                url: newItemUrl,
                price: 1, 
                type: 'photo',
                alt: 'Nouveau média privé'
            };
            await addPrivateGalleryItemLogic(setCurrentUser, newItem, currentUser.id, userGallery.id);
            toast({ title: "Média ajouté à la galerie privée!" });
        };

        const handleDeleteGalleryItem = async (itemIdToDelete) => {
            await deletePrivateGalleryItemLogic(setCurrentUser, itemIdToDelete, currentUser.id, userGallery.id);
            toast({ title: "Média supprimé de la galerie", variant: "destructive" });
        };

        const handleEditGalleryItem = (item) => {
            setEditingGalleryItem(item);
            setNewGalleryItemPrice(item.price);
        };

        const handleSaveGalleryItemChanges = async () => {
            if (!editingGalleryItem) return;
            await updatePrivateGalleryItemPriceLogic(setCurrentUser, editingGalleryItem.id, newGalleryItemPrice, currentUser.id, userGallery.id);
            toast({ title: "Prix du média mis à jour!" });
            setEditingGalleryItem(null);
        };

        const handleSaveGallerySettings = async () => {
            const finalCoverImage = galleryCoverImage || (currentUser.profilePhotos.length > 0 ? currentUser.profilePhotos[0].url : '');
            if (!finalCoverImage && galleryItems.length > 0) { 
                toast({ title: "Couverture manquante", description: "Veuillez sélectionner une photo de profil ou un média de galerie comme couverture.", variant: "destructive" });
                return;
            }
            
            const galleryDataToSave = {
                id: userGallery.id,
                name: galleryName,
                coverImage: finalCoverImage,
                price: galleryPrice,
                items: galleryItems 
            };
            await createOrUpdatePrivateGalleryLogic(setCurrentUser, galleryDataToSave, currentUser.id);
            toast({ title: "Paramètres de la galerie enregistrés!" });
        };
        
        const handleSetAsGalleryCover = (imageUrl) => {
            setGalleryCoverImage(imageUrl);
            toast({ title: "Image sélectionnée comme couverture de galerie."});
        };

        return (
            <section className="pt-4 border-t border-slate-700/50">
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Galerie Privée ({galleryItems.length}/{MAX_PRIVATE_GALLERY_ITEMS})</h2>
                <p className="text-xs text-gray-400 mb-3">Gérez les médias de votre galerie privée accessible par abonnement ou achat individuel.</p>
                
                <div className="space-y-3 p-3 bg-slate-800/30 rounded-lg">
                    <div>
                        <Label htmlFor="galleryName" className="text-sm">Nom de la Galerie</Label>
                        <Input id="galleryName" type="text" value={galleryName} onChange={(e) => setGalleryName(e.target.value)} placeholder="Ex: Mes plus belles photos" className="bg-slate-700 border-slate-600 mt-1"/>
                    </div>
                    <div>
                        <Label htmlFor="galleryCover" className="text-sm">Image de Couverture de la Galerie</Label>
                        <div className="mt-1 aspect-[16/9] rounded-md bg-slate-700 overflow-hidden flex items-center justify-center">
                            {galleryCoverImage ? <img-replace src={galleryCoverImage} alt="Couverture Galerie" className="w-full h-full object-cover" /> : <ImageIcon size={40} className="text-slate-500"/>}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">Sélectionnez une de vos photos de profil ou un média de la galerie ci-dessous (bouton 'Couverture').</p>
                    </div>
                     <div>
                        <Label htmlFor="galleryPrice" className="text-sm">Prix d'Accès à la Galerie (€)</Label>
                        <Input id="galleryPrice" type="number" value={galleryPrice} onChange={(e) => setGalleryPrice(parseFloat(e.target.value) || 0)} min="0" step="1" className="bg-slate-700 border-slate-600 mt-1"/>
                         <p className="text-[11px] text-gray-500 mt-1">Optionnel. Si 0€, les médias sont vendus individuellement.</p>
                    </div>
                    <Button onClick={handleSaveGallerySettings} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-xs">
                        <Lock size={14} className="mr-2"/> Enregistrer les Paramètres de la Galerie
                    </Button>
                </div>
                
                <h3 className="text-md font-semibold text-gray-300 mt-4 mb-2">Contenu de la Galerie</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {galleryItems.map((item, index) => (
                        <motion.div 
                            key={`gallery-${item.id}`}
                            layout
                            className="relative aspect-[3/4] rounded-lg overflow-hidden group shadow-lg"
                        >
                            <img-replace src={item.url} alt={item.alt || `Média galerie ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-1 p-1">
                                <Button size="sm" variant="outline" className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] w-full" onClick={() => handleSetAsGalleryCover(item.url)}>
                                    <ImageIcon size={12} className="mr-1" /> Couverture
                                </Button>
                                <Button size="sm" variant="outline" className="bg-white/20 hover:bg-white/30 border-none text-white text-[10px] w-full" onClick={() => handleEditGalleryItem(item)}>
                                    <Edit3 size={12} className="mr-1" /> Prix: {item.price}€
                                </Button>
                                <Button size="sm" variant="outline" className="bg-red-500/40 hover:bg-red-500/60 border-none text-white text-[10px] w-full" onClick={() => handleDeleteGalleryItem(item.id)}>
                                    <Trash2 size={12} className="mr-1" /> Suppr.
                                </Button>
                            </div>
                            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] px-1 py-0.5 rounded-full font-semibold">
                                {item.price}€
                            </div>
                        </motion.div>
                    ))}
                    {(galleryItems.length < MAX_PRIVATE_GALLERY_ITEMS) && (
                        <motion.button
                            onClick={handleAddGalleryItemLocal}
                            className="aspect-[3/4] rounded-lg border-2 border-dashed border-purple-500/70 flex flex-col items-center justify-center text-purple-400 hover:bg-purple-500/10 transition-colors"
                        >
                            <UploadCloud size={28} />
                            <span className="text-[10px] mt-1 text-center">Ajouter Média Galerie</span>
                        </motion.button>
                    )}
                </div>
                 {(galleryItems.length === 0) && (
                    <p className="text-xs text-gray-500 text-center py-4">Votre galerie privée est vide. Ajoutez des médias exclusifs !</p>
                )}

                {editingGalleryItem && (
                    <Dialog open={!!editingGalleryItem} onOpenChange={() => setEditingGalleryItem(null)}>
                        <DialogContent className="bg-slate-800 border-slate-700 text-white">
                            <DialogHeader>
                                <DialogTitle>Modifier Média de Galerie</DialogTitle>
                            </DialogHeader>
                            <img-replace src={editingGalleryItem.url} alt="Aperçu média" className="rounded-md max-h-60 object-contain mx-auto my-3"/>
                            <div>
                                <Label htmlFor="galleryItemPrice">Prix du média (€)</Label>
                                <Input id="galleryItemPrice" type="number" value={newGalleryItemPrice} onChange={(e) => setNewGalleryItemPrice(parseFloat(e.target.value))} min="0" step="0.5" className="bg-slate-700 mt-1"/>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setEditingGalleryItem(null)}>Annuler</Button>
                                <Button onClick={handleSaveGalleryItemChanges}>Enregistrer Prix</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </section>
        );
    };

    export default PrivateGallerySection;