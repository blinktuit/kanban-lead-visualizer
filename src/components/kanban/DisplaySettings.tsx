
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { KanbanSettings } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

interface DisplaySettingsProps {
  settings: KanbanSettings;
  setSettings: (settings: KanbanSettings) => void;
}

const DisplaySettings: React.FC<DisplaySettingsProps> = ({ settings, setSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Weergave
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Kaart velden</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showJobTitle"
                checked={settings.cardFields.showJobTitle}
                onCheckedChange={(checked) => {
                  setSettings({
                    ...settings,
                    cardFields: {
                      ...settings.cardFields,
                      showJobTitle: checked === true
                    }
                  });
                }}
                className="modern-checkbox"
              />
              <label htmlFor="showJobTitle" className="text-sm">Toon functietitel</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showCompany"
                checked={settings.cardFields.showCompany}
                onCheckedChange={(checked) => {
                  setSettings({
                    ...settings,
                    cardFields: {
                      ...settings.cardFields,
                      showCompany: checked === true
                    }
                  });
                }}
                className="modern-checkbox"
              />
              <label htmlFor="showCompany" className="text-sm">Toon bedrijf</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showConnectionStatus"
                checked={settings.cardFields.showConnectionStatus}
                onCheckedChange={(checked) => {
                  setSettings({
                    ...settings,
                    cardFields: {
                      ...settings.cardFields,
                      showConnectionStatus: checked === true
                    }
                  });
                }}
                className="modern-checkbox"
              />
              <label htmlFor="showConnectionStatus" className="text-sm">Toon connectiestatus</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showTags"
                checked={settings.cardFields.showTags}
                onCheckedChange={(checked) => {
                  setSettings({
                    ...settings,
                    cardFields: {
                      ...settings.cardFields,
                      showTags: checked === true
                    }
                  });
                }}
                className="modern-checkbox"
              />
              <label htmlFor="showTags" className="text-sm">Toon tags</label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button size="sm" onClick={() => setIsOpen(false)}>Toepassen</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DisplaySettings;
