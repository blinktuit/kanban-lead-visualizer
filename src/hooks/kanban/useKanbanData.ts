
import { useState, useEffect } from 'react';
import { Pipeline, Lead, KanbanSettings } from '@/types';
import { initializeStorage, getPipeline, getLeads, getSettings, getPipelines } from '@/utils/storage';

/**
 * Hook for managing the core kanban data
 */
export function useKanbanData(pipelineId: string) {
  const [pipeline, setPipeline] = useState<Pipeline | undefined>(undefined);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<KanbanSettings | null>(null);
  
  // Initialize local storage and load data
  useEffect(() => {
    initializeStorage();
    
    const loadedPipeline = getPipeline(pipelineId);
    if (loadedPipeline) {
      setPipeline(loadedPipeline);
    }
    
    const loadedLeads = getLeads();
    setLeads(loadedLeads);
    
    const loadedSettings = getSettings();
    setSettings(loadedSettings);

    const loadedPipelines = getPipelines();
    setPipelines(loadedPipelines);
  }, [pipelineId]);

  return {
    pipeline,
    setPipeline,
    pipelines,
    setPipelines,
    leads,
    setLeads,
    settings
  };
}
