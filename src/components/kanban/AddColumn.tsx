
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

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
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddColumn();
            }}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Annuleren</Button>
            <Button size="sm" onClick={handleAddColumn}>Toevoegen</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddColumn;
