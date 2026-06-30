const mongoose=require("mongoose");
// const {MONGO_URI}=require("./src/config/env");

const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    }
    catch(error){
        console.log("Database connection failed");
        console.log(error.message);
    }
};
module.exports=connectDB;