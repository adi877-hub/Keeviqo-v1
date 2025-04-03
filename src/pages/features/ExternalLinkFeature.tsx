import React, { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';

interface Feature {
  id: number;
  type: string;
  label: string;
  url: string;
}

const mockFeature: Feature = {
  id: 1003,
  type: "external_link",
  label: "אתר ביטוח לאומי",
  url: "https://www.btl.gov.il/"
};

function ExternalLinkFeature() {
  const [, params] = useRoute('/feature/external_link/:id');
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    const redirectToExternalSite = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        window.location.href = mockFeature.url;
      } catch (error) {
        console.error('Error redirecting to external site:', error);
      }
    };
    
    redirectToExternalSite();
  }, [params?.id]);
  
  const handleBackClick = () => {
    setLocation(`/subcategory/${params?.id ? Math.floor(parseInt(params.id) / 100) : ''}`);
  };
  
  return (
    <div className="container mx-auto p-4">
      <button 
        onClick={handleBackClick}
        className="fixed bottom-4 left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg z-10"
      >
        <span className="material-icons">arrow_forward</span>
      </button>
      
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center">
          <span className="material-icons text-5xl animate-spin text-blue-500">sync</span>
          <h2 className="text-xl font-semibold mt-4">מעביר לאתר חיצוני...</h2>
          <p className="mt-2">אם אינך מועבר אוטומטית, <a href={mockFeature.url} className="text-blue-500 hover:underline">לחץ כאן</a></p>
        </div>
      </div>
    </div>
  );
}

export default ExternalLinkFeature;
