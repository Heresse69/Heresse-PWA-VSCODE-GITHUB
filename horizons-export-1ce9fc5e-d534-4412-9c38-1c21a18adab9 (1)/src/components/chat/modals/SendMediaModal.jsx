import React, { useState } from 'react';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from '@/components/ui/alert-dialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { ImagePlus, Send, XCircle, AlertTriangle } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const SendMediaModal = ({ isOpen, onOpenChange, onConfirmSendMedia }) => {
      const [price, setPrice] = useState(1); 
      const [photoPreview, setPhotoPreview] = useState(null);
      const [selectedFile, setSelectedFile] = useState(null);
      const { toast } = useToast();

      const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) { 
            toast({
              title: "Fichier trop volumineux",
              description: "La taille de l'image ne doit pas dépasser 5MB.",
              variant: "destructive",
            });
            return;
          }
          setSelectedFile(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setPhotoPreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };

      const handleConfirm = () => {
        if (!selectedFile) {
          toast({ title: "Aucune photo sélectionnée", description: "Veuillez choisir une photo à envoyer.", variant: "destructive" });
          return;
        }
        if (price < 1 || price > 3) {
          toast({ title: "Prix invalide", description: "Le prix doit être entre 1€ et 3€.", variant: "destructive" });
          return;
        }
        onConfirmSendMedia(price, photoPreview);
        handleClose();
      };

      const handleClose = () => {
        setPhotoPreview(null);
        setSelectedFile(null);
        setPrice(1);
        onOpenChange(false);
      };

      return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
          <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center text-xl">
                <ImagePlus size={24} className="mr-2 text-primary" />
                Envoyer un Média Privé
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400 pt-2">
                Choisissez une photo, fixez un prix (entre 1€ et 3€), et envoyez-la.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-6 my-6">
              <div className="space-y-2">
                <Label htmlFor="photo-upload" className="text-slate-300">Choisir une photo :</Label>
                <Input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  className="bg-slate-700 border-slate-600 text-white file:text-primary file:font-semibold hover:file:bg-primary/10"
                />
              </div>

              {photoPreview && (
                <div className="mt-4 border-2 border-dashed border-primary/50 p-2 rounded-lg bg-slate-700/30">
                  <img-replace src={photoPreview} alt="Aperçu du média" className="rounded-md max-h-48 w-auto mx-auto" />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="price" className="text-slate-300">Prix du média (entre 1€ et 3€) :</Label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => setPrice(p => Math.max(1, p - 1))} className="text-primary border-primary hover:bg-primary/10 h-10 w-10">-</Button>
                  <Input 
                    id="price" 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(Math.max(1, Math.min(3, parseInt(e.target.value) || 1)))}
                    min="1" max="3" step="1"
                    className="bg-slate-700 border-slate-600 text-white text-center h-10 w-20 text-lg font-bold"
                  />
                  <Button variant="outline" size="icon" onClick={() => setPrice(p => Math.min(3, p + 1))} className="text-primary border-primary hover:bg-primary/10 h-10 w-10">+</Button>
                  <span className="text-2xl font-bold text-primary">€</span>
                </div>
                 {(price < 1 || price > 3) && (
                    <p className="text-xs text-red-400 flex items-center mt-1">
                        <AlertTriangle size={14} className="mr-1" /> Le prix doit être entre 1€ et 3€.
                    </p>
                )}
              </div>
            </div>

            <AlertDialogFooter className="mt-2">
              <AlertDialogCancel asChild>
                <Button variant="outline" onClick={handleClose} className="bg-slate-600 hover:bg-slate-500 border-slate-500 text-white">
                  <XCircle size={18} className="mr-2" /> Annuler
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button 
                  onClick={handleConfirm} 
                  disabled={!selectedFile || price < 1 || price > 3}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Send size={18} className="mr-2" />Envoyer pour {price}€
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    };

    export default SendMediaModal;