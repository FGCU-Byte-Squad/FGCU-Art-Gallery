import { Music, Play, Pause, Download, FileText, Check, X, Maximize2, Copy } from "lucide-react";
import { ImageZoom } from "./ImageZoom";
import { Button } from "./ui/button";

interface ArtworkDetailMobileProps {
  artwork: any;
  audioRef: React.RefObject<HTMLAudioElement>;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoContainerRef: React.RefObject<HTMLDivElement>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  currentTime: number;
  duration: number;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  handleVideoTimeUpdate: () => void;
  handleVideoEnded: () => void;
  formatTime: (time: number) => string;
  handleDownloadClick: (type: "image" | "audio" | "video") => void;
  copyMLACitation: () => void;
  mlaCopied: boolean;
  copyCitation: () => void;
  copied: boolean;
  persistentId?: string;
  viewMode?: "desktop" | "mobile";
}

export function ArtworkDetailMobile({
  artwork,
  audioRef,
  videoRef,
  videoContainerRef,
  isPlaying,
  setIsPlaying,
  isFullscreen,
  setIsFullscreen,
  currentTime,
  duration,
  setDuration,
  setCurrentTime,
  handleVideoTimeUpdate,
  handleVideoEnded,
  formatTime,
  handleDownloadClick,
  copyMLACitation,
  mlaCopied,
  copyCitation,
  copied,
  persistentId,
  viewMode,
}: ArtworkDetailMobileProps) {
  return (
    <div className="space-y-6 mb-6">
      {/* 1. Artwork/Audio/Video Display */}
      <div className="bg-white rounded-2xl shadow-2xl relative overflow-hidden">
        {artwork.imageUrl ? (
          <ImageZoom src={artwork.imageUrl} alt={artwork.title} viewMode={viewMode} />
        ) : artwork.videoUrl ? (
          <div 
            ref={videoContainerRef}
            className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0067B1]/15 to-[#007749]/10 p-4 rounded-2xl"
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
                  className="w-full max-w-2xl rounded-xl mb-4"
                  onTimeUpdate={handleVideoTimeUpdate}
                  onEnded={handleVideoEnded}
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      setDuration(videoRef.current.duration);
                    }
                  }}
                  style={{ maxHeight: '200px' }}
                />
                <div className="flex gap-2 mb-3">
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
                    className="p-3 bg-white/90 hover:bg-white rounded-full transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-[#0067B1]" />
                    ) : (
                      <Play className="w-6 h-6 text-[#0067B1]" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="p-3 bg-white/90 hover:bg-white rounded-full transition-all"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-6 h-6 text-[#0067B1]" />
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
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#007749]/15 to-[#0067B1]/10 p-6 rounded-2xl">
            <Music className="w-20 h-20 text-[#007749] mb-4" />
            <p className="text-lg text-[#007749] font-medium mb-4">Audio Recording</p>
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
              className="mb-4 p-3 bg-white/90 hover:bg-white rounded-full transition-all"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-[#007749]" />
              ) : (
                <Play className="w-6 h-6 text-[#007749]" />
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
            <div className="flex gap-2">
              <div className="w-16 h-16 bg-[#0067B1]/20 rounded-2xl" />
              <div className="w-16 h-16 bg-[#007749]/20 rounded-2xl" />
            </div>
          </div>
        )}
      </div>

      {/* Download Buttons */}
      <div className="flex gap-3 flex-wrap">
        {artwork.imageUrl && (
          <Button
            onClick={() => handleDownloadClick("image")}
            variant="outline"
            className="flex-1 gap-2 h-12 rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white bg-white"
          >
            <Download className="w-5 h-5" />
            Download
          </Button>
        )}
        {artwork.videoUrl && (
          <Button
            onClick={() => handleDownloadClick("video")}
            variant="outline"
            className="flex-1 gap-2 h-12 rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white bg-white"
          >
            <Download className="w-5 h-5" />
            Download
          </Button>
        )}
        {artwork.audioUrl && (
          <Button
            onClick={() => handleDownloadClick("audio")}
            variant="outline"
            className="flex-1 gap-2 h-12 rounded-xl border-2 border-[#007749] text-[#007749] hover:bg-[#007749] hover:text-white bg-white"
          >
            <Download className="w-5 h-5" />
            Download
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
              MLA
            </>
          )}
        </Button>
      </div>

      {/* 2. Details */}
      <div className="bg-white rounded-2xl shadow-2xl p-4">
        <div>
          <h2 className="mb-2 text-2xl text-gray-900">{artwork.title}</h2>
          {artwork.creator && (
            <p className="text-xl text-[#0067B1] font-medium mb-4">
              {artwork.creator}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-3 border-t border-gray-200">
          {artwork.year && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Year
              </p>
              <p className="text-base text-gray-900">{artwork.year}</p>
            </div>
          )}

          {artwork.medium && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Medium
              </p>
              <p className="text-base text-gray-900">{artwork.medium}</p>
            </div>
          )}

          {artwork.genre && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Genre
              </p>
              <p className="text-base text-gray-900">{artwork.genre}</p>
            </div>
          )}

          {artwork.description && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Description
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {artwork.description}
              </p>
            </div>
          )}

          {artwork.dataset && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Collection
              </p>
              <p className="text-sm text-gray-900">{artwork.dataset}</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Citation Metadata */}
      <div className="bg-white rounded-2xl shadow-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-[#0067B1] font-semibold">
            Citation Metadata
          </h3>
          <Button
            onClick={copyCitation}
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
              </>
            )}
          </Button>
        </div>

        <div className="space-y-0 divide-y divide-gray-100">
          {persistentId && (
            <div className="grid grid-cols-1 gap-2 py-3">
              <p className="text-xs font-medium text-gray-600">
                Persistent Identifier
              </p>
              <p className="text-xs text-gray-900 break-all">{persistentId}</p>
            </div>
          )}

          {artwork.publicationDate && (
            <div className="grid grid-cols-1 gap-2 py-3">
              <p className="text-xs font-medium text-gray-600">Publication Date</p>
              <p className="text-xs text-gray-900">
                {artwork.publicationDate}
              </p>
            </div>
          )}

          {artwork.title && (
            <div className="grid grid-cols-1 gap-2 py-3">
              <p className="text-xs font-medium text-gray-600">Title</p>
              <p className="text-xs text-gray-900">{artwork.title}</p>
            </div>
          )}

          {artwork.authorName && (
            <div className="grid grid-cols-1 gap-2 py-3">
              <p className="text-xs font-medium text-gray-600">Author</p>
              <p className="text-xs text-gray-900">
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
            <div className="grid grid-cols-1 gap-2 py-3">
              <p className="text-xs font-medium text-gray-600">Point of Contact</p>
              <div className="text-xs space-y-2">
                <p className="text-gray-900">{artwork.pointOfContact}</p>
                {artwork.pointOfContactEmail && (
                  <button
                    onClick={() =>
                      (window.location.href = `mailto:${artwork.pointOfContactEmail}`)
                    }
                    className="px-3 py-1.5 text-xs bg-[#0067B1] text-white rounded-lg hover:bg-[#005A9C] transition-colors"
                  >
                    Send Email
                  </button>
                )}
              </div>
            </div>
          )}

          {artwork.description && (
            <div className="grid grid-cols-1 gap-2 py-3">
              <p className="text-xs font-medium text-gray-600">Description</p>
              <p className="text-xs text-gray-700 leading-relaxed">
                {artwork.description}
              </p>
            </div>
          )}

          {artwork.subjects &&
            artwork.subjects.length > 0 && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">Subject</p>
                <p className="text-xs text-gray-900">
                  {artwork.subjects.join(", ")}
                </p>
              </div>
            )}

          {artwork.keywords &&
            artwork.keywords.length > 0 && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">Keyword</p>
                <p className="text-xs text-gray-900">
                  {artwork.keywords.join(", ")}
                </p>
              </div>
            )}
        </div>
      </div>

      {/* 4. Art Metadata */}
      <div className="bg-white rounded-2xl shadow-2xl p-4">
        <div>
          <h3 className="mb-4 text-lg text-[#007749] font-semibold">
            Art Metadata
          </h3>
          <div className="space-y-0 divide-y divide-gray-100">
            {artwork.accessionNumber && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">
                  Accession Number
                </p>
                <p className="text-xs text-gray-900">
                  {artwork.accessionNumber}
                </p>
              </div>
            )}

            {artwork.creator && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">Artist</p>
                <p className="text-xs text-gray-900">
                  {artwork.creator}
                </p>
              </div>
            )}

            {artwork.artistNationality && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">
                  Artist Nationality
                </p>
                <p className="text-xs text-gray-900">
                  {artwork.artistNationality}
                </p>
              </div>
            )}

            {artwork.centuryCreated && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">Century Created</p>
                <p className="text-xs text-gray-900">
                  {artwork.centuryCreated}
                </p>
              </div>
            )}

            {artwork.dateCreated && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">Date Created</p>
                <p className="text-xs text-gray-900">
                  {artwork.dateCreated}
                </p>
              </div>
            )}

            {artwork.geographicLocation && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">
                  Geographic Location
                </p>
                <p className="text-xs text-gray-900">
                  {artwork.geographicLocation}
                </p>
              </div>
            )}

            {artwork.artType && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">Art Type</p>
                <p className="text-xs text-gray-900">
                  {artwork.artType}
                </p>
              </div>
            )}

            {artwork.dimensions && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">Dimensions</p>
                <p className="text-xs text-gray-900">
                  {artwork.dimensions}
                </p>
              </div>
            )}

            {artwork.medium && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">Medium</p>
                <p className="text-xs text-gray-900">
                  {artwork.medium}
                </p>
              </div>
            )}

            {artwork.printmaking && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">Printmaking</p>
                <p className="text-xs text-gray-900">
                  {artwork.printmaking}
                </p>
              </div>
            )}

            {artwork.printEditionNumber && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">
                  Print Edition Number
                </p>
                <p className="text-xs text-gray-900">
                  {artwork.printEditionNumber}
                </p>
              </div>
            )}

            {artwork.artStyle && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">Art Style</p>
                <p className="text-xs text-gray-900">
                  {artwork.artStyle}
                </p>
              </div>
            )}

            {artwork.collection && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">Collection</p>
                <p className="text-xs text-gray-900">
                  {artwork.collection}
                </p>
              </div>
            )}

            {artwork.creditLine && (
              <div className="grid grid-cols-1 gap-2 py-3">
                <p className="text-xs font-medium text-gray-600">Credit Line</p>
                <p className="text-xs text-gray-900">
                  {artwork.creditLine}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              From FGCU Dataverse Collection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}