import { Router } from 'express';
import { TorrentsController } from '../Controllers';

const router = Router();

router.route('/categories').get(TorrentsController.getCategories);
router.route('/createCategory').post(TorrentsController.postCreateCategory);
export const TorrentRoutes = router;
