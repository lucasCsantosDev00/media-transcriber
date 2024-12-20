import OpenAI from "openai";

export class OpenAIService {
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  static async generateArticleFromTranscription(
    transcription: string,
    command: string,
    maxCharacters: number
  ): Promise<string> {
    const prompt = `
      Você é um especialista em gerar artigos baseados em transcrições. Abaixo está a transcrição de um vídeo. Crie um artigo baseado no seguinte comando:
      "${command}"

      Transcrição:
      ${transcription}

      Lembre-se de respeitar o limite de ${maxCharacters} caracteres e manter o artigo coeso e bem estruturado.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", 
        messages: [
          { role: "system", content: "Você é um gerador de artigos." },
          { role: "user", content: prompt },
        ],
        max_tokens: Math.min(Math.floor(maxCharacters / 4), 3000), // Estimativa de tokens para respeitar o limite de caracteres
        temperature: 0.7, 
      });

      // Verifica se a resposta e as escolhas são válidas
      if (response?.choices && response.choices.length > 0) {
        const articleContent =
          response.choices[0].message?.content?.trim() ||
          "Resposta vazia da API";

        return articleContent; // Retorna o conteúdo do artigo gerado
      } else {
        throw new Error("Nenhuma resposta válida recebida da OpenAI.");
      }
    } catch (error) {
      console.error("Erro ao gerar artigo com a OpenAI:", error);
      throw new Error("Erro ao gerar artigo.");
    }
  }
}
