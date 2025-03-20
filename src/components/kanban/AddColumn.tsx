import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface AddColumnProps {
  onAddColumn: (name: string) => boolean | void;
}

const AddColumn: React.FC<AddColumnProps> = ({ onAddColumn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  
  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    
    const success = onAddColumn(newColumnName);
    
    if (success) {
      setNewColumnName('');
      setIsOpen(false);
    }
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center h-9 gap-2 rounded-full pr-4 transition-all",
            "hover:bg-muted focus:bg-muted/80 border-transparent bg-muted/50"
          )}
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm">Kolom Toevoegen</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-lg overflow-hidden shadow-lg border-border/40">
        <div className="flex flex-col">
          <div className="p-3 border-b border-border/30 bg-muted/30">
            <h3 className="text-sm font-medium flex items-center">
              <Plus className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              Nieuwe kolom toevoegen
            </h3>
          </div>
          
          <div className="p-3 space-y-3">
            <Input
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Kolom naam"
              className="w-full rounded-md"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddColumn();
              }}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Annuleren</Button>
              <Button size="sm" onClick={handleAddColumn}>Toevoegen</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddColumn;
