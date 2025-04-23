import { Router } from "express";
import { dbConfig } from "../DB/connectdb.js";
import oracledb from "oracledb";
import fetchData from "../DB/connectdb.js";
import { createTrainer, getTrainer  } from "../controller/trainer.controller.js";
const router = Router();


router.post("/createMember",createTrainer);
router.post("/login",getTrainer);
 
// router.get("/getMember/:email",getMemberById);

export default router;