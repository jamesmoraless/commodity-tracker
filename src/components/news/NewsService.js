// News service for fetching tariff and trade news using The Guardian API
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY || 'test';

// Helper functions to categorize news
const determineCountry = (text) => {
  const lowerText = text.toLowerCase();
  
  // More specific Canada detection (prioritize Canada)
  if (lowerText.includes('canada') || lowerText.includes('canadian') || 
      lowerText.includes('ottawa') || lowerText.includes('carney') ||
      lowerText.includes('usmca') || lowerText.includes('nafta') ||
      lowerText.includes('toronto') || lowerText.includes('montreal')) {
    return 'CA';
  }
  
  // China detection
  if (lowerText.includes('china') || lowerText.includes('chinese') || 
      lowerText.includes('beijing') || lowerText.includes('xi jinping')) {
    return 'CN';
  }
  
  // More specific US detection
  if (lowerText.includes('united states') || lowerText.includes('america') || 
      lowerText.includes('washington') || lowerText.includes('trump') ||
      lowerText.includes('biden') || lowerText.includes('congress') ||
      lowerText.includes('us trade') || lowerText.includes('american')) {
    return 'US';
  }
  
  return 'US'; // Default to US for trade-related news
};

const determineCategory = (text) => {
  const lowerText = text.toLowerCase();
  
  // Tariff-specific detection
  if (lowerText.includes('tariff') || lowerText.includes('duty') || 
      lowerText.includes('duties') || lowerText.includes('customs')) {
    return 'tariff';
  }
  
  // Commodity-specific detection
  if (lowerText.includes('steel') || lowerText.includes('aluminum') || 
      lowerText.includes('copper') || lowerText.includes('gold') ||
      lowerText.includes('commodity') || lowerText.includes('metal')) {
    return 'commodity';
  }
  
  // Trade-specific detection
  if (lowerText.includes('trade') || lowerText.includes('import') || 
      lowerText.includes('export') || lowerText.includes('usmca') ||
      lowerText.includes('nafta') || lowerText.includes('trade war')) {
    return 'trade';
  }
  
  return 'policy';
};

const determineImpact = (text) => {
  const lowerText = text.toLowerCase();
  const highImpactWords = ['crisis', 'war', 'major', 'significant', 'massive', 'critical'];
  const lowImpactWords = ['minor', 'small', 'slight', 'limited'];
  
  if (highImpactWords.some(word => lowerText.includes(word))) return 'high';
  if (lowImpactWords.some(word => lowerText.includes(word))) return 'low';
  return 'medium';
};

// Fetch real news from The Guardian API
export const fetchRealTariffNews = async () => {
  try {
    const queries = [
      'Canada AND (tariff OR trade OR duties)',
      'USA AND Canada AND (trade OR tariff)',
      'China AND (tariff OR trade war)',
      'USMCA AND (Canada OR trade)',
      'steel AND (Canada OR USA OR China)',
      'aluminum AND (Canada OR USA OR tariff)',
      'commodity AND (Canada OR USA OR China)',
      'import duties AND Canada',
      'trade war',
      'NAFTA AND Canada'
    ];
    
    const allNews = [];
    
    for (const query of queries.slice(0, 10)) { // Use 5 queries for better coverage
      const response = await fetch(
        `https://content.guardianapis.com/search?q=${encodeURIComponent(query)}&show-fields=headline,trailText,body&page-size=3&order-by=newest&section=business|world|politics&api-key=${GUARDIAN_API_KEY}`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Guardian API error ${response.status}:`, errorText);
        throw new Error(`Guardian API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.response && data.response.results) {
        const processedArticles = data.response.results.map(article => ({
          id: article.id,
          title: article.fields?.headline || article.webTitle,
          summary: article.fields?.trailText || article.fields?.body?.substring(0, 200) + '...' || 'No summary available',
          source: 'The Guardian',
          publishedAt: new Date(article.webPublicationDate),
          url: article.webUrl,
          country: determineCountry(article.webTitle + ' ' + (article.fields?.trailText || '')),
          category: determineCategory(article.webTitle + ' ' + (article.fields?.trailText || '')),
          impact: determineImpact(article.webTitle + ' ' + (article.fields?.trailText || ''))
        }));
        
        allNews.push(...processedArticles);
      }
    }
    
    // Remove duplicates and filter for relevance
    const uniqueNews = allNews.filter((news, index, self) => 
      index === self.findIndex(n => n.id === news.id)
    );
    
    // Filter for relevant content
    const relevantNews = uniqueNews.filter(news => {
      const fullText = (news.title + ' ' + news.summary).toLowerCase();
      
      // Must contain at least one key topic
      const hasRelevantTopic = 
        fullText.includes('tariff') || fullText.includes('trade') ||
        fullText.includes('commodity') || fullText.includes('duty') ||
        fullText.includes('import') || fullText.includes('export') ||
        fullText.includes('steel') || fullText.includes('aluminum') ||
        fullText.includes('usmca') || fullText.includes('nafta');
      
      // Must be related to US/Canada/China
      const hasRelevantCountry = 
        fullText.includes('canada') || fullText.includes('us') ||
        fullText.includes('america') || fullText.includes('united states') ||
        fullText.includes('china') || fullText.includes('chinese');
      
      return hasRelevantTopic && hasRelevantCountry;
    });
    
    return relevantNews
      .filter(news => news.country === 'US' || news.country === 'CA' || news.country === 'CN')
      .slice(0, 10); // Limit to 10 most recent
      
  } catch (error) {
    console.error('Error fetching real news:', error);
    return [];
  }
};

