import { useState, useEffect, useCallback } from 'react';
import { Lead, Pipeline, KanbanSettings, Tag } from '@/types';
import { 
  initializeStorage, 
  getPipeline, 
  getLeads, 
  getSettings,
  savePipelines,
  saveLeads,
  getPipelines,
} from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';

export function useKanbanBoard(pipelineId: string) {
  const { toast } = useToast();
  const [pipeline, setPipeline] = useState<Pipeline | undefined>(undefined);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<KanbanSettings | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [filteredTag, setFilteredTag] = useState<string | null>(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  
  // Initialize local storage and load data
  useEffect(() => {
    initializeStorage();
    
    const loadedPipeline = getPipeline(pipelineId);
    if (loadedPipeline) {
      setPipeline(loadedPipeline);
      setEditedTitle(loadedPipeline.name);
    }
    
    const loadedLeads = getLeads();
    setLeads(loadedLeads);
    
    const loadedSettings = getSettings();
    setSettings(loadedSettings);

    const loadedPipelines = getPipelines();
    setPipelines(loadedPipelines);
  }, [pipelineId]);
  
  // Update bulk mode status when selected leads change
  useEffect(() => {
    setIsBulkMode(selectedLeads.size > 0);
  }, [selectedLeads]);
  
  const filteredLeads = leads.filter(lead => {
    // First filter by pipeline position
    if (!lead.pipelinePositions[pipelineId]) return false;
    
    // Then filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower) ||
        lead.jobTitle.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    // Then filter by tag if a tag filter is set
    if (filteredTag) {
      const hasTag = lead.tags.some(tag => tag.id === filteredTag);
      if (!hasTag) return false;
    }
    
    // Lead passed all filters
    return true;
  });
  
  const getColumnLeads = (columnId: string) => {
    return filteredLeads.filter(lead => {
      return lead.pipelinePositions[pipelineId] === columnId;
    });
  };
  
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
      // This would require selecting a target pipeline and column
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
  
  const handleDeleteColumn = (columnId: string) => {
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
  
  const handleMoveCards = (leadIds: string[], targetColumnId: string) => {
    // Update local state
    const updatedLeads = leads.map(lead => {
      if (leadIds.includes(lead.id)) {
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
    
    setLeads(updatedLeads);
    
    // Save to local storage
    saveLeads(updatedLeads);
    
    toast({
      title: leadIds.length > 1 ? "Leads verplaatst" : "Lead verplaatst",
      description: leadIds.length > 1 
        ? `${leadIds.length} leads zijn verplaatst` 
        : "Lead is verplaatst naar nieuwe kolom",
    });
  };
  
  const handleAddColumn = (newColumnName: string) => {
    if (!pipeline || !newColumnName.trim()) return;
    
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
  
  const handleSelectLead = (leadId: string, selected: boolean) => {
    const newSelected = new Set(selectedLeads);
    if (selected) {
      newSelected.add(leadId);
    } else {
      newSelected.delete(leadId);
    }
    setSelectedLeads(newSelected);
  };
  
  const handleSelectAllInColumn = (columnId: string) => {
    const columnLeads = getColumnLeads(columnId);
    
    // If all are already selected, deselect all
    const allAlreadySelected = columnLeads.every(lead => selectedLeads.has(lead.id));
    
    const newSelected = new Set(selectedLeads);
    
    if (allAlreadySelected) {
      // Deselect all in this column
      columnLeads.forEach(lead => {
        newSelected.delete(lead.id);
      });
    } else {
      // Select all in this column
      columnLeads.forEach(lead => {
        newSelected.add(lead.id);
      });
    }
    
    setSelectedLeads(newSelected);
  };
  
  const handleClearSelection = () => {
    setSelectedLeads(new Set());
  };
  
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

  const handleAddLead = (lead: Partial<Lead>) => {
    if (!pipeline || !pipeline.columns.length) return;
    
    // Set defaults for a new lead
    const firstColumnId = pipeline.columns.find(col => col.order === 0)?.id;
    if (!firstColumnId) return;
    
    const newLead: Lead = {
      id: `lead${Date.now()}`,
      name: lead.name || 'Nieuwe Lead',
      photoUrl: lead.photoUrl || '',
      jobTitle: lead.jobTitle || '',
      company: lead.company || '',
      tags: lead.tags || [],
      connectionStatus: lead.connectionStatus || 'none',
      pipelinePositions: {
        [pipelineId]: firstColumnId
      }
    };
    
    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    
    // Save to local storage
    saveLeads(updatedLeads);
    
    toast({
      title: "Lead toegevoegd",
      description: `"${newLead.name}" toegevoegd aan pipeline`,
    });
    
    setIsAddLeadOpen(false);
  };

  const handleFilterByTag = (tagId: string | null) => {
    setFilteredTag(tagId);
    
    if (tagId) {
      const tagName = leads
        .flatMap(lead => lead.tags)
        .find(tag => tag.id === tagId)?.name || tagId;
      
      toast({
        title: "Filter toegepast",
        description: `Gefilterd op tag: ${tagName}`,
      });
    } else {
      toast({
        title: "Filter verwijderd",
        description: "Alle leads worden weergegeven",
      });
    }
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
    pipeline,
    pipelines,
    leads: filteredLeads,
    settings,
    searchTerm,
    setSearchTerm,
    selectedLeads,
    isBulkMode,
    isEditingTitle,
    setIsEditingTitle,
    editedTitle,
    setEditedTitle,
    filteredTag,
    isAddLeadOpen,
    setIsAddLeadOpen,
    getColumnLeads,
    handleRenameColumn,
    handleDeleteColumn,
    handleMoveCards,
    handleAddColumn,
    handleSelectLead,
    handleSelectAllInColumn,
    handleClearSelection,
    handleUpdateTitle,
    handleMoveColumn,
    handleDeleteColumnWithOptions,
    handleAddLead,
    handleFilterByTag,
    handleAddLabelToColumn
  };
}
