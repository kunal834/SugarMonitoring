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
  const magicLink = `${process.env.FRONTEND_URL}/api/users/verify?token=${magicToken}`;
 
  // Email Configuration (Nodemailer)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Use 465 for SSL
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // 16-character App Password
  },
});

  await transporter.sendMail({
    to: email,  
    subject: 'Login to SugarTrack',
    html: `<p>Click <a href="${magicLink}">here</a> to log in. Link expires in 15 mins.</p>`
  });

  res.json({ 
    message: "Magic link sent!" ,
    success: true,
    user : name
  });
  return res.redirect(`${process.env.FRONTEND_URL}/`);
  }catch(error){
  return res.status(500).json({ // Added return and status code
      success: false,
      message : error.message 
    });
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    // 4. Redirect the browser to your dashboard
    return res.redirect(`${process.env.FRONTEND_URL}/Dashboard`);

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

  res.json({
    success: true , 
    message : "fetched user successfully",
    user: user
  })

}