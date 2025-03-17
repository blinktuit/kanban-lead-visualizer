
import React, { useState } from 'react';
import { MoreHorizontal, MessageSquare, Tag, ArrowRight, ListPlus, RefreshCw } from 'lucide-react';
import { Lead, Tag as TagType, KanbanSettings } from '@/types';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

interface LeadCardProps {
  lead: Lead;
  settings: KanbanSettings;
  onSelect: (id: string) => void;
  selected: boolean;
  isDragging?: boolean;
  selectionActive: boolean;
}

const LeadCard: React.FC<LeadCardProps> = ({ 
  lead, 
  settings, 
  onSelect,
  selected,
  isDragging = false,
  selectionActive = false
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
            Verbinding in behandeling
          </span>
        </div>
      );
    }
    return null;
  };
  
  // Only display one tag as requested
  const displayTag = lead.tags.length > 0 ? lead.tags[0] : null;
  
  return (
    <div 
      className={cn(
        "kanban-card relative group",
        selected && "selected",
        isDragging && "opacity-70"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Checkbox - only visible when hovering or in selection mode */}
      <div className={cn(
        "absolute top-2 left-2 transition-opacity duration-150",
        (selectionActive || isHovering) ? "opacity-100" : "opacity-0"
      )}>
        <Checkbox
          checked={selected}
          onCheckedChange={() => onSelect(lead.id)}
          className="modern-checkbox"
        />
      </div>

      <div className="flex items-start pl-6">
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
          
          {/* Always show company as requested */}
          <p className="text-xs text-muted-foreground">{lead.company}</p>
          
          {settings.cardFields.showConnectionStatus && getStatusBadge()}
          
          {settings.cardFields.showTags && displayTag && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className={cn("tag", getTagClass(displayTag.color))}>
                {displayTag.name}
              </span>
            </div>
          )}
        </div>
        
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground p-0.5 rounded">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="flex flex-col space-y-1">
                <button className="kanban-menu-item">
                  <MessageSquare className="h-4 w-4" />
                  <span>Notitie toevoegen</span>
                </button>
                <button className="kanban-menu-item">
                  <Tag className="h-4 w-4" />
                  <span>Tag toevoegen</span>
                </button>
                <button className="kanban-menu-item">
                  <ArrowRight className="h-4 w-4" />
                  <span>Verplaatsen</span>
                </button>
                <button className="kanban-menu-item">
                  <ListPlus className="h-4 w-4" />
                  <span>Aan pipeline toevoegen</span>
                </button>
                <button className="kanban-menu-item">
                  <RefreshCw className="h-4 w-4" />
                  <span>Info bijwerken</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
