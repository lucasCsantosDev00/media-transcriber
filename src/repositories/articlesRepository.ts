import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export interface ArticleRecord {
  articleId: string; // Partition key (ou outro identificador único para o artigo)
  videoId: string; // ID do vídeo associado
  content: string; // Conteúdo do artigo gerado
  title: string; // Título do artigo
  timestamp: string; // Data e hora de criação
}

export class ArticleRepository {
  private tableName: string = "articles";

  // Função para salvar o artigo no DynamoDB
  async save(article: ArticleRecord): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: article,
    };

    try {
      await dynamoDB.put(params).promise();
    } catch (error) {
      console.error("Erro ao salvar o artigo no DynamoDB:", error);
      throw error;
    }
  }

  // Método para buscar um artigo pelo articleId
  async getByArticleId(articleId: string): Promise<ArticleRecord | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        articleId: articleId, // Chave de busca
      },
    };

    try {
      const result = await dynamoDB.get(params).promise();
      return (result.Item as ArticleRecord) || null; // Retorna o artigo ou null se não encontrar
    } catch (error) {
      console.error("Erro ao buscar artigo no DynamoDB:", error);
      throw error;
    }
  }

  async getAll(): Promise<ArticleRecord[]> {
    const params = {
      TableName: this.tableName,
    };

    try {
      const result = await dynamoDB.scan(params).promise();
      return result.Items as ArticleRecord[]; // Retorna a lista de artigos
    } catch (error) {
      console.error("Erro ao buscar todos os artigos no DynamoDB:", error);
      throw error;
    }
  }
}
