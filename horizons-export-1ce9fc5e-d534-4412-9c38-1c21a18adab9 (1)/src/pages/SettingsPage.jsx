import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Slider } from "@/components/ui/slider"
    import { Checkbox } from '@/components/ui/checkbox';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { ChevronLeft, Save, User, MapPin, Users, Bell, Palette, DollarSign, HelpCircle, Shield, LogOut } from 'lucide-react';
    import { useUser } from '@/contexts/UserContext';
    import { cn } from '@/lib/utils';

    const SettingsPage = () => {
        const navigate = useNavigate();
        const { toast } = useToast();
        const { currentUser, setCurrentUser, updateUserSettings } = useUser();

        const [name, setName] = useState('');
        const [bio, setBio] = useState('');
        const [city, setCity] = useState('');
        const [searchRadius, setSearchRadius] = useState([25]);
        const [ageRange, setAgeRange] = useState([18, 35]);
        const [showAge, setShowAge] = useState(true);
        const [showDistance, setShowDistance] = useState(true);
        const [liveCallCost, setLiveCallCost] = useState(2);
        const [minLiveCallDuration, setMinLiveCallDuration] = useState(1);

        useEffect(() => {
            if (currentUser) {
                setName(currentUser.name || '');
                setBio(currentUser.bio || '');
                setCity(currentUser.settings?.city || 'Paris');
                setSearchRadius(currentUser.settings?.searchRadius || [25]);
                setAgeRange(currentUser.settings?.ageRange || [18, 35]);
                setShowAge(currentUser.settings?.showAge !== false);
                setShowDistance(currentUser.settings?.showDistance !== false);
                setLiveCallCost(currentUser.settings?.liveCallCost || 2);
                setMinLiveCallDuration(currentUser.settings?.minLiveCallDuration || 1);
            }
        }, [currentUser]);


        const handleSaveChanges = () => {
            updateUserSettings({
                name,
                bio,
                city,
                searchRadius,
                ageRange,
                showAge,
                showDistance,
                liveCallCost,
                minLiveCallDuration
            });
            setCurrentUser(prev => ({ ...prev, name, bio }));
            toast({ title: "Paramètres sauvegardés", description: "Vos préférences ont été mises à jour." });
            navigate('/profile');
        };

        const SettingItem = ({ icon: Icon, title, children }) => (
            <div className="py-3 border-b border-slate-700/60">
                <div className="flex items-center mb-1.5">
                    <Icon size={18} className="mr-2.5 text-primary" />
                    <h4 className="text-sm font-semibold text-gray-200">{title}</h4>
                </div>
                <div className="pl-7 space-y-2 text-xs">{children}</div>
            </div>
        );

        if (!currentUser) {
            return <div className="flex items-center justify-center h-full text-white">Chargement...</div>;
        }

        return (
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="pb-16 bg-gradient-to-b from-background to-slate-900 text-white min-h-full"
            >
                <header className="p-3 flex items-center justify-between bg-background/80 backdrop-blur-sm sticky top-0 z-10 border-b border-border">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-gray-300 hover:text-white">
                        <ChevronLeft size={28} />
                    </Button>
                    <h1 className="text-lg font-bold text-gradient-heresse">Paramètres</h1>
                    <Button variant="ghost" size="icon" onClick={handleSaveChanges} className="text-primary hover:text-primary-hover">
                        <Save size={22} />
                    </Button>
                </header>
                
                <div className="p-3 space-y-1">
                    <SettingItem icon={User} title="Profil Public">
                        <div> <Label htmlFor="name" className="text-gray-400">Nom d'affichage</Label> <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-700/80 mt-0.5 h-8 text-xs" /> </div>
                        <div> <Label htmlFor="bio" className="text-gray-400">Bio (courte)</Label> <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="bg-slate-700/80 mt-0.5 text-xs min-h-[60px]" maxLength={150}/> </div>
                        <div className="flex items-center space-x-2"> <Checkbox id="showAge" checked={showAge} onCheckedChange={setShowAge} className="border-primary data-[state=checked]:bg-primary" /> <Label htmlFor="showAge" className="text-gray-300">Afficher mon âge sur mon profil</Label> </div>
                    </SettingItem>

                    <SettingItem icon={MapPin} title="Découverte">
                        <div> <Label htmlFor="city" className="text-gray-400">Ma ville</Label> <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="bg-slate-700/80 mt-0.5 h-8 text-xs" /> </div>
                        <div> <Label className="text-gray-400">Distance de recherche: {searchRadius[0]} km</Label> <Slider value={searchRadius} max={100} step={1} onValueChange={setSearchRadius} className="mt-1.5 [&>span:first-child]:h-1 [&>span:first-child_span]:h-1 [&>span:first-child_span]:bg-primary [&>span:first-child_a]:h-3.5 [&>span:first-child_a]:w-3.5 [&>span:first-child_a]:border-2"/> </div>
                        <div className="flex items-center space-x-2"> <Checkbox id="showDistance" checked={showDistance} onCheckedChange={setShowDistance} className="border-primary data-[state=checked]:bg-primary" /> <Label htmlFor="showDistance" className="text-gray-300">Afficher ma distance sur mon profil</Label> </div>
                    </SettingItem>
                    
                    <SettingItem icon={Users} title="Préférences de Match">
                        <div> <Label className="text-gray-400">Tranche d'âge: {ageRange[0]} - {ageRange[1]} ans</Label> <Slider value={ageRange} min={18} max={70} step={1} onValueChange={setAgeRange} className="mt-1.5 [&>span:first-child]:h-1 [&>span:first-child_span]:h-1 [&>span:first-child_span]:bg-primary [&>span:first-child_a]:h-3.5 [&>span:first-child_a]:w-3.5 [&>span:first-child_a]:border-2"/> </div>
                    </SettingItem>

                    <SettingItem icon={DollarSign} title="Monétisation">
                        <div> <Label className="text-gray-400">Coût des appels Live (par minute): {liveCallCost}€</Label> <Slider value={[liveCallCost]} min={0} max={5} step={0.5} onValueChange={(value) => setLiveCallCost(value[0])} className="mt-1.5 [&>span:first-child]:h-1 [&>span:first-child_span]:h-1 [&>span:first-child_span]:bg-primary [&>span:first-child_a]:h-3.5 [&>span:first-child_a]:w-3.5 [&>span:first-child_a]:border-2"/> </div>
                        <div> <Label className="text-gray-400">Durée minimale d'appel (pour être joint): {minLiveCallDuration} min</Label> <Slider value={[minLiveCallDuration]} min={1} max={10} step={1} onValueChange={(value) => setMinLiveCallDuration(value[0])} className="mt-1.5 [&>span:first-child]:h-1 [&>span:first-child_span]:h-1 [&>span:first-child_span]:bg-primary [&>span:first-child_a]:h-3.5 [&>span:first-child_a]:w-3.5 [&>span:first-child_a]:border-2"/> </div>
                    </SettingItem>

                    <SettingItem icon={Bell} title="Notifications">
                        <p className="text-gray-400">Gérer les notifications (Bientôt disponible)</p>
                    </SettingItem>
                    <SettingItem icon={Palette} title="Apparence">
                        <p className="text-gray-400">Changer le thème (Bientôt disponible)</p>
                    </SettingItem>
                    <SettingItem icon={Shield} title="Sécurité et Confidentialité">
                        <Button variant="link" className="text-primary p-0 h-auto text-xs hover:underline">Gérer les appareils connectés</Button><br/>
                        <Button variant="link" className="text-primary p-0 h-auto text-xs hover:underline">Changer le mot de passe</Button>
                    </SettingItem>
                     <SettingItem icon={HelpCircle} title="Aide et Support">
                        <Button variant="link" className="text-primary p-0 h-auto text-xs hover:underline">FAQ</Button><br/>
                        <Button variant="link" className="text-primary p-0 h-auto text-xs hover:underline">Contacter le support</Button>
                    </SettingItem>

                    <div className="pt-4">
                        <Button variant="destructiveOutline" className="w-full text-red-400 border-red-400/50 hover:bg-red-400/10 hover:text-red-300 h-9 text-xs" onClick={() => { navigate('/login'); }}>
                            <LogOut size={14} className="mr-2"/> Se Déconnecter
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    };

    export default SettingsPage;