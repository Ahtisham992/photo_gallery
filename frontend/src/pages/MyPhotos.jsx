import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PhotoCard from '../components/PhotoCard';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const MyPhotos = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPhotos();
  }, []);

  const fetchMyPhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/photos', {
        params: { userId: user.id, limit: 100 }
      });
      setPhotos(response.data.photos);
    } catch (error) {
      toast.error('Failed to load your photos');
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Photos</h1>
        <p className="text-gray-600 mt-2">
          {photos.length} {photos.length === 1 ? 'photo' : 'photos'} in your collection
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">You haven't uploaded any photos yet</p>
          <p className="text-gray-400 mt-2">Start sharing your moments!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPhotos;
