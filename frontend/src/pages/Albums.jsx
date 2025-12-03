import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Folder, Plus, Loader, MapPin, Calendar, Lock, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/albums');
      setAlbums(response.data.albums);
    } catch (error) {
      toast.error('Failed to load albums');
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (filepath) => {
    if (!filepath) return null;
    if (filepath.startsWith('http')) return filepath;
    return `http://16.16.65.200:5000/${filepath.replace(/\\/g, '/')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Albums</h1>
          <p className="text-gray-600 mt-2">
            Organize your photos into collections
          </p>
        </div>
        <Link
          to="/albums/create"
          className="flex items-center space-x-2 btn-primary"
        >
          <Plus className="h-5 w-5" />
          <span>Create Album</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20">
          <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No albums yet</p>
          <p className="text-gray-400 mt-2">Create your first album to organize photos!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map((album) => (
            <Link
              key={album.id}
              to={`/albums/${album.id}`}
              className="group card hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 relative">
                {album.coverPhoto ? (
                  <img
                    src={getImageUrl(album.coverPhoto.filepath)}
                    alt={album.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Folder className="h-16 w-16 text-primary-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {album.isPublic ? (
                    <Globe className="h-5 w-5 text-white drop-shadow-lg" />
                  ) : (
                    <Lock className="h-5 w-5 text-white drop-shadow-lg" />
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                  {album.name}
                </h3>
                {album.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {album.description}
                  </p>
                )}
                <div className="mt-3 space-y-1">
                  {album.location && (
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{album.location}</span>
                    </div>
                  )}
                  {album.eventDate && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(album.eventDate)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
                    <span>{album.photoCount} {album.photoCount === 1 ? 'photo' : 'photos'}</span>
                    <span>{album.user?.username}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Albums;
