
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchLeadsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchLeads: React.FC<SearchLeadsProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-64">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Leads zoeken..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setSearchTerm('')}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchLeads;
