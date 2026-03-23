import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Heart, MessageSquare, Globe2, Copy, Filter } from 'lucide-react';
import api from '../../lib/api';
import useAuthStore from '../../store/authStore';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './CommunityPage.css';

export default function CommunityPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      const { data } = await api.get('/trips/community', { params });
      setTrips(data.trips);
      setTotalPages(data.pages);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchTrips(); }, [search, page]);

  const handleLike = async (tripId, e) => {
    e.stopPropagation();
    try {
      const { data } = await api.post(`/trips/${tripId}/like`);
      setTrips(prev => prev.map(t => t._id === tripId
        ? { ...t, likes: Array(data.likes).fill(null) }
        : t
      ));
    } catch { toast.error('Failed to like'); }
  };

  return (
    <div className="community-page container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="community-hero">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="page-title">🌍 Community Itineraries</h1>
          <p className="page-subtitle">Discover real trips shared by travelers worldwide</p>
        </motion.div>
        <div className="search-bar" style={{ maxWidth: 480 }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input placeholder="Search community trips..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : trips.length === 0 ? (
        <div className="empty-state">
          <Globe2 size={64} className="empty-icon" />
          <h3>No public trips found</h3>
          <p>Be the first to share your itinerary with the world!</p>
        </div>
      ) : (
        <motion.div className="community-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {trips.map((trip, i) => (
            <motion.div
              key={trip._id}
              className="community-card card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => navigate(`/trips/${trip._id}`)}
            >
              <div className="community-card-cover">
                <img src={trip.coverPhoto} alt={trip.tripName}
                  onError={e => e.target.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=60'} />
                <div className="community-cover-overlay" />
                <div className="community-card-badges">
                  <span className={`badge badge-${trip.status === 'upcoming' ? 'primary' : trip.status === 'ongoing' ? 'success' : 'muted'}`}>{trip.status}</span>
                </div>
              </div>

              <div className="community-card-body">
                <div className="community-author">
                  <img src={trip.userId?.profileImage} className="avatar avatar-sm" alt=""
                    onError={e => e.target.src = `https://ui-avatars.com/api/?name=${trip.userId?.firstName}&background=1E88E5&color=fff`} />
                  <div>
                    <span className="author-name">{trip.userId?.firstName} {trip.userId?.lastName}</span>
                    <span className="author-date">{format(new Date(trip.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                <h3 className="community-trip-name">{trip.tripName}</h3>
                {trip.description && <p className="community-trip-desc">{trip.description}</p>}

                <div className="community-trip-meta">
                  {trip.stops?.length > 0 && (
                    <div className="comm-meta-item">
                      {trip.stops.slice(0, 3).map((s, j) => (
                        <span key={j} className="city-chip">{s.city}</span>
                      ))}
                      {trip.stops.length > 3 && <span className="city-chip">+{trip.stops.length - 3}</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="community-card-footer">
                <button className="comm-action-btn" onClick={e => handleLike(trip._id, e)}>
                  <Heart size={15} /> {trip.likes?.length || 0}
                </button>
                <button className="comm-action-btn">
                  <MessageSquare size={15} /> {trip.comments?.length || 0}
                </button>
                <span className="comm-action-btn">
                  Views: {trip.views || 0}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
