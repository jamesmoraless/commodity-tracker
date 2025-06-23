import React from 'react';
import { X, TrendingUp, TrendingDown, DollarSign, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { COMMODITY_CATEGORIES } from './CommodityDatabase';

const CommodityCard = ({ commodity, onRemove, canRemove = true }) => {
  const formatPrice = (price, unit) => {
    if (unit.includes('USD/lb')) {
      return `$${price.toFixed(4)}`;
    } else if (unit.includes('CNY')) {
      return `¥${price.toFixed(2)}`;
    } else if (unit.includes('USD/oz')) {
      return `$${price.toFixed(2)}`;
    } else if (unit.includes('USD/barrel') || unit.includes('USD/gallon') || unit.includes('USD/MMBtu') || unit.includes('USD/bushel')) {
      return `$${price.toFixed(2)}`;
    } else {
      return `$${price.toFixed(2)}`;
    }
  };

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      metals: 'bg-slate-100 text-slate-800',
      energy: 'bg-red-100 text-red-800',
      agriculture: 'bg-green-100 text-green-800',
      precious_metals: 'bg-yellow-100 text-yellow-800',
      plastics: 'bg-blue-100 text-blue-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="group relative">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Remove Button */}
        {canRemove && (
          <button
            onClick={() => onRemove(commodity.id)}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg"
            title="Remove commodity"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 pr-8">
            <h3 className="text-xl font-bold text-gray-900">{commodity.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getCategoryColor(commodity.category)}>
                {COMMODITY_CATEGORIES[commodity.category]}
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-medium">{commodity.description}</p>
                      <p className="text-gray-500 mt-1">{commodity.exchange}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className={`bg-gradient-to-r ${commodity.color} p-3 rounded-xl shadow-lg`}>
            <DollarSign className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Price Information */}
        <div className="space-y-3">
          <p className="text-3xl font-bold text-gray-900">
            {formatPrice(commodity.price, commodity.unit)}
          </p>
          <p className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full inline-block">
            {commodity.unit}
          </p>
          {commodity.change !== undefined && (
            <div className="flex items-center space-x-2">
              {commodity.trend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-lg font-bold ${
                commodity.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatChange(commodity.change)}
              </span>
            </div>
          )}
        </div>

        {/* Exchange Information */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">
              {commodity.exchange}
            </p>
            {commodity.source && (
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  commodity.source === 'api' ? 'bg-green-500' : 'bg-orange-500'
                }`}></div>
                <span className={`text-xs font-medium ${
                  commodity.source === 'api' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {commodity.source === 'api' ? 'Live API' : 'Simulated'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommodityCard;

