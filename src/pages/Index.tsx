
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import { initializeStorage } from '@/utils/storage';

const Index = () => {
  const [searchParams] = useSearchParams();
  const pipelineId = searchParams.get('id') || 'pipeline1'; // Default to first pipeline
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  useEffect(() => {
    // Initialize the storage with sample data
    initializeStorage();

    // Check local storage for sidebar state
    const savedState = localStorage.getItem('sidebar:collapsed');
    if (savedState) {
      setSidebarCollapsed(savedState === 'true');
    }

    // Add event listener for sidebar collapse state changes
    const handleSidebarChange = (e: Event) => {
      if (e instanceof StorageEvent && e.key === 'sidebar:collapsed') {
        setSidebarCollapsed(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleSidebarChange);
    return () => {
      window.removeEventListener('storage', handleSidebarChange);
    };
  }, []);
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} overflow-hidden`}>
        <KanbanBoard pipelineId={pipelineId} />
      </div>
    </div>
  );
};

export default Index;
