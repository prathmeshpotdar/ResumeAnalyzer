import React, { useState } from 'react';
import ResumeBuilderWorkspace from '../components/ResumeBuilderWorkspace';
import AuthService from '../services/auth.service';
import axiosInstance from "axios";

const AI_URL = "http://localhost:8081/api/ai/";

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
    skills: "",
    experience: [{ title: "", company: "", date: "", description: "" }],
    education: [{ degree: "", school: "", year: "" }]
  });

  const [aiLoading, setAiLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, field, value, type) => {
    const updatedArray = [...formData[type]];
    updatedArray[index][field] = value;
    setFormData({ ...formData, [type]: updatedArray });
  };

  const addArrayItem = (type) => {
    const newItem = type === "experience" 
      ? { title: "", company: "", date: "", description: "" }
      : { degree: "", school: "", year: "" };
    setFormData({ ...formData, [type]: [...formData[type], newItem] });
  };

  const removeArrayItem = (index, type) => {
    const updatedArray = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updatedArray });
  };

  const improveWithAI = async (text, context, onSuccess) => {
    if (!text || !text.trim()) {
      alert("Please enter some text in the field before using the AI improve feature.");
      return;
    }
    setAiLoading(true);
    // setAiSuggestion(""); // We no longer use the floating box
    
    try {
        const response = await axiosInstance.post(AI_URL + "improve", { text, context });
        if (onSuccess) {
            onSuccess(response.data.improvedText);
        }
    } catch (e) {
        console.error("Error calling AI improve:", e);
        alert("Failed to improve text. Please try again.");
    } finally {
        setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row print:bg-white print:block">
      
      {/* Editor Panel - Hidden on Print */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto h-screen border-r border-gray-300 bg-white print:hidden">
        {/* ... Editor Content remains unchanged ... */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Resume Details Editor</h2>
        
        {/* Personal Details */}
        <section className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="fullName" placeholder="Full Name" className="border p-2 rounded" value={formData.fullName} onChange={handleInputChange} />
            <input type="email" name="email" placeholder="Email" className="border p-2 rounded" value={formData.email} onChange={handleInputChange} />
            <input type="text" name="phone" placeholder="Phone" className="border p-2 rounded" value={formData.phone} onChange={handleInputChange} />
            <input type="text" name="location" placeholder="City, State" className="border p-2 rounded" value={formData.location} onChange={handleInputChange} />
            <input type="text" name="linkedin" placeholder="LinkedIn URL" className="border p-2 rounded col-span-2" value={formData.linkedin} onChange={handleInputChange} />
          </div>
        </section>

        {/* Summary */}
        <section className="space-y-4 mb-8">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-indigo-600">Professional Summary</h3>
            <button onClick={() => improveWithAI(formData.summary, "resume summary", (improved) => setFormData({...formData, summary: improved}))} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200">
               {aiLoading ? "Thinking..." : "✨ Improve with AI"}
            </button>
          </div>
          <textarea name="summary" rows="4" className="w-full border p-2 rounded" placeholder="A brief summary of your expertise..." value={formData.summary} onChange={handleInputChange} />
        </section>

        {/* Experience */}
        <section className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-2">Experience</h3>
          {formData.experience.map((exp, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded mb-4 shadow-sm border">
               <div className="grid grid-cols-2 gap-4 mb-3">
                  <input type="text" placeholder="Job Title" className="border p-2 rounded" value={exp.title} onChange={(e) => handleArrayChange(index, "title", e.target.value, "experience")} />
                  <input type="text" placeholder="Company Name" className="border p-2 rounded" value={exp.company} onChange={(e) => handleArrayChange(index, "company", e.target.value, "experience")} />
                  <input type="text" placeholder="Date (e.g. Jan 2020 - Present)" className="border p-2 rounded col-span-2" value={exp.date} onChange={(e) => handleArrayChange(index, "date", e.target.value, "experience")} />
               </div>
               <div className="relative">
                  <textarea rows="3" placeholder="Description of achievements..." className="w-full border p-2 rounded mb-2" value={exp.description} onChange={(e) => handleArrayChange(index, "description", e.target.value, "experience")} />
                  <div className="flex justify-between mt-1">
                      <button onClick={() => improveWithAI(exp.description, exp.title || "experience description", (improved) => handleArrayChange(index, "description", improved, "experience"))} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 flex items-center">
                          {aiLoading ? "Thinking..." : "✨ Rewrite description"}
                      </button>
                      <button onClick={() => removeArrayItem(index, "experience")} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  </div>
               </div>
            </div>
          ))}
          <button onClick={() => addArrayItem("experience")} className="text-sm text-indigo-600 font-medium">+ Add Experience</button>
        </section>

        {/* Skills */}
        <section className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-2">Skills</h3>
          <input type="text" name="skills" placeholder="React, Node.js, Java, Spring Boot..." className="w-full border p-2 rounded" value={formData.skills} onChange={handleInputChange} />
        </section>

        {/* Education */}
        <section className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-2">Education</h3>
          {formData.education.map((edu, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded mb-4 shadow-sm border grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Degree" className="border p-2 rounded" value={edu.degree} onChange={(e) => handleArrayChange(index, "degree", e.target.value, "education")} />
                  <input type="text" placeholder="School/University" className="border p-2 rounded" value={edu.school} onChange={(e) => handleArrayChange(index, "school", e.target.value, "education")} />
                  <input type="text" placeholder="Graduation Year" className="border p-2 rounded" value={edu.year} onChange={(e) => handleArrayChange(index, "year", e.target.value, "education")} />
                  <div className="flex items-center justify-end">
                      <button onClick={() => removeArrayItem(index, "education")} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  </div>
            </div>
          ))}
          <button onClick={() => addArrayItem("education")} className="text-sm text-indigo-600 font-medium">+ Add Education</button>
        </section>
      </div>

      {/* Screen Preview Container (Hidden on Print entirely to break formatting chains) */}
      <div className="w-full md:w-1/2 bg-gray-200 p-8 flex justify-center overflow-y-auto h-screen print:hidden">
         <div className="w-full max-w-[800px] min-h-[1100px] scale-90 sm:scale-100 transform origin-top shadow-xl">
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => window.print()} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm rounded shadow-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                Export PDF
              </button>
            </div>
            
            <ResumeBuilderWorkspace formData={formData} />
         </div>
      </div>

      {/* Actual Print Component (Only Visible on Print) */}
      <div className="hidden print:block print:absolute print:inset-0 print:m-0 print:p-[0.75in]">
         <ResumeBuilderWorkspace formData={formData} />
      </div>

      <style type="text/css" media="print">{`
        @page {
          size: auto;
          margin: 0;
        }
        body, html {
          height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
        }
      `}</style>
    </div>
  );
};

export default ResumeBuilder;
