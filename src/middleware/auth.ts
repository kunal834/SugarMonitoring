import { usermodel } from "../models/User.js";
import jwt from "jsonwebtoken"

export const isAuthenticated = async(req , res , next) =>{
      
 const {session} = req.cookies;
  console.log("cokies" , req.cookies)
  console.log("sessiontoken :" , session)
try{
if(!session){
    return res.status(404).json({
        success: false,
        message: "log in first"
    })
  }

  const decodeddata = jwt.verify(session , process.env.JWT_SECRET)

   console.log("decodeddata" ,decodeddata)

   req.user = await usermodel.findById(decodeddata.userId)

   console.log("Sending user", req.user)
     next() 
}catch(error){
    console.log(error);
    
}
  

   

 
}