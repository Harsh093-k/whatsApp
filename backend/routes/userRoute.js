import express from "express";
import { addBio, addstatus, deleteStatus, getauthUser, getOtherUsers, getUserdataById, login, logout, register } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import uploadFile from "../middleware/multer.js"


const router = express.Router();

router.post("/register",uploadFile,register);
router.post("/addstatus", isAuthenticated,uploadFile, addstatus);
router.post("/login",login);
router.get("/logout",logout);
router.get("/profile/:id",isAuthenticated,getUserdataById);
router.delete("/delete",isAuthenticated,deleteStatus);
router.get("/me",isAuthenticated,getauthUser);
router.get("/",isAuthenticated,getOtherUsers);
router.post("/AddBio",isAuthenticated,addBio);

export default router;