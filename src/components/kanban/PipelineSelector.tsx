
import React, { useState } from 'react';
import { Pipeline } from '@/types';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PipelineSelectorProps {
  pipelines: Pipeline[];
  selectedPipelines: string[];
  onPipelineChange: (pipelineIds: string[]) => void;
  onCreateNewPipeline?: (name: string) => void;
  onClose: () => void;
}

const PipelineSelector: React.FC<PipelineSelectorProps> = ({
  pipelines,
  selectedPipelines,
  onPipelineChange,
  onCreateNewPipeline,
  onClose
}) => {
  const [showNewInput, setShowNewInput] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');

  const handleTogglePipeline = (pipelineId: string) => {
    if (selectedPipelines.includes(pipelineId)) {
      onPipelineChange(selectedPipelines.filter(id => id !== pipelineId));
    } else {
      onPipelineChange([...selectedPipelines, pipelineId]);
    }
  };

  const handleCreatePipeline = () => {
    if (newPipelineName.trim() && onCreateNewPipeline) {
      onCreateNewPipeline(newPipelineName);
      setNewPipelineName('');
      setShowNewInput(false);
    }
  };

  return (
    <div className="w-64 p-3 rounded-md bg-background border shadow-md" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Toevoegen aan pipeline</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[200px] pr-2">
        <div className="space-y-2">
          {pipelines.map(pipeline => (
            <div 
              key={pipeline.id} 
              className="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-muted"
            >
              <Checkbox 
                id={`pipeline-${pipeline.id}`}
                checked={selectedPipelines.includes(pipeline.id)}
                onCheckedChange={() => handleTogglePipeline(pipeline.id)}
              />
              <label 
                htmlFor={`pipeline-${pipeline.id}`}
                className="text-sm flex-1 cursor-pointer"
              >
                {pipeline.name}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>

      {onCreateNewPipeline && (
        <div className="mt-3 pt-2 border-t">
          {showNewInput ? (
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Pipeline naam..."
                value={newPipelineName}
                onChange={(e) => setNewPipelineName(e.target.value)}
                className="h-8 flex-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreatePipeline();
                  if (e.key === 'Escape') {
                    setNewPipelineName('');
                    setShowNewInput(false);
                  }
                }}
              />
              <Button size="sm" className="h-8" onClick={handleCreatePipeline}>
                Toevoegen
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 text-muted-foreground"
              onClick={() => setShowNewInput(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              <span className="text-sm">Nieuwe pipeline maken</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PipelineSelector;
