import React, { useState } from 'react';
import { Column as ColumnType, Lead, KanbanSettings } from '@/types';
import LeadCard from './LeadCard';
import ColumnHeader from './ColumnHeader';
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
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
  
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
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
  
  const handleDragEnd = () => {
    setDraggedLeadId(null);
  };
  
  return (
    <div 
      className={cn(
        "kanban-column",
        isDragOver && "border-primary/50 bg-kanban-columnHover"
      )}
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
      
      <div className="kanban-scrollable">
        {leads.map(lead => (
          <div
            key={lead.id}
            draggable
            onDragStart={(e) => handleDragStart(e, lead.id)}
            onDragEnd={handleDragEnd}
          >
            <LeadCard 
              lead={lead} 
              settings={settings}
              onSelect={(id) => onSelectLead(id, !selectedLeads.has(id))}
              selected={selectedLeads.has(lead.id)}
              isDragging={draggedLeadId === lead.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Column;
