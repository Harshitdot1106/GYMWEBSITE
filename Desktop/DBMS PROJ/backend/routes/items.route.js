import {Router} from 'express';
import {getAllItems} from '../controller/items.controller.js';
const router = Router();

router.get("/",getAllItems);
export default router;