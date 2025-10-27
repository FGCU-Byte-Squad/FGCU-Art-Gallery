import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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
}: SearchFiltersProps) {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search artworks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11 h-12 bg-input-background border-border"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Artist</label>
          <Select value={selectedArtist} onValueChange={onArtistChange}>
            <SelectTrigger className="bg-input-background">
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
          <label className="text-sm text-muted-foreground mb-2 block">Genre</label>
          <Select value={selectedGenre} onValueChange={onGenreChange}>
            <SelectTrigger className="bg-input-background">
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
          <label className="text-sm text-muted-foreground mb-2 block">Year</label>
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="bg-input-background">
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
          <label className="text-sm text-muted-foreground mb-2 block">Medium</label>
          <Select value={selectedMedium} onValueChange={onMediumChange}>
            <SelectTrigger className="bg-input-background">
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
