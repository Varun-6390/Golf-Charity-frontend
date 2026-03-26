import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiHeart, FiArrowRight } from 'react-icons/fi';
import api from '../api/client';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Charities() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/charities')
      .then(({ data }) => setCharities(data.charities || []))
      .catch((err) => console.error('Error fetching charities', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = charities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 py-12">
      {/* Header */}
      <div className="bg-primary-900 text-white py-16 mb-12 -mt-12">
        <div className="container-default text-center">
          <motion.h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4" initial="hidden" animate="visible" variants={fadeUp}>
            Our Partner Charities
          </motion.h1>
          <motion.p className="text-primary-100 max-w-2xl mx-auto text-lg mb-8" initial="hidden" animate="visible" custom={1} variants={fadeUp}>
            Explore the amazing causes supported by our community. When you subscribe, a portion of your membership goes directly to the charity of your choice.
          </motion.p>
          
          <motion.div className="max-w-xl mx-auto relative" initial="hidden" animate="visible" custom={2} variants={fadeUp}>
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              type="text"
              placeholder="Search charities by name or cause..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 outline-none focus:ring-4 focus:ring-primary-500/30 transition-shadow"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="container-default">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner w-10 h-10 border-4"></div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((c, i) => (
              <motion.div key={c._id} initial="hidden" animate="visible" custom={i % 6} variants={fadeUp}>
                <Link to={`/charities/${c._id}`} className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-56 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-6xl overflow-hidden">
                    {c.images?.[0] ? (
                      <img src={c.images[0]} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="opacity-50">🏌️</span>
                    )}
                    {c.isFeatured && (
                      <div className="absolute top-4 right-4 bg-accent-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <FiHeart /> Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{c.name}</h3>
                    <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3 flex-1">
                      {c.description || 'Supporting communities through the power of golf. Join us in making a difference.'}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between font-semibold text-primary-600 group-hover:text-primary-700">
                      Learn More <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No charities found</h3>
            <p className="text-slate-500">We couldn't find any charities matching "{search}".</p>
            <button className="btn btn-outline mt-6" onClick={() => setSearch('')}>Clear Search</button>
          </div>
        )}
      </div>
    </div>
  );
}
