import React from 'react';
import { ExternalLink, Clock, Flag } from 'lucide-react';
import { Badge } from '../ui/badge';
import { formatTimeAgo, getImpactColor } from './NewsService';

const NewsItem = ({ news, onClick }) => {
  const getCountryFlag = (country) => {
    const flags = {
      'US': '🇺🇸',
      'CA': '🇨🇦'
    };
    return flags[country] || '🌍';
  };

  const getCategoryColor = (category) => {
    const colors = {
      tariff: 'bg-red-100 text-red-800',
      trade: 'bg-blue-100 text-blue-800',
      policy: 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => onClick && onClick(news)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getCountryFlag(news.country)}</span>
          <Badge className={getCategoryColor(news.category)}>
            {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
          </Badge>
          <Badge className={getImpactColor(news.impact)}>
            {news.impact.charAt(0).toUpperCase() + news.impact.slice(1)} Impact
          </Badge>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          {formatTimeAgo(news.publishedAt)}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-bold text-gray-900 leading-tight line-clamp-2">
          {news.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {news.summary}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-500">
          {news.source}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(news.url, '_blank', 'noopener,noreferrer');
          }}
          className="flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Read More
        </button>
      </div>
    </div>
  );
};

export default NewsItem;

