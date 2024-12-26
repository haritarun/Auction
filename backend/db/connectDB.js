import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected Successfully!");
    } catch (error) {
        console.log("Error occured in connecting DB : ", error.message);
        process.exit(1);
    }
};
export default connectDB;
