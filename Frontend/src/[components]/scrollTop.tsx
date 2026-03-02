import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the very top left of the page instantly
    window.scrollTo(0, 0);
  }, [pathname]); // This effect runs every time the path changes

  return null; // This component doesn't render anything visually
}