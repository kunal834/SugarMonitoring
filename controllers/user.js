import { usermodel } from "../models/User.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


// Step 1: Send the Link
export const login = async (req, res) => {
  const { email , name , age } = req.body;
  console.log("email:", req.body)
  

  try{
 // Create a 15-minute magic token
  const magicToken = jwt.sign({ email , name , age }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const magicLink = `${process.env.BACKEND_URL}/api/users/verify?token=${magicToken}`;

  // Email Configuration (Nodemailer)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  await transporter.sendMail({
    to: email,  
    subject: 'Login to SugarTrack',
    html: `<p>Click <a href="${magicLink}">here</a> to log in. Link expires in 15 mins.</p>`
  });

  res.json({ message: "Magic link sent!" });

  }catch(error){
  return res.status(500).json({ // Added return and status code
      success: false,
      message : error.message 
    });
  }
 
};

export const verify = async (req, res) => {
  const { token } = req.query;


  console.log("token: " , token)
  console.log("full query"  , req.query)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode" , decoded)
    
    // Check if user exists, if not, create them
 let user = await usermodel.findOneAndUpdate(
    { email: decoded.email },
      { 
        isVerified: true,
        name: decoded.name, // Save from token
        age: decoded.age    // Save from token
      },
      { new: true, upsert: true }
);
  
    if(!user.isVerified){
        return  res.status(401).json({
            success: false,
            message : "Please verify your credentials"
        })
    }
    // Create a 30-day Session JWT 
    const sessionToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.cookie('session', sessionToken, {
      httpOnly: true, // Secure from XSS
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    res.json({
        message : "user verified",
        verified : user
    })
    // res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (err) {
   res.status(401).send("Invalid or expired link.");
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
      message: "Please login first"
    })
  }

  res.json({
    success: true , 
    message : "fetched user successfully"
  })

}