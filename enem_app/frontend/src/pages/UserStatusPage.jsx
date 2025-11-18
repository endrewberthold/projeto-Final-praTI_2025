import React, { useEffect, useState } from "react";
import "../styles/pages/userStatusPage.sass";
import { MdEdit } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import {
  FaBook,
  FaTrophy,
  FaClock,
  FaChartLine,
  FaAward,
  FaBrain,
  FaStar,
} from "react-icons/fa";
import StatCard from "../components/StatCard";
import ProfileImageSelector from "../components/ProfileImageSelector";

import useAuth from "../hooks/useAuth";
import { userStatusFullAPI } from "../services/userStatusServices";

export default function UserStatusPage() {
  const { accessToken } = useAuth();

  //const [userData, setuserData] = useState(null)

  const [userData, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Profile image modal state
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [currentProfileImage, setCurrentProfileImage] = useState(null);

  // Função para normalizar imagem de perfil (mesma lógica do UserStatusDashboard)
  const normalizeProfileImage = (value) => {
    if (!value) return "/imagemdeperfil.png";
    const s = String(value).trim();

    // URLs absolutas externas (http/https)
    if (/^https?:\/\//i.test(s)) return s;

    // Caminho absoluto dentro do /public (já correto)
    if (s.startsWith("/")) return s;

    // Qualquer outro caso
    return "/imagemdeperfil.png";
  };

  async function getUserData() {
    try {
      //console.log("🔍 Iniciando busca de dados do usuário...");
      //console.log("🔑 AccessToken disponível:", !!accessToken);

      if (!accessToken) {
        console.log("❌ AccessToken não disponível");
        setError("Token de acesso não disponível");
        setLoading(false);
        return;
      }

      setError(null); // Limpar erros anteriores
      const response = await userStatusFullAPI(accessToken);

      setUserdata(response.data);

      const profileImage = response.data.user?.profileImage || "/imagemdeperfil.png";
      const normalizedImage = normalizeProfileImage(profileImage);
      setCurrentProfileImage(normalizedImage);
      setLoading(false);

      console.log("FULL DATA: ", response.data);
      
    } catch (err) {
      console.error("❌ ERRO ao buscar dados do usuário:", err);
      console.error("📝 Detalhes do erro:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Erro ao carregar dados do usuário"
      );
      setLoading(false); // Importante: definir loading como false mesmo em caso de erro
    }
  }

  useEffect(() => {
    if (accessToken) {
      getUserData();
    }
  }, [accessToken]);

  // Função para abrir o modal de seleção de imagem
  const handleOpenImageSelector = () => {
    setShowImageSelector(true);
  };

  // Função para fechar o modal
  const handleCloseImageSelector = () => {
    setShowImageSelector(false);
  };

  // Função para atualizar a imagem de perfil
  const handleProfileImageChange = (newImageId) => {
    console.log("Nova imagem selecionada:", newImageId);
    // Aqui você pode adicionar a lógica para salvar a nova imagem no backend
    // Por enquanto, vamos apenas atualizar o estado local
    setCurrentProfileImage(newImageId);
    setShowImageSelector(false);

    // TODO: Implementar chamada para API para atualizar a imagem no backend
    // updateProfileImageAPI(accessToken, newImageId);
  };

  if (loading) {
    return (
      <div className="user-status-page">
        <div className="container-usersatus">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              fontSize: "1.2rem",
              color: "var(--text-primary)",
            }}
          >
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-status-page">
        <div className="container-usersatus">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              fontSize: "1.2rem",
              color: "var(--text-primary)",
              textAlign: "center",
              gap: "1rem",
            }}
          >
            <div style={{ color: "var(--accent-primary)", fontSize: "3rem" }}>
              ⚠️
            </div>
            <div>Erro ao carregar dados</div>
            <div style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
              {error}
            </div>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                getUserData();
              }}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "var(--accent-primary)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-status-page">
      <div className="container-usersatus">
        <div>
          <div className="profile-section">
            <div className="profile-banner">
              <img
                alt="Perfil do usuário"
                src={
                  currentProfileImage ||
                  normalizeProfileImage(userData?.profileImage) ||
                  "/imagemdeperfil.png"
                }
                onError={(e) => {
                  e.target.src = "/imagemdeperfil.png";
                }}
              />
              <button className="button-icon" onClick={handleOpenImageSelector}>
                <MdEdit size={20} fill="#fff" />
              </button>
            </div>

            <div className="user-name">
              {userData ? (
                <h1 className="name">{userData.name}</h1>
              ) : (
                <p>Loading....</p>
              )}
              {userData?.email && (
                <p className="user-email">{userData.email}</p>
              )}
              <p className="userDate">
                Por aqui desde{" "}
                {userData?.user.createAt
                  ? new Date(userData.user.createAt * 1000).toLocaleDateString(
                      "pt-BR",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "março de 2024"}
              </p>
              {userData && (
                <div className="user-level-info">
                  <p className="level-text">Nível {userData.user.level || 1}</p>
                  <p className="xp-text">{userData.user.xpPoints || 0} XP</p>
                </div>
              )}
            </div>
          </div>
          <hr />
          <div className="statistics">
            <h2 className="name">Suas Estatísticas</h2>

            <div className="container-statistics">
              <StatCard
                icon={<FaBook size={20} />}
                value={userData?.metrics.totalSessions || 0}
                label="Sessões Finalizadas"
              />
              <StatCard
                icon={<FaClock size={20} />}
                value={
                  userData?.metrics.avgAnswerTimeMs
                    ? Math.round(userData?.metrics.avgAnswerTimeMs / 1000 / 60)
                    : 0
                }
                label="Tempo Médio por Questão (minutos)"
              />
              <StatCard
                icon={<FaTrophy size={20} />}
                value={userData?.metrics.flashcardsCount || 0}
                label="Flashcards na Biblioteca"
              />
             
            </div>

            {/* Top Área Section */}
            <h3 className="section-title">Top Área</h3>
            <div className="container-statistics">
              {userData ? (
                <>
                  <StatCard
                    icon={<FaAward size={20} />}
                    value={userData?.metrics.topArea.areaName || "N/A"}
                    label=""
                  />
                  
                  <StatCard
                    icon={<FaTrophy size={20} />}
                    value={userData?.metrics.topArea.correctCount || 0}
                    label="Total de Acertos"
                  />
                  <StatCard
                    icon={<FaBook size={20} />}
                    value={userData?.metrics.topArea.totalCount || 0}
                    label="Total de Questões Respondidas"
                  />
                </>
              ) : (
                <StatCard
                  icon={<FaAward size={20} />}
                  value="N/A"
                  label="Nenhuma área disponível"
                />
              )}
            </div>

            <h3 className="section-title">Competências mais Desenvolvidas</h3>
            <div className="container-statistics">
              {userData && userData?.metrics.topCompetencies.length > 0 ? (
                userData?.metrics.topCompetencies
                  .slice(0, 4)
                  .map((item, index) => (
                    <StatCard
                      key={index}
                      icon={<FaBrain size={20} />}
                      value={
                        ""
                      }
                      label={
                        `${item.competencyDescription}` ||
                        `Competência ${index + 1}`
                      }
                    />
                  ))
              ) : (
                <StatCard
                  icon={<FaBrain size={20} />}
                  value="N/A"
                  label="Nenhuma competência disponível"
                />
              )}
            </div>

            <h3 className="section-title">Top Skills</h3>
            <div className="container-statistics">
              {userData && userData?.metrics.topSkills.length > 0 ? (
                userData?.metrics.topSkills
                  .slice(0, 4)
                  .map((item, index) => (
                    <StatCard
                      key={index}
                      icon={<FaStar size={20} />}
                      value={
                        ""
                      }
                      label={
                        `${item.skillDescription}` ||
                        `Skill ${index + 1}`
                      }
                    />
                  ))
              ) : (
                <StatCard
                  icon={<FaStar size={20} />}
                  value="N/A"
                  label="Nenhuma skill disponível"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de seleção de imagem de perfil */}
      <ProfileImageSelector
        value={currentProfileImage}
        onChange={handleProfileImageChange}
        buttonLabel="Alterar imagem de perfil"
        isOpen={showImageSelector}
        onClose={handleCloseImageSelector}
        showButton={false}
      />
    </div>
  );
}
