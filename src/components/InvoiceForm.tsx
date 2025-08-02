// app/components/InvoiceForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPlus,
  FaFileInvoice,
} from "react-icons/fa";
import {
  CompanyType,
  AddOn,
  InvoiceData,
  STATES,
  AVAILABLE_ADDONS,
  BASE_FEES_BY_TYPE,
  COMPANY_TYPES,
} from "../types/invoice";

interface InvoiceFormProps {
  onInvoiceChange: (
    invoice: InvoiceData,
    hasUserSelections?: { companyType: boolean; state: boolean }
  ) => void;
}

export default function InvoiceForm({ onInvoiceChange }: InvoiceFormProps) {
  // --- STATE MANAGEMENT ---
  // Initialize states with empty strings to allow for placeholders
  const [companyType, setCompanyType] = useState<CompanyType | "">("");
  const [selectedStateName, setSelectedStateName] = useState<string>("");
  const [addOns, setAddOns] = useState<AddOn[]>(
    AVAILABLE_ADDONS.map((addon) => ({ ...addon, selected: false }))
  );

  useEffect(() => {
    if (companyType === "" || selectedStateName === "") return;

    const selectedState = STATES.find((s) => s.name === selectedStateName);
    if (!selectedState) return;

    // --- CALCULATIONS ---
    const selectedAddOns = addOns.filter((addon) => addon.selected);
    const addOnTotal = selectedAddOns.reduce(
      (sum, addon) => sum + addon.price,
      0
    );

    const baseFees = BASE_FEES_BY_TYPE[companyType];
    const stateFee = selectedState.fees[companyType];
    const subtotal =
      baseFees.dsc +
      baseFees.runPanTan +
      baseFees.professionalFee +
      stateFee +
      addOnTotal;

    // --- SPECIAL OFFER LOGIC ---
    const offerAddons = ["trademark", "iso", "startup-india", "iec"];
    const selectedOfferAddons = selectedAddOns.filter((addon) =>
      offerAddons.includes(addon.id)
    );
    const hasSpecialOffer = selectedOfferAddons.length === 4;
    const discount = hasSpecialOffer ? 2000 : 0;
    const total = subtotal - discount;

    // --- FINAL INVOICE DATA ---
    const invoiceData: InvoiceData = {
      companyType,
      state: {
        name: selectedState.name,
        fee: stateFee,
      },
      addOns: selectedAddOns,
      baseFees,
      total,
      subtotal,
      discount,
      hasSpecialOffer,
    };

    // Track if user has made selections (not empty strings)
    const hasUserSelections = {
      companyType: companyType !== "",
      state: selectedStateName !== "",
    };

    onInvoiceChange(invoiceData, hasUserSelections);
  }, [companyType, selectedStateName, addOns, onInvoiceChange]);

  // --- HANDLERS ---
  const handleAddOnToggle = (addonId: string) => {
    setAddOns((prev) =>
      prev.map((addon) =>
        addon.id === addonId ? { ...addon, selected: !addon.selected } : addon
      )
    );
  };

  // --- JSX / RENDER ---
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <FaFileInvoice className="text-3xl text-green-500" />
        <h1 className="text-3xl font-bold text-[#7C5128]">
          Quotation Generator
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Company Type Dropdown */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaBuilding className="text-green-500" />
            <label className="text-base font-semibold text-gray-700">
              Company Type
            </label>
          </div>
          <select
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value as CompanyType)}
            className={`w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#C2FEBC] focus:outline-none bg-white ${
              companyType === "" ? "text-gray-400" : "text-gray-700"
            }`}
          >
            <option value="" disabled>
              -- Select Company Type --
            </option>
            {COMPANY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* State Dropdown */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaMapMarkerAlt className="text-green-600" />
            <label className="text-base font-semibold text-gray-700">
              State
            </label>
          </div>
          <select
            value={selectedStateName}
            onChange={(e) => setSelectedStateName(e.target.value)}
            className={`w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#C2FEBC] focus:outline-none  ${
              selectedStateName === "" ? "text-gray-400" : "text-gray-700"
            }`}
          >
            <option value="" disabled>
              -- Select State --
            </option>
            {STATES.map((state) => (
              <option key={state.name} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add-ons Dropdown */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaPlus className="text-green-500 text-sm" />
            <label className="text-base font-semibold text-[#7C5128]">
              Add-ons
            </label>
          </div>
          <select
            onChange={(e) => handleAddOnToggle(e.target.value)}
            value="" // Always reset to show the placeholder
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-700 bg-white"
          >
            <option value="" disabled>
              -- Select an Add-on --
            </option>
            {addOns
              .filter((addon) => !addon.selected) // Hide already selected add-ons
              .map((addon) => (
                <option key={addon.id} value={addon.id}>
                  {addon.name} (₹{addon.price.toLocaleString("en-IN")})
                </option>
              ))}
          </select>
          {addOns.some((addon) => addon.selected) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {addOns
                .filter((addon) => addon.selected)
                .map((addon) => (
                  <span
                    key={addon.id}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full"
                  >
                    {addon.name}
                    <button
                      onClick={() => handleAddOnToggle(addon.id)}
                      className="ml-2 text-red-400 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Special Offer Banner */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-center">
          <p className="text-blue-700 font-medium text-sm mb-1">
            🎯 Select 4 services — Trademark, ISO, Startup India, IEC — and get
            ₹2,000 OFF instantly!
          </p>
          <p className="text-blue-600 text-xs">
            ⏰ Applicable for today - until 12 AM tonight
          </p>
        </div>
      </div>
    </div>
  );
}
