import React from 'react';

interface Feature {
  id: number;
  type: string;
  label: string;
  url?: string;
}

interface FeatureButtonProps {
  feature: Feature;
  onClick: () => void;
}

function FeatureButton({ feature, onClick }: FeatureButtonProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return 'upload_file';
      case 'reminder':
        return 'notifications';
      case 'external_link':
        return 'link';
      case 'form':
        return 'description';
      default:
        return 'star';
    }
  };

  return (
    <div
      className={`p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow feature-${feature.type}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className="material-icons ml-2">{getIcon(feature.type)}</span>
        <h3 className="text-lg font-semibold">{feature.label}</h3>
      </div>
    </div>
  );
}

export default FeatureButton;
