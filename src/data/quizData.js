import mathQuestions from './questions/math';
import scienceQuestions from './questions/science';
import technologyQuestions from './questions/technology';
import generalQuestions from './questions/general';

const quizData = [
  {
    id: 1,
    slug: 'math',
    name: 'Mathematics',
    description: 'Test your skills in algebra, geometry, arithmetic, and more.',
    icon: '📐',
    color: '#6366f1',
    colorLight: 'rgba(99, 102, 241, 0.12)',
    questions: mathQuestions,
  },
  {
    id: 2,
    slug: 'science',
    name: 'Science',
    description: 'Explore physics, chemistry, biology, and earth science.',
    icon: '🔬',
    color: '#10b981',
    colorLight: 'rgba(16, 185, 129, 0.12)',
    questions: scienceQuestions,
  },
  {
    id: 3,
    slug: 'technology',
    name: 'Technology',
    description: 'Dive into programming, networking, hardware, and software concepts.',
    icon: '💻',
    color: '#f59e0b',
    colorLight: 'rgba(245, 158, 11, 0.12)',
    questions: technologyQuestions,
  },
  {
    id: 4,
    slug: 'general',
    name: 'General Knowledge',
    description: 'History, geography, pop culture, and everyday facts.',
    icon: '🌍',
    color: '#ec4899',
    colorLight: 'rgba(236, 72, 153, 0.12)',
    questions: generalQuestions,
  },
];

export default quizData;
