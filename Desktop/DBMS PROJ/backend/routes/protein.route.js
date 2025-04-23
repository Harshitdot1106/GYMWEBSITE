// routes/infoRoutes.ts

import express from 'express';
import { getProteinData, updateProteinData } from '../controller/protein.controller.js';

const router = express.Router();

router.get('/:email', getProteinData);


router.post('/:email', updateProteinData);

export default router;
