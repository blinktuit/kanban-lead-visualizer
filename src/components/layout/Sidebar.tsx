
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Layout, MessageSquare, PieChart, Settings, Users } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [pipelineOpen, setPipelineOpen] = useState(true);

  return (
    <div className="bg-sidebar fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out 
                    flex flex-col border-r border-sidebar-border bg-sidebar-background">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-medium text-sidebar-foreground">Linqed.io</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          <Link to="/" className={cn("sidebar-item", location.pathname === '/' && "active")}>
            <PieChart className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link to="/connections" className={cn("sidebar-item", location.pathname === '/connections' && "active")}>
            <Users className="w-5 h-5" />
            <span>Connections</span>
          </Link>
          
          <div className="relative">
            <button 
              className={cn(
                "sidebar-item w-full flex justify-between", 
                location.pathname === '/pipeline' && "active"
              )}
              onClick={() => setPipelineOpen(!pipelineOpen)}
            >
              <span className="flex items-center">
                <Layout className="w-5 h-5 mr-2" />
                <span>Pipeline</span>
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform duration-200",
                pipelineOpen ? "rotate-180" : "rotate-0"
              )} />
            </button>
            
            <div className={cn("pl-7 space-y-1 sidebar-dropdown", pipelineOpen && "open")}>
              <Link to="/pipeline?id=pipeline1" 
                className="sidebar-item text-sm py-1.5">
                Sales Pipeline
              </Link>
              <Link to="/pipeline?id=pipeline2" 
                className="sidebar-item text-sm py-1.5">
                Marketing Pipeline
              </Link>
              <Link to="/pipeline/new" 
                className="sidebar-item text-sm py-1.5 text-primary">
                + New Pipeline
              </Link>
            </div>
          </div>
          
          <Link to="/messages" className={cn("sidebar-item", location.pathname === '/messages' && "active")}>
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </Link>
          
          <Link to="/settings" className={cn("sidebar-item", location.pathname === '/settings' && "active")}>
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            JS
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-sidebar-foreground">John Smith</p>
            <p className="text-xs text-sidebar-foreground/70">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
