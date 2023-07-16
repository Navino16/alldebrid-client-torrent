import { Router } from 'express';
import multer from 'multer';
import { TorrentsController } from '../Controllers';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.route('/categories').get(TorrentsController.getCategories);
router.route('/createCategory').post(TorrentsController.postCreateCategory);
router.route('/info').get(TorrentsController.getInfo);
router.route('/add').post(upload.fields([{ name: 'torrents' }]), TorrentsController.postAdd);
export const TorrentRoutes = router;
