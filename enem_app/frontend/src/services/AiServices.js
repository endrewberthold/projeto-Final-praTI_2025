import axios from "../api/axios";

const AI_ASK_URL = "/api/ai/ask";
const AI_EXPLAIN_URL = "/api/ai/explain";
const AI_HEALTH_URL = "/api/ai/health";


//Serviço que faz as chamadas HTTP para o backend

// Fazer pergunta à IA
export async function askQuestionAPI(question, context = "") {
  const response = await axios.post(
    AI_ASK_URL,
    JSON.stringify({
      question,
      context,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response;
}

// Solicitar explicação de resposta
export async function explainAnswerAPI(question, correctAnswer, explanation = "") {
  const response = await axios.post(
    AI_EXPLAIN_URL,
    JSON.stringify({
      question,
      correctAnswer,
      explanation,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response;
}

// Verificar status da IA
export async function checkAiHealthAPI() {
  const response = await axios.get(AI_HEALTH_URL);
  return response;
}