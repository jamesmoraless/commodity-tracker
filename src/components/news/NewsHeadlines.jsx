import React, { useState, useEffect } from 'react';
import { Newspaper, RefreshCw, Filter, Flag } from 'lucide-react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import NewsItem from './NewsItem';
import { fetchTariffNews, getNewsByCountry, getNewsByCategory } from './NewsService';

const NewsHeadlines = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countryFilter, setCountryFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchNews = async () => {
    setLoading(true);
    try {
      const newsData = await fetchTariffNews();
      setNews(newsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    let filtered = news;

    // Filter by country
    if (countryFilter !== 'all') {
      filtered = getNewsByCountry(filtered, countryFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = getNewsByCategory(filtered, categoryFilter);
    }

    // Sort by published date (newest first)
    filtered = filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    setFilteredNews(filtered);
  }, [news, countryFilter, categoryFilter]);

  const getCountryStats = () => {
    const usNews = getNewsByCountry(news, 'US').length;
    const caNews = getNewsByCountry(news, 'CA').length;
    return { us: usNews, ca: caNews };
  };

  const getCategoryStats = () => {
    const tariffNews = getNewsByCategory(news, 'tariff').length;
    const tradeNews = getNewsByCategory(news, 'trade').length;
    const policyNews = getNewsByCategory(news, 'policy').length;
    return { tariff: tariffNews, trade: tradeNews, policy: policyNews };
  };

  const stats = getCountryStats();
  const categoryStats = getCategoryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-2 rounded-lg">
            <Newspaper className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Tariff & Trade News
            </h2>
            <p className="text-sm text-gray-600">US & Canada Trade Intelligence</p>
          </div>
        </div>
        <Button
          onClick={fetchNews}
          disabled={loading}
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh News
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🇺🇸</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.us}</p>
              <p className="text-xs text-gray-600">US News</p>
            </div>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🇨🇦</span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.ca}</p>
              <p className="text-xs text-gray-600">Canada News</p>
            </div>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{categoryStats.tariff}</p>
            <p className="text-xs text-gray-600">Tariffs</p>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{categoryStats.trade}</p>
            <p className="text-xs text-gray-600">Trade</p>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{categoryStats.policy}</p>
            <p className="text-xs text-gray-600">Policy</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-32 bg-white border-gray-300">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-lg">
              <SelectItem value="all" className="hover:bg-gray-100">All Countries</SelectItem>
              <SelectItem value="US" className="hover:bg-gray-100">🇺🇸 United States</SelectItem>
              <SelectItem value="CA" className="hover:bg-gray-100">🇨🇦 Canada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32 bg-white border-gray-300">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-lg">
              <SelectItem value="all" className="hover:bg-gray-100">All Categories</SelectItem>
              <SelectItem value="tariff" className="hover:bg-gray-100">Tariffs</SelectItem>
              <SelectItem value="trade" className="hover:bg-gray-100">Trade</SelectItem>
              <SelectItem value="policy" className="hover:bg-gray-100">Policy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20">
          <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No news found</h3>
          <p className="text-gray-600">
            {loading ? 'Loading latest news...' : 'Try adjusting your filters or refresh the news feed.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((newsItem) => (
            <NewsItem
              key={newsItem.id}
              news={newsItem}
              onClick={(news) => {
                // Optional: Handle news item click for detailed view
                console.log('News clicked:', news);
              }}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredNews.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          Showing {filteredNews.length} of {news.length} news articles
        </div>
      )}
    </div>
  );
};

export default NewsHeadlines;

