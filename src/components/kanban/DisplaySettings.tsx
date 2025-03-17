
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { KanbanSettings } from '@/types';

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
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showJobTitle"
                checked={settings.cardFields.showJobTitle}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    cardFields: {
                      ...settings.cardFields,
                      showJobTitle: e.target.checked
                    }
                  });
                }}
                className="mr-2"
              />
              <label htmlFor="showJobTitle" className="text-sm">Toon functietitel</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showCompany"
                checked={settings.cardFields.showCompany}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    cardFields: {
                      ...settings.cardFields,
                      showCompany: e.target.checked
                    }
                  });
                }}
                className="mr-2"
              />
              <label htmlFor="showCompany" className="text-sm">Toon bedrijf</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showConnectionStatus"
                checked={settings.cardFields.showConnectionStatus}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    cardFields: {
                      ...settings.cardFields,
                      showConnectionStatus: e.target.checked
                    }
                  });
                }}
                className="mr-2"
              />
              <label htmlFor="showConnectionStatus" className="text-sm">Toon connectiestatus</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showTags"
                checked={settings.cardFields.showTags}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    cardFields: {
                      ...settings.cardFields,
                      showTags: e.target.checked
                    }
                  });
                }}
                className="mr-2"
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
