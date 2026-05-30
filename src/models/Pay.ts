import mongoose, { Schema, Document } from 'mongoose';

// 1. Create an interface defining the types of your fields
export interface IPay extends Document {
  username: string;
  isDigital: boolean;
  amountPaid: number;
  updatedAt: Date;
}

// 2. Attach the interface type to your Schema configuration
const Payschema: Schema = new Schema({
  username: { type: String, required: true },
  
  // The Switch: Once true, manual file negligence is replaced by online data
  isDigital: { type: Boolean, default: false }, 
  
  // The Payment Record (INR)
  amountPaid: { type: Number, default: 0 },
  
  updatedAt: { type: Date, default: Date.now }
});

// 3. Pass <IPay> as a generic to mongoose.model so it knows what methods are available
const Pay = mongoose.model<IPay>('Pay', Payschema);

export default Pay;