
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(title);
  };
  
  if (isEditing) {
    return (
      <div className="flex items-center">
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="w-64 mr-2"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') onUpdateTitle();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <Button size="sm" onClick={onUpdateTitle}>Opslaan</Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleCancel}
          className="ml-1"
        >
          Annuleren
        </Button>
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
