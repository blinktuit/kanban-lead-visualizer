
import React, { useMemo } from 'react';
import { Column as ColumnType, Lead, KanbanSettings } from '@/types';
import ColumnHeader from './ColumnHeader';
import ColumnDragLayer from './ColumnDragLayer';
import ColumnContent from './ColumnContent';
import ColumnFooter from './ColumnFooter';
import { useColumn } from '@/hooks/useColumn';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

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
  columns: ColumnType[];
  pipelineId: string;
  onMoveColumn: (columnId: string, newIndex: number) => void;
  onDeleteWithOptions: (columnId: string, option: 'delete' | 'move' | 'add', targetColumnId?: string, targetPipelineId?: string) => void;
  onAddLabelToColumn: (columnId: string) => void;
  onAddLabelToLead?: (leadId: string) => void;
  onAddLeadToPipeline?: (leadId: string) => void;
  onAddLead?: (columnId: string) => void;
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
  onSelectAllInColumn,
  columns,
  pipelineId,
  onMoveColumn,
  onDeleteWithOptions,
  onAddLabelToColumn,
  onAddLabelToLead,
  onAddLeadToPipeline,
  onAddLead
}) => {
  const { toast } = useToast();
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
    
    // Check if this is a column being dropped
    const columnId = e.dataTransfer.getData('column-id');
    if (columnId) {
      const dropColumnId = column.id;
      const dragColumnOrder = columns.find(c => c.id === columnId)?.order;
      const dropColumnOrder = column.order;
      
      if (dragColumnOrder !== undefined && dropColumnOrder !== dragColumnOrder) {
        onMoveColumn(columnId, dropColumnOrder);
        return;
      }
    }
    
    // Handle lead cards being dropped
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

  const handleColumnDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('column-id', column.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleColumnDragEnd = () => {
    // Optional: Add any cleanup needed after column drag
  };

  const handleDeleteWithOptions = (option: 'delete' | 'move' | 'add', targetColumnId?: string, targetPipelineId?: string) => {
    onDeleteWithOptions(column.id, option, targetColumnId, targetPipelineId);
  };

  const handleAddLabel = () => {
    onAddLabelToColumn(column.id);
  };
  
  // Check if all leads in this column are selected
  const allLeadsSelected = useMemo(() => {
    return leads.length > 0 && leads.every(lead => selectedLeads.has(lead.id));
  }, [leads, selectedLeads]);
  
  return (
    <ColumnDragLayer
      isDragOver={isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable={true}
      onDragStart={handleColumnDragStart}
      onDragEnd={handleColumnDragEnd}
      columnId={column.id}
    >
      <ColumnHeader 
        name={column.name} 
        count={leads.length}
        onRename={handleRename}
        onDelete={handleDelete}
        onSelectAll={handleSelectAll}
        allSelected={allLeadsSelected}
        columns={columns}
        pipelineId={pipelineId}
        onDeleteWithOptions={handleDeleteWithOptions}
        onAddLabel={handleAddLabel}
      />
      
      <ColumnContent
        leads={leads}
        settings={settings}
        onSelectLead={onSelectLead}
        selectedLeads={selectedLeads}
        draggedLeadId={draggedLeadId}
        onDragStart={handleLeadDragStart}
        onDragEnd={handleDragEnd}
        onAddLabel={onAddLabelToLead}
        onAddToPipeline={onAddLeadToPipeline}
      />
      
      <ColumnFooter 
        columnId={column.id}
        onAddLead={onAddLead || (() => {})}
      />
    </ColumnDragLayer>
  );
};

export default Column;
