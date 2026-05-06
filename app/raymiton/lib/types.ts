export type TransactionType = 'INCOME' | 'EXPENSE';
export type Category = 'Rooms' | 'Bar' | 'Utilities' | 'Supplies' | 'Salaries' | 'Other';
export type PaymentStatus = 'Paid' | 'Not Paid' | 'Part Payment';
export type StayType = 'Night' | 'Short';

export interface ITransaction {
  _id?: string;
  date: string;
  type: TransactionType;
  category: Category;
  description: string;
  totalCharged: number;
  amountPaid: number;
  balanceOwed: number;
  status: PaymentStatus;
  paymentMethod?: 'Cash' | 'Transfer' | 'POS';
  recordedBy?: string;
  stayType?: StayType;
  roomNumber?: number;
  isSnooker?: boolean;
  inventoryItemId?: string; // Legacy/Single item
  quantity?: number; // Legacy/Single item
  items?: {
    inventoryItemId: string;
    name: string;
    quantity: number;
    priceAtTime: number;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IInventoryItem {
  _id?: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  minStockLevel: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomConfig {
  number: number;
  defaultNightPrice: number;
  defaultShortPrice: number;
}

export interface DebtorSummary {
  name: string;
  transactions: ITransaction[];
  totalOwed: number;
  categories: Category[];
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  barRevenue: number;
  barExpenses: number;
  barProfit: number;
  snookerRevenue: number;
  roomRevenue: number;
  totalOutstanding: number;
  transactionCount: number;
}

export const ROOM_DEFAULTS: RoomConfig[] = [
  { number: 1, defaultNightPrice: 15000, defaultShortPrice: 5000 },
  { number: 2, defaultNightPrice: 15000, defaultShortPrice: 5000 },
  { number: 3, defaultNightPrice: 12000, defaultShortPrice: 5000 },
  { number: 4, defaultNightPrice: 12000, defaultShortPrice: 5000 },
  { number: 5, defaultNightPrice: 12000, defaultShortPrice: 5000 },
  { number: 6, defaultNightPrice: 10000, defaultShortPrice: 5000 },
];

export const CATEGORIES: Category[] = ['Rooms', 'Bar', 'Utilities', 'Supplies', 'Salaries', 'Other'];
