import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload as UploadIcon, Image as ImageIcon, X } from 'lucide-react';

const Upload = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const albumId = searchParams.get('albumId');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    isPublic: true,
    albumId: albumId || ''
  });
  const [albums, setAlbums] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get('/api/albums');
      setAlbums(response.data.albums.filter(a => a.userId === response.data.albums[0]?.userId));
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a photo to upload');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('photo', file);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('tags', formData.tags);
    uploadData.append('isPublic', formData.isPublic);

    try {
      setLoading(true);
      await axios.post('/api/photos', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Photo uploaded successfully!');
      navigate('/my-photos');
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to upload photo';
      toast.error(message);
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Photo</h1>
        <p className="text-gray-600 mt-2">Share your moments with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo *
          </label>
          {!preview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                <span className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB
                </span>
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="Give your photo a title"
            maxLength="100"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="input-field resize-none"
            placeholder="Describe your photo..."
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input-field"
            placeholder="nature, sunset, landscape (comma separated)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate tags with commas
          </p>
        </div>

        {/* Album Selection */}
        <div>
          <label htmlFor="albumId" className="block text-sm font-medium text-gray-700 mb-1">
            Add to Album (Optional)
          </label>
          <select
            id="albumId"
            name="albumId"
            value={formData.albumId}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">No Album</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.name}
              </option>
            ))}
          </select>
        </div>

        {/* Public/Private */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
            Make this photo public
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <UploadIcon className="h-5 w-5" />
            <span>{loading ? 'Uploading...' : 'Upload Photo'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
