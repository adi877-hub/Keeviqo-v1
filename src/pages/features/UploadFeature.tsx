import React, { useState } from 'react';
import { useRoute, useLocation } from 'wouter';

function UploadFeature() {
  const [, params] = useRoute('/feature/upload/:id');
  const [, setLocation] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('יש לבחור קובץ להעלאה');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      
      
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFile(null);
    } catch (err) {
      setError('שגיאה בהעלאת הקובץ');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

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
      
      <h1 className="text-3xl font-bold mb-6 text-right">העלאת מסמך</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        {success ? (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">
              <span className="material-icons text-5xl">check_circle</span>
            </div>
            <h2 className="text-xl font-semibold mb-4">הקובץ הועלה בהצלחה!</h2>
            <button
              onClick={() => setSuccess(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              העלאת קובץ נוסף
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block"
              >
                <span className="material-icons text-4xl text-gray-400">cloud_upload</span>
                <p className="mt-2">לחץ לבחירת קובץ או גרור לכאן</p>
                {file && (
                  <p className="mt-2 text-blue-500">{file.name}</p>
                )}
              </label>
            </div>
            
            {error && (
              <div className="text-red-500 text-center">{error}</div>
            )}
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={uploading || !file}
                className={`px-4 py-2 rounded ${
                  uploading || !file
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {uploading ? 'מעלה...' : 'העלאה'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UploadFeature;
