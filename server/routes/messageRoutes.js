import { Router } from "express";
import { deleteMessage, editMessage, listMessages, sendMessage } from "../controllers/messageController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.get("/", listMessages);
router.post("/", sendMessage);
router.patch("/:id", editMessage);
router.delete("/:id", deleteMessage);

export default router;
