import { Request, Response, NextFunction } from 'express';
import { AudioS3Repository } from '../repositories/audioS3Repository';
import { PassThrough } from 'stream';
import multer from 'multer';

export class AudioController {
  private audioRepository: AudioS3Repository;

  constructor() {
    this.audioRepository = new AudioS3Repository();
  }

  // Configuração do Multer para lidar com uploads em memória
  private upload = multer({ storage: multer.memoryStorage() }).single('audio');

  public uploadAudio = (req: Request, res: Response, next: NextFunction): void => {
    this.upload(req, res, async (err: any) => {
      if (err) return res.status(400).send(`Erro de upload: ${err.message}`);

      if (!req.file) return res.status(400).send('Nenhum arquivo enviado.');

      try {
        const { originalname, mimetype, buffer } = req.file;
        const key = originalname

        // Cria uma stream PassThrough para enviar para o S3
        const stream = new PassThrough();
        stream.end(buffer);

        const fileUrl = await this.audioRepository.uploadFile(key, stream, mimetype);
        res.status(200).json({ fileUrl });
      } catch (error) {
        next(error);
      }
    });
  };
}
