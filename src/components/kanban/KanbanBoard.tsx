
import React, { useState } from 'react';
import Column from './Column';
import PipelineTitle from './PipelineTitle';
import SearchLeads from './SearchLeads';
import DisplaySettings from './DisplaySettings';
import ShareExport from './ShareExport';
import AddColumn from './AddColumn';
import BulkActions from './BulkActions';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Lead, Tag } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  
  if (!pipeline || !settings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary">Laden...</div>
      </div>
    );
  }

  // Get all unique tags from all leads
  const allTags = Array.from(
    new Map(
      leads
        .flatMap(lead => lead.tags)
        .map(tag => [tag.id, tag])
    ).values()
  );
  
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
          <Button size="sm" onClick={() => setIsAddLeadOpen(true)}>
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
                columns={pipeline.columns}
                pipelineId={pipelineId}
                onMoveColumn={handleMoveColumn}
                onDeleteWithOptions={handleDeleteColumnWithOptions}
                onAddLabelToColumn={handleAddLabelToColumn}
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
            <Button variant="outline" onClick={() => setIsAddLeadOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLeadSubmit}>Lead toevoegen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanBoard;
