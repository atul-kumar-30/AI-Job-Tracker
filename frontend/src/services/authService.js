import axios from "axios";

const API_URL = "https://ai-job-tracker-backend-y025.onrender.com/api/auth";


// REGISTER
export const registerUser = async (userData) => {

  const response = await axios.post(
    `${API_URL}/register`,
    userData
  );

  return response.data;
};


// LOGIN
export const loginUser = async (userData) => {

  const response = await axios.post(
    `${API_URL}/login`,
    userData
  );

  return response.data;
};