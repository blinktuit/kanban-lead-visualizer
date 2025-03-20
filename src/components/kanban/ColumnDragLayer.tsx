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
  const [dropPosition, setDropPosition] = useState<'left' | 'right' | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Check if the dragged item is a column (not a lead)
  const handleDragOver = (e: React.DragEvent) => {
    // Check if a column is being dragged (check dataTransfer)
    const isColumn = e.dataTransfer.types.includes('column-id');
    setIsColumnDrop(isColumn);
    
    // Als het een kolom is, bepaal dan aan welke kant de drop indicator moet komen
    if (isColumn && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const mouseX = e.clientX;
      const columnCenterX = rect.left + rect.width / 2;
      
      // Stel in of de drop indicator links of rechts moet komen
      setDropPosition(mouseX < columnCenterX ? 'left' : 'right');
    } else {
      setDropPosition(null);
    }
    
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
      setDropPosition(null);
      onDragEnd();
    }
  };

  // Reset dropper position on drag leave
  const handleDragLeave = () => {
    setDropPosition(null);
    onDragLeave();
  };

  return (
    <div 
      ref={ref}
      className={cn(
        "kanban-column relative", 
        isDragOver && "border-primary/70",
        isDragOver && !isColumnDrop ? "bg-kanban-column-hover" : "",
        isDragOver && isColumnDrop && dropPosition === 'left' && "kanban-drag-over-left",
        isDragOver && isColumnDrop && dropPosition === 'right' && "kanban-drag-over-right",
        isDragging && "opacity-50 border-primary/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
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
