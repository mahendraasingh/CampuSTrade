import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MessageCircle } from 'lucide-react';

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/messages/inbox', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setConversations(data);
      } catch (error) {
        console.error('Error fetching inbox', error);
      } finally {
        setLoading(false);
      }
    };
    
    const markAsRead = async () => {
      try {
        await axios.put('http://localhost:5000/api/messages/mark-read', {}, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      } catch (error) {
        console.error("Error marking messages as read", error);
      }
    };

    if (user && user.token) {
      fetchInbox();
      markAsRead();
    }
  }, [user]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }} className="fade-in">Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }} className="fade-in">
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MessageCircle size={28} color="var(--primary)" /> My Inbox
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {conversations.length === 0 ? (
          <div className="glass-container" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No messages yet. Check out the feed to start a conversation!
          </div>
        ) : (
          conversations.map(conv => (
            <Link 
              to={`/chat/${conv.peer._id}/${conv.item._id}`} 
              key={conv.key}
              className="glass-container hover-scale"
              style={{ display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem', textDecoration: 'none' }}
            >
              <img 
                src={conv.item.image || 'https://via.placeholder.com/60'} 
                alt={conv.item.title} 
                style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} 
              />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <h4 style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.peer.name}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {new Date(conv.latestMessageDate).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '500', marginBottom: '0.25rem' }}>
                  {conv.item.title}
                </p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {conv.latestMessage}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;
