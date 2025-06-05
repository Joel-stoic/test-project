import React, { useState } from 'react';
import QuestionForm from './QuestionForm';
import CsvUpload from './CsvUpload';

const TestList = ({ tests, onUpdate }) => {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (testId) => {
    setExpanded(expanded === testId ? null : testId);
  };

  return (
    <div className="test-list-container">
      <h3 className="text-lg font-semibold mb-4">Tests</h3>
      {tests.length === 0 ? (
        <div className="text-gray-500">No tests found.</div>
      ) : (
        <ul className="space-y-4">
          {tests.map(test => (
            <li key={test._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">{test.title}</span>
                  {test.description && <span className="text-gray-500 ml-2">- {test.description}</span>}
                </div>
                <button
                  onClick={e => { e.stopPropagation(); toggleExpand(test._id); }}
                  className="text-blue-600 hover:underline"
                >
                  {expanded === test._id ? 'Collapse' : 'Expand'}
                </button>
              </div>
              {expanded === test._id && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Questions</h4>
                  {test.questions.length === 0 ? (
                    <div className="text-gray-500">No questions yet.</div>
                  ) : (
                    <ul className="space-y-2">
                      {test.questions.map(q => (
                        <li key={q._id} className="border-b pb-2">
                          <div className="font-medium">{q.questionText}</div>
                          <ul className="ml-4 list-disc">
                            {q.options.map((opt, idx) => (
                              <li key={idx}>{String.fromCharCode(65 + idx)}. {opt}</li>
                            ))}
                          </ul>
                          <div className="text-green-600 text-sm">Correct Answer: {q.correctAnswer}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <QuestionForm testId={test._id} onQuestionAdded={onUpdate} />
                  <CsvUpload testId={test._id} onUpload={onUpdate} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestList; 