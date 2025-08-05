export type ServiceType =
  | "Section 8 Company"
  | "12a 80g registration"
  | "NGO Darpan"
  | "CSR-1"
  | "Trust Registration"
  | "Society Registration"
  | "E Anudan"
  | "LEI"
  | "Trademark Registration";

export interface StateInfo {
  name: string;
  fees: {
    "Section 8 Company": number;
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

export interface ServiceFees {
  price: number;
  professionalFee: number;
}

export interface InvoiceData {
  serviceType: ServiceType;
  state: {
    name: string;
    fee: number;
  };
  addOns: AddOn[];
  baseFees?: BaseFees;
  serviceFees?: ServiceFees;
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
  {
    name: "Andaman and Nicobar Islands",
    fees: {
      "Section 8 Company": 20,
    },
  },
  {
    name: "Andhra Pradesh",
    fees: {
      "Section 8 Company": 1520,
    },
  },
  {
    name: "Arunachal Pradesh",
    fees: {
      "Section 8 Company": 710,
    },
  },
  {
    name: "Assam",
    fees: {
      "Section 8 Company": 525,
    },
  },
  {
    name: "Bihar",
    fees: {
      "Section 8 Company": 100,
    },
  },
  {
    name: "Chandigarh",
    fees: {
      "Section 8 Company": 3,
    },
  },
  {
    name: "Chhattisgarh",
    fees: {
      "Section 8 Company": 10,
    },
  },
  {
    name: "Dadar nagar",
    fees: {
      "Section 8 Company": 1,
    },
  },
  {
    name: "Daman and Diu",
    fees: {
      "Section 8 Company": 20,
    },
  },
  {
    name: "Delhi",
    fees: {
      "Section 8 Company": 10,
    },
  },
  {
    name: "Goa",
    fees: {
      "Section 8 Company": 50,
    },
  },
  {
    name: "Gujarat",
    fees: {
      "Section 8 Company": 20,
    },
  },
  {
    name: "Haryana",
    fees: {
      "Section 8 Company": 15,
    },
  },
  {
    name: "Himachal Pradesh",
    fees: {
      "Section 8 Company": 3,
    },
  },
  {
    name: "Jammu and Kashmir",
    fees: {
      "Section 8 Company": 10,
    },
  },
  {
    name: "Jharkhand",
    fees: {
      "Section 8 Company": 5,
    },
  },
  {
    name: "Karnataka",
    fees: {
      "Section 8 Company": 20,
    },
  },
  {
    name: "Kerala",
    fees: {
      "Section 8 Company": 3025,
    },
  },
  {
    name: "Lakshadweep",
    fees: {
      "Section 8 Company": 1525,
    },
  },
  {
    name: "Madhya Pradesh",
    fees: {
      "Section 8 Company": 7550,
    },
  },
  {
    name: "Maharashtra",
    fees: {
      "Section 8 Company": 100,
    },
  },
  {
    name: "Manipur",
    fees: {
      "Section 8 Company": 260,
    },
  },
  {
    name: "Meghalaya",
    fees: {
      "Section 8 Company": 410,
    },
  },
  {
    name: "Mizoram",
    fees: {
      "Section 8 Company": 260,
    },
  },
  {
    name: "Nagaland",
    fees: {
      "Section 8 Company": 260,
    },
  },
  {
    name: "Odisha",
    fees: {
      "Section 8 Company": 610,
    },
  },
  {
    name: "Puducherry",
    fees: {
      "Section 8 Company": 10,
    },
  },
  {
    name: "Punjab",
    fees: {
      "Section 8 Company": 25,
    },
  },
  {
    name: "Rajasthan",
    fees: {
      "Section 8 Company": 1010,
    },
  },
  {
    name: "Sikkim",
    fees: {
      "Section 8 Company": 0,
    },
  },
  {
    name: "Tamilnadu",
    fees: {
      "Section 8 Company": 20,
    },
  },
  {
    name: "Telangana",
    fees: {
      "Section 8 Company": 1520,
    },
  },
  {
    name: "Tripura",
    fees: {
      "Section 8 Company": 260,
    },
  },
  {
    name: "Uttar Pradesh",
    fees: {
      "Section 8 Company": 1010,
    },
  },
  {
    name: "Uttarakhand",
    fees: {
      "Section 8 Company": 1010,
    },
  },
  {
    name: "West Bengal",
    fees: {
      "Section 8 Company": 10,
    },
  },
];

// Available add-ons
export const AVAILABLE_ADDONS: Omit<AddOn, "selected">[] = [
  { id: "msme", name: "MSME Registration", price: 0 },
  { id: "trademark", name: "Trademark Registration", price: 2499 },
  { id: "gst", name: "GST Registration", price: 2500 },
  { id: "iso", name: "ISO Registration", price: 2500 },
  { id: "startup-india", name: "Startup India Filing", price: 2999 },
  { id: "iec", name: "IEC Registration", price: 2499 },
  { id: "fssai", name: "FSSAI Registration", price: 1999 },
  { id: "gem", name: "GEM Registration", price: 4999 },
  { id: "csr-1", name: "CSR-1", price: 4500 },
  { id: "12a80g", name: "12a 80g registration", price: 9000 },
  { id: "ngo-darpan", name: "Ngo Darpan", price: 2500 },
  { id: "trust", name: "Trust Registration", price: 15000 },
  { id: "society", name: "Society Registration", price: 25000 },
  { id: "e-anudan", name: "E Anudan", price: 2000 },
  { id: "lei", name: "LEI", price: 2000 },
];

// Base fees for Section 8 Company (only service that needs DSC, RUN PAN TAN, etc.)
export const BASE_FEES_BY_TYPE: Record<"Section 8 Company", BaseFees> = {
  "Section 8 Company": {
    dsc: 4720,
    runPanTan: 2456,
    professionalFee: 2499,
  },
};

// Service fees for other services (fixed prices)
export const SERVICE_FEES_BY_TYPE: Record<
  Exclude<ServiceType, "Section 8 Company">,
  ServiceFees
> = {
  "12a 80g registration": {
    price: 9000,
    professionalFee: 2499,
  },
  "NGO Darpan": {
    price: 2500,
    professionalFee: 2499,
  },
  "CSR-1": {
    price: 4500,
    professionalFee: 2499,
  },
  "Trust Registration": {
    price: 15000,
    professionalFee: 2499,
  },
  "Society Registration": {
    price: 25000,
    professionalFee: 2499,
  },
  "E Anudan": {
    price: 2000,
    professionalFee: 2499,
  },
  LEI: {
    price: 2000,
    professionalFee: 2499,
  },
  "Trademark Registration": {
    price: 2499,
    professionalFee: 2499,
  },
};

export const BASE_FEES: BaseFees = BASE_FEES_BY_TYPE["Section 8 Company"];

// Service types
export const SERVICE_TYPES: ServiceType[] = [
  "Section 8 Company",
  "12a 80g registration",
  "NGO Darpan",
  "CSR-1",
  "Trust Registration",
  "Society Registration",
  "E Anudan",
  "LEI",
  "Trademark Registration",
];
