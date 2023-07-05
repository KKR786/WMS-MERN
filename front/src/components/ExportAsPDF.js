import React from 'react';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";

const ExportAsPDF = (props) => {
  const exportToPDF = () => {
    const doc = new jsPDF();

    //Calculate and display the total hours
    const totalHours = props.data.reduce((total, row) => total + parseFloat(row[5]), 0);
    doc.setFontSize(12);
    doc.text(`Total Hours: ${totalHours.toFixed(2)}`, 10, 10);

    // Add the table to the PDF
    doc.autoTable({
        head: props.headers,
        body: props.data
      });
  

     // Generate a Blob object from the PDF data
     const blob = doc.output("blob");
  
     // Create a URL for the Blob object
     const url = URL.createObjectURL(blob);
 
     // Open the PDF in a new tab or window
     window.open(url, "_blank");
 
     // Cleanup: revoke the URL object after a delay
     setTimeout(() => {
       URL.revokeObjectURL(url);
     }, 100);

    // // Save the PDF file
    // doc.save('Report.pdf');
   };

  return (
    <button onClick={exportToPDF} className="btn btn-warning">Export as PDF</button>
  );
};

export default ExportAsPDF;

  