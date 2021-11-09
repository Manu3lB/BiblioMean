import express from "express";
import vendor from "../controllers/vendors.js";

const router = express.Router();

//http://localhost:3001/api/vendor/registerVendor
router.post("/registerVendor", vendor.registerVendor);
router.get("/listVendor", vendor.listVendor);
router.put("/updateVendor", vendor.updateVendor);
router.delete("/deleteVendor/:_id", vendor.deleteVendor);

export default router;