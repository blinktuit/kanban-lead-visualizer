
import { useState, useMemo } from 'react';
import { Lead } from '@/types';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for filtering leads by search term and tags
 */
export function useLeadFiltering(leads: Lead[], pipelineId: string) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTag, setFilteredTag] = useState<string | null>(null);
  
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // First filter by pipeline position
      if (!lead.pipelinePositions[pipelineId]) return false;
      
      // Then filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          lead.name.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower) ||
          lead.jobTitle.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }
      
      // Then filter by tag if a tag filter is set
      if (filteredTag) {
        const hasTag = lead.tags.some(tag => tag.id === filteredTag);
        if (!hasTag) return false;
      }
      
      // Lead passed all filters
      return true;
    });
  }, [leads, pipelineId, searchTerm, filteredTag]);
  
  const getColumnLeads = (columnId: string) => {
    return filteredLeads.filter(lead => {
      return lead.pipelinePositions[pipelineId] === columnId;
    });
  };

  const handleFilterByTag = (tagId: string | null) => {
    setFilteredTag(tagId);
    
    if (tagId) {
      const tagName = leads
        .flatMap(lead => lead.tags)
        .find(tag => tag.id === tagId)?.name || tagId;
      
      toast({
        title: "Filter toegepast",
        description: `Gefilterd op tag: ${tagName}`,
      });
    } else {
      toast({
        title: "Filter verwijderd",
        description: "Alle leads worden weergegeven",
      });
    }
  };
  
  return {
    searchTerm,
    setSearchTerm,
    filteredTag,
    filteredLeads,
    getColumnLeads,
    handleFilterByTag
  };
}
