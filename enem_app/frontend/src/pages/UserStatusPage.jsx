import React, { useState } from "react";
import "../styles/pages/userStatusPage.sass";

import useAuth from "../hooks/useAuth";
import { userStatusAPI } from "../services/userStatusServices";

export default function UserStatusPage() {
  const { accessToken } = useAuth();
  const [userData, setUserdata] = useState([]);

  async function getUserData() {
    try {
      const response = await userStatusAPI(accessToken);
      setUserdata(response.data);

      //console.log("RESPONSE USER DATA: ", response.data);
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
