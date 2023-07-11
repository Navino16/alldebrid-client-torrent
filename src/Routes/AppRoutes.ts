import { Router } from 'express';
import { AppController } from '../Controllers/AppController';

const router = Router();

router.route('/webapiVersion').get(AppController.getWebApiVersion);

export const AppRoutes = router;
