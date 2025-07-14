'use client';

import React from 'react';
import {
  FaReceipt,
  FaCertificate,
  FaUserTie,
  FaUniversity,
  FaCheckCircle,
  FaShoppingCart,
  FaDownload,
  FaCreditCard,
  FaWhatsapp
} from 'react-icons/fa';
import { InvoiceData } from '../types/invoice';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface InvoicePreviewProps {
  invoice: InvoiceData;
  onCheckout?: () => void;
}

export default function InvoicePreview({ invoice, onCheckout }: InvoicePreviewProps) {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const downloadPDF = async () => {
    try {
      await generateInvoicePDF(invoice);
    } catch {
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 w-full mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaReceipt className="text-3xl text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">Invoice Preview</h2>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-gray-500">Company Type:</span>
            <p className="text-lg font-semibold text-gray-800">{invoice.companyType}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">State:</span>
            <p className="text-lg font-semibold text-gray-800">{invoice.state.name}</p>
          </div>
        </div>
        
      </div>

      {/* Fee Breakdown */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Breakdown</h3>
        
        {/* Base Fees */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCertificate className="text-orange-500" />
              <span className="text-gray-700">2 x DSC Fees</span>
            </div>
            <span className="font-semibold text-gray-800">
              {formatCurrency(invoice.baseFees.dsc)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaUserTie className="text-blue-500" />
              <span className="text-gray-700">RUN + PAN/TAN</span>
            </div>
            <span className="font-semibold text-gray-800">
              {formatCurrency(invoice.baseFees.runPanTan)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaUserTie className="text-green-500" />
              <span className="text-gray-700">Professional Fees</span>
            </div>
            <span className="font-semibold text-gray-800">
              {formatCurrency(invoice.baseFees.professionalFee)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaUniversity className="text-purple-500" />
              <span className="text-gray-700">State Govt Fee</span>
            </div>
            <span className="font-semibold text-gray-800">
              {formatCurrency(invoice.state.fee)}
            </span>
          </div>
        </div>

        {/* Add-ons */}
        {invoice.addOns.length > 0 && (
          <>
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h4 className="text-md font-semibold text-gray-700 mb-3">Add-ons:</h4>
              <div className="space-y-2">
                {invoice.addOns.map((addon) => (
                  <div key={addon.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 text-sm" />
                      <span className="text-gray-700">{addon.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(addon.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Divider */}
        <div className="border-t-2 border-gray-300 pt-4">
          
          
          {/* Total */}
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg">
            <span className="text-xl font-bold text-gray-800">Total Payable:</span>
            <span className="text-2xl font-bold text-indigo-600">
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Optional Checkout Button - only show if onCheckout is provided */}
      {onCheckout && (
        <button
          onClick={onCheckout}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
        >
          <FaShoppingCart className="text-xl" />
          <span className="text-lg">Checkout Invoice</span>
        </button>
      )}
      </div>

     {/* Action Buttons */}
<div className="mt-6 max-w-4xl mx-auto">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {/* Pay Now Button */}
    <button
      onClick={() => {
        alert('Payment gateway integration coming soon!');
      }}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl  shadow-lg flex items-center justify-center gap-3 w-full"
    >
      <FaCreditCard className="text-lg" />
      <span>Pay Now - {formatCurrency(invoice.total)}</span>
    </button>

    {/* Download PDF Button */}
    <button
      onClick={downloadPDF}
      className="bg-black text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 w-full"
    >
      <FaDownload className="text-lg" />
      <span>Download PDF</span>
    </button>

    {/* WhatsApp Offers Button */}
    <button
      onClick={async () => {
        try {
          await generateInvoicePDF(invoice);
          const message = `Hi! I'm interested in company registration services. I saw the invoice for ${invoice.companyType} company in ${invoice.state.name} with total amount ${formatCurrency(invoice.total)}. I've downloaded the PDF invoice. Can you provide exclusive offers?`;
          const whatsappUrl = `https://wa.me/919304015295?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
          alert('PDF downloaded! WhatsApp opened with your message. Please attach the downloaded PDF to your WhatsApp message.');
        } catch (error) {
          console.error('Error:', error);
          const message = `Hi! I'm interested in company registration services for ${invoice.companyType} company in ${invoice.state.name} with total amount ${formatCurrency(invoice.total)}. Can you provide exclusive offers?`;
          const whatsappUrl = `https://wa.me/919304015295?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        }
      }}
      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 w-full"
    >
      <FaWhatsapp className="text-lg" />
      <span>WhatsApp Us for Offers</span>
    </button>
  </div>
</div>

    </div>
  );
}
