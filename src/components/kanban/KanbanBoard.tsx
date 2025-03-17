import React, { useState, useEffect } from 'react';
import Column from './Column';
import PipelineTitle from './PipelineTitle';
import SearchLeads from './SearchLeads';
import DisplaySettings from './DisplaySettings';
import ShareExport from './ShareExport';
import AddColumn from './AddColumn';
import BulkActions from './BulkActions';
import LabelPopover from './LabelPopover';
import PipelineSelector from './PipelineSelector';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useLeadLabelOperations } from '@/hooks/kanban/useLeadLabelOperations';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Lead, Tag } from '@/types';
import { cn } from '@/lib/utils';
import '@/styles/kanban.css';

interface KanbanBoardProps {
  pipelineId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ pipelineId }) => {
  const [newLeadData, setNewLeadData] = useState<Partial<Lead>>({
    name: '',
    jobTitle: '',
    company: '',
    connectionStatus: 'none',
    tags: []
  });

  const {
    pipeline,
    pipelines,
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
  } = useKanbanBoard(pipelineId);
  
  const { scrollRef, hasOverflow } = useHorizontalScroll<HTMLDivElement>();
  
  const {
    isLabelPopoverOpen,
    setIsLabelPopoverOpen,
    activeLabelTarget,
    selectedLabelIds,
    getAllTags,
    openLabelPopover,
    closeLabelPopover,
    handleLabelChange
  } = useLeadLabelOperations(leads, (newLeads) => {
    // This would update all leads, but we're only updating the tags
  });
  
  const [isPipelineSelectorOpen, setIsPipelineSelectorOpen] = useState(false);
  const [activePipelineTarget, setActivePipelineTarget] = useState<string | null>(null);
  const [selectedPipelines, setSelectedPipelines] = useState<string[]>([]);
  
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.classList.toggle('has-overflow', hasOverflow);
    }
  }, [hasOverflow, scrollRef]);
  
  const handleAddLeadSubmit = () => {
    handleAddLead(newLeadData);
    setNewLeadData({
      name: '',
      jobTitle: '',
      company: '',
      connectionStatus: 'none',
      tags: []
    });
  };
  
  const handleAddLeadToColumn = (columnId: string) => {
    // Pre-select the column and open the add lead dialog
    const columnLeadData = {
      ...newLeadData,
      pipelinePositions: { [pipelineId]: columnId }
    };
    setNewLeadData(columnLeadData);
    setIsAddLeadOpen(true);
  };
  
  const handleAddLeadToLabel = (leadId: string) => {
    openLabelPopover(leadId, 'lead');
  };
  
  const handleAddLeadToPipeline = (leadId: string) => {
    setActivePipelineTarget(leadId);
    setSelectedPipelines([]);
    setIsPipelineSelectorOpen(true);
  };
  
  const handleAddToPipelines = (leadIds: string[], pipelineIds: string[]) => {
    // This would normally update backend/localStorage
    // For demo, just show a toast
    console.log(`Adding ${leadIds.length} leads to ${pipelineIds.length} pipelines`);
    setIsPipelineSelectorOpen(false);
    setActivePipelineTarget(null);
    setSelectedPipelines([]);
  };
  
  if (!pipeline || !settings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary">Laden...</div>
      </div>
    );
  }

  // Get all unique tags from all leads
  const allTags = getAllTags();
  
  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      {/* Top bar - fixed position to keep in view */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 sticky top-0 bg-background z-10">
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
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 whitespace-nowrap">
          <SearchLeads 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* Tag Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant={filteredTag ? "default" : "outline"} 
                size="sm"
                className={filteredTag ? "bg-primary/80 hover:bg-primary/90" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                {filteredTag ? "Filtering op tag" : "Filter"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Filter op tag</h3>
                
                <div className="space-y-2">
                  {allTags.length > 0 ? (
                    allTags.map(tag => (
                      <div key={tag.id} className="flex items-center">
                        <button
                          className={`flex items-center space-x-2 p-1 rounded w-full hover:bg-accent 
                                     ${filteredTag === tag.id ? 'bg-primary/10 text-primary font-medium' : ''}`}
                          onClick={() => handleFilterByTag(filteredTag === tag.id ? null : tag.id)}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full bg-${tag.color}-500`}></span>
                          <span>{tag.name}</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">Geen tags gevonden</div>
                  )}
                </div>
                
                {filteredTag && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleFilterByTag(null)}
                  >
                    Filter wissen
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
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

          {/* Add Lead Button */}
          <Button size="sm" onClick={() => setIsAddLeadOpen(true)} className="whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Lead toevoegen
          </Button>
        </div>
      </div>
      
      {/* Bulk actions toolbar */}
      {isBulkMode && (
        <BulkActions 
          selectedCount={selectedLeads.size}
          columns={pipeline.columns}
          pipelines={pipelines}
          onMoveLeads={handleMoveCards}
          selectedLeads={selectedLeads}
          onClearSelection={handleClearSelection}
          onAddToPipelines={handleAddToPipelines}
        />
      )}
      
      {/* Kanban board - using the horizontal scroll container */}
      <div className={cn("kanban-board-container p-6 overflow-auto", hasOverflow && "has-overflow")}>
        <div 
          className="kanban-flex-container"
          ref={scrollRef}
        >
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
                columns={pipeline.columns}
                pipelineId={pipelineId}
                onMoveColumn={handleMoveColumn}
                onDeleteWithOptions={handleDeleteColumnWithOptions}
                onAddLabelToColumn={(columnId) => openLabelPopover(`${pipelineId}:${columnId}`, 'column')}
                onAddLabelToLead={handleAddLeadToLabel}
                onAddLeadToPipeline={handleAddLeadToPipeline}
                onAddLead={handleAddLeadToColumn}
              />
            ))}
        </div>
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Lead toevoegen</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Naam</label>
              <Input
                id="name"
                value={newLeadData.name}
                onChange={(e) => setNewLeadData({...newLeadData, name: e.target.value})}
                placeholder="Naam van de lead"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">Bedrijf</label>
              <Input
                id="company"
                value={newLeadData.company}
                onChange={(e) => setNewLeadData({...newLeadData, company: e.target.value})}
                placeholder="Bedrijfsnaam"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="jobTitle" className="text-sm font-medium">Functie</label>
              <Input
                id="jobTitle"
                value={newLeadData.jobTitle}
                onChange={(e) => setNewLeadData({...newLeadData, jobTitle: e.target.value})}
                placeholder="Functietitel"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLeadOpen(false)}>Annuleren</Button>
            <Button onClick={handleAddLeadSubmit}>Lead toevoegen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Label Popover */}
      {isLabelPopoverOpen && activeLabelTarget && (
        <div className="fixed z-50" style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <LabelPopover
            availableTags={allTags}
            selectedTags={selectedLabelIds}
            onTagsChange={handleLabelChange}
            onClose={closeLabelPopover}
            canCreateNew
          />
        </div>
      )}
      
      {/* Pipeline Selector */}
      {isPipelineSelectorOpen && activePipelineTarget && (
        <div className="fixed z-50" style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <PipelineSelector
            pipelines={pipelines}
            selectedPipelines={selectedPipelines}
            onPipelineChange={setSelectedPipelines}
            onCreateNewPipeline={(name) => console.log('Create new pipeline:', name)}
            onClose={() => {
              setIsPipelineSelectorOpen(false);
              setActivePipelineTarget(null);
            }}
          />
          
          {selectedPipelines.length > 0 && (
            <div className="bg-background p-3 border-t mt-2 flex justify-end rounded-b-md border-x border-b shadow-md">
              <Button size="sm" onClick={() => {
                handleAddToPipelines([activePipelineTarget], selectedPipelines);
              }}>
                Toevoegen aan {selectedPipelines.length} pipeline{selectedPipelines.length > 1 ? 's' : ''}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
