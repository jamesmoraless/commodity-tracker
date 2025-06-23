// Price History Service for tracking commodity price changes over time
class PriceHistoryService {
  constructor() {
    this.priceHistory = new Map(); // Map<commodityId, {previousPrice, currentPrice, timestamp}>
  }

  // Update price and calculate change percentage
  updatePrice(commodityId, newPrice) {
    const history = this.priceHistory.get(commodityId);
    
    if (!history) {
      // First time tracking this commodity
      this.priceHistory.set(commodityId, {
        previousPrice: newPrice,
        currentPrice: newPrice,
        timestamp: Date.now(),
        changePercent: 0
      });
      return 0; // No change for first entry
    }

    // Calculate percentage change from previous price
    const changePercent = ((newPrice - history.currentPrice) / history.currentPrice) * 100;
    
    // Update history
    this.priceHistory.set(commodityId, {
      previousPrice: history.currentPrice, // Current becomes previous
      currentPrice: newPrice,              // New becomes current
      timestamp: Date.now(),
      changePercent: changePercent
    });

    return changePercent;
  }

  // Get the last recorded change percentage
  getLastChange(commodityId) {
    const history = this.priceHistory.get(commodityId);
    return history ? history.changePercent : 0;
  }

  // Get price history for a commodity
  getPriceHistory(commodityId) {
    return this.priceHistory.get(commodityId) || null;
  }

  // Clear history for a commodity (when removed from tracking)
  clearHistory(commodityId) {
    this.priceHistory.delete(commodityId);
  }

  // Clear all history
  clearAllHistory() {
    this.priceHistory.clear();
  }

  // Get all tracked commodities
  getTrackedCommodities() {
    return Array.from(this.priceHistory.keys());
  }
}

// Create a singleton instance
const priceHistoryService = new PriceHistoryService();

export default priceHistoryService; 