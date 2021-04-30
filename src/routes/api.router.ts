import express from 'express';
import info from '../controllers/info';
import title from '../controllers/title';
import download from '../controllers/download';
import networkStream from '../controllers/networkStream';

const router = express.Router();
router.use(express.json());

router.post('/api/info', info);
router.post('/api/title', title);
router.post('/api/download', download);
router.post('/api/network-stream', networkStream);

export default router;
