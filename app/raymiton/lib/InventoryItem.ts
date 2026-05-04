import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryItem extends Document {
  name: string;
  price: number;
  stock: number;
  category: string;
  minStockLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true, default: 'General' },
    minStockLevel: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.models.InventoryItem || mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);
