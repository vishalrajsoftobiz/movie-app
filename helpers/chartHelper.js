const JSZip = require('jszip');

class ChartDocxGenerator {
  constructor() {
    this.zip = new JSZip();
  }

  // Generate DOCX with editable chart
  async generateChartDocx(chartData) {
    try {
      // Create the basic DOCX structure
      this.createDocxStructure();
      
      // Add chart data and relationships
      await this.addChartData(chartData);
      
      // Generate the DOCX file buffer
      const buffer = await this.zip.generateAsync({ type: 'nodebuffer' });
      return buffer;
    } catch (error) {
      throw new Error(`Failed to generate chart DOCX: ${error.message}`);
    }
  }

  // Create basic DOCX file structure
  createDocxStructure() {
    // Content Types
    this.zip.file('[Content_Types].xml', this.getContentTypesXml());
    
    // Relationships
    this.zip.file('_rels/.rels', this.getRelsXml());
    
    // Word folder structure
    this.zip.folder('word');
    this.zip.file('word/_rels/document.xml.rels', this.getDocumentRelsXml());
    
    // Charts folder
    this.zip.folder('word/charts');
    this.zip.folder('word/embeddings');
    
    // App properties
    this.zip.file('docProps/app.xml', this.getAppXml());
    this.zip.file('docProps/core.xml', this.getCoreXml());
  }

  // Add chart and embedded Excel data
  async addChartData(chartData) {
    // Create the main document with chart reference
    this.zip.file('word/document.xml', this.getDocumentXml(chartData));
    
    // Create the chart XML
    this.zip.file('word/charts/chart1.xml', this.getChartXml(chartData));
    
    // Create embedded Excel workbook with chart data
    const excelData = await this.getEmbeddedExcelData(chartData);
    this.zip.file('word/embeddings/Microsoft_Excel_Worksheet1.xlsx', excelData);
    
    // Create chart style
    this.zip.file('word/charts/style1.xml', this.getChartStyleXml());
    
    // Create chart colors
    this.zip.file('word/charts/colors1.xml', this.getChartColorsXml());
  }

  // Generate Content Types XML
  getContentTypesXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/charts/chart1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>
  <Override PartName="/word/charts/style1.xml" ContentType="application/vnd.ms-office.chartstyle+xml"/>
  <Override PartName="/word/charts/colors1.xml" ContentType="application/vnd.ms-office.chartcolorstyle+xml"/>
  <Override PartName="/word/embeddings/Microsoft_Excel_Worksheet1.xlsx" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
  }

  // Generate main relationships XML
  getRelsXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;
  }

  // Generate document relationships XML
  getDocumentRelsXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="charts/chart1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/package" Target="embeddings/Microsoft_Excel_Worksheet1.xlsx"/>
