import express from "express";
import customer from "../controllers/customers.js";

const router = express.Router();

//http://localhost:3001/api/book/registerCustomer
router.post("/registerCustomer", customer.registerCustomer);
router.get("/listCustomer", customer.listCustomer);
router.put("/updateCustomer", customer.updateCustomer);
router.delete("/deleteCustomer/:_id", customer.deleteCustomer);
router.get("/findCustomer/:_id", customer.findCustomer);
router.post("/loginCustomer", customer.login);

export default router;