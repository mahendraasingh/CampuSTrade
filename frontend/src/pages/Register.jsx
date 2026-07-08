import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { LiquidMetalButton } from '../components/ui/liquid-metal-button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeName: ''
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const collegeToastShown = useRef(false);

  const handleCollegeFocus = () => {
    if (!collegeToastShown.current) {
      toast('Please type your college name as -- Manipal University', {
        icon: '🎓',
        duration: 5000,
      });
      collegeToastShown.current = true;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('https://campustrade-re09.onrender.com/api/auth/register', formData);
      toast.success('Registration successful! Welcome to CampusTrade.');
      login(data, data.token);
      navigate('/feed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="glass-container" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-block', fontSize: '0.9rem' }} className="hover-scale">
            🡠 Back to Main Menu
          </Link>
        </div>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Join CampusTrade</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Name</label>
            <input name="name" type="text" className="input-field" required onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input name="email" type="email" className="input-field" required onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input name="password" type="password" className="input-field" required minLength="6" onChange={handleChange} />
          </div>
          <div className="input-group">
            <label className="input-label">College Name</label>
            <input 
              name="collegeName" 
              type="text" 
              className="input-field" 
              placeholder="E.g., Manipal University" 
              required 
              onChange={handleChange} 
              onFocus={handleCollegeFocus}
            />
          </div>
          <LiquidMetalButton type="submit" label="Sign Up" className="w-full mt-4" />
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
