import React from 'react';

export default function Toast({ message, type = 'info' }) {
  const colors = {
    error: 'bg-red-600',
    success: 'bg-green-600',
    info: 'bg-indigo-600'
  };
  return (
    <div className={`p-4 rounded-xl shadow-lg text-white text-sm fade-in ${colors[type] || colors.info}`}>
      {message}
    </div>
  );
}