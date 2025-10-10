import React, { useState, useEffect } from "react";
import "../styles/pages/userStatusPage.sass";
import { MdEdit } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { FaBook, FaTrophy, FaClock, FaChartLine } from "react-icons/fa";
import StatCard from "../components/StatCard";

import useAuth from "../hooks/useAuth";
import { userStatusAPI } from "../services/userStatusServices";

export default function UserStatusPage() {
  const { accessToken } = useAuth();
  const [userData, setUserdata] = useState(null);

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await userStatusAPI(accessToken);
        setUserdata(response.data);

        //console.log("RESPONSE USER DATA: ", response.data);
      } catch (err) {
        console.log("ERRO: ", err);
      }
    }

    if (accessToken) {
      getUserData();
    }
  }, [accessToken]);

  return (
    <div className="user-status-page">
      <div className="container-usersatus">
          <div>
            <div className="profile-banner">
              <button className="button-icon">
                < MdEdit size={20} fill="#fff"/>
              </button>
            </div>

          <div className="user-name">
            <p id="name">Alexia Sacerdote de Oliveira</p>
            {userData ? <p className="userDate">{userData.name}</p> : <p>Loading....</p>}
            <p className="userDate">Por aqui desde março de 2024</p>
          </div>
          <hr />

          <div className="statistics">
            <h2 className="name">Estatísticas</h2>

            <div className="container-statistics">
              {userData ? (
                <>
                  <StatCard 
                    icon={<FaBook size={20} />} 
                    value={userData.correctAnswers || 0} 
                    label="Respostas" 
                  />
                  <StatCard 
                    icon={<FaClock size={20} />} 
                    value={userData.studyTime || 0} 
                    label="Minutos" 
                  />
                  <StatCard 
                    icon={<FaTrophy size={20} />} 
                    value={userData.achievements || 0} 
                    label="Conquistas" 
                  />
                  <StatCard 
                    icon={<FaChartLine size={20} />} 
                    value={userData.accuracy || 0} 
                    label="Precisão" 
                  />
                </>
              ) : (
                <>
                  <StatCard 
                    icon={<FaBook size={20} />} 
                    value={0} 
                    label="Respostas" 
                    className="stat-card--loading"
                  />
                  <StatCard 
                    icon={<FaClock size={20} />} 
                    value={0} 
                    label="Minutos" 
                    className="stat-card--loading"
                  />
                  <StatCard 
                    icon={<FaTrophy size={20} />} 
                    value={0} 
                    label="Conquistas" 
                    className="stat-card--loading"
                  />
                  <StatCard 
                    icon={<FaChartLine size={20} />} 
                    value={0} 
                    label="Precisão" 
                    className="stat-card--loading"
                  />
                </>
              )}
            </div>
            
          </div>
          </div>
      </div>
            
    </div>
  );
}
