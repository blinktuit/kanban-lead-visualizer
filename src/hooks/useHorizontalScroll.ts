
import { useEffect, useRef, useState } from 'react';

export function useHorizontalScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setHasOverflow(scrollWidth > clientWidth);
      }
    };
    
    // Initial check
    checkOverflow();
    
    // Add resize listener
    window.addEventListener('resize', checkOverflow);
    
    // Add mutation observer to detect when content changes
    if (scrollRef.current) {
      const observer = new MutationObserver(checkOverflow);
      observer.observe(scrollRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true 
      });
      
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', checkOverflow);
      };
    }
    
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);
  
  return { scrollRef, hasOverflow };
}
