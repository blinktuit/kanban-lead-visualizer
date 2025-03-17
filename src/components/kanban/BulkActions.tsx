
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
import { Column, Pipeline } from '@/types';
import PipelineSelector from './PipelineSelector';

interface BulkActionsProps {
  selectedCount: number;
  columns: Column[];
  pipelines?: Pipeline[];
  onMoveLeads: (leadIds: string[], targetColumnId: string) => void;
  selectedLeads: Set<string>;
  onClearSelection: () => void;
  onAddToPipelines?: (leadIds: string[], pipelineIds: string[]) => void;
  onCreateNewPipeline?: (name: string) => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  columns,
  pipelines = [],
  onMoveLeads,
  selectedLeads,
  onClearSelection,
  onAddToPipelines,
  onCreateNewPipeline,
}) => {
  const [isMoveBulkOpen, setIsMoveBulkOpen] = useState(false);
  const [isPipelineSelectorOpen, setIsPipelineSelectorOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState('');
  const [selectedPipelines, setSelectedPipelines] = useState<string[]>([]);
  
  const handleBulkMove = () => {
    if (!targetColumnId) return;
    
    // Move all selected leads
    onMoveLeads(Array.from(selectedLeads), targetColumnId);
    
    // Reset selections and UI state
    setIsMoveBulkOpen(false);
    setTargetColumnId('');
  };

  const handlePipelineChange = (pipelineIds: string[]) => {
    setSelectedPipelines(pipelineIds);
  };

  const handleAddToPipelines = () => {
    if (selectedPipelines.length > 0 && onAddToPipelines) {
      onAddToPipelines(Array.from(selectedLeads), selectedPipelines);
      setSelectedPipelines([]);
      setIsPipelineSelectorOpen(false);
    }
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
        
        <Button size="sm" variant="outline">
          Label toevoegen
        </Button>
        
        <Popover open={isPipelineSelectorOpen} onOpenChange={setIsPipelineSelectorOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline">
              Toevoegen aan pipeline
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="end">
            <div className="w-full">
              <PipelineSelector
                pipelines={pipelines}
                selectedPipelines={selectedPipelines}
                onPipelineChange={handlePipelineChange}
                onCreateNewPipeline={onCreateNewPipeline}
                onClose={() => setIsPipelineSelectorOpen(false)}
              />
              
              {selectedPipelines.length > 0 && (
                <div className="p-3 pt-0 flex justify-end">
                  <Button size="sm" onClick={handleAddToPipelines}>
                    Toevoegen aan {selectedPipelines.length} pipeline{selectedPipelines.length > 1 ? 's' : ''}
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
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
