export function GalleryHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-6">
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
            <h1 className="tracking-tight text-gray-900">Art Gallery</h1>
            <p className="text-sm text-gray-600 mt-0.5">
              FGCU Library Collection
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
