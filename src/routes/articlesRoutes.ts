import express from "express";
import { ArticlesController } from "../controllers/ArticlesController";

const router = express.Router();
const articlesController = new ArticlesController();

router.post("/generate-article", articlesController.saveArticle);
router.get("/articles/:articleId", articlesController.getArticleById);
router.get("/articles", articlesController.fetchAllArticles);


export default router;
