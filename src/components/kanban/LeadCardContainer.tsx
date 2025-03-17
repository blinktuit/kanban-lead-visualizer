
import React, { useRef } from 'react';
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
  const dragImageRef = useRef<HTMLDivElement | null>(null);

  // Create and append a drag image element
  const createDragImage = () => {
    if (!dragImageRef.current) {
      const dragEl = document.createElement('div');
      dragEl.className = 'multi-card-drag';
      document.body.appendChild(dragEl);
      dragImageRef.current = dragEl;
    }
    return dragImageRef.current;
  };

  // Remove the drag image element when no longer needed
  const removeDragImage = () => {
    if (dragImageRef.current) {
      document.body.removeChild(dragImageRef.current);
      dragImageRef.current = null;
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    // Create a custom drag image if multiple items are selected
    if (isSelected && selectedCount > 1) {
      const dragEl = createDragImage();
      dragEl.innerHTML = `<div class="text-xs font-medium flex items-center">
                           <span class="bg-primary text-white rounded-full w-5 h-5 inline-flex items-center justify-center mr-1.5">${selectedCount}</span>
                           Leads verplaatsen
                         </div>`;
      
      // Set the drag image offset to position it near the cursor
      e.dataTransfer.setDragImage(dragEl, 20, 20);
    }
    
    onDragStart(e, lead.id);
  };
  
  const handleDragEnd = () => {
    removeDragImage();
    onDragEnd();
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
