import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiHeart, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import api from '../api/client';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function Home() {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    api.get('/charities?featured=true')
      .then(({ data }) => setCharities(data.charities?.slice(0, 3) || []))
      .catch(() => {});
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-900 via-slate-900 to-slate-800 -mt-[72px] pt-[72px]">
        {/* Abstract Background Elements */}
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-default relative z-10 py-16">
          <motion.div className="max-w-2xl" initial="hidden" animate="visible" variants={fadeUp}>
            <motion.div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6" variants={fadeUp} custom={0}>
              <FiStar /> Play · Win · Give Back
            </motion.div>

            <motion.h1 className="text-5xl md:text-6xl font-heading font-extrabold text-white leading-tight mb-6" variants={fadeUp} custom={1}>
              Your Golf Score<br />Could <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-300">Change Lives</span>
            </motion.h1>

            <motion.p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl" variants={fadeUp} custom={2}>
              Subscribe, track your Stableford scores, and enter monthly prize draws. 
              A portion of every subscription goes directly to the charity you choose.
            </motion.p>

            <motion.div className="flex flex-wrap gap-4" variants={fadeUp} custom={3}>
              <Link to="/subscribe" className="btn btn-accent btn-lg">
                Subscribe Now <FiArrowRight />
              </Link>
              <Link to="/charities" className="btn btn-outline btn-lg border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                View Charities
              </Link>
            </motion.div>

            <motion.div className="flex gap-10 mt-12 pt-8 border-t border-white/10" variants={fadeUp} custom={4}>
              <div>
                <div className="font-heading text-3xl font-extrabold text-primary-400">5</div>
                <div className="text-sm text-slate-400 mt-1">Scores Tracked</div>
              </div>
              <div>
                <div className="font-heading text-3xl font-extrabold text-accent-400">3</div>
                <div className="text-sm text-slate-400 mt-1">Prize Tiers</div>
              </div>
              <div>
                <div className="font-heading text-3xl font-extrabold text-blue-400">10%+</div>
                <div className="text-sm text-slate-400 mt-1">To Charity</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-50">
        <div className="container-default">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">How It Works</div>
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">Three Simple Steps</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Join our community of golfers making a difference while competing for monthly prizes.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: 1, cls: 'from-primary-100 to-primary-200 text-primary-700', icon: <FiTrendingUp />, title: 'Track Your Scores', desc: 'Enter your latest 5 Stableford scores (1-45). The platform keeps your most recent scores and auto-replaces the oldest.' },
              { n: 2, cls: 'from-accent-100 to-accent-200 text-accent-700', icon: <FiStar />, title: 'Monthly Prize Draw', desc: '5 numbers are drawn each month. Match 3, 4, or 5 of your scores to the draw and win from the prize pool. Jackpot rolls over!' },
              { n: 3, cls: 'from-blue-100 to-blue-200 text-blue-700', icon: <FiHeart />, title: 'Support a Charity', desc: 'Choose a charity at signup. At least 10% of your subscription goes directly to them. You can increase your contribution anytime.' },
            ].map((step, i) => (
              <motion.div key={step.n} className="card text-center relative overflow-hidden group" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} custom={i} variants={fadeUp}>
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${step.cls} flex items-center justify-center font-heading font-extrabold text-xl mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                  {step.n}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Charities */}
      <section className="py-24 bg-white">
        <div className="container-default">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <div className="inline-flex flex-col items-center mb-4 text-primary-500">
              <FiHeart size={24} className="mb-2" />
              <div className="text-xs font-bold uppercase tracking-wider">Charities</div>
            </div>
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">Making an Impact Together</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Browse our partner charities and choose the cause closest to your heart.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charities.length > 0 ? charities.map((c, i) => (
              <motion.div key={c._id} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} custom={i} variants={fadeUp}>
                <Link to={`/charities/${c._id}`} className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-5xl overflow-hidden">
                    {c.images?.[0] ? <img src={c.images[0]} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : '🏌️'}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{c.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{c.description || 'Supporting communities through the power of golf.'}</p>
                  </div>
                </Link>
              </motion.div>
            )) : (
              [1, 2, 3].map((i) => (
                <motion.div key={i} className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} custom={i} variants={fadeUp}>
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl">🏌️</div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Partner Charity</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">Charities will appear here once added by the admin. Subscribe and start making a difference today!</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link to="/charities" className="btn btn-outline">View All Charities <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-900 to-slate-900 py-24 text-center">
        <div className="container-default">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-6">Ready to Play for a Cause?</h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">Join the platform where every golf score has the power to create positive change.</p>
            <Link to="/subscribe" className="btn btn-accent btn-lg shadow-xl shadow-accent-500/20">
              Get Started Today <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
