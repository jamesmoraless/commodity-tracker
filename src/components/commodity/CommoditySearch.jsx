import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { COMMODITY_DATABASE, COMMODITY_CATEGORIES, searchCommodities, getCommoditiesByCategory } from './CommodityDatabase';

const CommoditySearch = ({ onAddCommodity, currentCommodities = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredCommodities, setFilteredCommodities] = useState(COMMODITY_DATABASE);

  // Get IDs of currently tracked commodities - memoize to prevent infinite loops
  const currentCommodityIds = React.useMemo(() => 
    currentCommodities.map(c => c.id), 
    [currentCommodities]
  );

  useEffect(() => {
    let results = COMMODITY_DATABASE;

    // Filter by search query
    if (searchQuery.trim()) {
      results = searchCommodities(searchQuery);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(commodity => commodity.category === selectedCategory);
    }

    // Exclude already tracked commodities
    results = results.filter(commodity => !currentCommodityIds.includes(commodity.id));

    setFilteredCommodities(results);
  }, [searchQuery, selectedCategory, currentCommodityIds]);

  const handleAddCommodity = (commodity) => {
    onAddCommodity(commodity);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedCategory('all');
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Commodity
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-white border border-gray-300 shadow-2xl z-50">
        <DialogHeader className="bg-white border-b border-gray-200 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Add New Commodity
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 bg-white p-6 overflow-y-auto max-h-[60vh]">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search commodities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-gray-300"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg z-[60]">
                <SelectItem value="all" className="hover:bg-gray-100">All Categories</SelectItem>
                {Object.entries(COMMODITY_CATEGORIES).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="hover:bg-gray-100">{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="bg-white">
            {filteredCommodities.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white">
                {currentCommodityIds.length === COMMODITY_DATABASE.length ? (
                  <div>
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="font-medium">All commodities are already being tracked!</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="font-medium">No commodities found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                {filteredCommodities.map((commodity) => (
                  <div
                    key={commodity.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
                    onClick={() => handleAddCommodity(commodity)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{commodity.name}</h3>
                        <p className="text-sm text-gray-600">{commodity.description}</p>
                      </div>
                      <Badge className={getCategoryColor(commodity.category)}>
                        {COMMODITY_CATEGORIES[commodity.category]}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{commodity.exchange}</span>
                      <span className="font-medium">{commodity.unit}</span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddCommodity(commodity);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add to Dashboard
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {filteredCommodities.length > 0 && (
            <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100 bg-white">
              Showing {filteredCommodities.length} of {COMMODITY_DATABASE.length - currentCommodityIds.length} available commodities
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommoditySearch;

