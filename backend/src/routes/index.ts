import { Router } from 'express';
import emails from './emails';

const router = Router();

router.use('/emails', emails);

export default router;