
import React, { useState, useRef } from 'react';
import { MoreHorizontal, Plus, Pencil, Trash2, Download, Tag, CheckSquare, Grip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ColumnHeaderProps {
  name: string;
  count: number;
  onRename: (newName: string) => void;
  onDelete: () => void;
  onSelectAll: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  allSelected: boolean;
  columns: { id: string; name: string }[];
  pipelineId: string;
  onDeleteWithOptions: (option: 'delete' | 'move' | 'add', targetColumnId?: string, targetPipelineId?: string) => void;
  onAddLabel: () => void;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ 
  name, 
  count, 
  onRename, 
  onDelete,
  onSelectAll,
  onDragStart,
  onDragEnd,
  allSelected,
  columns,
  pipelineId,
  onDeleteWithOptions,
  onAddLabel
}) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(name);
  const [deleteOption, setDeleteOption] = useState<'delete' | 'move' | 'add'>('delete');
  const [targetColumnId, setTargetColumnId] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const handleRef = useRef<HTMLDivElement>(null);
  
  const handleRename = () => {
    onRename(newName);
    setIsRenameOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    if (deleteOption === 'move' && !targetColumnId) {
      return; // Don't proceed if no column selected
    }
    
    onDeleteWithOptions(deleteOption, targetColumnId);
    setIsDeleteOpen(false);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart && handleRef.current && handleRef.current.contains(e.target as Node)) {
      setIsDragging(true);
      onDragStart(e);
    }
  };

  const handleDragEnd = () => {
    if (onDragEnd) {
      setIsDragging(false);
      onDragEnd();
    }
  };
  
  return (
    <div 
      className={cn("kanban-column-header", isDragging && "opacity-50")}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center">
        <div className="flex items-center cursor-move mr-2" ref={handleRef}>
          <Grip className="h-4 w-4 text-muted-foreground" />
        </div>
        <h3 className="kanban-title">{name}</h3>
        <span className="kanban-count">{count}</span>
        <div className="ml-1">
          <Checkbox 
            className="h-3.5 w-3.5 data-[state=checked]:bg-primary/70 data-[state=checked]:text-primary-foreground border-muted-foreground/50"
            checked={allSelected && count > 0}
            onCheckedChange={onSelectAll}
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button 
          className="text-muted-foreground hover:text-foreground p-0.5 rounded text-xs"
          onClick={onAddLabel}
        >
          + Label
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground p-0.5 rounded">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuItem 
              className="kanban-menu-item"
              onClick={() => setIsRenameOpen(true)}
            >
              <Pencil className="h-4 w-4" />
              <span>Rename column</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="kanban-menu-item" 
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete column</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="kanban-menu-item">
              <Download className="h-4 w-4" />
              <span>Export to CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="kanban-menu-item">
              <Plus className="h-4 w-4" />
              <span>Add leads</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="kanban-menu-item">
              <Tag className="h-4 w-4" />
              <span>Apply tag to all</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="kanban-menu-item"
              onClick={onSelectAll}
            >
              <CheckSquare className="h-4 w-4" />
              <span>Select all leads</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename column</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Column name"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>Cancel</Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete column</AlertDialogTitle>
            <AlertDialogDescription>
              What would you like to do with the leads in this column?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="delete-leads" 
                name="delete-option" 
                value="delete"
                checked={deleteOption === 'delete'}
                onChange={() => setDeleteOption('delete')}
              />
              <label htmlFor="delete-leads">Remove leads from this pipeline</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="move-leads" 
                name="delete-option" 
                value="move"
                checked={deleteOption === 'move'}
                onChange={() => setDeleteOption('move')}
              />
              <label htmlFor="move-leads">Move leads to another column</label>
            </div>
            
            {deleteOption === 'move' && (
              <div className="pl-6 pt-2">
                <Select 
                  value={targetColumnId} 
                  onValueChange={setTargetColumnId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns
                      .filter(col => col.name !== name)
                      .map(col => (
                        <SelectItem key={col.id} value={col.id}>
                          {col.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <input 
                type="radio" 
                id="add-other-pipeline" 
                name="delete-option" 
                value="add"
                checked={deleteOption === 'add'}
                onChange={() => setDeleteOption('add')}
              />
              <label htmlFor="add-other-pipeline">Add leads to another pipeline</label>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={deleteOption === 'move' && !targetColumnId}
            >
              Delete Column
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ColumnHeader;
