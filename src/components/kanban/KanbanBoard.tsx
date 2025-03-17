
import React, { useState, useEffect } from 'react';
import { Lead, Pipeline, KanbanSettings } from '@/types';
import { 
  initializeStorage, 
  getPipeline, 
  getLeads, 
  getLeadsForColumn, 
  getSettings,
  savePipelines,
  saveLeads,
  moveLeadToColumn
} from '@/utils/storage';
import Column from './Column';
import { Plus, Settings, Share, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isMoveBulkOpen, setIsMoveBulkOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState('');
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
  
  if (!pipeline || !settings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary">Loading...</div>
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
    const allPipelines = savePipelines([updatedPipeline]);
    
    toast({
      title: "Column renamed",
      description: `Column renamed to "${newName}"`,
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
      title: "Column deleted",
      description: "Column deleted successfully. Leads were moved to the previous column.",
    });
  };
  
  const handleMoveCard = (leadId: string, targetColumnId: string) => {
    // Update local state
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
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
    moveLeadToColumn(leadId, pipelineId, targetColumnId);
    
    toast({
      title: "Lead moved",
      description: "Lead moved to new column successfully.",
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
      title: "Column added",
      description: `New column "${newColumnName}" added successfully.`,
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
    
    // Update all selected leads
    const updatedLeads = leads.map(lead => {
      if (selectedLeads.has(lead.id)) {
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
    saveLeads(updatedLeads);
    setSelectedLeads(new Set());
    setIsMoveBulkOpen(false);
    setTargetColumnId('');
    
    toast({
      title: "Leads moved",
      description: `${selectedLeads.size} leads moved successfully.`,
    });
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
      title: "Pipeline renamed",
      description: `Pipeline renamed to "${editedTitle}"`,
    });
  };
  
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/shared/pipeline/${pipelineId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link copied",
        description: "Shareable link copied to clipboard.",
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
              <Button size="sm" onClick={handleUpdateTitle}>Save</Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  setIsEditingTitle(false);
                  setEditedTitle(pipeline.name);
                }}
                className="ml-1"
              >
                Cancel
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
              placeholder="Search leads..."
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
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            View
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={handleShare}
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button 
            size="sm"
            onClick={() => setIsAddColumnOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Column
          </Button>
        </div>
      </div>
      
      {/* Bulk actions toolbar */}
      {isBulkMode && (
        <div className="bg-primary/5 px-6 py-2 border-b border-border/40 flex items-center justify-between animate-slide-down">
          <div className="text-sm">
            <span className="font-medium">{selectedLeads.size}</span> leads selected
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsMoveBulkOpen(true)}
            >
              Move to column
            </Button>
            <Button size="sm" variant="outline">Add tag</Button>
            <Button size="sm" variant="outline">Add to pipeline</Button>
            <Button size="sm" variant="outline">Export</Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleClearSelection}
            >
              Cancel
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
                onMoveCard={handleMoveCard}
                onSelectLead={handleSelectLead}
                selectedLeads={selectedLeads}
                onSelectAllInColumn={handleSelectAllInColumn}
              />
            ))}
        </div>
      </div>
      
      {/* Add Column Dialog */}
      <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new column</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Column name"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddColumnOpen(false)}>Cancel</Button>
            <Button onClick={handleAddColumn}>Add Column</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>View settings</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Card fields</h3>
              <div className="space-y-1">
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
                  <label htmlFor="showJobTitle" className="text-sm">Show job title</label>
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
                  <label htmlFor="showCompany" className="text-sm">Show company</label>
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
                  <label htmlFor="showConnectionStatus" className="text-sm">Show connection status</label>
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
                  <label htmlFor="showTags" className="text-sm">Show tags</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
            <Button>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Move Bulk Dialog */}
      <Dialog open={isMoveBulkOpen} onOpenChange={setIsMoveBulkOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Move leads</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm mb-4">
              Move {selectedLeads.size} leads to:
            </p>
            <Select onValueChange={setTargetColumnId}>
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {pipeline.columns.map((column) => (
                  <SelectItem key={column.id} value={column.id}>
                    {column.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMoveBulkOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkMove}>Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanBoard;
