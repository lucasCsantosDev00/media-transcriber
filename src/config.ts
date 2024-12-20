import { config } from "dotenv";
config()

export const PORT = process.env.PORT || 3000;
export const API_CLIENT = process.env.API_CLIENT;
export const BUCKET_NAME = process.env.AWS_BUCKET_NAME
export const AWS_REGION = process.env.AWS_REGION;



