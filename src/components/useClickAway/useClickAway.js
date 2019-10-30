import { useRef, useEffect, useCallback } from 'react';

const useClickAway = (ref, onClick) => {
  
  const initialNode = useRef();

  const handleMouseDown = useCallback(e => {
    if (e.button === 0) initialNode.current = e.target;
  }, []);

  const handleMouseUp = useCallback(e => {
    if (e.button === 0 &&
        ref.current &&
        initialNode.current && 
        initialNode.current.isEqualNode(e.target) &&
        !ref.current.contains(e.target)) {
      onClick(e);
    }
  }, [ref, onClick]);

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseUp]);

};

export default useClickAway;