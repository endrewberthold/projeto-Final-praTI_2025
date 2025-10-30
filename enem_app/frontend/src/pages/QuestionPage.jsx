import "../styles/pages/questionPage.sass";
import React from "react";

function QuestionPage({
                          question,
                          selected,
                          onSelect,
                          onClick,
                          error,
                          children}) {
    return (
        <div className="question-container">{children}
            <h3 className="question-title">{question.title}</h3>
            <p className="question-text">{question.text}</p>

            <div className="answers-list">
                {question.alternatives.map((alt, index) => {
                    const letter = String.fromCharCode(97 + index);  // renderiza letras das alternativas

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
                <p error={error} className="error-message">{error}</p>
            <button className="answer-btn" onClick={onClick}>
                Responder
            </button>
        </div>
)}

export default QuestionPage;
