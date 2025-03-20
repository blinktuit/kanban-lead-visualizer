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
import { Plus, Filter, X, MoreVertical } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Lead, Tag } from '@/types';
import { cn } from '@/lib/utils';
import '@/styles/kanban.css';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

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
            onSearch={setSearchTerm}
            initialSearchTerm={searchTerm} 
          />

          {/* Tag Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center h-9 gap-2 rounded-full pr-4 transition-all",
                  "hover:bg-muted focus:bg-muted/80 border-transparent",
                  filteredTag ? "bg-primary/10 text-primary hover:text-primary" : "bg-muted/50"
                )}
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm">
                  {filteredTag ? 
                    allTags.find(tag => tag.id === filteredTag)?.name?.substring(0, 15) || "Filter" 
                    : "Filter"
                  }
                </span>
                {filteredTag && (
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-xs ml-1">
                    1
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 rounded-lg overflow-hidden shadow-lg border-border/40" align="end">
              <div className="flex flex-col">
                <div className="p-3 border-b border-border/30 bg-muted/30">
                  <h3 className="text-sm font-medium flex items-center">
                    <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    Filter op tags
                  </h3>
                </div>
                
                <ScrollArea className="max-h-72">
                  <div className="p-2">
                    {allTags.length > 0 ? (
                      <div className="space-y-1">
                        {allTags.map(tag => (
                          <div 
                            key={tag.id} 
                            className={cn(
                              "flex items-center px-2 py-1.5 rounded-md cursor-pointer transition-colors",
                              filteredTag === tag.id ? "bg-primary/10" : "hover:bg-muted"
                            )}
                            onClick={() => handleFilterByTag(filteredTag === tag.id ? null : tag.id)}
                          >
                            <div 
                              className={cn(
                                "w-4 h-4 rounded mr-2 flex items-center justify-center border",
                                filteredTag === tag.id ? "bg-primary border-primary" : "border-muted-foreground/30"
                              )}
                            >
                              {filteredTag === tag.id && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                                      className="w-3 h-3 text-white">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            <div className="flex items-center flex-1">
                              <span 
                                className={cn(
                                  "w-2.5 h-2.5 rounded-full mr-2",
                                  `bg-${tag.color}-500`
                                )}
                              />
                              <span className={cn(
                                "text-sm",
                                filteredTag === tag.id && "font-medium"
                              )}>
                                {tag.name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground p-2">Geen tags gevonden</div>
                    )}
                  </div>
                </ScrollArea>
                
                {filteredTag && (
                  <div className="p-2 border-t border-border/30 bg-muted/10">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full flex items-center justify-center text-muted-foreground hover:text-foreground"
                      onClick={() => handleFilterByTag(null)}
                    >
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Filter wissen
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Dropdown voor extra opties */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center h-9 gap-2 rounded-full pr-4 transition-all",
                  "hover:bg-muted focus:bg-muted/80 border-transparent bg-muted/50"
                )}
              >
                <MoreVertical className="h-4 w-4" />
                <span className="text-sm">Meer</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-0 rounded-lg overflow-hidden shadow-lg border-border/40" align="end">
              <div className="py-1">
                <DropdownMenuItem 
                  onClick={() => document.getElementById('weergave-knop')?.click()}
                  className="flex items-center cursor-pointer py-2.5 px-3"
                >
                  <div id="weergave-menu-item" className="w-full">
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
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer py-2.5 px-3"
                >
                  <div className="w-full">
                    <ShareExport pipelineId={pipelineId} />
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add Lead Button */}
          <Button 
            size="sm" 
            onClick={() => setIsAddLeadOpen(true)} 
            className={cn(
              "flex items-center h-9 gap-2 rounded-full pr-4 transition-all",
              "bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary"
            )}
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">Lead toevoegen</span>
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
      <div className={cn("kanban-board-container p-4 overflow-auto", hasOverflow && "has-overflow")}>
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
          
          {/* Add Column button rechts van de laatste kolom */}
          <div className="flex items-start pt-[44px] h-full pl-4">
            <div className="flex flex-col items-center">
              <AddColumn onAddColumn={handleAddColumn} />
            </div>
          </div>
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
          top: `${Math.min(window.innerHeight - 300, Math.max(100, window.mouseY || 300))}px`,
          left: `${Math.min(window.innerWidth - 300, Math.max(100, window.mouseX || 300))}px`
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
          top: `${Math.min(window.innerHeight - 300, Math.max(100, window.mouseY || 300))}px`, 
          left: `${Math.min(window.innerWidth - 300, Math.max(100, window.mouseX || 300))}px`
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
