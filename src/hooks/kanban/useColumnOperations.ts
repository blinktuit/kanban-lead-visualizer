import { Pipeline, Lead } from '@/types';
import { savePipelines, saveLeads } from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for managing column operations
 */
export function useColumnOperations(
  pipeline: Pipeline | undefined,
  setPipeline: (pipeline: Pipeline) => void,
  leads: Lead[],
  setLeads: (leads: Lead[]) => void
) {
  const { toast } = useToast();

  const handleRenameColumn = (columnId: string, newName: string) => {
    if (!pipeline) return;
    
    const updatedPipeline = {
      ...pipeline,
      columns: pipeline.columns.map(col => 
        col.id === columnId ? { ...col, name: newName } : col
      )
    };
    
    setPipeline(updatedPipeline);
    
    // Save to local storage
    savePipelines([updatedPipeline]);
    
    toast({
      title: "Kolom hernoemd",
      description: `Kolom hernoemd naar "${newName}"`,
    });
  };

  const handleMoveColumn = (columnId: string, newOrder: number) => {
    if (!pipeline) return;

    // Find the column being moved
    const columnToMove = pipeline.columns.find(col => col.id === columnId);
    if (!columnToMove) return;

    const oldOrder = columnToMove.order;

    // Create an updated columns array with the new order
    const updatedColumns = pipeline.columns.map(col => {
      // The column being moved gets the new order
      if (col.id === columnId) {
        return { ...col, order: newOrder };
      } 
      // Columns between old and new positions need to be shifted
      else if (oldOrder < newOrder && col.order > oldOrder && col.order <= newOrder) {
        return { ...col, order: col.order - 1 };
      }
      else if (oldOrder > newOrder && col.order < oldOrder && col.order >= newOrder) {
        return { ...col, order: col.order + 1 };
      }
      // Other columns stay the same
      return col;
    });

    const updatedPipeline = {
      ...pipeline,
      columns: updatedColumns
    };

    setPipeline(updatedPipeline);

    // Save to local storage
    savePipelines([updatedPipeline]);

    toast({
      title: "Kolommen herschikt",
      description: "De volgorde van de kolommen is bijgewerkt",
    });
  };
  
  const handleDeleteColumnWithOptions = (
    pipelineId: string,
    columnId: string, 
    option: 'delete' | 'move' | 'add', 
    targetColumnId?: string, 
    targetPipelineId?: string
  ) => {
    if (!pipeline) return;
    
    // Get the leads in this column
    const columnLeads = leads.filter(lead => lead.pipelinePositions[pipelineId] === columnId);
    
    // Create a deep copy of the leads to update
    let updatedLeads = [...leads];
    
    // Process the leads based on the selected option
    if (option === 'delete') {
      // Remove the leads from this pipeline
      updatedLeads = leads.map(lead => {
        if (lead.pipelinePositions[pipelineId] === columnId) {
          const newPositions = { ...lead.pipelinePositions };
          delete newPositions[pipelineId];
          return { ...lead, pipelinePositions: newPositions };
        }
        return lead;
      });
      
      toast({
        title: "Leads verwijderd uit pipeline",
        description: `${columnLeads.length} leads zijn verwijderd uit deze pipeline`,
      });
    } 
    else if (option === 'move' && targetColumnId) {
      // Move the leads to another column
      updatedLeads = leads.map(lead => {
        if (lead.pipelinePositions[pipelineId] === columnId) {
          return {
            ...lead,
            pipelinePositions: {
              ...lead.pipelinePositions,
              [pipelineId]: targetColumnId
            }
          };
        }
        return lead;
      });
      
      const targetColName = pipeline.columns.find(col => col.id === targetColumnId)?.name;
      toast({
        title: "Leads verplaatst",
        description: `${columnLeads.length} leads zijn verplaatst naar ${targetColName}`,
      });
    } 
    else if (option === 'add') {
      // TODO: Implement adding to another pipeline
      toast({
        title: "Feature in ontwikkeling",
        description: "Deze functie wordt binnenkort toegevoegd",
      });
    }
    
    // Remove the column from the pipeline
    const updatedPipeline = {
      ...pipeline,
      columns: pipeline.columns.filter(col => col.id !== columnId)
    };
    
    // Reorder the remaining columns
    updatedPipeline.columns = updatedPipeline.columns.map((col, index) => ({
      ...col,
      order: index
    }));
    
    // Update state
    setPipeline(updatedPipeline);
    setLeads(updatedLeads);
    
    // Save to local storage
    savePipelines([updatedPipeline]);
    saveLeads(updatedLeads);
    
    toast({
      title: "Kolom verwijderd",
      description: "De kolom is verwijderd",
    });
  };
  
  const handleDeleteColumn = (pipelineId: string, columnId: string) => {
    // Default behavior - use the legacy method
    if (!pipeline) return;
    
    // Get the columns ordered by their 'order' property
    const orderedColumns = [...pipeline.columns].sort((a, b) => a.order - b.order);
    
    // Find the index of the column to delete
    const deleteIndex = orderedColumns.findIndex(col => col.id === columnId);
    
    // Determine the target column for leads (preferably the column to the left)
    const targetIndex = Math.max(0, deleteIndex - 1);
    const targetColumnId = orderedColumns[targetIndex].id;
    
    // Update leads to move them to the target column
    const updatedLeads = leads.map(lead => {
      if (lead.pipelinePositions[pipelineId] === columnId) {
        return {
          ...lead,
          pipelinePositions: {
            ...lead.pipelinePositions,
            [pipelineId]: targetColumnId
          }
        };
      }
      return lead;
    });
    
    // Remove the column from the pipeline
    const updatedPipeline = {
      ...pipeline,
      columns: pipeline.columns.filter(col => col.id !== columnId)
    };
    
    // Reorder the remaining columns
    updatedPipeline.columns = updatedPipeline.columns.map((col, index) => ({
      ...col,
      order: index
    }));
    
    // Update state
    setPipeline(updatedPipeline);
    setLeads(updatedLeads);
    
    // Save to local storage
    savePipelines([updatedPipeline]);
    saveLeads(updatedLeads);
    
    toast({
      title: "Kolom verwijderd",
      description: "Kolom verwijderd. Leads zijn verplaatst naar de vorige kolom.",
    });
  };
  
  const handleAddColumn = (newColumnName: string) => {
    if (!pipeline || !newColumnName.trim()) return false;
    
    const newColumnId = `col${Date.now()}`;
    const newOrder = pipeline.columns.length;
    
    const updatedPipeline = {
      ...pipeline,
      columns: [
        ...pipeline.columns,
        { id: newColumnId, name: newColumnName, order: newOrder }
      ]
    };
    
    setPipeline(updatedPipeline);
    
    // Save to local storage
    savePipelines([updatedPipeline]);
    
    toast({
      title: "Kolom toegevoegd",
      description: `Nieuwe kolom "${newColumnName}" toegevoegd`,
    });
    
    return true;
  };

  const handleAddLabelToColumn = (columnId: string) => {
    if (!pipeline) return;

    // Show toast for now since this is just UI for demonstration
    toast({
      title: "Label toevoegen",
      description: "Deze functie wordt binnenkort toegevoegd",
    });
  };
  
  return {
    handleRenameColumn,
    handleDeleteColumn,
    handleMoveColumn,
    handleDeleteColumnWithOptions,
    handleAddColumn,
    handleAddLabelToColumn
  };
}
