
import { useState } from 'react';
import { Lead } from '@/types';
import { useKanbanData } from './kanban/useKanbanData';
import { useLeadFiltering } from './kanban/useLeadFiltering';
import { useLeadSelection } from './kanban/useLeadSelection';
import { useColumnOperations } from './kanban/useColumnOperations';
import { useLeadOperations } from './kanban/useLeadOperations';
import { usePipelineTitle } from './kanban/usePipelineTitle';

export function useKanbanBoard(pipelineId: string) {
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  
  // Load kanban data
  const {
    pipeline,
    setPipeline,
    pipelines,
    leads,
    setLeads,
    settings
  } = useKanbanData(pipelineId);
  
  // Lead filtering functionality
  const {
    searchTerm,
    setSearchTerm,
    filteredTag,
    filteredLeads,
    getColumnLeads,
    handleFilterByTag
  } = useLeadFiltering(leads, pipelineId);
  
  // Lead selection functionality
  const {
    selectedLeads,
    isBulkMode,
    handleSelectLead,
    handleClearSelection
  } = useLeadSelection();
  
  // Column operations
  const {
    handleRenameColumn,
    handleDeleteColumn,
    handleMoveColumn,
    handleDeleteColumnWithOptions,
    handleAddColumn,
    handleAddLabelToColumn
  } = useColumnOperations(pipeline, setPipeline, leads, setLeads);
  
  // Lead operations
  const {
    handleMoveCards,
    handleAddLead
  } = useLeadOperations(leads, setLeads);
  
  // Pipeline title operations
  const {
    isEditingTitle,
    setIsEditingTitle,
    editedTitle,
    setEditedTitle,
    handleUpdateTitle
  } = usePipelineTitle(pipeline, setPipeline);
  
  // Adapt the selection handler for columns to use getColumnLeads
  const handleSelectAllInColumn = (columnId: string) => {
    const columnLeads = getColumnLeads(columnId);
    
    // If all are already selected, deselect all
    const allAlreadySelected = columnLeads.every(lead => selectedLeads.has(lead.id));
    
    if (allAlreadySelected) {
      // Deselect all in this column
      columnLeads.forEach(lead => {
        handleSelectLead(lead.id, false);
      });
    } else {
      // Select all in this column
      columnLeads.forEach(lead => {
        handleSelectLead(lead.id, true);
      });
    }
  };
  
  // Wrapper methods to provide consistent API with original hook
  const moveCards = (leadIds: string[], targetColumnId: string) => {
    handleMoveCards(pipelineId, leadIds, targetColumnId);
  };
  
  const addLead = (leadData: Partial<Lead>) => {
    const success = handleAddLead(pipelineId, pipeline, leadData);
    if (success) {
      setIsAddLeadOpen(false);
    }
  };
  
  const deleteColumn = (columnId: string) => {
    handleDeleteColumn(pipelineId, columnId);
  };
  
  const deleteColumnWithOptions = (
    columnId: string, 
    option: 'delete' | 'move' | 'add', 
    targetColumnId?: string, 
    targetPipelineId?: string
  ) => {
    handleDeleteColumnWithOptions(pipelineId, columnId, option, targetColumnId, targetPipelineId);
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
    handleDeleteColumn: deleteColumn,
    handleMoveCards: moveCards,
    handleAddColumn,
    handleSelectLead,
    handleSelectAllInColumn,
    handleClearSelection,
    handleUpdateTitle,
    handleMoveColumn,
    handleDeleteColumnWithOptions: deleteColumnWithOptions,
    handleAddLead: addLead,
    handleFilterByTag,
    handleAddLabelToColumn
  };
}
