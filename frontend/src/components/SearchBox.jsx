import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword.trim()}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="relative flex items-center justify-center">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search products..."
        className="w-full sm:w-64 py-2 pl-4 pr-10 rounded-full border border-primary text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm transition-all shadow-inner"
      />
      <button
        type="submit"
        className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-primary transition-colors focus:outline-none"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
};

export default SearchBox;
