import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISessionDoc extends Document {
  date: string;
  status: 'OPEN' | 'CLOSED';
  openingBalance: number;
  closingBalance: number;
  actualCashAtClose?: number;
  openedBy: string;
  closedBy?: string;
  startTime: Date;
  endTime?: Date;
  summary?: {
    totalIncome: number;
    totalExpense: number;
    cashIncome: number;
    transferIncome: number;
    posIncome: number;
  };
}

const SessionSchema = new Schema<ISessionDoc>(
  {
    date: { type: String, required: true, unique: true },
    status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
    openingBalance: { type: Number, default: 0 },
    closingBalance: { type: Number, default: 0 },
    actualCashAtClose: { type: Number },
    openedBy: { type: String, required: true },
    closedBy: { type: String },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    summary: {
      totalIncome: { type: Number, default: 0 },
      totalExpense: { type: Number, default: 0 },
      cashIncome: { type: Number, default: 0 },
      transferIncome: { type: Number, default: 0 },
      posIncome: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Session: Model<ISessionDoc> =
  mongoose.models.Session || mongoose.model<ISessionDoc>('Session', SessionSchema);

export default Session;
