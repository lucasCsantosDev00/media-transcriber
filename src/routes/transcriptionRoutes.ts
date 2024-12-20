import { Router } from 'express';
import { TranscriptionController } from '../controllers/TranscriptionController';

const router = Router();
const transcriptionController = new TranscriptionController();

router.post('/transcribeAudio', transcriptionController.transcribeAudio);
router.get('/transcriptions', transcriptionController.fetchAllTranscriptions)

export default router;
