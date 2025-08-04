"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaTimes,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaSpinner,
} from "react-icons/fa";
import { InvoiceData, CustomerInfo } from "../types/invoice";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData;
  mode?: "checkout" | "download"; // New prop to differentiate between modes
  personCount?: number; // Add person count prop
}

export default function CheckoutModal({
  isOpen,
  onClose,
  invoice,
  mode = "checkout",
  personCount = 2,
}: CheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CustomerInfo>({
    defaultValues: {
      fullName: "",
      contactNumber: "",
    },
  });

  // Watch form values to enable/disable button
  const watchedValues = watch();
  const isFormValid = watchedValues.fullName && watchedValues.contactNumber;

  const onSubmit = async (data: CustomerInfo) => {
    setIsSubmitting(true);
    setError("");

    try {
      if (mode === "download") {
        // 1. Submit to Zoho CRM form (for lead capture)
        const zohoFormData = new FormData();
        zohoFormData.append("Name", data.fullName);
        zohoFormData.append("PhoneNumber", data.contactNumber);
        zohoFormData.append("Company_Type", invoice.companyType);
        zohoFormData.append("State", invoice.state.name);
        zohoFormData.append("Total_Amount", invoice.total.toString());
        zohoFormData.append(
          "Add_Ons",
          invoice.addOns.map((addon) => addon.name).join(", ")
        );
        zohoFormData.append(
          "Has_Special_Offer",
          invoice.hasSpecialOffer ? "Yes" : "No"
        );

        // Submit to Zoho CRM
        fetch(
          "https://forms.zohopublic.com/taxlegit21/form/quotationformtaxlegit/formperma/EODZTjWYbJ98Fp2ONUSP35ewCftNgkUvYsdll5PxLH8/submit",
          {
            method: "POST",
            body: zohoFormData,
            mode: "no-cors",
          }
        ).catch(() => {
          // Ignore CORS errors as form submission still works
        });

        // 2. Send email with quotation details
        const emailResponse = await fetch("/api/send-invoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invoice,
            customer: data,
            mode: "download", // Add mode to distinguish in API
          }),
        });

        if (!emailResponse.ok) {
          console.warn(
            "Failed to send email, but continuing with PDF download"
          );
        }

        // 3. Generate and download PDF with person count
        const { generateInvoicePDF } = await import("../utils/pdfGenerator");
        await generateInvoicePDF(invoice, data, personCount);

        // Close modal and reset form
        onClose();
        reset();
        return;
      }

      // For checkout mode, just show success message
      alert("🚀 Payment gateway integration coming soon!");
      onClose();
      reset();
    } catch (err) {
      console.error("Processing error:", err);
      setError(
        mode === "download"
          ? "Failed to download PDF. Please try again."
          : "Failed to process request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === "download" ? "Download Quotation" : "Checkout Invoice"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Invoice Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Your Quotation Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Company Type:</span>
                <span className="font-medium">{invoice.companyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">State:</span>
                <span className="font-medium">{invoice.state.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Directors:</span>
                <span className="font-medium">{personCount}</span>
              </div>

              {/* <div className="flex justify-between border-t pt-2">
                <span className="text-gray-800 font-semibold">
                  Total Amount:
                </span>
                <span className="font-bold text-green-600">
                  ₹{invoice.total.toLocaleString("en-IN")}
                </span>
              </div> */}
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaUser className="text-blue-500" />
                Full Name
              </label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                })}
                className={`w-full p-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.fullName
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500"
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="text-green-500" />
                Contact Number
              </label>
              <input
                type="tel"
                {...register("contactNumber", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[6789]\d{9}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                })}
                className={`w-full p-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.contactNumber
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-green-500"
                }`}
                placeholder="Enter your 10-digit mobile number"
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>
                    {mode === "download"
                      ? "Generating Quotation..."
                      : "Processing..."}
                  </span>
                </>
              ) : (
                <>
                  <FaEnvelope />
                  <span>
                    {mode === "download"
                      ? "Get Your Quotation"
                      : "Checkout Your Invoice"}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
