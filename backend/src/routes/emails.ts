import { Router } from 'express';
import { createEmail, deleteEmail, getAllEmails } from '../handlers/emails';
import { validateDeleteEmail, validateEmail } from '../middlewares/emails';

const router = Router();

router.get('/', getAllEmails);

router.post('/', validateEmail, createEmail);

router.delete('/:id', validateDeleteEmail, deleteEmail);

export default router;