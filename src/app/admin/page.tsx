"use client";

import { useState, useCallback, useEffect } from "react";
import InvoiceForm from "@/components/InvoiceForm";
import CheckoutModal from "@/components/CheckoutModal";
import { InvoiceData } from "@/types/invoice";
import { useRouter } from "next/navigation";

// Helper to get cookie
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

export default function Home() {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const [invoice, setInvoice] = useState<InvoiceData>({
    serviceType: "" as unknown as import("@/types/invoice").ServiceType,
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
    finalPrize: 0, // ✅ Added
  });

  const [personCount, setPersonCount] = useState<number>(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"checkout" | "download">("checkout");
  const [userHasSelectedServiceType, setUserHasSelectedServiceType] = useState(false);
  const [userHasSelectedState, setUserHasSelectedState] = useState(false);

  // ✅ Login Check via Cookie
  useEffect(() => {
    const userToken = getCookie("admin-auth-token");
const expectedToken = process.env.NEXT_PUBLIC_ADMIN_AUTH_TOKEN;

    if (!userToken || userToken !== expectedToken) {
      router.push("/login"); // redirect to login if not authenticated
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [router]);

  // ✅ Handle Invoice Updates
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
            if (newInvoice.serviceType === "Section 8 Company") {
              setUserHasSelectedState(hasUserSelections.state);
            } else {
              setUserHasSelectedState(true);
            }
          }

          if (newPersonCount !== undefined) {
            setPersonCount(newPersonCount);
          }

          // ✅ Example Offer Logic: If special offer applies, reduce ₹500
          if (newInvoice.hasSpecialOffer && newInvoice.total > 0) {
            newInvoice.finalPrize = newInvoice.total - 500;
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

  // 🔄 Show loading screen during auth check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user panel...</p>
        </div>
      </div>
    );
  }

  // 🚫 Don't render if unauthenticated (will redirect anyway)
  if (!isAuthenticated) return null;

  // ✅ Render Main Page
  return (
    <div className="w-full bg-white py-4 lg:px-24 md:px-20 sm:px-2">
      <div className="w-full mx-auto">
        <div className="mb-8">
          <InvoiceForm onInvoiceChange={handleInvoiceChange} />
        </div>
{/* Final Prize Input Field - Admin Only */}
<div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Final Offered Prize (Admin Only)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Offered Prize Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={invoice.finalPrize || 0}
                onChange={(e) => {
                  const finalPrize = parseFloat(e.target.value) || 0;
                  setInvoice({ ...invoice, finalPrize });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter final prize amount"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter amount greater than 0 to show in PDF
              </p>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mb-8">
          <div className="flex justify-end gap-4">
            {/* Pay Now Button */}
            

            {/* Download Button */}
            <button
              onClick={() => {
                if (!validateSelections()) return;
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
