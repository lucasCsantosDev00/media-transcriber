 #Media Transcriber
 Gera artigos para blog de forma rápida e fácil baseado em áudio mp3.

# 🌟 Funcionalidades
- Upload de áudio
- Transcrição
- Listagem de transcrição
- Listagem de artigos
  
## ⚙️ Funcionamento do Sistema

O projeto utiliza uma arquitetura serverless que integra diversas tecnologias da AWS. Quando um áudio é enviado para o bucket S3, a **Lambda Function Media Transcriber** é acionada automaticamente para notificar a API principal e iniciar o processo de transcrição.

- Repositório da Lambda Function: [Lambda Function Media Transcriber](https://github.com/lucasCsantosDev00/Lambda-function-media-transcriber)


## 📹 Demonstração
[![Assista ao vídeo](https://img.youtube.com/vi/RmoqKa-_CEI/0.jpg)](https://youtu.be/RmoqKa-_CEI)

## 🛠️ Tecnologias Utilizadas

As principais tecnologias utilizadas neste projeto são:

- ⚙️ **[Node.js]:** Ambiente de execução JavaScript no servidor.
- 📝 **[TypeScript]:** Superset do JavaScript com tipagem estática para maior robustez.  
- ☁️ **[AWS S3]:** Serviço de armazenamento em nuvem para gerenciar arquivos e assets.
- 🔧 **[AWS Lambda]:** Computação serverless para execução de funções sob demanda.
- 📦 **[AWS SDK]:** Biblioteca oficial para interagir com serviços da AWS.
- 📋 **[AWS DynamoDB]:** Banco de dados NoSQL altamente escalável e de baixa latência.
- 🌐 **[NGROK]:** Ferramenta para expor localmente sua API para a internet de forma simples e segura.
- 🎙️ **[IBM Watson Speech to Text]:** Serviço de transcrição de áudio para texto baseado em IA.
- ✍️ **[ChatGPT (OpenAI API)]:** Ferramenta para transformar o texto transcrito em artigos de blog.    



   
