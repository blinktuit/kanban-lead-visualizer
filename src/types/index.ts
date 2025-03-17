
export interface Lead {
  id: string;
  name: string;
  photoUrl: string;
  jobTitle: string;
  company: string;
  tags: Tag[];
  connectionStatus: ConnectionStatus;
  pipelinePositions: {
    [pipelineId: string]: string; // Maps pipeline ID to column ID
  };
  selected?: boolean;
}

export type ConnectionStatus = 'pending' | 'connected' | 'none';

export interface Tag {
  id: string;
  name: string;
  color: 'blue' | 'green' | 'purple' | 'amber' | 'red';
}

export interface Column {
  id: string;
  name: string;
  order: number;
}

export interface Pipeline {
  id: string;
  name: string;
  columns: Column[];
}

export interface KanbanSettings {
  cardFields: {
    showJobTitle: boolean;
    showCompany: boolean;
    showConnectionStatus: boolean;
    showTags: boolean;
  };
}
