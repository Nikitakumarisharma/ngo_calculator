'use client';

import { useState } from 'react';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import CheckoutModal from '../components/CheckoutModal';
import { InvoiceData, STATES, BASE_FEES_BY_TYPE } from '../types/invoice';

export default function Home() {
  // Initialize with default invoice data so preview shows immediately
  const defaultCompanyType = 'Pvt';
  const defaultBaseFees = BASE_FEES_BY_TYPE[defaultCompanyType];
  const [invoice, setInvoice] = useState<InvoiceData>({
    companyType: defaultCompanyType,
    state: {
      name: STATES[5].name, // Delhi
      fee: STATES[5].fees[defaultCompanyType] // Pvt company fee for Delhi
    },
    addOns: [],
    baseFees: defaultBaseFees,
    total: defaultBaseFees.dsc + defaultBaseFees.runPanTan + defaultBaseFees.professionalFee + STATES[5].fees[defaultCompanyType]
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'checkout' | 'download'>('checkout');
  const [showPreview, setShowPreview] = useState(false);

  const handleInvoiceChange = (newInvoice: InvoiceData) => {
    setInvoice(newInvoice);
  };

  const handleCheckout = () => {
    setModalMode('checkout');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckoutSuccess = () => {
    setShowPreview(true); // Show preview after successful checkout
  };

  return (
    <div className="w-full bg-white py-8 px-4">
      <div className="w-full mx-auto">
        {/* Show Invoice Preview INSTEAD of form after checkout */}
        {showPreview ? (
          <div>
            <InvoicePreview
              invoice={invoice}
            />
          </div>
        ) : (
          <>
            {/* Invoice Form */}
            <div className="mb-8">
              <InvoiceForm onInvoiceChange={handleInvoiceChange} />
            </div>

            {/* Action Buttons */}
            <div className="mb-8">
  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
    {/* Checkout Invoice */}
    <button
      onClick={handleCheckout}
      className="bg-white text-Black border-2 border-gray-800 font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3"
    >
      🛒 Checkout Invoice
    </button>

    {/* Pay Now */}
    <button
      onClick={() => {
        alert('Payment gateway integration coming soon!');
      }}
      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
    >
      💳 Pay Now - ₹{invoice.total.toLocaleString('en-IN')}
    </button>

    {/* Download PDF */}
    <button
      onClick={() => {
        setModalMode('download');
        setIsModalOpen(true);
      }}
      className="bg-black text-white border-2 border-blue-300 font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3"
    >
      📄 Download PDF
    </button>

    {/* WhatsApp Offers */}
    <button
      onClick={() => {
        // Create WhatsApp message
        const message = `Hi! I'm interested in company registration services. I saw the invoice for ${invoice.companyType} company in ${invoice.state.name} with total amount ₹${invoice.total.toLocaleString('en-IN')}. Can you provide exclusive offers?`;
        const whatsappUrl = `https://wa.me/919304015295?text=${encodeURIComponent(message)}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
      }}
      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3"
    >
      📱 WhatsApp Us for Offers
    </button>
  </div>
</div>

          </>
        )}

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleCheckoutSuccess}
          invoice={invoice}
          mode={modalMode}
        />
      </div>
    </div>
  );
}
