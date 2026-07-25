import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

export function TrendingTopics() {
  // Mock data for now - could be fetched from API later
  const topics = [
    { id: 1, title: 'Ligue des Champions', posts: '12.5k' },
    { id: 2, title: 'Mercato Estival', posts: '8.2k' },
    { id: 3, title: 'Ballon d\'Or', posts: '5.1k' },
    { id: 4, title: 'Equipe de France', posts: '3.4k' },
    { id: 5, title: 'Premier League', posts: '2.9k' },
  ];

  return (
    <div className="card glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-primary" size={20} />
        <h2 className="font-semibold text-lg">Tendances Actuelles</h2>
      </div>

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <Link
            key={topic.id}
            to={`/search?q=${encodeURIComponent(topic.title)}`}
            className="flex items-start justify-between group"
          >
            <div>
              <span className="text-xs text-text-muted">#{index + 1} en tendance</span>
              <p className="font-medium text-text-primary group-hover:text-primary transition-colors">
                {topic.title}
              </p>
            </div>
            <span className="text-xs text-text-secondary bg-surface-2 px-2 py-1 rounded-md">
              {topic.posts} posts
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
