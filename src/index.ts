import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Request, Response, NextFunction } from "express";

import audioRoutes from "./routes/audioRoutes";
import transcriptionRoutes from "./routes/transcriptionRoutes";
import articlesRoutes from "./routes/articlesRoutes"

import bodyParser from "body-parser";

import cors from "cors";
import multer from "multer";
import { PORT, API_CLIENT } from "./config";


const app = express();
const port = PORT || 8080;

// const allowedOrigin = API_NOTIFICATION;
const allowedOrigin = `${API_CLIENT}`;

// Middleware para analisar o JSON no corpo das requisições
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === allowedOrigin) {
        callback(null, true); // Permite a requisição
      } else {
        callback(new Error("Não permitido por CORS")); // Bloqueia outras origens
      }
    },
    methods: ["GET", "POST"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
    credentials: true, 
  })
);

app.use("/", audioRoutes);
app.use("/", transcriptionRoutes);
app.use("/", articlesRoutes);

// Rota para a homepage
app.get("/", (req, res) => {
  console.log("Aplicação está ativa! /");
  return res.status(200).send("AudioProcessor Ativo!");
});

// Middleware para tratar erros de multer
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    // Erro específico do multer
    res.status(400).send("Erro de upload de arquivo: " + err.message);
  } else if (err) {
    // Outros erros
    res.status(500).send("Erro interno do servidor: " + err.message);
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`Server running on: ${port}`);
});
