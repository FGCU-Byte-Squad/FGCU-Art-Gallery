import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { GalleryView } from "./components/GalleryView";

type View = "landing" | "gallery";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("landing");
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  const navigateToGallery = (query?: string) => {
    setSearchQuery(query);
    setCurrentView("gallery");
  };

  const navigateToHome = () => {
    setSearchQuery(undefined);
    setCurrentView("landing");
  };

  if (currentView === "landing") {
    return <LandingPage onNavigateToGallery={navigateToGallery} />;
  }

  return (
    <GalleryView
      initialSearchQuery={searchQuery}
      onNavigateToHome={navigateToHome}
    />
  );
}
