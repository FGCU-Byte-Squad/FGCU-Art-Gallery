import {
  X,
  ExternalLink,
  Copy,
  Check,
  Download,
  FileText,
  Music,
  Play,
  Pause,
  Video,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertTriangle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ImageZoom } from "./ImageZoom";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner@2.0.3";
import { ArtworkDetailMobile } from "./ArtworkDetailMobile";

interface ArtworkDetailProps {
  artwork: {
    id: string;
    title: string;
    creator?: string;
    year?: string;
    description?: string;
    persistentUrl?: string;
    imageUrl?: string;
    audioUrl?: string;
    videoUrl?: string;
    medium?: string;
    genre?: string;
    dataset?: string;
    // Additional Dataverse metadata
    persistentId?: string;
    storageIdentifier?: string;
    versionNumber?: number;
    versionMinorNumber?: number;
    releaseTime?: string;
    lastUpdateTime?: string;
    createTime?: string;
    license?: string;
    termsOfAccess?: string;
    fileAccessRequest?: boolean;
    metadataLanguage?: string;
    publicationDate?: string;
    depositor?: string;
    dateOfDeposit?: string;
    subjects?: string[];
    keywords?: string[];
    authorName?: string;
    authorAffiliation?: string;
    authorIdentifierScheme?: string;
    authorIdentifier?: string;
    pointOfContact?: string;
    pointOfContactEmail?: string;
    datasetVersion?: {
      datasetPersistentId?: string;
    };
    // Art-specific metadata
    accessionNumber?: string;
    artistNationality?: string;
    centuryCreated?: string;
    dateCreated?: string;
    geographicLocation?: string;
    artType?: string;
    dimensions?: string;
    printmaking?: string;
    printEditionNumber?: string;
    artStyle?: string;
    collection?: string;
    creditLine?: string;
  };
  onClose: () => void;
  viewMode?: "desktop" | "mobile";
}

