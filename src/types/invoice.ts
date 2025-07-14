export type CompanyType = 'Pvt' | 'OPC' | 'LLP' | 'Section-8';

export interface StateInfo {
  name: string;
  fees: {
    Pvt: number;
    OPC: number;
    LLP: number;
    'Section-8': number;
  };
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

export interface BaseFees {
  dsc: number;
  runPanTan: number;
  professionalFee: number;
}

export interface InvoiceData {
  companyType: CompanyType;
  state: {
    name: string;
    fee: number; // The actual fee for the selected company type
  };
  addOns: AddOn[];
  baseFees: BaseFees;
  total: number;
}

export interface CustomerInfo {
  fullName: string;
  contactNumber: string;
}

export interface InvoiceFormData extends InvoiceData {
  customer?: CustomerInfo;
}

// State data with filing fees for different company types
export const STATES: StateInfo[] = [
  { name: 'Andhra Pradesh', fees: { Pvt: 400, OPC: 350, LLP: 300, 'Section-8': 200 } },
  { name: 'Arunachal Pradesh', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Assam', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Bihar', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Chhattisgarh', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Delhi', fees: { Pvt: 360, OPC: 310, LLP: 260, 'Section-8': 180 } },
  { name: 'Goa', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Gujarat', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Haryana', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Himachal Pradesh', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Jharkhand', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Karnataka', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Kerala', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Madhya Pradesh', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Maharashtra', fees: { Pvt: 400, OPC: 350, LLP: 300, 'Section-8': 200 } },
  { name: 'Manipur', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Meghalaya', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Mizoram', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Nagaland', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Odisha', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Punjab', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Rajasthan', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Sikkim', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Tamil Nadu', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Telangana', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Tripura', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Uttar Pradesh', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'Uttarakhand', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
  { name: 'West Bengal', fees: { Pvt: 300, OPC: 250, LLP: 200, 'Section-8': 150 } },
];

// Available add-ons
export const AVAILABLE_ADDONS: Omit<AddOn, 'selected'>[] = [
  { id: 'msme', name: 'MSME', price: 999 },
  { id: 'trademark', name: 'Trademark', price: 1999 },
  { id: 'gst', name: 'GST', price: 2499 },
  { id: 'iso', name: 'ISO', price: 4999 },
  { id: 'startup-india', name: 'Startup India', price: 1499 },
  { id: 'iec', name: 'IEC', price: 1999 },
  { id: 'fssai', name: 'FSSAI', price: 2999 },
  { id: 'gem', name: 'GEM', price: 1999 },
];

// Base fees for different company types
export const BASE_FEES_BY_TYPE: Record<CompanyType, BaseFees> = {
  'Pvt': {
    dsc: 4720,
    runPanTan: 1456,
    professionalFee: 1499,
  },
  'OPC': {
    dsc: 3500,
    runPanTan: 1200,
    professionalFee: 1299,
  },
  'LLP': {
    dsc: 3000,
    runPanTan: 1000,
    professionalFee: 1199,
  },
  'Section-8': {
    dsc: 2500,
    runPanTan: 800,
    professionalFee: 999,
  }
};

// Keep the old BASE_FEES for backward compatibility (defaults to Pvt)
export const BASE_FEES: BaseFees = BASE_FEES_BY_TYPE.Pvt;

// Company types
export const COMPANY_TYPES: CompanyType[] = ['Pvt', 'OPC', 'LLP', 'Section-8'];