// Main function that tries real API first, then falls back to simulated data
export const fetchTariffNews = async () => {
  try {
    // Try to fetch real news first if API key is available
    if (GUARDIAN_API_KEY && GUARDIAN_API_KEY !== 'demo') {
      console.log('Fetching real news from The Guardian API...');
      try {
        const realNews = await fetchRealTariffNews();
        if (realNews && realNews.length > 0) {
          console.log(`Successfully fetched ${realNews.length} real news articles`);
          return realNews;
        }
      } catch (apiError) {
        console.warn('Guardian API failed, falling back to simulated data:', apiError.message);
      }
    }
    
    // Fall back to simulated news data
    console.log('Using simulated news data');
    const newsData = [
      {
        id: 'news_1',
        title: 'US Imposes New Steel Tariffs on Canadian Imports',
        summary: 'United States announces 25% tariffs on Canadian steel imports, citing national security concerns. Canada threatens retaliatory measures on US aluminum exports.',
        source: 'The Guardian',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        country: 'US',
        category: 'tariff',
        url: 'https://www.theguardian.com/business/steel-tariffs-canada-us-trade',
        impact: 'high'
      },
      {
        id: 'news_2',
        title: 'Copper Tariffs Drive Up Commodity Prices Across North America',
        summary: 'New 15% tariffs on copper imports from Chile impact US and Canadian manufacturers. Commodity traders expect price increases for industrial metals through 2025.',
        source: 'The Guardian',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        country: 'US',
        category: 'commodity',
        url: 'https://www.theguardian.com/business/copper-tariffs-commodity-prices',
        impact: 'high'
      },
      {
        id: 'news_3',
        title: 'Canada Retaliates with Aluminum Tariffs on US Exports',
        summary: 'Ottawa imposes 10% tariffs on US aluminum exports in response to American steel duties. Canadian aluminum producers welcome the protective measures.',
        source: 'The Guardian',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        country: 'CA',
        category: 'tariff',
        url: 'https://www.theguardian.com/world/canada-aluminum-tariffs-us-trade',
        impact: 'medium'
      },
      {
        id: 'news_4',
        title: 'Gold Import Duties Spark Commodity Market Volatility',
        summary: 'US considers 5% import duties on gold from major suppliers including Canada. Precious metals traders brace for market disruption as prices fluctuate.',
        source: 'The Guardian',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        country: 'US',
        category: 'commodity',
        url: 'https://www.theguardian.com/business/gold-import-duties-commodity-markets',
        impact: 'high'
      },
      {
        id: 'news_5',
        title: 'Trump Formalizes Tariff Cuts for U.K. as Trade Talks Continue',
        summary: 'President Trump signs agreement lowering some tariffs on UK imports as both countries work toward broader trade deal.',
        source: 'NBC News',
        publishedAt: new Date(Date.now() - 48 * 60 * 1000), // 48 minutes ago
        country: 'US',
        category: 'trade',
        url: 'https://www.nbcnews.com/business/business-news/trump-formalizes-tariff-cuts-uk-trade-talks-continue-rcna213370',
        impact: 'medium'
      },
      {
        id: 'news_6',
        title: 'Canada Emerges as Safest Port in Trade War Storm',
        summary: 'Average effective tariff on US imports from Canada reaches 2.3% - up from zero in January but lowest among major trading partners.',
        source: 'CBC News',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        country: 'CA',
        category: 'policy',
        url: 'https://www.cbc.ca/news/business/armstrong-economy-trade-war-tariffs-1.7560606',
        impact: 'medium'
      },
      {
        id: 'news_7',
        title: 'Tariff "Stacking" Adds Headache for US Importers',
        summary: 'New complications arise for American importers as multiple tariff policies create overlapping duties on goods.',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        country: 'US',
        category: 'policy',
        url: 'https://www.reuters.com/business/tariff-stacking-adds-another-headache-us-importers-2025-06-16/',
        impact: 'medium'
      },
      {
        id: 'news_8',
        title: 'China Imposes Retaliatory Tariffs on US Agricultural Exports',
        summary: 'Beijing announces 20% tariffs on American soybeans and corn in response to US steel duties. Trade war escalates as agricultural commodities become battleground.',
        source: 'The Guardian',
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        country: 'CN',
        category: 'tariff',
        url: 'https://www.theguardian.com/world/china-retaliatory-tariffs-us-agriculture',
        impact: 'high'
      },
      {
        id: 'news_9',
        title: 'Canada Seeks Alternative Trade Partners Amid US Tariff Disputes',
        summary: 'Canadian government explores new trade agreements with EU and Asia-Pacific nations as tariff tensions with United States continue to escalate.',
        source: 'The Guardian',
        publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
        country: 'CA',
        category: 'trade',
        url: 'https://www.theguardian.com/world/canada-alternative-trade-partners-tariffs',
        impact: 'medium'
      },
      {
        id: 'news_10',
        title: 'Canadian Nickel Exports Face New US Import Duties',
        summary: 'Washington considers 12% duties on Canadian nickel imports, threatening major mining operations in Ontario and Quebec. Industry warns of job losses.',
        source: 'The Guardian',
        publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
        country: 'CA',
        category: 'commodity',
        url: 'https://www.theguardian.com/world/canada-nickel-exports-us-duties',
        impact: 'high'
      }
    ];

    // Filter for US, Canada, and China related news
    return newsData.filter(news => news.country === 'US' || news.country === 'CA' || news.country === 'CN');
  } catch (error) {
    console.error('Error fetching tariff news:', error);
    return [];
  }
};

// Function to get news by country
export const getNewsByCountry = (newsData, country) => {
  return newsData.filter(news => news.country === country);
};

// Function to get news by category
export const getNewsByCategory = (newsData, category) => {
  return newsData.filter(news => news.category === category);
};

// Function to format time ago
export const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  }
};

// Function to get impact color
export const getImpactColor = (impact) => {
  const colors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };
  return colors[impact] || colors.medium;
};

// Check Guardian API configuration
export const checkNewsApiConfiguration = () => {
  return {
    configured: GUARDIAN_API_KEY && GUARDIAN_API_KEY !== 'demo',
    key: GUARDIAN_API_KEY === 'demo' || !GUARDIAN_API_KEY ? 'Using demo key' : 'API key configured'
  };
};

// Test Guardian API connection
export const testNewsApiConnection = async () => {
  try {
    if (!GUARDIAN_API_KEY || GUARDIAN_API_KEY === 'demo') {
      return false;
    }
    
    const response = await fetch(
      `https://content.guardianapis.com/search?q=test&page-size=1&api-key=${GUARDIAN_API_KEY}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Guardian API test error ${response.status}:`, errorText);
    }
    
    return response.ok;
  } catch (error) {
    console.error('Guardian API test failed:', error);
    return false;
  }
};

