export function GalleryHeader() {
  return (
    <header className="border-b border-border bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4">
          <img
            src="https://fgcucdn.fgcu.edu/advancement/universitymarketing/images/fgcu-logo-250h.jpg"
            alt="FGCU Logo"
            className="h-12 w-auto object-contain"
          />
          <div className="flex gap-2">
            <div className="w-1 h-12 bg-[#0067B1]" />
            <div className="w-1 h-12 bg-[#007749]" />
          </div>
          <div>
            <h1 className="tracking-tight">FGCU Art Gallery</h1>
            <p className="text-muted-foreground mt-1">Provided by the FGCU Library</p>
          </div>
        </div>
      </div>
    </header>
  );
}
