import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import ResumeService from "../services/resume.service";
import AnalysisResult from "../components/AnalysisResult";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("Software Developer");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const roles = [
    "Software Developer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "Data Scientist",
    "UI/UX Designer",
    "Java Developer",
    "Product Manager"
  ];

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // Reset state on new file
    setMessage("");
    setAnalysis(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a resume file first.");
      return;
    }
    if (!jobDescription.trim()) {
      setMessage("Please provide a brief job description.");
      return;
    }

    setLoading(true);
    setMessage("");
    setAnalysis(null);

    try {
      // Step 1: Upload and Parse
      setMessage("Uploading resume & parsing text...");
      const uploadRes = await ResumeService.uploadResume(file);
      const resumeId = uploadRes.data.resumeId;

      // Step 2: Generate Analysis
      setMessage("Analyzing with AI... this may take a few seconds.");
      const analysisRes = await ResumeService.generateAnalysis(resumeId, jobRole, jobDescription);
      
      setAnalysis(analysisRes.data);
      setMessage(""); // Clear status message on success

    } catch (error) {
      console.error(error);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        "An unexpected error occurred.";

      setMessage(resMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-xl font-bold text-indigo-600">AI Resume Analyzer</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {currentUser?.username}</span>
              <button
                onClick={() => navigate("/builder")}
                className="rounded-md bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
              >
                Resume Builder
              </button>
              <button
                onClick={handleLogout}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="md:grid md:grid-cols-3 md:gap-8">
          
          {/* Left Column - Input Form */}
          <div className="md:col-span-1">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Analyze Resume</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p>Upload a resume and specify the target role to get an AI-powered ATS score and suggestions.</p>
                </div>
                
                <form onSubmit={handleAnalyze} className="mt-5 space-y-4">
                  
                  {/* Role Selection */}
                  <div>
                    <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700">
                      Target Role
                    </label>
                    <select
                      id="jobRole"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      {roles.map(role => (
                         <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  {/* Job Description Input */}
                  <div>
                    <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                      Job Description
                    </label>
                    <textarea
                      id="jobDescription"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Paste the target job description here..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Resume File</label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.docx" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
                        {file && <p className="text-sm font-semibold text-indigo-600 mt-2">{file.name}</p>}
                      </div>
                    </div>
                  </div>

                  {message && (
                    <div className={`text-sm ${message.includes('Error') || message.includes('error') ? 'text-red-500' : 'text-blue-500'}`}>
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full disabled:bg-indigo-300"
                  >
                    {loading ? "Analyzing..." : "Analyze Resume"}
                  </button>
                </form>

              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="md:col-span-2 mt-8 md:mt-0">
             {analysis ? (
                <AnalysisResult result={analysis} />
             ) : (
                <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                   <div>
                     <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                     <h3 className="mt-2 text-sm font-medium text-gray-900">No Analysis Yet</h3>
                     <p className="mt-1 text-sm text-gray-500">Upload a resume and fill out the details on the left to get started.</p>
                   </div>
                </div>
             )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
