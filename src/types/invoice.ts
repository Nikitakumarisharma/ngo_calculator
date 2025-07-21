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
  subtotal?: number;
  discount?: number;
  hasSpecialOffer?: boolean;
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
  { name: 'Andaman and Nicobar Islands', fees: { Pvt: 520, OPC: 520, LLP: 643, 'Section-8': 20 } },
  { name: 'Andhra Pradesh', fees: { Pvt: 1520, OPC: 1520, LLP: 643, 'Section-8': 1520 } },
  { name: 'Arunachal Pradesh', fees: { Pvt: 710, OPC: 710, LLP: 643, 'Section-8': 710 } },
  { name: 'Assam', fees: { Pvt: 525, OPC: 525, LLP: 643, 'Section-8': 525 } },
  { name: 'Bihar', fees: { Pvt: 1600, OPC: 1600, LLP: 643, 'Section-8': 100 } },
  { name: 'Chandigarh', fees: { Pvt: 1503, OPC: 1503, LLP: 643, 'Section-8': 3 } },
  { name: 'Chhattisgarh', fees: { Pvt: 1510, OPC: 1510, LLP: 643, 'Section-8': 10 } },
  { name: 'Dadar nagar', fees: { Pvt: 41, OPC: 41, LLP: 643, 'Section-8': 1 } },
  { name: 'Daman and Diu', fees: { Pvt: 1170, OPC: 1170, LLP: 643, 'Section-8': 20 } },
  { name: 'Delhi', fees: { Pvt: 360, OPC: 360, LLP: 643, 'Section-8': 10 } },
  { name: 'Goa', fees: { Pvt: 1200, OPC: 1200, LLP: 643, 'Section-8': 50 } },
  { name: 'Gujarat', fees: { Pvt: 820, OPC: 820, LLP: 643, 'Section-8': 20 } },
  { name: 'Haryana', fees: { Pvt: 135, OPC: 135, LLP: 643, 'Section-8': 15 } },
  { name: 'Himachal Pradesh', fees: { Pvt: 183, OPC: 123, LLP: 643, 'Section-8': 3 } },
  { name: 'Jammu and Kashmir', fees: { Pvt: 310, OPC: 310, LLP: 643, 'Section-8': 10 } },
  { name: 'Jharkhand', fees: { Pvt: 173, OPC: 173, LLP: 643, 'Section-8': 5 } },
  { name: 'Karnataka', fees: { Pvt: 10020, OPC: 10020, LLP: 643, 'Section-8': 20 } },
  { name: 'Kerala', fees: { Pvt: 3025, OPC: 3025, LLP: 643, 'Section-8': 3025 } },
  { name: 'Lakshadweep', fees: { Pvt: 1525, OPC: 1525, LLP: 643, 'Section-8': 1525 } },
  { name: 'Madhya Pradesh', fees: { Pvt: 7550, OPC: 7550, LLP: 643, 'Section-8': 7550 } },
  { name: 'Maharashtra', fees: { Pvt: 1300, OPC: 1300, LLP: 643, 'Section-8': 100 } },
  { name: 'Manipur', fees: { Pvt: 260, OPC: 260, LLP: 643, 'Section-8': 260 } },
  { name: 'Meghalaya', fees: { Pvt: 410, OPC: 410, LLP: 643, 'Section-8': 410 } },
  { name: 'Mizoram', fees: { Pvt: 260, OPC: 260, LLP: 643, 'Section-8': 260 } },
  { name: 'Nagaland', fees: { Pvt: 260, OPC: 260, LLP: 643, 'Section-8': 260 } },
  { name: 'Odisha', fees: { Pvt: 610, OPC: 610, LLP: 643, 'Section-8': 610 } },
  { name: 'Puducherry', fees: { Pvt: 510, OPC: 510, LLP: 643, 'Section-8': 10 } },
  { name: 'Punjab', fees: { Pvt: 10025, OPC: 10025, LLP: 643, 'Section-8': 25 } },
  { name: 'Rajasthan', fees: { Pvt: 5500, OPC: 5500, LLP: 643, 'Section-8': 1010 } },
  { name: 'Sikkim', fees: { Pvt: 0, OPC: 0, LLP: 643, 'Section-8': 0 } },
  { name: 'Tamilnadu', fees: { Pvt: 520, OPC: 520, LLP: 643, 'Section-8': 20 } },
  { name: 'Telangana', fees: { Pvt: 1520, OPC: 1520, LLP: 643, 'Section-8': 1520 } },
  { name: 'Tripura', fees: { Pvt: 260, OPC: 260, LLP: 643, 'Section-8': 260 } },
  { name: 'Uttar Pradesh', fees: { Pvt: 1010, OPC: 1010, LLP: 643, 'Section-8': 1010 } },
  { name: 'Uttarakhand', fees: { Pvt: 1010, OPC: 1010, LLP: 643, 'Section-8': 1010 } },
  { name: 'West Bengal', fees: { Pvt: 370, OPC: 370, LLP: 643, 'Section-8': 10 } },
];


// Available add-ons
export const AVAILABLE_ADDONS: Omit<AddOn, 'selected'>[] = [
  { id: 'msme', name: 'MSME', price: 0 },
  { id: 'trademark', name: 'Trademark', price: 1999 },
  { id: 'gst', name: 'GST', price: 2500 },
  { id: 'iso', name: 'ISO', price: 2500 },
  { id: 'startup-india', name: 'Startup India', price: 2999 },
  { id: 'iec', name: 'IEC', price: 2499 },
  { id: 'fssai', name: 'FSSAI', price: 1999 },
  { id: 'gem', name: 'GEM', price: 4999 },
];

// Base fees for different company types
export const BASE_FEES_BY_TYPE: Record<CompanyType, BaseFees> = {
  'Pvt': {
    dsc: 4720,
    runPanTan: 1456,
    professionalFee: 1499,
  },
  'OPC': {
    dsc: 4720,
    runPanTan: 1456,
    professionalFee: 1499,
  },
  'LLP': {
    dsc: 4720,
    runPanTan: 1456,
    professionalFee: 1499,
  },
  'Section-8': {
    dsc: 4720,
    runPanTan: 1456,
    professionalFee: 1499,
  }
};

// Keep the old BASE_FEES for backward compatibility (defaults to Pvt)
export const BASE_FEES: BaseFees = BASE_FEES_BY_TYPE.Pvt;

// Company types
export const COMPANY_TYPES: CompanyType[] = ['Pvt', 'OPC', 'LLP', 'Section-8'];
