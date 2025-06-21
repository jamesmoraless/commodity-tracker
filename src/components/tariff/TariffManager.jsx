import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, X, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { TARIFF_DATABASE, searchTariffs, getTariffCategories, formatTariffRate, getCountryFlag, getCountryName } from '../../data/TariffDatabase';

const TariffManager = ({ onAddTariff, trackedTariffs = [], onRemoveTariff }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTariffs, setFilteredTariffs] = useState(Object.values(TARIFF_DATABASE));

  const trackedHSCodes = useMemo(() => trackedTariffs.map(t => t.hsCode), [trackedTariffs]);
  const categories = getTariffCategories();

  React.useEffect(() => {
    let results = Object.values(TARIFF_DATABASE);

    // Filter by search query
    if (searchQuery.trim()) {
      results = searchTariffs(searchQuery);
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      results = results.filter(tariff => tariff.category === selectedCategory);
    }

    // Exclude already tracked tariffs
    results = results.filter(tariff => !trackedHSCodes.includes(tariff.hsCode));

    setFilteredTariffs(results);
  }, [searchQuery, selectedCategory, trackedHSCodes]);

  const TariffCard = ({ tariff, isTracked = false, onAdd, onRemove }) => (
    <div className="border rounded-lg p-5 hover:shadow-md transition-all duration-200 bg-white min-h-[280px] flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-bold text-lg text-blue-600">{tariff.hsCode}</h3>
            {isTracked && (
              <Badge className="bg-green-100 text-green-800">Tracked</Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{tariff.description}</p>
          <Badge variant="outline" className="text-xs">{tariff.category}</Badge>
        </div>
        {isTracked && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(tariff.hsCode)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="text-xs text-gray-500 mb-1">Current Tariff Rates:</div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(tariff.currentRates).map(([country, rate]) => (
            <div key={country} className="flex items-center justify-between text-sm bg-gray-50 px-2 py-1 rounded">
              <span className="flex items-center space-x-1">
                <span>{getCountryFlag(country)}</span>
                <span className="font-medium">{country}</span>
              </span>
              <span className={`font-bold ${rate.rate > 10 ? 'text-red-600' : rate.rate > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {formatTariffRate(rate.rate)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {tariff.notes && (
        <div className="text-xs text-gray-500 mb-3 p-2 bg-blue-50 rounded border-l-2 border-blue-200">
          <strong>Note:</strong> {tariff.notes}
        </div>
      )}
      
      <div className="mt-auto">
        {!isTracked && onAdd && (
          <Button 
            onClick={() => onAdd(tariff)}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Track Tariff
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white/80 backdrop-blur-sm hover:bg-gray-50"
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage Tariffs
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[1400px] !w-[98vw] bg-white border border-gray-300 shadow-2xl sm:!max-w-[1400px]">
        <DialogHeader className="bg-white border-b border-gray-200 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Tariff Code Manager
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 bg-white p-8 max-h-[80vh] overflow-y-auto">
          {/* Current Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Current Configuration</h3>
            <p className="text-blue-800 text-sm">
              Tracking {trackedTariffs.length} tariff codes out of {Object.keys(TARIFF_DATABASE).length} available
            </p>
          </div>

          {/* Currently Tracked Tariffs */}
          {trackedTariffs.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Currently Tracked Tariffs</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {trackedTariffs.map(tariff => (
                  <TariffCard
                    key={tariff.hsCode}
                    tariff={tariff}
                    isTracked={true}
                    onRemove={onRemoveTariff}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Add New Tariff Codes</h3>
            
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by HS code, description, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-72 flex-shrink-0">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Results Count */}
            <div className="text-sm text-gray-500">
              Showing {filteredTariffs.length} available tariff codes
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory && selectedCategory !== 'all' && ` in "${selectedCategory}"`}
            </div>
          </div>

          {/* Available Tariffs */}
          <div className="space-y-4">
            {filteredTariffs.length === 0 ? (
              <Alert>
                <AlertDescription>
                  {trackedHSCodes.length === Object.keys(TARIFF_DATABASE).length ? 
                    "All available tariff codes are already being tracked." :
                    "No tariff codes found matching your search criteria."
                  }
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {filteredTariffs.map(tariff => (
                  <TariffCard
                    key={tariff.hsCode}
                    tariff={tariff}
                    onAdd={onAddTariff}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <Alert>
            <AlertDescription>
              <strong>How to manage tariff codes:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Use the search box to find specific HS codes or descriptions</li>
                <li>• Filter by category to narrow down results</li>
                <li>• Click "Track Tariff" to add a tariff code to your monitoring list</li>
                <li>• Remove tracked tariffs using the X button on tracked items</li>
                <li>• Tariff rates are color-coded: Green (0%), Orange (1-10%), Red (&gt;10%)</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TariffManager; 