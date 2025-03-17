
import React, { useState } from 'react';
import { MoreHorizontal, MessageSquare, Tag, ArrowRight, ListPlus, RefreshCw } from 'lucide-react';
import { Lead, Tag as TagType, KanbanSettings } from '@/types';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

interface LeadCardProps {
  lead: Lead;
  settings: KanbanSettings;
  onSelect: (id: string) => void;
  selected: boolean;
}

const LeadCard: React.FC<LeadCardProps> = ({ 
  lead, 
  settings, 
  onSelect,
  selected
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const getTagClass = (color: TagType['color']) => {
    switch(color) {
      case 'blue': return 'tag-blue';
      case 'green': return 'tag-green';
      case 'purple': return 'tag-purple';
      case 'amber': return 'tag-amber';
      case 'red': return 'tag-red';
      default: return 'tag-blue';
    }
  };
  
  const getStatusBadge = () => {
    if (lead.connectionStatus === 'pending') {
      return (
        <div className="flex items-center mt-2">
          <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
            <span className="mr-1 w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping-slow"></span>
            Connection pending
          </span>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div 
      className="kanban-card relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onSelect(lead.id)}
          className="h-4 w-4"
        />
      </div>

      <div className="flex items-start">
        <div 
          className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ opacity: isHovering ? 0.8 : 1 }}
        >
          {lead.photoUrl ? (
            <img src={lead.photoUrl} alt={lead.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-medium">{lead.name.charAt(0)}</span>
          )}
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="font-medium text-sm">{lead.name}</h3>
          
          {settings.cardFields.showJobTitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{lead.jobTitle}</p>
          )}
          
          {settings.cardFields.showCompany && (
            <p className="text-xs text-muted-foreground">{lead.company}</p>
          )}
          
          {settings.cardFields.showConnectionStatus && getStatusBadge()}
          
          {settings.cardFields.showTags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {lead.tags.map(tag => (
                <span key={tag.id} className={cn("tag", getTagClass(tag.color))}>
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground p-0.5 rounded">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              <DropdownMenuItem className="kanban-menu-item">
                <MessageSquare className="h-4 w-4" />
                <span>Add note</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="kanban-menu-item">
                <Tag className="h-4 w-4" />
                <span>Add tag</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="kanban-menu-item">
                <ArrowRight className="h-4 w-4" />
                <span>Move to column</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="kanban-menu-item">
                <ListPlus className="h-4 w-4" />
                <span>Add to pipeline</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="kanban-menu-item">
                <RefreshCw className="h-4 w-4" />
                <span>Update info</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
