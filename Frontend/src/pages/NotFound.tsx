import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageNotFound from "@/[components]/pageNotFound";
import Loader from "@/[components]/loader";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="bg-[#111111]">
      
      <PageNotFound/>
    </div>
  );
};

export default NotFound;
