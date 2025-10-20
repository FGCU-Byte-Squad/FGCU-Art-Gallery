import { X, ExternalLink, Copy, Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useState } from "react";

interface ArtworkDetailProps {
  artwork: {
    id: string;
    title: string;
    creator?: string;
    year?: string;
    description?: string;
    imageUrl?: string;
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
    alternativeTitle?: string;
    alternativeURL?: string;
    publicationDate?: string;
    citationRequirements?: string;
    depositor?: string;
    dateOfDeposit?: string;
    subjects?: string[];
    keywords?: string[];
    topicClassification?: string[];
    relatedPublications?: string[];
    notes?: string;
    language?: string[];
    producer?: string[];
    productionDate?: string;
    productionPlace?: string;
    contributor?: string[];
    grantNumber?: string[];
    distributor?: string[];
    authorName?: string;
    authorAffiliation?: string;
    authorIdentifierScheme?: string;
    authorIdentifier?: string;
    pointOfContact?: string;
    pointOfContactEmail?: string;
    datasetPersistentId?: string;
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

export function ArtworkDetail({ artwork, onClose }: ArtworkDetailProps) {
  const [copied, setCopied] = useState(false);

  const generateCitation = () => {
    let citation = "";
    
    if (artwork.datasetPersistentId) {
      citation += `Persistent Identifier: ${artwork.datasetPersistentId}\n`;
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
      if (artwork.authorIdentifierScheme === "ORCID" && artwork.authorIdentifier) {
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
    if (artwork.depositor) {
      citation += `Depositor: ${artwork.depositor}\n`;
    }
    if (artwork.dateOfDeposit) {
      citation += `Deposit Date: ${artwork.dateOfDeposit.split('T')[0]}\n`;
    }
    
    return citation;
  };

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(generateCitation());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy citation:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onClose}
            className="mb-8 p-2 hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-muted relative">
              {artwork.imageUrl ? (
                <ImageWithFallback
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0067B1]/10 to-[#007749]/10">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-[#0067B1]/20" />
                    <div className="w-24 h-24 bg-[#007749]/20" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="mb-2">{artwork.title}</h2>
                {artwork.creator && (
                  <p className="text-muted-foreground">{artwork.creator}</p>
                )}
              </div>

              <div className="space-y-4">
                {artwork.year && (
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p>{artwork.year}</p>
                  </div>
                )}

                {artwork.medium && (
                  <div>
                    <p className="text-sm text-muted-foreground">Medium</p>
                    <p>{artwork.medium}</p>
                  </div>
                )}

                {artwork.genre && (
                  <div>
                    <p className="text-sm text-muted-foreground">Genre</p>
                    <p>{artwork.genre}</p>
                  </div>
                )}

                {artwork.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="mt-1">{artwork.description}</p>
                  </div>
                )}

                {artwork.dataset && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dataset</p>
                    <p className="mt-1">{artwork.dataset}</p>
                  </div>
                )}
              </div>

              {/* Citation Metadata Section */}
              <div className="pt-6 mt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#0067B1]">Citation Metadata</h3>
                  <Button
                    onClick={copyCitation}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Citation
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {artwork.datasetPersistentId && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                      <p className="text-sm">Persistent Identifier</p>
                      <p className="text-sm font-mono">{artwork.datasetPersistentId}</p>
                    </div>
                  )}

                  {artwork.publicationDate && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                      <p className="text-sm">Publication Date</p>
                      <p className="text-sm">{artwork.publicationDate}</p>
                    </div>
                  )}

                  {artwork.title && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                      <p className="text-sm">Title</p>
                      <p className="text-sm">{artwork.title}</p>
                    </div>
                  )}

