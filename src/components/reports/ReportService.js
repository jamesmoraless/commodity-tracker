import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Report generation service
export const generatePDFReport = async (commodities, news, tariffs) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text, x, y, maxWidth, fontSize = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.35);
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredHeight) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CommodityTracker Pro Report', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    pdf.text(`Generated on: ${currentDate}`, margin, yPosition);
    yPosition += 15;

    // Executive Summary
    checkNewPage(30);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Executive Summary', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const summary = `This report provides a comprehensive overview of ${commodities.length} tracked commodities, ${tariffs.length} active tariff changes, and ${news.length} recent trade news developments. The data reflects current market conditions and trade policy impacts on global commodity markets.`;
    yPosition = addText(summary, margin, yPosition, pageWidth - 2 * margin);
    yPosition += 10;

    // Commodity Prices Section
    checkNewPage(40);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Commodity Prices Overview', margin, yPosition);
    yPosition += 10;

    commodities.forEach((commodity, index) => {
      checkNewPage(25);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${commodity.name}`, margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const priceText = `Price: ${formatPrice(commodity.price, commodity.unit)} (${commodity.unit})`;
      yPosition = addText(priceText, margin + 5, yPosition, pageWidth - 2 * margin - 5);
      
      const changeText = `Change: ${formatChange(commodity.change)} (${commodity.trend === 'up' ? 'Upward' : 'Downward'} trend)`;
      yPosition = addText(changeText, margin + 5, yPosition, pageWidth - 2 * margin - 5);
      
      const exchangeText = `Exchange: ${commodity.exchange}`;
      yPosition = addText(exchangeText, margin + 5, yPosition, pageWidth - 2 * margin - 5);
      
      yPosition += 5;
    });

    // Tariff Changes Section
    checkNewPage(40);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recent Tariff Changes', margin, yPosition);
    yPosition += 10;

    tariffs.forEach((tariff, index) => {
      checkNewPage(20);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${tariff.country}`, margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const productText = `Product: ${tariff.product}`;
      yPosition = addText(productText, margin + 5, yPosition, pageWidth - 2 * margin - 5);
      
      const rateText = `Tariff Rate: ${tariff.rate} (${tariff.change === 'increase' ? 'Increased' : 'Decreased'})`;
      yPosition = addText(rateText, margin + 5, yPosition, pageWidth - 2 * margin - 5);
      
      const dateText = `Effective Date: ${tariff.effectiveDate}`;
      yPosition = addText(dateText, margin + 5, yPosition, pageWidth - 2 * margin - 5);
      
      yPosition += 5;
    });

    // News Headlines Section
    checkNewPage(40);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Trade News Headlines', margin, yPosition);
    yPosition += 10;

    // Filter to top 5 most recent news items
    const recentNews = news
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 5);

    recentNews.forEach((newsItem, index) => {
      checkNewPage(25);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      yPosition = addText(`${index + 1}. ${newsItem.title}`, margin, yPosition, pageWidth - 2 * margin, 12);
      yPosition += 2;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const metaText = `Source: ${newsItem.source} | Country: ${newsItem.country === 'US' ? 'United States' : 'Canada'} | Impact: ${newsItem.impact}`;
      yPosition = addText(metaText, margin + 5, yPosition, pageWidth - 2 * margin - 5);
      
      yPosition = addText(newsItem.summary, margin + 5, yPosition, pageWidth - 2 * margin - 5);
      
      yPosition += 8;
    });

    // Market Analysis Section
    checkNewPage(40);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Market Analysis', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Calculate some basic statistics
    const upTrends = commodities.filter(c => c.trend === 'up').length;
    const downTrends = commodities.filter(c => c.trend === 'down').length;
    const highImpactNews = news.filter(n => n.impact === 'high').length;
    
    const analysisText = `Market Overview: Of the ${commodities.length} tracked commodities, ${upTrends} are showing upward trends while ${downTrends} are declining. Current trade tensions, as reflected in ${highImpactNews} high-impact news items, continue to influence commodity markets. The ongoing US-Canada trade negotiations and global tariff policies are creating volatility across industrial metals and energy sectors.`;
    
    yPosition = addText(analysisText, margin, yPosition, pageWidth - 2 * margin);
    yPosition += 10;

    // Footer
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Generated by CommodityTracker Pro - Professional Intelligence for Canadian PVF Manufacturers', margin, pageHeight - 10);

    return pdf;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw error;
  }
};

// Helper functions
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

// Function to download the PDF
export const downloadPDFReport = async (commodities, news, tariffs) => {
  try {
    const pdf = await generatePDFReport(commodities, news, tariffs);
    const fileName = `CommodityTracker_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    return fileName;
  } catch (error) {
    console.error('Error downloading PDF report:', error);
    throw error;
  }
};

