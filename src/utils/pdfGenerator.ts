import { InvoiceData, CustomerInfo } from '../types/invoice';

export const generateInvoicePDF = async (invoice: InvoiceData, customer?: CustomerInfo) => {
  try {
    // Dynamic import to avoid SSR issues
    const jsPDF = (await import('jspdf')).default;

    // Create PDF directly without html2canvas
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Helper function to format currency
    const formatCurrency = (amount: number) => `₹ ${amount.toLocaleString('en-IN')}`;

    // Set font
    pdf.setFont('helvetica');

    // Header Section with cream/beige background
    // pdf.setFillColor(245, 242, 230); // Cream/beige color
    // pdf.rect(0, 0, 210, 50, 'F'); // Full width header background

    // Left side - Load and add logo from public folder
    try {
      // Load logo from public folder
      const logoResponse = await fetch('/logo.png');
      const logoBlob = await logoResponse.blob();

      // Convert to base64
      const logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(logoBlob);
      });

      // Add logo to PDF
      pdf.addImage(logoBase64, 'PNG', 20, 10, 25, 25); // x, y, width, height

    } catch (error) {
      // Fallback to styled text if logo fails to load
      console.warn('Logo failed to load, using text fallback:', error);
      pdf.setFontSize(18);
      pdf.setTextColor(220, 20, 60); // Red color for TAX
      pdf.text('Tax', 20, 25);

      pdf.setTextColor(0, 0, 0); // Black color for legit
      pdf.text('legit', 38, 25);
    }

    // Company details next to logo (header left side)
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Taxlegit Consulting Private Limited', 45, 12);
    
    pdf.setFontSize(6);
    pdf.setTextColor(80, 80, 80);
    const companyDetails = [
      '1117, Astralis,',
      'Plot No.94, Sector-94',
      'Noida, Uttar Pradesh-201301',
      'INDIA',
      'CIN: U74999UP2018PTC116737',
      'GST: 09AAJCT8691F1ZN',
      'Email: accounts@gmail.com'
    ];

    companyDetails.forEach((line, index) => {
      pdf.text(line, 45, 16 + (index * 3));
    });

    // Right side - Bill To section (header right side)
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    // Current date
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const rightX = 185;
    let rightY = 15;

    // Date (right aligned)
    const dateText = `Date: ${currentDate}`;
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(dateText, rightX - dateWidth, rightY);

    

    // Bill To section
    rightY += 8;
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    const billToWidth = pdf.getTextWidth('Bill To:');
    pdf.text('Bill To:', rightX - billToWidth, rightY);

    // Customer details (if available)
    if (customer) {
      rightY += 5;
      const customerText = `${customer.fullName}`;
      const customerWidth = pdf.getTextWidth(customerText);
      pdf.text(customerText, rightX - customerWidth, rightY);

      rightY += 4;
      const contactText = `${customer.contactNumber}`;
      const contactWidth = pdf.getTextWidth(contactText);
      pdf.text(contactText, rightX - contactWidth, rightY);
    }

    // Document title
    pdf.setFontSize(20);
    pdf.setTextColor(102, 51, 153); // Purple color
    pdf.text('Quotation', 20, 60); // y-position reduced from 70 to 55

    // Company Info Section
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    let yPos = 70;
    
    pdf.text(`Company Type: ${invoice.companyType}`, 20, yPos);
    
    // Right align state
    const stateText = `State: ${invoice.state.name}`;
    const stateWidth = pdf.getTextWidth(stateText);
    pdf.text(stateText, 185 - stateWidth, yPos);

    // Divider line
    yPos += 10;
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPos, 190, yPos);

    // Fee Breakdown Section
    yPos += 15;
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Fee Breakdown', 20, yPos);

    yPos += 15;
    pdf.setFontSize(10);

    // Base fees with better alignment
    const fees = [
      { label: '2 x DSC Fees', amount: invoice.baseFees.dsc },
      { label: 'RUN + PAN/TAN', amount: invoice.baseFees.runPanTan },
      { label: 'Professional Fees', amount: invoice.baseFees.professionalFee },
      { label: `State Govt Fee (${invoice.state.name})`, amount: invoice.state.fee }
    ];

    fees.forEach((fee) => {
      pdf.text(fee.label, 20, yPos);
      const amountText = formatCurrency(fee.amount);
      const amountWidth = pdf.getTextWidth(amountText);
      pdf.text(amountText, 185 - amountWidth, yPos);
      yPos += 8;
    });

    // Add-ons section
    if (invoice.addOns.length > 0) {
      yPos += 8;
      pdf.setFontSize(12);
      pdf.text('Add-ons:', 20, yPos);
      yPos += 10;

      pdf.setFontSize(10);
      invoice.addOns.forEach((addon) => {
        pdf.text(addon.name, 30, yPos);
        const addonAmountText = formatCurrency(addon.price);
        const addonAmountWidth = pdf.getTextWidth(addonAmountText);
        pdf.text(addonAmountText, 185 - addonAmountWidth, yPos);
        yPos += 8;
      });
    }

    // Separator line before total
    yPos += 10;
    pdf.setLineWidth(1);
    pdf.setDrawColor(150, 150, 150);
    pdf.line(20, yPos, 190, yPos);

    // Total section
    yPos += 15;
    pdf.setFontSize(16);
    pdf.setTextColor(59, 130, 246); // Blue color
    pdf.text('Total Payable:', 20, yPos);

    const totalText = formatCurrency(invoice.total);

    if (invoice.discount && invoice.discount > 0 && invoice.subtotal) {
      // Show subtotal with strikethrough
      pdf.setFontSize(13);
      pdf.setTextColor(220, 38, 38); // Red color
      const subtotalText = formatCurrency(invoice.subtotal);
      const subtotalWidth = pdf.getTextWidth(subtotalText);
      const subtotalX = 185 - subtotalWidth;
      pdf.text(subtotalText, subtotalX, yPos);

      // Draw strikethrough line
      pdf.setDrawColor(220, 38, 38);
      pdf.setLineWidth(0.8);
      pdf.line(subtotalX, yPos - 2, subtotalX + subtotalWidth, yPos - 2);

      // Show discounted total next to subtotal
      pdf.setFontSize(16);
      pdf.setTextColor(59, 130, 246); // Blue color
      const totalWidth = pdf.getTextWidth(totalText);
      pdf.text(totalText, 185 - totalWidth, yPos + 10);
    } else {
      // No discount, show only total
      const totalWidth = pdf.getTextWidth(totalText);
      pdf.text(totalText, 185 - totalWidth, yPos);
    }

    // Footer with red background
    const footerY = 240;
