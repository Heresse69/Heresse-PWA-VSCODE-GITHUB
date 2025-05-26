import { MAX_PROFILE_PHOTOS, MIN_PROFILE_PHOTOS } from '@/contexts/UserContext';

    export const addProfilePhotoLogic = (currentUser, setCurrentUser, photo) => {
        if (currentUser.profilePhotos.length >= MAX_PROFILE_PHOTOS) {
          return false; 
        }
        const newPhoto = { ...photo, id: `pf${Date.now()}`, isVerified: false };
        setCurrentUser(prev => ({
          ...prev,
          profilePhotos: [...prev.profilePhotos, newPhoto]
        }));
        return true;
    };
    
    export const deleteProfilePhotoLogic = (currentUser, setCurrentUser, photoId) => {
        const photoToDelete = currentUser.profilePhotos.find(p => p.id === photoId);
        if (photoToDelete && photoToDelete.isVerified) {
          return false; 
        }
        if (currentUser.profilePhotos.length <= MIN_PROFILE_PHOTOS) {
          return false;
        }
        setCurrentUser(prev => ({
          ...prev,
          profilePhotos: prev.profilePhotos.filter(p => p.id !== photoId)
        }));
        return true;
    };
    
    export const setMainProfilePictureLogic = (currentUser, setCurrentUser, photoId) => {
        const photoIndex = currentUser.profilePhotos.findIndex(p => p.id === photoId);
        if (photoIndex === -1 || photoIndex === 0) { 
          return false; 
        }
        
        const newProfilePhotos = [...currentUser.profilePhotos];
        const mainPic = newProfilePhotos.splice(photoIndex, 1)[0];
        newProfilePhotos.unshift(mainPic); 

        setCurrentUser(prev => ({
          ...prev,
          profilePhotos: newProfilePhotos,
          profilePicture: mainPic.url
        }));
        return true;
    };