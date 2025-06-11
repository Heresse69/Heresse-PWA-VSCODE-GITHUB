import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
    import { supabase } from '../services/supabase/client.js';
    import { authService } from '../services/supabase/auth.js';
    import { profilesService } from '../services/supabase/profiles.js';
    import { 
        initialProfilePhotos, 
        initialPrivateGalleryItems, 
        initialStoriesData 
    } from '@/data/userData';

    import { 
        addProfilePhotoLogic, 
        deleteProfilePhotoLogic, 
        setMainProfilePictureLogic 
    } from '@/contexts/userActions/profilePhotoActions';
    import { 
        createOrUpdatePrivateGalleryLogic, 
        addPrivateGalleryItemLogic,
        deletePrivateGalleryItemLogic,
        updatePrivateGalleryItemPriceLogic
    } from '@/contexts/userActions/privateGalleryActions';
    import { 
        addStoryLogic, 
        markStoryAsSeenLogic 
    } from '@/contexts/userActions/storyActions';

    const UserContext = createContext(null);

    export const useUser = () => useContext(UserContext);

    export const MAX_PROFILE_PHOTOS = 10;
    export const MIN_PROFILE_PHOTOS = 1; 
    export const MAX_PRIVATE_GALLERY_ITEMS = 25;

    export const UserProvider = ({ children }) => {
      const [currentUser, setCurrentUser] = useState({
        id: 'currentUserHerese', 
        name: 'Robin Testeur',
        email: 'robin.testeur@example.com',
        profilePicture: initialProfilePhotos[0].url, 
        bio: "Passionné par la tech et les voyages. Toujours prêt pour une nouvelle aventure ! 🚀\nCherche des connexions authentiques.",
        walletBalance: 150.75,
        profilePhotos: initialProfilePhotos, 
        privateGalleries: [ 
            {
                id: `pg_currentUserHerese_default`,
                name: "Ma galerie privée",
                coverImage: initialProfilePhotos.length > 0 ? initialProfilePhotos[0].url : 'https://source.unsplash.com/random/800x600/?abstract',
                price: 5, // Default price for user's own gallery for selling individual items
                items: initialPrivateGalleryItems,
                itemCount: initialPrivateGalleryItems.length,
            }
        ],
        stories: initialStoriesData.filter(s => s.userId === 'currentUserHerese'),
        premiumStatus: {
          subscriptionType: null, 
          incognitoMode: false,
          canRewind: false,
          canSuperlike: true, 
          canBoost: false,
        },
        settings: {
          notifications: true,
          theme: 'dark',
          minLiveCallDuration: 1,
        },
        stats: {
          profileViews: 1024,
          matches: 42,
          photosSold: 15,
          revenueGenerated: 75.50,
          averageRating: 4.2,
        },
        photoRatings: {},
        newMatchesCount: 5, 
        totalUnreadMessagesCount: 3,
        unlockedGalleries: [], 
        unlockedMedia: [],
      });

      const [stories, setStories] = useState(initialStoriesData);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [seenStories, setSeenStories] = useState(new Set());      const fetchUserProfile = useCallback(async (userId) => {
        try {
          const profileResult = await profilesService.getProfile(userId);
          
          if (profileResult.success) {
            return profileResult.profile;
          } else {
            console.error('Error fetching user profile from Supabase:', profileResult.error);
            return null;
          }
        } catch (error) {
          console.error('Error in fetchUserProfile:', error);
          return null;
        }
      }, []);
      
      const mapSupabaseUserToCurrentUser = (supabaseProfile) => {
        if (!supabaseProfile) return {};
        
        const profilePhotosMapped = supabaseProfile.photos?.map(p => ({
            id: p.id,
            url: p.url,
            main: p.is_main,
            verified: p.is_verified,
            timestamp: p.created_at
        })) || initialProfilePhotos;

        const mainProfilePic = profilePhotosMapped.find(p => p.main)?.url || initialProfilePhotos[0]?.url;

        return {
          id: supabaseProfile.id,
          name: supabaseProfile.full_name || 'Utilisateur',
          email: supabaseProfile.email || '',
          profilePicture: supabaseProfile.profile_picture_url || mainProfilePic,
          bio: supabaseProfile.bio || "Bio non définie.",
          walletBalance: supabaseProfile.wallet_balance || 0,
          age: supabaseProfile.age,
          city: supabaseProfile.city,
          profilePhotos: profilePhotosMapped,
          privateGalleries: supabaseProfile.galleries?.map(g => ({
            id: g.id,
            name: g.name,
            coverImage: g.cover_image_url || mainProfilePic,
            price: g.price,
            items: g.items?.map(i => ({ 
              id: i.id, 
              url: i.url, 
              alt: i.alt_text, 
              type: i.media_type, 
              price: i.price 
            })) || [],
            itemCount: g.items?.length || 0,
          })) || [],
          stories: supabaseProfile.stories?.map(s => ({
            ...s, 
            timestamp: s.created_at, 
            seen: false // À calculer selon la logique métier
          })) || [],
          unlockedGalleries: supabaseProfile.unlocked_galleries || [],
          unlockedMedia: supabaseProfile.unlocked_media || [],
          premiumStatus: supabaseProfile.premium_status || {
            subscriptionType: null, 
            incognitoMode: false,
            canRewind: false,
            canSuperlike: true, 
            canBoost: false,
          },
          settings: supabaseProfile.settings || {
            notifications: true,
            theme: 'dark',
            minLiveCallDuration: 1,
          },
          stats: {
            profileViews: supabaseProfile.profile_views || 0,
            matches: supabaseProfile.matches_count || 0,
            photosSold: supabaseProfile.photos_sold || 0,
            revenueGenerated: supabaseProfile.revenue_generated || 0,
            averageRating: supabaseProfile.average_rating || 0,
          },
          photoRatings: supabaseProfile.photo_ratings || {},
          newMatchesCount: supabaseProfile.new_matches_count || 0,
          totalUnreadMessagesCount: supabaseProfile.unread_messages_count || 0,
          rawUserData: supabaseProfile,
        };
      };

      useEffect(() => {
        const initializeUser = async () => {
          setLoading(true);
          
          try {
            const { data: { session } } = await supabase.auth.getSession();
            
            let userIdToLoad = 'currentUserHerese'; 
            let finalUserObject = { ...currentUser };

            if (session?.user) {
              userIdToLoad = session.user.id;
              const supabaseProfile = await fetchUserProfile(userIdToLoad);
              
              if (supabaseProfile) {
                finalUserObject = { 
                  ...currentUser, 
                  ...mapSupabaseUserToCurrentUser(supabaseProfile) 
                };
                finalUserObject.stories = initialStoriesData.filter(s => 
                  s.userId === finalUserObject.id || s.userId === 'currentUserHerese'
                );
              } else {
                console.warn(`Supabase profile not found for ${userIdToLoad}, using local defaults with ID override.`);
                finalUserObject.id = userIdToLoad; 
                finalUserObject.email = session.user.email;
              }
            } else {
               console.warn("No active Supabase session, using local default 'currentUserHerese'.");
               finalUserObject.stories = initialStoriesData.filter(s => s.userId === 'currentUserHerese');
            }
            
            setCurrentUser(finalUserObject);
          } catch (error) {
            console.error('Error during user initialization:', error);
            setError('Erreur lors de l\'initialisation de l\'utilisateur');
          } finally {
            setLoading(false);
          }
        };

        initializeUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setLoading(true);
            
            try {
              if (event === 'SIGNED_IN' && session?.user) {
                const supabaseProfile = await fetchUserProfile(session.user.id);
                
                if (supabaseProfile) {
                  const mappedUser = mapSupabaseUserToCurrentUser(supabaseProfile);
                  setCurrentUser(prev => ({
                    ...prev, 
                    ...mappedUser, 
                    stories: initialStoriesData.filter(s => 
                      s.userId === mappedUser.id || s.userId === 'currentUserHerese'
                    )
                  }));
                } else {
                  // Minimal update if profile fetch fails but session exists
                  setCurrentUser(prev => ({
                    ...prev, 
                    id: session.user.id, 
                    email: session.user.email, 
                    stories: initialStoriesData.filter(s => 
                      s.userId === session.user.id || s.userId === 'currentUserHerese'
                    )
                  }));
                }
              } else if (event === 'SIGNED_OUT') {
                // Reset to a default anonymous-like state or a specific local default
                const localDefault = {
                  id: 'currentUserHerese', 
                  name: 'Robin Testeur', 
                  email: 'robin.testeur@example.com',
                  profilePicture: initialProfilePhotos[0].url, 
                  bio: "Passionné par la tech et les voyages. Toujours prêt pour une nouvelle aventure ! 🚀\nCherche des connexions authentiques.", 
                  walletBalance: 150.75,
                  profilePhotos: initialProfilePhotos, 
                  privateGalleries: [{ 
                    id: `pg_currentUserHerese_default`, 
                    name: "Ma galerie privée", 
                    coverImage: initialProfilePhotos[0].url, 
                    price: 5, 
                    items: initialPrivateGalleryItems, 
                    itemCount: initialPrivateGalleryItems.length 
                  }],
                  stories: initialStoriesData.filter(s => s.userId === 'currentUserHerese'),
                  premiumStatus: { 
                    subscriptionType: null, 
                    incognitoMode: false, 
                    canRewind: false, 
                    canSuperlike: true, 
                    canBoost: false 
                  },
                  settings: { 
                    notifications: true, 
                    theme: 'dark', 
                    minLiveCallDuration: 1 
                  },
                  stats: { 
                    profileViews: 1024, 
                    matches: 42, 
                    photosSold: 15, 
                    revenueGenerated: 75.50, 
                    averageRating: 4.2 
                  },
                  photoRatings: {}, 
                  newMatchesCount: 5, 
                  totalUnreadMessagesCount: 3,
                  unlockedGalleries: [], 
                  unlockedMedia: [],
                };
                setCurrentUser(localDefault);
              }
            } catch (error) {
              console.error('Error during auth state change:', error);
              setError('Erreur lors du changement d\'état d\'authentification');
            } finally {
              setLoading(false);
            }
          }
        );
        
        return () => {
          authListener?.subscription?.unsubscribe();
        };
      }, [fetchUserProfile]);


      const updateWalletBalance = async (amount) => {
        const newBalance = Math.max(0, currentUser.walletBalance + amount);
        
        setCurrentUser(prev => ({
          ...prev,
          walletBalance: newBalance
        }));

        // Persister dans Supabase
        try {
          const updateResult = await profilesService.updateProfile(currentUser.id, {
            wallet_balance: newBalance
          });
          
          if (!updateResult.success) {
            console.error('Erreur lors de la mise à jour du portefeuille:', updateResult.error);
            // Revenir à l'ancienne valeur en cas d'erreur
            setCurrentUser(prev => ({
              ...prev,
              walletBalance: currentUser.walletBalance
            }));
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour du portefeuille:', error);
        }
      };

      const addUnlockedGallery = (galleryId) => {
        setCurrentUser(prev => {
            const newUnlockedGalleries = [...new Set([...(prev.unlockedGalleries || []), galleryId])];
            // Persist to Supabase (example, ensure 'unlocked_galleries' is an array type in Supabase profiles table)
            // supabase.from('users').update({ unlocked_galleries: newUnlockedGalleries }).eq('id', prev.id).then().catch();
            return { ...prev, unlockedGalleries: newUnlockedGalleries };
        });
      };

      const addUnlockedMediaItem = (mediaId) => {
        setCurrentUser(prev => ({
          ...prev,
          unlockedMedia: [...new Set([...(prev.unlockedMedia || []), mediaId])]
        }));
        // TODO: Persist to Supabase if needed for individual media items
      };

      const updatePremiumStatus = (key, value) => {
        setCurrentUser(prev => ({
          ...prev,
          premiumStatus: {
            ...prev.premiumStatus,
            [key]: value
          }
        }));
      };
      
      const updateStats = (newStats) => {
        setCurrentUser(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                ...newStats
            }
        }));
      };

      const updatePhotoRating = (userId, rating) => {
        setCurrentUser(prev => {
            const userRatings = prev.photoRatings[userId] || [];
            const newRatings = [...userRatings, rating];
            const newAverage = newRatings.reduce((acc, r) => acc + r, 0) / newRatings.length;
            return {
                ...prev,
                photoRatings: {
                    ...prev.photoRatings,
                    [userId]: newRatings
                },
                stats: { 
                    ...prev.stats,
                    averageRating: newAverage 
                }
            };
        });
      };
      
      const addProfilePhoto = (photo) => addProfilePhotoLogic(currentUser, setCurrentUser, photo);
      const deleteProfilePhoto = (photoId) => deleteProfilePhotoLogic(currentUser, setCurrentUser, photoId);
      const setMainProfilePicture = (photoId) => setMainProfilePictureLogic(currentUser, setCurrentUser, photoId);
      
      const createOrUpdatePrivateGallery = (galleryData) => createOrUpdatePrivateGalleryLogic(setCurrentUser, galleryData, currentUser.id);
      const addPrivateGalleryItem = (itemData, galleryId) => addPrivateGalleryItemLogic(setCurrentUser, itemData, currentUser.id, galleryId);
      const deletePrivateGalleryItem = (itemId, galleryId) => deletePrivateGalleryItemLogic(setCurrentUser, itemId, currentUser.id, galleryId);
      const updatePrivateGalleryItemPrice = (itemId, newPrice, galleryId) => updatePrivateGalleryItemPriceLogic(setCurrentUser, itemId, newPrice, currentUser.id, galleryId);
      
      const addStory = (storyData) => addStoryLogic(currentUser, setStories, setCurrentUser, storyData);
      const markStoryAsSeen = (storyId) => {
        console.log('📖 Marquer story comme vue:', storyId);
        setSeenStories(prev => new Set([...prev, storyId]));
        markStoryAsSeenLogic(setStories, setCurrentUser, storyId);
      };
      
      const updateBio = async (newBio) => {
        // Mise à jour locale immédiate pour une meilleure UX
        setCurrentUser(prev => ({ ...prev, bio: newBio }));
        
        // Persister dans Supabase
        try {
          const updateResult = await profilesService.updateProfile(currentUser.id, {
            bio: newBio
          });
          
          if (!updateResult.success) {
            console.error('Erreur lors de la mise à jour de la bio:', updateResult.error);
            // Revenir à l'ancienne valeur en cas d'erreur
            setCurrentUser(prev => ({ ...prev, bio: currentUser.bio }));
          }
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la bio:', error);
        }
      };

      // Nouvelles fonctions pour l'authentification
      const signUp = async (email, password, userData = {}) => {
        try {
          const result = await authService.signUp(email, password, userData);
          return result;
        } catch (error) {
          setError(error.message);
          return { success: false, error: error.message };
        }
      };

      const signIn = async (email, password) => {
        try {
          const result = await authService.signIn(email, password);
          return result;
        } catch (error) {
          setError(error.message);
          return { success: false, error: error.message };
        }
      };

      const signOut = async () => {
        try {
          const result = await authService.signOut();
          return result;
        } catch (error) {
          setError(error.message);
          return { success: false, error: error.message };
        }
      };

      // Fonction pour effacer les erreurs
      const clearError = () => {
        setError(null);
      };

      const value = {
        currentUser,
        updateWalletBalance,
        addUnlockedGallery,
        unlockedGalleries: currentUser.unlockedGalleries,
        addUnlockedMediaItem,
        unlockedMedia: currentUser.unlockedMedia,
        updatePremiumStatus,
        updateStats,
        updatePhotoRating,
        addProfilePhoto,
        deleteProfilePhoto,
        setMainProfilePicture,
        createOrUpdatePrivateGallery,
        addPrivateGalleryItem,
        deletePrivateGalleryItem, 
        updatePrivateGalleryItemPrice,
        stories, // All stories for story player
        addStory,
        markStoryAsSeen,
        updateBio,
        setCurrentUser, // Be cautious with direct exposure
        supabase, 
        loading,
        error,
        clearError,
        // Authentication functions
        signUp,
        signIn,
        signOut,
        // Constants
        MAX_PROFILE_PHOTOS,
        MIN_PROFILE_PHOTOS,
        MAX_PRIVATE_GALLERY_ITEMS,
        seenStories,
      };

      return (
        <UserContext.Provider value={value}>
          {children}
        </UserContext.Provider>
      );
    };