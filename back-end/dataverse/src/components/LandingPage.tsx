import { Info, MessageCircle, MapPin, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LandingPageProps {
  onNavigateToGallery: (searchQuery?: string) => void;
}

export function LandingPage({
  onNavigateToGallery,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-1 h-12 bg-[#0067B1]" />
              <div className="w-1 h-12 bg-[#007749]" />
            </div>
            <div>
              <h1 className="tracking-tight">
                FGCU Art Gallery
              </h1>
              <p className="text-muted-foreground mt-1">
                Digital Collection
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-secondary py-20 md:py-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/fgcu-campus-S7uHoNkfVmhFcqh6Dd47acV2KjQW0f.jpg"
            alt="FGCU Campus"
            className="h-full w-full object-cover"
          />
          {/* Dark overlay for text contrast */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-white md:text-6xl">
              Discover Art at Florida Gulf Coast University
            </h1>
            <p className="text-pretty text-lg text-white/90 md:text-xl">
              Explore our digital collection featuring
              contemporary works, student exhibitions, and
              curated pieces from the Dataverse archive.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => onNavigateToGallery()}
                size="lg"
                className="h-14 px-8 text-lg bg-[#0067B1] hover:bg-[#0067B1]/90 shadow-lg"
              >
                Browse All Artworks
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0067B1]/10 rounded-lg mb-4">
                <Info className="w-8 h-8 text-[#0067B1]" />
              </div>
              <h3 className="mb-2">About Us</h3>
              <p className="text-muted-foreground mb-4">
                About FGCU's Library.
              </p>
              <Button
                onClick={() => window.open("https://library.fgcu.edu/aboutus", "_blank")}
                variant="outline"
                className="gap-2"
              >
                Learn More
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#007749]/10 rounded-lg mb-4">
                <MessageCircle className="w-8 h-8 text-[#007749]" />
              </div>
              <h3 className="mb-2">Contact Us</h3>
              <p className="text-muted-foreground mb-4">
                Have questions? We're here to help!
              </p>
              <Button
                onClick={() => window.open("https://library.fgcu.edu/askus", "_blank")}
                variant="outline"
                className="gap-2"
              >
                Ask Us
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0067B1]/10 rounded-lg mb-4">
                <MapPin className="w-8 h-8 text-[#0067B1]" />
              </div>
              <h3 className="mb-2">Visit Us</h3>
              <p className="text-muted-foreground mb-4">
                Visit FGCU's Library in-person to discover more!
              </p>
              <Button
                onClick={() => window.open("https://library.fgcu.edu/calendar/location", "_blank")}
                variant="outline"
                className="gap-2"
              >
                View Location
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>
            &copy; 2025 Florida Gulf Coast University. All
            rights reserved.
          </p>
          <p className="mt-2 text-sm">
            Powered by FGCU Dataverse
          </p>
        </div>
      </footer>
    </div>
  );
}