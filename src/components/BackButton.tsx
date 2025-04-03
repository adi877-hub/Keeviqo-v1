import React from 'react';
import { useLocation } from 'wouter';

interface BackButtonProps {
  onClick?: () => void;
}

function BackButton({ onClick }: BackButtonProps) {
  const [, setLocation] = useLocation();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setLocation('/');
    }
  };
  
  return (
    <button 
      onClick={handleClick}
      className="fixed bottom-4 left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-10 back-button"
      aria-label="Back"
    >
      <span className="material-icons">arrow_forward</span>
    </button>
  );
}

export default BackButton;
