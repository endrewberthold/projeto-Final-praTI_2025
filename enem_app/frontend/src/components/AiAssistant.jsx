import React, { useState, useRef, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import { askQuestionAPI, explainAnswerAPI } from "../services/AiServices";
import { formatMessage, copyFormattedText } from "../utils/messageFormatter";
import "../styles/components/AiAssistant.scss";
const AiAssistant = ({
  isModal = false,
  isOpen = true,
  onClose = null,
  className = '',
  title = 'GABI',
  // Props para modo explicação
  isExplanationMode = false,
  questionData = null,
  onExplanationClose = null
}) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Ajustar altura do textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  // Função para obter explicação da IA (modo explicação)
  const handleGetExplanation = async () => {
    if (!questionData) return;

    setIsLoading(true);
    try {
      const prompt = `Explique detalhadamente esta questão do ENEM:

Questão: ${questionData.question}

Alternativas:
${questionData.alternatives?.map((alt, index) =>
  `${String.fromCharCode(65 + index)}) ${alt}`
).join('\n') || 'Não disponível'}

Resposta correta: ${questionData.correctAnswer || 'Não informada'}

${questionData.explanation ? `Explicação original: ${questionData.explanation}` : ''}

Por favor, forneça uma explicação clara e didática sobre:
1. Como resolver esta questão
2. Conceitos importantes envolvidos
3. Dicas para questões similares`;

      const response = await askQuestionAPI(prompt);
      setAiExplanation(summarizeText(response.data.response));
    } catch (error) {
      console.error('Erro ao obter explicação:', error);
      setAiExplanation('Desculpe, ocorreu um erro ao gerar a explicação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar explicação automaticamente no modo explicação
  useEffect(() => {
    if (isExplanationMode && questionData && !aiExplanation) {
      handleGetExplanation();
    }
  }, [isExplanationMode, questionData]);

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await askQuestionAPI(userMessage.text);
      console.log('Resposta completa da API:', response);
      console.log('Dados da resposta:', response.data);
      console.log('Campo response:', response.data?.response);
      console.log('Tipo da resposta:', typeof response.data?.response);

      const responseText = response.data?.response || response.data?.answer || 'Desculpe, não consegui processar sua pergunta.';

      const aiMessage = {
        id: Date.now() + 1,
        text: summarizeText(responseText),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);

      const errorMessage = {
        id: Date.now() + 1,
        text: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Lidar com Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Copiar mensagem
  const handleCopyMessage = (message) => {
    copyFormattedText(message.text);
  };

  // Renderizar mensagem
  const renderMessage = (message) => (
    <div key={message.id} className={`message ${message.sender}`}>
      <div className="message-content">
        {message.sender === 'ai' ? (
          <div
            className="formatted-message"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
          />
        ) : (
          <p>{message.text}</p>
        )}
      </div>

      <div className="message-footer">
        <span className="message-time">{message.timestamp}</span>
        {message.sender === 'ai' && (
          <button
            className="copy-button"
            onClick={() => handleCopyMessage(message)}
            title="Copiar resposta"
          >
            📋
          </button>
        )}
      </div>
    </div>
  );

  // Indicador de digitação
  const TypingIndicator = () => (
    <div className="message ai loading">
      <div className="message-content">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );

  // Conteúdo do modo explicação
  const explanationContent = (
    <>
      <div className="ai-header">
        <div className="header-info">
          <h3>🤖 Explicação com ENEMAI</h3>
          <span className="status-indicator">Online</span>
        </div>
        <button className="close-button" onClick={onExplanationClose || onClose}>
          ×
        </button>
      </div>

      <div className="modal-content">
        <div className="question-section">
          <h4>📝 Questão</h4>
          <p>{questionData?.question}</p>
        </div>

        {questionData?.alternatives && (
          <div className="answer-section">
            <h4>📋 Alternativas</h4>
            {questionData.alternatives.map((alt, index) => (
              <div
                key={index}
                className={`alternative ${questionData.correctAnswer === String.fromCharCode(65 + index) ? 'correct-answer' : ''}`}
              >
                <strong>{String.fromCharCode(65 + index)})</strong> {alt}
              </div>
            ))}
          </div>
        )}

        {questionData?.explanation && (
          <div className="original-explanation-section">
            <h4>📖 Explicação Original</h4>
            <p>{questionData.explanation}</p>
          </div>
        )}

        <div className="ai-explanation-section">
          <div className="section-header">
            <h4>🤖 Explicação da GABI</h4>
            <button
              className="get-explanation-button"
              onClick={handleGetExplanation}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Gerando...' : '🔄 Gerar Explicação'}
            </button>
          </div>

          {isLoading && (
            <div className="loading-explanation">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Gerando explicação personalizada...</p>
            </div>
          )}

          {aiExplanation && (
            <div className="ai-response">
              <div className="response-content">
                {aiExplanation.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <button
                className="regenerate-button"
                onClick={handleGetExplanation}
                disabled={isLoading}
              >
                🔄 Gerar Nova Explicação
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="modal-footer">
        <button className="close-footer-button" onClick={onExplanationClose || onClose}>
          Fechar
        </button>
      </div>
    </>
  );

  // Conteúdo do chat
  const chatContent = (
    <>
      <div className="ai-header">
        <div className="header-info">
          <h3>{title}</h3>
          <span className="status-indicator">Online</span>
        </div>
        {isModal && onClose && (
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        )}
      </div>

      <div className="ai-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h4>👋 Olá! Sou a GABI, sua assistente de IA para o ENEM</h4>
            <p>Posso te ajudar com:</p>
            <ul>
              <li>📚 Explicações de matérias</li>
              <li>🧮 Resolução de exercícios</li>
              <li>📝 Dicas de estudo</li>
              <li>❓ Esclarecimento de dúvidas</li>
            </ul>
            <p><strong>Faça sua pergunta abaixo!</strong></p>
          </div>
        )}

        {messages.map(renderMessage)}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-input">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta sobre o ENEM..."
            disabled={isLoading}
            rows={1}
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
        <div className="input-hints">
          <small>
            Pressione Enter para enviar • Shift+Enter para nova linha
          </small>
        </div>
      </div>
    </>
  );

  // Renderização condicional: Modo explicação, Modal ou Container normal
  if (isExplanationMode) {
    if (!isOpen) return null;

    return (
      <div className="ai-explanation-modal-overlay" onClick={onExplanationClose || onClose}>
        <div
          className={`ai-explanation-modal ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {explanationContent}
        </div>
      </div>
    );
  }

  if (isModal) {
    if (!isOpen) return null;

    return (
      <div className="ai-modal-overlay" onClick={onClose}>
        <div
          className={`ai-container ai-modal ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {chatContent}
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-container ${className}`}>
      {chatContent}
    </div>
  );
};

// Componente AiFloatingButton integrado
export const AiFloatingButton = () => {
  const location = useLocation();
  const path = (location.pathname || "").toLowerCase();
  if (path === "/" || path.startsWith("/register")) return null;
  const { auth, accessToken } = useAuth();
  const hasValidToken = auth?.accessToken || accessToken;
  const hasValidRole = auth?.role && (auth.role === "USER" || auth.role === "ADMIN");
  if (!hasValidToken || !hasValidRole) return null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleToggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <>
      <button
        className="ai-floating-button"
        onClick={handleToggleModal}
        title="ENEMAI"
      >
        <span role="img" aria-label="ENEMAI">🤖</span>
      </button>

      <AiAssistant
        isModal={true}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};


// Componente AiExplanationModal integrado
export const AiExplanationModal = ({ isOpen, onClose, questionData }) => {
  return (
    <AiAssistant
      isExplanationMode={true}
      isOpen={isOpen}
      onExplanationClose={onClose}
      questionData={questionData}
    />
  );
};

export default AiAssistant;

// Resumo automático das respostas da IA
const summarizeText = (text) => {
  if (!text) return text;
  const normalized = String(text).trim().replace(/\r/g, "");
  // Se houver bullets, mantém os primeiros itens
  const bulletLines = normalized.split("\n").filter((l) => /^[-*•]/.test(l.trim()));
  if (bulletLines.length > 0) {
    const top = bulletLines.slice(0, 4);
    return `${top.join("\n")}${bulletLines.length > 4 ? "\n…" : ""}`;
  }
  // Caso contrário, usa parágrafos/sentenças
  const paragraphs = normalized.split(/\n+/).filter(Boolean);
  const sentences = normalized.split(/(?<=[.!?])\s+/).filter(Boolean);
  let summary = "";
  if (paragraphs.length > 1) {
    summary = paragraphs.slice(0, 3).join("\n");
  } else {
    summary = sentences.slice(0, 3).join(" ");
  }
  if (summary.length > 600) summary = summary.slice(0, 600) + "…";
  return summary;
};
