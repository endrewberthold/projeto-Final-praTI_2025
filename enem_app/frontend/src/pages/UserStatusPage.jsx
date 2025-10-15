import React, { useEffect, useState } from "react";
import "../styles/pages/userStatusPage.sass";
import { MdEdit } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { FaBook, FaTrophy, FaClock, FaChartLine, FaAward, FaBrain, FaStar } from "react-icons/fa";
import StatCard from "../components/StatCard";

import useAuth from "../hooks/useAuth";
import { userStatusFullAPI } from "../services/userStatusServices";

export default function UserStatusPage() {
  const { accessToken } = useAuth();
  const [userData, setUserdata] = useState(null);
  const [userMetrics, setUserMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // More metrics
  const [topCompetencies, setTopCompetencies] = useState([]);
  const [topArea, setTopArea] = useState([]);
  const [topSkills, setTopSkills] = useState([]);

  async function getUserData() {
    try {
      console.log("🔍 Iniciando busca de dados do usuário...");
      console.log("🔑 AccessToken disponível:", !!accessToken);

      if (!accessToken) {
        console.log("❌ AccessToken não disponível");
        setError("Token de acesso não disponível");
        setLoading(false);
        return;
      }

      setError(null); // Limpar erros anteriores
      const response = await userStatusFullAPI(accessToken);
      console.log("✅ Resposta da API recebida:", response.data);

      setUserdata(response.data.user);
      setUserMetrics(response.data.metrics);
      setTopCompetencies(response.data.metrics.topCompetencies);
      setTopArea(response.data.metrics.topArea);
      setTopSkills(response.data.metrics.topSkills);
      setLoading(false);

      console.log("📊 METRICS: ", response.data.metrics);
      console.log("👤 USER DATA: ", response.data.user);
      console.log("TOP COMPETENCIAS: ", response.data.metrics.topCompetencies);
      console.log("TOP AREA: ", response.data.metrics.topArea);
      console.log("TOP SKILLS: ", response.data.metrics.topSkills);
    } catch (err) {
      console.error("❌ ERRO ao buscar dados do usuário:", err);
      console.error("📝 Detalhes do erro:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erro ao carregar dados do usuário");
      setLoading(false); // Importante: definir loading como false mesmo em caso de erro
    }
  }

  useEffect(() => {
    if (accessToken) {
      getUserData();
    }
  }, [accessToken]);

  if (loading) {
    return (
      <div className="user-status-page">
        <div className="container-usersatus">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '1.2rem',
            color: 'var(--text-primary)'
          }}>
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '1.2rem',
            color: 'var(--text-primary)',
            textAlign: 'center',
            gap: '1rem'
          }}>
            <div style={{ color: 'var(--accent-primary)', fontSize: '3rem' }}>⚠️</div>
            <div>Erro ao carregar dados</div>
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{error}</div>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                getUserData();
              }}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem'
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
               <button className="button-icon">
                 < MdEdit size={20} fill="#fff" />
               </button>
             </div>

             <div className="user-name">
               {userData ? <h1 className="name">{userData.name}</h1> : <p>Loading....</p>}
               {userData?.email && <p className="user-email">{userData.email}</p>}
               <p className="userDate">
                 Por aqui desde {userData?.createAt ? new Date(userData.createAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : 'março de 2024'}
               </p>
               {userData && (
                 <div className="user-level-info">
                   <p className="level-text">Nível {userData.level || 1}</p>
                   <p className="xp-text">{userData.xpPoints || 0} XP</p>
                 </div>
               )}
             </div>
           </div>
          <hr />
          <div className="statistics">
            <h2 className="name">Estatísticas</h2>


            <div className="container-statistics">
              <StatCard
                icon={<FaBook size={20} />}
                value={userMetrics?.totalSessions || 0}
                label="Sessões"
              />
              <StatCard
                icon={<FaClock size={20} />}
                value={userMetrics?.avgAnswerTimeMs ? Math.round(userMetrics.avgAnswerTimeMs / 1000 / 60) : 0}
                label="Minutos Médios"
              />
              <StatCard
                icon={<FaTrophy size={20} />}
                value={userMetrics?.flashcardsCount || 0}
                label="Flashcards"
              />
              <StatCard
                icon={<FaChartLine size={20} />}
                value={userMetrics?.overallAccuracyPct ? Math.round(userMetrics.overallAccuracyPct) : 0}
                label="Precisão %"
              />
            </div>

            {/* Top Área Section */}
            <h3 className="section-title">Top Área</h3>
            <div className="container-statistics">
              {topArea ? (
                <>
                  <StatCard
                    icon={<FaAward size={20} />}
                    value={topArea.areaName || "N/A"}
                    label="Área"
                  />
                  <StatCard
                    icon={<FaChartLine size={20} />}
                    value={topArea.accuracyPct ? Math.round(topArea.accuracyPct) : 0}
                    label="Precisão %"
                  />
                  <StatCard
                    icon={<FaTrophy size={20} />}
                    value={topArea.correctCount || 0}
                    label="Acertos"
                  />
                  <StatCard
                    icon={<FaBook size={20} />}
                    value={topArea.totalCount || 0}
                    label="Total"
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

             <h3 className="section-title">Top Competências</h3>
             <div className="container-statistics">
               {topCompetencies && topCompetencies.length > 0 ? (
                 topCompetencies.slice(0, 4).map((item, index) => (
                   <StatCard
                     key={index}
                     icon={<FaBrain size={20} />}
                     value={item.accuracyPct ? Math.round(item.accuracyPct) : 0}
                     label={`${item.competencyDescription?.substring(0, 20)}...` || `Competência ${index + 1}`}
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
              {topSkills && topSkills.length > 0 ? (
                topSkills.slice(0, 4).map((item, index) => (
                  <StatCard
                    key={index}
                    icon={<FaStar size={20} />}
                    value={item.accuracyPct ? Math.round(item.accuracyPct) : 0}
                    label={`${item.skillDescription?.substring(0, 20)}...` || `Skill ${index + 1}`}
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
    </div>
  );
}
