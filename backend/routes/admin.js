import express from "express";
import admin from "../controllers/admin.js";

const router = express.Router();

router.post("/registerAdmin", admin.registerAdmin);
router.post("/loginAdmin", admin.login);

export default router;