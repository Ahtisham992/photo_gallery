import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Calendar, 
  Tag,
  Loader,
  Globe,
  Lock,
  Folder
} from 'lucide-react';

const PhotoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    isPublic: true
  });

  useEffect(() => {
    fetchPhoto();
    fetchAlbums();
  }, [id]);

  const fetchPhoto = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/photos/${id}`);
      setPhoto(response.data.photo);
      setSelectedAlbumId(response.data.photo.albumId || '');
      setFormData({
        title: response.data.photo.title,
        description: response.data.photo.description || '',
        tags: response.data.photo.tags || '',
        isPublic: response.data.photo.isPublic
      });
    } catch (error) {
      toast.error('Failed to load photo');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await axios.get('/api/albums');
      // Filter to show only user's own albums
      const userAlbums = response.data.albums.filter(album => album.userId === user.id);
      setAlbums(userAlbums);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/photos/${id}`, formData);
      toast.success('Photo updated successfully');
      setEditing(false);
      fetchPhoto();
    } catch (error) {
      toast.error('Failed to update photo');
    }
  };

  const handleAlbumChange = async (newAlbumId) => {
    try {
      const oldAlbumId = photo.albumId;
      
      // Remove from old album if exists
      if (oldAlbumId) {
        await axios.delete(`/api/albums/${oldAlbumId}/photos/${id}`);
      }
      
      // Add to new album if selected
      if (newAlbumId) {
        await axios.post(`/api/albums/${newAlbumId}/photos/${id}`);
        toast.success('Photo added to album');
      } else {
        toast.success('Photo removed from album');
      }
      
      setSelectedAlbumId(newAlbumId);
      fetchPhoto();
    } catch (error) {
      toast.error('Failed to update album');
      console.error('Album update error:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      await axios.delete(`/api/photos/${id}`);
      toast.success('Photo deleted successfully');
      navigate('/my-photos');
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  const getImageUrl = (filepath) => {
    if (filepath?.startsWith('http')) {
      return filepath;
    }
    return `http://16.16.65.200:5000/${filepath?.replace(/\\/g, '/')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!photo) {
    return null;
  }

  const isOwner = user.id === photo.userId;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="card">
          <img
            src={getImageUrl(photo.filepath)}
            alt={photo.title}
            className="w-full h-auto"
          />
        </div>

        {/* Details */}
        <div className="space-y-6">
          {editing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Public photo
                </label>
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <div className="flex items-start justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">{photo.title}</h1>
                  <div className="flex items-center space-x-1 text-sm">
                    {photo.isPublic ? (
                      <Globe className="h-4 w-4 text-green-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-600" />
                    )}
                    <span className="text-gray-600">
                      {photo.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                {photo.description && (
                  <p className="text-gray-600 mt-4 whitespace-pre-wrap">
                    {photo.description}
                  </p>
                )}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{photo.user?.fullName || photo.user?.username}</span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(photo.createdAt)}</span>
                </div>

                {photo.album && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Folder className="h-5 w-5" />
                    <span>Album: {photo.album.name}</span>
                  </div>
                )}

                {photo.tags && (
                  <div className="flex items-start space-x-2">
                    <Tag className="h-5 w-5 text-gray-600 mt-1" />
                    <div className="flex flex-wrap gap-2">
                      {photo.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isOwner && (
                <>
                  {/* Album Selection */}
                  <div className="border-t border-gray-200 pt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add to Album
                    </label>
                    <select
                      value={selectedAlbumId}
                      onChange={(e) => handleAlbumChange(e.target.value)}
                      className="input-field max-w-md"
                    >
                      <option value="">No Album</option>
                      {albums.map((album) => (
                        <option key={album.id} value={album.id}>
                          {album.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select an album to organize this photo
                    </p>
                  </div>

                  <div className="flex space-x-3 border-t border-gray-200 pt-6">
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center space-x-2 btn-primary"
                    >
                      <Edit className="h-5 w-5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 btn-danger"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
