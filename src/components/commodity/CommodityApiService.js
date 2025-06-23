// Commodity API Service for fetching real-time prices from AlphaVantage and Metals API
import { getCommodityById } from './CommodityDatabase';
import priceHistoryService from './PriceHistoryService';

// API configuration
const ALPHAVANTAGE_API_KEY = import.meta.env.VITE_ALPHAVANTAGE_API_KEY || 'demo';
const METALS_API_KEY = import.meta.env.VITE_METALS_API_KEY || 'demo';

// Base URLs
const ALPHAVANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
const METALS_API_BASE_URL = 'https://metals-api.com/api';

// Commodity symbol mappings for different APIs
const ALPHAVANTAGE_SYMBOLS = {
  crude_oil: 'WTI',
  natural_gas: 'NATURAL_GAS',
  heating_oil: 'HEATING_OIL',
  wheat: 'WHEAT',
  corn: 'CORN',
  soybeans: 'SOYBEANS'
};

const METALS_API_SYMBOLS = {
  gold: 'XAU',
  silver: 'XAG',
  platinum: 'XPT',
  palladium: 'XPD',  // Added palladium
  // Industrial metals using LME (London Metal Exchange) symbols for better accuracy
  copper: 'LME-XCU',
  aluminum: 'LME-ALU',
  nickel: 'LME-NI',
  zinc: 'LME-ZNC',
  lead: 'LME-LEAD',
  tin: 'LME-TIN'
};

// Fetch data from AlphaVantage API
const fetchFromAlphaVantage = async (symbol) => {
  try {
    const response = await fetch(
      `${ALPHAVANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHAVANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`AlphaVantage API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Debug: Log the full response to see what we're getting
    console.log('AlphaVantage API Response:', data);
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data['Note']) {
      console.warn('AlphaVantage API rate limit:', data['Note']);
      return null;
    }
    
    const quote = data['Global Quote'];
    if (!quote) {
      console.warn('Available fields in AlphaVantage response:', Object.keys(data));
      throw new Error('No quote data available');
    }
    
    return {
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      lastUpdated: quote['07. latest trading day']
    };
  } catch (error) {
    console.error(`Error fetching from AlphaVantage for ${symbol}:`, error);
    return null;
  }
};

