import "../styles/pages/questionPage.sass";
import React, { useState } from "react";

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

  const handleToggle = () => {
    setToggleSkill(!toggleSkill);
  };

  return (
    <div className="question-container">
      {children}
      <div
        className={
          toggleSkill ? "skill-container-open" : "skill-container-closed"
        }
      >
        {!toggleSkill ? (
          <button onClick={handleToggle}>Qual habilidade é nescessaria?</button>
        ) : (
          <>
            <button onClick={handleToggle}>X</button>
            <h4>{question.skillDescription}</h4>
          </>
        )}
      </div>
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
      <p error={error} className="error-message">
        {error}
      </p>
      <button className="answer-btn" onClick={onClick}>
        Responder
      </button>
    </div>
  );
}

export default QuestionPage;
