import React from "react";
import "../styles/components/questionOption.sass"

const QuestionOption = ({ letter, text, isSelected, hasImage, imageURL, onClick }) => {
    return (
  <div
    className={`question-option ${isSelected ? "selected" : ""} ${hasImage ? "option-with-image" : ""}`}
    onClick={onClick}
  >
    {hasImage && <img src={imageURL} className="option-image" />}
    <div className="option-content">

      <span className="option-letter">{letter + ") "}</span>
      <span className="option-text">{text}</span>
    </div>
    </div>
)};

export default QuestionOption;
