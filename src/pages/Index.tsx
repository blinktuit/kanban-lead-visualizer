
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { initializeStorage } from '@/utils/storage';

const Index = () => {
  const [searchParams] = useSearchParams();
  const pipelineId = searchParams.get('id') || 'pipeline1'; // Default to first pipeline
  
  useEffect(() => {
    // Initialize the storage with sample data
    initializeStorage();
  }, []);
  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <KanbanBoard pipelineId={pipelineId} />
      </div>
    </div>
  );
};

export default Index;
