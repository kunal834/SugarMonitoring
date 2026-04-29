import mongoose from 'mongoose';

const Payschema= new mongoose.Schema({
  username: { type: String, required: true },
  
  // The Switch: Once true, manual file negligence is replaced by online data
  isDigital: { type: Boolean, default: false }, 
  
  // The Payment Record (INR)
  amountPaid: { type: Number, default: 0 },
  
  updatedAt: { type: Date, default: Date.now }
});

const Pay = mongoose.model('Pay', Payschema);

export default Pay;