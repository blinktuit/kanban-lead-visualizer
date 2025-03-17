import { Lead, Pipeline, KanbanSettings, ConnectionStatus } from '@/types';

const STORAGE_PREFIX = 'linqed_kanban_';

const defaultSettings: KanbanSettings = {
  cardFields: {
    showJobTitle: true,
    showCompany: true,
    showConnectionStatus: true,
    showTags: true,
  },
};

const defaultPipelines: Pipeline[] = [
  {
    id: 'pipeline1',
    name: 'Sales Pipeline',
    columns: [
      { id: 'col1', name: 'New Leads', order: 0 },
      { id: 'col2', name: 'Contacted', order: 1 },
      { id: 'col3', name: 'Responding', order: 2 },
      { id: 'col4', name: 'Meeting Scheduled', order: 3 },
      { id: 'col5', name: 'Deal', order: 4 },
    ],
  },
  {
    id: 'pipeline2',
    name: 'Marketing Pipeline',
    columns: [
      { id: 'col6', name: 'Prospects', order: 0 },
      { id: 'col7', name: 'Leads', order: 1 },
      { id: 'col8', name: 'MQL', order: 2 },
      { id: 'col9', name: 'SQL', order: 3 },
      { id: 'col10', name: 'Customer', order: 4 },
    ],
  },
];

// Sample tags
const tags = [
  { id: 'tag1', name: 'High Priority', color: 'red' as const },
  { id: 'tag2', name: 'Interested', color: 'green' as const },
  { id: 'tag3', name: 'Follow-up', color: 'blue' as const },
  { id: 'tag4', name: 'Cold', color: 'purple' as const },
  { id: 'tag5', name: 'Hot Lead', color: 'amber' as const },
];

// Sample lead data with realistic info for 30 leads
const generateSampleLeads = (): Lead[] => {
  const names = [
    'John van Rooj', 'Emma Johnson', 'Michael Smith', 'Sophie Williams', 'David Brown',
    'Olivia Davis', 'Daniel Miller', 'Ava Wilson', 'James Moore', 'Isabella Taylor',
    'Alexander Anderson', 'Charlotte Thomas', 'William Jackson', 'Amelia White', 'Benjamin Harris',
    'Mia Martin', 'Henry Thompson', 'Emily Garcia', 'Sebastian Martinez', 'Ella Robinson',
    'Jack Wright', 'Grace Hill', 'Oliver Scott', 'Chloe Green', 'Lucas Adams',
    'Lily Baker', 'Aiden Nelson', 'Zoe Hall', 'Luke Allen', 'Layla Young'
  ];
  
  const jobTitles = [
    'Sales Director', 'Marketing Manager', 'CEO', 'CTO', 'Product Manager',
    'Software Engineer', 'HR Director', 'Finance Manager', 'Operations Director', 'Business Analyst'
  ];
  
  const companies = [
    'Ideo B.V.', 'TechGiant Inc.', 'GlobalSoft', 'Innovate Solutions', 'NextLevel Corp',
    'FutureTech', 'DigitalEdge', 'SmartSystems', 'CreativeMinds', 'StrategyPlus'
  ];
  
  const statuses: ConnectionStatus[] = ['pending', 'connected', 'none'];
  
  return Array.from({ length: 30 }, (_, i) => {
    // Randomly select 1-3 tags for each lead
    const leadTags = [...tags]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);
    
    // Distribute leads across pipelines and columns
    let pipelinePositions: { [key: string]: string } = {};
    
    // Pipeline 1 distribution
    if (i < 20) { // first 20 leads are in pipeline 1
      const columnIndex = i % 5;
      pipelinePositions['pipeline1'] = `col${columnIndex + 1}`;
    }
    
    // Pipeline 2 distribution (some leads appear in both pipelines)
    if (i >= 10 && i < 30) { // leads 10-29 are in pipeline 2
      const columnIndex = (i - 10) % 5;
      pipelinePositions['pipeline2'] = `col${columnIndex + 6}`;
    }
    
    return {
      id: `lead${i + 1}`,
      name: names[i % names.length],
      photoUrl: `/placeholder.svg`, // Using placeholder images
      jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      tags: leadTags,
      connectionStatus: statuses[Math.floor(Math.random() * statuses.length)],
      pipelinePositions,
    };
  });
};

const defaultLeads = generateSampleLeads();

// Initialize storage with default data if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem(`${STORAGE_PREFIX}settings`)) {
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(defaultSettings));
  }
  
  if (!localStorage.getItem(`${STORAGE_PREFIX}pipelines`)) {
    localStorage.setItem(`${STORAGE_PREFIX}pipelines`, JSON.stringify(defaultPipelines));
  }
  
  if (!localStorage.getItem(`${STORAGE_PREFIX}leads`)) {
    localStorage.setItem(`${STORAGE_PREFIX}leads`, JSON.stringify(defaultLeads));
  }
};

// Get all pipelines
export const getPipelines = (): Pipeline[] => {
  const pipelinesJson = localStorage.getItem(`${STORAGE_PREFIX}pipelines`);
  return pipelinesJson ? JSON.parse(pipelinesJson) : [];
};

// Get a specific pipeline by ID
export const const getPipeline = (id: string): Pipeline | undefined => {
  const pipelines = getPipelines();
  return pipelines.find(p => p.id === id);
};

// Save pipelines
export const savePipelines = (pipelines: Pipeline[]): void => {
  localStorage.setItem(`${STORAGE_PREFIX}pipelines`, JSON.stringify(pipelines));
};

// Get all leads
export const getLeads = (): Lead[] => {
  const leadsJson = localStorage.getItem(`${STORAGE_PREFIX}leads`);
  return leadsJson ? JSON.parse(leadsJson) : [];
};

// Save leads
export const saveLeads = (leads: Lead[]): void => {
  localStorage.setItem(`${STORAGE_PREFIX}leads`, JSON.stringify(leads));
};

// Get leads for a specific column in a pipeline
export const getLeadsForColumn = (pipelineId: string, columnId: string): Lead[] => {
  const allLeads = getLeads();
  return allLeads.filter(lead => {
    return lead.pipelinePositions[pipelineId] === columnId;
  });
};

// Get kanban settings
export const getSettings = (): KanbanSettings => {
  const settingsJson = localStorage.getItem(`${STORAGE_PREFIX}settings`);
  return settingsJson ? JSON.parse(settingsJson) : defaultSettings;
};

// Save kanban settings
export const saveSettings = (settings: KanbanSettings): void => {
  localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(settings));
};

// Move a lead to a different column
export const moveLeadToColumn = (leadId: string, pipelineId: string, targetColumnId: string): void => {
  const leads = getLeads();
  const updatedLeads = leads.map(lead => {
    if (lead.id === leadId) {
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
  
  saveLeads(updatedLeads);
};

// Reset demo data
export const resetDemoData = (): void => {
  localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(defaultSettings));
  localStorage.setItem(`${STORAGE_PREFIX}pipelines`, JSON.stringify(defaultPipelines));
  localStorage.setItem(`${STORAGE_PREFIX}leads`, JSON.stringify(defaultLeads));
};
