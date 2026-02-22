// models/User.js
import mongoose from "mongoose";

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    // REMOVE 'required' from these for now
    name: { type: String, trim: true }, 
    age: { type: Number },


    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export const usermodel = mongoose.model("User", schema);