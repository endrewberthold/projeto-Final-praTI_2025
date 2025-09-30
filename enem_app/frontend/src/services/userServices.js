import axios from "../api/axios";

const LOGIN_URL = "/api/auth/login";
const REGISTER_URL = "/api/auth/register";

// FOR USER LOGIN --------------------------------------------------------------------------------------------
export async function loginAPI(email, password) {
  const response = await axios.post(
    LOGIN_URL,
    JSON.stringify({
      email,
      password,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response;
}

// FOR USER REGISTER -------------------------------------------------------------------------------------------
export async function registerAPI(profileImage, name, email, password) {
  const response = await axios.post(
    REGISTER_URL,
    JSON.stringify({ profileImage, name, email, password }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return response;
}
