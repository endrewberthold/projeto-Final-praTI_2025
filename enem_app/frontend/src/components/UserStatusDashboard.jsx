import { PiCards } from "react-icons/pi";
import { BsPerson } from "react-icons/bs";
import { FaStar } from "react-icons/fa";
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
  userMetrics,
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

    // Caminho absoluto dentro do /public (já correto)
    if (s.startsWith("/")) return s;
    
    // Qualquer outro caso
    return "/imagemdeperfil.png";
  }

  useEffect(() => {
    const src = userData?.user?.profileImage || imageProfile;
    //console.log("🖼️ UserStatusDashboard - ProfileImage original:", src);
    const normalized = normalizeProfileImage(src);
    //console.log("🖼️ UserStatusDashboard - ProfileImage normalizada:", normalized);
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
            icon={<FaStar size={20} />}
            value={userData?.user?.level || userMetrics?.currentLevel || 1}
            label="Nível"
          />
          <StatCard
            icon={<PiCards size={20} />}
            value={userMetrics?.flashcardsCount || 0}
            label={userMetrics?.flashcardsCount === 1 ? "Flashcard" : "Flashcards"}
          />
        </div>
        <NavLink to={"/userStatusPage"}>
          <button
            className="button-user-status"
            onClick={() => updateActiveIndex(0)}
          >
            <BsPerson color="#fff" size={"2rem"} />
          </button>
        </NavLink>

        <NavLink to="/flashCardPage">
          <button
            className="button-user-status"
            onClick={() => updateActiveIndex(2)}
          >
            <PiCards color="#fff" size={"2rem"} />
          </button>
        </NavLink>
      </div>
    </div>
  );
}
