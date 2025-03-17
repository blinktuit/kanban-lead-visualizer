
import React from 'react';
import { Lead, KanbanSettings } from '@/types';
import LeadCard from './LeadCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ColumnContentProps {
  leads: Lead[];
  settings: KanbanSettings;
  onSelectLead: (leadId: string, selected: boolean) => void;
  selectedLeads: Set<string>;
  draggedLeadId: string | null;
  onDragStart: (e: React.DragEvent, leadId: string) => void;
  onDragEnd: () => void;
  onAddLabel?: (leadId: string) => void;
  onAddToPipeline?: (leadId: string) => void;
}

const ColumnContent: React.FC<ColumnContentProps> = ({
  leads,
  settings,
  onSelectLead,
  selectedLeads,
  draggedLeadId,
  onDragStart,
  onDragEnd,
  onAddLabel,
  onAddToPipeline
}) => {
  const handleLeadSelect = (leadId: string) => {
    onSelectLead(leadId, !selectedLeads.has(leadId));
  };
  
  return (
    <div className="kanban-column-content h-full">
      <ScrollArea className="h-full max-h-[calc(5*112px)]">
        <div className="p-2 space-y-2">
          {leads.length === 0 ? (
            <div className="text-muted-foreground text-sm py-2 px-3 text-center">
              Geen leads in deze kolom
            </div>
          ) : (
            leads.map(lead => (
              <div
                key={lead.id}
                draggable
                onDragStart={(e) => onDragStart(e, lead.id)}
                onDragEnd={onDragEnd}
                className="cursor-grab active:cursor-grabbing"
              >
                <LeadCard
                  lead={lead}
                  settings={settings}
                  onSelect={handleLeadSelect}
                  selected={selectedLeads.has(lead.id)}
                  isDragging={draggedLeadId === lead.id}
                  selectionActive={selectedLeads.size > 0}
                  onAddLabel={onAddLabel}
                  onAddToPipeline={onAddToPipeline}
                />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ColumnContent;
