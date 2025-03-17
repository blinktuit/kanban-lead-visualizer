
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
  onMoveCard: (leadId: string, targetColumnId: string) => void;
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
    
    const leadId = e.dataTransfer.getData('text/plain');
    onMoveCard(leadId, column.id);
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
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', lead.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
          >
            <LeadCard 
              lead={lead} 
              settings={settings}
              onSelect={(id) => onSelectLead(id, !selectedLeads.has(id))}
              selected={selectedLeads.has(lead.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Column;
