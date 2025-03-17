
import React from 'react';
import { Share, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

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
    <div className="flex items-center gap-2">
      <Button 
        variant="outline"
        size="sm"
        onClick={handleShare}
      >
        <Share className="h-4 w-4 mr-2" />
        Delen
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
      >
        <Download className="h-4 w-4 mr-2" />
        Exporteren
      </Button>
    </div>
  );
};

export default ShareExport;
