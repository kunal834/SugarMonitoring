
import { usermodel } from "../models/User.js";

import jwt from 'jsonwebtoken';

import nodemailer from 'nodemailer';





// Step 1: Send the Link

export const login = async (req, res) => {
  const { email, name, age } = req.body;
  try {
    const magicToken = jwt.sign({ email, name, age }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const magicLink = `${process.env.BACKEND_URL}/api/users/verify?token=${magicToken}`;
    
    console.log("Email to send" , email)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Ensure NO SPACES in Render dashboard
      }
    });

    // Remove 'await' here to prevent timeouts
    await transporter.sendMail({
      to: email,
      subject: 'Login to SugarTrack',
      html: `<p>Click <a href="${magicLink}">here</a> to log in. Link expires in 15 mins.</p>`
    }).catch(err => console.error("Email Error:", err)); // Log errors without crashing server

    // Return immediately to un-hang the frontend
    return res.status(200).json({ 
      success: true, 
      message: "Magic link is being sent!" ,
      MagicToken : magicToken
    });
  } catch(error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verify = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
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

    
    const sessionToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    

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

export const logout = async (req , res)  =>{
    
    try{
     res.status(200).cookie("session"  , "" , 
    {expires : new Date(Date.now()) , 
    sameSite: process.env.NODE_ENV === "Development"? "lax" :"none", // we have to add here also because we set a environment 
    secure: process.env.NODE_ENV === "Development"? false :"none"}).json({
    success : true,
    message: "logout successfully "
    })


  
    }catch(error){
       console.log(error);
    }
   
}
export const mydetails = async(req , res) =>{ 
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