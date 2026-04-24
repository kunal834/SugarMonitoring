
import {Schema , model , Types}from "mongoose";
interface ISugarLog {
  userId:Types.ObjectId; // From your email auth
  value: number;  // The sugar reading
  unit: 'mg/dL' | 'mmol/L'; // Unit of measurement
  context: 'Fasting' | 'Pre-meal' | 'Post-meal' | 'Bedtime' | 'Other'; // Context of the reading
  entryDate: Date; // When the reading was taken  
  notes?: string; // Optional notes about the reading
}

const sugarLogSchema = new Schema<ISugarLog>({

 userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // From your email auth
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

export const SugarLog = model<ISugarLog>('SugarLog', sugarLogSchema);