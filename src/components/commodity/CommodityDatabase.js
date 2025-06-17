// Extended commodity database with more materials
export const COMMODITY_DATABASE = [
  // Current commodities (metals)
  {
    id: 'steel',
    name: 'Steel',
    category: 'metals',
    basePrice: 2949.00,
    unit: 'CNY/ton',
    baseChange: 0.31,
    color: 'from-slate-500 to-slate-700',
    description: 'Hot-rolled steel coil',
    exchange: 'Shanghai Futures Exchange'
  },
  {
    id: 'copper',
    name: 'Copper',
    category: 'metals',
    basePrice: 4.8129,
    unit: 'USD/lb',
    baseChange: -1.82,
    color: 'from-orange-500 to-red-600',
    description: 'High-grade copper cathode',
    exchange: 'London Metal Exchange'
  },
  {
    id: 'aluminum',
    name: 'Aluminum',
    category: 'metals',
    basePrice: 2453.40,
    unit: 'USD/ton',
    baseChange: -1.04,
    color: 'from-gray-400 to-gray-600',
    description: 'Primary aluminum ingot',
    exchange: 'London Metal Exchange'
  },
  {
    id: 'pvc',
    name: 'PVC',
    category: 'plastics',
    basePrice: 4687.00,
    unit: 'CNY/ton',
    baseChange: 0.13,
    color: 'from-blue-500 to-blue-700',
    description: 'Polyvinyl chloride resin',
    exchange: 'Dalian Commodity Exchange'
  },
  
  // Additional metals
  {
    id: 'nickel',
    name: 'Nickel',
    category: 'metals',
    basePrice: 16850.00,
    unit: 'USD/ton',
    baseChange: 2.15,
    color: 'from-green-500 to-green-700',
    description: 'Primary nickel',
    exchange: 'London Metal Exchange'
  },
  {
    id: 'zinc',
    name: 'Zinc',
    category: 'metals',
    basePrice: 2890.50,
    unit: 'USD/ton',
    baseChange: -0.85,
    color: 'from-indigo-500 to-indigo-700',
    description: 'Special high-grade zinc',
    exchange: 'London Metal Exchange'
  },
  {
    id: 'lead',
    name: 'Lead',
    category: 'metals',
    basePrice: 2156.00,
    unit: 'USD/ton',
    baseChange: 1.25,
    color: 'from-gray-600 to-gray-800',
    description: 'Refined lead',
    exchange: 'London Metal Exchange'
  },
  {
    id: 'tin',
    name: 'Tin',
    category: 'metals',
    basePrice: 29450.00,
    unit: 'USD/ton',
    baseChange: -1.45,
    color: 'from-yellow-600 to-orange-600',
    description: 'High-grade tin',
    exchange: 'London Metal Exchange'
  },
  
  // Energy commodities
  {
    id: 'crude_oil',
    name: 'Crude Oil',
    category: 'energy',
    basePrice: 78.45,
    unit: 'USD/barrel',
    baseChange: 2.34,
    color: 'from-black to-gray-700',
    description: 'WTI Crude Oil',
    exchange: 'NYMEX'
  },
  {
    id: 'natural_gas',
    name: 'Natural Gas',
    category: 'energy',
    basePrice: 2.85,
    unit: 'USD/MMBtu',
    baseChange: -3.21,
    color: 'from-blue-600 to-blue-800',
    description: 'Henry Hub Natural Gas',
    exchange: 'NYMEX'
  },
  {
    id: 'heating_oil',
    name: 'Heating Oil',
    category: 'energy',
    basePrice: 2.45,
    unit: 'USD/gallon',
    baseChange: 1.87,
    color: 'from-red-600 to-red-800',
    description: 'No. 2 Heating Oil',
    exchange: 'NYMEX'
  },
  
  // Agricultural commodities
  {
    id: 'wheat',
    name: 'Wheat',
    category: 'agriculture',
    basePrice: 6.25,
    unit: 'USD/bushel',
    baseChange: -0.95,
    color: 'from-yellow-500 to-yellow-700',
    description: 'Hard Red Winter Wheat',
    exchange: 'CBOT'
  },
  {
    id: 'corn',
    name: 'Corn',
    category: 'agriculture',
    basePrice: 4.85,
    unit: 'USD/bushel',
    baseChange: 1.45,
    color: 'from-yellow-400 to-yellow-600',
    description: 'No. 2 Yellow Corn',
    exchange: 'CBOT'
  },
  {
    id: 'soybeans',
    name: 'Soybeans',
    category: 'agriculture',
    basePrice: 12.75,
    unit: 'USD/bushel',
    baseChange: -2.15,
    color: 'from-green-600 to-green-800',
    description: 'No. 1 Yellow Soybeans',
    exchange: 'CBOT'
  },
  
  // Precious metals
  {
    id: 'gold',
    name: 'Gold',
    category: 'precious_metals',
    basePrice: 2045.50,
    unit: 'USD/oz',
    baseChange: 0.75,
    color: 'from-yellow-400 to-yellow-600',
    description: '100 oz Gold Bar',
    exchange: 'COMEX'
  },
  {
    id: 'silver',
    name: 'Silver',
    category: 'precious_metals',
    basePrice: 24.85,
    unit: 'USD/oz',
    baseChange: -1.25,
    color: 'from-gray-300 to-gray-500',
    description: '5000 oz Silver Bar',
    exchange: 'COMEX'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    category: 'precious_metals',
    basePrice: 1025.00,
    unit: 'USD/oz',
    baseChange: 2.85,
    color: 'from-gray-400 to-gray-600',
    description: '50 oz Platinum Bar',
    exchange: 'NYMEX'
  }
];

// Categories for filtering
export const COMMODITY_CATEGORIES = {
  metals: 'Industrial Metals',
  energy: 'Energy',
  agriculture: 'Agriculture',
  precious_metals: 'Precious Metals',
  plastics: 'Plastics & Polymers'
};

// Function to get commodities by category
export const getCommoditiesByCategory = (category) => {
  return COMMODITY_DATABASE.filter(commodity => commodity.category === category);
};

// Function to search commodities
export const searchCommodities = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return COMMODITY_DATABASE.filter(commodity => 
    commodity.name.toLowerCase().includes(lowercaseQuery) ||
    commodity.description.toLowerCase().includes(lowercaseQuery) ||
    commodity.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Function to get commodity by ID
export const getCommodityById = (id) => {
  return COMMODITY_DATABASE.find(commodity => commodity.id === id);
};

