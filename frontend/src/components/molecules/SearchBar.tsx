import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '../atoms/Input';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
  placeholder?: string;
  initialValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ placeholder = 'Rechercher...', initialValue = '', onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const debouncedQuery = useDebounce(query, 500);
  const navigate = useNavigate();

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-text-muted" size={18} />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 bg-surface-2 border-transparent focus:border-primary rounded-full h-10"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-text-muted hover:text-text-primary"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
