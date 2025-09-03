# Chart Generation Feature

## Overview
This feature allows generation of Microsoft Word DOCX files containing editable charts with embedded Excel data.

## API Endpoints

### POST /api/chart/generate-editable-docx
Generates a DOCX file with an editable line chart.

**Request Body:**
```json
{
  "chartData": {
    "title": "Progress Tracking Chart",
    "categories": ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025"],
    "series": [
      {
        "name": "Target Progress",
        "values": [20, 40, 60, 80, 100],
        "dashed": false
      },
      {
        "name": "Actual Progress", 
        "values": [15, 35, 50, 75, 90],
        "dashed": true
      }
    ]
  }
}
```

**Response:**
- Content-Type: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- Returns downloadable DOCX file

### GET /api/chart/sample-data
Returns sample chart data structure for reference.

### GET /api/chart/health
Health check endpoint for the chart generation service.

## Features

### ✅ Editable Charts
- Charts are fully editable in Microsoft Word
- Right-click chart → "Edit Data" to modify values
- Data is stored in embedded Excel worksheet
- Chart updates automatically when data is changed

### ✅ Chart Specifications
- Line chart with markers
- X-axis: Time periods/categories
- Y-axis: Percentage or numeric values
- Support for multiple data series
- Professional styling with title and axis labels
- Dashed line support for series differentiation

### ✅ Office Compatibility
- Full Office Open XML structure
- Compatible with Microsoft Word 2007+
- Embedded Excel worksheet for data editability
- Proper relationships and content types

## Usage Examples

### Generate with Default Data
```bash
curl -X POST http://localhost:4000/api/chart/generate-editable-docx \
  -H "Content-Type: application/json" \
  -d '{}' \
  --output chart.docx
```

### Generate with Custom Data
```bash
curl -X POST http://localhost:4000/api/chart/generate-editable-docx \
  -H "Content-Type: application/json" \
  -d '{
    "chartData": {
      "title": "Sales Report",
      "categories": ["Q1", "Q2", "Q3", "Q4"],
      "series": [
        {
          "name": "Target Sales",
          "values": [100, 150, 200, 250],
          "dashed": false
        },
        {
          "name": "Actual Sales", 
          "values": [80, 140, 180, 240],
          "dashed": true
        }
      ]
    }
  }' \
  --output sales_chart.docx
```

## Validation

The API validates:
- Required fields: title, categories, series
- Categories and series must be arrays
- At least one data series is required
- Series values length must match categories length
- Each series must have name and values

## Technical Implementation

### Dependencies
- `jszip`: For creating DOCX zip structure
- `xml2js`: For XML handling (if needed)

### Files
- `helpers/chartHelper.js`: Core chart generation logic
- `routes/chartRoutes.js`: API endpoints and validation
- `app.js`: Route registration

### Structure
The generated DOCX contains:
- Document with embedded chart
- Chart XML with line chart definition
- Embedded Excel worksheet with source data
- Proper Office Open XML relationships
- Chart styling and colors