import type { Request } from "express";
interface AuthUser
{
     _id: any;
    name: string;
    email: string;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CustomRequest extends Request
{
    user?: AuthUser | null;
}