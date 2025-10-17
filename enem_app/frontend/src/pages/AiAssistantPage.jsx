import React, { useState } from 'react';
import AiAssistant, { AiExplanationModal } from '../components/AiAssistant';
import '../styles/pages/AiAssistantPage.scss';

const AiAssistantPage = () => {
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState({
    question: '',
    correctAnswer: '',
    explanation: ''
  });

  // Exemplos de questões para demonstração
  const sampleQuestions = [
    {
      id: 1,
      question: "Qual é a diferença entre mitose e meiose?",
      correctAnswer: "A mitose produz duas células diploides idênticas, enquanto a meiose produz quatro células haploides geneticamente diferentes.",
      explanation: "Processo fundamental da reprodução celular"
    },
    {
      id: 2,
      question: "Como calcular a velocidade média em um movimento retilíneo uniforme?",
      correctAnswer: "Velocidade média = Δs / Δt (variação do espaço dividida pela variação do tempo)",
      explanation: "Conceito básico de cinemática"
    },
    {
      id: 3,
      question: "Quais são as principais características do Romantismo no Brasil?",
      correctAnswer: "Nacionalismo, indianismo, sentimentalismo, subjetivismo e valorização da natureza brasileira.",
      explanation: "Movimento literário do século XIX"
    }
  ];

  const handleExplainQuestion = (question) => {
    setSelectedQuestion(question);
    setShowExplanationModal(true);
  };

  return (
    <div className="ai-assistant-page">
      <div className="page-header">
        <h1>🤖 ENEM AI</h1>
        <p>Tire suas dúvidas e obtenha explicações detalhadas sobre questões do ENEM</p>
      </div>

      <div className="page-content">
        <div className="chat-section">
          <div className="section-header">
            <h2>💬 Chat com ENEM AI</h2>
            <p>Faça perguntas sobre qualquer assunto do ENEM</p>
          </div>
          <AiAssistant isModal={false} />
        </div>

        <div className="examples-section">
          <div className="section-header">
            <h2>📚 Exemplos de Questões</h2>
            <p>Clique em "Explicar" para ver como o ENEM AI analisa questões</p>
          </div>

          <div className="questions-grid">
            {sampleQuestions.map((question) => (
              <div key={question.id} className="question-card">
                <div className="question-content">
                  <h4>Questão {question.id}</h4>
                  <p className="question-text">{question.question}</p>
                  <div className="answer-preview">
                    <strong>Resposta:</strong> {question.correctAnswer.substring(0, 100)}...
                  </div>
                </div>
                <button
                  className="explain-button"
                  onClick={() => handleExplainQuestion(question)}
                >
                  🧠 Explicar com ENEM AI
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="features-section">
          <div className="section-header">
            <h2>✨ Funcionalidades</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Explicações Detalhadas</h3>
              <p>Receba explicações passo a passo de questões complexas do ENEM</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Dicas de Estudo</h3>
              <p>Obtenha estratégias personalizadas para melhorar seu desempenho</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Conceitos Fundamentais</h3>
              <p>Esclareça dúvidas sobre conceitos básicos de todas as matérias</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Análise de Questões</h3>
              <p>Entenda o raciocínio por trás das respostas corretas</p>
            </div>
          </div>
        </div>
      </div>

      <AiExplanationModal
        isOpen={showExplanationModal}
        onClose={() => setShowExplanationModal(false)}
        questionData={selectedQuestion}
      />
    </div>
  );
};

export default AiAssistantPage;