import React from 'react';
    import { motion } from 'framer-motion';
    import { cn } from '@/lib/utils';

    const CardWrapper = React.forwardRef(({ children, controls, onDragStart, onDrag, onDragEnd, isTopCard, ...props }, ref) => {

      const handleInternalDragStart = (event, info) => {
        if (onDragStart) {
          onDragStart(event, info);
        }
      };

      const handleInternalDrag = (event, info) => {
        if (onDrag) {
          onDrag(event, info);
        }
      };

      const handleInternalDragEnd = (event, info) => {
        if (onDragEnd) {
          onDragEnd(event, info);
        }
      };

      return (
        <motion.div
          ref={ref}
          drag={isTopCard ? true : false}
          dragElastic={0.5} 
          onDragStart={handleInternalDragStart}
          onDrag={handleInternalDrag}
          onDragEnd={handleInternalDragEnd}
          animate={controls}
          style={{
            ...props.style, 
            touchAction: isTopCard ? 'pan-y' : 'auto', 
          }}
          className={cn(
            "absolute w-full h-full select-none",
            isTopCard ? "cursor-grab active:cursor-grabbing" : "cursor-default"
          )}
          {...props}
        >
          {children}
        </motion.div>
      );
    });
    CardWrapper.displayName = 'CardWrapper';

    export default CardWrapper;