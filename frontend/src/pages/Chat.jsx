import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Send } from 'lucide-react';
import { LiquidMetalButton } from '../components/ui/liquid-metal-button';

const Chat = () => {
  const { peerId, itemId } = useParams();
  const [messages, setMessages] = useState([]);
  const [item, setItem] = useState(null);
  const [text, setText] = useState('');
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/messages/${peerId}/${itemId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages', error);
    }
  };

  const fetchItem = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setItem(data);
    } catch (error) {
      console.error('Error fetching item', error);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchItem();
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [peerId, itemId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const { data } = await axios.post(`http://localhost:5000/api/messages`, {
        receiverId: peerId,
        itemId,
        text
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages([...messages, data]);
      setText('');
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)', padding: '2rem', maxWidth: '800px', margin: '0 auto' }} className="fade-in">
      {item && (
        <div className="glass-container" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={item.image || 'https://via.placeholder.com/50'} alt={item.title} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
          <div>
            <h3 style={{ margin: 0 }}>{item.title}</h3>
            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{item.price}</span>
          </div>
        </div>
      )}
      
      <div className="glass-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 'auto', marginBottom: 'auto' }}>
              No messages yet. Send a message to start the conversation!
            </div>
          ) : (
            messages.map(msg => {
              const isMine = msg.senderId === user._id || msg.senderId === user.id;
              return (
                <div key={msg._id} style={{ 
                  alignSelf: isMine ? 'flex-end' : 'flex-start',
                  background: isMine ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
                  color: isMine ? 'white' : 'var(--text)',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  maxWidth: '70%',
                  wordBreak: 'break-word'
                }}>
                  {msg.message}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Type a message..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1 }}
          />
          <LiquidMetalButton type="submit" className="p-3 flex items-center justify-center" label={<Send size={20} />} />
        </form>
      </div>
    </div>
  );
};

export default Chat;
