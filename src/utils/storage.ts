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
    name: 'Verkoop Pipeline',
    columns: [
      { id: 'col1', name: 'Nieuwe Leads', order: 0 },
      { id: 'col2', name: 'Contact Gelegd', order: 1 },
      { id: 'col3', name: 'In Gesprek', order: 2 },
      { id: 'col4', name: 'Afspraak Gepland', order: 3 },
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
      { id: 'col10', name: 'Klant', order: 4 },
    ],
  },
];

// Sample tags
const tags = [
  { id: 'tag1', name: 'Hoge Prioriteit', color: 'red' as const },
  { id: 'tag2', name: 'Geïnteresseerd', color: 'green' as const },
  { id: 'tag3', name: 'Follow-up', color: 'blue' as const },
  { id: 'tag4', name: 'Koud Contact', color: 'purple' as const },
  { id: 'tag5', name: 'Warme Lead', color: 'amber' as const },
];

// Sample lead data with Dutch names
const generateSampleLeads = (): Lead[] => {
  const names = [
    'Jan de Vries', 'Emma Jansen', 'Luuk Bakker', 'Sophie de Boer', 'Thomas van Dijk',
    'Julia Visser', 'Daan Smit', 'Lotte Mulder', 'Sem Bos', 'Evi van Leeuwen',
    'Lucas Meyer', 'Tess de Groot', 'Finn Vos', 'Sara Peters', 'Max Hendriks',
    'Noa de Jong', 'Thijs Dekker', 'Zoë van den Berg', 'Jesse Dijkstra', 'Lynn Kok',
    'Ruben Vermeulen', 'Mila van der Meer', 'Jayden de Wit', 'Fenna Verhoeven', 'Sven Jacobs',
    'Roos Maas', 'Stijn van der Linden', 'Noor Scholten', 'Bram Prins', 'Eva Huisman'
  ];
  
  const jobTitles = [
    'Verkoopdirecteur', 'Marketing Manager', 'CEO', 'CTO', 'Product Manager',
    'Software Ontwikkelaar', 'HR Directeur', 'Financieel Manager', 'Operations Directeur', 'Business Analist'
  ];
  
  const companies = [
    'Rabobank', 'Philips', 'ASML', 'Albert Heijn', 'KLM',
    'ING Bank', 'Shell Nederland', 'Heineken', 'Ahold Delhaize', 'ABN AMRO'
  ];
  
  const statuses: ConnectionStatus[] = ['pending', 'connected', 'none'];
  
  // Profile image paths - using placeholder images but in a real app, these would be actual profile images
  const profileImages = [
    '/placeholder.svg', 
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];
  
  return Array.from({ length: 30 }, (_, i) => {
    // Geef sommige leads meerdere tags
    let leadTags;
    if (i % 3 === 0) {
      // Elke derde lead krijgt 1 tag
      const randomTagIndex = Math.floor(Math.random() * tags.length);
      leadTags = [tags[randomTagIndex]];
    } else if (i % 3 === 1) {
      // Elke lead met rest 1 krijgt 2 tags
      const randomTagIndex1 = Math.floor(Math.random() * tags.length);
      let randomTagIndex2;
      do {
        randomTagIndex2 = Math.floor(Math.random() * tags.length);
      } while (randomTagIndex2 === randomTagIndex1);
      
      leadTags = [tags[randomTagIndex1], tags[randomTagIndex2]];
    } else {
      // Elke lead met rest 2 krijgt 3 tags
      const usedIndices = new Set<number>();
      while (usedIndices.size < 3) {
        usedIndices.add(Math.floor(Math.random() * tags.length));
      }
      
      leadTags = Array.from(usedIndices).map(index => tags[index]);
    }
    
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
      photoUrl: profileImages[i % profileImages.length],
      jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      tags: leadTags, // Nu meerdere tags per lead
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
export const getPipeline = (id: string): Pipeline | undefined => {
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
