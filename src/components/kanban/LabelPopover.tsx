import React, { useState, useEffect } from 'react';
import { Tag } from '@/types';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LabelPopoverProps {
  availableTags: Tag[];
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  onClose: () => void;
  canCreateNew?: boolean;
}

const LabelPopover: React.FC<LabelPopoverProps> = ({
  availableTags,
  selectedTags,
  onTagsChange,
  onClose,
  canCreateNew = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  
  // Effect om te detecteren wanneer er buiten de popover wordt geklikt
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const popover = document.querySelector('.label-popover');
      if (popover && !popover.contains(target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter(id => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };
  
  const handleCreateTag = () => {
    // This would normally save to backend/localStorage
    // For now we just simulate and close the input
    if (newTagName.trim()) {
      setNewTagName('');
      setShowNewTagInput(false);
      // Actual tag creation would happen here
    }
  };
  
  const getTagClass = (color: Tag['color']) => {
    switch(color) {
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'amber': return 'bg-amber-100 text-amber-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="w-64 p-3 rounded-md bg-background border shadow-md label-popover" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Labels toevoegen</h3>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Input
        placeholder="Zoek labels..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2 h-8"
      />
      
      <ScrollArea className="h-[200px] pr-2">
        <div className="space-y-1.5">
          {filteredTags.map(tag => (
            <div 
              key={tag.id} 
              className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted ${
                selectedTags.includes(tag.id) ? 'bg-primary/10' : ''
              }`}
              onClick={() => handleToggleTag(tag.id)}
            >
              <div className={`w-2.5 h-2.5 rounded-full bg-${tag.color}-500 mr-2`}></div>
              <span className="text-sm">{tag.name}</span>
              {selectedTags.includes(tag.id) && (
                <div className="ml-auto w-4 h-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs text-primary">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {canCreateNew && (
        <div className="mt-2 pt-2 border-t">
          {showNewTagInput ? (
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Label naam..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="h-8 flex-1"
                autoFocus
              />
              <Button size="sm" className="h-8" onClick={handleCreateTag}>
                Toevoegen
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 text-muted-foreground"
              onClick={() => setShowNewTagInput(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              <span className="text-sm">Nieuwe label maken</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default LabelPopover;
