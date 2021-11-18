import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dbStatus: Boolean,
    registerDate: { type: Date, default: Date.now},
});

const admin = mongoose.model("admin", adminSchema);
export default admin;