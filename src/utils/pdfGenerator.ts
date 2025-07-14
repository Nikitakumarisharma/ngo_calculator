import { InvoiceData } from '../types/invoice';

export const generateInvoicePDF = async (invoice: InvoiceData) => {
  try {
    // Dynamic import to avoid SSR issues
    const jsPDF = (await import('jspdf')).default;

    // Create PDF directly without html2canvas
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Helper function to format currency
    const formatCurrency = (amount: number) => `${amount.toLocaleString('en-IN')}`;

    // Set font
    pdf.setFont('helvetica');

    // Header Section
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
      pdf.addImage(logoBase64, 'PNG', 20, 5, 35, 20); // x, y, width, height
    } catch (error) {
      // Fallback to styled text if logo fails to load
      console.warn('Logo failed to load, using text fallback:', error);
      pdf.setFontSize(20);
      pdf.setTextColor(0, 102, 204); // Blue color for branding
      pdf.text('TAX', 20, 25);

      pdf.setTextColor(255, 102, 0); // Orange color
      pdf.text('LEGIT', 35, 25);
    }

    // Right side - Company Address
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const addressLines = [
      '1117, Supertech Astralis, Sec-94,',
      'Noida, Uttar Pradesh-201301'
    ];

    // Right align address
    addressLines.forEach((line, index) => {
      const textWidth = pdf.getTextWidth(line);
      pdf.text(line, 190 - textWidth, 20 + (index * 5));
    });

    // Header line separator
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, 35, 190, 35);

    // Document title
    pdf.setFontSize(18);
    pdf.setTextColor(59, 130, 246); // Blue color
    pdf.text('Quotation', 20, 50);

    // Company Info
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Company Type: ${invoice.companyType}`, 20, 65);
    pdf.text(`State: ${invoice.state.name}`, 120, 65);

    // Divider
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, 75, 190, 75);

    // Fee Breakdown
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Fee Breakdown', 20, 90);

    let yPos = 105;
    pdf.setFontSize(11);

    // Base fees
    pdf.text('2 x DSC Fees', 20, yPos);
    pdf.text(formatCurrency(invoice.baseFees.dsc), 150, yPos);
    yPos += 8;

    pdf.text('RUN + PAN/TAN', 20, yPos);
    pdf.text(formatCurrency(invoice.baseFees.runPanTan), 150, yPos);
    yPos += 8;

    pdf.text('Professional Fees', 20, yPos);
    pdf.text(formatCurrency(invoice.baseFees.professionalFee), 150, yPos);
    yPos += 8;

    pdf.text(`State Govt Fee (${invoice.state.name})`, 20, yPos);
    pdf.text(formatCurrency(invoice.state.fee), 150, yPos);
    yPos += 15;

    // Add-ons
    if (invoice.addOns.length > 0) {
      pdf.setFontSize(12);
      pdf.text('Add-ons:', 20, yPos);
      yPos += 10;

      pdf.setFontSize(11);
      invoice.addOns.forEach((addon) => {
        pdf.text(`✓ ${addon.name}`, 25, yPos);
        pdf.text(formatCurrency(addon.price), 150, yPos);
        yPos += 8;
      });
      yPos += 10;
    }

    // Total
    pdf.setLineWidth(1);
    pdf.line(20, yPos, 190, yPos);
    yPos += 10;

    pdf.setFontSize(16);
    pdf.setTextColor(59, 130, 246);
    pdf.text('Total Payable:', 20, yPos);
    pdf.text(formatCurrency(invoice.total), 150, yPos);

    // Footer with contact details
    yPos += 20;

    // Footer separator line
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPos, 190, yPos);

    yPos += 10;

    // Thank you message
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Thank you for choosing our services!', 20, yPos);

    yPos += 10;

    // Contact section
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Contact Us:', 20, yPos);

    yPos += 8;

    // Phone number (clickable)
    pdf.setTextColor(0, 102, 204); // Blue for links
    pdf.textWithLink('Phone: +91 98765 43210', 20, yPos, { url: 'tel:+919876543210' });

    // Email (clickable)
    pdf.textWithLink('Email: support@taxlegit.com', 100, yPos, { url: 'mailto:support@taxlegit.com' });

    yPos += 8;

    // WhatsApp (clickable)
    pdf.setTextColor(34, 139, 34); // Green for WhatsApp
    const whatsappMessage = `Hi! I need help with ${invoice.companyType} company registration in ${invoice.state.name}. Total amount: ${formatCurrency(invoice.total)}`;
    const whatsappUrl = `https://wa.me/919304015295?text=${encodeURIComponent(whatsappMessage)}`;
    pdf.textWithLink('WhatsApp: +91 93040 15295', 20, yPos, { url: whatsappUrl });

    // Website
    pdf.setTextColor(0, 102, 204);
    pdf.textWithLink('Website: www.taxlegit.com', 100, yPos, { url: 'https://taxlegit.com' });

    // Download the PDF
    pdf.save(`Invoice-${invoice.companyType}-${invoice.state.name}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};
