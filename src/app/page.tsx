"use client";

import { useState, useCallback } from "react";
import InvoiceForm from "../components/InvoiceForm";
import CheckoutModal from "../components/CheckoutModal";
import { InvoiceData } from "../types/invoice";

export default function Home() {
  const [invoice, setInvoice] = useState<InvoiceData>({
    serviceType: "" as unknown as import("../types/invoice").ServiceType,
    state: {
      name: "",
      fee: 0,
    },
    addOns: [],
    baseFees: undefined,
    total: 0,
    subtotal: 0,
    discount: 0,
    hasSpecialOffer: false,
  });

  const [personCount, setPersonCount] = useState<number>(2);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"checkout" | "download">(
    "checkout"
  );

  const [userHasSelectedServiceType, setUserHasSelectedServiceType] =
    useState(false);
  const [userHasSelectedState, setUserHasSelectedState] = useState(false);

  const handleInvoiceChange = useCallback(
    (
      newInvoice: InvoiceData,
      hasUserSelections?: { serviceType: boolean; state: boolean },
      newPersonCount?: number
    ) => {
      setInvoice((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newInvoice)) {
          if (hasUserSelections) {
            setUserHasSelectedServiceType(hasUserSelections.serviceType);
            // Only set state selection if it's Section 8 Company
            if (newInvoice.serviceType === "Section 8 Company") {
              setUserHasSelectedState(hasUserSelections.state);
            } else {
              setUserHasSelectedState(true); // For other services, state is not required
            }
          }
          if (newPersonCount !== undefined) {
            setPersonCount(newPersonCount);
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

  // Check if current service requires state selection
  const isSection8Company = invoice.serviceType === "Section 8 Company";
  const requiresStateSelection = isSection8Company;

  // Validation function
  const validateSelections = () => {
    if (!userHasSelectedServiceType) {
      alert("⚠️ Please select a Service Type before proceeding!");
      return false;
    }

    if (requiresStateSelection && !userHasSelectedState) {
      alert("⚠️ Please select a State before proceeding!");
      return false;
    }

    return true;
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
                if (!validateSelections()) {
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
                if (!validateSelections()) {
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
          personCount={personCount}
        />
      </div>
    </div>
  );
}
