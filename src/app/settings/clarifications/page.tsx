'use client';

import { useState, useEffect } from 'react';
import { questions, getAnswer, setAnswer, allAnswers, resetAnswers, ClarifyingQuestion, ClarifyingAnswer } from '@/lib/clarifications';
import { NEXT_PUBLIC_SHOW_CLARIFICATIONS } from '@/lib/flags';

export default function ClarificationsPage() {
  const [answers, setAnswers] = useState<Record<string, ClarifyingAnswer>>({});
  const [savedMessage, setSavedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAnswers(allAnswers());
    setIsLoading(false);
  }, []);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswer(questionId, value);
    setAnswers(allAnswers());
    setSavedMessage('Saved');
    setTimeout(() => setSavedMessage(''), 2000);
  };

  const handleReset = () => {
    resetAnswers();
    setAnswers({});
    setSavedMessage('Reset');
    setTimeout(() => setSavedMessage(''), 2000);
  };

  const unansweredP0s = questions()
    .filter(q => q.priority === 'P0' && !answers[q.id])
    .map(q => q.label);

  if (!NEXT_PUBLIC_SHOW_CLARIFICATIONS) {
    return (
      <div className="min-h-screen bg-amber-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 mb-6">Clarifications</h1>
          <p className="text-amber-700">This feature is currently hidden by feature flag.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-amber-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-amber-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-8">
          {/* Main Form */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-amber-900 mb-2">Clarifying Questions</h1>
              <p className="text-amber-700">
                Answer these questions to help guide development decisions. 
                P0 questions are blocking decisions that need immediate attention.
              </p>
            </div>

            <form className="space-y-6">
              {questions().map((question) => (
                <QuestionField
                  key={question.id}
                  question={question}
                  value={answers[question.id]?.value || ''}
                  onChange={(value) => handleAnswerChange(question.id, value)}
                />
              ))}

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2 bg-amber-200 text-amber-900 rounded-lg hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
                >
                  Reset All
                </button>
              </div>
            </form>

            {savedMessage && (
              <div 
                className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg"
                aria-live="polite"
              >
                {savedMessage}
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="w-80">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-amber-900 mb-4">Summary</h2>
              
              {unansweredP0s.length > 0 ? (
                <div className="mb-6">
                  <h3 className="font-semibold text-red-700 mb-2">Blocking Decisions</h3>
                  <ul className="space-y-1">
                    {unansweredP0s.map((label) => (
                      <li key={label} className="text-sm text-red-600 font-medium">
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="text-green-600 text-sm font-medium">
                    ✓ All P0 questions answered
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm text-amber-700">
                <div className="flex justify-between">
                  <span>P0 Questions:</span>
                  <span className="font-medium">
                    {questions().filter(q => q.priority === 'P0').length - unansweredP0s.length} / {questions().filter(q => q.priority === 'P0').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>P1 Questions:</span>
                  <span className="font-medium">
                    {questions().filter(q => q.priority === 'P1' && answers[q.id]).length} / {questions().filter(q => q.priority === 'P1').length}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>
                    {Object.keys(answers).length} / {questions().length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuestionFieldProps {
  question: ClarifyingQuestion;
  value: string;
  onChange: (value: string) => void;
}

function QuestionField({ question, value, onChange }: QuestionFieldProps) {
  const priorityColor = question.priority === 'P0' ? 'bg-amber-500' : 'bg-gray-400';
  const priorityText = question.priority === 'P0' ? 'P0' : 'P1';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start gap-3 mb-4">
        <span className={`px-2 py-1 text-xs font-semibold text-white rounded ${priorityColor}`}>
          {priorityText}
        </span>
        <h3 className="text-lg font-semibold text-amber-900 flex-1">
          {question.label}
        </h3>
      </div>

      {question.notes && (
        <p className="text-sm text-amber-700 mb-4">{question.notes}</p>
      )}

      {question.type === 'yesno' && (
        <div className="space-y-2">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name={question.id}
                value="yes"
                checked={value === 'yes'}
                onChange={(e) => onChange(e.target.value)}
                className="mr-2 text-amber-600 focus:ring-amber-500"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name={question.id}
                value="no"
                checked={value === 'no'}
                onChange={(e) => onChange(e.target.value)}
                className="mr-2 text-amber-600 focus:ring-amber-500"
              />
              No
            </label>
          </div>
        </div>
      )}

      {question.type === 'select' && question.options && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="">Select an option...</option>
          {question.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {question.type === 'text' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your answer..."
          className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      )}

      {question.type === 'number' && (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a number..."
          className="w-full p-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      )}
    </div>
  );
}
