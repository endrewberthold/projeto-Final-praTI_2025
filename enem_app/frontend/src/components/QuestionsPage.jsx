import React, { useState } from "react"

function QuestionPage() {
    const [selected, setSelected] = useState(null)

    return(
        <>
        <div></div>

        <div className="question-container">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis iste consequuntur nobis cupiditate libero animi dignissimos hic natus quaerat maiores! Rem dignissimos, voluptas perferendis aut numquam quo eaque cupiditate facilis!</p>
        </div>

        <div>
        <button type="submit" className="question-btn" id="alternativa-a">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</button>
        <button type="submit" className="question-btn" id="alternativa-b">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</button>
        <button type="submit" className="question-btn" id="alternativa-c">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</button>
        <button type="submit" className="question-btn" id="alternativa-d">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</button>
        <button type="submit" className="question-btn" id="alternativa-e">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</button>
        </div>

        <button className="flashcard-btn">+ Criar Flashcard</button>
        <button className="answer-btn">Responder</button>
        </>
    )
}

export default QuestionPage;