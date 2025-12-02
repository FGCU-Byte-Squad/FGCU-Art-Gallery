import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { GalleryHeader } from "./GalleryHeader";
import { ArtworkCard } from "./ArtworkCard";
import { ArtworkDetail } from "./ArtworkDetail";
import { SearchFilters } from "./SearchFilters";
import {
  Loader2,
  AlertCircle,
  ArrowLeft,
  Monitor,
  Smartphone,
} from "lucide-react";
import { Button } from "./ui/button";

interface Artwork {
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

// Specific draft datasets to include
const DRAFT_DATASETS = [
  "doi:10.60863/SF/F4YNMU", // video_mp4
  "doi:10.60863/SF/8SBYXW", // Music_mp3
  "doi:10.60863/SF/HEFUMB", // Image
  "doi:10.60863/SF/FPMOFD", // Image
  "doi:10.60863/SF/UNAYNG", // Image
  "doi:10.60863/SF/0TCSWH", // Image
  "doi:10.60863/SF/X9Z5YA", // Image
  "doi:10.60863/SF/PUT1IH", // Image
  "doi:10.60863/SF/BSH2CO", // Image
  "doi:10.60863/SF/HLLIIJ", // Image
  "doi:10.60863/SF/MA3FF4", // Image
  "doi:10.60863/SF/QWYVY6", // Image
  "doi:10.60863/SF/THNZLG", // Image
  "doi:10.60863/SF/EUYVFC", // Image
  "doi:10.60863/SF/CCGYMJ", // Image
  "doi:10.60863/SF/TRY6YF", // Image
  "doi:10.60863/SF/TTLFOI", // Image
];

// Mock data for demonstration (in case API doesn't return expected data)
const mockArtworks: Artwork[] = [
  {
    id: "1",
    title: "Sunset Over Estero Bay",
    creator: "Maria Rodriguez",
    year: "2023",
    description:
      "A vibrant watercolor depicting the beautiful sunset over Estero Bay.",
    medium: "Watercolor",
    genre: "Landscape",
    dataset: "Art Collection",
  },
  {
    id: "2",
    title: "Urban Geometry",
    creator: "James Chen",
    year: "2022",
    description:
      "Abstract composition exploring geometric forms in urban architecture.",
    medium: "Oil on Canvas",
    genre: "Abstract",
    dataset: "Art Collection",
  },
  {
    id: "3",
    title: "Coastal Flora",
    creator: "Sarah Williams",
    year: "2024",
    description:
      "Detailed botanical illustration of Southwest Florida coastal plants.",
    medium: "Digital Art",
    genre: "Botanical",
    dataset: "Art Collection",
  },
  {
    id: "4",
    title: "Portrait Study No. 7",
    creator: "Michael Thompson",
    year: "2023",
    description:
      "Contemporary portrait exploring identity and expression.",
    medium: "Acrylic",
    genre: "Portrait",
    dataset: "Art Collection",
  },
  {
    id: "5",
    title: "Mangrove Roots",
    creator: "Lisa Martinez",
    year: "2022",
    description:
      "Photographic study of mangrove root systems in their natural habitat.",
    medium: "Photography",
    genre: "Nature",
    dataset: "Art Collection",
  },
  {
    id: "6",
    title: "Memory Fragments",
    creator: "David Park",
    year: "2024",
    description:
      "Mixed media piece exploring themes of memory and time.",
    medium: "Mixed Media",
    genre: "Contemporary",
    dataset: "Art Collection",
  },
  {
    id: "7",
    title: "Gulf Waters",
    creator: "Maria Rodriguez",
    year: "2024",
    description:
      "Impressionist view of the Gulf of Mexico from Sanibel Island.",
    medium: "Watercolor",
    genre: "Landscape",
    dataset: "Art Collection",
  },
  {
    id: "8",
    title: "Sculptural Form III",
    creator: "James Chen",
    year: "2023",
    description:
      "Three-dimensional exploration of organic and geometric forms.",
    medium: "Bronze",
    genre: "Sculpture",
    dataset: "Art Collection",
  },
];

export function GalleryView({
  initialSearchQuery,
  onNavigateToHome,
}: GalleryViewProps) {
  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);
  const [displayedArtworks, setDisplayedArtworks] = useState<
    Artwork[]
  >([]);
  const [selectedArtwork, setSelectedArtwork] =
    useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<
    "desktop" | "mobile"
  >("desktop");

