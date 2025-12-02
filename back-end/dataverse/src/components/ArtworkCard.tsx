import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Music, Video, Image as ImageIcon } from "lucide-react";

interface ArtworkCardProps {
  artwork: {
    id: string;
    title: string;
    creator?: string;
    year?: string;
    description?: string;
    imageUrl?: string;
    audioUrl?: string;
    videoUrl?: string;
    medium?: string;
    genre?: string;
  };
  onClick: () => void;
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  const isAudio = !artwork.imageUrl && !artwork.videoUrl && artwork.audioUrl;
  const isVideo = !artwork.imageUrl && artwork.videoUrl;

  return (
    <div
      className="group cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
      onClick={onClick}
    >
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
        {artwork.imageUrl ? (
          <>
            <ImageWithFallback
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-3 right-3">
              <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs text-[#0067B1] shadow-md">
                <ImageIcon className="w-3 h-3 inline mr-1" />
                Image
              </div>
            </div>
          </>
        ) : isVideo ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0067B1]/15 to-[#007749]/10 relative">
            <Video className="w-24 h-24 text-[#0067B1] mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-base text-[#0067B1] font-medium">Video Recording</p>
            <div className="absolute top-3 right-3">
              <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs text-[#0067B1] shadow-md">
                <Video className="w-3 h-3 inline mr-1" />
                Video
              </div>
            </div>
          </div>
        ) : isAudio ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#007749]/15 to-[#0067B1]/10 relative pb-0">
            <Music className="w-24 h-24 text-[#007749] mb-4 group-hover:scale-110 transition-transform" />
            <p className="text-base text-[#007749] font-medium">Audio Recording</p>
            <div className="absolute top-3 right-3">
              <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs text-[#007749] shadow-md">
                <Music className="w-3 h-3 inline mr-1" />
                Audio
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0067B1]/10 to-[#007749]/10">
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-[#0067B1]/20 rounded-xl" />
              <div className="w-20 h-20 bg-[#007749]/20 rounded-xl" />
            </div>
          </div>
        )}
      </div>
      <div className="p-5 space-y-2">
        <h3 className="line-clamp-2 text-gray-900 leading-snug">{artwork.title}</h3>
        {artwork.creator && (
          <p className="text-[#0067B1] font-medium">{artwork.creator}</p>
        )}
        {artwork.year && (
          <p className="text-gray-500 text-sm">{artwork.year}</p>
        )}
      </div>
    </div>
  );
}
