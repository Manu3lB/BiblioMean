import express from "express";
import book from "../controllers/book.js";
import auth from "../middlewares/auth.js";
import adm from "../middlewares/admin.js";

const router = express.Router();

//http://localhost:3001/api/book/registerBook
router.post("/registerBook", auth, adm, book.registerBook);
router.get("/listBook", auth, book.listBook);
router.put("/updateBook", auth, adm, book.updateBook);
router.delete("/deleteBook/:_id", auth, adm, book.deleteBook);
router.get("/findBook/:_id", auth, book.findBook);


export default router;