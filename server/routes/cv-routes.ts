import { authenticateToken } from '../middleware/auth-middleware';
import { Router } from 'express';
import { uploadCv } from '../controller/cv-controller';

const router = Router();

router.post('/cv-upload', authenticateToken, uploadCv);

export default router;
