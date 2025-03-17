import React from 'react';
import { Column as ColumnType, Lead, KanbanSettings } from '@/types';
import ColumnHeader from './ColumnHeader';
import ColumnDragLayer from './ColumnDragLayer';
import ColumnContent from './ColumnContent';
import { useColumn } from '@/hooks/useColumn';
import { cn } from '@/lib/utils';

interface ColumnProps {
  column: ColumnType;
  leads: Lead[];
  settings: KanbanSettings;
  onRenameColumn: (columnId: string, newName: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveCard: (leadIds: string[], targetColumnId: string) => void;
  onSelectLead: (leadId: string, selected: boolean) => void;
  selectedLeads: Set<string>;
  onSelectAllInColumn: (columnId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ 
  column, 
  leads, 
  settings,
  onRenameColumn,
  onDeleteColumn,
  onMoveCard,
  onSelectLead,
  selectedLeads,
  onSelectAllInColumn
}) => {
  const {
    isDragOver,
    draggedLeadId,
    handleDragOver,
    handleDragLeave,
    handleDragEnd,
    handleDragStart
  } = useColumn();
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleDragLeave();
    
    const data = e.dataTransfer.getData('text/plain');
    
    try {
      // Determine if this is a single lead or multiple leads
      if (data.startsWith('[')) {
        // Multiple leads being moved
        const leadIds = JSON.parse(data) as string[];
        onMoveCard(leadIds, column.id);
      } else {
        // Single lead being moved
        const leadId = data;
        // If the dragged card is part of a selection, move all selected cards
        if (selectedLeads.has(leadId) && selectedLeads.size > 1) {
          onMoveCard(Array.from(selectedLeads), column.id);
        } else {
          // Otherwise just move the single dragged card
          onMoveCard([leadId], column.id);
        }
      }
    } catch (err) {
      console.error('Error parsing drop data:', err);
    }
  };
  
  const handleRename = (newName: string) => {
    onRenameColumn(column.id, newName);
  };
  
  const handleDelete = () => {
    onDeleteColumn(column.id);
  };
  
  const handleSelectAll = () => {
    onSelectAllInColumn(column.id);
  };
  
  const handleLeadDragStart = (e: React.DragEvent, leadId: string) => {
    handleDragStart(e, leadId, selectedLeads, onSelectLead);
  };
  
  return (
    <ColumnDragLayer
      isDragOver={isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ColumnHeader 
        name={column.name} 
        count={leads.length}
        onRename={handleRename}
        onDelete={handleDelete}
        onSelectAll={handleSelectAll}
      />
      
      <ColumnContent
        leads={leads}
        settings={settings}
        onSelectLead={onSelectLead}
        selectedLeads={selectedLeads}
        draggedLeadId={draggedLeadId}
        onDragStart={handleLeadDragStart}
        onDragEnd={handleDragEnd}
      />
    </ColumnDragLayer>
  );
};

export default Column;
