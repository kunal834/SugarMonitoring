import  { SugarLog } from  "../models/Sugar.js"
import {getSugarSummary , Monthlysummary , getContributionData} from "../services/pipelines.js"


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
export const fetchsugardata = async (req, res) => {
    try {
        // 1. Get the userId from the request (sent by your auth middleware)
        // OR from the request parameters if you pass it from the frontend
        const userId = req.user._id; 

        // 2. Only find logs belonging to THIS user
        // .sort({ entryDate: -1 }) ensures newest readings appear first
        const data = await SugarLog.find({ userId }).sort({ entryDate: -1 });

        res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            logs: data
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const SugarAnalysis = async(req , res) =>{
    try{
   const userId = req.user._id.toString();
 const pipeline  = getSugarSummary(userId)
 const data = await SugarLog.aggregate(pipeline);
  console.log("Data Analysis" , data)
  if(data){
    res.json({
        message: "Data Fetched",
        success : true,
        Analysis: data
    })
  }
    }catch(error){
        console.log(error.message)
    }

   
}

export const MonthAnal = async(req , res) =>{
    try{
     const userId = req.user._id.toString();
 const pipeline  =   Monthlysummary(userId);
 const data = await SugarLog.aggregate(pipeline);
  console.log("Monthly Data" , data);
  if(data){
    res.json({
        message: "Data Fetched",
        success : true,
        Analysis: data
    })
  }
    }catch(error){
 console.log(error.message)
    }

}

export const contribution = async(req , res) =>{
try{
     const userId = req.user._id.toString();
 const pipeline  =   getContributionData(userId);
 const data = await SugarLog.aggregate(pipeline);
  console.log("Monthly Data" , data);
  if(data){
    res.json({
        message: "Data Fetched",
        success : true,
        Analysis: data
    })
  }
    }catch(error){
 console.log(error.message)
    }
}