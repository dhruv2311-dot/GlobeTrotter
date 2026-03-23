import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Globe } from 'lucide-react';
import api from '../../lib/api';
import CityCard from '../../components/cities/CityCard';
import './CitiesPage.css';

const REGIONS = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Middle East', 'Africa', 'Oceania'];

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = { limit: 24 };
        if (search) params.search = search;
        if (region !== 'All') params.region = region;
        const { data } = await api.get('/cities', { params });
        setCities(data.cities);
        setTotal(data.total);
      } catch {} finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [search, region]);

  return (
    <div className="cities-page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title"><Globe size={32} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--primary)' }} />Explore Cities</h1>
          <p className="page-subtitle">{total} destinations waiting to be discovered</p>
        </div>
      </div>

      {/* Filters */}
      <div className="cities-filters">
        <div className="search-bar" style={{ flex: 1, maxWidth: 480 }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Search cities..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="region-tabs">
          {REGIONS.map(r => (
            <button key={r} className={`tab-btn ${region === r ? 'active' : ''}`} onClick={() => setRegion(r)}>{r}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : cities.length === 0 ? (
        <div className="empty-state">
          <Globe size={64} className="empty-icon" />
          <h3>No cities found</h3>
          <p>Try a different search or region</p>
        </div>
      ) : (
        <motion.div className="cities-grid-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.04 }}>
          {cities.map((city, i) => (
            <motion.div key={city._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <CityCard city={city} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
