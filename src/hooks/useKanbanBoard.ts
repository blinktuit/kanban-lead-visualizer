
import { useState, useEffect } from 'react';
import { Lead, Pipeline, KanbanSettings } from '@/types';
import { 
  initializeStorage, 
  getPipeline, 
  getLeads, 
  getSettings,
  savePipelines,
  saveLeads,
} from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';

export function useKanbanBoard(pipelineId: string) {
  const { toast } = useToast();
  const [pipeline, setPipeline] = useState<Pipeline | undefined>(undefined);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<KanbanSettings | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  
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
  }, [pipelineId]);
  
  // Update bulk mode status when selected leads change
  useEffect(() => {
    setIsBulkMode(selectedLeads.size > 0);
  }, [selectedLeads]);
  
  const filteredLeads = leads.filter(lead => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(searchLower) ||
      lead.company.toLowerCase().includes(searchLower) ||
      lead.jobTitle.toLowerCase().includes(searchLower)
    );
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
  
  const handleDeleteColumn = (columnId: string) => {
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
  
  return {
    pipeline,
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
    getColumnLeads,
    handleRenameColumn,
    handleDeleteColumn,
    handleMoveCards,
    handleAddColumn,
    handleSelectLead,
    handleSelectAllInColumn,
    handleClearSelection,
    handleUpdateTitle
  };
}
