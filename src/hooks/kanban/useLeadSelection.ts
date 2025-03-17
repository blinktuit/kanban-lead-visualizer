
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
    const newSelected = new Set(selectedLeads);
    if (selected) {
      newSelected.add(leadId);
    } else {
      newSelected.delete(leadId);
    }
    setSelectedLeads(newSelected);
  };
  
  const handleSelectAllInColumn = (columnLeads: Lead[]) => {
    // If all are already selected, deselect all
    const allAlreadySelected = columnLeads.every(lead => selectedLeads.has(lead.id));
    
    const newSelected = new Set(selectedLeads);
    
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
    
    setSelectedLeads(newSelected);
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
