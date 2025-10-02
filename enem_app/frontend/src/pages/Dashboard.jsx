import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/pages/dashboard.sass";
import { FaBookOpen } from "react-icons/fa";
import { TbMathFunction } from "react-icons/tb";
import { GiMicroscope } from "react-icons/gi";
import { FaGlobeAmericas } from "react-icons/fa";

import UserStatusDashboard from "../components/UserStatusDashboard";
import CardSkillsDashboard from "../components/CardSkillsDashboard";
import useAuth from "../hooks/useAuth";

// Importe sua imagem local aqui (ajuste o caminho conforme sua estrutura)
import educationImg from "../assets/undraw_blogging_38kl.svg";
// import educationImg2 from "../assets/undraw_books_wxzz.svg"

export default function Dashboard() {
  const { auth } = useAuth();
  const id = "LC";

  // Função para obter saudação baseada no horário e nome do usuário
  const getGreeting = (userName) => {
    const currentHour = new Date().getHours();
    const name = userName || "Usuário";

    if (currentHour >= 5 && currentHour < 12) {
      return {
        greeting: `Bom dia, ${name}!`,
        message: "Que tal começar o dia estudando para o ENEM?",
        period: "morning"
      };
    } else if (currentHour >= 12 && currentHour < 18) {
      return {
        greeting: `Boa tarde, ${name}!`,
        message: "Continue firme nos estudos para o ENEM!",
        period: "afternoon"
      };
    } else {
      return {
        greeting: `Boa noite, ${name}!`,
        message: "Dedique um tempo aos estudos antes de descansar!",
        period: "night"
      };
    }
  };

  const greetingData = getGreeting(auth?.userName);

  return (
    <div className="container-dashboard">
      <div className="left-column">
        <div className="banner-section">
          <div className={`banner-placeholder ${greetingData.period}`}>
            <div className="banner-text">
              <h2>{greetingData.greeting}</h2>
              <p>{greetingData.message}</p>
              <p className="banner-subtitle">
                Acelere seus estudos com nosso método exclusivo preparatório para o ENEM.
              </p>
            </div>
            <div className="banner-image">
              {/* OPÇÃO 1: Usando a imagem local importada */}
              {/* <img src={educationImg2} alt="Ilustração de educação"/> */}
              <img id="book" src={educationImg} alt="Ilustração de educação"/>

              {/* OPÇÃO 2: URL externa temporária (comentada) */}
              {/* <img
                src="https://cdn.pixabay.com/photo/2021/07/20/14/59/book-6480539_1280.png"
                alt="Ilustração de educação"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              /> */}
            </div>
          </div>
        </div>

        <div className="knowledAreCard-component">
          <h1>Comece sua jornada rumo ao ENEM!</h1>
          <div>
            <NavLink to={`/SkillPage/LC`}>
              <CardSkillsDashboard
                title={"Linguagens, Códigos e suas Tecnologias"}
                description={"Envolve interpretação de textos, gramática, literatura, artes, educação física e língua estrangeira (inglês ou espanhol)."}
                icon={<FaBookOpen />}
              />
            </NavLink>

            <NavLink to="/SkillPage/MT">
              <CardSkillsDashboard
                title={"Matemática e suas Tecnologias"}
                description={"Abrange resolução de problemas, álgebra, geometria, estatística, raciocínio lógico e funções."}
                icon={<TbMathFunction />}
              />
            </NavLink>

            <NavLink to="/SkillPage/CN">
              <CardSkillsDashboard 
                title={"Ciências da Natureza e suas Tecnologias"}
                description={"Inclui física, química e biologia, com foco em fenômenos naturais, experimentos e aplicações do conhecimento científico."}
                icon={<GiMicroscope />}
              />
            </NavLink>

            <NavLink to="/SkillPage/CH">
              <CardSkillsDashboard
                title={"Ciências Humanas e suas Tecnologias"}
                description={"Trata de história, geografia, filosofia e sociologia, analisando fatos históricos, culturais, sociais e políticos."}
                icon={<FaGlobeAmericas />}
              />
            </NavLink>
          </div>
        </div>
      </div>

      <div className="upperCards">
              <UserStatusDashboard imageProfile={"/imagemdeperfil.png"} StudyTime={20} numberofcorrectanswers={9} percentage={10}/>
      </div>
    </div>
  );
}