pdf.setFillColor(240, 240, 240); // Very light gray
pdf.rect(0, footerY + 19, 210, 50, 'F'); 

    // Footer content in white text
pdf.setTextColor(0, 0, 0); // Black text
    pdf.setFontSize(10);
    
    let footerLeftY = footerY + 25;
    
    // Left side - Terms & Conditions and Payment Details
    pdf.setFontSize(11);
    pdf.text('Thank you for choosing our services! ', 20, footerLeftY);
    
    footerLeftY += 8;
    pdf.setFontSize(10);
    pdf.text('Payment Details', 20, footerLeftY);
    
    footerLeftY += 5;
    pdf.setFontSize(9);
    const paymentDetails = [
      'Name: Taxlegit Consulting Private Limited',
      'Account No. : 778005500100',
      'IFSC : ICIC0007780',
      'Bank: ICICI Bank, Sector-45 Noida'
    ];

    paymentDetails.forEach((detail, index) => {
      pdf.text(detail, 20, footerLeftY + (index * 4));
    });

    // Right side - Thank you message and contact details
    let footerRightY = footerY + 25;
    pdf.setFontSize(11);
    pdf.text('Contact Details', 150, footerRightY);
    
    footerRightY += 8;
    pdf.setFontSize(9);
    const contactDetails = [
      'Phone: +91 98765 43210',
      'WhatsApp: +91 93040 15295',
      'Email: support@taxlegit.com',
      'Website: www.taxlegit.com',
    ];

    contactDetails.forEach((contact, index) => {
      if (contact) { // Skip empty lines
        pdf.text(contact, 150, footerRightY + (index * 4));
      }
    });

    // Download the PDF
    pdf.save(`Quotation-${invoice.companyType}-${invoice.state.name}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};