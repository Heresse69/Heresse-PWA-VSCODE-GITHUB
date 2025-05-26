import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { X } from 'lucide-react';

    const FullScreenMediaViewer = ({ mediaUrl, onClose }) => {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center z-[100] select-none p-0"
                onClick={onClose} 
            >
                <div className="absolute top-0 left-0 right-0 h-[env(safe-area-inset-top)] bg-black/50 z-[102]"></div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); onClose(); }} 
                    className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/30 rounded-full z-[101]"
                    style={{ marginTop: `calc(env(safe-area-inset-top) + 0.5rem)`}}
                >
                    <X size={24} />
                </Button>
                <div 
                    className="relative w-full h-full flex items-center justify-center" 
                    style={{ 
                        paddingTop: `env(safe-area-inset-top)`,
                        paddingBottom: `env(safe-area-inset-bottom)` 
                    }}
                    
                >
                    <img 
                        src={mediaUrl} 
                        alt="Média en plein écran" 
                        className="max-w-full max-h-full object-contain cursor-pointer" 
                        onClick={(e) => { e.stopPropagation(); onClose(); }} 
                    />
                </div>
            </motion.div>
        );
    };

    export default FullScreenMediaViewer;