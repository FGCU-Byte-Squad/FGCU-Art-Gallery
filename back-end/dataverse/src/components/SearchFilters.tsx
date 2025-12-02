import { Search } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedArtist: string;
  onArtistChange: (value: string) => void;
  selectedGenre: string;
  onGenreChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  selectedMedium: string;
  onMediumChange: (value: string) => void;
  artists: string[];
  genres: string[];
  years: string[];
  mediums: string[];
  viewMode?: "desktop" | "mobile";
}

export function SearchFilters({
  searchTerm,
  onSearchChange,
  selectedArtist,
  onArtistChange,
  selectedGenre,
  onGenreChange,
  selectedYear,
  onYearChange,
  selectedMedium,
  onMediumChange,
  artists,
  genres,
  years,
  mediums,
  viewMode,
}: SearchFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search artworks by title, artist, or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12 h-14 bg-[#F5F7FA] border-0 rounded-xl text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#0067B1]"
        />
      </div>

      <div className={`grid gap-4 ${viewMode === "mobile" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Artist
          </label>
          <Select
            value={selectedArtist}
            onValueChange={onArtistChange}
          >
            <SelectTrigger className="h-12 bg-[#F5F7FA] border-0 rounded-xl">
              <SelectValue placeholder="All Artists" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Artists</SelectItem>
              {artists.map((artist) => (
                <SelectItem key={artist} value={artist}>
                  {artist}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Genre
          </label>
          <Select
            value={selectedGenre}
            onValueChange={onGenreChange}
          >
            <SelectTrigger className="h-12 bg-[#F5F7FA] border-0 rounded-xl">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Year
          </label>
          <Select
            value={selectedYear}
            onValueChange={onYearChange}
          >
            <SelectTrigger className="h-12 bg-[#F5F7FA] border-0 rounded-xl">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Medium
          </label>
          <Select
            value={selectedMedium}
            onValueChange={onMediumChange}
          >
            <SelectTrigger className="h-12 bg-[#F5F7FA] border-0 rounded-xl">
              <SelectValue placeholder="All Mediums" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Mediums</SelectItem>
              {mediums.map((medium) => (
                <SelectItem key={medium} value={medium}>
                  {medium}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
