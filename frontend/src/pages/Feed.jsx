import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';
import { Search } from 'lucide-react';
import { LiquidMetalButton } from '../components/ui/liquid-metal-button';

const Feed = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['Books', 'Electronics', 'Hostel items', 'Stationery', 'Cycles', 'Lab materials', 'Others'];

  const fetchItems = async () => {
    try {
      setLoading(true);
      let query = 'http://localhost:5000/api/items?';
      if (search) query += `search=${search}&`;
      if (category) query += `category=${category}&`;
      
      const { data } = await axios.get(query);
      setItems(data);
    } catch (error) {
      console.error('Error fetching items', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div style={{ padding: '2rem' }} className="fade-in">
      <div className="glass-container" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search items..." 
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="input-field" 
            style={{ width: '200px', appearance: 'menulist' }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <LiquidMetalButton type="submit" label="Search" className="whitespace-nowrap ml-2" />
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading items...</div>
      ) : (
        <div className="grid grid-cols-4">
          {items.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No items found in your college for the given criteria.
            </div>
          ) : (
            items.map(item => <ItemCard key={item._id} item={item} />)
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
