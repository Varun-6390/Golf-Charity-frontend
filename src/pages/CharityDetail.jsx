import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHeart, FiShare2, FiExternalLink, FiCalendar, FiMapPin } from 'react-icons/fi';
import api from '../api/client';

export default function CharityDetail() {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/charities/${id}`)
      .then(({ data }) => setCharity(data.charity))
      .catch((err) => {
        console.error(err);
        setError('Charity not found or error loading data.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="spinner w-12 h-12 border-4"></div>
      </div>
    );
  }

  if (error || !charity) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center bg-slate-50">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h2>
        <p className="text-slate-600 mb-6">{error}</p>
        <Link to="/charities" className="btn btn-primary"><FiArrowLeft /> Back to Charities</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative h-[300px] md:h-[400px] bg-slate-900 overflow-hidden">
        {charity.images?.[0] ? (
          <img 
            src={charity.images[0]} 
            alt={charity.name} 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-900 to-slate-800"></div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div className="absolute inset-0 container-default flex flex-col justify-end pb-12">
          <Link to="/charities" className="text-slate-300 hover:text-white flex items-center gap-2 mb-6 w-fit transition-colors">
            <FiArrowLeft /> Back to directory
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {charity.isFeatured && (
                <span className="bg-accent-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                  <FiHeart /> Featured
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-4">{charity.name}</h1>
            {charity.website && (
              <a href={charity.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-300 hover:text-primary-200 transition-colors w-fit">
                <FiExternalLink /> Visit Official Website
              </a>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container-default -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <motion.div className="lg:col-span-2 space-y-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="card p-8 md:p-10 shadow-xl border-0 ring-1 ring-slate-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">About this cause</h2>
              <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-lg text-slate-600">
                {charity.description ? (
                  charity.description.split('\n').map((para, i) => (
                    para.trim() && <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>This charity hasn't provided a detailed description yet.</p>
                )}
              </div>
            </div>

            {/* Image Gallery */}
            {charity.images?.length > 1 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {charity.images.slice(1).map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden aspect-square bg-slate-200">
                      <img src={img} alt={`${charity.name} gallery ${i+1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Events section could go here if added to schema later */}
            {charity.events?.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-bold mb-6">Upcoming Events</h3>
                <div className="space-y-4">
                  {charity.events.map((event, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="bg-white p-3 rounded-lg shadow-sm text-center min-w-[80px]">
                        <div className="text-primary-600 font-bold text-sm uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                        <div className="text-2xl font-heading font-extrabold text-slate-900">{new Date(event.date).getDate()}</div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{event.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1 mb-2">
                          <FiMapPin /> {event.location || 'Location TBD'}
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar CTA */}
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="card sticky top-24 shadow-xl border-primary-100 bg-gradient-to-b from-white to-primary-50/50">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl mb-6 mx-auto">
                <FiHeart />
              </div>
              <h3 className="text-center text-xl font-bold text-slate-900 mb-2">Support {charity.name}</h3>
              <p className="text-center text-sm text-slate-600 mb-8">
                Subscribe to our platform, play golf, and select this charity to receive a percentage of your monthly fee.
              </p>
              
              <Link to="/subscribe" className="btn btn-primary w-full py-4 text-base mb-4 shadow-primary-500/25">
                Subscribe & Support
              </Link>
              
              <button className="btn btn-outline w-full gap-2">
                <FiShare2 /> Share Cause
              </button>
              
              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Impact so far</div>
                <div className="font-heading text-3xl font-extrabold text-slate-900">
                  {/* Mock statistic until real data is available */}
                  £{(Math.random() * 5000 + 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
                <div className="text-sm text-slate-500">Raised through our platform</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
