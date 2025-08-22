import React, { useState } from "react";
import QuestionOption from "../components/QuestionOption";
import "../styles/pages/questionPage.sass";

function QuestionPage() {
  const [selected, setSelected] = useState(null);

  // Example question options array
  const question = [
    {
      id: 1,
      letter: "A",
      text: "",
      hasImage: true,
      imageURL: "https://placehold.co/200x100",
    },
    { id: 2, letter: "B", text: "Triângulo", hasImage: false, imageURL: "" },
    { id: 3, letter: "C", text: "Círculo", hasImage: false, imageURL: "" },
    { id: 4, letter: "D", text: "Quadrado", hasImage: false, imageURL: "" },
  ];

  return (
    <>
      <div className="conteiner-question">
        <h4>Perguntas</h4>
        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada
          fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam
          egestas semper. Aenean ultricies mi vitae est. Mauris placerat
          eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.
          Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet,
          wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum
          rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in
          turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus
          faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.
          Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor,
          facilisis luctus, metus
        </p>

        <div className="options-container">
          {question.map((option) => (
            <QuestionOption
              key={option.id}
              letter={option.letter}
              text={option.text}
              hasImage={option.hasImage}
              imageURL={option.imageURL}
              isSelected={selected === option.id}
              onClick={() => setSelected(option.id)}
            />
          ))}
        </div>

        <footer className="question-footer">
          <button>Criar Flashcard</button>
          <button>Responder</button>
        </footer>
      </div>
    </>
  );
}

export default QuestionPage;
