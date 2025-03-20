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
import { ArrowRight, Tag, X, ListPlus, FileDown } from 'lucide-react';

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
    <div className="fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-lg px-6 py-3 flex items-center justify-between animate-fade-in">
      <div className="flex-1 flex justify-start">
        <div className="text-sm font-medium bg-primary/10 px-3 py-1.5 rounded-full flex items-center">
          <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs mr-2">
            {selectedCount}
          </span>
          <span>geselecteerd</span>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center gap-2">
        <Button 
          size="sm" 
          variant="ghost"
          className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Tag className="h-4 w-4" />
          <span>Label</span>
        </Button>
        
        <div className="h-4 w-px bg-border mx-1"></div>
        
        <Popover open={isPipelineSelectorOpen} onOpenChange={setIsPipelineSelectorOpen}>
          <PopoverTrigger asChild>
            <Button 
              size="sm" 
              variant="ghost"
              className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <ListPlus className="h-4 w-4" />
              <span>Pipeline</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 rounded-xl shadow-lg border-border/60" align="end">
            <div className="w-full">
              <PipelineSelector
                pipelines={pipelines}
                selectedPipelines={selectedPipelines}
                onPipelineChange={handlePipelineChange}
                onCreateNewPipeline={onCreateNewPipeline}
                onClose={() => setIsPipelineSelectorOpen(false)}
              />
              
              {selectedPipelines.length > 0 && (
                <div className="p-3 pt-0 flex justify-end bg-secondary/10 rounded-b-xl">
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleAddToPipelines}
                  >
                    Toevoegen aan {selectedPipelines.length} pipeline{selectedPipelines.length > 1 ? 's' : ''}
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="h-4 w-px bg-border mx-1"></div>
        
        <Button 
          size="sm" 
          variant="ghost"
          className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <FileDown className="h-4 w-4" />
          <span>Exporteren</span>
        </Button>
      </div>
      
      <div className="flex-1 flex justify-end">
        <Button 
          size="sm" 
          variant="ghost"
          onClick={onClearSelection}
          className="rounded-full w-8 h-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;
