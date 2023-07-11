import { Router } from 'express';
import { AppController } from '../Controllers';

const router = Router();

router.route('/webapiVersion').get(AppController.getWebApiVersion);
router.route('/preferences').get(AppController.getPreferences);
export const AppRoutes = router;
