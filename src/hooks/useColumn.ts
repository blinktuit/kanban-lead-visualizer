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
    
    // Voorkom dat de kolom wordt versleept als we leads verslepen
    e.stopPropagation();
    
    // If the dragged item is part of a selection, transfer all selected lead IDs
    if (selectedLeads.has(leadId) && selectedLeads.size > 1) {
      // Setup a custom drag image to show number of items
      const dragCount = selectedLeads.size;
      
      // Clone the current element for the drag image
      const originalElement = e.currentTarget as HTMLElement;
      const rect = originalElement.getBoundingClientRect();
      
      // Create a container for our custom drag ghost
      const ghostContainer = document.createElement('div');
      ghostContainer.style.position = 'absolute';
      ghostContainer.style.top = '-1000px';
      ghostContainer.style.left = '0';
      ghostContainer.style.width = `${rect.width}px`;
      ghostContainer.style.height = `${rect.height}px`;
      ghostContainer.style.overflow = 'hidden';
      
      // Clone the original element
      const clone = originalElement.cloneNode(true) as HTMLElement;
      clone.style.transform = 'none';
      clone.style.width = '100%';
      clone.style.height = '100%';
      
      // Add a badge showing the count of selected items
      const badge = document.createElement('div');
      badge.textContent = `${dragCount}`;
      badge.style.position = 'absolute';
      badge.style.top = '4px';
      badge.style.right = '4px';
      badge.style.backgroundColor = 'hsl(var(--primary))';
      badge.style.color = 'white';
      badge.style.borderRadius = '9999px';
      badge.style.padding = '2px 6px';
      badge.style.fontSize = '12px';
      badge.style.fontWeight = 'bold';
      badge.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      badge.style.zIndex = '50';
      
      // Add a semi-transparent overlay to indicate multiple selection
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.inset = '0';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.1)';
      overlay.style.borderRadius = '8px';
      overlay.style.zIndex = '10';
      
      // Assemble the ghost element
      ghostContainer.appendChild(clone);
      ghostContainer.appendChild(overlay);
      ghostContainer.appendChild(badge);
      document.body.appendChild(ghostContainer);
      
      // Set as drag image
      e.dataTransfer.setDragImage(ghostContainer, 20, 20);
      
      // Set the data being transferred - all selected leads
      e.dataTransfer.setData('text/plain', JSON.stringify(Array.from(selectedLeads)));
      
      // Clean up the ghost element after a short delay
      setTimeout(() => {
        document.body.removeChild(ghostContainer);
      }, 0);
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
