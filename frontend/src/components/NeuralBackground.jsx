import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// All pages now use white background — this just syncs body color
export default function NeuralBackground() {
  const location = useLocation();

  useEffect(() => {
    // Auth pages and app pages — all white now
    document.body.style.background = "#ffffff";
    document.body.style.color = "#0f172a";
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, [location.pathname]);

  return null;
}
