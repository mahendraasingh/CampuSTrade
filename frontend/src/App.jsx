import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import PostItem from './pages/PostItem';
import Profile from './pages/Profile';
import EditItem from './pages/EditItem';
import Chat from './pages/Chat';
import Inbox from './pages/Inbox';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Toaster position="top-center" />
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/feed" /> : <Home />} />
        <Route path="/login" element={user ? <Navigate to="/feed" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/feed" /> : <Register />} />
        <Route path="/feed" element={user ? <Feed /> : <Navigate to="/login" />} />
        <Route path="/post-item" element={user ? <PostItem /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/edit-item/:id" element={user ? <EditItem /> : <Navigate to="/login" />} />
        <Route path="/chat/:peerId/:itemId" element={user ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/inbox" element={user ? <Inbox /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