</Relationships>`;
  }

  // Generate main document XML with chart
  getDocumentXml(chartData) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" 
            xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" 
            xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" 
            xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart">
  <w:body>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="28"/>
          <w:b/>
        </w:rPr>
        <w:t>${chartData.title}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:drawing>
          <wp:inline distT="0" distB="0" distL="0" distR="0">
            <wp:extent cx="5486400" cy="3200400"/>
            <wp:effectExtent l="0" t="0" r="0" b="0"/>
            <wp:docPr id="1" name="Chart 1"/>
            <wp:cNvGraphicFramePr/>
            <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
              <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
                <c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" 
                         xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="rId1"/>
              </a:graphicData>
            </a:graphic>
          </wp:inline>
        </w:drawing>
      </w:r>
    </w:p>
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;
  }

  // Generate chart XML
  getChartXml(chartData) {
    const seriesXml = chartData.series.map((series, index) => {
      const valuesString = series.values.map(val => `<c:v>${val}</c:v>`).join('');
      const categoriesString = chartData.categories.map(cat => `<c:v>${cat}</c:v>`).join('');
      
      return `
        <c:ser>
          <c:idx val="${index}"/>
          <c:order val="${index}"/>
          <c:tx>
            <c:strRef>
              <c:f>Sheet1!$B$1</c:f>
              <c:strCache>
                <c:ptCount val="1"/>
                <c:pt idx="0">
                  <c:v>${series.name}</c:v>
                </c:pt>
              </c:strCache>
            </c:strRef>
          </c:tx>
          <c:spPr>
            <a:ln w="28575">
              ${series.dashed ? '<a:prstDash val="dash"/>' : ''}
            </a:ln>
            <a:solidFill>
              <a:schemeClr val="${index === 0 ? 'accent1' : 'accent2'}"/>
            </a:solidFill>
          </c:spPr>
          <c:marker>
            <c:symbol val="circle"/>
            <c:size val="5"/>
          </c:marker>
          <c:cat>
            <c:strRef>
              <c:f>Sheet1!$A$2:$A$${chartData.categories.length + 1}</c:f>
              <c:strCache>
                <c:ptCount val="${chartData.categories.length}"/>
                ${chartData.categories.map((cat, i) => `
                <c:pt idx="${i}">
                  <c:v>${cat}</c:v>
                </c:pt>`).join('')}
              </c:strCache>
            </c:strRef>
          </c:cat>
          <c:val>
            <c:numRef>
              <c:f>Sheet1!$${String.fromCharCode(66 + index)}$2:$${String.fromCharCode(66 + index)}$${series.values.length + 1}</c:f>
              <c:numCache>
                <c:formatCode>General</c:formatCode>
                <c:ptCount val="${series.values.length}"/>
                ${series.values.map((val, i) => `
                <c:pt idx="${i}">
                  <c:v>${val}</c:v>
                </c:pt>`).join('')}
              </c:numCache>
            </c:numRef>
          </c:val>
        </c:ser>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" 
              xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" 
              xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <c:date1904 val="0"/>
  <c:lang val="en-US"/>
  <c:roundedCorners val="0"/>
  <c:chart>
    <c:title>
      <c:tx>
        <c:rich>
          <a:bodyPr/>
          <a:lstStyle/>
          <a:p>
            <a:pPr>
              <a:defRPr sz="1800" b="1"/>
            </a:pPr>
            <a:r>
              <a:rPr lang="en-US"/>
              <a:t>${chartData.title}</a:t>
            </a:r>
          </a:p>
        </c:rich>
      </c:tx>
      <c:layout/>
    </c:title>
    <c:autoTitleDeleted val="0"/>
    <c:plotArea>
      <c:layout/>
      <c:lineChart>
        <c:grouping val="standard"/>
        ${seriesXml}
        <c:dLbls>
          <c:showLegendKey val="0"/>
          <c:showVal val="0"/>
          <c:showCatName val="0"/>
          <c:showSerName val="0"/>
          <c:showPercent val="0"/>
          <c:showBubbleSize val="0"/>
        </c:dLbls>
        <c:smooth val="0"/>
        <c:axId val="148921728"/>
        <c:axId val="148923264"/>
      </c:lineChart>
      <c:catAx>
        <c:axId val="148921728"/>
        <c:scaling>
          <c:orientation val="minMax"/>
        </c:scaling>
        <c:delete val="0"/>
        <c:axPos val="b"/>
        <c:majorTickMark val="out"/>
        <c:minorTickMark val="none"/>
        <c:tickLblPos val="nextTo"/>
        <c:crossAx val="148923264"/>
        <c:crosses val="autoZero"/>
        <c:auto val="1"/>
        <c:lblAlgn val="ctr"/>
        <c:lblOffset val="100"/>
        <c:noMultiLvlLbl val="0"/>
      </c:catAx>
      <c:valAx>
        <c:axId val="148923264"/>
        <c:scaling>
          <c:orientation val="minMax"/>
          <c:max val="100"/>
          <c:min val="0"/>
        </c:scaling>
        <c:delete val="0"/>
        <c:axPos val="l"/>
        <c:majorGridlines/>
        <c:numFmt formatCode="General" sourceLinked="1"/>
        <c:majorTickMark val="out"/>
        <c:minorTickMark val="none"/>
        <c:tickLblPos val="nextTo"/>
        <c:crossAx val="148921728"/>
        <c:crosses val="autoZero"/>
        <c:crossBetween val="between"/>
      </c:valAx>
    </c:plotArea>
    <c:legend>
      <c:legendPos val="b"/>
      <c:layout/>
    </c:legend>
    <c:plotVisOnly val="1"/>
    <c:dispBlanksAs val="gap"/>
    <c:showDLblsOverMax val="0"/>
  </c:chart>
  <c:externalData r:id="rId2">
    <c:autoUpdate val="0"/>
  </c:externalData>
