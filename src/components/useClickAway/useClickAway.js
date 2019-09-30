import { useEffect, useCallback } from 'react';

const useClickAway = (ref, onClick) => {
  
  const handleMouseUp = useCallback(e => {
    if (e.button === 0 && ref.current && !ref.current.contains(e.target)) {
      onClick(e);
    }
  }, [ref, onClick]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

};

export default useClickAway;