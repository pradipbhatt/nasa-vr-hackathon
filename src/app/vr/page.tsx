// import { useEffect } from "react";
// import { useNavbar } from "../context/NavbarContext"; // adjust path if needed
// import { useNavigate } from "react-router-dom";
import EarthStory from "../components/EarthStory/index"; // adjust path if your index.tsx is here

export default function VR() {
  // const { setShowNavbar } = useNavbar();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   setShowNavbar(false); // hide navbar when this page is mounted
  //   return () => setShowNavbar(true); // restore navbar when leaving
  // }, [setShowNavbar]);

  return (
    <div className="relative w-full h-screen bg-primary text-text font-atkinson overflow-hidden">
      {/* VR / EarthStory Component */}
      <EarthStory />
    </div>
  );
}
