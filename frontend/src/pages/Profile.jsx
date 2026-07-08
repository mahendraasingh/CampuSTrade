import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { LiquidMetalButton } from '../components/ui/liquid-metal-button';

const Profile = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchMyItems = async () => {
    try {
      const { data } = await axios.get('https://campustrade-re09.onrender.com/api/items/user/me', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setItems(data);
    } catch (error) {
      console.error('Error fetching my items', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchMyItems();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`https://campustrade-re09.onrender.com/api/items/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setItems(items.filter(item => item._id !== id));
        toast.success("Item deleted successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting item');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }} className="fade-in">
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>My Profile</h2>
      <div className="glass-container" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem' }}>{user.name}</h3>
        <p style={{ color: 'var(--text-muted)' }}>{user.email}</p>
      </div>

      <h3 style={{ marginBottom: '1.5rem' }}>My Listed Items</h3>
      <div className="grid grid-cols-4">
        {items.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            You haven't listed any items yet.
          </div>
        ) : (
          items.map(item => (
            <div key={item._id} className="glass-container hover-scale" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img 
                src={item.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                alt={item.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '600' }}>{item.title}</h3>
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>₹{item.price}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
                  Status: <strong style={{ color: item.status === 'sold' ? '#ef4444' : '#10b981' }}>{item.status}</strong>
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link to={`/edit-item/${item._id}`} className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    <Edit2 size={16} /> Edit
                  </Link>
                  <LiquidMetalButton onClick={() => handleDelete(item._id)} label={<><Trash2 size={16} className="mr-2"/> Delete</>} className="flex-1 rounded-md from-red-500/10 via-red-500/10 to-red-500/10 text-red-500" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
