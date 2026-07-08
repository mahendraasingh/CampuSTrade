import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LogOut, PlusSquare, Home, User, MessageCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let interval;
    if (user) {
      const fetchUnreadCount = async () => {
        try {
          const res = await axios.get('https://campustrade-re09.onrender.com/api/messages/unread-count', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setUnreadCount(res.data.count);
        } catch (error) {
          console.error("Failed to fetch unread count", error);
        }
      };

      fetchUnreadCount();
      interval = setInterval(fetchUnreadCount, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    if (location.pathname === '/inbox') {
      setUnreadCount(0);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar glass-container" style={{ margin: '1rem', borderRadius: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/feed" style={{ 
          fontSize: '1.8rem', 
          fontWeight: '900', 
          background: 'linear-gradient(90deg, #FF6B6B 0%, #4ECDC4 100%)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          textShadow: '0px 4px 15px rgba(78, 205, 196, 0.25)',
          letterSpacing: '-1px'
        }}>
          CampusTrade
        </Link>
      </div>

      {user && (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/feed" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-scale">
            <Home size={20} /> Feed
          </Link>
          <Link to="/inbox" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }} className="hover-scale">
            <div style={{ position: 'relative', display: 'flex' }}>
              <MessageCircle size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  padding: '1px 5px',
                  minWidth: '16px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse 2s infinite'
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            Inbox
          </Link>
          <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-scale">
            <User size={20} /> Profile
          </Link>
          <Link to="/post-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-scale">
            <PlusSquare size={20} /> Sell
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={handleLogout} className="hover-scale">
            <LogOut size={20} color="#ef4444" />
            <span style={{ color: '#ef4444' }}>Logout</span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