  // Search filters
  const [searchTerm, setSearchTerm] = useState(
    initialSearchQuery || "",
  );
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
      const uniqueArtists = Array.from(
        new Set(
          allArtworks.map((a) => a.creator).filter(Boolean),
        ),
      ) as string[];
      const uniqueGenres = Array.from(
        new Set(
          allArtworks.map((a) => a.genre).filter(Boolean),
        ),
      ) as string[];
      const uniqueYears = Array.from(
        new Set(allArtworks.map((a) => a.year).filter(Boolean)),
      ) as string[];
      const uniqueMediums = Array.from(
        new Set(
          allArtworks.map((a) => a.medium).filter(Boolean),
        ),
      ) as string[];

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
    setDisplayedArtworks(
      filteredArtworks.slice(0, ITEMS_PER_PAGE),
    );
    setHasMore(filteredArtworks.length > ITEMS_PER_PAGE);
  }, [
    searchTerm,
    selectedArtist,
    selectedGenre,
    selectedYear,
    selectedMedium,
    allArtworks,
  ]);

  // Load more items
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = filteredArtworks.slice(
      startIndex,
      endIndex,
    );

    setTimeout(() => {
      setDisplayedArtworks((prev) => [...prev, ...newItems]);
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
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !loadingMore
        ) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMore, hasMore, loadingMore]);

  // Helper function to process dataset metadata
  const processDatasetMetadata = (datasetData: any, itemId?: string, itemTitle?: string): Artwork | null => {
    try {
      const citationMetadata =
        datasetData.data?.latestVersion?.metadataBlocks?.citation?.fields || [];
      const artMetadata =
        datasetData.data?.latestVersion?.metadataBlocks?.art?.fields || [];
      const files = datasetData.data?.latestVersion?.files || [];
      const latestVersion = datasetData.data?.latestVersion || {};

      // Extract Citation metadata fields
      const titleField = citationMetadata.find((f: any) => f.typeName === "title");
      const authorField = citationMetadata.find((f: any) => f.typeName === "author");
      const datasetContactField = citationMetadata.find((f: any) => f.typeName === "datasetContact");
      const descriptionField = citationMetadata.find((f: any) => f.typeName === "dsDescription");
      const keywordField = citationMetadata.find((f: any) => f.typeName === "keyword");
      const subjectField = citationMetadata.find((f: any) => f.typeName === "subject");
      const publicationDateField = citationMetadata.find((f: any) => f.typeName === "publicationDate");

      // Extract Art metadata fields
      const accessionNumberField = artMetadata.find(
        (f: any) => f.typeName === "accessionNumber" || f.typeName.trim() === "accessionNumber"
      );
      const artistField = artMetadata.find((f: any) => f.typeName === "artist");
      const artistNationalityField = artMetadata.find((f: any) => f.typeName === "artistNationality");
      const centuryCreatedField = artMetadata.find((f: any) => f.typeName === "centuryCreated");
      const dateCreatedField = artMetadata.find((f: any) => f.typeName === "dateCreated");
      const geographicSubjectField = artMetadata.find(
        (f: any) => f.typeName === "geographicSubject" || f.typeName.trim() === "geographicSubject"
      );
      const artTypeField = artMetadata.find((f: any) => f.typeName === "artType");
      const dimensionsField = artMetadata.find(
        (f: any) => f.typeName === "dimensions" || f.typeName.trim() === "dimensions"
      );
      const mediumField = artMetadata.find((f: any) => f.typeName === "medium");
      const printmakingField = artMetadata.find((f: any) => f.typeName === "printmaking");
      const printEditionNumberField = artMetadata.find((f: any) => f.typeName === "printEditionNumber");
      const artStyleField = artMetadata.find((f: any) => f.typeName === "artStyle");
      const collectionField = artMetadata.find((f: any) => f.typeName === "collection");
      const creditLineField = artMetadata.find((f: any) => f.typeName === "creditLine");

      const title = titleField?.value || itemTitle || "Untitled";

      // Extract author information from citation metadata
      const authorData = authorField?.value?.[0];
      const authorName = authorData?.authorName?.value || "Unknown Artist";
      const authorAffiliation = authorData?.authorAffiliation?.value || "";
      const authorIdentifierScheme = authorData?.authorIdentifierScheme?.value || "";
      const authorIdentifier = authorData?.authorIdentifier?.value || "";

      // Extract Point of Contact from datasetContact
      const contactData = datasetContactField?.value?.[0];
      const contactName = contactData?.datasetContactName?.value || "";
      const contactAffiliation = contactData?.datasetContactAffiliation?.value || "";
      const contactEmail = contactData?.datasetContactEmail?.value || "";
      const pointOfContact = contactName + (contactAffiliation ? ` (${contactAffiliation})` : "");

      // Extract artist from art metadata (prioritize over citation author)
      const artistValue = artistField?.value;
      const artist = Array.isArray(artistValue) ? artistValue[0] : artistValue || authorName;

      const creator = artist;
      const description = descriptionField?.value?.[0]?.dsDescriptionValue?.value || "";
      const keywords = keywordField?.value || [];
      
      // Get year from art metadata or fallback to release time
      const dateCreatedValue = dateCreatedField?.value;
      const year = Array.isArray(dateCreatedValue)
        ? dateCreatedValue[0]
        : dateCreatedValue || latestVersion.releaseTime?.substring(0, 4) || "";

      // Get image file URL (with API key for draft access)
      let imageUrl = "";
      const imageFile = files.find(
        (f: any) =>
          f.dataFile?.contentType?.startsWith("image/") ||
          f.dataFile?.filename?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      );
      if (imageFile?.dataFile?.id) {
        imageUrl = `${DATAVERSE_BASE_URL}/api/access/datafile/${imageFile.dataFile.id}?key=${API_KEY}`;
        console.log(`Generated image URL for ${title}: ${imageUrl}`);
      }

      // Get audio file URL (with API key for draft access)
      let audioUrl = "";
      const audioFile = files.find(
        (f: any) =>
          f.dataFile?.contentType?.startsWith("audio/") ||
          f.dataFile?.filename?.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i)
      );
      if (audioFile?.dataFile?.id) {
        audioUrl = `${DATAVERSE_BASE_URL}/api/access/datafile/${audioFile.dataFile.id}?key=${API_KEY}`;
        console.log(`Generated audio URL for ${title}: ${audioUrl}`);
      }

      // Get video file URL (with API key for draft access)
      let videoUrl = "";
      const videoFile = files.find(
        (f: any) =>
          f.dataFile?.contentType?.startsWith("video/") ||
          f.dataFile?.filename?.match(/\.(mp4|mov|avi|webm|mkv)$/i)
      );
      if (videoFile?.dataFile?.id) {
        videoUrl = `${DATAVERSE_BASE_URL}/api/access/datafile/${videoFile.dataFile.id}?key=${API_KEY}`;
      }

      // Extract genre and medium from art metadata or keywords
      const artStyleValue = artStyleField?.value;
      const mediumValue = mediumField?.value;
      const genre = Array.isArray(artStyleValue) ? artStyleValue[0] : artStyleValue || "";
      const medium = Array.isArray(mediumValue) ? mediumValue[0] : mediumValue || "";

      // Extract subjects and keywords
      const subjects = subjectField?.value || [];
      const keywordValues = keywords.map((k: any) => k.keywordValue?.value || "");

      // Use persistentId as unique identifier to avoid collisions
      const persistentIdValue = datasetData.data?.persistentId || "";
      const uniqueId = persistentIdValue || 
        (itemId ? `item-${itemId}` : `dataset-${datasetData.data?.id || Math.random().toString(36).substring(2, 15)}`);

      return {
        id: uniqueId,
        title,
        creator,
        year,
        description,
        imageUrl,
        audioUrl,
        videoUrl,
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
        publicationDate: publicationDateField?.value || datasetData.data?.publicationDate || "",
        depositor: latestVersion.depositor || "",
        dateOfDeposit: latestVersion.dateOfDeposit || "",
        subjects: subjects,
        keywords: keywordValues,
        authorName: authorName,
        authorAffiliation: authorAffiliation,
        authorIdentifierScheme: authorIdentifierScheme,
        authorIdentifier: authorIdentifier,
        pointOfContact: pointOfContact,
        pointOfContactEmail: contactEmail,
        // Art-specific metadata from art metadata block
        accessionNumber: accessionNumberField?.value || "",
        artistNationality: Array.isArray(artistNationalityField?.value)
          ? artistNationalityField.value[0]
          : artistNationalityField?.value || "",
        centuryCreated: Array.isArray(centuryCreatedField?.value)
          ? centuryCreatedField.value[0]
          : centuryCreatedField?.value || "",
        dateCreated: year,
        geographicLocation: Array.isArray(geographicSubjectField?.value)
          ? geographicSubjectField.value[0]
          : geographicSubjectField?.value || "",
        artType: Array.isArray(artTypeField?.value) ? artTypeField.value[0] : artTypeField?.value || "",
        dimensions: Array.isArray(dimensionsField?.value)
          ? dimensionsField.value[0]
          : dimensionsField?.value || "",
        printmaking: Array.isArray(printmakingField?.value)
          ? printmakingField.value[0]
          : printmakingField?.value || "",
        printEditionNumber: Array.isArray(printEditionNumberField?.value)
          ? printEditionNumberField.value[0]
          : printEditionNumberField?.value || "",
        artStyle: genre,
        collection: Array.isArray(collectionField?.value)
          ? collectionField.value[0]
          : collectionField?.value || "FGCU Art Galleries Permanent Collection",
        creditLine: Array.isArray(creditLineField?.value)
          ? creditLineField.value[0]
          : creditLineField?.value || "",
      };
    } catch (err) {
      console.error("Error processing dataset metadata:", err);
      return null;
    }
  };

  const fetchDataverseContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const allArtworkPromises: Promise<Artwork | null>[] = [];

      // 1. Fetch from the "art" dataverse subtree
      try {
        const response = await fetch(
          `${DATAVERSE_BASE_URL}/api/dataverses/art/contents?key=${API_KEY}`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();

          if (data.data && Array.isArray(data.data)) {
            // Fetch details for each dataset to get files and thumbnails
            const artDataversePromises = data.data.map(
              async (item: any) => {
                try {
                  if (item.type === "dataset" && item.id) {
                    const datasetResponse = await fetch(
                      `${DATAVERSE_BASE_URL}/api/datasets/${item.id}?key=${API_KEY}`,
                      { headers: { Accept: "application/json" } },
                    );

                    if (datasetResponse.ok) {
                      const datasetData = await datasetResponse.json();
                      return processDatasetMetadata(datasetData, item.id.toString(), item.title);
                    }
                  }
                  return null;
                } catch (err) {
                  console.error("Error fetching dataset details:", err);
                  return null;
                }
              },
            );
            allArtworkPromises.push(...artDataversePromises);
          }
        }
      } catch (err) {
        console.error("Error fetching from art dataverse:", err);
      }

      // 2. Fetch specific draft datasets by persistent ID (including draft versions)
      const draftDatasetPromises = DRAFT_DATASETS.map(async (persistentId) => {
        try {
          // Try to fetch the latest version (including draft)
          const datasetResponse = await fetch(
            `${DATAVERSE_BASE_URL}/api/datasets/:persistentId/versions/:latest?persistentId=${persistentId}&key=${API_KEY}`,
            { headers: { Accept: "application/json" } },
          );

          if (datasetResponse.ok) {
            const versionData = await datasetResponse.json();
            console.log(`Successfully fetched draft dataset ${persistentId}`);
            // Wrap the version data in the expected structure
            const datasetData = {
              data: {
                ...versionData.data,
                latestVersion: versionData.data,
              }
            };
            return processDatasetMetadata(datasetData);
          } else {
            const errorText = await datasetResponse.text();
            console.error(`Failed to fetch draft dataset ${persistentId}: ${datasetResponse.status}`, errorText);
          }
          return null;
        } catch (err) {
          console.error(`Error fetching draft dataset ${persistentId}:`, err);
          return null;
        }
      });

      allArtworkPromises.push(...draftDatasetPromises);

      // Wait for all datasets to be fetched
      const artworksResults = await Promise.all(allArtworkPromises);
      const validArtworks = artworksResults.filter(
        (a) => a !== null,
      ) as Artwork[];

      // Deduplicate artworks by persistentId or id, then by title
      const uniqueArtworksMap = new Map<string, Artwork>();
      const titleMap = new Map<string, Set<string>>(); // Track titles to detect duplicates
      
      validArtworks.forEach((artwork) => {
        const key = artwork.persistentId || artwork.id;
        const titleKey = artwork.title.toLowerCase().trim();
        
        // Skip if we already have this persistentId
        if (uniqueArtworksMap.has(key)) {
          return;
        }
        
        // Check if we already have this title
        if (!titleMap.has(titleKey)) {
          titleMap.set(titleKey, new Set());
        }
        
        const titleSet = titleMap.get(titleKey)!;
        titleSet.add(key);
        
        // Only add the first occurrence of each title
        if (titleSet.size === 1) {
          uniqueArtworksMap.set(key, artwork);
        }
      });
      
      const uniqueArtworks = Array.from(uniqueArtworksMap.values());

      if (uniqueArtworks.length > 0) {
        setAllArtworks(uniqueArtworks);
        setDisplayedArtworks(
          uniqueArtworks.slice(0, ITEMS_PER_PAGE),
        );
        setHasMore(uniqueArtworks.length > ITEMS_PER_PAGE);
      } else {
        // Use mock data if no valid artworks found
        setAllArtworks(mockArtworks);
        setDisplayedArtworks(
          mockArtworks.slice(0, ITEMS_PER_PAGE),
        );
        setHasMore(mockArtworks.length > ITEMS_PER_PAGE);
        setError(
          "Using sample data. The art dataverse may be empty or inaccessible.",
        );
      }
    } catch (err) {
      console.error("Error fetching from Dataverse:", err);
      // Use mock data as fallback
      setAllArtworks(mockArtworks);
      setDisplayedArtworks(
        mockArtworks.slice(0, ITEMS_PER_PAGE),
      );
      setHasMore(mockArtworks.length > ITEMS_PER_PAGE);
      setError(
        "Using sample data. Could not connect to FGCU Dataverse. Note: API key should be stored securely on a backend server.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-[#F5F7FA] min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#0067B1]" />
          <p className="text-gray-600 text-lg">
            Loading collection...
          </p>
        </div>
      </div>
    );
  }

  const containerClass =
    viewMode === "mobile"
      ? "max-w-md mx-auto"
      : "max-w-7xl mx-auto";

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <GalleryHeader />

      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 text-sm text-amber-700 bg-amber-50 px-5 py-4 rounded-xl border border-amber-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <main className={`${containerClass} px-6 py-8`}>
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <Button
            variant="ghost"
            onClick={onNavigateToHome}
            className="gap-2 text-gray-700 hover:text-[#0067B1] hover:bg-[#0067B1]/10 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === "desktop" ? "mobile" : "desktop")}
              className="gap-2 border-2 border-[#0067B1] text-[#0067B1] hover:bg-[#0067B1] hover:text-white transition-all duration-200 rounded-xl"
            >
              {viewMode === "desktop" ? (
                <>
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </>
              ) : (
                <>
                  <Monitor className="w-4 h-4" />
                  Desktop
                </>
              )}
            </Button>
          </div>
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
          viewMode={viewMode}
        />

        <div className="mt-12">
          {displayedArtworks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-md">
              <p className="text-gray-600 text-lg">
                No artworks found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <div className={`grid gap-8 ${viewMode === "mobile" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
                {displayedArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onClick={() => setSelectedArtwork(artwork)}
                  />
                ))}
              </div>

              {hasMore && (
                <div
                  ref={loadMoreRef}
                  className="flex justify-center py-12"
                >
                  {loadingMore && (
                    <Loader2 className="w-8 h-8 animate-spin text-[#0067B1]" />
                  )}
                </div>
              )}

              {!hasMore && displayedArtworks.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
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
          viewMode={viewMode}
        />
      )}
    </div>
  );
}
