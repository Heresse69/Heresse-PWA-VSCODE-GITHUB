import React from 'react';
    import { motion } from 'framer-motion';
    import { cn } from '@/lib/utils';
    import { Button } from '@/components/ui/button';
    import { FileImage as ImageIcon, RefreshCw, Star, Gift, Eye, Play } from 'lucide-react';

    const ChatMessageItem = ({ msg, onPhotoClick, onInitiateSendMedia }) => {
        const commonMediaContainerClasses = "w-48 p-2 rounded-xl group flex flex-col items-center justify-center text-center";
        
        return (
            <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.3 }} 
                className={cn("flex flex-col max-w-[75%] p-1 rounded-2xl shadow", msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start')}
            >
                {msg.type === 'text' && (
                    <div className={cn( "p-3 rounded-2xl", msg.sender === 'user' ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-lg' : 'bg-slate-700 text-gray-200 rounded-bl-lg' )}>
                        <p className="text-sm">{msg.text}</p>
                    </div>
                )}
                {msg.type === 'photo' && msg.sender !== 'user' && (
                    <>
                        {msg.status === 'received_unopened' && (
                             <div onClick={() => onPhotoClick(msg)} className={cn( "relative w-40 h-52 rounded-xl overflow-hidden cursor-pointer group bg-slate-700" )}>
                                <img className={cn("w-full h-full object-cover transition-all duration-300 blur-md scale-110")} alt="Média flouté" src={msg.photoUrl} />
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                                    <ImageIcon size={32} className="text-white/70 mb-2"/>
                                    <p className="text-white text-xs font-semibold">Photo privée</p>
                                    <p className="text-white text-[10px]">Appuyez pour voir ({msg.price.toFixed(2)}€)</p>
                                </div>
                            </div>
                        )}
                        {msg.status === 'received_opened' && !msg.replayed && (
                            <div className={cn(commonMediaContainerClasses, "bg-slate-600")}>
                                <p className="text-sm text-white mb-2">Média ouvert</p>
                                <Button onClick={() => onPhotoClick({ ...msg, isReplayAction: true })} size="sm" className="bg-primary/80 hover:bg-primary text-white text-xs w-full">
                                    <RefreshCw size={14} className="mr-1.5"/> Replay ({ (msg.originalPrice / 2).toFixed(2) }€)
                                </Button>
                                {!msg.rated && (
                                    <Button onClick={() => onPhotoClick({ ...msg, isRateAction: true })} size="sm" variant="outline" className="mt-1.5 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 text-xs w-full">
                                        <Star size={14} className="mr-1.5"/> Noter
                                    </Button>
                                )}
                            </div>
                        )}
                        {msg.status === 'received_opened' && msg.replayed && (
                             <div className={cn(commonMediaContainerClasses, "bg-slate-600")}>
                                <p className="text-sm text-white">Photo rejouée</p>
                                 {!msg.rated && (
                                    <Button onClick={() => onPhotoClick({ ...msg, isRateAction: true })} size="sm" variant="outline" className="mt-1.5 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 text-xs w-full">
                                        <Star size={14} className="mr-1.5"/> Noter
                                    </Button>
                                )}
                            </div>
                        )}
                    </>
                )}
                 {msg.type === 'photo' && msg.sender === 'user' && (
                     <div onClick={() => onPhotoClick(msg)} className={cn( "relative w-40 h-52 rounded-xl overflow-hidden cursor-pointer group", msg.status === 'sent_opened' ? 'border-2 border-green-500' : 'bg-gradient-to-br from-primary to-secondary' )}>
                        <img className={cn("w-full h-full object-cover transition-all duration-300")} alt="Média envoyé" src={msg.photoUrl} />
                        {msg.status === 'sent_opened' && (<div className="absolute bottom-1 right-1 bg-green-500/80 text-white text-[9px] px-1.5 py-0.5 rounded-full flex items-center"><Eye size={10} className="mr-0.5"/>Vu</div>)}
                        {msg.status !== 'sent_opened' && (<div className="absolute bottom-1 right-1 bg-slate-500/80 text-white text-[9px] px-1.5 py-0.5 rounded-full">Envoyé</div>)}
                    </div>
                 )}


                {msg.type === 'media_request' && (
                    <div className={cn("p-3 rounded-2xl text-sm", msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-slate-700 text-gray-200 rounded-bl-lg flex items-center')}>
                        <Gift size={18} className="mr-2 shrink-0"/>
                        {msg.sender === 'user' ? msg.text : <><span>{msg.senderName || msg.sender} vous demande un média.</span><Button size="xs" className="ml-2 bg-primary/80 text-xs" onClick={onInitiateSendMedia}>Répondre</Button></>}
                    </div>
                )}
                <span className="text-xs opacity-70 mt-1 px-2">{msg.timestamp}</span>
            </motion.div>
        );
    };

    export default ChatMessageItem;