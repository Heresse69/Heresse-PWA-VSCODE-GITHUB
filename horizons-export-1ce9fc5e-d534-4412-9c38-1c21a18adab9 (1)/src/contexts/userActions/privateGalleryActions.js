import { MAX_PRIVATE_GALLERY_ITEMS } from '@/contexts/UserContext';
    import { supabase } from '@/lib/supabaseClient';
    import { v4 as uuidv4 } from 'uuid';

    export const createOrUpdatePrivateGalleryLogic = async (setCurrentUser, galleryData, userId) => {
        setCurrentUser(prev => {
            const existingGalleryIndex = prev.privateGalleries.findIndex(g => g.id === galleryData.id);
            let updatedGalleries;
            if (existingGalleryIndex > -1) {
                updatedGalleries = prev.privateGalleries.map((g, index) => 
                    index === existingGalleryIndex ? { ...g, ...galleryData, itemCount: galleryData.items?.length ?? g.items.length } : g
                );
            } else {
                const newGallery = {
                    id: galleryData.id || `pg_${prev.id}_${Date.now()}`,
                    name: galleryData.name || "Ma galerie privée",
                    coverImage: galleryData.coverImage || (prev.profilePhotos.length > 0 ? prev.profilePhotos[0].url : 'https://source.unsplash.com/random/800x600/?abstract'),
                    price: galleryData.price || 5,
                    items: galleryData.items || [],
                    itemCount: galleryData.items?.length || 0,
                };
                updatedGalleries = [...prev.privateGalleries, newGallery];
            }
            return { ...prev, privateGalleries: updatedGalleries };
        });

        if (userId && galleryData.id) {
            const { error } = await supabase
                .from('user_galleries') 
                .upsert({
                    id: galleryData.id,
                    user_id: userId,
                    name: galleryData.name,
                    cover_image_url: galleryData.coverImage,
                    price: galleryData.price,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'id' });
            if (error) console.error('Error upserting gallery settings to Supabase:', error);
        }
    };

    export const addPrivateGalleryItemLogic = async (setCurrentUser, itemData, userId, galleryId) => {
        const newItem = { ...itemData, id: itemData.id || uuidv4() };

        setCurrentUser(prev => {
            let galleryToUpdate;
            let galleries = [...prev.privateGalleries];

            if (galleryId) {
                galleryToUpdate = galleries.find(g => g.id === galleryId);
            } else if (galleries.length > 0) {
                galleryToUpdate = galleries[0]; 
            }
            
            if (!galleryToUpdate) {
                galleryToUpdate = {
                    id: galleryId || `pg_${prev.id}_${Date.now()}`,
                    name: "Ma galerie privée",
                    coverImage: prev.profilePhotos.length > 0 ? prev.profilePhotos[0].url : 'https://source.unsplash.com/random/800x600/?abstract',
                    price: 5,
                    items: [],
                    itemCount: 0,
                };
                galleries.push(galleryToUpdate);
            }

            if (galleryToUpdate.items.length >= MAX_PRIVATE_GALLERY_ITEMS) {
                console.warn("Max gallery items reached");
                return prev; 
            }
            
            galleryToUpdate.items = [...galleryToUpdate.items, newItem];
            galleryToUpdate.itemCount = galleryToUpdate.items.length;
            
            return {
                ...prev,
                privateGalleries: galleries.map(g => g.id === galleryToUpdate.id ? galleryToUpdate : g)
            };
        });

        if (userId && galleryId) {
            const { error } = await supabase
                .from('private_gallery_media')
                .insert({
                    id: newItem.id,
                    user_id: userId, 
                    gallery_id: galleryId, 
                    url: newItem.url,
                    alt_text: newItem.alt || 'Média privé',
                    price: newItem.price,
                    media_type: newItem.type || 'photo',
                });
            if (error) console.error('Error adding gallery item to Supabase:', error);
        }
    };

    export const deletePrivateGalleryItemLogic = async (setCurrentUser, itemId, userId, galleryId) => {
        setCurrentUser(prev => {
            if (!galleryId) return prev;
            const galleryIndex = prev.privateGalleries.findIndex(g => g.id === galleryId);
            if (galleryIndex === -1) return prev;

            const updatedGallery = {
                ...prev.privateGalleries[galleryIndex],
                items: prev.privateGalleries[galleryIndex].items.filter(item => item.id !== itemId)
            };
            updatedGallery.itemCount = updatedGallery.items.length;
            
            const updatedGalleries = [...prev.privateGalleries];
            updatedGalleries[galleryIndex] = updatedGallery;

            return { ...prev, privateGalleries: updatedGalleries };
        });

        if (userId && itemId) {
            const { error } = await supabase
                .from('private_gallery_media')
                .delete()
                .match({ id: itemId, user_id: userId });
            if (error) console.error('Error deleting gallery item from Supabase:', error);
        }
    };

    export const updatePrivateGalleryItemPriceLogic = async (setCurrentUser, itemId, newPrice, userId, galleryId) => {
        setCurrentUser(prev => {
            if (!galleryId) return prev;
            const galleryIndex = prev.privateGalleries.findIndex(g => g.id === galleryId);
            if (galleryIndex === -1) return prev;

            const updatedItems = prev.privateGalleries[galleryIndex].items.map(item =>
                item.id === itemId ? { ...item, price: newPrice } : item
            );
            const updatedGallery = { ...prev.privateGalleries[galleryIndex], items: updatedItems };
            
            const updatedGalleries = [...prev.privateGalleries];
            updatedGalleries[galleryIndex] = updatedGallery;
            
            return { ...prev, privateGalleries: updatedGalleries };
        });
        
        if (userId && itemId) {
            const { error } = await supabase
                .from('private_gallery_media')
                .update({ price: newPrice, updated_at: new Date().toISOString() })
                .match({ id: itemId, user_id: userId });
            if (error) console.error('Error updating gallery item price in Supabase:', error);
        }
    };