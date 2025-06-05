import React, { useState } from 'react';
import api from '../api/api';

const QuestionForm = ({ testId, onQuestionAdded }) => {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOptionChange = (idx, value) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!options.every(opt => opt)) {
      setError('All options are required');
      return;
    }
    if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
      setError('Correct answer must be A, B, C, or D');
      return;
    }
    try {
      await api.post(`/tests/${testId}/questions`, {
        questionText,
        options,
        correctAnswer: options['ABCD'.indexOf(correctAnswer)],
      });
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
      setSuccess('Question added!');
      onQuestionAdded();
    } catch (err) {
      setError('Failed to add question');
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow mt-4">
      <h5 className="font-semibold mb-2">Add Question</h5>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Question Text"
          value={questionText}
          onChange={e => setQuestionText(e.target.value)}
          required
        />
        {['A', 'B', 'C', 'D'].map((label, idx) => (
          <input
            key={label}
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={`Option ${label}`}
            value={options[idx]}
            onChange={e => handleOptionChange(idx, e.target.value)}
            required
          />
        ))}
        <input
          type="text"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Correct Answer (A/B/C/D)"
          value={correctAnswer}
          onChange={e => setCorrectAnswer(e.target.value.toUpperCase())}
          maxLength={1}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
        >
          Add Question
        </button>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}
      </form>
    </div>
  );
};

export default QuestionForm; 