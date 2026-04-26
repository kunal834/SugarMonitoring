import { usermodel } from "../models/User.js";
import type { CustomRequest } from "../types/authuserreq.js";
import type { Response, NextFunction } from "express"; // Import these!
import jwt from "jsonwebtoken";

// Define what is inside your JWT token
interface TokenPayload {
  userId: string;

}

export const isAuthenticated = async (
  req: CustomRequest,
  res: Response, // Changed from any
  next: NextFunction // Changed from any
) => {
  const { session } = req.cookies;

  try {
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Login first",
      });
    }

    // 1. Cast the decoded data so TS knows 'userId' exists
    const decodeddata = jwt.verify(
      session,
      process.env.JWT_SECRET!
    ) as TokenPayload;

    // 2. Fetch user and cast it to your AuthUser type
    const user = await usermodel.findById(decodeddata.userId);
    console.log("Decoded User ID:", decodeddata.userId); // Debugging line
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Assign to req.user (TS now accepts this because of the cast)
    req.user = user as any; 

    next();
  } catch (error: any) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid session",
    });
  }
};