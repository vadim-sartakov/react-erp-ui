import { useRef, useEffect, useCallback } from 'react';

var useClickAway = function useClickAway(ref, onClick) {
  var initialNode = useRef();
  var handleMouseDown = useCallback(function (e) {
    if (e.button === 0) initialNode.current = e.target;
  }, []);
  var handleMouseUp = useCallback(function (e) {
    if (e.button === 0 && ref.current && initialNode.current && initialNode.current.isEqualNode(e.target) && !ref.current.contains(e.target)) {
      onClick(e);
    }
  }, [ref, onClick]);
  useEffect(function () {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    return function () {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseUp]);
};

export default useClickAway;