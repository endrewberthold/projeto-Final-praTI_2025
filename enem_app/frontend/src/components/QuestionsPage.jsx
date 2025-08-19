import React, { useState } from "react";
import "../styles/components/questionPage.sass";

function QuestionPage() {
  const [selected, setSelected] = useState(null);

  const question = ["a) aaaaaaaaaaa", "b) aaaaaaaaaaaaa", "c) aaaaaaaaaaaaaa"];

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

        <div className="space-y-2">
          {question.map((pergunta, index) => (
            <div
              key={index}
              onClick={() => setSelected(selected === index ? null : index)}
              className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-105
            ${
              selected === index
                ? "bg-blue-500 text-white border-blue-600 shadow-lg"
                : "bg-gray-200 text-black border-gray-300 hover:bg-gray-300 hover:border-gray-400"
            }`}
            >
              <div className="flex items-center">
                {selected === index && <span className="mr-3 text-xl">✓</span>}
                <span className="font-medium">{pergunta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mostrar qual pergunta está selecionada */}
        {selected !== null && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
            <p className="text-green-700">
              <strong>Pergunta selecionada:</strong> {question[selected]}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default QuestionPage;
