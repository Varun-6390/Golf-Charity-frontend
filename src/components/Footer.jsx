import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container-default">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-heading font-extrabold text-xl text-primary-400">
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 text-white text-base">
                ⛳
              </span>
              GolfCharity
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
              A subscription-driven platform combining golf performance tracking, 
              monthly prize draws, and charitable giving. Play, win, and make a difference.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Platform</h4>
            <div className="flex flex-col gap-3">
              <Link to="/subscribe" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">Subscribe</Link>
              <Link to="/charities" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">Charities</Link>
              <Link to="/dashboard" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">Dashboard</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">How It Works</h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">Score Tracking</Link>
              <Link to="/" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">Monthly Draws</Link>
              <Link to="/" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">Prize Pools</Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Support</h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">FAQ</Link>
              <Link to="/" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">Contact Us</Link>
              <Link to="/" className="text-sm text-slate-400 hover:text-primary-400 transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>© {year} GolfCharity. All rights reserved.</span>
          <span>Built with ❤️ for charity</span>
        </div>
      </div>
    </footer>
  );
}
