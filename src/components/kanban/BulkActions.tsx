
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Column } from '@/types';

interface BulkActionsProps {
  selectedCount: number;
  columns: Column[];
  onMoveLeads: (leadIds: string[], targetColumnId: string) => void;
  selectedLeads: Set<string>;
  onClearSelection: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  columns,
  onMoveLeads,
  selectedLeads,
  onClearSelection,
}) => {
  const [isMoveBulkOpen, setIsMoveBulkOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState('');
  
  const handleBulkMove = () => {
    if (!targetColumnId) return;
    
    // Move all selected leads
    onMoveLeads(Array.from(selectedLeads), targetColumnId);
    
    // Reset selections and UI state
    setIsMoveBulkOpen(false);
    setTargetColumnId('');
  };
  
  return (
    <div className="bg-primary/5 px-6 py-2 border-b border-border/40 flex items-center justify-between animate-slide-down">
      <div className="text-sm">
        <span className="font-medium">{selectedCount}</span> leads geselecteerd
      </div>
      
      <div className="flex items-center gap-2">
        <Popover open={isMoveBulkOpen} onOpenChange={setIsMoveBulkOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline">
              Verplaatsen naar kolom
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">
                Verplaats {selectedCount} leads naar:
              </h3>
              <Select onValueChange={setTargetColumnId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer kolom" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsMoveBulkOpen(false)}>Annuleren</Button>
                <Button size="sm" onClick={handleBulkMove}>Verplaatsen</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button size="sm" variant="outline">Tag toevoegen</Button>
        <Button size="sm" variant="outline">Toevoegen aan pipeline</Button>
        <Button size="sm" variant="outline">Exporteren</Button>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={onClearSelection}
        >
          Annuleren
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
