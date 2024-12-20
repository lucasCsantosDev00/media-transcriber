import { Request, Response } from "express";
import { OpenAIService } from "../services/OpenAIService";
import { TranscriptionService } from "../services/transcriptionService";
import { ArticleRepository, ArticleRecord } from "../repositories/articlesRepository";

export class ArticlesController {
  private articleRepository: ArticleRepository;
  private transcriptionService: TranscriptionService;

  constructor() {
    this.articleRepository = new ArticleRepository();
    this.transcriptionService = new TranscriptionService();
  }

  // Método para salvar um artigo
  public saveArticle = async (req: Request, res: Response): Promise<Response> => {
    const { videoId, command, maxCharacters } = req.body;
    console.log("Recebendo requisição para salvar artigo:", req.body); // Log de entrada

    if (!videoId || !command || !maxCharacters) {
      console.error("Dados inválidos recebidos:", req.body); // Log de erro
      return res.status(400).json({ error: "Dados inválidos. Verifique os campos obrigatórios." });
    }

    try {
      console.log("Buscando transcrição para o videoId:", videoId); // Log de busca de transcrição
      const transcription = await this.transcriptionService.getTranscriptionById(videoId);

      if (!transcription) {
        console.error("Transcrição não encontrada para o videoId:", videoId); // Log de erro
        return res.status(404).json({ error: "Transcrição não encontrada para o videoId fornecido." });
      }

      console.log("Transcrição encontrada:", transcription); // Log da transcrição encontrada

      // Gera o conteúdo do artigo usando o OpenAIService
      const articleContent = await OpenAIService.generateArticleFromTranscription(
        transcription,
        command,
        maxCharacters
      );
      console.log("Conteúdo do artigo gerado:", articleContent); // Log do artigo gerado

      const articleRecord: ArticleRecord = {
        articleId: videoId,
        videoId: videoId,
        content: articleContent,
        title: `Artigo sobre o vídeo ${videoId}`,
        timestamp: new Date().toISOString(),
      };

      await this.articleRepository.save(articleRecord);
      console.log("Artigo salvo com sucesso:", articleRecord); // Log de sucesso

      return res.status(200).json({ article: articleContent });
    } catch (error) {
      console.error("Erro ao gerar o artigo:", error); // Log de erro
      return res.status(500).json({ error: "Erro ao gerar o artigo" });
    }
  };

  // Método para buscar um artigo por articleId
  public getArticleById = async (req: Request, res: Response): Promise<Response> => {
    const { articleId } = req.params;

    if (!articleId) {
      return res.status(400).json({ error: "articleId é obrigatório" });
    }

    try {
      const article = await this.articleRepository.getByArticleId(articleId);

      if (!article) {
        return res.status(404).json({ error: "Artigo não encontrado" });
      }

      return res.status(200).json(article);
    } catch (error) {
      console.error("Erro ao buscar artigo:", error);
      return res.status(500).json({ error: "Erro ao buscar o artigo" });
    }
  };

  // Método para buscar todos os artigos
  public fetchAllArticles = async (req: Request, res: Response): Promise<Response> => {
    try {
      const articles = await this.articleRepository.getAll(); // Novo método para buscar todos os artigos

      if (!articles || articles.length === 0) {
        return res.status(404).json({ message: "Nenhum artigo encontrado." });
      }

      return res.status(200).json(articles);
    } catch (error) {
      console.error("Erro ao buscar todos os artigos:", error);
      return res.status(500).json({ error: "Erro ao buscar artigos." });
    }
  };
}
