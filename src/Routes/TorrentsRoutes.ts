import { Router } from 'express';
import multer from 'multer';
import { TorrentsController } from '../Controllers';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.route('/add').post(upload.fields([{ name: 'torrents' }]), TorrentsController.postAdd);
export const TorrentRoutes = router;
