import { v4 as uuidv4 } from 'uuid';

    export const initialProfilePhotos = [
      { id: 'pf_verified', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', alt: 'Photo de profil vérifiée', isVerified: true },
      { id: 'pf2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', alt: 'Photo de profil 2', isVerified: false },
    ];
    
    export const initialPrivateGalleryItems = [
      { id: 'pg1', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW9kZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', alt: 'Média privé 1', price: 2, type: 'photo' },
      { id: 'pg2', url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vZGVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', alt: 'Média privé 2', price: 3, type: 'photo' },
      { id: 'pg_claudia_screen', url: 'https://jhdfpxazgplkudfcvuzr.supabase.co/storage/v1/object/sign/rsp/Galerie%20privee%20Claudia/Screen%20claudia.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzAxNTZiMmUwLWFiZDAtNDdjMC1hNjM4LTcxZTQ4ODIzNDg5MiJ9.eyJ1cmwiOiJyc3AvR2FsZXJpZSBwcml2ZWUgQ2xhdWRpYS9TY3JlZW4gY2xhdWRpYS5qcGciLCJpYXQiOjE3NDc4MzQ3MDQsImV4cCI6MTc1MDQyNjcwNH0.vj1E6mN5XVWXKPWl9xHLqhXfU-v3aVS27gcYXn_OFiA', alt: 'Média privé de Claudia (exemple)', price: 4, type: 'photo' },
    ];
    
    export const initialStoriesData = [
        { id: uuidv4(), userId: 'currentUserHerese', userName: 'Moi', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', type: 'image', duration: 5000, seen: false, timestamp: Date.now() - 1800000 },
        
        { id: uuidv4(), userId: 'user_lea', userName: 'Léa', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', type: 'image', duration: 5000, seen: false, timestamp: Date.now() - 2000000 },
        { id: uuidv4(), userId: 'user_lea', userName: 'Léa', url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8d29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=300&q=60', type: 'image', duration: 5000, seen: false, timestamp: Date.now() - 1900000 },
        
        { id: uuidv4(), userId: 'user_hugo', userName: 'Hugo', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', type: 'image', duration: 5000, seen: false, timestamp: Date.now() - 2200000 },
        
        { id: uuidv4(), userId: 'user_claudia', userName: 'Claudia', url: 'https://images.unsplash.com/photo-1558531027-76e86744oe4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyNjI5NjF8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFufGVufDB8MHx8fDE3MTYyODY2ODZ8MA&ixlib=rb-4.0.3&q=80&w=400', type: 'image', duration: 5000, seen: true, timestamp: Date.now() - 2500000 },
        { id: uuidv4(), userId: 'user_claudia', userName: 'Claudia', url: 'https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdvbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', type: 'image', duration: 5000, seen: false, timestamp: Date.now() - 2400000 },
        { id: uuidv4(), userId: 'user_claudia', userName: 'Claudia', url: 'https://images.unsplash.com/photo-1525879000488-bff128319cbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdvbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', type: 'image', duration: 5000, seen: false, timestamp: Date.now() - 2300000 },

        { id: uuidv4(), userId: 'user_theo', userName: 'Théo', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', type: 'image', duration: 5000, seen: false, timestamp: Date.now() - 3000000 },
        
        { id: uuidv4(), userId: 'user_emma', userName: 'Emma', url: 'https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHdvbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', type: 'image', duration: 5000, seen: false, timestamp: Date.now() - 3200000 },
        { id: uuidv4(), userId: 'user_emma', userName: 'Emma', url: 'https://images.unsplash.com/photo-1492681290082-e932832941e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHdvbWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=300&q=60', type: 'image', duration: 5000, seen: false, timestamp: Date.now() - 3100000 },

        { id: uuidv4(), userId: 'user_lucas', userName: 'Lucas', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=300&q=60', type: 'image', duration: 5000, seen: true, timestamp: Date.now() - 3500000 },
    ];
    
    // You can add more mock users and their data here if needed
    // For example:
    // export const mockProfiles = [ ... ];
    // export const mockMatches = [ ... ];