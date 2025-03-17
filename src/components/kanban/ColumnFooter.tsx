
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColumnFooterProps {
  columnId: string;
  onAddLead: (columnId: string) => void;
}

const ColumnFooter: React.FC<ColumnFooterProps> = ({ columnId, onAddLead }) => {
  return (
    <div className="p-2 border-t border-border/40">
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-muted-foreground hover:text-foreground"
        onClick={() => onAddLead(columnId)}
      >
        <Plus className="h-4 w-4 mr-1" />
        <span>Lead toevoegen</span>
      </Button>
    </div>
  );
};

export default ColumnFooter;
