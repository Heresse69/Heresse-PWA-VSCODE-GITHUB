import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { ChevronLeft, MessageSquare, Heart, Lock, Image as ImageIcon, PlayCircle, Star, PlusCircle } from 'lucide-react';
    import { useUser } from '@/contexts/UserContext'; // Assuming you might want to interact with current user's data e.g. for wallet

    // Mock data - in a real app, this would come from an API
    const mockUsers = {
      'user1': { id: 'user1', name: 'Lucie', age: 28, bio: 'J\'aime manger des flans et des gourmandises...', distance: '11 km', profileImages: ['https://storage.googleapis.com/hostinger-horizons-assets-prod/1ce9fc5e-d534-4412-9c38-1c21a18adab9/48b8f095c0123ddc5a761d8a62431b0d.png', 'Woman smiling by a lake', 'Close-up portrait of a young woman'], photosRating: { average: 4.7, count: 15 }, privateGalleries: [{ id: 'lucie_pg1', name: 'Aventure Parisienne', coverImage: 'Eiffel Tower at sunset', itemCount: 10, price: 8 }] },
      'user2': { id: 'user2', name: 'Lucas', age: 28, bio: 'Développeur web passionné...', distance: '5 km', profileImages: ['Man hiking on a mountain trail', 'Man working on a laptop', 'Portrait of a smiling man with glasses'], photosRating: { average: 4.2, count: 8 }, privateGalleries: [] },
      'user3': { id: 'user3', name: 'Manon', age: 22, bio: 'Étudiante en art...', distance: '1 km', profileImages: ['Woman painting on a canvas', 'Woman visiting an art museum', 'Artistic portrait of a woman'], photosRating: { average: 4.9, count: 22 }, privateGalleries: [{ id: 'manon_pg1', name: 'Monde Sous-marin', coverImage: 'Colorful coral reef', itemCount: 20, price: 12 }] },
    };


    const UserProfilePage = () => {
      const { userId } = useParams();
      const navigate = useNavigate();
      const { toast } = useToast();
      const { currentUser, updateWalletBalance } = useUser(); // For paying for galleries
      const [profileData, setProfileData] = useState(null);
      const [currentImageIndex, setCurrentImageIndex] = useState(0);

      useEffect(() => {
        // Simulate fetching profile data
        const user = mockUsers[userId];
        if (user) {
          setProfileData(user);
        } else {
          toast({ title: "Profil introuvable", variant: "destructive" });
          navigate('/'); // Redirect if user not found
        }
      }, [userId, navigate, toast]);

      const handleImageNavigation = (direction) => {
        if (!profileData) return;
        const newIndex = direction === 'next' 
          ? (currentImageIndex + 1) % profileData.profileImages.length
          : (currentImageIndex - 1 + profileData.profileImages.length) % profileData.profileImages.length;
        setCurrentImageIndex(newIndex);
      };

      const handleUnlockGallery = (gallery) => {
        if (currentUser.walletBalance < gallery.price) {
            toast({title: "Solde insuffisant", description: `Il vous faut ${gallery.price}€ pour débloquer cette galerie.`, variant: "destructive"});
            return;
        }
        updateWalletBalance(-gallery.price);
        // In a real app, mark gallery as unlocked for current user
        toast({title: "Galerie débloquée!", description: `Vous avez accès à "${gallery.name}". ${gallery.price}€ déduits.`});
        // Potentially navigate to gallery view or update UI to show it's unlocked
      };

      if (!profileData) {
        return <div className="flex items-center justify-center h-full text-white">Chargement du profil...</div>;
      }

      return (
        <div className="h-full flex flex-col bg-gradient-to-b from-background to-slate-900 text-white overflow-y-auto">
          <header className="p-3 flex items-center space-x-3 bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-gray-300 hover:text-white">
              <ChevronLeft size={28} />
            </Button>
            <h3 className="font-semibold text-lg text-gradient-heresse">{profileData.name}</h3>
          </header>

          <div className="relative w-full aspect-[3/4] bg-slate-800">
            <img className="w-8 h-8 object-cover rounded-full border-2 border-white" alt={`${profileData.name} - photo ${index + 1}`} src={image} />
            
            {profileData.profileImages.length > 1 && (
              <>
                <Button variant="ghost" size="icon" onClick={() => handleImageNavigation('prev')} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"> <ChevronLeft size={24}/> </Button>
                <Button variant="ghost" size="icon" onClick={() => handleImageNavigation('next')} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"> <ChevronLeft size={24} className="rotate-180"/> </Button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5 p-2">
                  {profileData.profileImages.map((_, index) => ( <div key={index} className={`h-1.5 w-1.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}></div> ))}
                </div>
              </>
            )}
          </div>

          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{profileData.name}, {profileData.age}</h1>
              <div className="flex space-x-2">
                <Button size="icon" variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10 w-12 h-12"> <Heart size={24} /> </Button>
                <Button size="icon" className="rounded-full bg-gradient-to-r from-primary to-secondary text-white w-12 h-12" onClick={() => navigate(`/chat/${profileData.id}`)}> <MessageSquare size={24} /> </Button>
              </div>
            </div>
            
            {profileData.photosRating && profileData.photosRating.count > 0 && (
                <div className="flex items-center space-x-1 text-sm text-gray-300">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span>{profileData.photosRating.average.toFixed(1)}/5</span>
                    <span className="text-gray-400">({profileData.photosRating.count} notes photos)</span>
                </div>
            )}

            <p className="text-gray-300">{profileData.bio}</p>
            <p className="text-sm text-gray-400">À {profileData.distance}</p>

            {profileData.privateGalleries && profileData.privateGalleries.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mt-6 mb-2 text-gradient-heresse">Galeries Privées</h3>
                <div className="grid grid-cols-2 gap-3">
                  {profileData.privateGalleries.map(gallery => (
                    <div key={gallery.id} className="relative aspect-video bg-slate-700 rounded-lg overflow-hidden group">
                      <img  class="w-full h-full object-cover blur-sm" alt={`Couverture de ${gallery.name}`} src="https://images.unsplash.com/photo-1592177183170-a4256e44e072" />
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-2">
                        <Lock size={24} className="text-white mb-1" />
                        <p className="text-white text-sm font-semibold truncate">{gallery.name}</p>
                        <p className="text-xs text-gray-300 mb-1.5">{gallery.itemCount} médias</p>
                        <Button size="sm" className="bg-primary hover:bg-primary-hover text-xs" onClick={() => handleUnlockGallery(gallery)}>
                          Débloquer ({gallery.price}€)
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    export default UserProfilePage;