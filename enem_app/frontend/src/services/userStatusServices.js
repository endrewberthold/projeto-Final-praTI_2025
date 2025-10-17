import axios from "../api/axios";

const USERDATA_URL = "/api/user/profile";
const USERDATAFULL_URL = "/api/user/profile/full";

// FOR INFO ON THE USER PROFILE ---------------------------------------------------------
export async function userStatusAPI(accessToken) {
  const response = await axios.get(USERDATA_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response;
}

// FOR USER FULL + METRICS INFORMATION ------------------------------------------------
export async function userStatusFullAPI(accessToken) {
  const response = await axios.get(USERDATAFULL_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response;
}
