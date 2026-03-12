import React from 'react';

const AnalysisResult = ({ result }) => {
  if (!result) return null;

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 75) return "text-yellow-600 bg-yellow-100";
    if (score >= 50) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const scoreClass = getScoreColor(result.atsScore);

  let suggestions = [];
  try {
    suggestions = JSON.parse(result.suggestionsJson);
  } catch (e) {
    if (typeof result.suggestionsJson === 'string') {
        // Fallback or rough parsing
        suggestions = [result.suggestionsJson];
    }
  }

  return (
    <div className="mt-8 overflow-hidden rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Analysis Results</h3>
        <p className="mt-1 text-sm text-gray-500">
          Target Role: {result.jobRole}
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0">
          {/* ATS Score Circle */}
          <div className="flex flex-col items-center">
            <div className={`flex h-32 w-32 items-center justify-center rounded-full border-4 ${scoreClass.split(' ')[0].replace('text-', 'border-')} bg-white`}>
              <span className={`text-4xl font-bold ${scoreClass.split(' ')[0]}`}>{result.atsScore}</span>
            </div>
            <span className="mt-2 text-sm font-medium text-gray-500">ATS Match</span>
          </div>

          {/* Rating */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-sm font-medium text-gray-500">Overall Rating</span>
            <div className="flex space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-8 w-8 ${star <= result.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="mt-1 text-lg font-bold text-gray-900">{result.rating} / 5</span>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-8">
          <h4 className="text-md font-medium text-gray-900 mb-4">Suggestions for Improvement</h4>
          {suggestions && suggestions.length > 0 ? (
            <ul className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">{suggestion}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No specific suggestions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
