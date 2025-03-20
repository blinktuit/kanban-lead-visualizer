import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchLeadsProps {
  onSearch: (term: string) => void;
  initialSearchTerm?: string;
}

const SearchLeads = ({ onSearch, initialSearchTerm = '' }: SearchLeadsProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={cn(
      "relative flex items-center transition-all duration-200 ease-in-out rounded-full",
      "bg-muted/60 hover:bg-muted focus-within:bg-muted/90",
      "border border-border/40 shadow-sm",
      searchTerm ? "w-72" : "w-64"
    )}>
      <div className="flex items-center justify-center w-9 h-9 pointer-events-none">
        <Search className="w-4 h-4 text-muted-foreground" />
      </div>
      
      <input
        type="text"
        placeholder="Zoek leads..."
        value={searchTerm}
        onChange={handleSearch}
        className={cn(
          "bg-transparent outline-none w-full py-2 pr-3 text-sm",
          "placeholder:text-muted-foreground/70 focus:placeholder:text-muted-foreground/50"
        )}
      />
      
      {searchTerm && (
        <button 
          onClick={clearSearch}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-full mr-1",
            "hover:bg-accent/80 transition-colors text-muted-foreground hover:text-foreground"
          )}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchLeads;
