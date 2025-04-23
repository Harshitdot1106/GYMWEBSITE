// equipment.routes.js
import { Router } from "express";
const router = Router();

import { getEquipment, getEquipmentById } from "../controller/equipment.controller.js";

router.get("/", getEquipment); // GET all equipment
router.get("/:equipmentid", getEquipmentById); // GET by ID

export default router;
