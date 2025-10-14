import React, { useEffect, useState } from "react";
import "../styles/pages/userStatusPage.sass";

import useAuth from "../hooks/useAuth";
import { userStatusFullAPI } from "../services/userStatusServices";

export default function UserStatusPage() {
  const { accessToken } = useAuth();
  const [userData, setUserdata] = useState([]);
  const [userMetrics, setUserMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  // More metrics
  const [topCompetencies, setTopCompetencies] = useState([]);
  const [topArea, setTopArea] = useState([]);
  const [topSkills, setTopSkills] = useState([]);

  async function getUserData() {
    try {
      const response = await userStatusFullAPI(accessToken);
      setUserdata(response.data.user);
      setUserMetrics(response.data.metrics);
      setLoading(false);
      setTopCompetencies(response.data.metrics.topCompetencies);
      setTopArea(response.data.metrics.topArea);
      setTopSkills(response.data.metrics.topSkills);

      console.log("METRICS: ", response.data.metrics);
      console.log("USER DATA: ", response.data.user);
      console.log("TOP COMPETENCIAS: ", response.data.metrics.topCompetencies);
      console.log("TOP AREA: ", response.data.metrics.topArea);
      console.log("TOP SKILLS: ", response.data.metrics.topSkills);
    } catch (err) {
      console.log("ERRO: ", err);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div className="container-usersatus">
      <h1>USER STATUS PAGE</h1>
      <p>User: {userData.name}</p>

      <p>Metrics</p>
      <p>Current Level: {userMetrics.currentLevel}</p>
      <p>FlashcardCount: {userMetrics.flashcardCount}</p>
      <p>Top Area: {userMetrics.topArea.areaId}</p>
      <p>Total Xp{userMetrics.totalXp}</p>

      {/* TOP AREA */}
      <div>
        <h4>Top area</h4>
        <p>Taxa de acertos: {topArea.accuracyPct}</p>
        <p>Nome da area: {topArea.areaName}</p>
        <p>Alternativas corretas: {topArea.correctCount}</p>
        <p>Total de alternativas respondidas(geral): {topArea.totalCount}</p>
      </div>

      {/* TOP COMPETENCIES */}
      {topCompetencies ? (
        <div>
          <h4>Competencias</h4>
          {topCompetencies.map((item) => (
            <div>
              <p>Descrição: {item.competencyDescription}</p>
              <p>Taxa de acertos: {item.accuracyPct}</p>
              <p>Alternativas corretas: {item.correctCount}</p>
              <hr />
              <br />
            </div>
          ))}
        </div>
      ) : (
        <p>Sem dados</p>
      )}

      {/* TOP SKILLS */}
      {topSkills ? (
        <div>
          <h4>Top Skills</h4>
          {topSkills.map((item) => (
            <div>
              <p>Descrição: {item.skillDescription}</p>
              <p>Taxa de acertos: {item.accuracyPct}</p>
              <p>Arternativas acertadas: {item.correctCount}</p>
              <p>Codigo da Skill: {item.skillCode}</p>
              <hr />
              <br />
            </div>
          ))}
        </div>
      ) : (
        <p>Sem dados</p>
      )}
    </div>
  );
}
