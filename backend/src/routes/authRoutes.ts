import { Router } from 'express';
import { REQUEST_RESET_URL } from '../config/baseConfig.ts';
import { requestPasswordReset } from '../controllers/authController';

const router = Router();

router.post(REQUEST_RESET_URL, requestPasswordReset); // /request-reset

export default router;