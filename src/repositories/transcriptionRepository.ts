import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export interface TranscriptionRecord {
  videoId: string; // Partition key
  fileName: string;
  transcription: string;
  timestamp: string;
  transcriptionTime: string; // Horário da transcrição
}

export class TranscriptionRepository {
  private tableName: string = "transcriptions"; // Nome da tabela
  private bucketName: string = "audiofiles00"; // Nome do bucket

  // Função para buscar todas as transcrições
  async getAll(): Promise<TranscriptionRecord[]> {
    const params = {
      TableName: this.tableName,
    };

    try {
      const result = await dynamoDB.scan(params).promise(); // Faz um scan na tabela
      return result.Items as TranscriptionRecord[];
    } catch (error) {
      console.error("Erro ao buscar todas as transcrições:", error);
      throw error; // Re-lança o erro para tratamento externo
    }
  }

  // Função para salvar uma transcrição no DynamoDB
  async save(record: TranscriptionRecord): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        ...record,
        bucketName: this.bucketName, 
      },
    };

    try {
      await dynamoDB.put(params).promise();
    } catch (error) {
      console.error("Erro ao salvar no DynamoDB:", error);
      throw error;
    }
  }

  // Função para buscar uma transcrição por videoId
  async getByVideoId(videoId: string): Promise<TranscriptionRecord | null> {
    const params = {
      TableName: this.tableName,
      Key: { videoId },
    };

    try {
      const result = await dynamoDB.get(params).promise();
      if (result.Item) {
        return result.Item as TranscriptionRecord;
      } else {
        console.log(`Transcrição não encontrada para o videoId: ${videoId}`);
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar no DynamoDB:", error);
      throw error;
    }
  }
}
