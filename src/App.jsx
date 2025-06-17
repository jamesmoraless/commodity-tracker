import { useState, useEffect } from 'react';
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
import NewsHeadlines from './components/news/NewsHeadlines';
import ReportGenerator from './components/reports/ReportGenerator';
import { COMMODITY_DATABASE, getCommodityById } from './components/commodity/CommodityDatabase';
import { fetchTariffNews } from './components/news/NewsService';

// Enhanced data fetching function that works with dynamic commodities
const fetchRealCommodityData = async (trackedCommodityIds) => {
  try {
    const currentTime = new Date();
    
    // Get base data for tracked commodities
    const baseData = trackedCommodityIds.map(id => getCommodityById(id)).filter(Boolean);

    // Add small realistic variations to simulate market movement
    return baseData.map(commodity => {
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const priceVariation = commodity.basePrice * variation;
      const changeVariation = (Math.random() - 0.5) * 0.5; // ±0.25% change variation
      
      return {
        ...commodity,
        price: parseFloat((commodity.basePrice + priceVariation).toFixed(commodity.unit.includes('USD/lb') ? 4 : 2)),
        change: parseFloat((commodity.baseChange + changeVariation).toFixed(2)),
        trend: (commodity.baseChange + changeVariation) > 0 ? 'up' : 'down',
        lastUpdated: currentTime.toISOString()
      };
    });
  } catch (error) {
    console.error('Error fetching commodity data:', error);
    return [];
  }
};

// Tariff data
const tariffData = [
  {
    country: 'United States',
    product: 'Steel Pipes',
    rate: '25%',
    change: 'increase',
    effectiveDate: 'Mar 13, 2025',
    flag: '🇺🇸'
  },
  {
    country: 'China',
    product: 'PVC Fittings',
    rate: '10%',
    change: 'increase',
    effectiveDate: 'Feb 1, 2025',
    flag: '🇨🇳'
  },
  {
    country: 'European Union',
    product: 'Copper Tubes',
    rate: '5%',
    change: 'decrease',
    effectiveDate: 'Jan 15, 2025',
    flag: '🇪🇺'
  }
];

function App() {
  // Default tracked commodities
  const defaultCommodityIds = ['steel', 'copper', 'aluminum', 'pvc'];
  
  const [trackedCommodityIds, setTrackedCommodityIds] = useState(defaultCommodityIds);
  const [commodities, setCommodities] = useState([]);
  const [tariffs] = useState(tariffData);
  const [news, setNews] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Separate effect for when tracked commodities change
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

  // Commodity management functions
  const handleAddCommodity = (commodity) => {
    if (!trackedCommodityIds.includes(commodity.id) && trackedCommodityIds.length < 12) {
      setTrackedCommodityIds(prev => [...prev, commodity.id]);
    }
  };

  const handleRemoveCommodity = (commodityId) => {
    if (trackedCommodityIds.length > 1) { // Keep at least one commodity
      setTrackedCommodityIds(prev => prev.filter(id => id !== commodityId));
    }
  };

  const handleResetToDefault = () => {
    setTrackedCommodityIds(defaultCommodityIds);
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
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Tariffs</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{tariffs.length}</p>
                <p className="text-sm text-gray-500 mt-1">Recent changes</p>
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
              <ReportGenerator
                commodities={commodities}
                news={news}
                tariffs={tariffs}
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

        {/* Recent Tariff Changes */}
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Recent Tariff Changes
            </h2>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Rate
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Effective Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tariffs.map((tariff, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{tariff.flag}</span>
                          <span className="text-sm font-semibold text-gray-900">{tariff.country}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-700">
                        {tariff.product}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-lg font-bold text-gray-900">
                        {tariff.rate}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${
                          tariff.change === 'increase' 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : 'bg-green-100 text-green-800 border border-green-200'
                        }`}>
                          {tariff.change === 'increase' ? '↗ Increase' : '↘ Decrease'}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-600">
                        {tariff.effectiveDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

