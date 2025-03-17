
import React, { useState, useRef, useEffect } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [isColumnDrop, setIsColumnDrop] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Check if the dragged item is a column (not a lead)
  const handleDragOver = (e: React.DragEvent) => {
    // Check if a column is being dragged (check dataTransfer)
    const isColumn = e.dataTransfer.types.includes('column-id');
    setIsColumnDrop(isColumn);
    
    // Call the original drag over handler
    onDragOver(e);
  };

  // Handle column drag start
  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      setIsDragging(true);
      // Create a ghost image that looks like the column
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const ghostEl = document.createElement('div');
        ghostEl.style.width = `${rect.width}px`;
        ghostEl.style.height = `${rect.height}px`;
        ghostEl.style.opacity = '0.4';
        ghostEl.style.pointerEvents = 'none';
        ghostEl.style.position = 'absolute';
        ghostEl.style.top = '-1000px';
        document.body.appendChild(ghostEl);
        e.dataTransfer.setDragImage(ghostEl, 20, 20);
        
        // Remove the ghost element after a delay
        setTimeout(() => {
          document.body.removeChild(ghostEl);
        }, 0);
      }
      onDragStart(e);
    }
  };

  // Handle column drag end
  const handleDragEnd = () => {
    if (onDragEnd) {
      setIsDragging(false);
      setIsColumnDrop(false);
      onDragEnd();
    }
  };

  return (
    <div 
      ref={ref}
      className={cn(
        "kanban-column", 
        isDragOver && "border-primary/70",
        isDragOver && isColumnDrop ? "column-drop-indicator" : "",
        isDragOver && !isColumnDrop ? "bg-kanban-column-hover" : "",
        isDragging && "opacity-50 border-primary/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-column-id={columnId}
    >
      {children}
    </div>
  );
};

export default ColumnDragLayer;
