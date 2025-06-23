# Commodity Tracker - Enhanced

A comprehensive web application for tracking commodity prices, tariff information, and trade news. Built with React, Vite, and modern UI components.

## 🚀 Features

### Core Functionality
- **Real-time Commodity Tracking**: Monitor prices for precious metals, industrial metals, energy, and agricultural commodities
- **Tariff Management**: Track and manage tariff codes with detailed information
- **Trade News**: Stay updated with real-time trade and tariff news from The Guardian
- **Interactive Dashboard**: Modern, responsive interface with real-time updates
- **Price History**: Track price changes over time with automatic percentage calculations
- **Report Generation**: Generate comprehensive reports for tracked commodities

### API Integrations
- **Metals-API**: Real-time precious and industrial metal prices
- **AlphaVantage**: Energy and agricultural commodity data
- **Guardian API**: High-quality trade and tariff news (completely free, no production restrictions)

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API Integration**: Fetch API with error handling and fallbacks

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd commodity-tracker-enhanced
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_METALS_API_KEY=your_metals_api_key_here
   VITE_ALPHAVANTAGE_API_KEY=your_alphavantage_key_here
   VITE_GUARDIAN_API_KEY=your_guardian_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔑 API Setup

### Metals-API (Precious & Industrial Metals)
1. Visit [Metals-API](https://metals-api.com)
2. Sign up for an API key
3. Add `VITE_METALS_API_KEY=your_key` to your `.env` file

**Supported Commodities:**
- Precious Metals: Gold (XAU), Silver (XAG), Platinum (XPT), Palladium (XPD)
- Industrial Metals: Copper (LME-XCU), Aluminum (LME-ALU), Nickel (LME-NI), Zinc (LME-ZNC), Lead (LME-LEAD), Tin (LME-TIN)

### AlphaVantage (Energy & Agricultural)
1. Visit [AlphaVantage](https://www.alphavantage.co/support/#api-key)
2. Get your free API key
3. Add `VITE_ALPHAVANTAGE_API_KEY=your_key` to your `.env` file

**Supported Commodities:**
- Energy: Crude Oil (WTI), Natural Gas, Heating Oil
- Agricultural: Wheat, Corn, Soybeans

### Guardian API (News)
1. Visit [Guardian Open Platform](https://open-platform.theguardian.com/access/)
2. Sign up for a completely free API key (no production restrictions)
3. Add `VITE_GUARDIAN_API_KEY=your_key` to your `.env` file

**Benefits:**
- ✅ Completely free forever
- ✅ No production domain restrictions
- ✅ High-quality journalism from The Guardian
- ✅ Works in deployed applications
- ✅ No rate limiting for basic usage

## 🏗️ Project Structure

```
src/
├── components/
│   ├── commodity/          # Commodity tracking components
│   │   ├── CommodityManager.jsx
│   │   ├── CommodityCard.jsx
│   │   ├── CommoditySearch.jsx
│   │   ├── CommodityApiService.js
│   │   ├── CommodityDatabase.js
│   │   └── PriceHistoryService.js
│   ├── news/              # News components
│   │   ├── NewsHeadlines.jsx
│   │   ├── NewsItem.jsx
│   │   └── NewsService.js
│   ├── reports/           # Report generation
│   │   ├── ReportGenerator.jsx
│   │   └── ReportService.js
│   ├── tariff/            # Tariff management
│   │   └── TariffManager.jsx
│   └── ui/                # Reusable UI components
├── data/                  # Static data and databases
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions
```

## 🎯 Usage

### Commodity Tracking
1. **Add Commodities**: Use the search function to add commodities to your tracking list
2. **View Prices**: Real-time prices are displayed with automatic updates
3. **Price Changes**: Historical price changes are calculated and displayed with trend indicators
4. **Remove Items**: Click the X button to remove commodities from tracking

### Tariff Management
1. **Browse Tariffs**: View comprehensive tariff code database
2. **Search**: Find specific tariff codes using the search functionality
3. **Filter**: Filter by country, category, or other criteria
4. **Details**: View detailed information for each tariff code

### News & Updates
1. **Real-time News**: Stay updated with trade and tariff news from The Guardian
2. **Categorized**: News is automatically categorized by relevance and impact
3. **External Links**: Click through to read full articles

### Reports
1. **Generate Reports**: Create comprehensive reports for tracked commodities
2. **Export Options**: Export reports in various formats
3. **Historical Data**: Include historical price data and trends

## 🔧 Configuration

### API Fallbacks
The application includes intelligent fallbacks:
- **No API Keys**: Falls back to simulated data for demonstration
- **API Failures**: Gracefully handles API failures with cached or simulated data
- **Rate Limiting**: Implements rate limiting and error handling

### Customization
- **Default Commodities**: Modify `defaultCommodityIds` in `App.jsx`
- **Update Intervals**: Adjust data refresh rates in component configurations
- **UI Themes**: Customize colors and styling in Tailwind configuration

## 🚀 Deployment

### Environment Variables for Production
```env
VITE_METALS_API_KEY=your_production_metals_api_key
VITE_ALPHAVANTAGE_API_KEY=your_production_alphavantage_key
VITE_GUARDIAN_API_KEY=your_production_guardian_api_key
```

### Build for Production
```bash
npm run build
```

### Deploy
The built files in the `dist/` directory can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Metals-API](https://metals-api.com) for comprehensive metal price data
- [AlphaVantage](https://www.alphavantage.co) for financial and commodity data
- [The Guardian](https://open-platform.theguardian.com) for high-quality news content
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

---

**Note**: This application uses free tier APIs. For production use with high volume, consider upgrading to paid plans for the respective services. 