
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
}

const LeadCardContainer: React.FC<LeadCardContainerProps> = ({
  lead,
  settings,
  onSelectLead,
  isSelected,
  isDragging,
  onDragStart,
  onDragEnd
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onDragEnd={onDragEnd}
    >
      <LeadCard 
        lead={lead} 
        settings={settings}
        onSelect={(id) => onSelectLead(id, !isSelected)}
        selected={isSelected}
        isDragging={isDragging}
      />
    </div>
  );
};

export default LeadCardContainer;
