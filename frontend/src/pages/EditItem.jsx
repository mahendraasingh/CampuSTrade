import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ImagePlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { LiquidMetalButton } from '../components/ui/liquid-metal-button';

const EditItem = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    status: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const categories = ['Books', 'Electronics', 'Hostel items', 'Stationery', 'Cycles', 'Lab materials', 'Others'];
  const conditions = ['Like New', 'Good', 'Fair', 'Poor'];
  const statuses = ['available', 'sold'];

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/items/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          condition: data.condition,
          status: data.status
        });
        setImagePreview(data.image);
      } catch (error) {
        console.error('Error fetching item', error);
        toast.error('Failed to load item or unauthorized');
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (user && user.token) {
      fetchItem();
    }
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      await axios.put(`http://localhost:5000/api/items/${id}`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}` 
        }
      });
      
      // Also update status if changed
      await axios.put(`http://localhost:5000/api/items/${id}/status`, { status: formData.status }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      toast.success('Item updated successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error occurred while updating');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)', padding: '2rem' }}>
      <div className="glass-container" style={{ padding: '2rem', width: '100%', maxWidth: '600px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Edit Item</h2>
        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <div 
              onClick={handleImageClick}
              style={{
                width: '100%',
                height: '200px',
                border: '2px dashed rgba(255,255,255,0.2)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)'
              }}
              className="hover-scale"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div 
                    onClick={removeImage}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '0.2rem' }}
                  >
                    <X size={20} color="white" />
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)' }}>
                  <ImagePlus size={40} style={{ marginBottom: '0.5rem' }} />
                  <span>Update Photo (Optional)</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageChange}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Title</label>
            <input name="title" type="text" className="input-field" required value={formData.title} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Price (₹)</label>
              <input name="price" type="number" className="input-field" required min="0" value={formData.price} onChange={handleChange} />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Status</label>
              <select name="status" className="input-field" required value={formData.status} onChange={handleChange} style={{ appearance: 'menulist' }}>
                {statuses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Category</label>
              <select name="category" className="input-field" required value={formData.category} onChange={handleChange} style={{ appearance: 'menulist' }}>
                <option value="" disabled>Select...</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Condition</label>
              <select name="condition" className="input-field" required value={formData.condition} onChange={handleChange} style={{ appearance: 'menulist' }}>
                <option value="" disabled>Select...</option>
                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea name="description" className="input-field" rows="4" required value={formData.description} onChange={handleChange} style={{ resize: 'vertical' }}></textarea>
          </div>

          <LiquidMetalButton type="submit" label="Update Item" className="w-full mt-4" />
        </form>
      </div>
    </div>
  );
};

export default EditItem;
