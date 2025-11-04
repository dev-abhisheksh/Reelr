import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const res = await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log(`\n Mongo DataBase Connected! - Host ${res.connection.host}`)
    } catch (error) {
        console.log("Mongo DataBase Failed to Connect!!!",error);
    }
}

export default connectDB;