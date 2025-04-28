import express from "express";
import { deleteMessage, editMessage, getMessage, sendMessage } from "../controllers/messageController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/send/:id",isAuthenticated,sendMessage);
router.get("/:id",isAuthenticated, getMessage);
router.delete("/delete/:id",isAuthenticated,deleteMessage);
router.put("/edit/:id",isAuthenticated, editMessage);
export default router;