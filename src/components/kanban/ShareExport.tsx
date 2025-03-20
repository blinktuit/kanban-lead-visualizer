import React from 'react';
import { Share, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface ShareExportProps {
  pipelineId: string;
}

const ShareExport: React.FC<ShareExportProps> = ({ pipelineId }) => {
  const { toast } = useToast();
  
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/shared/pipeline/${pipelineId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link gekopieerd",
        description: "Deelbare link is gekopieerd naar klembord",
      });
    });
  };
  
  return (
    <div className="space-y-2">
      <div 
        className="flex items-center gap-2 text-sm w-full cursor-pointer"
        onClick={handleShare}
      >
        <Share className="h-4 w-4" />
        <span>Delen</span>
      </div>
      
      <div className="flex items-center gap-2 text-sm w-full cursor-pointer">
        <Download className="h-4 w-4" />
        <span>Exporteren</span>
      </div>
    </div>
  );
};

export default ShareExport;
