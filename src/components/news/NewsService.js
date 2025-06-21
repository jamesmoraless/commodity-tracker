// News service for fetching tariff and trade news
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

// Helper functions to categorize news
const determineCountry = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('canada') || lowerText.includes('canadian')) return 'CA';
  if (lowerText.includes('united states') || lowerText.includes('us ') || lowerText.includes('america')) return 'US';
  return 'US'; // Default
};

const determineCategory = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('tariff') || lowerText.includes('duty')) return 'tariff';
  if (lowerText.includes('trade') || lowerText.includes('import') || lowerText.includes('export')) return 'trade';
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

// Fetch real news from NewsAPI
export const fetchRealTariffNews = async () => {
  try {
    const queries = [
      'tariff+trade+canada+us',
      'trade+war+tariff',
      'customs+duty+import'
    ];
    
    const allNews = [];
    
    for (const query of queries) {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.articles) {
        const processedArticles = data.articles.map(article => ({
          id: article.url,
          title: article.title,
          summary: article.description || article.content?.substring(0, 200) + '...',
          source: article.source.name,
          publishedAt: new Date(article.publishedAt),
          url: article.url,
          country: determineCountry(article.title + ' ' + (article.description || '')),
          category: determineCategory(article.title + ' ' + (article.description || '')),
          impact: determineImpact(article.title + ' ' + (article.description || ''))
        }));
        
        allNews.push(...processedArticles);
      }
    }
    
    // Filter for US/Canada and remove duplicates
    const uniqueNews = allNews.filter((news, index, self) => 
      index === self.findIndex(n => n.id === news.id)
    );
    
    return uniqueNews
      .filter(news => news.country === 'US' || news.country === 'CA')
      .slice(0, 8); // Limit to 8 most recent
      
  } catch (error) {
    console.error('Error fetching real news:', error);
    return [];
  }
};

// Main function that tries real API first, then falls back to simulated data
export const fetchTariffNews = async () => {
  try {
    // Try to fetch real news first if API key is available
    if (NEWS_API_KEY && NEWS_API_KEY !== 'demo') {
      console.log('Fetching real news from NewsAPI...');
      const realNews = await fetchRealTariffNews();
      if (realNews && realNews.length > 0) {
        console.log(`Successfully fetched ${realNews.length} real news articles`);
        return realNews;
      }
    }
    
    // Fall back to simulated news data
    console.log('Using simulated news data');
    const newsData = [
      {
        id: 'news_1',
        title: 'Trump Says Trade Deal With Canada "Achievable" at G-7',
        summary: 'US President discusses maintaining tariffs on Canada as negotiators work on trade agreement. Canada faces 25% duties on auto exports and 50% on steel and aluminum.',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        country: 'US',
        category: 'tariff',
        url: 'https://www.bloomberg.com/news/articles/2025-06-16/trump-says-trade-deal-with-canada-achievable-as-g-7-opens',
        impact: 'high'
      },
      {
        id: 'news_2',
        title: 'Canada Pushes Back on Trump Tariff Requirements',
        summary: 'Ottawa challenges Trump\'s stance that tariffs must be part of any Canada deal. Canada is the top supplier of steel and aluminum to the United States.',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        country: 'CA',
        category: 'trade',
        url: 'https://www.reuters.com/business/autos-transportation/trump-says-tariffs-must-be-part-any-canada-deal-ottawa-pushes-back-2025-06-16/',
        impact: 'high'
      },
      {
        id: 'news_3',
        title: 'Progress on Lifting Trump\'s Tariffs on Canada "Not Fast Enough"',
        summary: 'Canadian officials express frustration with pace of tariff negotiations. Canada has imposed retaliatory tariffs on $60 billion worth of U.S. goods.',
        source: 'Global News',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        country: 'CA',
        category: 'policy',
        url: 'https://globalnews.ca/news/11241445/donald-trump-tariffs-canada-talks-leblanc-west-block/',
        impact: 'medium'
      },
      {
        id: 'news_4',
        title: 'EU Weighs 10% Tariff Deal as Trump\'s July Deadline Looms',
        summary: 'Brussels negotiators hope to avoid higher tariffs on cars and medicines by agreeing to 10% US tariff on all EU exports. July 9 deadline approaches.',
        source: 'Yahoo Finance',
        publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
        country: 'US',
        category: 'tariff',
        url: 'https://finance.yahoo.com/news/live/trump-tariffs-live-updates-eu-weighs-10-tariff-deal-as-trumps-july-deadline-looms-200619913.html',
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
        title: 'US-China Trade Tariffs to Remain at 10%, Lutnick Says',
        summary: 'Commerce Secretary confirms China tariffs will stay at current 10% level following temporary agreement between both sides.',
        source: 'CNBC',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        country: 'US',
        category: 'tariff',
        url: 'https://www.cnbc.com/2025/06/11/us-china-trade-tariffs-lutnick.html',
        impact: 'low'
      }
    ];

    // Filter for US and Canada related news
    return newsData.filter(news => news.country === 'US' || news.country === 'CA');
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

// Check NewsAPI configuration
export const checkNewsApiConfiguration = () => {
  return {
    configured: NEWS_API_KEY && NEWS_API_KEY !== 'demo',
    key: NEWS_API_KEY === 'demo' || !NEWS_API_KEY ? 'Using demo key' : 'API key configured'
  };
};

// Test NewsAPI connection
export const testNewsApiConnection = async () => {
  try {
    if (!NEWS_API_KEY || NEWS_API_KEY === 'demo') {
      return false;
    }
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=test&pageSize=1&apiKey=${NEWS_API_KEY}`
    );
    
    return response.ok;
  } catch (error) {
    console.error('NewsAPI test failed:', error);
    return false;
  }
};

