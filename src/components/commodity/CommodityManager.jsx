import React from 'react';
import { Settings, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import CommoditySearch from './CommoditySearch';

const CommodityManager = ({ 
  commodities, 
  onAddCommodity, 
  onRemoveCommodity, 
  onResetToDefault 
}) => {
  const defaultCommodityIds = ['steel', 'copper', 'aluminum', 'pvc'];
  const isDefaultConfiguration = commodities.length === 4 && 
    commodities.every(c => defaultCommodityIds.includes(c.id));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white/80 backdrop-blur-sm hover:bg-gray-50"
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage Commodities
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white border border-gray-300 shadow-2xl">
        <DialogHeader className="bg-white border-b border-gray-200 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Manage Tracked Commodities
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 bg-white p-6">
          {/* Current Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Current Configuration</h3>
            <p className="text-blue-800 text-sm">
              Tracking {commodities.length} commodities: {commodities.map(c => c.name).join(', ')}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Add New Commodities</h3>
              <CommoditySearch 
                onAddCommodity={onAddCommodity}
                currentCommodities={commodities}
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Reset Configuration</h3>
              <div className="flex items-start space-x-3">
                <Button
                  variant="outline"
                  onClick={onResetToDefault}
                  disabled={isDefaultConfiguration}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset to Default</span>
                </Button>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Reset to the original four commodities: Steel, Copper, Aluminum, and PVC
                  </p>
                  {isDefaultConfiguration && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Currently using default configuration
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <Alert>
            <AlertDescription>
              <strong>How to manage commodities:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Use "Add Commodity" to search and add new materials to track</li>
                <li>• Hover over commodity cards and click the X button to remove them</li>
                <li>• Use "Reset to Default" to return to the original four commodities</li>
                <li>• You can track up to 12 commodities at once for optimal display</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommodityManager;

