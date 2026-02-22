import  { SugarLog } from  "../models/Sugar.js"


export const filldata = async(req , res) =>{
    const user = req.user;
    console.log("user from middleware" , user);
    const { value, unit, context, notes } = req.body;
    if(!user){
    return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    if(!user.isVerified){
        return res.status(401).json({
            success: false,
            message : "Please verify your credentials"
        })
    }
     
    try{
        const SugarData = await SugarLog.create({
            userId: user._id, // Match this to your User model ID property
            value,
            unit,
            context,
            notes
        })

        res.status(201).json({
            success: true,
            message: "Sugar reading saved successfully",
            SugarData
        });

    }catch(error){
     res.status(500).json({
            success: false,
            message: "Error saving data",
            error: error.message
        });
    }

}