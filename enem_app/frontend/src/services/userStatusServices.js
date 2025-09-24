import axios from "../api/axios";

const USERDATA_URL = "/api/user/profile";

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
