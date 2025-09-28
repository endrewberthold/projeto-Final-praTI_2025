import { FaBook } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { PiCards } from "react-icons/pi";
import { BsPerson } from "react-icons/bs";
import "../styles/components/userStatusDashboard.sass";
import { NavLink } from "react-router-dom";
import { useNavbar } from "../context/NavbarContext";

export default function StatusUsuario({
  imageProfile,
  percentage,
  StudyTime,
  numberofcorrectanswers,
}) {
  const { updateActiveIndex } = useNavbar();
  
  const radius = 90;
  const circunferency = 2 * Math.PI * radius;
  const dashArray = circunferency * 0.83;
  const progressLength = (dashArray * percentage) / 100;

  return (
    <div className="status-user">
      <div className="container-progress">
        <div className="progress-circle">
          <div className="photo-profile">
            <img src={imageProfile} alt="Perfil do usuário" />
          </div>
          <svg className="progress-svg" width="200" height="200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#c0d5f3ff"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${dashArray} ${circunferency}`}
              strokeDashoffset="0"
              className="progress-background"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="#4e6dc2ff"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${progressLength} ${circunferency}`}
              strokeDashoffset="0"
              className="progress-foreground"
            />
          </svg>
          <div className="percentage-in-circle">{percentage}xp</div>
        </div>
        <div
          className="name-user"> Fulana </div>
        {/* Depois definir limite de caracteres */}
        <div className="information-progress">
          <div className="information" id="info-answers">
            <FaBook size={25} fill="#4e6dc2ff" />
            {numberofcorrectanswers > 1 ? (
              <div className="information-container">
                <p>{numberofcorrectanswers}</p>
                <p className="time-responses">Respostas</p>
              </div>
            ) : numberofcorrectanswers === 1 ? (
              <div className="information-container">
                <p>{numberofcorrectanswers}</p>
                <p className="time-responses">Resposta</p>
              </div>
            ) : (
              <div className="information-container">Nenhum</div>
            )}
          </div>

          <div className="information" id="info-time">
            <MdOutlineAccessTimeFilled size={25} fill="#4e6dc2ff" />
            {StudyTime > 1 ? (
              <div className="information-container">
                <p>{StudyTime}</p>
                <p className="time-responses">Minutos </p>
              </div>
            ) : StudyTime === 1 ? (
              <div className="information-container">
                <p>{StudyTime}</p>
                <p className="time-responses">Minuto</p>
              </div>
            ) : (
              <div className="information-container">Nenhum</div>
            )}
          </div>
        </div>
        <NavLink to={"/userStatusPage"}>
          <button 
            className="button-user-status"
            onClick={() => updateActiveIndex(0)}
          >
            <BsPerson color="#fff" size={"2rem"}            
            />
            <h1>Ver perfil</h1>
          </button>
        </NavLink>

        <NavLink to="/flashCardPage">
          <button 
            className="button-user-status"
            onClick={() => updateActiveIndex(2)}
          >
            < PiCards color="#fff" size={"2rem"}/>           
            <h1>FlashCards</h1>
          </button>
        </NavLink>

      </div>
      
    </div>
  );
}
