import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiLink, FiX } from 'react-icons/fi';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AdminCharities() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    websiteUrl: '',
    images: '' // we'll use a single image URL string for simplicity in the UI, map to array
  });

  const toast = useToast();

  const fetchCharities = async () => {
    try {
      const { data } = await api.get('/charities');
      setCharities(data.charities || []);
    } catch (err) {
      toast.error('Failed to load charities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const openForm = (charity = null) => {
    if (charity) {
      setEditingId(charity._id);
      setFormData({
        name: charity.name || '',
        description: charity.description || '',
        websiteUrl: charity.websiteUrl || '',
        images: charity.images?.length ? charity.images[0] : ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', websiteUrl: '', images: '' });
    }
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      images: formData.images ? [formData.images] : []
    };

    try {
      if (editingId) {
        await api.put(`/admin/charities/${editingId}`, payload);
        toast.success('Charity updated successfully');
      } else {
        await api.post('/admin/charities', payload);
        toast.success('Charity created successfully');
      }
      closeForm();
      fetchCharities();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.delete(`/admin/charities/${id}`);
      toast.success('Charity deleted');
      setCharities(charities.filter(c => c._id !== id));
    } catch (err) {
      toast.error('Failed to delete charity');
    }
  };

  if (loading) {
    return <div className="py-20 flex justify-center"><div className="spinner w-8 h-8 border-[3px]"></div></div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Charity Management</h1>
          <p className="text-slate-600">Add, edit, or remove partner charities available to users.</p>
        </div>
        <button onClick={() => openForm()} className="btn btn-primary flex items-center gap-2">
          <FiPlus /> Add New Charity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {charities.map((charity) => (
          <div key={charity._id} className="card bg-white border border-slate-200 overflow-hidden flex flex-col group">
            <div className="h-40 bg-slate-100 relative overflow-hidden">
              {charity.images?.[0] ? (
                <img src={charity.images[0]} alt={charity.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              )}
              {/* Overlay Actions */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openForm(charity)} className="w-8 h-8 rounded-lg bg-white/90 text-blue-600 flex items-center justify-center hover:bg-white shadow">
                  <FiEdit2 size={14} />
                </button>
                <button onClick={() => handleDelete(charity._id, charity.name)} className="w-8 h-8 rounded-lg bg-white/90 text-red-600 flex items-center justify-center hover:bg-white shadow">
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{charity.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">{charity.description}</p>
              
              {charity.websiteUrl && (
                <a href={charity.websiteUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1.5 w-max">
                  <FiLink /> Visit Website
                </a>
              )}
            </div>
          </div>
        ))}
        {charities.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
            No charities found. Click "Add New Charity" to create one.
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold font-heading">{editingId ? 'Edit Charity' : 'Add Charity'}</h3>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><FiX size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="form-group">
                <label className="form-label text-sm font-semibold text-slate-700">Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Charity Organization Name"
                  className="form-input" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label text-sm font-semibold text-slate-700">Description</label>
                <textarea 
                  required
                  rows="4" 
                  placeholder="Who they are and what they do..."
                  className="form-input resize-none" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label text-sm font-semibold text-slate-700">Image URL</label>
                <input 
                  type="url" 
                  placeholder="https://example.com/logo.jpg"
                  className="form-input" 
                  value={formData.images}
                  onChange={e => setFormData({...formData, images: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label text-sm font-semibold text-slate-700">Website URL (Optional)</label>
                <input 
                  type="url" 
                  placeholder="https://example.com"
                  className="form-input" 
                  value={formData.websiteUrl}
                  onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeForm} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Save Charity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
