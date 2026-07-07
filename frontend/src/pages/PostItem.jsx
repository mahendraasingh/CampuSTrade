import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { LiquidMetalButton } from '../components/ui/liquid-metal-button';

const PostItem = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = ['Books', 'Electronics', 'Hostel items', 'Stationery', 'Cycles', 'Lab materials', 'Others'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (image) data.append('image', image);

      await axios.post('http://localhost:5000/api/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Item posted! You can edit it from your profile.');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-container fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Sell an Item</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label className="input-label">Title</label>
            <input name="title" type="text" className="input-field" required onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2">
            <div className="input-group">
              <label className="input-label">Price (₹)</label>
              <input name="price" type="number" step="0.01" className="input-field" required onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="input-label">Category</label>
              <select name="category" className="input-field" required onChange={handleChange} style={{appearance: 'menulist'}}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Condition</label>
            <select name="condition" className="input-field" required onChange={handleChange} style={{appearance: 'menulist'}}>
              <option value="">Select Condition</option>
              {conditions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea name="description" className="input-field" rows="4" required onChange={handleChange}></textarea>
          </div>

          <div className="input-group">
            <label className="input-label">Item Image</label>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '2rem', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.4)' }}>
              <UploadCloud size={40} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <span>{image ? image.name : 'Click to upload an image'}</span>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            </label>
          </div>

          <LiquidMetalButton type="submit" label={loading ? 'Posting...' : 'Post Item'} disabled={loading} className="w-full mt-4" />
        </form>
      </div>
    </div>
  );
};

export default PostItem;
