
import { useState } from 'react';
import { Lead, Tag } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { saveLeads } from '@/utils/storage';

export function useLeadLabelOperations(leads: Lead[], setLeads: (leads: Lead[]) => void) {
  const { toast } = useToast();
  const [isLabelPopoverOpen, setIsLabelPopoverOpen] = useState(false);
  const [activeLabelTarget, setActiveLabelTarget] = useState<{id: string, type: 'lead' | 'column'} | null>(null);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);

  const getAllTags = (): Tag[] => {
    // Extract all unique tags from all leads
    return Array.from(
      new Map(
        leads
          .flatMap(lead => lead.tags)
          .map(tag => [tag.id, tag])
      ).values()
    );
  };

  const openLabelPopover = (targetId: string, type: 'lead' | 'column') => {
    if (type === 'lead') {
      const lead = leads.find(l => l.id === targetId);
      if (lead) {
        setSelectedLabelIds(lead.tags.map(tag => tag.id));
      }
    }
    setActiveLabelTarget({id: targetId, type});
    setIsLabelPopoverOpen(true);
  };

  const closeLabelPopover = () => {
    setIsLabelPopoverOpen(false);
    setActiveLabelTarget(null);
    setSelectedLabelIds([]);
  };

  const updateLeadLabels = (leadId: string, tagIds: string[]) => {
    const allTags = getAllTags();
    const newTags = tagIds.map(id => allTags.find(tag => tag.id === id)).filter(Boolean) as Tag[];
    
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          tags: newTags
        };
      }
      return lead;
    });
    
    setLeads(updatedLeads);
    saveLeads(updatedLeads);
    
    toast({
      title: "Labels bijgewerkt",
      description: `Labels voor ${updatedLeads.find(l => l.id === leadId)?.name} bijgewerkt`,
    });
    
    closeLabelPopover();
  };

  const updateColumnLabels = (columnId: string, tagIds: string[]) => {
    // This would update all leads in a column
    const allTags = getAllTags();
    const selectedTags = tagIds.map(id => allTags.find(tag => tag.id === id)).filter(Boolean) as Tag[];
    
    // Find all leads in this column
    const updatedLeads = leads.map(lead => {
      if (lead.pipelinePositions[activeLabelTarget?.id.split(':')[0] || ''] === columnId) {
        return {
          ...lead,
          // Add the new tags to existing tags
          tags: [...lead.tags, ...selectedTags.filter(tag => 
            !lead.tags.some(existingTag => existingTag.id === tag.id)
          )]
        };
      }
      return lead;
    });
    
    setLeads(updatedLeads);
    saveLeads(updatedLeads);
    
    toast({
      title: "Labels toegevoegd aan kolom",
      description: `Labels toegevoegd aan alle leads in kolom`,
    });
    
    closeLabelPopover();
  };

  const handleLabelChange = (tagIds: string[]) => {
    setSelectedLabelIds(tagIds);
    
    if (activeLabelTarget) {
      if (activeLabelTarget.type === 'lead') {
        updateLeadLabels(activeLabelTarget.id, tagIds);
      } else {
        updateColumnLabels(activeLabelTarget.id, tagIds);
      }
    }
  };

  return {
    isLabelPopoverOpen,
    setIsLabelPopoverOpen,
    activeLabelTarget,
    selectedLabelIds,
    getAllTags,
    openLabelPopover,
    closeLabelPopover,
    handleLabelChange
  };
}
