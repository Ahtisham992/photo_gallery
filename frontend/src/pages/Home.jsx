import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhotoCard from '../components/PhotoCard';
import { Search, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, [page, search]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/photos', {
        params: { page, limit: 12, search }
      });
      setPhotos(response.data.photos);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load photos');
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPhotos();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Photo Gallery</h1>
        
        <form onSubmit={handleSearch} className="max-w-xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search photos by title, description, or tags..."
              className="input-field pl-10"
            />
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No photos found</p>
          <p className="text-gray-400 mt-2">Try a different search or upload some photos!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
