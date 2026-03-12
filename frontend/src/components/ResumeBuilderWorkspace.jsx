import React from "react";

const ResumeBuilderWorkspace = ({ formData }) => {
  // LaTeX-style / Faang-style ATS Template
  return (
    <div className="bg-white p-8 font-serif text-black leading-snug" id="resume-preview-workspace">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-1">
          {formData.fullName || "Your Name"}
        </h1>
        <div className="text-[14px] flex flex-wrap justify-center items-center gap-2">
          {formData.email && (
            <a href={`mailto:${formData.email}`} className="text-blue-700 hover:underline">
               {formData.email}
            </a>
          )}
          {formData.email && formData.phone && <span>—</span>}
          {formData.phone && <span>{formData.phone}</span>}
          
          {formData.linkedin && (
             <>
                <span>—</span>
                <a href={formData.linkedin} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                  LinkedIn
                </a>
             </>
          )}
          {/* If you add github later to formData:
          {formData.github && (
             <>
                <span>—</span>
                <a href={formData.github} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                  GitHub
                </a>
             </>
          )} 
          */}
        </div>
      </div>

      {/* Summary */}
      {formData.summary && (
        <div className="mb-4">
          <h2 className="text-[17px] font-bold border-b border-black pb-0.5 mb-1">Summary</h2>
          <p className="text-[14px] whitespace-pre-wrap text-justify">{formData.summary}</p>
        </div>
      )}

      {/* Skills */}
      {formData.skills && (
        <div className="mb-4">
          <h2 className="text-[17px] font-bold border-b border-black pb-0.5 mb-1">Technical Skills</h2>
          <p className="text-[14px] whitespace-pre-wrap">{formData.skills}</p>
        </div>
      )}

      {/* Experience */}
      {formData.experience && formData.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[17px] font-bold border-b border-black pb-0.5 mb-1">Experience</h2>
          <div className="space-y-3 text-[14px]">
            {formData.experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{exp.title}</span> 
                    {exp.company && <span className="mx-1">—</span>} 
                    {exp.company && <span className="font-bold">{exp.company}</span>}
                  </div>
                  <div className="whitespace-nowrap">{exp.date}</div>
                </div>
                <ul className="list-disc pl-5 mt-1 space-y-0.5">
                  {exp.description.split('\n').map((bullet, bidx) => (
                    bullet.trim() && <li key={bidx} className="text-justify">{bullet.replace(/^- /, '')}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {formData.education && formData.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[17px] font-bold border-b border-black pb-0.5 mb-1">Education</h2>
          <div className="space-y-2 text-[14px]">
            {formData.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold">{edu.degree}</span>
                  {edu.school && <span className="mx-1">—</span>}
                  {edu.school && <span>{edu.school}</span>}
                </div>
                <div className="whitespace-nowrap">{edu.year}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilderWorkspace;
