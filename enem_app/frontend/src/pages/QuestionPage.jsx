import "../styles/pages/questionPage.sass";
import React, { useState, useRef, useEffect } from "react";

function QuestionPage({
  toggleSkill,
  setToggleSkill,
  question,
  selected,
  onSelect,
  onClick,
  error,
  children,
}) {
  console.log("QUESTION PAGE");
  console.log(question);
  console.log("questionPage", toggleSkill);

  const contentWrapperRef = useRef(null);

  const handleToggle = () => {
    setToggleSkill(!toggleSkill);
  };

  // Scroll para o topo quando a questão muda
  useEffect(() => {
    if (contentWrapperRef.current) {
      contentWrapperRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [question?.questionId]);

  return (
    <div className="question-container">
      <div className="question-content-wrapper" ref={contentWrapperRef}>
        {children}
        <h3 className="question-title">{question.title}</h3>
        <p className="question-text">{question.text}</p>

        <div className="answers-list">
          {question.alternatives.map((alt, index) => {
            const letter = String.fromCharCode(97 + index); // renderiza letras das alternativas

            return (
              <div
                key={alt.presentedId || index}
                onClick={() => onSelect(question.questionId, alt.presentedId)}
                className={`answer-option ${
                  selected === alt.presentedId ? "selected" : ""
                }`}
              >
                <span className="answer-letter">{letter}) </span>
                <span className="answer-text">{alt.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <button className="answer-btn" onClick={onClick}>
        Responder
      </button>
    </div>
  );
}

export default QuestionPage;
