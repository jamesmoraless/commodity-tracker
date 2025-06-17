import React, { useState } from 'react';
import { FileText, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { downloadPDFReport } from './ReportService';

const ReportGenerator = ({ commodities, news, tariffs }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const fileName = await downloadPDFReport(commodities, news, tariffs);
      setLastGenerated({
        fileName,
        timestamp: new Date(),
        commodityCount: commodities.length,
        newsCount: news.length,
        tariffCount: tariffs.length
      });
    } catch (err) {
      setError('Failed to generate report. Please try again.');
      console.error('Report generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/80 backdrop-blur-sm hover:bg-blue-50"
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white border border-gray-300 shadow-2xl">
        <DialogHeader className="bg-white border-b border-gray-200 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Generate PDF Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 bg-white p-6">
          {/* Report Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Report Contents</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{commodities.length}</div>
                <div className="text-blue-800">Commodities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{news.length}</div>
                <div className="text-blue-800">News Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{tariffs.length}</div>
                <div className="text-blue-800">Tariff Changes</div>
              </div>
            </div>
          </div>

          {/* Report Sections */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Report Sections</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Executive Summary</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Commodity Prices Overview</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Recent Tariff Changes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Trade News Headlines</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Market Analysis</span>
              </div>
            </div>
          </div>

          {/* Last Generated Info */}
          {lastGenerated && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Last Report Generated</h3>
              </div>
              <div className="text-sm text-green-800">
                <p><strong>File:</strong> {lastGenerated.fileName}</p>
                <p><strong>Generated:</strong> {formatTimestamp(lastGenerated.timestamp)}</p>
                <p><strong>Data:</strong> {lastGenerated.commodityCount} commodities, {lastGenerated.newsCount} news items, {lastGenerated.tariffCount} tariffs</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Generate & Download PDF
                </>
              )}
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-500 text-center">
            <p>The report will be automatically downloaded to your device once generated.</p>
            <p>Report includes current market data and may take a few seconds to generate.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportGenerator;

