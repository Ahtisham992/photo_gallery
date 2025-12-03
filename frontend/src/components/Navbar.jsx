import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Upload, Image, LogOut, Menu, X, User, Folder } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">PhotoGallery</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Image className="h-5 w-5" />
              <span>Gallery</span>
            </Link>
            <Link
              to="/albums"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Folder className="h-5 w-5" />
              <span>Albums</span>
            </Link>
            <Link
              to="/my-photos"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <User className="h-5 w-5" />
              <span>My Photos</span>
            </Link>
            <Link
              to="/upload"
              className="flex items-center space-x-1 px-3 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              <Upload className="h-5 w-5" />
              <span>Upload</span>
            </Link>
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
              <span className="text-sm text-gray-700">
                {user.fullName || user.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Image className="h-5 w-5" />
              <span>Gallery</span>
            </Link>
            <Link
              to="/albums"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Folder className="h-5 w-5" />
              <span>Albums</span>
            </Link>
            <Link
              to="/my-photos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <User className="h-5 w-5" />
              <span>My Photos</span>
            </Link>
            <Link
              to="/upload"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Photo</span>
            </Link>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="px-3 py-2 text-sm text-gray-600">
                Logged in as: <span className="font-medium">{user.fullName || user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
