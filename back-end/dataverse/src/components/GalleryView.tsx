import { useState, useEffect, useCallback, useRef } from "react";
import { GalleryHeader } from "./GalleryHeader";
import { ArtworkCard } from "./ArtworkCard";
import { ArtworkDetail } from "./ArtworkDetail";
import { SearchFilters } from "./SearchFilters";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

interface Artwork {
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
}

interface GalleryViewProps {
  initialSearchQuery?: string;
  onNavigateToHome: () => void;
}

const DATAVERSE_BASE_URL = "https://dataverse.fgcu.edu";
const API_KEY = "bb3bafd7-5666-41f9-af26-43db27cccf61";

// Mock data for demonstration (in case API doesn't return expected data)
const mockArtworks: Artwork[] = [
  {
    id: "1",
    title: "Sunset Over Estero Bay",
    creator: "Maria Rodriguez",
    year: "2023",
    description: "A vibrant watercolor depicting the beautiful sunset over Estero Bay.",
    medium: "Watercolor",
    genre: "Landscape",
    dataset: "Art Collection"
  },
  {
    id: "2",
    title: "Urban Geometry",
    creator: "James Chen",
    year: "2022",
    description: "Abstract composition exploring geometric forms in urban architecture.",
    medium: "Oil on Canvas",
    genre: "Abstract",
    dataset: "Art Collection"
  },
  {
    id: "3",
    title: "Coastal Flora",
    creator: "Sarah Williams",
    year: "2024",
    description: "Detailed botanical illustration of Southwest Florida coastal plants.",
    medium: "Digital Art",
    genre: "Botanical",
    dataset: "Art Collection"
  },
  {
    id: "4",
    title: "Portrait Study No. 7",
    creator: "Michael Thompson",
    year: "2023",
    description: "Contemporary portrait exploring identity and expression.",
    medium: "Acrylic",
    genre: "Portrait",
    dataset: "Art Collection"
  },
  {
    id: "5",
    title: "Mangrove Roots",
    creator: "Lisa Martinez",
    year: "2022",
    description: "Photographic study of mangrove root systems in their natural habitat.",
    medium: "Photography",
    genre: "Nature",
    dataset: "Art Collection"
  },
  {
    id: "6",
    title: "Memory Fragments",
    creator: "David Park",
    year: "2024",
    description: "Mixed media piece exploring themes of memory and time.",
    medium: "Mixed Media",
    genre: "Contemporary",
    dataset: "Art Collection"
  },
  {
    id: "7",
    title: "Gulf Waters",
    creator: "Maria Rodriguez",
    year: "2024",
    description: "Impressionist view of the Gulf of Mexico from Sanibel Island.",
    medium: "Watercolor",
    genre: "Landscape",
    dataset: "Art Collection"
  },
  {
    id: "8",
    title: "Sculptural Form III",
    creator: "James Chen",
    year: "2023",
    description: "Three-dimensional exploration of organic and geometric forms.",
    medium: "Bronze",
    genre: "Sculpture",
    dataset: "Art Collection"
  }
];

