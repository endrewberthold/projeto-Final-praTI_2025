import React, { useState } from "react";
import "../styles/pages/userStatusPage.sass";
import axios from "../api/axios";

import useAuth from "../hooks/useAuth";

const USERDATA_URL = "/api/user/profile";

export default function UserStatusPage() {
  const { accessToken } = useAuth();
  const [userData, setUserdata] = useState([]);

  async function getUserData() {
    try {
      const response = await axios.get(USERDATA_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setUserdata(response.data);
      console.log("RESPONSE USERDATA: ", response.data);
    } catch (err) {
      console.log("ERRO: ", err);
    }
  }

  useState(() => {
    getUserData();
  }, []);
  return (
    <div className="container-usersatus">
      <h1>USER STATUS PAGE</h1>
      {userData ? <p>User name: {userData.name}</p> : <p>Loading....</p>}
    </div>
  );
}
