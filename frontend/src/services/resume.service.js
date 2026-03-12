import axiosInstance from "axios";
import AuthService from "./auth.service";

const API_URL = "http://localhost:8081/api/";

// Configure axios interceptor to attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
      config.headers["Authorization"] = "Bearer " + user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const uploadResume = (file) => {
  let formData = new FormData();
  formData.append("file", file);

  return axiosInstance.post(API_URL + "resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const generateAnalysis = (resumeId, jobRole, jobDescription) => {
  return axiosInstance.post(API_URL + "analysis/generate", {
    resumeId,
    jobRole,
    jobDescription,
  });
};

const getAnalysis = (resumeId) => {
  return axiosInstance.get(API_URL + `analysis/${resumeId}`);
};

const ResumeService = {
  uploadResume,
  generateAnalysis,
  getAnalysis,
};

export default ResumeService;
