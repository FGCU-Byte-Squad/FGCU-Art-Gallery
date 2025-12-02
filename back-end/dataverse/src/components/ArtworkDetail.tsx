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
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useState, useRef } from "react";
import { toast } from "sonner@2.0.3";

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
}

export function ArtworkDetail({
  artwork,
  onClose,
}: ArtworkDetailProps) {
  const [copied, setCopied] = useState(false);
  const [mlaCopied, setMlaCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const persistentId = artwork.storageIdentifier
    ? "doi:" +
      artwork.storageIdentifier.replace(
        "dataverse_files://",
        "",
      )
    : undefined;

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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="min-h-screen px-4 py-12 md:px-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onClose}
            className="mb-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-200 text-white"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Top section: Image/Audio/Video and Basic Info */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-2xl relative overflow-hidden min-h-[500px]">
                {artwork.imageUrl ? (
                  <ImageWithFallback
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="w-full h-full object-contain p-6"
                  />
                ) : artwork.videoUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-black p-8 rounded-2xl">
                    <video
                      src={artwork.videoUrl}
                      className="w-full h-full object-contain rounded-xl"
                      controls
                      style={{ maxHeight: '600px' }}
                    />
                  </div>
                ) : artwork.audioUrl ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#007749]/15 to-[#0067B1]/10 p-12 rounded-2xl">
                    <Music className="w-32 h-32 text-[#007749] mb-8" />
                    <p className="text-xl text-[#007749] font-medium mb-8">Audio Recording</p>
                    <audio
                      ref={audioRef}
                      src={artwork.audioUrl}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full max-w-md rounded-xl"
                      controls
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0067B1]/10 to-[#007749]/10 rounded-2xl">
                    <div className="flex gap-4">
                      <div className="w-28 h-28 bg-[#0067B1]/20 rounded-2xl" />
                      <div className="w-28 h-28 bg-[#007749]/20 rounded-2xl" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 flex-wrap">
                {artwork.imageUrl && (
                  <Button
                    onClick={downloadImage}
                    variant="outline"
                    className="flex-1 gap-2 h-12 rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white bg-white"
                  >
                    <Download className="w-5 h-5" />
                    Download Image
                  </Button>
                )}
                {artwork.videoUrl && (
                  <Button
                    onClick={downloadVideo}
                    variant="outline"
                    className="flex-1 gap-2 h-12 rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white bg-white"
                  >
                    <Download className="w-5 h-5" />
                    Download Video
                  </Button>
                )}
                {artwork.audioUrl && (
                  <Button
                    onClick={downloadAudio}
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

            <div className="space-y-6 bg-white rounded-2xl shadow-2xl p-8">
              <div>
                <h2 className="mb-4 text-4xl text-gray-900">{artwork.title}</h2>
                {artwork.creator && (
                  <p className="text-2xl text-[#0067B1] font-medium">
                    {artwork.creator}
                  </p>
                )}
              </div>

              <div className="space-y-5 pt-4 border-t border-gray-200">
                {artwork.year && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Year
                    </p>
                    <p className="text-lg text-gray-900">{artwork.year}</p>
                  </div>
                )}

                {artwork.medium && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Medium
                    </p>
                    <p className="text-lg text-gray-900">{artwork.medium}</p>
                  </div>
                )}

                {artwork.genre && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Genre
                    </p>
                    <p className="text-lg text-gray-900">{artwork.genre}</p>
                  </div>
                )}

                {artwork.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Description
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {artwork.description}
                    </p>
                  </div>
                )}

                {artwork.dataset && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Collection
                    </p>
                    <p className="text-base text-gray-900">{artwork.dataset}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom section: Citation and Art Metadata Side by Side */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Citation Metadata Section */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl text-[#0067B1] font-semibold">
                  Citation Metadata
                </h3>
                <Button
                  onClick={copyCitation}
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-0 divide-y divide-gray-100">
                {persistentId && (
                  <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                    <p className="text-sm font-medium text-gray-600">
                      Persistent Identifier
                    </p>
                    <p className="text-sm text-gray-900 break-all">{persistentId}</p>
                  </div>
                )}

                {artwork.publicationDate && (
                  <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                    <p className="text-sm font-medium text-gray-600">Publication Date</p>
                    <p className="text-sm text-gray-900">
                      {artwork.publicationDate}
                    </p>
                  </div>
                )}

                {artwork.title && (
                  <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                    <p className="text-sm font-medium text-gray-600">Title</p>
                    <p className="text-sm text-gray-900">{artwork.title}</p>
                  </div>
                )}

                {artwork.authorName && (
                  <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                    <p className="text-sm font-medium text-gray-600">Author</p>
                    <p className="text-sm text-gray-900">
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
                  <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                    <p className="text-sm font-medium text-gray-600">Point of Contact</p>
                    <div className="text-sm space-y-2">
                      <p className="text-gray-900">{artwork.pointOfContact}</p>
                      {artwork.pointOfContactEmail && (
                        <button
                          onClick={() =>
                            (window.location.href = `mailto:${artwork.pointOfContactEmail}`)
                          }
                          className="px-4 py-2 text-sm bg-[#0067B1] text-white rounded-lg hover:bg-[#005A9C] transition-colors"
                        >
                          Send Email
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {artwork.description && (
                  <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                    <p className="text-sm font-medium text-gray-600">Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {artwork.description}
                    </p>
                  </div>
                )}

                {artwork.subjects &&
                  artwork.subjects.length > 0 && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">Subject</p>
                      <p className="text-sm text-gray-900">
                        {artwork.subjects.join(", ")}
                      </p>
                    </div>
                  )}

                {artwork.keywords &&
                  artwork.keywords.length > 0 && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">Keyword</p>
                      <p className="text-sm text-gray-900">
                        {artwork.keywords.join(", ")}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Art Metadata Section */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div>
                <h3 className="mb-6 text-2xl text-[#007749] font-semibold">
                  Art Metadata
                </h3>
                <div className="space-y-0 divide-y divide-gray-100">
                  {artwork.accessionNumber && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">
                        Accession Number
                      </p>
                      <p className="text-sm text-gray-900">
                        {artwork.accessionNumber}
                      </p>
                    </div>
                  )}

                  {artwork.creator && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">Artist</p>
                      <p className="text-sm text-gray-900">
                        {artwork.creator}
                      </p>
                    </div>
                  )}

                  {artwork.artistNationality && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">
                        Artist Nationality
                      </p>
                      <p className="text-sm text-gray-900">
                        {artwork.artistNationality}
                      </p>
                    </div>
                  )}

                  {artwork.centuryCreated && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">Century Created</p>
                      <p className="text-sm text-gray-900">
                        {artwork.centuryCreated}
                      </p>
                    </div>
                  )}

                  {artwork.dateCreated && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">Date Created</p>
                      <p className="text-sm text-gray-900">
                        {artwork.dateCreated}
                      </p>
                    </div>
                  )}

                  {artwork.geographicLocation && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">
                        Geographic Location
                      </p>
                      <p className="text-sm text-gray-900">
                        {artwork.geographicLocation}
                      </p>
                    </div>
                  )}

                  {artwork.artType && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">Art Type</p>
                      <p className="text-sm text-gray-900">
                        {artwork.artType}
                      </p>
                    </div>
                  )}

                  {artwork.dimensions && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">Dimensions</p>
                      <p className="text-sm text-gray-900">
                        {artwork.dimensions}
                      </p>
                    </div>
                  )}

                  {artwork.medium && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">Medium</p>
                      <p className="text-sm text-gray-900">
                        {artwork.medium}
                      </p>
                    </div>
                  )}

                  {artwork.printmaking && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">Printmaking</p>
                      <p className="text-sm text-gray-900">
                        {artwork.printmaking}
                      </p>
                    </div>
                  )}

                  {artwork.printEditionNumber && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">
                        Print Edition Number
                      </p>
                      <p className="text-sm text-gray-900">
                        {artwork.printEditionNumber}
                      </p>
                    </div>
                  )}

                  {artwork.artStyle && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">Art Style</p>
                      <p className="text-sm text-gray-900">
                        {artwork.artStyle}
                      </p>
                    </div>
                  )}

                  {artwork.collection && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">Collection</p>
                      <p className="text-sm text-gray-900">
                        {artwork.collection}
                      </p>
                    </div>
                  )}

                  {artwork.creditLine && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-4">
                      <p className="text-sm font-medium text-gray-600">Credit Line</p>
                      <p className="text-sm text-gray-900">
                        {artwork.creditLine}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    From FGCU Dataverse Collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
