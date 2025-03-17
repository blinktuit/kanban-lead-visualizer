
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Layout, MessageSquare, PieChart, Settings, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [pipelineOpen, setPipelineOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-[#222222] fixed inset-y-0 left-0 z-30 transform transition-all duration-300 ease-in-out",
      "flex flex-col border-r border-zinc-800 text-white",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h1 className={cn(
          "text-xl font-medium text-white transition-opacity duration-200",
          collapsed ? "opacity-0 w-0" : "opacity-100"
        )}>
          Linqed.io
        </h1>
        <button 
          className="text-white/70 hover:text-white transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          <Link to="/" className={cn(
            "flex items-center gap-2 w-full text-sm px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-zinc-800 transition-colors duration-200",
            location.pathname === '/' && "bg-zinc-800 text-white"
          )}>
            <PieChart className="w-5 h-5" />
            <span className={cn("transition-opacity duration-200", collapsed ? "opacity-0 w-0" : "opacity-100")}>Dashboard</span>
          </Link>
          
          <Link to="/connections" className={cn(
            "flex items-center gap-2 w-full text-sm px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-zinc-800 transition-colors duration-200",
            location.pathname === '/connections' && "bg-zinc-800 text-white"
          )}>
            <Users className="w-5 h-5" />
            <span className={cn("transition-opacity duration-200", collapsed ? "opacity-0 w-0" : "opacity-100")}>Connecties</span>
          </Link>
          
          <div className="relative">
            <button 
              className={cn(
                "flex items-center gap-2 w-full text-sm px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-zinc-800 transition-colors duration-200 justify-between", 
                location.pathname === '/pipeline' && "bg-zinc-800 text-white"
              )}
              onClick={() => setPipelineOpen(!pipelineOpen)}
            >
              <span className="flex items-center">
                <Layout className="w-5 h-5 mr-2" />
                <span className={cn("transition-opacity duration-200", collapsed ? "opacity-0 w-0" : "opacity-100")}>Pipelines</span>
              </span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform duration-200",
                pipelineOpen ? "rotate-180" : "rotate-0",
                collapsed ? "opacity-0 w-0" : "opacity-100"
              )} />
            </button>
            
            <div className={cn(
              "pl-7 space-y-1 sidebar-dropdown transition-all duration-200", 
              pipelineOpen && !collapsed ? "open max-h-40" : "max-h-0 overflow-hidden",
              collapsed && "hidden"
            )}>
              <Link to="/pipeline?id=pipeline1" 
                className="flex items-center w-full text-sm py-1.5 px-2 rounded-md text-white/80 hover:text-white hover:bg-zinc-800 transition-colors duration-200">
                Verkoop Pipeline
              </Link>
              <Link to="/pipeline?id=pipeline2" 
                className="flex items-center w-full text-sm py-1.5 px-2 rounded-md text-white/80 hover:text-white hover:bg-zinc-800 transition-colors duration-200">
                Marketing Pipeline
              </Link>
              <Link to="/pipeline/new" 
                className="flex items-center w-full text-sm py-1.5 px-2 rounded-md text-primary hover:text-primary hover:bg-zinc-800 transition-colors duration-200">
                + Nieuwe Pipeline
              </Link>
            </div>
          </div>
          
          <Link to="/messages" className={cn(
            "flex items-center gap-2 w-full text-sm px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-zinc-800 transition-colors duration-200",
            location.pathname === '/messages' && "bg-zinc-800 text-white"
          )}>
            <MessageSquare className="w-5 h-5" />
            <span className={cn("transition-opacity duration-200", collapsed ? "opacity-0 w-0" : "opacity-100")}>Berichten</span>
          </Link>
          
          <Link to="/settings" className={cn(
            "flex items-center gap-2 w-full text-sm px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-zinc-800 transition-colors duration-200",
            location.pathname === '/settings' && "bg-zinc-800 text-white"
          )}>
            <Settings className="w-5 h-5" />
            <span className={cn("transition-opacity duration-200", collapsed ? "opacity-0 w-0" : "opacity-100")}>Instellingen</span>
          </Link>
        </nav>
      </div>
      
      <div className={cn(
        "p-4 border-t border-zinc-800",
        collapsed ? "flex justify-center" : ""
      )}>
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            JS
          </div>
          <div className={cn(
            "ml-3 transition-opacity duration-200",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}>
            <p className="text-sm font-medium text-white">John Smith</p>
            <p className="text-xs text-white/70">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
