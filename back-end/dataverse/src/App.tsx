import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { GalleryView } from "./components/GalleryView";
import { AdminLogin } from "./components/AdminLogin";
import { AdminUpload } from "./components/AdminUpload";
import { Toaster } from "./components/ui/sonner";

type View = "landing" | "gallery" | "adminLogin" | "admin";

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

  const navigateToAdminLogin = () => {
    setCurrentView("adminLogin");
  };

  const navigateToAdmin = () => {
    setCurrentView("admin");
  };

  return (
    <>
      {currentView === "landing" && (
        <LandingPage onNavigateToGallery={navigateToGallery} onNavigateToAdmin={navigateToAdminLogin} />
      )}
      {currentView === "adminLogin" && (
        <AdminLogin onNavigateToHome={navigateToHome} onLoginSuccess={navigateToAdmin} />
      )}
      {currentView === "admin" && (
        <AdminUpload onNavigateToHome={navigateToHome} />
      )}
      {currentView === "gallery" && (
        <GalleryView
          initialSearchQuery={searchQuery}
          onNavigateToHome={navigateToHome}
        />
      )}
      <Toaster />
    </>
  );
}