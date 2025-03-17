
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

interface InlineColumnRenameProps {
  name: string;
  count: number;
  isEditing: boolean;
  onRename: (newName: string) => void;
  onEditingComplete: () => void;
}

const InlineColumnRename: React.FC<InlineColumnRenameProps> = ({
  name,
  count,
  isEditing,
  onRename,
  onEditingComplete
}) => {
  const [editedName, setEditedName] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onRename(editedName);
      onEditingComplete();
    } else if (e.key === 'Escape') {
      setEditedName(name);
      onEditingComplete();
    }
  };
  
  const handleBlur = () => {
    if (editedName.trim() !== name && editedName.trim() !== '') {
      onRename(editedName);
    } else {
      setEditedName(name);
    }
    onEditingComplete();
  };
  
  if (isEditing) {
    return (
      <div className="flex items-center">
        <Input
          ref={inputRef}
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="h-7 text-sm font-medium"
          autoFocus
        />
      </div>
    );
  }
  
  return (
    <>
      <h3 className="kanban-title">{name}</h3>
      <span className="kanban-count">{count}</span>
    </>
  );
};

export default InlineColumnRename;
