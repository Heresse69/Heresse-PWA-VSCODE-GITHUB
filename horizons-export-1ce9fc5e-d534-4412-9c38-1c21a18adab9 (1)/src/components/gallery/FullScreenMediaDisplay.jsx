import React from 'react';
    import { Dialog, DialogContent } from "@/components/ui/dialog";
    import { X } from 'lucide-react';

    const FullScreenMediaDisplay = ({ mediaItem, onClose }) => {
      if (!mediaItem) return null;

      const handleContentClick = (e) => {
        e.stopPropagation(); 
      };

      return (
        <Dialog open={!!mediaItem} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
          <DialogContent
            className="bg-black/90 p-0 border-none max-w-[95vw] max-h-[90vh] w-auto h-auto flex items-center justify-center aspect-auto data-[state=open]:animate-none data-[state=closed]:animate-none"
            onClick={onClose} 
            style={{ animation: 'none' }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-4 right-4 z-50 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70"
              style={{ marginTop: `env(safe-area-inset-top)` }}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                paddingTop: `env(safe-area-inset-top)`,
                paddingBottom: `env(safe-area-inset-bottom)`
              }}
            >
              {mediaItem.media_type === "video" || (typeof mediaItem.url === 'string' && mediaItem.url.endsWith('.mp4')) ? (
                <video
                  src={mediaItem.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onClick={handleContentClick}
                />
              ) : (
                <img
                  src={mediaItem.url}
                  alt={mediaItem.alt_text || 'Média privé'}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onClick={handleContentClick}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    };

    export default FullScreenMediaDisplay;