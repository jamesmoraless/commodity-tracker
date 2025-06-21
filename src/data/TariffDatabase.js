// Static tariff database with HS codes and their details
export const TARIFF_DATABASE = {
  '7326.90.8688': {
    hsCode: '7326.90.8688',
    description: 'Other articles of iron or steel, forged',
    category: 'Iron & Steel Products',
    baseRate: 0.0, // 0% base rate
    currentRates: {
      US: { rate: 25.0, effectiveDate: '2024-01-01', status: 'active' },
      CA: { rate: 0.0, effectiveDate: '2024-01-01', status: 'active' },
      EU: { rate: 6.5, effectiveDate: '2024-01-01', status: 'active' },
      CN: { rate: 15.0, effectiveDate: '2024-01-01', status: 'active' }
    },
    unit: 'ad valorem',
    notes: 'Subject to Section 232 steel tariffs'
  },
  '8481.80.10.50': {
    hsCode: '8481.80.10.50',
    description: 'Taps, cocks, valves and similar appliances, of brass',
    category: 'Valves & Fittings',
    baseRate: 0.0,
    currentRates: {
      US: { rate: 0.0, effectiveDate: '2024-01-01', status: 'active' },
      CA: { rate: 0.0, effectiveDate: '2024-01-01', status: 'active' },
      EU: { rate: 2.7, effectiveDate: '2024-01-01', status: 'active' },
      CN: { rate: 12.0, effectiveDate: '2024-01-01', status: 'active' }
    },
    unit: 'ad valorem',
    notes: 'Brass valves and fittings'
  },
  '8481.80.00': {
    hsCode: '8481.80.00',
    description: 'Other appliances for pipes, boiler shells, tanks, vats',
    category: 'Pipe Fittings',
    baseRate: 0.0,
    currentRates: {
      US: { rate: 0.0, effectiveDate: '2024-01-01', status: 'active' },
      CA: { rate: 0.0, effectiveDate: '2024-01-01', status: 'active' },
      EU: { rate: 1.7, effectiveDate: '2024-01-01', status: 'active' },
      CN: { rate: 10.0, effectiveDate: '2024-01-01', status: 'active' }
    },
    unit: 'ad valorem',
    notes: 'General pipe fittings and appliances'
  },
  '7419.80.5010': {
    hsCode: '7419.80.5010',
    description: 'Other articles of copper, cast, molded, stamped or forged',
    category: 'Copper Products',
    baseRate: 0.0,
    currentRates: {
      US: { rate: 0.0, effectiveDate: '2024-01-01', status: 'active' },
      CA: { rate: 0.0, effectiveDate: '2024-01-01', status: 'active' },
      EU: { rate: 4.0, effectiveDate: '2024-01-01', status: 'active' },
      CN: { rate: 8.0, effectiveDate: '2024-01-01', status: 'active' }
    },
    unit: 'ad valorem',
    notes: 'Copper fittings and components'
  },
  '7419.99.50.10': {
    hsCode: '7419.99.50.10',
    description: 'Other articles of copper, other',
    category: 'Copper Products',
    baseRate: 0.0,
    currentRates: {
      US: { rate: 0.0, effectiveDate: '2024-01-01', status: 'active' },
      CA: { rate: 0.0, effectiveDate: '2024-01-01', status: 'active' },
      EU: { rate: 4.0, effectiveDate: '2024-01-01', status: 'active' },
      CN: { rate: 8.0, effectiveDate: '2024-01-01', status: 'active' }
    },
    unit: 'ad valorem',
    notes: 'Miscellaneous copper articles'
  },
  '3926.90.99.90': {
    hsCode: '3926.90.99.90',
    description: 'Other articles of plastics and articles of other materials',
    category: 'Plastic Products',
    baseRate: 0.0,
    currentRates: {
      US: { rate: 5.3, effectiveDate: '2024-01-01', status: 'active' },
      CA: { rate: 0.0, effectiveDate: '2024-01-01', status: 'active' },
      EU: { rate: 6.5, effectiveDate: '2024-01-01', status: 'active' },
      CN: { rate: 15.0, effectiveDate: '2024-01-01', status: 'active' }
    },
    unit: 'ad valorem',
    notes: 'Plastic fittings and components'
  },
  '3917.23.00': {
    hsCode: '3917.23.00',
    description: 'Tubes, pipes and hoses, rigid, of polymers of vinyl chloride',
    category: 'PVC Pipes',
    baseRate: 0.0,
    currentRates: {
      US: { rate: 5.3, effectiveDate: '2024-01-01', status: 'active' },
      CA: { rate: 0.0, effectiveDate: '2024-01-01', status: 'active' },
      EU: { rate: 6.5, effectiveDate: '2024-01-01', status: 'active' },
      CN: { rate: 10.0, effectiveDate: '2024-01-01', status: 'active' }
    },
    unit: 'ad valorem',
    notes: 'PVC pipes and tubing'
  }
};

// Helper functions
export const getTariffByHSCode = (hsCode) => {
  return TARIFF_DATABASE[hsCode] || null;
};

export const getTariffsByCategory = (category) => {
  return Object.values(TARIFF_DATABASE).filter(tariff => 
    tariff.category === category
  );
};

export const searchTariffs = (query) => {
  const lowerQuery = query.toLowerCase();
  return Object.values(TARIFF_DATABASE).filter(tariff =>
    tariff.hsCode.includes(query) ||
    tariff.description.toLowerCase().includes(lowerQuery) ||
    tariff.category.toLowerCase().includes(lowerQuery)
  );
};

// Get all available categories
export const getTariffCategories = () => {
  const categories = new Set();
  Object.values(TARIFF_DATABASE).forEach(tariff => {
    categories.add(tariff.category);
  });
  return Array.from(categories).sort();
};

// Get tariffs by country rate
export const getTariffsByCountryRate = (country, minRate = 0) => {
  return Object.values(TARIFF_DATABASE).filter(tariff => 
    tariff.currentRates[country] && tariff.currentRates[country].rate >= minRate
  );
};

// Format tariff rate for display
export const formatTariffRate = (rate) => {
  return `${rate.toFixed(1)}%`;
};

// Get country flag emoji
export const getCountryFlag = (countryCode) => {
  const flags = {
    US: '🇺🇸',
    CA: '🇨🇦',
    EU: '🇪🇺',
    CN: '🇨🇳'
  };
  return flags[countryCode] || '🌍';
};

// Get country full name
export const getCountryName = (countryCode) => {
  const names = {
    US: 'United States',
    CA: 'Canada',
    EU: 'European Union',
    CN: 'China'
  };
  return names[countryCode] || countryCode;
}; 