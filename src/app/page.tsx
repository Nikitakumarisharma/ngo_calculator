// app/page.tsx or app/home.tsx

'use client';

import { useState, useCallback } from 'react';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import CheckoutModal from '../components/CheckoutModal';
import { InvoiceData, STATES, BASE_FEES_BY_TYPE } from '../types/invoice';

export default function Home() {
  const defaultCompanyType = 'Pvt';
  const defaultBaseFees = BASE_FEES_BY_TYPE[defaultCompanyType];
  const [invoice, setInvoice] = useState<InvoiceData>({
    companyType: defaultCompanyType,
    state: {
      name: STATES[5].name, // Delhi
      fee: STATES[5].fees[defaultCompanyType]
    },
    addOns: [],
    baseFees: defaultBaseFees,
    total: defaultBaseFees.dsc + defaultBaseFees.runPanTan + defaultBaseFees.professionalFee + STATES[5].fees[defaultCompanyType],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'checkout' | 'download'>('checkout');
  const [showPreview, setShowPreview] = useState(false);

  const handleInvoiceChange = useCallback((newInvoice: InvoiceData) => {
    setInvoice(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(newInvoice)) {
        return newInvoice;
      }
      return prev;
    });
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckoutSuccess = () => {
    setShowPreview(true);
  };

  return (
    <div className="w-full bg-white py-4 lg:px-24 md:px-20 sm:px-2">
      <div className="w-full mx-auto">
        {showPreview ? (
          <InvoicePreview invoice={invoice} />
        ) : (
          <>
            <div className="mb-8">
              <InvoiceForm onInvoiceChange={handleInvoiceChange} />
            </div>

            {(invoice.hasSpecialOffer || invoice.discount) && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                  🎉 Price Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="text-gray-700">₹{invoice.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  {invoice.discount && invoice.discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-medium">Special Offer Discount:</span>
                      <span className="text-green-600 font-bold">-₹{invoice.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="border-t border-green-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-700">Final Total:</span>
                      <span className="text-xl font-bold text-green-700">₹{invoice.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  {invoice.hasSpecialOffer && (
                    <div className="bg-green-100 p-2 rounded-lg text-center">
                      <span className="text-green-700 font-medium text-sm">
                        🎊 You saved ₹{invoice.discount?.toLocaleString('en-IN')} with our special offer!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    alert('Payment gateway integration coming soon!');
                  }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
                >
                  💳 Pay Now - ₹{invoice.total.toLocaleString('en-IN')}
                </button>

                <button
                  onClick={() => {
                    setModalMode('download');
                    setIsModalOpen(true);
                  }}
                  className="bg-black text-white border-2 border-blue-300 font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3"
                >
                  📄 Download PDF
                </button>

                <button
                  onClick={() => {
                    const message = `Hi! I'm interested in company registration services. I saw the invoice for ${invoice.companyType} company in ${invoice.state.name} with total amount ₹${invoice.total.toLocaleString('en-IN')}. Can you provide exclusive offers?`;
                    const whatsappUrl = `https://wa.me/919304015295?text=${encodeURIComponent(message)}`;
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