                  {artwork.authorName && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                      <p className="text-sm">Author</p>
                      <p className="text-sm">
                        {artwork.authorName}
                        {artwork.authorAffiliation && ` (${artwork.authorAffiliation})`}
                        {artwork.authorIdentifierScheme === "ORCID" && artwork.authorIdentifier && (
                          <span className="text-[#0067B1]"> - ORCID: {artwork.authorIdentifier}</span>
                        )}
                      </p>
                    </div>
                  )}

                  {artwork.pointOfContact && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                      <p className="text-sm">Point of Contact</p>
                      <div className="text-sm space-y-1">
                        <p className="text-muted-foreground italic">Use email button above to contact.</p>
                        <p>{artwork.pointOfContact}</p>
                      </div>
                    </div>
                  )}

                  {artwork.description && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                      <p className="text-sm">Description</p>
                      <p className="text-sm">{artwork.description}</p>
                    </div>
                  )}

                  {artwork.subjects && artwork.subjects.length > 0 && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                      <p className="text-sm">Subject</p>
                      <p className="text-sm">{artwork.subjects.join(", ")}</p>
                    </div>
                  )}

                  {artwork.keywords && artwork.keywords.length > 0 && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                      <p className="text-sm">Keyword</p>
                      <p className="text-sm">{artwork.keywords.join(", ")}</p>
                    </div>
                  )}

                  {artwork.depositor && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                      <p className="text-sm">Depositor</p>
                      <p className="text-sm">{artwork.depositor}</p>
                    </div>
                  )}

                  {artwork.dateOfDeposit && (
                    <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                      <p className="text-sm">Deposit Date</p>
                      <p className="text-sm">{artwork.dateOfDeposit.split('T')[0]}</p>
                    </div>
                  )}
                </div>

                {/* Art Metadata Section */}
                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="mb-4 text-[#007749]">Art Metadata</h3>
                  <div className="space-y-2">
                    {artwork.accessionNumber && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Accession Number</p>
                        <p className="text-sm">{artwork.accessionNumber}</p>
                      </div>
                    )}

                    {artwork.creator && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Artist</p>
                        <p className="text-sm">{artwork.creator}</p>
                      </div>
                    )}

                    {artwork.artistNationality && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Artist Nationality</p>
                        <p className="text-sm">{artwork.artistNationality}</p>
                      </div>
                    )}

                    {artwork.centuryCreated && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Century Created</p>
                        <p className="text-sm">{artwork.centuryCreated}</p>
                      </div>
                    )}

                    {artwork.dateCreated && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Date Created</p>
                        <p className="text-sm">{artwork.dateCreated}</p>
                      </div>
                    )}

                    {artwork.geographicLocation && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Geographic Location</p>
                        <p className="text-sm">{artwork.geographicLocation}</p>
                      </div>
                    )}

                    {artwork.artType && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Art Type</p>
                        <p className="text-sm">{artwork.artType}</p>
                      </div>
                    )}

                    {artwork.dimensions && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Dimensions</p>
                        <p className="text-sm">{artwork.dimensions}</p>
                      </div>
                    )}

                    {artwork.medium && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Medium</p>
                        <p className="text-sm">{artwork.medium}</p>
                      </div>
                    )}

                    {artwork.printmaking && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Printmaking</p>
                        <p className="text-sm">{artwork.printmaking}</p>
                      </div>
                    )}

                    {artwork.printEditionNumber && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Print Edition Number</p>
                        <p className="text-sm">{artwork.printEditionNumber}</p>
                      </div>
                    )}

                    {artwork.artStyle && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Art Style</p>
                        <p className="text-sm">{artwork.artStyle}</p>
                      </div>
                    )}

                    {artwork.collection && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Collection</p>
                        <p className="text-sm">{artwork.collection}</p>
                      </div>
                    )}

                    {artwork.creditLine && (
                      <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-border/50">
                        <p className="text-sm">Credit Line</p>
                        <p className="text-sm">{artwork.creditLine}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4">
                    <p className="text-sm text-muted-foreground">
                      From FGCU Dataverse Collection
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
