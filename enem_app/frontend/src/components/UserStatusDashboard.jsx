import React from "react";
import "../styles/components/userStatusPage.sass";
import { LuBookCheck } from "react-icons/lu";
import { LuTimer } from "react-icons/lu";

export default function StatusUsuario({
  imagemPerfil,
  porcentagem,
  nivel,
  tempoDeEstudo,
  numeroDeRespostasCertas,
}) {
  const raio = 90;
  const circunferencia = 2 * Math.PI * raio;
  const dashArray = circunferencia * 0.83;
  const progressoLength = (dashArray * porcentagem) / 100;

  return (
    <div className="status-usuario">
      <div className="conteiner-progresso">
        <div className="circulo-progresso">
          <div className="foto-perfil">
            <img src={imagemPerfil} alt="Perfil do usuário" />
          </div>
          <svg className="progresso-svg" width="200" height="200">
            <circle
              cx="100"
              cy="100"
              r={raio}
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${dashArray} ${circunferencia}`}
              strokeDashoffset="0"
              className="progresso-fundo"
            />
            <circle
              cx="100"
              cy="100"
              r={raio}
              stroke="#1fb6d3"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${progressoLength} ${circunferencia}`}
              strokeDashoffset="0"
              className="progresso-circulo"
            />
          </svg>
          <div className="porcentagem-no-circulo">{porcentagem}xp</div>
        </div>
        <div className="nivel">{nivel}</div>
        <div className="informacao-progresso">
          <div className="informacao">
            <LuBookCheck />
            {numeroDeRespostasCertas > 1 ? (
              <>{numeroDeRespostasCertas} respostas corretas</>
            ) : numeroDeRespostasCertas === 1 ? (
              <>{numeroDeRespostasCertas} resposta correta</>
            ) : (
              <>Nenhuma resposta correta</>
            )}
          </div>

          <div className="informacao">
            <LuTimer />
            {tempoDeEstudo > 1 ? (
              <>{tempoDeEstudo} minutos de estudo</>
            ) : tempoDeEstudo === 1 ? (
              <>{tempoDeEstudo} minuto de estudo</>
            ) : (
              <>Nenhum tempo de estudo</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
