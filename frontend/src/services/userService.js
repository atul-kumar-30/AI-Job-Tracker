import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// Helper to get token and format headers
const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// GET USER PROFILE
export const getUserProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, getConfig());
  return response.data;
};

// UPDATE USER PROFILE (AI Context)
export const updateUserProfile = async (userData) => {
  const response = await axios.put(`${API_URL}/profile`, userData, getConfig());
  return response.data;
};

// CHANGE PASSWORD
export const changePassword = async (passwordData) => {
  const response = await axios.put(`${API_URL}/change-password`, passwordData, getConfig());
  return response.data;
};

// DELETE ACCOUNT
export const deleteAccount = async () => {
  const response = await axios.delete(`${API_URL}/profile`, getConfig());
  return response.data;
};