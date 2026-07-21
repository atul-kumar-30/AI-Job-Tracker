import axios from "axios";

const API_URL = "http://localhost:5000/api/ai";

const getConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const generateCoverLetter = async (jobData) => {
  const response = await axios.post(`${API_URL}/cover-letter`, jobData, getConfig());
  return response.data;
};

// NEW: ATS Scorer
export const getAtsScore = async (jobData) => {
    const response = await axios.post(`${API_URL}/ats-score`, jobData, getConfig());
    return response.data;
  };