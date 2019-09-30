import { useState, useEffect } from 'react';

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

  const [interaction, setInteraction] = useState();

  const handleMouseDown = event => {
    setInteraction({
      startCoordinates: { x: event.clientX, y: event.clientY },
      startSizes: sizes
    });
  };

  useEffect(() => {
    const handleMouseMove = event => {
      if (interaction) {
        const diffX = event.clientX - interaction.startCoordinates.x;
        const diffY = event.clientY - interaction.startCoordinates.y;

        let nextWidth = interaction.startSizes.width + (preserveAspectRatio ? Math.max(diffX, diffY) : diffX);
        let nextHeight = interaction.startSizes.height + (preserveAspectRatio ? Math.max(diffX, diffY) : diffY);

        const nextSizes =
            {
              width: nextWidth,
              height: nextHeight
            };
        onSizesChange(nextSizes);
      }
    };

    const handleMouseUp = () => {
      if (interaction) setInteraction(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interaction, onSizesChange, preserveAspectRatio]);

  return handleMouseDown;

};

export default useResize;