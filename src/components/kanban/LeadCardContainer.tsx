
import React from 'react';
import { Lead, KanbanSettings } from '@/types';
import LeadCard from './LeadCard';

interface LeadCardContainerProps {
  lead: Lead;
  settings: KanbanSettings;
  onSelectLead: (leadId: string, selected: boolean) => void;
  isSelected: boolean;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, leadId: string) => void;
  onDragEnd: () => void;
  selectionActive: boolean;
  selectedCount: number;
}

const LeadCardContainer: React.FC<LeadCardContainerProps> = ({
  lead,
  settings,
  onSelectLead,
  isSelected,
  isDragging,
  onDragStart,
  onDragEnd,
  selectionActive,
  selectedCount
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    // Create a drag image that shows the count of selected items
    if (isSelected && selectedCount > 1) {
      // Create a custom drag image if multiple items are selected
      const dragEl = document.createElement('div');
      dragEl.className = 'absolute p-2 bg-white rounded shadow-lg border border-primary/30 pointer-events-none';
      dragEl.innerHTML = `<div class="text-xs font-medium">Moving ${selectedCount} leads</div>`;
      document.body.appendChild(dragEl);
      
      // Set the drag image offset to position it near the cursor
      e.dataTransfer.setDragImage(dragEl, 20, 20);
      
      // Schedule removal of the element
      setTimeout(() => {
        document.body.removeChild(dragEl);
      }, 0);
    }
    
    onDragStart(e, lead.id);
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      <LeadCard 
        lead={lead} 
        settings={settings}
        onSelect={(id) => onSelectLead(id, !isSelected)}
        selected={isSelected}
        isDragging={isDragging}
        selectionActive={selectionActive}
      />
    </div>
  );
};

export default LeadCardContainer;
