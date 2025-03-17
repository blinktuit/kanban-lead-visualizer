
import { useState } from 'react';

export function useColumn() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDragEnd = () => {
    setDraggedLeadId(null);
  };
  
  const handleDragStart = (e: React.DragEvent, leadId: string, selectedLeads: Set<string>, onSelectLead: (id: string, selected: boolean) => void) => {
    setDraggedLeadId(leadId);
    
    // If the dragged item is part of a selection, transfer all selected lead IDs
    if (selectedLeads.has(leadId) && selectedLeads.size > 1) {
      e.dataTransfer.setData('text/plain', JSON.stringify(Array.from(selectedLeads)));
    } else {
      // Just transfer the single lead ID
      e.dataTransfer.setData('text/plain', leadId);
      
      // If dragging a non-selected item, deselect everything else
      if (!selectedLeads.has(leadId)) {
        // Clear other selections
        selectedLeads.forEach(id => {
          if (id !== leadId) onSelectLead(id, false);
        });
        
        // Select just this one
        onSelectLead(leadId, true);
      }
    }
    
    e.dataTransfer.effectAllowed = 'move';
  };
  
  return {
    isDragOver,
    draggedLeadId,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDragStart
  };
}
