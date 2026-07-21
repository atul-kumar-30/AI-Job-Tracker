import axios from "axios";

const API_URL = "https://ai-job-tracker-backend-y025.onrender.com/api/jobs";


// GET TOKEN
const getToken = () => {
  return localStorage.getItem("token");
};


// CONFIG
const config = () => {
  return {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
};


// CREATE JOB
export const createJob = async (jobData) => {

  const response = await axios.post(
    API_URL,
    jobData,
    config()
  );

  return response.data;
};


// GET JOBS
export const getJobs = async () => {

  const response = await axios.get(
    API_URL,
    config()
  );

  return response.data;
};

// UPDATE JOB STATUS (Drag and Drop)
export const updateJobStatus = async (id, status) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${API_URL}/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};