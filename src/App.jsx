import { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  DollarSign,
  Package,
  Scale,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  AlertCircle,
  Calendar,
  Plus
} from 'lucide-react';

// Import new components
import CommodityCard from './components/commodity/CommodityCard';
import CommoditySearch from './components/commodity/CommoditySearch';
import CommodityManager from './components/commodity/CommodityManager';
import ApiConfiguration from './components/commodity/ApiConfiguration';
import TariffManager from './components/tariff/TariffManager';
import NewsHeadlines from './components/news/NewsHeadlines';
import ReportGenerator from './components/reports/ReportGenerator';
import { COMMODITY_DATABASE } from './components/commodity/CommodityDatabase';
import { TARIFF_DATABASE, getTariffByHSCode, formatTariffRate, getCountryFlag, getCountryName } from './data/TariffDatabase';
import { fetchTariffNews, checkNewsApiConfiguration, testNewsApiConnection } from './components/news/NewsService';
import { fetchRealCommodityData, checkApiConfiguration, testApiConnections } from './components/commodity/CommodityApiService';
import priceHistoryService from './components/commodity/PriceHistoryService';

// Default tracked tariff codes
const defaultTrackedTariffCodes = ['7326.90.8688', '8481.80.10.50', '3917.23.00'];

function App() {
  // Default tracked commodities
  const defaultCommodityIds = ['gold', 'copper', 'aluminum', 'zinc'];
  
  const [trackedCommodityIds, setTrackedCommodityIds] = useState(defaultCommodityIds);
  const [commodities, setCommodities] = useState([]);
  const [trackedTariffCodes, setTrackedTariffCodes] = useState(defaultTrackedTariffCodes);
  const [trackedTariffs, setTrackedTariffs] = useState([]);
  const [news, setNews] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({ alphaVantage: false, metalsApi: false, newsApi: false });
  const [apiConfig, setApiConfig] = useState(null);
  const [newsApiConfig, setNewsApiConfig] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [commodityData, newsData] = await Promise.all([
        fetchRealCommodityData(trackedCommodityIds),
        fetchTariffNews()
      ]);
      setCommodities(commodityData);
      setNews(newsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [trackedCommodityIds]);

  // Initialize API configuration and test connections on mount
  useEffect(() => {
    const initializeApis = async () => {
      // Check API configuration
      const config = checkApiConfiguration();
      const newsConfig = checkNewsApiConfiguration();
      setApiConfig(config);
      setNewsApiConfig(newsConfig);
      
      // Test API connections
      try {
        const [commodityStatus, newsStatus] = await Promise.all([
          testApiConnections(),
          testNewsApiConnection()
        ]);
        setApiStatus({
          ...commodityStatus,
          newsApi: newsStatus
        });
      } catch (error) {
        console.error('Error testing API connections:', error);
      }
    };
    
    initializeApis();
  }, []);

  // Load tracked tariffs when tariff codes change
  useEffect(() => {
    const loadedTariffs = trackedTariffCodes.map(code => getTariffByHSCode(code)).filter(Boolean);
    setTrackedTariffs(loadedTariffs);
  }, [trackedTariffCodes]);

  // Fetch commodity data when tracked commodities change
  useEffect(() => {
    if (trackedCommodityIds.length > 0) {
      const fetchCommodityData = async () => {
        setLoading(true);
        try {
          const commodityData = await fetchRealCommodityData(trackedCommodityIds);
          setCommodities(commodityData);
          setLastUpdated(new Date());
        } catch (error) {
          console.error('Error fetching commodity data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCommodityData();
    }
  }, [trackedCommodityIds]);

  // Fetch news data initially and when needed
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const newsData = await fetchTariffNews();
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    };
    
    fetchNewsData();
  }, []);

  // Commodity management functions
  const handleAddCommodity = (commodity) => {
    if (!trackedCommodityIds.includes(commodity.id) && trackedCommodityIds.length < 12) {
      setTrackedCommodityIds(prev => [...prev, commodity.id]);
    }
  };

  const handleRemoveCommodity = (commodityId) => {
    if (trackedCommodityIds.length > 1) { // Keep at least one commodity
      setTrackedCommodityIds(prev => prev.filter(id => id !== commodityId));
      // Clear price history for removed commodity
      priceHistoryService.clearHistory(commodityId);
    }
  };

  const handleResetToDefault = () => {
    setTrackedCommodityIds(defaultCommodityIds);
    // Clear all price history when resetting
    priceHistoryService.clearAllHistory();
  };

  // Tariff management functions
  const handleAddTariff = (tariff) => {
    if (!trackedTariffCodes.includes(tariff.hsCode) && trackedTariffCodes.length < 10) {
      setTrackedTariffCodes(prev => [...prev, tariff.hsCode]);
    }
  };

  const handleRemoveTariff = (hsCode) => {
    if (trackedTariffCodes.length > 1) {
      setTrackedTariffCodes(prev => prev.filter(code => code !== hsCode));
    }
  };

  const handleResetTariffsToDefault = () => {
    setTrackedTariffCodes(defaultTrackedTariffCodes);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  CommodityTracker Pro
                </h1>
                <p className="text-sm text-gray-600 font-medium">Global Commodities & Tariffs Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {/* API Status Indicator */}
              <div className="text-right">
                <p className="text-sm text-gray-500 flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  API Status
                </p>
                <div className="flex items-center space-x-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${apiStatus.alphaVantage ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={apiStatus.alphaVantage ? 'text-green-600' : 'text-red-600'}>
                    AlphaVantage
                  </span>
                  <div className={`w-2 h-2 rounded-full ${apiStatus.metalsApi ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={apiStatus.metalsApi ? 'text-green-600' : 'text-red-600'}>
                    MetalPriceAPI
                  </span>
                  <div className={`w-2 h-2 rounded-full ${apiStatus.newsApi ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={apiStatus.newsApi ? 'text-green-600' : 'text-red-600'}>
                    NewsAPI
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Last updated
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {lastUpdated.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={fetchData}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                <span className="font-semibold">Refresh Data</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Commodities</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{commodities.length}</p>
                <p className="text-sm text-gray-500 mt-1">Tracked materials</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Tracked Tariffs</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{trackedTariffs.length}</p>
                <p className="text-sm text-gray-500 mt-1">HS codes monitored</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl">
                <Scale className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Market Status</p>
                <p className="text-4xl font-bold text-green-600 mt-2">Live</p>
                <p className="text-sm text-gray-500 mt-1">Real-time tracking</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl">
                <Globe className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Commodity Prices */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Live Commodity Prices
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <CommodityManager
                commodities={commodities}
                onAddCommodity={handleAddCommodity}
                onRemoveCommodity={handleRemoveCommodity}
                onResetToDefault={handleResetToDefault}
              />
              <CommoditySearch 
                onAddCommodity={handleAddCommodity}
                currentCommodities={commodities}
              />
              <ApiConfiguration
                apiConfig={apiConfig}
                apiStatus={apiStatus}
                newsApiConfig={newsApiConfig}
              />
              <ReportGenerator
                commodities={commodities}
                news={news}
                tariffs={trackedTariffs}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {commodities.map((commodity) => (
              <CommodityCard
                key={commodity.id}
                commodity={commodity}
                onRemove={handleRemoveCommodity}
                canRemove={commodities.length > 1}
              />
            ))}
          </div>
        </div>

        {/* News Headlines Section */}
        <div className="mb-10">
          <NewsHeadlines />
        </div>

        {/* Tracked Tariff Codes */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Tracked Tariff Codes
              </h2>
            </div>
            <TariffManager
              onAddTariff={handleAddTariff}
              trackedTariffs={trackedTariffs}
              onRemoveTariff={handleRemoveTariff}
            />
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      HS Code
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      US Rate
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      EU Rate
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      CN Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trackedTariffs.map((tariff) => (
                    <tr key={tariff.hsCode} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-bold text-blue-600">{tariff.hsCode}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-medium text-gray-900 max-w-xs">
                          {tariff.description}
                        </div>
                        {tariff.notes && (
                          <div className="text-xs text-gray-500 mt-1">{tariff.notes}</div>
                        )}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {tariff.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCountryFlag('US')}</span>
                          <span className={`text-lg font-bold ${
                            tariff.currentRates.US.rate > 10 ? 'text-red-600' : 
                            tariff.currentRates.US.rate > 0 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {formatTariffRate(tariff.currentRates.US.rate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCountryFlag('EU')}</span>
                          <span className={`text-lg font-bold ${
                            tariff.currentRates.EU.rate > 10 ? 'text-red-600' : 
                            tariff.currentRates.EU.rate > 0 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {formatTariffRate(tariff.currentRates.EU.rate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getCountryFlag('CN')}</span>
                          <span className={`text-lg font-bold ${
                            tariff.currentRates.CN.rate > 10 ? 'text-red-600' : 
                            tariff.currentRates.CN.rate > 0 ? 'text-orange-600' : 'text-green-600'
                          }`}>
                            {formatTariffRate(tariff.currentRates.CN.rate)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {trackedTariffs.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tariff Codes Tracked</h3>
                <p className="text-gray-500 mb-4">Start tracking tariff codes to monitor rates and changes.</p>
                <TariffManager
                  onAddTariff={handleAddTariff}
                  trackedTariffs={trackedTariffs}
                  onRemoveTariff={handleRemoveTariff}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 font-medium">
              © 2025 CommodityTracker Pro - Professional Intelligence for Canadian PVF Manufacturers
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Real-time commodity tracking • Tariff monitoring • Market intelligence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

