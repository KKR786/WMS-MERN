import React from 'react';
import { jsPDF } from 'jspdf';

const ExportAsPDF = (props) => {
    const exportToPDF = () => {
        const doc = new jsPDF();
      
        // Set the table font size and style
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
      
        // Set the table starting position and row height
        const startX = 10;
        const startY = 20;
        const rowHeight = 10;
      
        // Define the column widths
        const columnWidths = [25, 20, 50, 15, 25, 15, 25, 25]; // Adjust the values as needed
      
        // Create the table header
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(0, 123, 255);
        doc.rect(startX, startY, columnWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
        doc.setTextColor(0, 0, 0);
        let currentX = startX;
        props.columns.forEach((column, index) => {
          doc.text(currentX + columnWidths[index] / 2, startY + rowHeight / 2 + 2, column, 'center');
          currentX += columnWidths[index];
        });
      
        // Create the table rows
        doc.setTextColor(0, 0, 0);
        props.rows.forEach((row, rowIndex) => {
          const y = startY + (rowIndex + 1) * rowHeight;
          let currentX = startX;
          row.forEach((column, columnIndex) => {
            doc.text(currentX + columnWidths[columnIndex] / 2, y + rowHeight / 2 + 2, String(column), 'center');
            currentX += columnWidths[columnIndex];
          });
        });
      
        // Calculate and display the total hours
        const totalHours = props.rows.reduce((total, row) => total + parseFloat(row[5]), 0);
        doc.text(startX, startY + (props.rows.length + 1) * rowHeight + 5, `Total Hours: ${totalHours.toFixed(2)}`);
      
        // Save the PDF file
        doc.save('Report.pdf');
      };
      

  return (
    <button onClick={exportToPDF}>Export as PDF</button>
  );
};

export default ExportAsPDF;
