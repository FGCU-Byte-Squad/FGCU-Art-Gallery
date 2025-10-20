import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ArtworkCardProps {
  artwork: {
    id: string;
    title: string;
    creator?: string;
    year?: string;
    description?: string;
    imageUrl?: string;
    medium?: string;
    genre?: string;
  };
  onClick: () => void;
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  return (
    <div
      className="group cursor-pointer bg-white"
      onClick={onClick}
    >
      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
        {artwork.imageUrl ? (
          <ImageWithFallback
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0067B1]/10 to-[#007749]/10">
            <div className="flex gap-2">
              <div className="w-16 h-16 bg-[#0067B1]/20" />
              <div className="w-16 h-16 bg-[#007749]/20" />
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="line-clamp-2">{artwork.title}</h3>
        {artwork.creator && (
          <p className="text-muted-foreground">{artwork.creator}</p>
        )}
        {artwork.year && (
          <p className="text-muted-foreground text-sm">{artwork.year}</p>
        )}
      </div>
    </div>
  );
}
