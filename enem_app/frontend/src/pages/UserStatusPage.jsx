import React, { useEffect, useState } from "react";
import "../styles/pages/userStatusPage.sass";

import useAuth from "../hooks/useAuth";
import { userStatusFullAPI } from "../services/userStatusServices";

export default function UserStatusPage() {
  const { accessToken } = useAuth();
  const [userData, setUserdata] = useState([]);
  const [userMetrics, setUserMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getUserData() {
    try {
      const response = await userStatusFullAPI(accessToken);
      setUserdata(response.data.user);
      setUserMetrics(response.data.metrics);
      setLoading(false);
      //console.log("RESPONSE USER DATA: ", response.data);
      console.log("METRICS: ", response.data.metrics);
      console.log("USER DATA: ", response.data.user);
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
    </div>
  );
}
