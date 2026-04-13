import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const { id, name, description, icon, color, colorLight, questions } = category;

  return (
    <div
      className="card card-hover category-card"
      onClick={() => navigate(`/quiz-setup/${id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/quiz-setup/${id}`)}
      style={{ cursor: 'pointer', borderTop: `3px solid ${color}` }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div
          style={{
            width: '50px', height: '50px',
            background: colorLight,
            borderRadius: 'var(--r-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem',
          }}
        >
          {icon}
        </div>
        <div
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: colorLight, color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <ArrowRight size={14} />
        </div>
      </div>

      <div>
        <div className="category-card-title">{name}</div>
        <div className="category-card-desc">{description}</div>
      </div>

      <div className="category-card-meta">
        <span>{questions.length} questions</span>
        <span>·</span>
        <span style={{ color }}>Start →</span>
      </div>
    </div>
  );
};

export default CategoryCard;