export function ArtworkDetail({
  artwork,
  onClose,
  viewMode = "desktop",
}: ArtworkDetailProps) {
  const [copied, setCopied] = useState(false);
  const [mlaCopied, setMlaCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCopyrightDialog, setShowCopyrightDialog] = useState(false);
  const [pendingDownloadType, setPendingDownloadType] = useState<"image" | "audio" | "video" | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const persistentId = artwork.storageIdentifier
    ? "doi:" +
      artwork.storageIdentifier.replace(
        "dataverse_files://",
        "",
      )
    : undefined;

  // Prevent body scroll when modal is open
  useEffect(() => {
    // Save current scroll position
    const scrollY = window.scrollY;
    
    // Prevent scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore scroll position and allow scrolling
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Preserve video state when entering/exiting fullscreen
  useEffect(() => {
    if (videoRef.current && artwork.videoUrl) {
      // Store current playback state
      const wasPlaying = !videoRef.current.paused;
      const savedTime = videoRef.current.currentTime;
      
      // Small timeout to let the video element re-render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = savedTime;
          if (wasPlaying) {
            videoRef.current.play();
          }
        }
      }, 0);
    }
  }, [isFullscreen]);

  // Prevent scrolling when fullscreen is active
  useEffect(() => {
    if (isFullscreen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling on the modal overlay
      const modalElement = document.querySelector('.fixed.inset-0.z-50') as HTMLElement;
      if (modalElement) {
        modalElement.style.overflow = 'hidden';
      }
    } else {
      // Restore scrolling
      const modalElement = document.querySelector('.fixed.inset-0.z-50') as HTMLElement;
      if (modalElement) {
        modalElement.style.overflow = 'auto';
      }
    }

    return () => {
      // Cleanup: restore scrolling
      const modalElement = document.querySelector('.fixed.inset-0.z-50') as HTMLElement;
      if (modalElement) {
        modalElement.style.overflow = 'auto';
      }
    };
  }, [isFullscreen]);

  const generateCitation = () => {
    let citation = "";

    if (persistentId) {
      citation += `Persistent Identifier: ${persistentId}\n`;
    }
    if (artwork.publicationDate) {
      citation += `Publication Date: ${artwork.publicationDate}\n`;
    }
    if (artwork.title) {
      citation += `Title: ${artwork.title}\n`;
    }
    if (artwork.authorName) {
      citation += `Author: ${artwork.authorName}`;
      if (artwork.authorAffiliation) {
        citation += ` (${artwork.authorAffiliation})`;
      }
      if (
        artwork.authorIdentifierScheme === "ORCID" &&
        artwork.authorIdentifier
      ) {
        citation += ` - ORCID: ${artwork.authorIdentifier}`;
      }
      citation += "\n";
    }
    if (artwork.pointOfContact) {
      citation += `Point of Contact: ${artwork.pointOfContact}\n`;
    }
    if (artwork.description) {
      citation += `Description: ${artwork.description}\n`;
    }
    if (artwork.subjects && artwork.subjects.length > 0) {
      citation += `Subject: ${artwork.subjects.join(", ")}\n`;
    }
    if (artwork.keywords && artwork.keywords.length > 0) {
      citation += `Keyword: ${artwork.keywords.join(", ")}\n`;
    }

    return citation;
  };

  const generateMLACitation = () => {
    // MLA format: Creator Last Name, Creator First Name. Title of Image. Date, Title of Website, URL. Accessed Day Mon. Year.
    const creator = artwork.creator || "Unknown Artist";
    const title = artwork.title || "Untitled";
    const date = artwork.dateCreated || artwork.year || "n.d.";
    const currentDate = new Date();
    const accessDate = `${currentDate.getDate()} ${currentDate.toLocaleString("default", { month: "short" })}. ${currentDate.getFullYear()}`;

    // Format: Creator. "Title." Date. FGCU Dataverse, https://dataverse.fgcu.edu. Accessed Date.
    let mlaCitation = `${creator}. "${title}." ${date}. `;
    mlaCitation += `FGCU Dataverse`;
    if (persistentId) {
      mlaCitation += `, ${persistentId}`;
    }
    mlaCitation += `. Accessed ${accessDate}.`;

    return mlaCitation;
  };

  const copyCitation = async () => {
    const citation = generateCitation();

    try {
      // Try modern clipboard API first
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback to older method
      try {
        const textArea = document.createElement("textarea");
        textArea.value = citation;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        textArea.remove();

        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          console.error(
            "Failed to copy citation using fallback method",
          );
        }
      } catch (fallbackErr) {
        console.error("Failed to copy citation:", fallbackErr);
      }
    }
  };

  const copyMLACitation = async () => {
    const mlaCitation = generateMLACitation();

    try {
      await navigator.clipboard.writeText(mlaCitation);
      setMlaCopied(true);
      setTimeout(() => setMlaCopied(false), 2000);
    } catch (err) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = mlaCitation;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        textArea.remove();

        if (successful) {
          setMlaCopied(true);
          setTimeout(() => setMlaCopied(false), 2000);
        }
      } catch (fallbackErr) {
        console.error(
          "Failed to copy MLA citation:",
          fallbackErr,
        );
      }
    }
  };

  const generateCopyrightStatement = () => {
    const year = artwork.dateCreated || artwork.year || new Date().getFullYear();
    const creator = artwork.creator || "Unknown Artist";
    return `© ${year} ${creator}. All rights reserved. This work is from the FGCU Dataverse Collection. Unauthorized reproduction or distribution is prohibited.`;
  };

  const handleDownloadClick = (type: "image" | "audio" | "video") => {
    setPendingDownloadType(type);
    setShowCopyrightDialog(true);
  };

  const proceedWithDownload = () => {
    if (pendingDownloadType === "image" && artwork.imageUrl) {
      const link = document.createElement("a");
      link.href = artwork.imageUrl;
      link.download = `${artwork.title.replace(/[^a-z0-9]/gi, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image Downloaded", {
        description: "The image has been downloaded successfully.",
      });
    } else if (pendingDownloadType === "audio" && artwork.audioUrl) {
      const link = document.createElement("a");
      link.href = artwork.audioUrl;
      link.download = `${artwork.title.replace(/[^a-z0-9]/gi, "_")}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Audio Downloaded", {
        description: "The audio has been downloaded successfully.",
      });
    } else if (pendingDownloadType === "video" && artwork.videoUrl) {
      const link = document.createElement("a");
      link.href = artwork.videoUrl;
      link.download = `${artwork.title.replace(/[^a-z0-9]/gi, "_")}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Video Downloaded", {
        description: "The video has been downloaded successfully.",
      });
    }
    
    setShowCopyrightDialog(false);
    setPendingDownloadType(null);
  };

  const cancelDownload = () => {
    setShowCopyrightDialog(false);
    setPendingDownloadType(null);
  };

  const downloadImage = () => {
    if (artwork.imageUrl) {
      toast.info("Downloading Image", {
        description: generateCopyrightStatement(),
        duration: 5000,
      });
      
      // Create a link element and trigger download
      const link = document.createElement("a");
      link.href = artwork.imageUrl;
      link.download = `${artwork.title.replace(/[^a-z0-9]/gi, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAudio = () => {
    if (artwork.audioUrl) {
      toast.info("Downloading Audio", {
        description: generateCopyrightStatement(),
        duration: 5000,
      });
      
      const link = document.createElement("a");
      link.href = artwork.audioUrl;
      link.download = `${artwork.title.replace(/[^a-z0-9]/gi, "_")}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadVideo = () => {
    if (artwork.videoUrl) {
      toast.info("Downloading Video", {
        description: generateCopyrightStatement(),
        duration: 5000,
      });
      
      const link = document.createElement("a");
      link.href = artwork.videoUrl;
      link.download = `${artwork.title.replace(/[^a-z0-9]/gi, "_")}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className={viewMode === "mobile" ? "min-h-screen px-4 py-6" : "min-h-screen px-4 py-4 md:py-6 md:px-6"}>
        <div className={viewMode === "mobile" ? "mx-auto max-w-[430px]" : "max-w-7xl mx-auto"}>
          <button
            onClick={onClose}
            className={viewMode === "mobile" ? "mb-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-200 text-white" : "mb-3 md:mb-4 p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-200 text-white"}
            aria-label="Close"
          >
            <X className={viewMode === "mobile" ? "w-5 h-5" : "w-5 h-5 md:w-6 md:h-6"} />
          </button>

          {/* Desktop Layout - Two columns for top section */}
          <div className={viewMode === "mobile" ? "hidden" : "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6"}>
            <div className="space-y-3 md:space-y-4">
              <div className="bg-white rounded-2xl shadow-2xl relative overflow-hidden">
                {artwork.imageUrl ? (
                  <ImageZoom src={artwork.imageUrl} alt={artwork.title} viewMode={viewMode} />
                ) : artwork.videoUrl ? (
                  <div 
                    ref={videoContainerRef}
                    className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0067B1]/15 to-[#007749]/10 p-4 md:p-8 rounded-2xl"
                  >
                    {isFullscreen && (
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
                          zIndex: 101,
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        <div className={viewMode === "mobile" ? "relative w-full max-w-[430px] h-full bg-black" : "relative w-full h-full"}>
                          <video
                            ref={videoRef}
                            src={artwork.videoUrl}
                            className="w-full h-full object-contain"
                            controls={true}
                            onTimeUpdate={handleVideoTimeUpdate}
                            onEnded={handleVideoEnded}
                            onLoadedMetadata={() => {
                              if (videoRef.current) {
                                setDuration(videoRef.current.duration);
                              }
                            }}
                          />
                          <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-200 text-white z-[102]"
                            aria-label="Exit Fullscreen"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    )}
                    {!isFullscreen && (
                      <>
                        <video
                          ref={videoRef}
                          src={artwork.videoUrl}
                          className="w-full max-w-2xl rounded-xl mb-4 md:mb-6"
                          onTimeUpdate={handleVideoTimeUpdate}
                          onEnded={handleVideoEnded}
                          onLoadedMetadata={() => {
                            if (videoRef.current) {
                              setDuration(videoRef.current.duration);
                            }
                          }}
                          style={{ maxHeight: '200px' }}
                        />
                        <div className="flex gap-2 md:gap-3 mb-3 md:mb-4">
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                if (isPlaying) {
                                  videoRef.current.pause();
                                } else {
                                  videoRef.current.play();
                                }
                                setIsPlaying(!isPlaying);
                              }
                            }}
                            className="p-3 md:p-4 bg-white/90 hover:bg-white rounded-full transition-all"
                          >
                            {isPlaying ? (
                              <Pause className="w-6 h-6 md:w-8 md:h-8 text-[#0067B1]" />
                            ) : (
                              <Play className="w-6 h-6 md:w-8 md:h-8 text-[#0067B1]" />
                            )}
                          </button>
                          <button
                            onClick={() => setIsFullscreen(true)}
                            className="p-3 md:p-4 bg-white/90 hover:bg-white rounded-full transition-all"
                            title="Fullscreen"
                          >
                            <Maximize2 className="w-6 h-6 md:w-8 md:h-8 text-[#0067B1]" />
                          </button>
                        </div>
                        <div className="w-full max-w-md space-y-2">
                          <div 
                            className="h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                            onClick={(e) => {
                              if (videoRef.current) {
                                const bounds = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - bounds.left;
                                const width = bounds.width;
                                const percentage = x / width;
                                videoRef.current.currentTime = percentage * duration;
                              }
                            }}
                          >
                            <div 
                              className="h-full bg-white/70 rounded-full transition-all" 
                              style={{ width: `${(currentTime / duration) * 100 || 0}%` }} 
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : artwork.audioUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#007749]/15 to-[#0067B1]/10 p-6 md:p-12 rounded-2xl">
                    <Music className="w-20 h-20 md:w-32 md:h-32 text-[#007749] mb-4 md:mb-8" />
                    <p className="text-lg md:text-xl text-[#007749] font-medium mb-4 md:mb-8">Audio Recording</p>
                    <audio
                      ref={audioRef}
                      src={artwork.audioUrl}
                      className="hidden"
                      onTimeUpdate={() => {
                        if (audioRef.current) {
                          setCurrentTime(audioRef.current.currentTime);
                          setDuration(audioRef.current.duration);
                        }
                      }}
                      onEnded={() => setIsPlaying(false)}
                      onLoadedMetadata={() => {
                        if (audioRef.current) {
                          setDuration(audioRef.current.duration);
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (audioRef.current) {
                          if (isPlaying) {
                            audioRef.current.pause();
                          } else {
                            audioRef.current.play();
                          }
                          setIsPlaying(!isPlaying);
                        }
                      }}
                      className="mb-4 md:mb-6 p-3 md:p-4 bg-white/90 hover:bg-white rounded-full transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 md:w-8 md:h-8 text-[#007749]" />
                      ) : (
                        <Play className="w-6 h-6 md:w-8 md:h-8 text-[#007749]" />
                      )}
                    </button>
                    <div className="w-full max-w-md space-y-2 px-4">
                      <div 
                        className="h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                        onClick={(e) => {
                          if (audioRef.current) {
                            const bounds = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - bounds.left;
                            const width = bounds.width;
                            const percentage = x / width;
                            audioRef.current.currentTime = percentage * duration;
                          }
                        }}
                      >
                        <div 
                          className="h-full bg-white/70 rounded-full transition-all" 
                          style={{ width: `${(currentTime / duration) * 100 || 0}%` }} 
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0067B1]/10 to-[#007749]/10 rounded-2xl">
                    <div className="flex gap-2 md:gap-4">
                      <div className="w-16 h-16 md:w-28 md:h-28 bg-[#0067B1]/20 rounded-2xl" />
                      <div className="w-16 h-16 md:w-28 md:h-28 bg-[#007749]/20 rounded-2xl" />
                    </div>
                  </div>
                )}
              </div>

              {/* Download Buttons - Desktop */}
              <div className="hidden lg:flex gap-3 flex-wrap">
                {artwork.imageUrl && (
                  <Button
                    onClick={() => handleDownloadClick("image")}
                    variant="outline"
                    className="flex-1 gap-2 h-12 rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white bg-white"
                  >
                    <Download className="w-5 h-5" />
                    Download Image
                  </Button>
                )}
                {artwork.videoUrl && (
                  <Button
                    onClick={() => handleDownloadClick("video")}
                    variant="outline"
                    className="flex-1 gap-2 h-12 rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white bg-white"
                  >
                    <Download className="w-5 h-5" />
                    Download Video
                  </Button>
                )}
                {artwork.audioUrl && (
                  <Button
                    onClick={() => handleDownloadClick("audio")}
                    variant="outline"
                    className="flex-1 gap-2 h-12 rounded-xl border-2 border-[#007749] text-[#007749] hover:bg-[#007749] hover:text-white bg-white"
                  >
                    <Download className="w-5 h-5" />
                    Download Audio
                  </Button>
                )}
                <Button
                  onClick={copyMLACitation}
                  variant="outline"
                  className="flex-1 gap-2 h-12 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white bg-white"
                >
                  {mlaCopied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      MLA Citation
                    </>
                  )}
                </Button>
              </div>

              {/* Mobile/Tablet Download Buttons - Show on small/medium screens only */}
              <div className="lg:hidden flex gap-3 flex-wrap">
                {artwork.imageUrl && (
                  <Button
                    onClick={() => handleDownloadClick("image")}
                    variant="outline"
                    className="flex-1 gap-2 h-12 rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white bg-white"
                  >
                    <Download className="w-5 h-5" />
                    Download Image
                  </Button>
                )}
                {artwork.videoUrl && (
                  <Button
                    onClick={() => handleDownloadClick("video")}
                    variant="outline"
                    className="flex-1 gap-2 h-12 rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white bg-white"
                  >
                    <Download className="w-5 h-5" />
                    Download Video
                  </Button>
                )}
                {artwork.audioUrl && (
                  <Button
                    onClick={() => handleDownloadClick("audio")}
                    variant="outline"
                    className="flex-1 gap-2 h-12 rounded-xl border-2 border-[#007749] text-[#007749] hover:bg-[#007749] hover:text-white bg-white"
                  >
                    <Download className="w-5 h-5" />
                    Download Audio
                  </Button>
                )}
                <Button
                  onClick={copyMLACitation}
                  variant="outline"
                  className="flex-1 gap-2 h-12 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white bg-white"
                >
                  {mlaCopied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      MLA Citation
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6 bg-white rounded-2xl shadow-2xl p-4 md:p-8">
              <div>
                <h2 className="mb-2 md:mb-4 text-2xl md:text-4xl text-gray-900">{artwork.title}</h2>
                {artwork.creator && (
                  <p className="text-xl md:text-2xl text-[#0067B1] font-medium">
                    {artwork.creator}
                  </p>
                )}
              </div>

              <div className="space-y-3 md:space-y-5 pt-3 md:pt-4 border-t border-gray-200">
                {artwork.year && (
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Year
                    </p>
                    <p className="text-base md:text-lg text-gray-900">{artwork.year}</p>
                  </div>
                )}

                {artwork.medium && (
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Medium
                    </p>
                    <p className="text-base md:text-lg text-gray-900">{artwork.medium}</p>
                  </div>
                )}

                {artwork.genre && (
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Genre
                    </p>
                    <p className="text-base md:text-lg text-gray-900">{artwork.genre}</p>
                  </div>
                )}

                {artwork.description && (
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Description
                    </p>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      {artwork.description}
                    </p>
                  </div>
                )}

                {artwork.dataset && (
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Collection
                    </p>
                    <p className="text-sm md:text-base text-gray-900">{artwork.dataset}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Layout - Stacked vertical */}
          {viewMode === "mobile" && (
            <ArtworkDetailMobile
              artwork={artwork}
              audioRef={audioRef}
              videoRef={videoRef}
              videoContainerRef={videoContainerRef}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              currentTime={currentTime}
              duration={duration}
              setDuration={setDuration}
              setCurrentTime={setCurrentTime}
              handleVideoTimeUpdate={handleVideoTimeUpdate}
              handleVideoEnded={handleVideoEnded}
              formatTime={formatTime}
              handleDownloadClick={handleDownloadClick}
              copyMLACitation={copyMLACitation}
              mlaCopied={mlaCopied}
              copyCitation={copyCitation}
              copied={copied}
              persistentId={persistentId}
              viewMode={viewMode}
            />
          )}

          {/* Desktop Bottom section: Citation and Art Metadata Side by Side */}
          <div className={viewMode === "mobile" ? "hidden" : "grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8"}>
            {/* Citation Metadata Section - Full Width */}
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 mb-6 md:mb-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-lg md:text-2xl text-[#0067B1] font-semibold">
                  Citation Metadata
                </h3>
                <Button
                  onClick={copyCitation}
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white text-xs md:text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-0 divide-y divide-gray-100">
                {persistentId && (
                  <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                    <p className="text-xs md:text-sm font-medium text-gray-600">
                      Persistent Identifier
                    </p>
                    <p className="text-xs md:text-sm text-gray-900 break-all">{persistentId}</p>
                  </div>
                )}

                {artwork.publicationDate && (
                  <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                    <p className="text-xs md:text-sm font-medium text-gray-600">Publication Date</p>
                    <p className="text-xs md:text-sm text-gray-900">
                      {artwork.publicationDate}
                    </p>
                  </div>
                )}

                {artwork.title && (
                  <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                    <p className="text-xs md:text-sm font-medium text-gray-600">Title</p>
                    <p className="text-xs md:text-sm text-gray-900">{artwork.title}</p>
                  </div>
                )}

                {artwork.authorName && (
                  <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                    <p className="text-xs md:text-sm font-medium text-gray-600">Author</p>
                    <p className="text-xs md:text-sm text-gray-900">
                      {artwork.authorName}
                      {artwork.authorAffiliation &&
                        ` (${artwork.authorAffiliation})`}
                      {artwork.authorIdentifierScheme ===
                        "ORCID" &&
                        artwork.authorIdentifier && (
                          <span className="text-[#0067B1] block mt-1">
                            ORCID: {artwork.authorIdentifier}
                          </span>
                        )}
                    </p>
                  </div>
                )}

                {artwork.pointOfContact && (
                  <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                    <p className="text-xs md:text-sm font-medium text-gray-600">Point of Contact</p>
                    <div className="text-xs md:text-sm space-y-2">
                      <p className="text-gray-900">{artwork.pointOfContact}</p>
                      {artwork.pointOfContactEmail && (
                        <button
                          onClick={() =>
                            (window.location.href = `mailto:${artwork.pointOfContactEmail}`)
                          }
                          className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-[#0067B1] text-white rounded-lg hover:bg-[#005A9C] transition-colors"
                        >
                          Send Email
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {artwork.description && (
                  <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                    <p className="text-xs md:text-sm font-medium text-gray-600">Description</p>
                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                      {artwork.description}
                    </p>
                  </div>
                )}

                {artwork.subjects &&
                  artwork.subjects.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Subject</p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.subjects.join(", ")}
                      </p>
                    </div>
                  )}

                {artwork.keywords &&
                  artwork.keywords.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Keyword</p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.keywords.join(", ")}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Art Metadata Section - Full Width */}
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8">
              <div>
                <h3 className="mb-4 md:mb-6 text-lg md:text-2xl text-[#007749] font-semibold">
                  Art Metadata
                </h3>
                <div className="space-y-0 divide-y divide-gray-100">
                  {artwork.accessionNumber && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">
                        Accession Number
                      </p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.accessionNumber}
                      </p>
                    </div>
                  )}

                  {artwork.creator && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Artist</p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.creator}
                      </p>
                    </div>
                  )}

                  {artwork.artistNationality && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">
                        Artist Nationality
                      </p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.artistNationality}
                      </p>
                    </div>
                  )}

                  {artwork.centuryCreated && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Century Created</p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.centuryCreated}
                      </p>
                    </div>
                  )}

                  {artwork.dateCreated && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Date Created</p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.dateCreated}
                      </p>
                    </div>
                  )}

                  {artwork.geographicLocation && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">
                        Geographic Location
                      </p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.geographicLocation}
                      </p>
                    </div>
                  )}

                  {artwork.artType && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Art Type</p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.artType}
                      </p>
                    </div>
                  )}

                  {artwork.dimensions && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Dimensions</p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.dimensions}
                      </p>
                    </div>
                  )}

                  {artwork.medium && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Medium</p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.medium}
                      </p>
                    </div>
                  )}

                  {artwork.printmaking && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Printmaking</p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.printmaking}
                      </p>
                    </div>
                  )}

                  {artwork.printEditionNumber && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">
                        Print Edition Number
                      </p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.printEditionNumber}
                      </p>
                    </div>
                  )}

                  {artwork.artStyle && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Art Style</p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.artStyle}
                      </p>
                    </div>
                  )}

                  {artwork.collection && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Collection</p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.collection}
                      </p>
                    </div>
                  )}

                  {artwork.creditLine && (
                    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-4 py-3 md:py-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">Credit Line</p>
                      <p className="text-xs md:text-sm text-gray-900">
                        {artwork.creditLine}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-gray-200">
                  <p className="text-xs md:text-sm text-gray-500">
                    From FGCU Dataverse Collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Dialog */}
      <Dialog open={showCopyrightDialog} onOpenChange={setShowCopyrightDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Download Confirmation</DialogTitle>
            <DialogDescription className="mt-4">
              {generateCopyrightStatement()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={cancelDownload}
              variant="outline"
              className="text-black hover:text-white hover:bg-red-600 hover:border-red-600"
            >
              Cancel
            </Button>
            <Button
              onClick={proceedWithDownload}
              className="bg-[#0067B1] hover:bg-[#005A9C] text-white"
            >
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
