import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    name: String,
    address: String,
    registerDate: { type: Date, default: Date.now },
  });
  
  const vendor = mongoose.model("vendors", vendorSchema);
  
  export default vendor;

