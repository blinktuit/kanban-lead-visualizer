
import React from 'react';

interface ColumnDragLayerProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  children: React.ReactNode;
}

const ColumnDragLayer: React.FC<ColumnDragLayerProps> = ({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  children
}) => {
  return (
    <div 
      className={`kanban-column ${isDragOver ? "border-primary/50 bg-kanban-columnHover" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
};

export default ColumnDragLayer;
