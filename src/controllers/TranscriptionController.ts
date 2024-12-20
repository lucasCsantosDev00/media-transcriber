import { Request, Response } from 'express';
import { TranscriptionService } from '../services/transcriptionService'; // Importe o serviço de transcrição

const transcriptionService = new TranscriptionService();

export class TranscriptionController {
  // Método para transcrever o áudio
  public transcribeAudio = async (req: Request, res: Response) => {
    const { videoId } = req.body;

    if (!videoId) {
      console.warn(`Requisição inválida: videoId faltando.`);
      return res.status(400).send('Parâmetro "videoId" é obrigatório.');
    }

    try {
      console.log(`Iniciando processo de transcrição. videoId: ${videoId}`);

      const audioStream = await transcriptionService.getAudioStream(videoId);

      console.log(`Arquivo de áudio baixado com sucesso do S3. videoId: ${videoId}`);

      const transcription = await transcriptionService.transcribeAudio(audioStream, videoId);

      console.log(`Transcrição concluída e salva no banco. videoId: ${videoId}`);

      res.status(200).json({ message: 'Transcrição realizada com sucesso!', transcription });
    } catch (error) {
      console.error(`Erro ao processar o arquivo: videoId: ${videoId}, erro:`, error);
      res.status(500).send('Erro ao acessar o S3 ou ao transcrever o áudio.');
    }
  };

  // Método para buscar todas as transcrições
  public fetchAllTranscriptions = async (req: Request, res: Response) => {
    try {
      console.log("Buscando todas as transcrições...");

      const transcriptions = await transcriptionService.fetchAllTranscriptions();

      if (transcriptions.length === 0) {
        console.log("Nenhuma transcrição encontrada.");
        return res.status(404).json({ message: "Nenhuma transcrição encontrada." });
      }

      console.log("Transcrições recuperadas com sucesso.");
      res.status(200).json(transcriptions);
    } catch (error) {
      console.error("Erro ao buscar todas as transcrições:", error);
      res.status(500).send('Erro ao buscar transcrições.');
    }
  };
}
