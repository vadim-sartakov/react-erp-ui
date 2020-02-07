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

const getNextSizes = ({ x, y, interaction, preserveAspectRatio }) => {
  const diffX = x - interaction.startCoordinates.x;
  const diffY = y - interaction.startCoordinates.y;

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

  return nextSizes;
};

/**
 * 
 * @param {ResizeOptions} resizeOptions 
 */
const useResize = ({ sizes, onMouseMove, onMouseUp, preserveAspectRatio }) => {
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
      if (interaction && onMouseMove) {
        const nextSizes = getNextSizes({ x: event.clientX, y: event.clientY, interaction, preserveAspectRatio });
        onMouseMove(nextSizes, event);
      }
    };

    const handleMouseUp = event => {
      const interaction = interactionRef.current;
      if (interaction && onMouseUp) {
        const nextSizes = getNextSizes({ x: event.clientX, y: event.clientY, interaction, preserveAspectRatio });
        onMouseUp(nextSizes, event);
      }
      interactionRef.current = undefined;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onMouseMove, onMouseUp, preserveAspectRatio]);

  return handleMouseDown;

};

export default useResize;