import { LuCrown } from "react-icons/lu";
import { PiCrownSimpleFill } from "react-icons/pi";
import "../styles/components/LessonCircle.sass";

export default function LessonCircle({ imgLesson, porcentagem }) {
  const raio = 86;
  const circunferencia = 2 * Math.PI * raio;
  const dashArray = circunferencia * 0.98;
  const progressoLength = (dashArray * porcentagem) / 100;

  return (
    <div className="status-lesson">
      <div className="conteiner-progress">
        <div className="circle-progress">
          <div className="foto-tema">
            <img src={imgLesson} alt="Imagem da diciplida" />
          </div>
          <svg className="progress-svg" width="200" height="200">
            <circle
              cx="100"
              cy="100"
              r={raio}
              stroke="#ffffffff"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${dashArray} ${circunferencia}`}
              strokeDashoffset="0"
              className="progress-fundo"
              strokeLinecap="round"
              style={{
                transform: "rotate(-280deg)",
                transformOrigin: "50% 50%",
              }}
            />
            <circle
              cx="100"
              cy="100"
              r={raio}
              stroke="#aecffaff"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${progressoLength} ${circunferencia}`}
              strokeDashoffset="0"
              className="progress-circulo"
              strokeLinecap="round"
              style={{
                transform: "rotate(-280deg)", // gira para o topo
                transformOrigin: "50% 50%", // centraliza a rotação
              }}
            />
          </svg>
        </div>

        <div
          className="crown-wrapper"
          style={{ position: "relative", width: 55, height: 55 }}
            >
          {/* metade esquerda */}
          <PiCrownSimpleFill
            className="lu-crown"
            size={55}
            color="#FFD233"
            style={{
                stroke: "white", // cor da borda
              strokeWidth: 20, // largura da borda
              strokeLinejoin: "round",
              strokeLinecap: "round",
              clipPath: "polygon(0 0, 50% 0, 50% 100%, 0% 100%)",
              WebkitClipPath: "polygon(0 0, 50% 0, 50% 100%, 0% 100%)",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          {/* metade direita */}
          <PiCrownSimpleFill
            className="lu-crown"
            size={55}
            color="#FFB900"
            style={{
                stroke: "white", // cor da borda
              strokeWidth: 20, // largura da borda
              strokeLinejoin: "round",
              strokeLinecap: "round",
              clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
              WebkitClipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
              position: "absolute",
              top: 0,
              left: -1,
            }}
          />
        
        </div>
      </div>
    </div>
  );
}
