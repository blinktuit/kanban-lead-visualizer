import React, { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface PipelineTitleProps {
  title: string;
  isEditing: boolean;
  editedTitle: string;
  setEditedTitle: (title: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  onUpdateTitle: () => void;
}

const PipelineTitle: React.FC<PipelineTitleProps> = ({
  title,
  isEditing,
  editedTitle,
  setEditedTitle,
  setIsEditing,
  onUpdateTitle
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onUpdateTitle();
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setIsEditing(false);
    }
  };
  
  const handleBlur = () => {
    if (editedTitle.trim() !== title && editedTitle.trim() !== '') {
      onUpdateTitle();
    } else {
      setEditedTitle(title);
    }
    setIsEditing(false);
  };
  
  if (isEditing) {
    return (
      <div className="flex items-center">
        <Input
          ref={inputRef}
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="w-64"
          autoFocus
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </div>
    );
  }
  
  return (
    <h1 
      className="text-xl font-medium hover:bg-muted/40 px-2 py-1 rounded cursor-pointer transition-colors duration-200"
      onClick={() => setIsEditing(true)}
    >
      {title}
    </h1>
  );
};

export default PipelineTitle;
