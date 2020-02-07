import { useRef, useEffect, useCallback } from 'react';

/**
 * @typedef {Object} Sizes
 * @property {number} width
 * @property {number} height
 */

/**
 * @callback onSizesChange
 * @param {Sizes} sizes 
 */

/**
 * @typedef {Object} ResizeOptions
 * @property {Sizes} sizes
 * @property {onSizesChange} onSizesChange
 * @property {boolean} preserveAspectRatio
 */

/**
 * 
 * @param {ResizeOptions} resizeOptions 
 */
const useResize = ({ sizes, onSizesChange, preserveAspectRatio }) => {
  const interactionRef = useRef();

  const handleMouseDown = useCallback(event => {
    event.persist();
    event.stopPropagation();
    interactionRef.current = {
      startCoordinates: { x: event.clientX, y: event.clientY },
      startSizes: sizes
    };
  }, [sizes]);

  useEffect(() => {
    const handleMouseMove = event => {
      const interaction = interactionRef.current;
      if (interaction) {
        const diffX = event.clientX - interaction.startCoordinates.x;
        const diffY = event.clientY - interaction.startCoordinates.y;

        let nextWidth = interaction.startSizes.width + diffX;
        let nextHeight = interaction.startSizes.height + diffY;

        if (preserveAspectRatio) {
          const widthRatio = nextWidth / interaction.startSizes.width;
          const heightRatio = nextHeight / interaction.startSizes.height;
          const maxRatio = Math.max(widthRatio, heightRatio);
          nextWidth = interaction.startSizes.width * maxRatio;
          nextHeight = interaction.startSizes.height * maxRatio;
        }

        const nextSizes = {
          width: nextWidth,
          height: nextHeight
        };
        onSizesChange(nextSizes);
      }
    };

    const handleMouseUp = () => {
      interactionRef.current = undefined;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onSizesChange, preserveAspectRatio]);

  return handleMouseDown;

};

export default useResize;