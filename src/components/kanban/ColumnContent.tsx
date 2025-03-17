
import React from 'react';
import { Lead, KanbanSettings } from '@/types';
import LeadCardContainer from './LeadCardContainer';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  // Determine if selection mode is active
  const selectionActive = selectedLeads.size > 0;
  
  return (
    <ScrollArea className="kanban-scrollable" type="hover">
      <div className="pr-1">
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
            selectionActive={selectionActive}
            selectedCount={selectedLeads.size}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ColumnContent;
