import React, { useState, useRef } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { UploadCloud, Camera, UserCheck, CheckCircle } from 'lucide-react';

    const KycPage = ({ onKycComplete }) => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const [idImage, setIdImage] = useState(null);
      const [selfieImage, setSelfieImage] = useState(null);
      const [referenceImage, setReferenceImage] = useState(null);
      const [idImagePreview, setIdImagePreview] = useState(null);
      const [selfieImagePreview, setSelfieImagePreview] = useState(null);
      const [referenceImagePreview, setReferenceImagePreview] = useState(null);

      const idInputRef = useRef(null);
      const selfieInputRef = useRef(null);
      const referenceInputRef = useRef(null);

      const handleImageUpload = (event, setImage, setPreview) => {
        const file = event.target.files[0];
        if (file) {
          setImage(file);
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };

      const handleSubmitKyc = () => {
        if (!idImage || !selfieImage || !referenceImage) {
          toast({ title: "Erreur KYC", description: "Veuillez télécharger toutes les images requises.", variant: "destructive" });
          return;
        }
        // Simulate KYC processing
        toast({ title: "Vérification en cours...", description: "Vos documents sont en cours de traitement.", variant: "default" });
        setTimeout(() => {
          toast({ title: "KYC Validé!", description: "Votre identité a été vérifiée avec succès.", className: "bg-green-500 text-white" });
          onKycComplete();
          navigate('/');
        }, 2000);
      };
      
      const FileUploadArea = ({ label, onFileChange, inputRef, previewSrc, icon: Icon, requiredText }) => (
        <div className="space-y-1.5 w-full">
          <Label className="block text-[11px] font-medium text-gray-200">{label} <span className="text-red-400">*</span></Label>
          <div 
            onClick={() => inputRef.current?.click()} 
            className="mt-1 flex justify-center px-3 py-4 border-2 border-dashed border-gray-500 rounded-md cursor-pointer hover:border-primary transition-colors bg-white/5"
          >
            {previewSrc ? (
              <img  src={previewSrc} alt="Preview" className="h-20 w-auto object-contain rounded" />
            ) : (
              <div className="space-y-1 text-center">
                <Icon className="mx-auto h-8 w-8 text-gray-400" />
                <p className="text-xs text-gray-300">Cliquer pour {requiredText}</p>
                <p className="text-[10px] text-gray-400">PNG, JPG, GIF jusqu'à 10MB</p>
              </div>
            )}
          </div>
          <Input type="file" accept="image/*" ref={inputRef} onChange={onFileChange} className="hidden" />
        </div>
      );


      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xs bg-black/20 backdrop-blur-lg shadow-2xl rounded-xl p-5 space-y-4"
          >
            <div className="text-center">
               <UserCheck className="mx-auto h-12 w-12 text-primary mb-2" />
              <h2 className="text-xl font-bold text-white tracking-tight">Vérification d'Identité (KYC)</h2>
              <p className="mt-1 text-center text-[11px] text-gray-300">Pour assurer la sécurité de notre communauté, veuillez compléter ces étapes.</p>
            </div>

            <div className="space-y-3">
                <FileUploadArea 
                    label="Pièce d'Identité (Recto)"
                    onFileChange={(e) => handleImageUpload(e, setIdImage, setIdImagePreview)}
                    inputRef={idInputRef}
                    previewSrc={idImagePreview}
                    icon={UploadCloud}
                    requiredText="télécharger votre ID"
                />
                <FileUploadArea 
                    label="Selfie avec Pièce d'Identité"
                    onFileChange={(e) => handleImageUpload(e, setSelfieImage, setSelfieImagePreview)}
                    inputRef={selfieInputRef}
                    previewSrc={selfieImagePreview}
                    icon={Camera}
                    requiredText="prendre un selfie"
                />
                 <FileUploadArea 
                    label="Photo de Référence (fixe)"
                    onFileChange={(e) => handleImageUpload(e, setReferenceImage, setReferenceImagePreview)}
                    inputRef={referenceInputRef}
                    previewSrc={referenceImagePreview}
                    icon={CheckCircle}
                    requiredText="télécharger votre photo de référence"
                />
                 <p className="text-[10px] text-gray-400 px-1">La photo de référence sera affichée sur votre profil et ne pourra pas être supprimée. Choisissez-la bien !</p>
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
              <Button onClick={handleSubmitKyc} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-sm py-2 rounded-full">
                Soumettre pour Vérification
              </Button>
            </motion.div>
          </motion.div>
        </div>
      );
    };

    export default KycPage;