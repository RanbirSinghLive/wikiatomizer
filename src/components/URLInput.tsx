import { useState } from 'react';

interface URLInputProps {
  onSubmit: (url: string) => void;
}

const URLInput = ({ onSubmit }: URLInputProps) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <label htmlFor="wiki-url" className="text-lg font-medium">
          Enter Wikipedia URL
        </label>
        <input
          type="url"
          id="wiki-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://en.wikipedia.org/wiki/..."
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Generate Notecards
        </button>
      </div>
    </form>
  );
};

export default URLInput; 