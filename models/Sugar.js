import mongoose from "mongoose";

const sugarLogSchema = new mongoose.Schema({

  userId: { type: String}, // From your email auth
  value: { type: Number, required: true },  // The sugar reading
  unit: { 
    type: String, 
    enum: ['mg/dL', 'mmol/L'], 
    default: 'mg/dL' 
  },
  context: { 
    type: String,   
    enum: ['Fasting', 'Pre-meal', 'Post-meal', 'Bedtime', 'Other'],
    default: 'Other'
  },
  entryDate: { type: Date, default: Date.now },
  notes: { type: String, maxLength: 200 }
});

export const SugarLog = mongoose.model('SugarLog', sugarLogSchema);
