import { Router } from "express";
import { upload } from "../middleware/multer.js";

import { getAllExercises, MuscleExerciseById } from "../controller/exercise.controller.js";

const router = Router();
router.post("/upload", upload.single("image"),);
router.get("/",getAllExercises);
router.get("/:name",MuscleExerciseById); // GET by ID
export default router;