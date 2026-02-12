import React from 'react';
import { Button } from './ui/button';
import { AlertTriangle, Monitor, Cloud } from 'lucide-react';

const SyncConflictDialog = ({ onKeepLocal, onUseCloud }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Cloud Data Differs</h2>
            <p className="text-sm text-muted-foreground">
              Your local data doesn't match what's saved in the cloud.
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Choose which version to keep. The other will be overwritten.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={onKeepLocal}
          >
            <Monitor className="h-5 w-5 shrink-0" />
            <div className="text-left">
              <div className="font-medium">Keep Local</div>
              <div className="text-xs text-muted-foreground font-normal">
                Use your local data and overwrite the cloud
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-auto py-3"
            onClick={onUseCloud}
          >
            <Cloud className="h-5 w-5 shrink-0" />
            <div className="text-left">
              <div className="font-medium">Use Cloud</div>
              <div className="text-xs text-muted-foreground font-normal">
                Replace your local data with the cloud version
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SyncConflictDialog;
