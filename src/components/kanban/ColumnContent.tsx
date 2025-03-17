
import React from 'react';
import { Lead, KanbanSettings } from '@/types';
import LeadCardContainer from './LeadCardContainer';

interface ColumnContentProps {
  leads: Lead[];
  settings: KanbanSettings;
  onSelectLead: (leadId: string, selected: boolean) => void;
  selectedLeads: Set<string>;
  draggedLeadId: string | null;
  onDragStart: (e: React.DragEvent, leadId: string) => void;
  onDragEnd: () => void;
}

const ColumnContent: React.FC<ColumnContentProps> = ({
  leads,
  settings,
  onSelectLead,
  selectedLeads,
  draggedLeadId,
  onDragStart,
  onDragEnd
}) => {
  return (
    <div className="kanban-scrollable">
      {leads.map(lead => (
        <LeadCardContainer 
          key={lead.id}
          lead={lead}
          settings={settings}
          onSelectLead={onSelectLead}
          isSelected={selectedLeads.has(lead.id)}
          isDragging={draggedLeadId === lead.id}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  );
};

export default ColumnContent;
