import { format, toDate } from "date-fns-tz";
import SpeechToTextV1 from "ibm-watson/speech-to-text/v1";
import { IamAuthenticator } from "ibm-watson/auth";
import {
  TranscriptionRepository,
  TranscriptionRecord,
} from "../repositories/transcriptionRepository";
import { AudioS3Repository } from "../repositories/audioS3Repository";
import { Readable } from "stream";

const audioS3Repository = new AudioS3Repository();

// Define o fuso horário de Brasília
const BRAZIL_TIMEZONE = "America/Sao_Paulo";

export class TranscriptionService {
  private speechToText: SpeechToTextV1;
  private transcriptionRepository: TranscriptionRepository;

  constructor() {
    this.speechToText = new SpeechToTextV1({
      authenticator: new IamAuthenticator({
        apikey: process.env.IBM_WATSON_API_KEY || "",
      }),
      serviceUrl: process.env.IBM_WATSON_URL || "",
    });

    this.transcriptionRepository = new TranscriptionRepository();
  }

  async fetchAllTranscriptions(): Promise<TranscriptionRecord[]> {
    try {
      console.log("Buscando todas as transcrições no DynamoDB...");
      const transcriptions = await this.transcriptionRepository.getAll();
      console.log("Transcrições encontradas com sucesso!");
      return transcriptions;
    } catch (error) {
      const err = error as Error;
      console.error("Erro ao buscar todas as transcrições:", err.message, err.stack);
      throw err;
    }
  }

  async transcribeAudio(
    audioStream: Readable,
    videoId: string
  ): Promise<string> {
    const params = {
      audio: audioStream,
      contentType: "audio/mp3",
      model: "pt-BR_Multimedia",
    };

    console.log("Enviando áudio para o IBM Watson para transcrição...");

    try {
      const response = await this.speechToText.recognize(params);
      const transcriptionResults = response.result?.results;

      if (!transcriptionResults) {
        throw new Error("Nenhum resultado de transcrição foi retornado.");
      }

      const transcription = transcriptionResults
        .map((result) => result.alternatives[0].transcript)
        .join("\n");

      if (!transcription.trim()) {
        throw new Error("Transcrição está vazia.");
      }

      //Formata no horário de Brasília
      const currentDate = new Date();
      const brazilTime = toDate(currentDate, { timeZone: BRAZIL_TIMEZONE });
      const timestampBrazil = format(brazilTime, "yyyy-MM-dd'T'HH:mm:ssXXX", {
        timeZone: BRAZIL_TIMEZONE,
      });

      const record: TranscriptionRecord = {
        videoId,
        fileName: videoId,
        transcription,
        timestamp: timestampBrazil,
        transcriptionTime: timestampBrazil,
      };

      await this.transcriptionRepository.save(record);
      console.log(`Transcrição salva no banco com o videoId: ${videoId}`);

      return transcription;
    } catch (error) {
      const err = error as Error;
      console.error(
        "Erro durante a transcrição ou salvamento:",
        err.message,
        err.stack
      );
      throw err;
    }
  }

  async getTranscriptionById(videoId: string): Promise<string> {
    try {
      const transcriptionRecord = await this.transcriptionRepository.getByVideoId(videoId);

      if (!transcriptionRecord) {
        throw new Error(`Transcrição não encontrada para o videoId: ${videoId}`);
      }

      return transcriptionRecord.transcription;
    } catch (error) {
      const err = error as Error;
      console.error("Erro ao buscar a transcrição:", err.message, err.stack);
      throw err;
    }
  }

  public getAudioStream = async (videoId: string) => {
    try {
      const audioStream = await audioS3Repository.getAudioStream(videoId);
      return audioStream;
    } catch (error) {
      const err = error as Error;
      console.error(`Erro ao processar o arquivo: videoId: ${videoId}, erro:`, error);
      throw err;
    }
  };
}
