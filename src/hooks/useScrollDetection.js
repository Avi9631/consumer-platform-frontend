import { useState, useEffect } from "react";

/**
 * Custom hook to detect scroll position
 * @param {number} threshold - Scroll position threshold in pixels
 * @returns {boolean} - Whether the scroll position is past the threshold
 */
export function useScrollDetection(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}
