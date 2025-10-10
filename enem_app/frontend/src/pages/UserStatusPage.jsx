import React, { useState, useEffect } from "react";
import "../styles/pages/userStatusPage.sass";
import { MdEdit } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";

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
              <div className="card-statistics"></div>
              <div className="card-statistics">
                <div>
                  < HiLightningBolt size={45} fill= "#f0b921ff"/>
                </div>
                <div>
                  <p>50</p>
                  <p>xp</p>
                </div>
              </div>
              <div className="card-statistics"></div>
              <div className="card-statistics"></div>

            </div>
            
          </div>
          </div>
      </div>
            
    </div>
  );
}