export function GalleryView({ initialSearchQuery, onNavigateToHome }: GalleryViewProps) {
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);
  const [displayedArtworks, setDisplayedArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Search filters
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery || "");
  const [selectedArtist, setSelectedArtist] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedMedium, setSelectedMedium] = useState("all");

  // Filter options
  const [artists, setArtists] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [mediums, setMediums] = useState<string[]>([]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchDataverseContent();
  }, []);

  // Extract unique filter values when artworks change
  useEffect(() => {
    if (allArtworks.length > 0) {
      const uniqueArtists = Array.from(new Set(allArtworks.map(a => a.creator).filter(Boolean))) as string[];
      const uniqueGenres = Array.from(new Set(allArtworks.map(a => a.genre).filter(Boolean))) as string[];
      const uniqueYears = Array.from(new Set(allArtworks.map(a => a.year).filter(Boolean))) as string[];
      const uniqueMediums = Array.from(new Set(allArtworks.map(a => a.medium).filter(Boolean))) as string[];

      setArtists(uniqueArtists.sort());
      setGenres(uniqueGenres.sort());
      setYears(uniqueYears.sort((a, b) => b.localeCompare(a))); // Newest first
      setMediums(uniqueMediums.sort());
    }
  }, [allArtworks]);

  // Filter artworks based on search criteria
  const filteredArtworks = allArtworks.filter((artwork) => {
    // Normalize DOI using available fields
    let doiCandidate =
      artwork.datasetPersistentId ||
      artwork.storageIdentifier ||
      "";
    doiCandidate = doiCandidate.replace(
      "dataverse_files://",
      "doi:",
    );

    const matchesSearch =
      searchTerm === "" ||
      artwork.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      artwork.creator
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      artwork.genre
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      artwork.year
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      artwork.medium
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      artwork.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doiCandidate
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesArtist =
      selectedArtist === "all" ||
      artwork.creator === selectedArtist;
    const matchesGenre =
      selectedGenre === "all" ||
      artwork.genre === selectedGenre;
    const matchesYear =
      selectedYear === "all" || artwork.year === selectedYear;
    const matchesMedium =
      selectedMedium === "all" ||
      artwork.medium === selectedMedium;

    return (
      matchesSearch &&
      matchesArtist &&
      matchesGenre &&
      matchesYear &&
      matchesMedium
    );
  });

  // Update displayed artworks when filters change
  useEffect(() => {
    setPage(1);
    setDisplayedArtworks(filteredArtworks.slice(0, ITEMS_PER_PAGE));
    setHasMore(filteredArtworks.length > ITEMS_PER_PAGE);
  }, [searchTerm, selectedArtist, selectedGenre, selectedYear, selectedMedium, allArtworks]);

  // Load more items
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = filteredArtworks.slice(startIndex, endIndex);
    
    setTimeout(() => {
      setDisplayedArtworks(prev => [...prev, ...newItems]);
      setPage(nextPage);
      setHasMore(endIndex < filteredArtworks.length);
      setLoadingMore(false);
    }, 300);
  }, [page, filteredArtworks, loadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMore, hasMore, loadingMore]);

  const fetchDataverseContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from the "art" dataverse subtree
      const response = await fetch(
        `${DATAVERSE_BASE_URL}/api/dataverses/art/contents?key=${API_KEY}`,
        {
          headers: {
            "Accept": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        // Fetch details for each dataset to get files and thumbnails
        const artworkPromises = data.data.map(async (item: any) => {
          try {
            if (item.type === "dataset" && item.id) {
              const datasetResponse = await fetch(
                `${DATAVERSE_BASE_URL}/api/datasets/${item.id}?key=${API_KEY}`,
                { headers: { "Accept": "application/json" } }
              );
              
              if (datasetResponse.ok) {
                const datasetData = await datasetResponse.json();
                const metadata = datasetData.data?.latestVersion?.metadataBlocks?.citation?.fields || [];
                const files = datasetData.data?.latestVersion?.files || [];
                const latestVersion = datasetData.data?.latestVersion || {};
                
                // Extract metadata fields
                const titleField = metadata.find((f: any) => f.typeName === "title");
                const authorField = metadata.find((f: any) => f.typeName === "author");
                const descriptionField = metadata.find((f: any) => f.typeName === "dsDescription");
                const keywordField = metadata.find((f: any) => f.typeName === "keyword");
                const dateField = metadata.find((f: any) => f.typeName === "productionDate");
                const subjectField = metadata.find((f: any) => f.typeName === "subject");
                const alternativeTitleField = metadata.find((f: any) => f.typeName === "alternativeTitle");
                const alternativeURLField = metadata.find((f: any) => f.typeName === "alternativeURL");
                const publicationDateField = metadata.find((f: any) => f.typeName === "publicationDate");
                const notesField = metadata.find((f: any) => f.typeName === "notesText");
                const languageField = metadata.find((f: any) => f.typeName === "language");
                const producerField = metadata.find((f: any) => f.typeName === "producer");
                const productionPlaceField = metadata.find((f: any) => f.typeName === "productionPlace");
                const contributorField = metadata.find((f: any) => f.typeName === "contributor");
                const grantNumberField = metadata.find((f: any) => f.typeName === "grantNumber");
                const distributorField = metadata.find((f: any) => f.typeName === "distributor");
                const topicClassificationField = metadata.find((f: any) => f.typeName === "topicClassification");
                const relatedPublicationField = metadata.find((f: any) => f.typeName === "publication");
                
                // Art-specific metadata fields (these may vary by Dataverse installation)
                const accessionNumberField = metadata.find((f: any) => f.typeName === "accessionNumber" || f.typeName === "otherIdValue");
                const artistNationalityField = metadata.find((f: any) => f.typeName === "artistNationality");
                const centuryCreatedField = metadata.find((f: any) => f.typeName === "centuryCreated" || f.typeName === "timePeriodCovered");
                const dateCreatedField = metadata.find((f: any) => f.typeName === "dateCreated" || f.typeName === "productionDate");
                const geographicLocationField = metadata.find((f: any) => f.typeName === "geographicLocation" || f.typeName === "geographicCoverage");
                const artTypeField = metadata.find((f: any) => f.typeName === "artType" || f.typeName === "kindOfData");
                const dimensionsField = metadata.find((f: any) => f.typeName === "dimensions" || f.typeName === "size");
                const printmakingField = metadata.find((f: any) => f.typeName === "printmaking");
                const printEditionNumberField = metadata.find((f: any) => f.typeName === "printEditionNumber" || f.typeName === "seriesInformation");
                const artStyleField = metadata.find((f: any) => f.typeName === "artStyle");
                const collectionField = metadata.find((f: any) => f.typeName === "collection" || f.typeName === "series");
                const creditLineField = metadata.find((f: any) => f.typeName === "creditLine" || f.typeName === "dataSources");
                
                const title = titleField?.value || item.title || "Untitled";
                
                // Extract detailed author information including ORCID
                const authorData = authorField?.value?.[0];
                const authorName = authorData?.authorName?.value || "Unknown Artist";
                const authorAffiliation = authorData?.authorAffiliation?.value || "";
                const authorIdentifierScheme = authorData?.authorIdentifierScheme?.value || "";
                const authorIdentifier = authorData?.authorIdentifier?.value || "";
                
                const creator = authorName;
                const description = descriptionField?.value?.[0]?.dsDescriptionValue?.value || "";
                const keywords = keywordField?.value || [];
                const year = dateField?.value || latestVersion.releaseTime?.substring(0, 4) || "";
                
                // Get thumbnail URL from first image file
                let imageUrl = "";
                const imageFile = files.find((f: any) => 
                  f.dataFile?.contentType?.startsWith("image/") || 
                  f.dataFile?.filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                );
                
                if (imageFile?.dataFile?.id) {
                  imageUrl = `${DATAVERSE_BASE_URL}/api/access/datafile/${imageFile.dataFile.id}`;
                }
                
                // Extract genre and medium from keywords or description
                let genre = "";
                let medium = "";
                
                if (keywords.length > 0) {
                  const keywordValues = keywords.map((k: any) => k.keywordValue?.value || "");
                  genre = keywordValues[0] || "";
                  medium = keywordValues[1] || "";
                }
                
                // Extract subjects
                const subjects = subjectField?.value || [];
                
                // Extract other metadata
                const keywordValues = keywords.map((k: any) => k.keywordValue?.value || "");
                const languages = languageField?.value || [];
                const producers = producerField?.value?.map((p: any) => p.producerName?.value || "") || [];
                const contributors = contributorField?.value?.map((c: any) => c.contributorName?.value || "") || [];
                const grantNumbers = grantNumberField?.value?.map((g: any) => g.grantNumberValue?.value || "") || [];
                const distributors = distributorField?.value?.map((d: any) => d.distributorName?.value || "") || [];
                const topicClassifications = topicClassificationField?.value?.map((t: any) => t.topicClassValue?.value || "") || [];
                const relatedPublications = relatedPublicationField?.value?.map((p: any) => p.publicationCitation?.value || "") || [];
                
                return {
                  id: item.id.toString(),
                  title,
                  creator,
                  year,
                  description,
                  imageUrl,
                  medium: medium || "Digital",
                  genre: genre || "Contemporary",
                  dataset: "Art Collection",
                  // Additional Dataverse metadata
                  persistentId: datasetData.data?.persistentId || "",
                  datasetPersistentId: datasetData.data?.persistentId || "",
                  storageIdentifier: datasetData.data?.storageIdentifier || "",
                  versionNumber: latestVersion.versionNumber || 0,
                  versionMinorNumber: latestVersion.versionMinorNumber || 0,
                  releaseTime: latestVersion.releaseTime || "",
                  lastUpdateTime: latestVersion.lastUpdateTime || "",
                  createTime: latestVersion.createTime || "",
                  license: latestVersion.license?.name || latestVersion.license || "",
                  termsOfAccess: latestVersion.termsOfAccess || "",
                  fileAccessRequest: latestVersion.fileAccessRequest || false,
                  metadataLanguage: latestVersion.metadataLanguage || "",
                  alternativeTitle: alternativeTitleField?.value || "",
                  alternativeURL: alternativeURLField?.value || "",
                  publicationDate: publicationDateField?.value || "",
                  depositor: latestVersion.depositor || "",
                  dateOfDeposit: latestVersion.dateOfDeposit || "",
                  subjects: subjects,
                  keywords: keywordValues,
                  topicClassification: topicClassifications,
                  relatedPublications: relatedPublications,
                  notes: notesField?.value || "",
                  language: languages,
                  producer: producers,
                  productionDate: dateField?.value || "",
                  productionPlace: productionPlaceField?.value || "",
                  contributor: contributors,
                  grantNumber: grantNumbers,
                  distributor: distributors,
                  authorName: authorName,
                  authorAffiliation: authorAffiliation,
                  authorIdentifierScheme: authorIdentifierScheme,
                  authorIdentifier: authorIdentifier,
                  pointOfContact: authorName + (authorAffiliation ? ` (${authorAffiliation})` : ""),
                  pointOfContactEmail: authorData?.authorEmail?.value || "",
                  // Art-specific metadata
                  accessionNumber: accessionNumberField?.value || (accessionNumberField?.value?.[0]?.otherIdValue?.value) || "",
                  artistNationality: artistNationalityField?.value || "",
                  centuryCreated: centuryCreatedField?.value || (centuryCreatedField?.value?.[0]?.timePeriodCoveredValue?.value) || "",
                  dateCreated: dateCreatedField?.value || dateField?.value || "",
                  geographicLocation: geographicLocationField?.value || (geographicLocationField?.value?.[0]?.geographicCoverageValue?.value) || "",
                  artType: artTypeField?.value || (artTypeField?.value?.[0]) || "",
                  dimensions: dimensionsField?.value || "",
                  printmaking: printmakingField?.value || medium,
                  printEditionNumber: printEditionNumberField?.value || (printEditionNumberField?.value?.seriesInformation?.value) || "",
                  artStyle: artStyleField?.value || genre,
                  collection: collectionField?.value || (collectionField?.value?.seriesName?.value) || "FGCU Art Galleries Permanent Collection",
                  creditLine: creditLineField?.value || (creditLineField?.value?.[0]) || "",
                };
              }
            }
            return null;
          } catch (err) {
            console.error("Error fetching dataset details:", err);
            return null;
          }
        });

        const artworksResults = await Promise.all(artworkPromises);
        const validArtworks = artworksResults.filter(a => a !== null) as Artwork[];
        
        if (validArtworks.length > 0) {
          setAllArtworks(validArtworks);
          setDisplayedArtworks(validArtworks.slice(0, ITEMS_PER_PAGE));
          setHasMore(validArtworks.length > ITEMS_PER_PAGE);
        } else {
          // Use mock data if no valid artworks found
          setAllArtworks(mockArtworks);
          setDisplayedArtworks(mockArtworks.slice(0, ITEMS_PER_PAGE));
          setHasMore(mockArtworks.length > ITEMS_PER_PAGE);
          setError("Using sample data. The art dataverse may be empty or inaccessible.");
        }
      } else {
        // Use mock data if API structure is unexpected
        setAllArtworks(mockArtworks);
        setDisplayedArtworks(mockArtworks.slice(0, ITEMS_PER_PAGE));
        setHasMore(mockArtworks.length > ITEMS_PER_PAGE);
        setError("Using sample data. Note: API key should be stored securely on a backend server.");
      }
    } catch (err) {
      console.error("Error fetching from Dataverse:", err);
      // Use mock data as fallback
      setAllArtworks(mockArtworks);
      setDisplayedArtworks(mockArtworks.slice(0, ITEMS_PER_PAGE));
      setHasMore(mockArtworks.length > ITEMS_PER_PAGE);
      setError("Using sample data. Could not connect to FGCU Dataverse. Note: API key should be stored securely on a backend server.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#0067B1]" />
          <p className="text-muted-foreground">Loading collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <GalleryHeader />
      
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-3">
            <AlertCircle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onNavigateToHome}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedArtist={selectedArtist}
          onArtistChange={setSelectedArtist}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedMedium={selectedMedium}
          onMediumChange={setSelectedMedium}
          artists={artists}
          genres={genres}
          years={years}
          mediums={mediums}
        />

        <div className="mt-12">
          {displayedArtworks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No artworks found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                {displayedArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onClick={() => setSelectedArtwork(artwork)}
                  />
                ))}
              </div>

              {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                  {loadingMore && (
                    <Loader2 className="w-6 h-6 animate-spin text-[#0067B1]" />
                  )}
                </div>
              )}

              {!hasMore && displayedArtworks.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">
                    All artworks displayed ({displayedArtworks.length} total)
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {selectedArtwork && (
        <ArtworkDetail
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
}
