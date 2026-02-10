import mongoose from "mongoose";

const checkConnection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/stickyNotes", { serverSelectionTimeoutMS: 5000 })
        console.log("DB connected successfully");
    } catch (error) {
        console.log("DB connected failed", error);
    }
}

export default checkConnection