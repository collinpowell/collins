import mongoose, { Schema, Model } from 'mongoose';

export interface ITransactionDoc {
  date: Date;
  type: 'INCOME' | 'EXPENSE';
  category: 'Rooms' | 'Bar' | 'Utilities' | 'Supplies' | 'Salaries' | 'Other';
  description: string;
  totalCharged: number;
  amountPaid: number;
  balanceOwed: number;
  status: 'Paid' | 'Not Paid' | 'Part Payment';
  stayType?: 'Night' | 'Short';
  roomNumber?: number;
  isSnooker: boolean;
  paymentMethod: 'Cash' | 'Transfer' | 'POS';
  recordedBy?: string;
  inventoryItemId?: string;
  quantity?: number;
}

const TransactionSchema = new Schema<ITransactionDoc>(
  {
    date: { type: Date, required: true, index: true },
    type: { type: String, enum: ['INCOME', 'EXPENSE'], required: true },
    category: {
      type: String,
      enum: ['Rooms', 'Bar', 'Utilities', 'Supplies', 'Salaries', 'Other'],
      required: true,
    },
    description: { type: String, required: true },
    totalCharged: { type: Number, required: true },
    amountPaid: { type: Number, required: true, default: 0 },
    balanceOwed: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Paid', 'Not Paid', 'Part Payment'],
      default: 'Paid',
    },
    stayType: { type: String, enum: ['Night', 'Short'] },
    roomNumber: { type: Number, min: 1, max: 6 },
    isSnooker: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ['Cash', 'Transfer', 'POS'], default: 'Cash' },
    recordedBy: { type: String },
    inventoryItemId: { type: String },
    quantity: { type: Number },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate balanceOwed and status before saving
TransactionSchema.pre('save', function () {
  this.balanceOwed = this.totalCharged - this.amountPaid;
  if (this.balanceOwed <= 0) {
    this.status = 'Paid';
    this.balanceOwed = 0;
  } else if (this.amountPaid > 0) {
    this.status = 'Part Payment';
  } else {
    this.status = 'Not Paid';
  }
});

TransactionSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate() as Record<string, unknown>;
  if (update.totalCharged !== undefined && update.amountPaid !== undefined) {
    const charged = update.totalCharged as number;
    const paid = update.amountPaid as number;
    const balance = charged - paid;
    update.balanceOwed = Math.max(0, balance);
    if (balance <= 0) {
      update.status = 'Paid';
    } else if (paid > 0) {
      update.status = 'Part Payment';
    } else {
      update.status = 'Not Paid';
    }
  }
});

const Transaction: Model<ITransactionDoc> =
  mongoose.models.Transaction || mongoose.model<ITransactionDoc>('Transaction', TransactionSchema);

export default Transaction;
