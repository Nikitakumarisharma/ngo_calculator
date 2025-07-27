'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FaTimes,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaSpinner
} from 'react-icons/fa';
import { InvoiceData, CustomerInfo } from '../types/invoice';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  invoice: InvoiceData;
  mode?: 'checkout' | 'download'; // New prop to differentiate between modes
}

export default function CheckoutModal({ isOpen, onClose, onSuccess, invoice, mode = 'checkout' }: CheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CustomerInfo>({
    defaultValues: {
      fullName: '',
      contactNumber: ''
    }
  });

  const onSubmit = async (data: CustomerInfo) => {
    setIsSubmitting(true);
    setError('');

    try {
      if (mode === 'download') {
        // For download mode, send contact details via email AND generate PDF
        const response = await fetch('/api/send-invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invoice,
            customer: data,
            mode: 'download' // Add mode to distinguish in API
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to send contact details');
        }

        // Generate and download PDF after sending email
        const { generateInvoicePDF } = await import('../utils/pdfGenerator');
        await generateInvoicePDF(invoice, data);

        // Close modal and reset form
        onClose();
        reset();
        return;
      }

      // For checkout mode, send invoice via API
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice,
          customer: data
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send invoice');
      }

      // Immediately close modal and show preview
      onSuccess?.(); // Call success callback to show preview
      onClose();
      reset();
    } catch (err) {
      console.error('Invoice processing error:', err);
      setError(mode === 'download' ? 'Failed to download PDF. Please try again.' : 'Failed to send invoice. Please try again.');
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
            {mode === 'download' ? 'Download Quotation' : 'Checkout Invoice'}
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
              

              {/* Contact Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="text-blue-500" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('fullName', {
                      required: 'Full name is required',
                      minLength: {
                        value: 2,
                        message: 'Full name must be at least 2 characters'
                      }
                    })}
                    className={`w-full p-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.fullName
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="text-green-500" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    {...register('contactNumber', {
                      required: 'Contact number is required',
                      pattern: {
                        value: /^[6789]\d{9}$/,
                        message: 'Enter a valid 10-digit mobile number'
                      }
                    })}
                    className={`w-full p-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.contactNumber
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-green-500'
                    }`}
                    placeholder="Enter your 10-digit mobile number"
                  />
                  {errors.contactNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>{mode === 'download' ? 'Generating Quotation ...' : 'Generating Invoice...'}</span>
                    </>
                  ) : (
                    <>
                      <FaEnvelope />
                      <span>{mode === 'download' ? 'Download Quotation' : 'Checkout Your Invoice'}</span>
                    </>
                  )}
                </button>
              </form>
        </div>
      </div>
    </div>
  );
}
