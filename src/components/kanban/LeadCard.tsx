import React, { useState } from 'react';
import { MoreHorizontal, MessageSquare, Tag, ArrowRight, ListPlus, RefreshCw, Plus, Check } from 'lucide-react';
import { Lead, Tag as TagType, KanbanSettings } from '@/types';
import { cn } from '@/lib/utils';
import { getAvatarColor, getInitials, getAvatarUrl } from '@/utils/avatar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface LeadCardProps {
  lead: Lead;
  settings: KanbanSettings;
  onSelect: (id: string) => void;
  selected: boolean;
  isDragging?: boolean;
  selectionActive: boolean;
  onAddLabel?: (leadId: string) => void;
  onAddToPipeline?: (leadId: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ 
  lead, 
  settings, 
  onSelect,
  selected,
  isDragging = false,
  selectionActive = false,
  onAddLabel,
  onAddToPipeline
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Tag helpers
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
    return null;
  };
  
  // Check if there are multiple tags
  const displayTag = lead.tags.length > 0 ? lead.tags[0] : null;
  const hasMultipleTags = lead.tags.length > 1;
  
  // Get avatar info
  const avatarInitials = getInitials(lead.name);
  const avatarColor = getAvatarColor(lead.name);
  const avatarUrl = getAvatarUrl(lead.name);
  
  // Bepaal de tekstkleur (wit voor donkere achtergronden, donker voor lichte)
  const textColor = avatarColor.startsWith('#3') || 
                    avatarColor.startsWith('#9') || 
                    avatarColor.startsWith('#34') || 
                    avatarColor.startsWith('#8e') ? 
                    'white' : '#34495e';
  
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
      <div className="flex items-start pt-1">
        <button 
          onClick={() => onSelect(lead.id)}
          className={cn(
            "relative w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden",
            selected ? "ring-2 ring-primary ring-offset-1" : "hover:ring-2 hover:ring-primary/50",
            "transition-all duration-200 shadow-sm"
          )}
          style={!imageError ? {} : { backgroundColor: avatarColor }}
          title={`Selecteer ${lead.name}`}
        >
          {!imageError ? (
            <img 
              src={avatarUrl}
              alt={lead.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span 
              className="text-xs font-bold select-none" 
              style={{ color: textColor }}
            >
              {avatarInitials}
            </span>
          )}
          
          {selected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Check className="text-white h-3 w-3 drop-shadow" />
            </div>
          )}
        </button>
        
        <div className="ml-2 flex-1 overflow-hidden pr-0.5">
          <h3 className="font-medium text-sm truncate">{lead.name}</h3>
          
          {settings.cardFields.showJobTitle && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{lead.jobTitle}</p>
          )}
          
          {/* Always show company as requested */}
          <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
          
          {settings.cardFields.showConnectionStatus && getStatusBadge()}
          
          {settings.cardFields.showTags && (
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-1 flex-wrap">
                {displayTag && (
                  <span 
                    className={cn("tag", getTagClass(displayTag.color), "cursor-pointer")}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!selectionActive && onAddLabel) {
                        onAddLabel(lead.id);
                      }
                    }}
                    title="Klik om labels te bewerken"
                  >
                    {displayTag.name}
                    {hasMultipleTags && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        +{lead.tags.length - 1}
                      </span>
                    )}
                  </span>
                )}
                {displayTag ? (
                  <button 
                    className={cn(
                      "tag-add-button w-5 h-5 flex items-center justify-center rounded-full border border-dashed border-muted-foreground/50 ml-1",
                      isHovering ? "opacity-100" : "opacity-0"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!selectionActive) {
                        onAddLabel?.(lead.id);
                      }
                    }}
                    title="Label toevoegen"
                  >
                    <Plus className="h-3 w-3 text-muted-foreground" />
                  </button>
                ) : (
                  <button 
                    className={cn(
                      "transition-opacity duration-150 flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border border-dashed border-muted-foreground/40",
                      isHovering ? "opacity-100" : "opacity-0"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!selectionActive) {
                        onAddLabel?.(lead.id);
                      }
                    }}
                    title="Label toevoegen"
                  >
                    <Plus className="h-2.5 w-2.5 text-muted-foreground" />
                    <span className="text-muted-foreground">label</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground p-0.5 rounded -mr-2">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end" sideOffset={5}>
              <div className="flex flex-col space-y-1">
                <button className="kanban-menu-item">
                  <MessageSquare className="h-4 w-4" />
                  <span>Notitie toevoegen</span>
                </button>
                <button 
                  className="kanban-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!selectionActive) {
                      onAddLabel?.(lead.id);
                    }
                  }}
                >
                  <Tag className="h-4 w-4" />
                  <span>Label toevoegen</span>
                </button>
                <button className="kanban-menu-item">
                  <ArrowRight className="h-4 w-4" />
                  <span>Verplaatsen</span>
                </button>
                <button 
                  className="kanban-menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToPipeline?.(lead.id);
                  }}
                >
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
