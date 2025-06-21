# Commodity Tracker

A modern web application for tracking commodity prices and market trends. Built with React, Vite, and Tailwind CSS.

## Features

- Real-time commodity price tracking from multiple APIs (AlphaVantage, Metals API)
- Interactive charts and visualizations
- Support for metals, energy, and agricultural commodities
- Fallback to simulated data when APIs are unavailable
- API status monitoring and configuration
- Responsive design
- Modern UI components

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (v8 or higher)

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure API keys (optional):
```bash
# Create a .env file in the project root
cp .env.example .env

# Edit .env and add your API keys:
VITE_ALPHAVANTAGE_API_KEY=your_alphavantage_key_here
VITE_METALS_API_KEY=your_metalpriceapi_key_here
VITE_NEWS_API_KEY=your_newsapi_key_here
```

4. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## API Configuration

The application uses real commodity price data from multiple APIs:

### AlphaVantage API (Free tier available)
- **Used for**: Energy commodities (Oil, Gas) and Agricultural commodities (Wheat, Corn, Soybeans)
- **Get API key**: [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
- **Environment variable**: `VITE_ALPHAVANTAGE_API_KEY`

### MetalPriceAPI (Paid service)
- **Used for**: Precious metals (Gold, Silver, Platinum) and Industrial metals (Copper, Aluminum, Nickel, Zinc, Lead, Tin)
- **Get API key**: [https://metalpriceapi.com/dashboard](https://metalpriceapi.com/dashboard)
- **Environment variable**: `VITE_METALS_API_KEY`

### NewsAPI (Free tier available)
- **Used for**: Real-time tariff and trade news from multiple sources
- **Get API key**: [https://newsapi.org/register](https://newsapi.org/register)
- **Environment variable**: `VITE_NEWS_API_KEY`

### Fallback Behavior
- Without API keys, the application will use simulated data
- Mixed mode: Real data for configured APIs, simulated data for others
- API status is displayed in the header and configuration panel
- News falls back to curated simulated articles when NewsAPI is unavailable

### Supported Commodities

| Commodity | API Source | Coverage |
|-----------|------------|----------|
| Gold, Silver, Platinum | MetalPriceAPI | ✅ Real-time |
| Copper, Aluminum, Nickel | MetalPriceAPI | ✅ Real-time |
| Zinc, Lead, Tin | MetalPriceAPI | ✅ Real-time |
| Crude Oil, Natural Gas | AlphaVantage | ✅ Real-time |
| Wheat, Corn, Soybeans | AlphaVantage | ✅ Real-time |
| Steel, PVC | Simulated | 🔄 Simulated |

### News Coverage

| **Source** | **Coverage** | **Queries** |
|------------|--------------|-------------|
| NewsAPI | US/Canada Trade | `tariff+trade+canada+us` |
| NewsAPI | Trade Wars | `trade+war+tariff` |
| NewsAPI | Customs & Duties | `customs+duty+import` |
| Fallback | Curated Articles | High-quality simulated news |

## Technologies Used

- React
- Vite
- Tailwind CSS
- Radix UI
- React Router
- Recharts
- React Hook Form
- Zod

## License

MIT 