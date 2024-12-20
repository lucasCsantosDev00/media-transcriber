import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { PassThrough } from 'stream';
import { Readable } from 'stream';
import { BUCKET_NAME, AWS_REGION } from '../config';

export class AudioS3Repository {
  private s3Client: S3Client;
  private bucketName: string = `${BUCKET_NAME}`;
  private region: string = `${AWS_REGION}`;

  constructor() {
    this.s3Client = new S3Client({ region: `${this.region}` });
  }

  public async uploadFile(key: string, body: PassThrough, contentType: string): Promise<string> {
    const uploadParams = {
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,
      },
    };

    try {
      const upload = new Upload(uploadParams);
      await upload.done();
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Erro ao fazer upload no S3:', error);
      throw new Error('Erro ao fazer upload no S3');
    }
  }
  
  // Recupera o audio do bucket em forma de Readable stream
  async getAudioStream(videoId: string): Promise<Readable> {
    const command = new GetObjectCommand({ Bucket: this.bucketName, Key: videoId });
    const s3Response = await this.s3Client.send(command);

    if (!s3Response.Body) {
      throw new Error(`Arquivo não encontrado no S3. videoId: ${videoId}`);
    }

    return s3Response.Body as Readable;
  }
}
