import mongoose from "mongoose";

export const  connectDB = () =>{
     mongoose.connect(process.env.MONGO_URI, {
    dbName: "SugarMonitor"
  })

  console.log("Mongodb connected")

}