
import { Lead, Pipeline } from '@/types';
import { saveLeads } from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for managing lead operations
 */
export function useLeadOperations(
  leads: Lead[],
  setLeads: (leads: Lead[]) => void
) {
  const { toast } = useToast();
  
  const handleMoveCards = (pipelineId: string, leadIds: string[], targetColumnId: string) => {
    // Update local state
    const updatedLeads = leads.map(lead => {
      if (leadIds.includes(lead.id)) {
        return {
          ...lead,
          pipelinePositions: {
            ...lead.pipelinePositions,
            [pipelineId]: targetColumnId
          }
        };
      }
      return lead;
    });
    
    setLeads(updatedLeads);
    
    // Save to local storage
    saveLeads(updatedLeads);
    
    toast({
      title: leadIds.length > 1 ? "Leads verplaatst" : "Lead verplaatst",
      description: leadIds.length > 1 
        ? `${leadIds.length} leads zijn verplaatst` 
        : "Lead is verplaatst naar nieuwe kolom",
    });
  };
  
  const handleAddLead = (pipelineId: string, pipeline: Pipeline | undefined, lead: Partial<Lead>) => {
    if (!pipeline || !pipeline.columns.length) return;
    
    // Set defaults for a new lead
    const firstColumnId = pipeline.columns.find(col => col.order === 0)?.id;
    if (!firstColumnId) return;
    
    const newLead: Lead = {
      id: `lead${Date.now()}`,
      name: lead.name || 'Nieuwe Lead',
      photoUrl: lead.photoUrl || '',
      jobTitle: lead.jobTitle || '',
      company: lead.company || '',
      tags: lead.tags || [],
      connectionStatus: lead.connectionStatus || 'none',
      pipelinePositions: {
        [pipelineId]: firstColumnId
      }
    };
    
    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    
    // Save to local storage
    saveLeads(updatedLeads);
    
    toast({
      title: "Lead toegevoegd",
      description: `"${newLead.name}" toegevoegd aan pipeline`,
    });
    
    return true;
  };
  
  return {
    handleMoveCards,
    handleAddLead
  };
}
