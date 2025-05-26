import React from 'react';
    import { Button } from '@/components/ui/button';
    import { EyeOff, Filter as FilterIcon } from 'lucide-react';
    import { cn } from '@/lib/utils';

    const HomePageHeader = ({ isIncognito, onToggleIncognito, onOpenFilters }) => (
        <div className="w-full flex items-center justify-between px-4 py-2.5 z-10 absolute top-0 left-0 right-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent">
            <Button 
                variant={isIncognito ? "default" : "outline"}
                size="icon" 
                onClick={onToggleIncognito} 
                className={cn(
                    "w-9 h-9 rounded-full shadow-md border-none",
                    isIncognito 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'text-gray-300 bg-black/30 hover:bg-black/50 backdrop-blur-sm'
                )}
                aria-label={isIncognito ? 'Désactiver Incognito' : 'Activer Incognito'}
            >
                <EyeOff className="w-4 h-4" />
            </Button>
            <Button 
                variant="outline" 
                size="icon" 
                onClick={onOpenFilters} 
                className="text-gray-300 bg-black/30 hover:bg-black/50 backdrop-blur-sm w-9 h-9 rounded-full shadow-md border-none"
                aria-label="Ouvrir les filtres"
            >
                <FilterIcon className="w-4 h-4" />
            </Button>
        </div>
    );

    export default HomePageHeader;