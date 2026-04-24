// models/User.js
import {Schema , model }from "mongoose";

interface IUser {
    email: string;
    name?: string;
    age?: number;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const schema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        unique:true
    },
    // REMOVE 'required' from these for now
    name: { type: String, trim: true }, 
    age: { type: Number },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export const usermodel = model<IUser>("User", schema);