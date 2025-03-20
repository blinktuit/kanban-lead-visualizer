import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { KanbanSettings } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface DisplaySettingsProps {
  settings: KanbanSettings;
  setSettings: (settings: KanbanSettings) => void;
}

const DisplaySettings: React.FC<DisplaySettingsProps> = ({ settings, setSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const updateSetting = (field: keyof KanbanSettings['cardFields'], value: boolean) => {
    setSettings({
      ...settings,
      cardFields: {
        ...settings.cardFields,
        [field]: value
      }
    });
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 text-sm w-full" id="weergave-knop">
          <Settings className="h-4 w-4" />
          <span>Weergave</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 rounded-lg overflow-hidden shadow-lg border-border/40">
        <div className="flex flex-col">
          <div className="p-3 border-b border-border/30 bg-muted/30">
            <h3 className="text-sm font-medium flex items-center">
              <Settings className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              Kaartvelden
            </h3>
          </div>
          
          <div className="p-3 space-y-2.5">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showJobTitle"
                checked={settings.cardFields.showJobTitle}
                onCheckedChange={(checked) => updateSetting('showJobTitle', checked === true)}
                className="modern-checkbox"
              />
              <label htmlFor="showJobTitle" className="text-sm cursor-pointer">Toon functietitel</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showCompany"
                checked={settings.cardFields.showCompany}
                onCheckedChange={(checked) => updateSetting('showCompany', checked === true)}
                className="modern-checkbox"
              />
              <label htmlFor="showCompany" className="text-sm cursor-pointer">Toon bedrijf</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showConnectionStatus"
                checked={settings.cardFields.showConnectionStatus}
                onCheckedChange={(checked) => updateSetting('showConnectionStatus', checked === true)}
                className="modern-checkbox"
              />
              <label htmlFor="showConnectionStatus" className="text-sm cursor-pointer">Toon connectiestatus</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showTags"
                checked={settings.cardFields.showTags}
                onCheckedChange={(checked) => updateSetting('showTags', checked === true)}
                className="modern-checkbox"
              />
              <label htmlFor="showTags" className="text-sm cursor-pointer">Toon tags</label>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DisplaySettings;
