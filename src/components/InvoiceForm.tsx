"use client";

import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPlus,
  FaFileInvoice,
  FaUsers,
} from "react-icons/fa";
import {
  ServiceType,
  AddOn,
  InvoiceData,
  STATES,
  AVAILABLE_ADDONS,
  BASE_FEES_BY_TYPE,
  SERVICE_FEES_BY_TYPE,
  SERVICE_TYPES,
} from "../types/invoice";

import MidnightCountdown from "@/components/counter";

interface InvoiceFormProps {
  onInvoiceChange: (
    invoice: InvoiceData,
    hasUserSelections?: { serviceType: boolean; state: boolean },
    personCount?: number
  ) => void;
}

export default function InvoiceForm({ onInvoiceChange }: InvoiceFormProps) {
  // --- STATE MANAGEMENT ---
  // Initialize states with empty strings to allow for placeholders
  const [serviceType, setServiceType] = useState<ServiceType | "">("");
  const [selectedStateName, setSelectedStateName] = useState<string>("");
  const [personCount, setPersonCount] = useState<number>(2); // Counter starts at 2
  const [addOns, setAddOns] = useState<AddOn[]>(
    AVAILABLE_ADDONS.map((addon) => ({ ...addon, selected: false }))
  );

  // Filter add-ons based on selected service
  const getAvailableAddOns = () => {
    if (!serviceType) return addOns;

    // Create a mapping between service types and their add-on IDs
    const serviceToAddonIdMap: Record<string, string> = {
      "CSR-1": "csr-1",
      "12a 80g registration": "12a80g",
      "NGO Darpan": "ngo-darpan",
      "Trust Registration": "trust",
      "Society Registration": "society",
      "E Anudan": "e-anudan",
      "LEI Registration": "lei",
      "Trademark Registration": "trademark",
    };

    const addonIdToHide = serviceToAddonIdMap[serviceType];
    if (addonIdToHide) {
      return addOns.filter((addon) => addon.id !== addonIdToHide);
    }

    return addOns;
  };

  // Check if current service is Section 8 Company Registration
  const isSection8Company = serviceType === "Section 8 Company Registration";

  // Check if current service is one of the special offer services
  const isSpecialOfferService = [
    "12a 80g registration",
    "NGO Darpan",
    "CSR-1",
  ].includes(serviceType);

  useEffect(() => {
    if (serviceType === "") return;

    // For Section 8 Company Registration, state is required
    if (isSection8Company && selectedStateName === "") return;

    const selectedState = isSection8Company
      ? STATES.find((s) => s.name === selectedStateName)
      : null;
    if (isSection8Company && !selectedState) return;

    // --- CALCULATIONS ---
    const selectedAddOns = addOns.filter((addon) => addon.selected);
    const addOnTotal = selectedAddOns.reduce(
      (sum, addon) => sum + addon.price,
      0
    );

    let subtotal = 0;

    if (isSection8Company) {
      // Section 8 Company Registration logic with DSC, RUN PAN TAN, state fees, and person count
      const baseFees = BASE_FEES_BY_TYPE[serviceType];
      const stateFee = selectedState!.fees[serviceType];

      // Calculate additional fees based on person count
      let additionalDscFee = 0;
      let additionalDinFee = 0;

      if (personCount > 2) {
        // DSC logic: After 2 persons, add ₹2360 for each additional person
        additionalDscFee = (personCount - 2) * 2360;
      }

      if (personCount > 3) {
        // DIN logic: After 3 persons, add ₹1180 for each additional person
        additionalDinFee = (personCount - 3) * 1180;
      }

      subtotal =
        baseFees.dsc +
        additionalDscFee +
        baseFees.runPanTan +
        baseFees.professionalFee +
        stateFee +
        addOnTotal +
        additionalDinFee;
    } else {
      // Other services logic - only service price and professional fee
      const serviceFees = SERVICE_FEES_BY_TYPE[serviceType];
      subtotal = serviceFees.price + serviceFees.professionalFee + addOnTotal;
    }

    // --- SPECIAL OFFER LOGIC ---
    let hasSpecialOffer = false;
    let discount = 0;

    if (isSection8Company) {
      // Section 8 Company Registration= ₹2000 off
      const offerAddons = ["12a80g", "ngo-darpan"];
      const selectedOfferAddons = selectedAddOns.filter((addon) =>
        offerAddons.includes(addon.id)
      );
      hasSpecialOffer = selectedOfferAddons.length === 2;
      discount = hasSpecialOffer ? 2000 : 0;
    } else {
      // Check if user has selected the three special services (main service + add-ons)
      const specialServices = ["12a 80g registration", "ngo darpan", "csr-1"];
      // Normalize all selected service names to lower case and trim
      const selectedServices = [
        serviceType,
        ...selectedAddOns.map((addon) => addon.name),
      ].map((s) => s.toLowerCase().trim());

      // Check if all three special services are selected (case-insensitive)
      const hasAllThreeServices = specialServices.every((specialService) =>
        selectedServices.includes(specialService)
      );
      hasSpecialOffer = hasAllThreeServices;
      discount = hasSpecialOffer ? 2000 : 0;
    }

    const total = subtotal - discount;

    // --- FINAL INVOICE DATA ---
    const invoiceData: InvoiceData = {
      serviceType,
      state: {
        name: isSection8Company ? selectedState!.name : "N/A",
        fee: isSection8Company ? selectedState!.fees[serviceType] : 0,
      },
      addOns: selectedAddOns,
      baseFees: isSection8Company ? BASE_FEES_BY_TYPE[serviceType] : undefined,
      serviceFees: !isSection8Company
        ? SERVICE_FEES_BY_TYPE[serviceType]
        : undefined,
      total,
      subtotal,
      discount,
      hasSpecialOffer,
    };

    // Track if user has made selections (not empty strings)
    const hasUserSelections = {
      serviceType: serviceType !== ("" as ServiceType),
      state: selectedStateName !== "",
    };

    onInvoiceChange(invoiceData, hasUserSelections, personCount);
  }, [
    serviceType,
    selectedStateName,
    personCount,
    addOns,
    onInvoiceChange,
    isSection8Company,
    isSpecialOfferService,
  ]);

  // --- HANDLERS ---
  const handleAddOnToggle = (addonId: string) => {
    setAddOns((prev) =>
      prev.map((addon) =>
        addon.id === addonId ? { ...addon, selected: !addon.selected } : addon
      )
    );
  };

  const handlePersonCountChange = (newCount: number) => {
    if (newCount >= 2 && newCount <= 15) {
      setPersonCount(newCount);
    }
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
        {/* Service Type Dropdown */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaBuilding className="text-green-500" />
            <label className="text-base font-semibold text-gray-700">
              Service Type
            </label>
          </div>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ServiceType)}
            className={`w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#C2FEBC] focus:outline-none bg-white ${
              serviceType === "" ? "text-gray-400" : "text-gray-700"
            }`}
          >
            <option value="" disabled>
              -- Select Service Type --
            </option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* State Dropdown - Only show for Section 8 Company Registration */}
        {isSection8Company && (
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
        )}

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
            {getAvailableAddOns()
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

        {/* Offer for special services */}
        {!isSection8Company && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg break-words">
            <div className="text-center">
              <p className="text-blue-700 font-medium text-sm mb-1">
                <span className="font-bold">
                  Grab <span className="text-red-700">₹2,000</span> OFF
                  instantly!
                </span>
                <br />
                Select 12a 80g registration + NGO Darpan + CSR-1 together
              </p>
              <p className="text-gray-700 text-xs">
                Offer expires in &nbsp;
                <MidnightCountdown />
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Person Counter and Offer in same row - Only show for Section 8 Company Registration */}
      {isSection8Company && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Person Counter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaUsers className="text-green-500" />
              <label className="text-base font-semibold text-gray-700">
                Number of Directors
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePersonCountChange(personCount - 1)}
                disabled={personCount <= 2}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold"
              >
                -
              </button>
              <span className="text-lg font-semibold text-gray-700 min-w-[3rem] text-center">
                {personCount}
              </span>
              <button
                onClick={() => handlePersonCountChange(personCount + 1)}
                disabled={personCount >= 15}
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Min: 2, Max: 15 Directors
            </p>
          </div>

          {/* Empty space for middle column */}
          <div></div>

          {/* Offer section */}
          <div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-center">
                <p className="text-blue-700 font-medium text-sm mb-1 font ">
                  <span className="font-bold">
                    {" "}
                    Grab <span className="text-red-700">₹2,000</span> OFF
                    instantly!{" "}
                  </span>
                  Pick 12a&80g + Ngo Darpan together
                </p>
                <p className="text-gray-700 text-xs">
                  Offer expires in&nbsp; <MidnightCountdown />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
