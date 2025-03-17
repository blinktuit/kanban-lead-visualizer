
import { useState } from 'react';
import { Pipeline } from '@/types';
import { savePipelines } from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for managing pipeline title operations
 */
export function usePipelineTitle(
  pipeline: Pipeline | undefined,
  setPipeline: (pipeline: Pipeline) => void
) {
  const { toast } = useToast();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(pipeline?.name || '');
  
  // Update the editedTitle when pipeline changes
  if (pipeline && pipeline.name !== editedTitle && !isEditingTitle) {
    setEditedTitle(pipeline.name);
  }
  
  const handleUpdateTitle = () => {
    if (!pipeline || !editedTitle.trim()) return;
    
    const updatedPipeline = {
      ...pipeline,
      name: editedTitle
    };
    
    setPipeline(updatedPipeline);
    setIsEditingTitle(false);
    
    // Save to local storage
    savePipelines([updatedPipeline]);
    
    toast({
      title: "Pipeline hernoemd",
      description: `Pipeline hernoemd naar "${editedTitle}"`,
    });
  };
  
  return {
    isEditingTitle,
    setIsEditingTitle,
    editedTitle,
    setEditedTitle,
    handleUpdateTitle
  };
}
