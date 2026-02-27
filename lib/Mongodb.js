import mongoose from "mongoose";

export const  connectDB = () =>{
     mongoose.connect(process.env.MONGOU_URI , {
    dbName: "SugarMonitor"
  })

  console.log("Mongodb connected")

}