import { NextResponse } from 'next/server';
import { getVulnerabilities } from '@/app/actions/projects';
import { PDFDocument, PDFPage, RGB, rgb, StandardFonts } from 'pdf-lib';

export async function GET() {
  try {
    const vulnerabilities = await getVulnerabilities();
    
    const doc = await PDFDocument.create();
    
    // Embed fonts properly
    const helvetica = await doc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
    
    // Fetch and embed the logo
    const logoResponse = await fetch('https://sdmntpreastus2.oaiusercontent.com/files/00000000-ee0c-61f6-9d15-fe5840944efa/raw?se=2025-04-15T10%3A45%3A03Z&sp=r&sv=2024-08-04&sr=b&scid=d58ae80b-1ac0-5617-b774-09a3624aae3a&skoid=3f3a9132-9530-48ef-96b7-fee5a811733f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-04-15T01%3A21%3A56Z&ske=2025-04-16T01%3A21%3A56Z&sks=b&skv=2024-08-04&sig=g4ZH2FlrZ%2BYZAQ/W2sThkejtXSij5oUeVps/QT8yVrw%3D');
    const logoImageBytes = await logoResponse.arrayBuffer();
    const logoImage = await doc.embedPng(logoImageBytes);
    
    // Get logo dimensions
    const logoDims = logoImage.scale(0.5); // Scale down to 50%
    
    // Colors
    const darkBlue = rgb(0.07, 0.15, 0.34);
    const lightBlue = rgb(0.85, 0.9, 0.95);
    const white = rgb(1, 1, 1);
    const black = rgb(0, 0, 0);
    const lightGray = rgb(0.95, 0.95, 0.95);
    const mediumGray = rgb(0.8, 0.8, 0.8);
    const darkGray = rgb(0.4, 0.4, 0.4);
    
    // Severity colors
    type SeverityType = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
    const severityColors: Record<SeverityType, RGB> = {
      'Critical': rgb(0.8, 0.1, 0.1),
      'High': rgb(0.9, 0.4, 0.1),
      'Medium': rgb(0.95, 0.74, 0.2),
      'Low': rgb(0.3, 0.6, 0.9),
      'Info': rgb(0.5, 0.5, 0.5)
    };
    
    type StatusType = 'Open' | 'In Progress' | 'Fixed' | 'Closed' | 'Won\'t Fix';
    const statusColors: Record<StatusType, RGB> = {
      'Open': rgb(0.8, 0.1, 0.1),
      'In Progress': rgb(0.95, 0.74, 0.2),
      'Fixed': rgb(0.2, 0.7, 0.2),
      'Closed': rgb(0.5, 0.5, 0.5),
      'Won\'t Fix': rgb(0.4, 0.4, 0.6)
    };

    // Helper function for text wrapping that handles newlines
    const drawWrappedText = (page: PDFPage, text: string, options: { x: any; y: any; width: any; size: any; font: any; color: any; lineHeight: any; }) => {
      const { x, y, width, size, font, color, lineHeight } = options;
      
      // Handle null/undefined text
      if (!text) return y;
      
      // Split text into lines first
      const textLines = text.split('\n');
      let currentY = y;
      
      for (const textLine of textLines) {
        const words = textLine.split(' ');
        let line = '';
        
        for (const word of words) {
          const testLine = line + (line ? ' ' : '') + word;
          const testWidth = font.widthOfTextAtSize(testLine, size);
          
          if (testWidth > width && line !== '') {
            page.drawText(line.trim(), { x, y: currentY, size, font, color });
            line = word;
            currentY -= lineHeight;
          } else {
            line = testLine;
          }
        }
        
        if (line) {
          page.drawText(line.trim(), { x, y: currentY, size, font, color });
          currentY -= lineHeight;
        }
      }
      
      return currentY;
    };

    const drawRoundedRect = (page: PDFPage, { x, y, width, height, color, radius = 0, borderColor, borderWidth = 0 }: { x: number; y: number; width: number; height: number; color: RGB; radius: number; borderColor?: RGB; borderWidth?: number; }) => {
      // If no radius specified, draw a regular rectangle
      if (radius === 0) {
        page.drawRectangle({ x, y, width, height, color, borderColor, borderWidth });
        return;
      }
      
      // Draw main rectangle (slightly smaller to account for rounded corners)
      page.drawRectangle({
        x: x + radius,
        y: y,
        width: width - 2 * radius,
        height: height,
        color
      });
      
      // Draw horizontal rectangles for left and right sides
      page.drawRectangle({
        x: x,
        y: y + radius,
        width: radius,
        height: height - 2 * radius,
        color
      });
      
      page.drawRectangle({
        x: x + width - radius,
        y: y + radius,
        width: radius,
        height: height - 2 * radius,
        color
      });
      
      // Draw four corner circles
      const corners = [
        { cx: x + radius, cy: y + radius },                   // bottom-left
        { cx: x + width - radius, cy: y + radius },           // bottom-right
        { cx: x + radius, cy: y + height - radius },          // top-left
        { cx: x + width - radius, cy: y + height - radius }   // top-right
      ];
      
      corners.forEach(corner => {
        page.drawCircle({
          x: corner.cx,
          y: corner.cy,
          size: radius,
          color
        });
      });
      
      // Add border if specified
      if (borderColor && borderWidth > 0) {
        // Draw border lines (this is simplified and won't perfectly match rounded corners)
        // Top
        page.drawLine({
          start: { x: x + radius, y: y + height },
          end: { x: x + width - radius, y: y + height },
          thickness: borderWidth,
          color: borderColor
        });
        
        // Bottom
        page.drawLine({
          start: { x: x + radius, y: y },
          end: { x: x + width - radius, y: y },
          thickness: borderWidth,
          color: borderColor
        });
        
        // Left
        page.drawLine({
          start: { x: x, y: y + radius },
          end: { x: x, y: y + height - radius },
          thickness: borderWidth,
          color: borderColor
        });
        
        // Right
        page.drawLine({
          start: { x: x + width, y: y + radius },
          end: { x: x + width, y: y + height - radius },
          thickness: borderWidth,
          color: borderColor
        });
      }
    };
    
    // Create cover page
    let page = doc.addPage([595.28, 841.89]); // A4 size
    
    // Add solid header with more height
    page.drawRectangle({
      x: 0,
      y: page.getHeight() - 350, // Increased height
      width: page.getWidth(),
      height: 350,
      color: darkBlue,
    });

    // Draw logo instead of placeholder
    page.drawImage(logoImage, {
      x: 50,
      y: page.getHeight() - 120,
      width: 80,
      height: 80,
    });

    // Remove the old company text that was in the placeholder
    // Delete or comment out this section:
    /*
    page.drawText('COMPANY', {
      x: 60,
      y: page.getHeight() - 85,
      size: 14,
      font: helveticaBold,
      color: darkGray,
    });
    */

    // Add title with better spacing and alignment
    const title1Width = helveticaBold.widthOfTextAtSize('SECURE CODE REVIEW', 42); // Increased font size
    const title2Width = helveticaBold.widthOfTextAtSize('VULNERABILITY REPORT', 42);
    const centerX = page.getWidth() / 2;

    // Moved titles up
    page.drawText('SECURE CODE REVIEW', {
      x: centerX - (title1Width / 2),
      y: page.getHeight() - 180,
      size: 42,
      font: helveticaBold,
      color: white,
    });

    page.drawText('VULNERABILITY REPORT', {
      x: centerX - (title2Width / 2),
      y: page.getHeight() - 240,
      size: 42,
      font: helveticaBold,
      color: white,
    });

    // Add date with adjusted positioning
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    page.drawText(`Report Generated: ${date}`, {
      x: centerX - (helvetica.widthOfTextAtSize(`Report Generated: ${date}`, 12) / 2),
      y: page.getHeight() - 320,
      size: 12,
      font: helvetica,
      color: lightGray,
    });

    // Add summary box with adjusted positioning and increased height
    drawRoundedRect(page, {
      x: 50,
      y: page.getHeight() - 520, // Moved down
      width: page.getWidth() - 100,
      height: 150, // Increased height
      color: lightBlue,
      radius: 8,
      borderColor: darkBlue,
      borderWidth: 1
    });

    // Summary header with adjusted positioning
    page.drawText('EXECUTIVE SUMMARY', {
      x: 70,
      y: page.getHeight() - 460, // Adjusted position
      size: 16,
      font: helveticaBold,
      color: darkBlue,
    });

    // Statistics grid with better spacing and adjusted positioning
    const stats = [
      { label: 'Total Vulnerabilities', value: vulnerabilities.length },
      { label: 'Critical', value: vulnerabilities.filter(v => v.severity === 'Critical').length },
      { label: 'High', value: vulnerabilities.filter(v => v.severity === 'High').length },
      { label: 'Medium', value: vulnerabilities.filter(v => v.severity === 'Medium').length },
      { label: 'Low', value: vulnerabilities.filter(v => v.severity === 'Low').length }
    ];

    // Convert cm to PDF points (1 cm ≈ 28.346 points)
    const moveLeft = 28.346 * 1.5; // 1.5 cm left
    const moveDown = 28.346 * 7;   // Increased to 7 cm down (from 6)

    // Calculate total width of all boxes and spacing
    const boxWidth = 90;
    const boxSpacing = 20; // Space between boxes
    const totalBoxes = stats.length;
    const totalWidth = (boxWidth * totalBoxes) + (boxSpacing * (totalBoxes - 1));
    
    // Calculate starting X position to center the boxes
    let statX = centerX - (totalWidth / 2);
    let statY = page.getHeight() - 650;

    // Draw stats grid title centered
    const titleWidth = helveticaBold.widthOfTextAtSize('VULNERABILITY STATISTICS', 14);
    page.drawText('VULNERABILITY STATISTICS', {
      x: centerX - (titleWidth / 2),
      y: statY + 60,
      size: 14,
      font: helveticaBold,
      color: darkBlue,
    });

    stats.forEach((stat, index) => {
      const boxColor = index === 0 ? darkBlue : 
        severityColors[stat.label as SeverityType] || darkGray;
      
      // Centered boxes with consistent spacing
      drawRoundedRect(page, {
        x: statX,
        y: statY - 5,
        width: boxWidth,
        height: 40,
        color: rgb(0.98, 0.98, 0.98),
        radius: 4,
        borderColor: boxColor,
        borderWidth: 1.5
      });

      // Center the value in the box
      const valueWidth = helveticaBold.widthOfTextAtSize(stat.value.toString(), 20);
      page.drawText(stat.value.toString(), {
        x: statX + (boxWidth - valueWidth) / 2,
        y: statY + 12,
        size: 20,
        font: helveticaBold,
        color: boxColor,
      });

      // Center the label text
      const labelWidth = helvetica.widthOfTextAtSize(stat.label, 9);
      page.drawText(stat.label, {
        x: statX + (boxWidth - labelWidth) / 2,
        y: statY - 3,
        size: 9,
        font: helvetica,
        color: darkGray,
      });

      statX += boxWidth + boxSpacing; // Move to next box position with spacing
    });

    // Add company name at bottom (single instance)
    const companyText = 'SEKIATO';
    const companyTextWidth = helveticaBold.widthOfTextAtSize(companyText, 28); // Increased size
    
    // Single company name with better positioning
    page.drawText(companyText, {
      x: centerX - (companyTextWidth / 2),
      y: 100,
      size: 28,
      font: helveticaBold,
      color: darkBlue,
    });

    // Add subtle divider line above company name
    page.drawLine({
      start: { x: centerX - 100, y: 140 },
      end: { x: centerX + 100, y: 140 },
      thickness: 1,
      color: mediumGray,
    });

    // Add footer
    page.drawRectangle({
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: 50,
      color: darkBlue,
    });

    const confidentialText = 'CONFIDENTIAL';
    page.drawText(confidentialText, {
      x: centerX - (helveticaBold.widthOfTextAtSize(confidentialText, 12) / 2),
      y: 20,
      size: 12,
      font: helveticaBold,
      color: white,
    });

    // Add table of contents page
    page = doc.addPage([595.28, 841.89]);
    
    // Header
    page.drawRectangle({
      x: 0,
      y: page.getHeight() - 60,
      width: page.getWidth(),
      height: 60,
      color: darkBlue,
    });
    
    page.drawText('TABLE OF CONTENTS', {
      x: 50,
      y: page.getHeight() - 35,
      size: 18,
      font: helveticaBold,
      color: white,
    });

    // List all findings
    let tocY = page.getHeight() - 100;
    
    page.drawText('Executive Summary', {
      x: 50,
      y: tocY,
      size: 14,
      font: helveticaBold,
      color: darkBlue,
    });
    
    page.drawText('Page 1', {
      x: page.getWidth() - 80,
      y: tocY,
      size: 12,
      font: helvetica,
      color: black,
    });
    
    tocY -= 20;
    
    vulnerabilities.forEach((vuln, index) => {
      const color = severityColors[vuln.severity as SeverityType] || darkGray;
      
      // Draw severity indicator
      page.drawRectangle({
        x: 45,
        y: tocY - 5,
        width: 10,
        height: 10,
        color,
      });
      
      page.drawText(`Finding ${index + 1}: ${vuln.title}`, {
        x: 65,
        y: tocY,
        size: 12,
        font: helvetica,
        color: black,
      });
      
      page.drawText(`Page ${index + 3}`, {
        x: page.getWidth() - 80,
        y: tocY,
        size: 12,
        font: helvetica,
        color: black,
      });
      
      tocY -= 25;
      
      // Add new page if needed
      if (tocY < 100) {
        page = doc.addPage([595.28, 841.89]);
        
        // Header
        page.drawRectangle({
          x: 0,
          y: page.getHeight() - 60,
          width: page.getWidth(),
          height: 60,
          color: darkBlue,
        });
        
        page.drawText('TABLE OF CONTENTS (CONTINUED)', {
          x: 50,
          y: page.getHeight() - 35,
          size: 18,
          font: helveticaBold,
          color: white,
        });
        
        tocY = page.getHeight() - 100;
      }
    });

    // Add footer
    page.drawRectangle({
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: 40,
      color: darkBlue,
    });
    
    page.drawText('CONFIDENTIAL', {
      x: page.getWidth() / 2 - 40,
      y: 15,
      size: 12,
      font: helveticaBold,
      color: white,
    });

    // Draw each vulnerability on a new page
    vulnerabilities.forEach((vuln, index) => {
      page = doc.addPage([595.28, 841.89]);
      
      // Page header with minimal info
      page.drawRectangle({
        x: 0,
        y: page.getHeight() - 60,
        width: page.getWidth(),
        height: 60,
        color: darkBlue,
      });
      
      // Finding number (simplified)
      page.drawText(`Finding ${index + 1}`, {
        x: 50,
        y: page.getHeight() - 35,
        size: 16,
        font: helveticaBold,
        color: white,
      });

      let y = page.getHeight() - 100;

      // Title section with more spacing
      drawRoundedRect(page, {
        x: 40,
        y: y - 20,
        width: page.getWidth() - 80,
        height: 50,
        color: lightBlue,
        radius: 5
      });
      
      page.drawText(vuln.title, {
        x: 50,
        y: y,
        size: 16,
        font: helveticaBold,
        color: darkBlue,
      });
      
      y -= 90; // Increased spacing after title

      // Metadata boxes with better layout
      const metaBoxWidth = (page.getWidth() - 120) / 2;
      
      // Severity box
      drawRoundedRect(page, {
        x: 50,
        y: y,
        width: metaBoxWidth,
        height: 60,
        color: lightGray,
        radius: 5
      });
      
      const severityColor = severityColors[vuln.severity as SeverityType] || darkGray;
      page.drawText(vuln.severity || 'Unknown', {
        x: 70,
        y: y + 20,
        size: 14,
        font: helveticaBold,
        color: severityColor,
      });

      // Status box
      drawRoundedRect(page, {
        x: 70 + metaBoxWidth,
        y: y,
        width: metaBoxWidth,
        height: 60,
        color: lightGray,
        radius: 5
      });
      
      const statusColor = statusColors[(vuln.status as StatusType) ?? 'Closed'] || darkGray;
      page.drawText(vuln.status || 'Unknown', {
        x: 90 + metaBoxWidth,
        y: y + 20,
        size: 14,
        font: helveticaBold,
        color: statusColor,
      });
      
      y -= 90; // Increased spacing after metadata

      // Location with cleaner design
      if (vuln.location) {
        page.drawText('Location', {
          x: 50,
          y: y,
          size: 12,
          font: helveticaBold,
          color: darkBlue,
        });
        
        y -= 25;
        
        page.drawText(vuln.location, {
          x: 50,
          y,
          size: 11,
          font: helvetica,
          color: black,
        });
        
        y -= 40;
      }

      // Description with better formatting
      if (vuln.description) {
        page.drawText('Description', {
          x: 50,
          y,
          size: 12,
          font: helveticaBold,
          color: darkBlue,
        });
        
        y -= 25;
        
        // Clean up description text
        const cleanDescription = vuln.description
          .replace(/[\u{0080}-\u{FFFF}]/gu, '') // Remove unsupported chars
          .replace(/\*\*/g, '') // Remove markdown bold
          .replace(/```[^`]*```/g, '') // Remove code blocks
          .split('\n')
          .filter(line => line.trim()) // Remove empty lines
          .join('\n\n'); // Add paragraph spacing
        
        y = drawWrappedText(page, cleanDescription, {
          x: 50,
          y,
          width: page.getWidth() - 120, // Increased margins
          size: 11,
          font: helvetica,
          color: black,
          lineHeight: 18 // Increased line height
        });
        
        y -= 40;
      }

      // Recommendations with better spacing
      if (vuln.description) { // Using description field instead since recommendations is not available
        page.drawText('Recommendations', {
          x: 50,
          y,
          size: 12,
          font: helveticaBold,
          color: darkBlue,
        });
        
        y -= 25;
        
        const cleanRecommendations = (vuln.description || '')
          .replace(/[\u{0080}-\u{FFFF}]/gu, '')
          .replace(/\d+\.\s+/g, '• ') // Replace numbers with bullets
          .split('\n')
          .filter(line => line.trim())
          .join('\n\n');
        
        drawWrappedText(page, cleanRecommendations, {
          x: 50,
          y,
          width: page.getWidth() - 120,
          size: 11,
          font: helvetica,
          color: black,
          lineHeight: 18
        });
      }

      // Minimal footer
      page.drawRectangle({
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: 30,
        color: darkBlue,
      });
    });

    // Save the PDF
    const pdfBytes = await doc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="vulnerability-report.pdf"',
      },
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}