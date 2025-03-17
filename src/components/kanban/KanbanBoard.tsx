
import React, { useState, useEffect } from 'react';
import { Lead, Pipeline, KanbanSettings } from '@/types';
import { 
  initializeStorage, 
  getPipeline, 
  getLeads, 
  getSettings,
  savePipelines,
  saveLeads,
} from '@/utils/storage';
import Column from './Column';
import { Plus, Settings, Share, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface KanbanBoardProps {
  pipelineId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ pipelineId }) => {
  const { toast } = useToast();
  const [pipeline, setPipeline] = useState<Pipeline | undefined>(undefined);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<KanbanSettings | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  
  // Popovers state
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMoveBulkOpen, setIsMoveBulkOpen] = useState(false);
  
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
  
  if (!pipeline || !settings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary">Laden...</div>
      </div>
    );
  }
  
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
  
  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    
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
    setNewColumnName('');
    setIsAddColumnOpen(false);
    
    // Save to local storage
    savePipelines([updatedPipeline]);
    
    toast({
      title: "Kolom toegevoegd",
      description: `Nieuwe kolom "${newColumnName}" toegevoegd`,
    });
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
  
  const handleBulkMove = () => {
    if (!targetColumnId) return;
    
    // Move all selected leads
    handleMoveCards(Array.from(selectedLeads), targetColumnId);
    
    // Reset selections and UI state
    setSelectedLeads(new Set());
    setIsMoveBulkOpen(false);
    setTargetColumnId('');
  };
  
  const handleUpdateTitle = () => {
    if (!editedTitle.trim()) return;
    
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
  
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/shared/pipeline/${pipelineId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link gekopieerd",
        description: "Deelbare link is gekopieerd naar klembord",
      });
    });
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <div className="flex items-center">
          {isEditingTitle ? (
            <div className="flex items-center">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-64 mr-2"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
              />
              <Button size="sm" onClick={handleUpdateTitle}>Opslaan</Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setIsEditingTitle(false);
                  setEditedTitle(pipeline.name);
                }}
                className="ml-1"
              >
                Annuleren
              </Button>
            </div>
          ) : (
            <h1 
              className="text-xl font-medium hover:bg-muted/40 px-2 py-1 rounded cursor-pointer transition-colors duration-200"
              onClick={() => setIsEditingTitle(true)}
            >
              {pipeline.name}
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Leads zoeken..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchTerm('')}
              >
                ×
              </button>
            )}
          </div>
          
          <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Weergave
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Kaart velden</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showJobTitle"
                      checked={settings.cardFields.showJobTitle}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          cardFields: {
                            ...settings.cardFields,
                            showJobTitle: e.target.checked
                          }
                        });
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="showJobTitle" className="text-sm">Toon functietitel</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showCompany"
                      checked={settings.cardFields.showCompany}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          cardFields: {
                            ...settings.cardFields,
                            showCompany: e.target.checked
                          }
                        });
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="showCompany" className="text-sm">Toon bedrijf</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showConnectionStatus"
                      checked={settings.cardFields.showConnectionStatus}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          cardFields: {
                            ...settings.cardFields,
                            showConnectionStatus: e.target.checked
                          }
                        });
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="showConnectionStatus" className="text-sm">Toon connectiestatus</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showTags"
                      checked={settings.cardFields.showTags}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          cardFields: {
                            ...settings.cardFields,
                            showTags: e.target.checked
                          }
                        });
                      }}
                      className="mr-2"
                    />
                    <label htmlFor="showTags" className="text-sm">Toon tags</label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button size="sm" onClick={() => setIsSettingsOpen(false)}>Toepassen</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share className="h-4 w-4 mr-2" />
            Delen
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporteren
          </Button>
          
          <Popover open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
            <PopoverTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Kolom Toevoegen
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Nieuwe kolom toevoegen</h3>
                <Input
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Kolom naam"
                  className="w-full"
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsAddColumnOpen(false)}>Annuleren</Button>
                  <Button size="sm" onClick={handleAddColumn}>Toevoegen</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Bulk actions toolbar */}
      {isBulkMode && (
        <div className="bg-primary/5 px-6 py-2 border-b border-border/40 flex items-center justify-between animate-slide-down">
          <div className="text-sm">
            <span className="font-medium">{selectedLeads.size}</span> leads geselecteerd
          </div>
          
          <div className="flex items-center gap-2">
            <Popover open={isMoveBulkOpen} onOpenChange={setIsMoveBulkOpen}>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline">
                  Verplaatsen naar kolom
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">
                    Verplaats {selectedLeads.size} leads naar:
                  </h3>
                  <Select onValueChange={setTargetColumnId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer kolom" />
                    </SelectTrigger>
                    <SelectContent>
                      {pipeline.columns.map((column) => (
                        <SelectItem key={column.id} value={column.id}>
                          {column.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsMoveBulkOpen(false)}>Annuleren</Button>
                    <Button size="sm" onClick={handleBulkMove}>Verplaatsen</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button size="sm" variant="outline">Tag toevoegen</Button>
            <Button size="sm" variant="outline">Toevoegen aan pipeline</Button>
            <Button size="sm" variant="outline">Exporteren</Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleClearSelection}
            >
              Annuleren
            </Button>
          </div>
        </div>
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
