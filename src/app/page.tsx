// app/page.tsx or app/home.tsx

"use client";

import { useState, useCallback } from "react";
import InvoiceForm from "../components/InvoiceForm";
import CheckoutModal from "../components/CheckoutModal";
import { InvoiceData, STATES, BASE_FEES_BY_TYPE } from "../types/invoice";

export default function Home() {
  const defaultCompanyType = "Private limited company";
  const defaultBaseFees = BASE_FEES_BY_TYPE[defaultCompanyType];

  const [invoice, setInvoice] = useState<InvoiceData>({
    companyType: defaultCompanyType,
    state: {
      name: STATES[5].name, // Delhi
      fee: STATES[5].fees[defaultCompanyType],
    },
    addOns: [],
    baseFees: defaultBaseFees,
    total:
      defaultBaseFees.dsc +
      defaultBaseFees.runPanTan +
      defaultBaseFees.professionalFee +
      STATES[5].fees[defaultCompanyType],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"checkout" | "download">(
    "checkout"
  );

  const [userHasSelectedCompanyType, setUserHasSelectedCompanyType] =
    useState(false);
  const [userHasSelectedState, setUserHasSelectedState] = useState(false);

  const handleInvoiceChange = useCallback(
    (
      newInvoice: InvoiceData,
      hasUserSelections?: { companyType: boolean; state: boolean }
    ) => {
      setInvoice((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newInvoice)) {
          if (hasUserSelections) {
            setUserHasSelectedCompanyType(hasUserSelections.companyType);
            setUserHasSelectedState(hasUserSelections.state);
          }
          return newInvoice;
        }
        return prev;
      });
    },
    []
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full bg-white py-4 lg:px-24 md:px-20 sm:px-2">
      <div className="w-full mx-auto">
        <div className="mb-8">
          <InvoiceForm onInvoiceChange={handleInvoiceChange} />
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <div className="flex justify-end gap-4">
            {/* Pay Now Button */}
            <button
              onClick={() => {
                if (!userHasSelectedCompanyType || !userHasSelectedState) {
                  alert(
                    "⚠️ Please select both Company Type and State before proceeding to payment!"
                  );
                  return;
                }
                alert("🚀 Payment gateway integration coming soon!");
              }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-md flex items-center justify-center gap-2 lg:text-sm text-[15px]"
            >
              <span>Pay Now </span>
              {invoice.discount && invoice.discount > 0 ? (
                <span className="flex items-center gap-2">
                  <span className="line-through text-red-400 font-semibold ">
                    ₹{invoice.subtotal?.toLocaleString("en-IN")}
                  </span>
                  <span className="text-white font-bold ">
                    ₹{invoice.total.toLocaleString("en-IN")}
                  </span>
                </span>
              ) : (
                <span className="text-sm">
                  ₹{invoice.total.toLocaleString("en-IN")}
                </span>
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={() => {
                if (!userHasSelectedCompanyType || !userHasSelectedState) {
                  alert(
                    "⚠️ Please select both Company Type and State before downloading your quotation!"
                  );
                  return;
                }
                setModalMode("download");
                setIsModalOpen(true);
              }}
              className="bg-black text-white border border-gray-600 font-bold py-2 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 lg:text-sm text-[5px]"
            >
              <span className="text-sm">Download Quotation</span>
            </button>
          </div>
        </div>

        <CheckoutModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          invoice={invoice}
          mode={modalMode}
        />
      </div>
    </div>
  );
}
