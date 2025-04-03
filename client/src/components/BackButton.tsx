import React from 'react';

interface BackButtonProps {
  onClick: () => void;
}

function BackButton({ onClick }: BackButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-4 left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-10 back-button"
      aria-label="Back"
    >
      <span className="material-icons">arrow_forward</span>
    </button>
  );
}

export default BackButton;
