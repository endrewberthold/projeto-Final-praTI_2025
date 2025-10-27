import { FaBook } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { PiCards } from "react-icons/pi";
import { BsPerson } from "react-icons/bs";
import "../styles/components/userStatusDashboard.sass";
import { NavLink } from "react-router-dom";
import { useNavbar } from "../context/NavbarContext";
import useAuth from "../hooks/useAuth";
import StatCard from "./StatCard";
import React, { useEffect, useState } from "react";

export default function StatusUsuario({
  userData,
  imageProfile,
  percentage,
  StudyTime,
  numberofcorrectanswers,
}) {
  const { updateActiveIndex } = useNavbar();
  const { auth } = useAuth();
  const radius = 90;
  const circunferency = 2 * Math.PI * radius;
  const dashArray = circunferency * 0.83;
  const progressLength = (dashArray * percentage) / 100;

  const [imgSrc, setImgSrc] = useState("/imagemdeperfil.png");

  // Normaliza diferentes formatos vindos do backend/registro para caminhos válidos em /public
  function normalizeProfileImage(value) {
    if (!value) return "/imagemdeperfil.png";
    const s = String(value).trim();

    // URLs absolutas externas (http/https)
    if (/^https?:\/\//i.test(s)) return s;

    // Extrai número do avatar se existir
    const numMatch = s.match(/(\d{1,3})/);
    const num = numMatch ? numMatch[1] : null;
    // Determina gênero com case-insensitive
    const lower = s.toLowerCase();
    const isFemale = lower.includes("female");
    const isMale = lower.includes("male");

    // Caminhos com prefixo Female/Male (qualquer casing), ajusta barra e casing
    if (isFemale || isMale) {
      const folder = isFemale ? "Female" : "Male";
      if (num) return `/${folder}/${num}.png`;
      // Se não achar número, tenta último segmento
      const last = s
        .replace(/\.png$/i, "")
        .split("/")
        .pop();
      if (/^\d+$/.test(last)) return `/${folder}/${last}.png`;
      return "/imagemdeperfil.png";
    }
    // Somente número (ex: "56")
    if (num && /^\d+$/.test(s)) {
      return `/Male/${num}.png`;
    }
    // Caminho absoluto dentro do /public (já correto)
    if (s.startsWith("/")) return s;
    // Qualquer outro caso
    return "/imagemdeperfil.png";
  }

  useEffect(() => {
    const src = userData?.user?.profileImage || imageProfile;
    const normalized = normalizeProfileImage(src);
    setImgSrc(normalized);
  }, [userData?.user?.profileImage, imageProfile]);

  const handleImgError = () => {
    if (imgSrc.includes("/Male/")) {
      const num = imgSrc.split("/").pop()?.replace(".png", "");
      setImgSrc(`/Female/${num}.png`);
    } else {
      setImgSrc("/imagemdeperfil.png");
    }
  };

  return (
    <div className="status-user">
      <div className="container-progress">
        <div className="progress-circle">
          <div className="photo-profile">
            <img
              src={imgSrc}
              alt="Perfil do usuário"
              onError={handleImgError}
            />
          </div>
          <svg className="progress-svg" viewBox="0 0 200 200">
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
          <div className="percentage-in-circle">
            {userData?.user?.xpPoints}xp
          </div>
        </div>
        {/* <div className="name-user">{auth?.userName || "Usuário"}</div> */}
        <div className="name-user">{userData?.user?.name || "Usuário"}</div>
        {/* Depois definir limite de caracteres */}
        <div className="information-progress">
          <StatCard
            icon={<FaBook size={20} />}
            value={numberofcorrectanswers}
            label={numberofcorrectanswers === 1 ? "Resposta" : "Respostas"}
          />
          <StatCard
            icon={<MdOutlineAccessTimeFilled size={20} />}
            value={StudyTime}
            label={StudyTime === 1 ? "Minuto" : "Minutos"}
          />
        </div>
        <NavLink to={"/userStatusPage"}>
          <button
            className="button-user-status"
            onClick={() => updateActiveIndex(0)}
          >
            <BsPerson color="#fff" size={"2rem"} />
            <h1>Ver perfil</h1>
          </button>
        </NavLink>

        <NavLink to="/flashCardPage">
          <button
            className="button-user-status"
            onClick={() => updateActiveIndex(2)}
          >
            <PiCards color="#fff" size={"2rem"} />
            <h1>FlashCards</h1>
          </button>
        </NavLink>
      </div>
    </div>
  );
}
