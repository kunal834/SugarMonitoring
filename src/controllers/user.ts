
import { usermodel } from "../models/User.js";

import jwt from 'jsonwebtoken';

import 'dotenv/config'; // Add this at the very top
// Step 1: Send the Link  
import { Resend } from 'resend';
import type { Request, Response }  from "express";
import type { CustomRequest } from "../types/authuserreq.js";
const resend = new Resend(process.env.RESEND_API_KEY);


export const login = async (req: CustomRequest, res: Response) => {
  const { email, name, age } = req.body;
  try {
    const magicToken = jwt.sign({ email, name, age }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
    const magicLink = `${process.env.BACKEND_URL}/api/users/verify?token=${magicToken}`;

console.log("Attempting to send to:", email);

const {error } = await resend.emails.send({
  from: 'Flytics <onboarding@send.flytics.tech>', 
  to: [email.trim()], // trim() removes accidental spaces
  subject: 'Login to Flytics',
  html: `<p>Click <a href="${magicLink}">here</a> to log in.</p>`,
});

if (error) {
  console.error("Resend API Error:", error); // This will tell us the EXACT reason
  return res.status(400).json({ success: false, error });
}

    return res.status(200).json({ 
      success: true, 
      message: "Magic link sent via Resend!",
      MagicToken: magicToken 
    });
  } catch(error : any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const verify = async (req: CustomRequest, res: Response) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as any;
    
    // 1. Check if user exists first
    let user = await usermodel.findOne({ email: decoded.email });

    if (!user) {
      // 2. SIGNUP: Create user with name/age from token
      user = await usermodel.create({
        email: decoded.email,
        name: decoded.name || decoded.email.split('@')[0], // Fallback to email prefix
        age: decoded.age,
        isVerified: true
      });
    } else {
      // 3. LOGIN: Just ensure they are marked as verified
      user.isVerified = true;
      await user.save();
    }

    
    const sessionToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
    

  res.cookie('session', sessionToken, {
  httpOnly: true,
  secure: true,      // Must be true for 'none' to work
  sameSite: 'none',  // This is what allows the cookie to work in production
  maxAge: 30 * 24 * 60 * 60 * 1000
});
   
    // 4. Redirect the browser to your dashboard
 return  res.redirect(`${process.env.FRONTEND_URL}/`);

  } catch (err) {
    return res.status(401).send("Invalid or expired link.");
  }
};

export const logout = async (req: CustomRequest, res: Response) => {
    
    try{
     res.status(200).cookie("session"  , "" , 
    {expires : new Date(Date.now()) , 
    sameSite: process.env.NODE_ENV === "Development"? "lax" :"none", // we have to add here also because we set a environment 
    secure: process.env.NODE_ENV === "Development"? false :true}).json({  // secure xcept to be boolean value and in development we set it to false because in development we are not using https and in production we are using https so we set it to true
    success : true,
    message: "logout successfully "
    })


  
    }catch(error){
       console.log(error);
    }
   
}
export const mydetails = async(req: CustomRequest, res: Response) =>{ 
  const user = req.user;
  console.log("user from middlewares" , user)
  if(!user){
   return  res.status(404).json({
      success : false,
      message: "Please login first",
      
    })
  }

 return res.json({
    success: true , 
    message : "fetched user successfully",
    user: user
  })

}