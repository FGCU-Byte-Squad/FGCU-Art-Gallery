import {
  Info,
  MessageCircle,
  MapPin,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LandingPageProps {
  onNavigateToGallery: (searchQuery?: string) => void;
  onNavigateToAdmin: () => void;
}

export function LandingPage({
  onNavigateToGallery,
  onNavigateToAdmin,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-center sm:justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {/* FGCU Logo */}
              <img
                src="https://fgcucdn.fgcu.edu/advancement/universitymarketing/images/fgcu-logo-250h.jpg"
                alt="FGCU Logo"
                className="h-12 w-auto object-contain"
              />
              <div className="flex gap-2">
                <div className="w-1 h-12 bg-[#0067B1] rounded-full" />
                <div className="w-1 h-12 bg-[#007749] rounded-full" />
              </div>
              <div>
                <h1 className="tracking-tight text-gray-900">
                  Art Gallery
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  FGCU Library Collection
                </p>
              </div>
            </div>
            <Button
              onClick={onNavigateToAdmin}
              variant="outline"
              className="rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white transition-all duration-200 px-6"
            >
              Admin Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden flex items-center" style={{ height: 'calc(100vh - 88px)' }}>
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/fgcu-campus-S7uHoNkfVmhFcqh6Dd47acV2KjQW0f.jpg"
            alt="FGCU Campus"
            className="h-full w-full object-cover object-center"
          />
          {/* Modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50" />
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-white md:text-7xl leading-tight">
              Discover Art at Florida Gulf Coast University
            </h1>
            <p className="text-pretty text-xl text-white/90 md:text-2xl leading-relaxed max-w-3xl mx-auto">
              Explore our digital collection featuring
              contemporary works, student exhibitions, and
              curated pieces from the Dataverse archive.
            </p>
            <div className="mt-10">
              <Button
                onClick={() => onNavigateToGallery()}
                size="lg"
                className="h-16 px-10 text-lg bg-[#0067B1] hover:bg-[#005A9C] shadow-2xl rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[#0067B1]/50 group"
              >
                Browse All Artwork
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* About Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0067B1]/20 to-[#0067B1]/10 rounded-2xl mb-6">
                <Info className="w-10 h-10 text-[#0067B1]" />
              </div>
              <h3 className="mb-3 text-2xl">About Us</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Learn more about FGCU's Library and our mission
                to preserve and share art.
              </p>
              <Button
                onClick={() =>
                  window.open(
                    "https://library.fgcu.edu/aboutus",
                    "_blank",
                  )
                }
                variant="outline"
                className="w-full rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white transition-all duration-200 h-12"
              >
                Learn More
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#007749]/20 to-[#007749]/10 rounded-2xl mb-6">
                <MessageCircle className="w-10 h-10 text-[#007749]" />
              </div>
              <h3 className="mb-3 text-2xl">Contact Us</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Have questions? We're here to help and answer
                your inquiries!
              </p>
              <Button
                onClick={() =>
                  window.open(
                    "https://library.fgcu.edu/askus",
                    "_blank",
                  )
                }
                variant="outline"
                className="w-full rounded-xl border-2 border-[#007749] text-[#007749] hover:bg-[#007749] hover:text-white transition-all duration-200 h-12"
              >
                Ask Us
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Visit Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0067B1]/20 to-[#0067B1]/10 rounded-2xl mb-6">
                <MapPin className="w-10 h-10 text-[#0067B1]" />
              </div>
              <h3 className="mb-3 text-2xl">Visit Us</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Visit FGCU's Library in-person to discover even
                more!
              </p>
              <Button
                onClick={() =>
                  window.open(
                    "https://library.fgcu.edu/calendar/location",
                    "_blank",
                  )
                }
                variant="outline"
                className="w-full rounded-xl border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white transition-all duration-200 h-12"
              >
                View Location
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-10 px-6 mt-8">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p className="text-base">
            &copy; 2025 Florida Gulf Coast University. All
            rights reserved.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Powered by FGCU Dataverse
          </p>
        </div>
      </footer>
    </div>
  );
}
