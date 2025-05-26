import React, { useState } from 'react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Camera } from 'lucide-react';

    const SendMediaModal = ({ isOpen, onOpenChange, onConfirmSendMedia }) => {
      const [mediaPrice, setMediaPrice] = useState(1);
      const [previewUrl, setPreviewUrl] = useState('');

      const handleGeneratePreview = () => {
        setPreviewUrl(`https://source.unsplash.com/random/400x300/?selfie,portrait&t=${Date.now()}`);
      };

      React.useEffect(() => {
        if (isOpen) {
          handleGeneratePreview();
        } else {
          setPreviewUrl('');
          setMediaPrice(1);
        }
      }, [isOpen]);

      const handleConfirm = () => {
        if (previewUrl) {
          onConfirmSendMedia(mediaPrice, previewUrl);
        }
      };
      
      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm w-[90vw]">
            <DialogHeader>
              <DialogTitle className="text-gradient-heresse">Envoyer un Média</DialogTitle>
              <DialogDescription className="text-gray-400">Prenez une photo (simulation) et fixez un prix (1€ - 3€).</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="w-full h-48 bg-slate-700 rounded-md flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Prévisualisation" className="w-full h-full object-cover"/>
                ) : (
                  <>
                    <Camera size={48} className="text-gray-500" />
                    <p className="absolute text-gray-400 text-sm mt-16">Prévisualisation (simulée)</p>
                  </>
                )}
              </div>
              <Button onClick={handleGeneratePreview} variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10">Nouvelle Prévisualisation</Button>
              <div>
                <Label htmlFor="mediaPrice">Prix du média (€)</Label>
                <Input
                  id="mediaPrice"
                  type="number"
                  value={mediaPrice}
                  onChange={(e) => setMediaPrice(parseFloat(e.target.value) || 0)}
                  min="1"
                  max="3"
                  step="0.5"
                  className="bg-slate-700 border-slate-600 mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button onClick={handleConfirm} className="bg-primary hover:bg-primary-hover" disabled={!previewUrl}>Envoyer le média</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default SendMediaModal;