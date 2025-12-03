import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MyPhotos from './pages/MyPhotos';
import Upload from './pages/Upload';
import PhotoDetail from './pages/PhotoDetail';
import Albums from './pages/Albums';
import CreateAlbum from './pages/CreateAlbum';
import AlbumDetail from './pages/AlbumDetail';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return !user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/my-photos" element={
              <PrivateRoute>
                <MyPhotos />
              </PrivateRoute>
            } />
            <Route path="/upload" element={
              <PrivateRoute>
                <Upload />
              </PrivateRoute>
            } />
            <Route path="/photo/:id" element={
              <PrivateRoute>
                <PhotoDetail />
              </PrivateRoute>
            } />
            <Route path="/albums" element={
              <PrivateRoute>
                <Albums />
              </PrivateRoute>
            } />
            <Route path="/albums/create" element={
              <PrivateRoute>
                <CreateAlbum />
              </PrivateRoute>
            } />
            <Route path="/albums/:id" element={
              <PrivateRoute>
                <AlbumDetail />
              </PrivateRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