// Fetch data from Metals API (metals-api.com)
const fetchFromMetalsApi = async (symbol) => {
  try {
          // Metals-API endpoint format
      const response = await fetch(
        `${METALS_API_BASE_URL}/latest?access_key=${METALS_API_KEY}&symbols=${symbol}`
      );
    
    if (!response.ok) {
      throw new Error(`Metals API HTTP error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check for API error response
    if (data.success === false) {
      throw new Error(data.error?.info || data.error?.message || 'Metals API error');
    }
    console.log(data);
    
    // Metals-API returns rates in format: { rates: { symbol: price } }
    // The price is typically in USD per ounce
          const rawRate = data.rates?.[`USD${symbol}`];
    if (!rawRate) {
      console.warn(`Available rates for debugging:`, Object.keys(data.rates || {}));
      throw new Error(`No price data available for ${symbol}. Available symbols: ${Object.keys(data.rates || {}).join(', ')}`);
    }

    console.log(`Raw rate for ${symbol}:`, rawRate);
    
    // Apply commodity-specific conversions based on expected units
    // Metals-API typically returns rates where 1 USD = X units of commodity
    let convertedPrice = rawRate;
    
    // Hard-coded conversions for each commodity based on their expected units
    switch (symbol) {
      // Industrial metals - LME symbols
      case 'LME-ALU': // Aluminum -> USD/ton (expected ~2,453)
        convertedPrice = rawRate * 32150;
        break;
      case 'LME-XCU': // Copper -> USD/lb (expected ~4.81)
        convertedPrice = rawRate * 14.583;
        break;
      case 'LME-NI': // Nickel -> USD/ton (expected ~16,850)
        convertedPrice = rawRate * 32150;
        break;
      case 'LME-ZNC': // Zinc -> USD/ton (expected ~2,891)
        convertedPrice = rawRate * 32150;
        break;
      case 'LME-LEAD': // Lead -> USD/ton (expected ~2,156)
        convertedPrice = rawRate * 32150;
        break;
      case 'LME-TIN': // Tin -> USD/ton (expected ~29,450)
        convertedPrice = rawRate * 32150;
        break;
      
      // Precious metals - standard symbols, reciprocal conversion
      case 'XAU': // Gold -> USD/oz (expected ~2,045)
        convertedPrice = rawRate;
        break;
      case 'XAG': // Silver -> USD/oz (expected ~24.85)
        convertedPrice = rawRate;
        break;
      case 'XPT': // Platinum -> USD/oz (expected ~1,025)
        convertedPrice = rawRate;
        break;
      case 'XPD': // Palladium -> USD/oz (expected ~1,845)
        convertedPrice = rawRate;
        break;
      
      default:
        // Fallback: assume reciprocal for unknown symbols
        convertedPrice = rawRate;
        console.warn(`Unknown symbol ${symbol}, using reciprocal conversion`);
    }
    
    console.log(`Converted price for ${symbol}:`, convertedPrice);

    return {
      price: convertedPrice,
      change: 0, // Metals-API doesn't provide change data in basic plan
      changePercent: 0,
      lastUpdated: data.timestamp || new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching from Metals API for ${symbol}:`, error);
    return null;
  }
};

// Fetch commodity-specific data with fallback logic
const fetchCommodityPrice = async (commodityId) => {
  const commodity = getCommodityById(commodityId);
  if (!commodity) {
    return null;
  }

  let apiData = null;

  // Try different APIs based on commodity type
  if (METALS_API_SYMBOLS[commodityId]) {
    // Try Metals API first for metals (precious metals are more likely to be supported)
    console.log(`Trying Metals-API for ${commodityId} with symbol ${METALS_API_SYMBOLS[commodityId]}`);
    apiData = await fetchFromMetalsApi(METALS_API_SYMBOLS[commodityId]);
  }
  
  if (!apiData && ALPHAVANTAGE_SYMBOLS[commodityId]) {
    // Try AlphaVantage for energy and agricultural commodities
    console.log(`Trying AlphaVantage for ${commodityId} with symbol ${ALPHAVANTAGE_SYMBOLS[commodityId]}`);
    apiData = await fetchFromAlphaVantage(ALPHAVANTAGE_SYMBOLS[commodityId]);
  }

  // If API data is available, use it; otherwise fall back to simulated data
  if (apiData) {
    // Calculate change percentage using price history
    const changePercent = priceHistoryService.updatePrice(commodityId, apiData.price);
    
    return {
      ...commodity,
      price: apiData.price,
      change: changePercent,
      trend: changePercent > 0 ? 'up' : 'down',
      lastUpdated: apiData.lastUpdated || new Date().toISOString(),
      source: 'api'
    };
  } else {
    // Fallback to simulated data with realistic price variations
    const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
    const simulatedPrice = parseFloat((commodity.basePrice * (1 + variation)).toFixed(commodity.unit.includes('USD/lb') ? 4 : 2));
    
    // Calculate change percentage using price history for simulated data too
    const changePercent = priceHistoryService.updatePrice(commodityId, simulatedPrice);
    
    return {
      ...commodity,
      price: simulatedPrice,
      change: changePercent,
      trend: changePercent > 0 ? 'up' : 'down',
      lastUpdated: new Date().toISOString(),
      source: 'simulated'
    };
  }
};

// Main function to fetch all commodity data
export const fetchRealCommodityData = async (trackedCommodityIds) => {
  try {
    console.log('Fetching commodity data for:', trackedCommodityIds);
    
    // Fetch data for all tracked commodities in parallel
    const promises = trackedCommodityIds.map(id => fetchCommodityPrice(id));
    const results = await Promise.all(promises);
    
    // Filter out null results
    const validResults = results.filter(result => result !== null);
    
    console.log(`Successfully fetched ${validResults.length} commodity prices`);
    const apiSources = validResults.filter(r => r.source === 'api').length;
    const simulatedSources = validResults.filter(r => r.source === 'simulated').length;
    console.log(`API sources: ${apiSources}, Simulated sources: ${simulatedSources}`);
    
    return validResults;
  } catch (error) {
    console.error('Error fetching commodity data:', error);
    return [];
  }
};

// Check API configuration
export const checkApiConfiguration = () => {
  const config = {
    alphaVantage: {
      configured: ALPHAVANTAGE_API_KEY !== 'demo',
      key: ALPHAVANTAGE_API_KEY === 'demo' ? 'Using demo key' : 'API key configured'
    },
    metalsApi: {
      configured: METALS_API_KEY !== 'demo',
      key: METALS_API_KEY === 'demo' ? 'Using demo key' : 'API key configured'
    }
  };
  
  console.log('API Configuration:', config);
  return config;
};

// Test API connections
export const testApiConnections = async () => {
  console.log('Testing API connections...');
  
  const tests = {
    alphaVantage: false,
    metalsApi: false
  };
  
  // Test AlphaVantage with a simple stock query (AAPL)
  try {
    const avTest = await fetchFromAlphaVantage('AAPL');
    tests.alphaVantage = avTest !== null;
  } catch (error) {
    console.error('AlphaVantage test failed:', error);
  }
  
  // Test Metals API with gold
  try {
    const metalsTest = await fetchFromMetalsApi('XAU');
    tests.metalsApi = metalsTest !== null;
  } catch (error) {
    console.error('Metals-API test failed:', error);
  }
  
  console.log('API Test Results:', tests);
  return tests;
};

export default {
  fetchRealCommodityData,
  checkApiConfiguration,
  testApiConnections
}; 