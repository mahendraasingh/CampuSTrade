import React, { useContext } from 'react';
import { Tag, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LiquidMetalButton } from './ui/liquid-metal-button';

const ItemCard = ({ item }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleContact = () => {
    const peerId = typeof item.sellerId === 'object' ? item.sellerId._id : item.sellerId;
    if (user && peerId === (user._id || user.id)) {
      navigate('/profile');
      return;
    }
    navigate(`/chat/${peerId}/${item._id}`);
  };

  return (
    <div className="glass-container hover-scale" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
          {item.description.length > 60 ? item.description.substring(0, 60) + '...' : item.description}
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Tag size={14} /> {item.category}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={14} /> {item.condition}</span>
        </div>

        {(!user || (typeof item.sellerId === 'object' ? item.sellerId._id : item.sellerId) !== (user._id || user.id)) && (
          <LiquidMetalButton onClick={handleContact} label="Contact Seller" className="w-full py-2" />
        )}
      </div>
    </div>
  );
};

export default ItemCard;
