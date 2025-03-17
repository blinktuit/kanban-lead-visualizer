
import React from 'react';
import { cn } from '@/lib/utils';

interface ColumnDragLayerProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  children: React.ReactNode;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  columnId: string;
}

const ColumnDragLayer: React.FC<ColumnDragLayerProps> = ({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
  draggable = false,
  onDragStart,
  onDragEnd,
  columnId
}) => {
  return (
    <div 
      className={cn(
        "kanban-column", 
        isDragOver && "border-primary/50 bg-kanban-columnHover"
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-column-id={columnId}
    >
      {children}
    </div>
  );
};

export default ColumnDragLayer;
