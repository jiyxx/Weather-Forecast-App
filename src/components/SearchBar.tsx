import { useState } from 'react';

export default function SearchBar({ onSearch, isLoading }: { onSearch: (city: string) => void | Promise<void>, isLoading: boolean }) {
  const [city, setCity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    await onSearch(city.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-6 flex gap-2">
      <input
        type="text"
        placeholder="Enter city (e.g., New Delhi)"
        className="flex-1 px-4 py-2 rounded-md focus:outline-none"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 rounded-md bg-blue-700 text-white disabled:opacity-60"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

