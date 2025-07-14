import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { InvoiceData, CustomerInfo } from '../../../types/invoice';

interface EmailRequest {
  invoice: InvoiceData;
  customer: CustomerInfo;
}

// Create transporter (you'll need to configure this with your email service)
const createTransporter = () => {
  // For development, you can use a service like Gmail, Outlook, or a service like SendGrid
  // For production, use environment variables
  return nodemailer.createTransport({
    // Example configuration for Gmail (you'll need to set up app passwords)
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

const generateInvoiceHTML = (invoice: InvoiceData, customer: CustomerInfo) => {
  const formatCurrency = (amount: number) => `${amount.toLocaleString()}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${customer.fullName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .invoice-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .fee-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .fee-item:last-child { border-bottom: none; }
        .total { background: #e3f2fd; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .total-amount { font-size: 24px; font-weight: bold; color: #1976d2; }
        .addon { color: #4caf50; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧾 Invoice Generated</h1>
          <p>Company Registration Services</p>
        </div>
        
        <div class="content">
          <h2>Customer Details</h2>
          <p><strong>Name:</strong> ${customer.fullName}</p>
          <p><strong>Contact:</strong> ${customer.contactNumber}</p>
          
          <div class="invoice-details">
            <h3>Invoice Details</h3>
            <p><strong>Company Type:</strong> ${invoice.companyType}</p>
            <p><strong>State:</strong> ${invoice.state.name}</p>
            
            <hr style="margin: 20px 0;">
            
            <h4>Fee Breakdown</h4>
            <div class="fee-item">
              <span>2 x DSC Fees</span>
              <span>${formatCurrency(invoice.baseFees.dsc)}</span>
            </div>
            <div class="fee-item">
              <span>RUN + PAN/TAN</span>
              <span>${formatCurrency(invoice.baseFees.runPanTan)}</span>
            </div>
            <div class="fee-item">
              <span>Professional Fees</span>
              <span>${formatCurrency(invoice.baseFees.professionalFee)}</span>
            </div>
            <div class="fee-item">
              <span>State Govt Fee (${invoice.state.name})</span>
              <span>${formatCurrency(invoice.state.fee)}</span>
            </div>
            
            ${invoice.addOns.length > 0 ? `
              <h4 style="margin-top: 20px;">Add-ons</h4>
              ${invoice.addOns.map(addon => `
                <div class="fee-item">
                  <span class="addon">✓ ${addon.name}</span>
                  <span>${formatCurrency(addon.price)}</span>
                </div>
              `).join('')}
            ` : ''}
            
            <div class="total">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 18px; font-weight: bold;">Total Payable:</span>
                <span class="total-amount">${formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
          
          <p style="margin-top: 30px; text-align: center; color: #666;">
            Thank you for choosing our services!<br>
            For any queries, please contact our support team.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    const { invoice, customer }: EmailRequest = await request.json();

    // Validate required fields
    if (!invoice || !customer || !customer.fullName || !customer.contactNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = createTransporter();

    // Generate HTML content
    const htmlContent = generateInvoiceHTML(invoice, customer);

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: process.env.ADMIN_EMAIL || 'admin@yourcompany.com', // Your email to receive invoices
      subject: `New Invoice - ${customer.fullName} (${invoice.companyType} - ${invoice.state.name})`,
      html: htmlContent,
      replyTo: customer.contactNumber // You might want to add customer email field
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Invoice sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice' },
      { status: 500 }
    );
  }
}
