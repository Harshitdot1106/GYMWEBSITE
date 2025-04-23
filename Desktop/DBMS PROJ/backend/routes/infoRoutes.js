// routes/infoRoutes.ts

import express from 'express';
import { getInfoByEmail, postInfo } from '../controller/addinfo.controller.js';

const router = express.Router();

router.get('/:email', getInfoByEmail);
router.post('/', postInfo);

export default router;
