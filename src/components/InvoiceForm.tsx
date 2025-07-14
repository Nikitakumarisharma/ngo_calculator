'use client';

import React, { useState, useEffect } from 'react';
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPlus,
  FaFileInvoice
} from 'react-icons/fa';
import { HiLightBulb } from "react-icons/hi";
import {
  CompanyType,
  StateInfo,
  AddOn,
  InvoiceData,
  STATES,
  AVAILABLE_ADDONS,
  BASE_FEES_BY_TYPE,
  COMPANY_TYPES
} from '../types/invoice';

interface InvoiceFormProps {
  onInvoiceChange: (invoice: InvoiceData) => void;
}

export default function InvoiceForm({ onInvoiceChange }: InvoiceFormProps) {
  const [companyType, setCompanyType] = useState<CompanyType>('Pvt');
  const [selectedState, setSelectedState] = useState<StateInfo>(STATES[5]); // Default to Delhi
  const [addOns, setAddOns] = useState<AddOn[]>(
    AVAILABLE_ADDONS.map(addon => ({ ...addon, selected: false }))
  );

  // Calculate total whenever form changes
  useEffect(() => {
    const selectedAddOns = addOns.filter(addon => addon.selected);
    const addOnTotal = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);

    // Get the correct fees for the selected company type
    const baseFees = BASE_FEES_BY_TYPE[companyType];
    const stateFee = selectedState.fees[companyType];
    const total = baseFees.dsc + baseFees.runPanTan + baseFees.professionalFee + stateFee + addOnTotal;

    const invoiceData: InvoiceData = {
      companyType,
      state: {
        name: selectedState.name,
        fee: stateFee
      },
      addOns: selectedAddOns,
      baseFees: baseFees,
      total
    };

    onInvoiceChange(invoiceData);
  }, [companyType, selectedState, addOns, onInvoiceChange]);

  const handleAddOnToggle = (addonId: string) => {
    setAddOns(prev => 
      prev.map(addon => 
        addon.id === addonId 
          ? { ...addon, selected: !addon.selected }
          : addon
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <FaFileInvoice className="text-3xl text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Invoice Generator</h1>
      </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  {/* Company Type */}
  <div>
    <div className="flex items-center gap-2 mb-2">
      <FaBuilding className="text-blue-600" />
      <label className="text-base font-semibold text-gray-700">Company Type</label>
    </div>
    <select
      value={companyType}
      onChange={(e) => setCompanyType(e.target.value as CompanyType)}
      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-700 bg-white"
    >
      {COMPANY_TYPES.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  </div>

  {/* State */}
  <div>
    <div className="flex items-center gap-2 mb-2">
      <FaMapMarkerAlt className="text-green-600" />
      <label className="text-base font-semibold text-gray-700">State</label>
    </div>
    <select
      value={selectedState.name}
      onChange={(e) => {
        const state = STATES.find((s) => s.name === e.target.value);
        if (state) setSelectedState(state);
      }}
      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-700 bg-white"
    >
      {STATES.map((state) => (
        <option key={state.name} value={state.name}>
          {state.name} - State Filing Fee : ₹{state.fees[companyType].toLocaleString()}
        </option>
      ))}
    </select>

  </div>
</div>


      {/* Add-ons Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FaPlus className="text-purple-600" />
          <label className="text-lg font-semibold text-gray-700">Add-ons</label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {addOns.map((addon) => (
            <div
              key={addon.id}
              onClick={() => handleAddOnToggle(addon.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                addon.selected
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {addon.selected ? (
                    <FaCheckCircle className="text-purple-600 text-xl" />
                  ) : (
                    <FaCheckCircle className="text-gray-400 text-xl" />
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${
                      addon.selected ? 'text-purple-700' : 'text-gray-700'
                    }`}>
                      {addon.name}
                    </span>
                   {(addon.id === 'gst' || addon.id === 'trademark' || addon.id === 'msme') && (
  <div className="flex items-center gap-1">
    <HiLightBulb className="text-yellow-500 text-lg" title="Important Service" />
    <span className="text-yellow-600 text-sm font-medium">Recommended</span>
  </div>
)}

                  </div>
                </div>
                <span className={`font-bold ${
                  addon.selected ? 'text-purple-700' : 'text-gray-600'
                }`}>
                  ₹{addon.price.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
