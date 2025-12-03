import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PhotoCard from '../components/PhotoCard';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar,
  Loader,
  Globe,
  Lock,
  Plus,
  Image as ImageIcon
} from 'lucide-react';

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    eventDate: '',
    isPublic: true
  });

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  const fetchAlbum = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/albums/${id}`);
      setAlbum(response.data.album);
      setFormData({
        name: response.data.album.name,
        description: response.data.album.description || '',
        location: response.data.album.location || '',
        eventDate: response.data.album.eventDate ? response.data.album.eventDate.split('T')[0] : '',
        isPublic: response.data.album.isPublic
      });
    } catch (error) {
      toast.error('Failed to load album');
      navigate('/albums');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/albums/${id}`, formData);
      toast.success('Album updated successfully');
      setEditing(false);
      fetchAlbum();
    } catch (error) {
      toast.error('Failed to update album');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this album? Photos will not be deleted.')) {
      return;
    }

    try {
      await axios.delete(`/api/albums/${id}`);
      toast.success('Album deleted successfully');
      navigate('/albums');
    } catch (error) {
      toast.error('Failed to delete album');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!album) {
    return null;
  }

  const isOwner = user.id === album.userId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/albums')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Albums</span>
      </button>

      <div className="mb-8">
        {editing ? (
          <form onSubmit={handleUpdate} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Album Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
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
                Public album
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-gray-900">{album.name}</h1>
                  {album.isPublic ? (
                    <Globe className="h-6 w-6 text-green-600" />
                  ) : (
                    <Lock className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                {album.description && (
                  <p className="text-gray-600 mt-3 whitespace-pre-wrap">
                    {album.description}
                  </p>
                )}
                <div className="mt-4 space-y-2">
                  {album.location && (
                    <div className="flex items-center space-x-2 text-gray-700">
                      <MapPin className="h-5 w-5" />
                      <span>{album.location}</span>
                    </div>
                  )}
                  {album.eventDate && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-5 w-5" />
                      <span>{formatDate(album.eventDate)}</span>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Created by {album.user?.fullName || album.user?.username}
                  </div>
                </div>
              </div>

              {isOwner && (
                <div className="flex space-x-3">
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
              )}
            </div>
          </div>
        )}
      </div>

      {/* Photos Section */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Photos ({album.photos?.length || 0})
        </h2>
        {isOwner && (
          <Link
            to={`/upload?albumId=${album.id}`}
            className="flex items-center space-x-2 btn-primary"
          >
            <Plus className="h-5 w-5" />
            <span>Add Photos</span>
          </Link>
        )}
      </div>

      {album.photos && album.photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {album.photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No photos in this album yet</p>
          {isOwner && (
            <Link
              to={`/upload?albumId=${album.id}`}
              className="inline-flex items-center space-x-2 mt-4 text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add your first photo</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AlbumDetail;
