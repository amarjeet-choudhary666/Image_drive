import { useState, useEffect } from 'react';

function SearchBar({ onSearch, isSearching }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 0) {
        onSearch(query.trim());
      } else if (query.trim().length === 0) {
        onSearch('');
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    if (query.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Search images by name..."
              className="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-blue-600 text-white border border-l-0 border-blue-600 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {isSearching ? 'Searching...' : `Searching for "${query}"`}
              </span>
              {!isSearching && (
                <button
                  onClick={handleClear}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;