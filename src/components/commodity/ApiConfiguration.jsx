import React from 'react';
import { Settings, ExternalLink, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';

const ApiConfiguration = ({ apiConfig, apiStatus, newsApiConfig }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white/80 backdrop-blur-sm hover:bg-gray-50"
        >
          <Settings className="h-4 w-4 mr-2" />
          API Config
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[1200px] !w-[95vw] bg-white border border-gray-300 shadow-2xl max-h-[90vh] overflow-hidden sm:!max-w-[1200px]">
        <DialogHeader className="bg-white border-b border-gray-200 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            API Configuration & Status
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 bg-white p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Current Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Current API Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${apiStatus?.alphaVantage ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">AlphaVantage API</span>
                </div>
                <Badge className={apiStatus?.alphaVantage ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {apiStatus?.alphaVantage ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${apiStatus?.metalsApi ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">Metals-API</span>
                </div>
                <Badge className={apiStatus?.metalsApi ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {apiStatus?.metalsApi ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${apiStatus?.newsApi ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">Guardian API</span>
                </div>
                <Badge className={apiStatus?.newsApi ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {apiStatus?.newsApi ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Configuration Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Configuration Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  {apiConfig?.alphaVantage?.configured ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  AlphaVantage
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Used for: Energy (Oil, Gas) & Agricultural commodities
                </p>
                <p className="text-xs text-gray-500">
                  Status: {apiConfig?.alphaVantage?.key || 'Not configured'}
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  {apiConfig?.metalsApi?.configured ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  Metals-API
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Used for: Precious & Industrial metals
                </p>
                <p className="text-xs text-gray-500">
                  Status: {apiConfig?.metalsApi?.key || 'Not configured'}
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  {newsApiConfig?.configured ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  Guardian API
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Used for: Real-time tariff & trade news
                </p>
                <p className="text-xs text-gray-500">
                  Status: {newsApiConfig?.key || 'Not configured'}
                </p>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Setup Instructions</h3>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Without API keys, the application will fall back to simulated data.</strong>
                <br />
                To get real commodity prices, please configure the API keys below.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">1. AlphaVantage API Setup</h4>
                <ul className="text-sm text-gray-600 space-y-1 mb-3">
                  <li>• Visit <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                    AlphaVantage API <ExternalLink className="h-3 w-3 ml-1" />
                  </a></li>
                  <li>• Get your free API key</li>
                  <li>• Add <code className="bg-gray-200 px-1 rounded">VITE_ALPHAVANTAGE_API_KEY=your_key</code> to your .env file</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">2. Metals-API Setup</h4>
                <ul className="text-sm text-gray-600 space-y-1 mb-3">
                  <li>• Visit <a href="https://metals-api.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                    Metals-API <ExternalLink className="h-3 w-3 ml-1" />
                  </a></li>
                  <li>• Sign up for an API key</li>
                  <li>• Add <code className="bg-gray-200 px-1 rounded">VITE_METALS_API_KEY=your_key</code> to your .env file</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">3. Guardian API Setup</h4>
                <ul className="text-sm text-gray-600 space-y-1 mb-3">
                  <li>• Visit <a href="https://open-platform.theguardian.com/access/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">
                    Guardian Open Platform <ExternalLink className="h-3 w-3 ml-1" />
                  </a></li>
                  <li>• Sign up for a free API key (completely free, no restrictions)</li>
                  <li>• Add <code className="bg-gray-200 px-1 rounded">VITE_GUARDIAN_API_KEY=your_key</code> to your .env file</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">4. Environment File Setup</h4>
                <p className="text-sm text-yellow-800 mb-2">
                  Create a <code className="bg-yellow-200 px-1 rounded">.env</code> file in your project root with:
                </p>
                <pre className="text-xs bg-yellow-100 p-2 rounded border text-yellow-900">
{`VITE_ALPHAVANTAGE_API_KEY=your_alphavantage_key_here
VITE_METALS_API_KEY=your_metals_api_key_here
VITE_GUARDIAN_API_KEY=your_guardian_api_key_here`}
                </pre>
                <p className="text-xs text-yellow-700 mt-2">
                  After adding the keys, restart the development server.
                </p>
              </div>
            </div>
          </div>

          {/* Supported Commodities */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">API Coverage</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">AlphaVantage Coverage</h4>
                <p className="text-sm text-gray-600 mb-2">Energy & Agricultural:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Crude Oil (WTI)</li>
                  <li>• Natural Gas</li>
                  <li>• Heating Oil</li>
                  <li>• Wheat, Corn, Soybeans</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Metals-API Coverage</h4>
                <p className="text-sm text-gray-600 mb-2">Metals & Precious Metals:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Gold, Silver, Platinum, Palladium</li>
                  <li>• LME Copper, Aluminum, Nickel</li>
                  <li>• LME Zinc, Lead, Tin</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">NewsAPI Coverage</h4>
                <p className="text-sm text-gray-600 mb-2">News & Analysis:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Tariff & Trade News</li>
                  <li>• US/Canada Relations</li>
                  <li>• Customs & Import Duties</li>
                  <li>• Trade War Updates</li>
                </ul>
              </div>
            </div>
            
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Note:</strong> Some commodities (like Steel and PVC) don't have direct API coverage and will use simulated data.
                Industrial metals prices from APIs are used as reference points for related materials.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiConfiguration; 