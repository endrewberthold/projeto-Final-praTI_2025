import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/pages/dashboard.sass";
import { FaBookOpen } from "react-icons/fa";
import { TbMathFunction } from "react-icons/tb";
import { GiAtom } from "react-icons/gi";
import { FaGlobeAmericas } from "react-icons/fa";

//import NavBar from "../components/NavBar";
import FlashCardDashboard from "../components/FlashCardDashboard";
import UserStatusDashboard from "../components/UserStatusDashboard";
import CardSkillsDashboard from "../components/CardSkillsDashboard";
//import { BiMath } from "react-icons/bi";

export default function Dashboard() {
  const id = "LC";

  return (
    <div className="container-dashboard">
      {/* <h1>DASHBOARD</h1> */}
      

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
            icon={<GiAtom />}
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
      <div className="upperCards">
        <UserStatusDashboard imageProfile={"../../public/imagemdeperfil.png"} StudyTime={20} numberofcorrectanswers={9} percentage={10}/>
      </div>
    </div>
  );
}
