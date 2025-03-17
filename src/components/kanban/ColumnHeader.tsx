
import React, { useState } from 'react';
import { MoreHorizontal, Plus, Pencil, Trash2, Download, Tag, CheckSquare } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ColumnHeaderProps {
  name: string;
  count: number;
  onRename: (newName: string) => void;
  onDelete: () => void;
  onSelectAll: () => void;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ 
  name, 
  count, 
  onRename, 
  onDelete,
  onSelectAll
}) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(name);
  
  const handleRename = () => {
    onRename(newName);
    setIsRenameOpen(false);
  };
  
  const handleDeleteConfirm = () => {
    onDelete();
    setIsDeleteOpen(false);
  };
  
  return (
    <div className="kanban-column-header">
      <div className="flex items-center">
        <h3 className="kanban-title">{name}</h3>
        <span className="kanban-count">{count}</span>
      </div>
      
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
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete column</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this column? The leads will not be deleted.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ColumnHeader;
