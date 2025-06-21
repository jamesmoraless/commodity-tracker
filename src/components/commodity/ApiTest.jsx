import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { checkApiConfiguration, testApiConnections, fetchRealCommodityData } from './CommodityApiService';

const ApiTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sampleData, setSampleData] = useState(null);

  const runApiTest = async () => {
    setIsLoading(true);
    try {
      console.log('Running API tests...');
      
      // Check configuration
      const config = checkApiConfiguration();
      console.log('API Config:', config);
      
      // Test connections
      const connectionTests = await testApiConnections();
      console.log('Connection Tests:', connectionTests);
      
      // Test fetching sample data
      const testCommodities = ['gold', 'copper', 'crude_oil'];
      const sampleResults = await fetchRealCommodityData(testCommodities);
      console.log('Sample Data:', sampleResults);
      
      setTestResults({
        config,
        connections: connectionTests,
        sampleCount: sampleResults.length,
        apiCount: sampleResults.filter(r => r.source === 'api').length,
        simulatedCount: sampleResults.filter(r => r.source === 'simulated').length
      });
      
      setSampleData(sampleResults);
      
    } catch (error) {
      console.error('API Test Error:', error);
      setTestResults({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Run test on component mount
    runApiTest();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">API Integration Test</h2>
      
      <Button 
        onClick={runApiTest} 
        disabled={isLoading}
        className="mb-4"
      >
        {isLoading ? 'Testing...' : 'Run API Test'}
      </Button>

      {testResults && (
        <div className="space-y-4">
          {testResults.error ? (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                Error: {testResults.error}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  <strong>Configuration:</strong><br/>
                  AlphaVantage: {testResults.config.alphaVantage.configured ? '✅ Configured' : '❌ Not configured'}<br/>
                  Metals API: {testResults.config.metalsApi.configured ? '✅ Configured' : '❌ Not configured'}
                </AlertDescription>
              </Alert>

              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  <strong>Connection Tests:</strong><br/>
                  AlphaVantage: {testResults.connections.alphaVantage ? '✅ Connected' : '❌ Failed'}<br/>
                  Metals API: {testResults.connections.metalsApi ? '✅ Connected' : '❌ Failed'}
                </AlertDescription>
              </Alert>

              <Alert className="border-purple-200 bg-purple-50">
                <AlertDescription className="text-purple-800">
                  <strong>Sample Data:</strong><br/>
                  Total commodities: {testResults.sampleCount}<br/>
                  API sources: {testResults.apiCount}<br/>
                  Simulated sources: {testResults.simulatedCount}
                </AlertDescription>
              </Alert>

              {sampleData && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Sample Data Preview:</h3>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(sampleData, null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTest; 