import { Router } from "express";
import { upload } from "../middleware/multer.js";
import {getClass,joinClass,joinedClass} from "../controller/class.controller.js";
const router = Router();
//router.post("/upload", upload.single("image"),uploadClassImage);
router.get("/",getClass );
router.post('/join',joinClass);
router.post('/joined',joinedClass);

export default router;