import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transaction } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeFinances(transactions: Transaction[]): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Analiza las siguientes transacciones financieras y proporciona consejos para optimizar ahorros y detectar anomalías:
    ${JSON.stringify(transactions)}
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
