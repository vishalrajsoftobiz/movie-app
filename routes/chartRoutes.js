const express = require('express');
const router = express.Router();
const ChartDocxGenerator = require('../helpers/chartHelper');

// Sample chart data (matches the requirement)
const sampleChartData = {
  title: "Progress Tracking Chart",
  categories: ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025"],
  series: [
    {
      name: "Target Progress",
      values: [20, 40, 60, 80, 100],
      dashed: false
    },
    {
      name: "Actual Progress", 
      values: [15, 35, 50, 75, 90],
      dashed: true
    }
  ]
};

// Generate editable DOCX with chart
router.post('/generate-editable-docx', async (req, res) => {
  try {
    // Use provided chart data or fall back to sample data
    const chartData = req.body.chartData || sampleChartData;
    
    // Validate chart data structure
    if (!chartData.title || !chartData.categories || !chartData.series) {
      return res.status(400).json({ 
        message: 'Invalid chart data. Required: title, categories, series' 
      });
    }

    if (!Array.isArray(chartData.categories) || !Array.isArray(chartData.series)) {
      return res.status(400).json({ 
        message: 'Categories and series must be arrays' 
      });
    }

    if (chartData.series.length === 0) {
      return res.status(400).json({ 
        message: 'At least one data series is required' 
      });
    }

    // Validate that all series have the same length as categories
    for (const series of chartData.series) {
      if (!series.name || !Array.isArray(series.values)) {
        return res.status(400).json({ 
          message: 'Each series must have a name and values array' 
        });
      }
      
      if (series.values.length !== chartData.categories.length) {
        return res.status(400).json({ 
          message: 'Series values length must match categories length' 
        });
      }
    }

    // Generate the DOCX file
    const generator = new ChartDocxGenerator();
    const docxBuffer = await generator.generateChartDocx(chartData);

    // Set appropriate headers for file download
    const filename = `chart_${Date.now()}.docx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', docxBuffer.length);

    // Send the file
    res.send(docxBuffer);

  } catch (error) {
    console.error('Error generating chart DOCX:', error);
    res.status(500).json({ 
      message: 'Failed to generate chart DOCX',
      error: error.message 
    });
  }
});

// Get sample chart data (for testing/reference)
router.get('/sample-data', (req, res) => {
  res.json({
    message: 'Sample chart data structure',
    sampleData: sampleChartData,
    usage: {
      endpoint: 'POST /api/chart/generate-editable-docx',
      body: {
        chartData: sampleChartData
      }
    }
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Chart generation service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;