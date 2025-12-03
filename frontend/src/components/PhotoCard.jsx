import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';

const PhotoCard = ({ photo }) => {
  const getImageUrl = (filepath) => {
    if (filepath.startsWith('http')) {
      return filepath;
    }
    return `http://16.16.65.200:5000/${filepath.replace(/\\/g, '/')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Link to={`/photo/${photo.id}`} className="group">
      <div className="card hover:shadow-xl transition-shadow duration-300">
        <div className="aspect-square overflow-hidden bg-gray-200">
          <img
            src={getImageUrl(photo.filepath)}
            alt={photo.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-primary-600 transition-colors">
            {photo.title}
          </h3>
          {photo.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {photo.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{photo.user?.username || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(photo.createdAt)}</span>
            </div>
          </div>
          {photo.tags && (
            <div className="mt-2 flex flex-wrap gap-1">
              {photo.tags.split(',').slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PhotoCard;
