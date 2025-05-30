import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
    import { supabase } from '@/lib/supabaseClient';
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
      const [seenStories, setSeenStories] = useState(new Set());

      const fetchUserProfile = useCallback(async (userId) => {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select(`
            *,
            profile_photos:profile_photos_user_profile_photos (id, url, is_main, is_verified, created_at),
            user_galleries (
              id, name, cover_image_url, price,
              items:private_gallery_media (id, url, alt_text, price, media_type)
            ),
            stories:user_stories (id, user_id, url, type, created_at, duration, seen_by)
          `)
          .eq('id', userId)
          .single();
      
        if (userError) {
          console.error('Error fetching user profile from Supabase:', userError);
          return null;
        }
        
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if(authError || !authUser?.user) {
            console.error("Error fetching auth user for unlocked galleries:", authError);
            return {...userData, unlocked_galleries_ids: []};
        }
        
        const { data: unlockedGalleriesData, error: unlockedGalleriesError } = await supabase
            .from('users')
            .select('unlocked_galleries')
            .eq('id', authUser.user.id)
            .single();

        if (unlockedGalleriesError) {
            console.error("Error fetching unlocked galleries for user:", unlockedGalleriesError);
        }

        return { ...userData, unlocked_galleries_ids: unlockedGalleriesData?.unlocked_galleries || [] };
      }, []);
      
      const mapSupabaseUserToCurrentUser = (supabaseUser) => {
        if (!supabaseUser) return {};
        
        const profilePhotosMapped = supabaseUser.profile_photos?.map(p => ({
            id: p.id,
            url: p.url,
            main: p.is_main,
            verified: p.is_verified,
            timestamp: p.created_at
        })) || initialProfilePhotos;

        const mainProfilePic = profilePhotosMapped.find(p => p.main)?.url || initialProfilePhotos[0]?.url;

        return {
          id: supabaseUser.id,
          name: supabaseUser.full_name || supabaseUser.raw_user_meta_data?.full_name || supabaseUser.raw_user_meta_data?.name || 'Utilisateur',
          email: supabaseUser.email,
          profilePicture: supabaseUser.profile_picture_url || supabaseUser.raw_user_meta_data?.avatar_url || mainProfilePic,
          bio: supabaseUser.bio || supabaseUser.raw_user_meta_data?.bio || "Bio non définie.",
          walletBalance: supabaseUser.wallet_balance || 0,
          profilePhotos: profilePhotosMapped,
          privateGalleries: supabaseUser.user_galleries?.map(g => ({
            id: g.id,
            name: g.name,
            coverImage: g.cover_image_url || mainProfilePic,
            price: g.price,
            items: g.items?.map(i => ({ id: i.id, url: i.url, alt: i.alt_text, type: i.media_type, price: i.price })) || [],
            itemCount: g.items?.length || 0,
          })) || [],
          stories: supabaseUser.stories?.map(s => ({...s, timestamp: s.created_at, seen: s.seen_by?.includes(currentUser?.id)})) || [], // currentUser can be stale here
          unlockedGalleries: supabaseUser.unlocked_galleries_ids || [],
          unlockedMedia: supabaseUser.unlocked_media || [], // This might need specific fetching logic if stored separately
          rawUserData: supabaseUser, // keep raw for other potential uses
        };
      };

      useEffect(() => {
        const initializeUser = async () => {
          setLoading(true);
          const { data: { session } } = await supabase.auth.getSession();
          
          let userIdToLoad = 'currentUserHerese'; 
          let finalUserObject = { ...currentUser };

          if (session?.user) {
            userIdToLoad = session.user.id;
            const supabaseProfile = await fetchUserProfile(userIdToLoad);
            if (supabaseProfile) {
              finalUserObject = { ...currentUser, ...mapSupabaseUserToCurrentUser(supabaseProfile) };
              finalUserObject.stories = initialStoriesData.filter(s => s.userId === finalUserObject.id || s.userId === 'currentUserHerese'); // Ensure 'Moi' stories
            } else {
              console.warn(`Supabase profile not found for ${userIdToLoad}, using local defaults with ID override.`);
              finalUserObject.id = userIdToLoad; 
            }
          } else {
             console.warn("No active Supabase session, using local default 'currentUserHerese'.");
             finalUserObject.stories = initialStoriesData.filter(s => s.userId === 'currentUserHerese');
          }
          setCurrentUser(finalUserObject);
          setLoading(false);
        };

        initializeUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setLoading(true);
            if (event === 'SIGNED_IN' && session?.user) {
              const supabaseProfile = await fetchUserProfile(session.user.id);
               if (supabaseProfile) {
                const mappedUser = mapSupabaseUserToCurrentUser(supabaseProfile);
                setCurrentUser(prev => ({...prev, ...mappedUser, stories: initialStoriesData.filter(s => s.userId === mappedUser.id || s.userId === 'currentUserHerese')}));
              } else {
                // Minimal update if profile fetch fails but session exists
                setCurrentUser(prev => ({...prev, id: session.user.id, email: session.user.email, stories: initialStoriesData.filter(s => s.userId === session.user.id || s.userId === 'currentUserHerese') }));
              }
            } else if (event === 'SIGNED_OUT') {
              // Reset to a default anonymous-like state or a specific local default
              const localDefault = {
                id: 'currentUserHerese', name: 'Robin Testeur', email: 'robin.testeur@example.com',
                profilePicture: initialProfilePhotos[0].url, bio: "Passionné...", walletBalance: 150.75,
                profilePhotos: initialProfilePhotos, privateGalleries: [{ id: `pg_currentUserHerese_default`, name: "Ma galerie privée", coverImage: initialProfilePhotos[0].url, price: 5, items: initialPrivateGalleryItems, itemCount: initialPrivateGalleryItems.length }],
                stories: initialStoriesData.filter(s => s.userId === 'currentUserHerese'),
                premiumStatus: { subscriptionType: null, incognitoMode: false, canRewind: false, canSuperlike: true, canBoost: false },
                settings: { notifications: true, theme: 'dark', minLiveCallDuration: 1 },
                stats: { profileViews: 1024, matches: 42, photosSold: 15, revenueGenerated: 75.50, averageRating: 4.2 },
                photoRatings: {}, newMatchesCount: 5, totalUnreadMessagesCount: 3,
                unlockedGalleries: [], unlockedMedia: [],
              };
              setCurrentUser(localDefault);
            }
            setLoading(false);
          }
        );
        
        return () => {
          authListener?.subscription?.unsubscribe();
        };
      }, [fetchUserProfile]);


      const updateWalletBalance = (amount) => {
        setCurrentUser(prev => ({
          ...prev,
          walletBalance: Math.max(0, prev.walletBalance + amount)
        }));
        // TODO: Persist to Supabase: supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', currentUser.id)
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
      
      const updateBio = (newBio) => {
        setCurrentUser(prev => ({ ...prev, bio: newBio }));
        // TODO: Persist to Supabase: supabase.from('profiles').update({ bio: newBio }).eq('id', currentUser.id)
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