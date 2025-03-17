
import React from 'react';
import Column from './Column';
import PipelineTitle from './PipelineTitle';
import SearchLeads from './SearchLeads';
import DisplaySettings from './DisplaySettings';
import ShareExport from './ShareExport';
import AddColumn from './AddColumn';
import BulkActions from './BulkActions';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';

interface KanbanBoardProps {
  pipelineId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ pipelineId }) => {
  const {
    pipeline,
    leads,
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
  } = useKanbanBoard(pipelineId);
  
  if (!pipeline || !settings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary">Laden...</div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <div className="flex items-center">
          <PipelineTitle 
            title={pipeline.name}
            isEditing={isEditingTitle}
            editedTitle={editedTitle}
            setEditedTitle={setEditedTitle}
            setIsEditing={setIsEditingTitle}
            onUpdateTitle={handleUpdateTitle}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <SearchLeads 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          <DisplaySettings 
            settings={settings}
            setSettings={(newSettings) => {
              // This would normally save to backend/localStorage
              // For now we'll just update the state
              if (newSettings) {
                settings.cardFields = newSettings.cardFields;
              }
            }}
          />
          
          <ShareExport pipelineId={pipelineId} />
          
          <AddColumn onAddColumn={handleAddColumn} />
        </div>
      </div>
      
      {/* Bulk actions toolbar */}
      {isBulkMode && (
        <BulkActions 
          selectedCount={selectedLeads.size}
          columns={pipeline.columns}
          onMoveLeads={handleMoveCards}
          selectedLeads={selectedLeads}
          onClearSelection={handleClearSelection}
        />
      )}
      
      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex space-x-4 h-full min-h-[500px]">
          {pipeline.columns
            .sort((a, b) => a.order - b.order)
            .map(column => (
              <Column
                key={column.id}
                column={column}
                leads={getColumnLeads(column.id)}
                settings={settings}
                onRenameColumn={handleRenameColumn}
                onDeleteColumn={handleDeleteColumn}
                onMoveCard={handleMoveCards}
                onSelectLead={handleSelectLead}
                selectedLeads={selectedLeads}
                onSelectAllInColumn={handleSelectAllInColumn}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
