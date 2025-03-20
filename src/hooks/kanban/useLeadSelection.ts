import { useState, useEffect } from 'react';
import { Lead } from '@/types';

/**
 * Hook for managing lead selection functionality
 */
export function useLeadSelection() {
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);
  
  // Update bulk mode status when selected leads change
  useEffect(() => {
    setIsBulkMode(selectedLeads.size > 0);
  }, [selectedLeads]);
  
  const handleSelectLead = (leadId: string, selected: boolean) => {
    setSelectedLeads(prev => {
      const newSelected = new Set(prev);
      if (selected) {
        newSelected.add(leadId);
      } else {
        newSelected.delete(leadId);
      }
      return newSelected;
    });
  };
  
  const handleSelectAllInColumn = (columnLeads: Lead[]) => {
    setSelectedLeads(prev => {
      const newSelected = new Set(prev);
      
      // Check if all leads in this column are already selected
      const allAlreadySelected = columnLeads.every(lead => prev.has(lead.id));
      
      if (allAlreadySelected) {
        // Deselect all in this column
        columnLeads.forEach(lead => {
          newSelected.delete(lead.id);
        });
      } else {
        // Select all in this column
        columnLeads.forEach(lead => {
          newSelected.add(lead.id);
        });
      }
      
      return newSelected;
    });
  };
  
  const handleClearSelection = () => {
    setSelectedLeads(new Set());
  };
  
  return {
    selectedLeads,
    isBulkMode,
    handleSelectLead,
    handleSelectAllInColumn,
    handleClearSelection
  };
}
