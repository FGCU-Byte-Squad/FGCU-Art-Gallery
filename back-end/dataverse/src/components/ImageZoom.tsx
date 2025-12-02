import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ZoomIn, ZoomOut, Maximize2, X } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ImageZoomProps {
  src: string;
  alt: string;
  viewMode?: "desktop" | "mobile";
}

export function ImageZoom({ src, alt, viewMode = "desktop" }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  const handleFullscreen = () => {
    setIsZoomed(true);
    setScale(1);
    setShowInstructions(true);
    setSavedScrollPosition(window.scrollY);
  };

  const handleCloseFullscreen = () => {
    setIsZoomed(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setShowInstructions(true);
    window.scrollTo(0, savedScrollPosition);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isZoomed) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      setScale((prev) => {
        const newScale = Math.max(1, Math.min(prev + delta, 4));
        if (newScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
        return newScale;
      });
    }
  };

  // Reset position when scale changes to 1
  useEffect(() => {
    if (scale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  // Auto-hide instructions after 3 seconds when zoom opens
  useEffect(() => {
    if (isZoomed && showInstructions) {
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isZoomed, showInstructions]);

  // Handle escape key to close fullscreen and prevent page scrolling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) {
        handleCloseFullscreen();
      }
    };

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    if (isZoomed) {
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling on both html and body
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.position = "fixed";
      document.documentElement.style.top = `-${scrollY}px`;
      document.documentElement.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.top = "0";
      document.body.style.left = "0";
      // Prevent touch move for mobile devices
      document.addEventListener("touchmove", preventScroll, { passive: false });
      // Prevent wheel events on window
      document.addEventListener("wheel", preventScroll, { passive: false });
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.top = "";
      document.documentElement.style.width = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("wheel", preventScroll);
    };
  }, [isZoomed]);

  return (
    <>
      {/* Normal View */}
      {!isZoomed && (
        <div className="relative group cursor-pointer" onClick={handleFullscreen}>
          <ImageWithFallback
            src={src}
            alt={alt}
            className="w-full h-auto object-contain"
          />
          {/* Hide zoom button on mobile viewMode, show on hover for desktop */}
          {viewMode !== "mobile" && (
            <div className="absolute top-4 right-4 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none md:pointer-events-auto">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreen();
                }}
                size="sm"
                className="bg-white/90 hover:bg-white text-[#0067B1] shadow-lg rounded-xl gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                Zoom
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Zoom View */}
      {isZoomed && (
        createPortal(
          <div
            className={viewMode === "mobile" ? "fixed inset-0 bg-black flex items-center justify-center" : "fixed inset-0 bg-black"}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9999,
              margin: 0,
              padding: 0,
            }}
          >
            <div 
              className={viewMode === "mobile" ? "relative w-full max-w-[430px] h-full bg-black" : "relative w-full h-full"}
            >
              {/* Controls */}
              <div className="absolute top-6 right-6 flex gap-3 z-10">
                <Button
                  onClick={handleZoomOut}
                  disabled={scale <= 1}
                  size="sm"
                  className="bg-white/90 hover:bg-white text-gray-900 shadow-lg rounded-xl"
                >
                  <ZoomOut className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleZoomIn}
                  disabled={scale >= 4}
                  size="sm"
                  className="bg-white/90 hover:bg-white text-gray-900 shadow-lg rounded-xl"
                >
                  <ZoomIn className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleCloseFullscreen}
                  size="sm"
                  className="bg-white/90 hover:bg-white text-gray-900 shadow-lg rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Zoom Level Indicator */}
              <div className="absolute top-6 left-6 bg-white/90 px-4 py-2 rounded-xl shadow-lg z-10">
                <p className="text-sm font-medium text-gray-900">
                  {Math.round(scale * 100)}%
                </p>
              </div>

              {/* Instructions */}
              {showInstructions && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 px-6 py-3 rounded-xl shadow-lg z-10 transition-opacity duration-500">
                  <p className="text-sm text-gray-700">
                    {scale > 1 ? "Drag to pan • Scroll to zoom" : "Scroll or use buttons to zoom"}
                  </p>
                </div>
              )}

              {/* Image Container */}
              <div
                ref={imageRef}
                className="w-full h-full flex items-center justify-center overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                style={{
                  cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                }}
              >
                <div
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transition: isDragging ? "none" : "transform 0.2s ease-out",
                  }}
                  className="max-w-[90vw] max-h-[90vh]"
                >
                  <ImageWithFallback
                    src={src}
                    alt={alt}
                    className="max-w-full max-h-[90vh] object-contain pointer-events-none select-none"
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      )}
    </>
  );
}