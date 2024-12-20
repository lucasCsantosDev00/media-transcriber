import { Router } from 'express';
import { AudioController } from '../controllers/AudioController';

const router = Router();
const audioController = new AudioController();

router.post('/upload', audioController.uploadAudio);

export default router;
