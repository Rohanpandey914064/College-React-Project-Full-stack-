import React from 'react';

const LETTERS = ['A', 'B', 'C', 'D'];

const QuestionCard = ({ question, selectedAnswer, onSelect }) => {
  if (!question) return null;

  return (
    <div className="card" style={{ padding: 'var(--sp-8)' }}>
      <p
        className="question-text"
        style={{ marginBottom: 'var(--sp-8)' }}
      >
        {question.question}
      </p>

      <div className="quiz-options-grid">
        {question.options.map((option, i) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={option}
              className={`option-btn${isSelected ? ' selected' : ''}`}
              onClick={() => onSelect(option)}
              disabled={false}
            >
              <span className="option-letter">{LETTERS[i]}</span>
              <span style={{ flex: 1 }}>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
