import { useState } from "react";
import { ArrowLeft, Upload, Plus, Trash2, Image as ImageIcon, Music, Video, FileUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";

interface AdminUploadProps {
  onNavigateToHome: () => void;
}

export function AdminUpload({ onNavigateToHome }: AdminUploadProps) {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>("");
  const [mediaType, setMediaType] = useState<"image" | "audio" | "video" | null>(null);
  
  // Citation Metadata fields
  const [persistentId, setPersistentId] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorAffiliation, setAuthorAffiliation] = useState("");
  const [authorIdentifierScheme, setAuthorIdentifierScheme] = useState("");
  const [authorIdentifier, setAuthorIdentifier] = useState("");
  const [pointOfContact, setPointOfContact] = useState("");
  const [pointOfContactEmail, setPointOfContactEmail] = useState("");
  const [description, setDescription] = useState("");
  const [subjects, setSubjects] = useState<string[]>([""]);
  const [keywords, setKeywords] = useState<string[]>([""]);
  
  // Art Metadata fields
  const [accessionNumber, setAccessionNumber] = useState("");
  const [artist, setArtist] = useState("");
  const [artistNationality, setArtistNationality] = useState("");
  const [centuryCreated, setCenturyCreated] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [geographicLocation, setGeographicLocation] = useState("");
  const [artType, setArtType] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [medium, setMedium] = useState("");
  const [printmaking, setPrintmaking] = useState("");
  const [printEditionNumber, setPrintEditionNumber] = useState("");
  const [artStyle, setArtStyle] = useState("");
  const [collection, setCollection] = useState("");
  const [creditLine, setCreditLine] = useState("");

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      
      // Determine media type
      if (file.type.startsWith("image/")) {
        setMediaType("image");
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("audio/")) {
        setMediaType("audio");
        setMediaPreview(URL.createObjectURL(file));
      } else if (file.type.startsWith("video/")) {
        setMediaType("video");
        setMediaPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would upload to the Dataverse API
    const formData = {
      media: mediaFile,
      mediaType,
      citation: {
        persistentId,
        publicationDate,
        title,
        authorName,
        authorAffiliation,
        authorIdentifierScheme,
        authorIdentifier,
        pointOfContact,
        pointOfContactEmail,
        description,
        subjects: subjects.filter(s => s.trim()),
        keywords: keywords.filter(k => k.trim()),
      },
      art: {
        accessionNumber,
        artist,
        artistNationality,
        centuryCreated,
        dateCreated,
        geographicLocation,
        artType,
        dimensions,
        medium,
        printmaking,
        printEditionNumber,
        artStyle,
        collection,
        creditLine,
      }
    };

    console.log("Form submitted:", formData);
    alert("Upload functionality would connect to FGCU Dataverse API in production. See console for form data.");
  };

  const addSubject = () => setSubjects([...subjects, ""]);
  const removeSubject = (index: number) => setSubjects(subjects.filter((_, i) => i !== index));
  const updateSubject = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  const addKeyword = () => setKeywords([...keywords, ""]);
  const removeKeyword = (index: number) => setKeywords(keywords.filter((_, i) => i !== index));
  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
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
              <h1 className="tracking-tight text-gray-900 text-2xl">Admin Upload Dashboard</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Add new artwork to the FGCU Dataverse
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onNavigateToHome}
            className="gap-2 text-gray-700 hover:text-[#0067B1] hover:bg-[#0067B1]/10 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Media Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="flex items-center gap-3">
              <FileUp className="w-6 h-6 text-[#0067B1]" />
              <h2 className="text-2xl text-[#0067B1] font-semibold">Media Upload</h2>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 hover:border-[#0067B1] transition-colors">
              {mediaPreview ? (
                <div className="space-y-6">
                  {mediaType === "image" && (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="max-h-96 mx-auto object-contain rounded-xl"
                    />
                  )}
                  {mediaType === "audio" && (
                    <div className="text-center space-y-4">
                      <Music className="w-20 h-20 mx-auto text-[#007749]" />
                      <p className="text-base text-gray-700 font-medium">Audio file uploaded</p>
                      <audio src={mediaPreview} controls className="w-full max-w-md mx-auto rounded-xl" />
                    </div>
                  )}
                  {mediaType === "video" && (
                    <div className="text-center space-y-4">
                      <video src={mediaPreview} controls className="max-h-96 mx-auto rounded-xl" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setMediaFile(null);
                      setMediaPreview("");
                      setMediaType(null);
                    }}
                    className="w-full h-12 rounded-xl border-2"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Remove Media
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#0067B1]/10 to-[#007749]/10 rounded-2xl mb-6">
                    <Upload className="w-10 h-10 text-[#0067B1]" />
                  </div>
                  <Label htmlFor="media-upload" className="cursor-pointer block mb-2">
                    <span className="text-[#0067B1] hover:underline text-lg font-medium">Click to upload</span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </Label>
                  <p className="text-sm text-gray-500 mb-6">
                    PNG, JPG, MP3, MP4 (max. 100MB)
                  </p>
                  <Input
                    id="media-upload"
                    type="file"
                    accept="image/*,audio/*,video/*"
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                  <div className="flex justify-center gap-4 mt-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ImageIcon className="w-4 h-4" />
                      Images
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Music className="w-4 h-4" />
                      Audio
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Video className="w-4 h-4" />
                      Video
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Citation Metadata Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl text-[#0067B1] font-semibold">Citation Metadata</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="persistentId" className="text-sm font-medium text-gray-700">Persistent Identifier</Label>
                <Input
                  id="persistentId"
                  value={persistentId}
                  onChange={(e) => setPersistentId(e.target.value)}
                  placeholder="doi:10.xxxx/xxxxx"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publicationDate" className="text-sm font-medium text-gray-700">Publication Date</Label>
                <Input
                  id="publicationDate"
                  type="date"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter artwork title"
                className="h-12 rounded-xl border-gray-300"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="authorName" className="text-sm font-medium text-gray-700">Author Name</Label>
                <Input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Full name"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorAffiliation" className="text-sm font-medium text-gray-700">Author Affiliation</Label>
                <Input
                  id="authorAffiliation"
                  value={authorAffiliation}
                  onChange={(e) => setAuthorAffiliation(e.target.value)}
                  placeholder="Institution or organization"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="authorIdentifierScheme" className="text-sm font-medium text-gray-700">Author Identifier Scheme</Label>
                <Input
                  id="authorIdentifierScheme"
                  value={authorIdentifierScheme}
                  onChange={(e) => setAuthorIdentifierScheme(e.target.value)}
                  placeholder="e.g., ORCID"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorIdentifier" className="text-sm font-medium text-gray-700">Author Identifier</Label>
                <Input
                  id="authorIdentifier"
                  value={authorIdentifier}
                  onChange={(e) => setAuthorIdentifier(e.target.value)}
                  placeholder="Identifier value"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="pointOfContact" className="text-sm font-medium text-gray-700">Point of Contact</Label>
                <Input
                  id="pointOfContact"
                  value={pointOfContact}
                  onChange={(e) => setPointOfContact(e.target.value)}
                  placeholder="Contact person name"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pointOfContactEmail" className="text-sm font-medium text-gray-700">Point of Contact Email</Label>
                <Input
                  id="pointOfContactEmail"
                  type="email"
                  value={pointOfContactEmail}
                  onChange={(e) => setPointOfContactEmail(e.target.value)}
                  placeholder="contact@fgcu.edu"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the artwork"
                className="rounded-xl border-gray-300 resize-none"
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Subjects</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSubject}
                  className="gap-2 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  Add Subject
                </Button>
              </div>
              {subjects.map((subject, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    value={subject}
                    onChange={(e) => updateSubject(index, e.target.value)}
                    placeholder="Enter subject"
                    className="h-12 rounded-xl border-gray-300"
                  />
                  {subjects.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeSubject(index)}
                      className="h-12 w-12 rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Keywords</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addKeyword}
                  className="gap-2 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  Add Keyword
                </Button>
              </div>
              {keywords.map((keyword, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    value={keyword}
                    onChange={(e) => updateKeyword(index, e.target.value)}
                    placeholder="Enter keyword"
                    className="h-12 rounded-xl border-gray-300"
                  />
                  {keywords.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeKeyword(index)}
                      className="h-12 w-12 rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Art Metadata Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-2xl text-[#007749] font-semibold">Art Metadata</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="accessionNumber" className="text-sm font-medium text-gray-700">Accession Number</Label>
                <Input
                  id="accessionNumber"
                  value={accessionNumber}
                  onChange={(e) => setAccessionNumber(e.target.value)}
                  placeholder="Catalog number"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="artist" className="text-sm font-medium text-gray-700">Artist</Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Artist name"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="artistNationality" className="text-sm font-medium text-gray-700">Artist Nationality</Label>
                <Input
                  id="artistNationality"
                  value={artistNationality}
                  onChange={(e) => setArtistNationality(e.target.value)}
                  placeholder="e.g., American"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="centuryCreated" className="text-sm font-medium text-gray-700">Century Created</Label>
                <Input
                  id="centuryCreated"
                  value={centuryCreated}
                  onChange={(e) => setCenturyCreated(e.target.value)}
                  placeholder="e.g., 21st Century"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateCreated" className="text-sm font-medium text-gray-700">Date Created</Label>
                <Input
                  id="dateCreated"
                  value={dateCreated}
                  onChange={(e) => setDateCreated(e.target.value)}
                  placeholder="Year or date"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="geographicLocation" className="text-sm font-medium text-gray-700">Geographic Location</Label>
                <Input
                  id="geographicLocation"
                  value={geographicLocation}
                  onChange={(e) => setGeographicLocation(e.target.value)}
                  placeholder="Location depicted or created"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="artType" className="text-sm font-medium text-gray-700">Art Type</Label>
                <Input
                  id="artType"
                  value={artType}
                  onChange={(e) => setArtType(e.target.value)}
                  placeholder="e.g., Painting, Sculpture"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions" className="text-sm font-medium text-gray-700">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g., 24 x 36 inches"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="medium" className="text-sm font-medium text-gray-700">Medium</Label>
                <Input
                  id="medium"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="e.g., Oil on canvas"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="artStyle" className="text-sm font-medium text-gray-700">Art Style</Label>
                <Input
                  id="artStyle"
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  placeholder="e.g., Impressionism"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="printmaking" className="text-sm font-medium text-gray-700">Printmaking</Label>
                <Input
                  id="printmaking"
                  value={printmaking}
                  onChange={(e) => setPrintmaking(e.target.value)}
                  placeholder="Printmaking technique"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="printEditionNumber" className="text-sm font-medium text-gray-700">Print Edition Number</Label>
                <Input
                  id="printEditionNumber"
                  value={printEditionNumber}
                  onChange={(e) => setPrintEditionNumber(e.target.value)}
                  placeholder="e.g., 5/100"
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collection" className="text-sm font-medium text-gray-700">Collection</Label>
              <Input
                id="collection"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                placeholder="e.g., FGCU Art Galleries Permanent Collection"
                className="h-12 rounded-xl border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditLine" className="text-sm font-medium text-gray-700">Credit Line</Label>
              <Textarea
                id="creditLine"
                value={creditLine}
                onChange={(e) => setCreditLine(e.target.value)}
                placeholder="Credit line or acknowledgment"
                className="rounded-xl border-gray-300 resize-none"
                rows={3}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1 h-14 bg-[#0067B1] hover:bg-[#005A9C] text-white rounded-xl text-lg font-medium shadow-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload to Dataverse
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onNavigateToHome}
              className="flex-1 h-14 rounded-xl text-lg border-2"
            >
              Cancel
            </Button>
          </div>

          <p className="text-sm text-gray-500 text-center bg-amber-50 py-4 px-6 rounded-xl border border-amber-200">
            <strong>Note:</strong> This form would upload to FGCU Dataverse API in production. Currently for demonstration purposes.
          </p>
        </form>
      </main>
    </div>
  );
}