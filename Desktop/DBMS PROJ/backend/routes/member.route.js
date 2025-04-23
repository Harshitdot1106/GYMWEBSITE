import { Router } from "express";
import { dbConfig } from "../DB/connectdb.js";
import oracledb from "oracledb";
import fetchData from "../DB/connectdb.js";
import { createMember,getMember } from "../controller/member.controller.js";
const router = Router();


router.post("/createMember",createMember);
 router.post("/login",getMember); 
// router.get("/getMember/:email",getMemberById);

export default router;