</c:chartSpace>`;
  }

  // Generate embedded Excel data (simplified for this example)
  async getEmbeddedExcelData(chartData) {
    // This would normally generate a proper Excel file
    // For now, returning a minimal placeholder that contains the data structure
    const excelZip = new JSZip();
    
    // Create minimal Excel structure
    excelZip.file('[Content_Types].xml', this.getExcelContentTypes());
    excelZip.file('_rels/.rels', this.getExcelRels());
    excelZip.file('xl/workbook.xml', this.getExcelWorkbook());
    excelZip.file('xl/_rels/workbook.xml.rels', this.getExcelWorkbookRels());
    excelZip.file('xl/worksheets/sheet1.xml', this.getExcelWorksheet(chartData));
    excelZip.file('xl/sharedStrings.xml', this.getExcelSharedStrings(chartData));
    excelZip.file('xl/styles.xml', this.getExcelStyles());
    
    return await excelZip.generateAsync({ type: 'nodebuffer' });
  }

  // Excel Content Types
  getExcelContentTypes() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;
  }

  // Excel main relationships
  getExcelRels() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
  }

  // Excel workbook
  getExcelWorkbook() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Sheet1" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;
  }

  // Excel workbook relationships
  getExcelWorkbookRels() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
  }

  // Excel worksheet with chart data
  getExcelWorksheet(chartData) {
    const headerRow = `<row r="1">
      <c r="A1" t="inlineStr"><is><t>Category</t></is></c>
      ${chartData.series.map((series, index) => 
        `<c r="${String.fromCharCode(66 + index)}1" t="inlineStr"><is><t>${series.name}</t></is></c>`
      ).join('')}
    </row>`;

    const dataRows = chartData.categories.map((category, rowIndex) => {
      const rowNum = rowIndex + 2;
      return `<row r="${rowNum}">
        <c r="A${rowNum}" t="inlineStr"><is><t>${category}</t></is></c>
        ${chartData.series.map((series, colIndex) => 
          `<c r="${String.fromCharCode(66 + colIndex)}${rowNum}"><v>${series.values[rowIndex]}</v></c>`
        ).join('')}
      </row>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>
    ${headerRow}
    ${dataRows}
  </sheetData>
</worksheet>`;
  }

  // Excel shared strings
  getExcelSharedStrings(chartData) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="0" uniqueCount="0"/>`;
  }

  // Excel styles
  getExcelStyles() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="0"/>
  <fonts count="1">
    <font>
      <sz val="11"/>
      <name val="Calibri"/>
    </font>
  </fonts>
  <fills count="2">
    <fill>
      <patternFill patternType="none"/>
    </fill>
    <fill>
      <patternFill patternType="gray125"/>
    </fill>
  </fills>
  <borders count="1">
    <border>
      <left/>
      <right/>
      <top/>
      <bottom/>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
  </cellXfs>
</styleSheet>`;
  }

  // Chart style XML
  getChartStyleXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cs:chartStyle xmlns:cs="http://schemas.microsoft.com/office/drawing/2012/chartStyle" id="2"/>`;
  }

  // Chart colors XML
  getChartColorsXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cs:colorStyle xmlns:cs="http://schemas.microsoft.com/office/drawing/2012/chartStyle" id="2"/>`;
  }

  // App properties
  getAppXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Office Word</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0000</AppVersion>
</Properties>`;
  }

  // Core properties
  getCoreXml() {
    const now = new Date().toISOString();
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>Chart Generator</dc:creator>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
  }
}

module.exports = ChartDocxGenerator;