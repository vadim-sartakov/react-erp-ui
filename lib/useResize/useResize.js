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

var getNextSizes = function getNextSizes(_ref) {
  var x = _ref.x,
      y = _ref.y,
      interaction = _ref.interaction,
      preserveAspectRatio = _ref.preserveAspectRatio;
  var diffX = x - interaction.startCoordinates.x;
  var diffY = y - interaction.startCoordinates.y;
  var nextWidth = interaction.startSizes.width + diffX;
  var nextHeight = interaction.startSizes.height + diffY;

  if (preserveAspectRatio) {
    var widthRatio = nextWidth / interaction.startSizes.width;
    var heightRatio = nextHeight / interaction.startSizes.height;
    var maxRatio = Math.max(widthRatio, heightRatio);
    nextWidth = interaction.startSizes.width * maxRatio;
    nextHeight = interaction.startSizes.height * maxRatio;
  }

  var nextSizes = {
    width: nextWidth,
    height: nextHeight
  };
  return nextSizes;
};
/**
 * 
 * @param {ResizeOptions} resizeOptions 
 */


var useResize = function useResize(_ref2) {
  var sizes = _ref2.sizes,
      onMouseDown = _ref2.onMouseDown,
      onMouseMove = _ref2.onMouseMove,
      onMouseUp = _ref2.onMouseUp,
      preserveAspectRatio = _ref2.preserveAspectRatio;
  var interactionRef = useRef();
  var handleMouseDown = useCallback(function (event) {
    event.persist();
    event.stopPropagation();
    interactionRef.current = {
      startCoordinates: {
        x: event.clientX,
        y: event.clientY
      },
      startSizes: sizes
    };
    if (onMouseDown) onMouseDown(event);
  }, [onMouseDown, sizes]);
  useEffect(function () {
    var handleMouseMove = function handleMouseMove(event) {
      var interaction = interactionRef.current;

      if (interaction && onMouseMove) {
        var nextSizes = getNextSizes({
          x: event.clientX,
          y: event.clientY,
          interaction: interaction,
          preserveAspectRatio: preserveAspectRatio
        });
        onMouseMove(nextSizes, event);
      }
    };

    var handleMouseUp = function handleMouseUp(event) {
      var interaction = interactionRef.current;

      if (interaction && onMouseUp) {
        var nextSizes = getNextSizes({
          x: event.clientX,
          y: event.clientY,
          interaction: interaction,
          preserveAspectRatio: preserveAspectRatio
        });
        onMouseUp(nextSizes, event);
      }

      interactionRef.current = undefined;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return function () {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onMouseMove, onMouseUp, preserveAspectRatio]);
  return handleMouseDown;
};

export default useResize;