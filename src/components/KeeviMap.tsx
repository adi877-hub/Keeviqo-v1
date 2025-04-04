import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { fetchCategories, analyzeUserContext } from '../utils/api';

interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
  subcategories?: Subcategory[];
  status?: 'active' | 'warning' | 'alert' | 'inactive';
  position?: { x: number, y: number };
}

interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
}

interface Connection {
  source: number;
  target: number;
  strength: number; // 0-1 value representing connection strength
}

const KeeviMap: React.FC = () => {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const categoriesData = await fetchCategories();
        
        const userData = await analyzeUserContext();
        
        const positionedCategories = categoriesData.map((category: Category, index: number) => {
          const angle = (index / categoriesData.length) * 2 * Math.PI;
          const radius = 200; // Radius of the circle
          
          return {
            ...category,
            position: {
              x: Math.cos(angle) * radius + 300, // Center x = 300
              y: Math.sin(angle) * radius + 300, // Center y = 300
            },
            status: determineStatus(category, userData),
          };
        });
        
        const categoryConnections = generateConnections(positionedCategories);
        
        setCategories(positionedCategories);
        setConnections(categoryConnections);
        setLoading(false);
      } catch (err) {
        console.error('Error loading KeeviMap data:', err);
        setError('Failed to load life map data');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && canvasRef.current) {
      drawMap();
    }
  }, [categories, connections, selectedCategory, zoomLevel]);

  const determineStatus = (category: Category, userData: any): 'active' | 'warning' | 'alert' | 'inactive' => {
    const statuses: ('active' | 'warning' | 'alert' | 'inactive')[] = ['active', 'warning', 'alert', 'inactive'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const generateConnections = (categories: Category[]): Connection[] => {
    const connections: Connection[] = [];
    
    for (let i = 0; i < categories.length; i++) {
      const numConnections = 2 + Math.floor(Math.random() * 2);
      
      for (let j = 0; j < numConnections; j++) {
        let targetIndex;
        do {
          targetIndex = Math.floor(Math.random() * categories.length);
        } while (targetIndex === i);
        
        connections.push({
          source: categories[i].id,
          target: categories[targetIndex].id,
          strength: 0.3 + Math.random() * 0.7, // Random strength between 0.3 and 1
        });
      }
    }
    
    return connections;
  };

  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.scale(zoomLevel, zoomLevel);
    
    connections.forEach(connection => {
      const source = categories.find(c => c.id === connection.source);
      const target = categories.find(c => c.id === connection.target);
      
      if (source && target && source.position && target.position) {
        ctx.beginPath();
        ctx.moveTo(source.position.x, source.position.y);
        ctx.lineTo(target.position.x, target.position.y);
        
        if (selectedCategory === source.id || selectedCategory === target.id) {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)'; // Blue
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = `rgba(156, 163, 175, ${connection.strength * 0.5})`; // Gray with opacity based on strength
          ctx.lineWidth = 1 + connection.strength * 2;
        }
        
        ctx.stroke();
      }
    });
    
    categories.forEach(category => {
      if (!category.position) return;
      
      const { x, y } = category.position;
      const radius = selectedCategory === category.id ? 30 : 25;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      
      switch (category.status) {
        case 'active':
          ctx.fillStyle = '#10B981'; // Green
          break;
        case 'warning':
          ctx.fillStyle = '#F59E0B'; // Yellow
          break;
        case 'alert':
          ctx.fillStyle = '#EF4444'; // Red
          break;
        case 'inactive':
        default:
          ctx.fillStyle = '#9CA3AF'; // Gray
          break;
      }
      
      ctx.fill();
      
      if (selectedCategory === category.id) {
        ctx.strokeStyle = '#3B82F6'; // Blue
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(category.name, x, y);
    });
    
    ctx.restore();
  };

  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      setLocation(`/category/${categoryId}`);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoomLevel;
    const y = (e.clientY - rect.top) / zoomLevel;
    
    for (const category of categories) {
      if (!category.position) continue;
      
      const dx = category.position.x - x;
      const dy = category.position.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= 25) {
        handleCategoryClick(category.id);
        return;
      }
    }
    
    setSelectedCategory(null);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">{t('common.loading')}</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-right">{t('keevimap.title')}</h2>
      <p className="text-gray-600 mb-4 text-right">{t('keevimap.description')}</p>
      
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={600} 
          onClick={handleCanvasClick}
          className="border border-gray-200 rounded-lg mx-auto"
        />
        
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <button 
            onClick={handleZoomIn}
            className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={handleZoomOut}
            className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {selectedCategory && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-right">
            {categories.find(c => c.id === selectedCategory)?.name}
          </h3>
          <p className="text-gray-600 text-right">
            {categories.find(c => c.id === selectedCategory)?.description}
          </p>
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => setLocation(`/category/${selectedCategory}`)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {t('common.view_details')}
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-right">{t('keevimap.legend')}</h3>
        <div className="flex flex-wrap justify-end gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span>{t('keevimap.status.active')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span>{t('keevimap.status.warning')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span>{t('keevimap.status.alert')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div>
            <span>{t('keevimap.status.inactive')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeeviMap;
