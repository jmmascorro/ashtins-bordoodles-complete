import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = `${API_BASE}/api`;

export default function ParentManager() {
    const [parents, setParents] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentParent, setCurrentParent] = useState(null);

    const [formData, setFormData] = useState({
        name: '', role: 'Dam', breed: 'Border Collie', color: '', weight: '', description: '', image: '/parent1.png'
    });
    const [uploadFile, setUploadFile] = useState(null);

    useEffect(() => {
        fetchParents();
    }, []);

    const fetchParents = async () => {
        try {
            const res = await axios.get(`${API_URL}/parents`);
            setParents(res.data);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this parent?')) return;
        try {
            await axios.delete(`${API_URL}/parents/${id}`);
            fetchParents();
        } catch (err) { alert('Failed to delete'); }
    };

    const handleEdit = (parent) => {
        setIsEditing(true);
        setCurrentParent(parent);
        setFormData(parent);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddNew = () => {
        setIsEditing(true);
        setCurrentParent(null);
        setFormData({ name: '', role: 'Dam', breed: 'Border Collie', color: '', weight: '', description: '', image: '/parent1.png' });
        setUploadFile(null);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadFile(file);

        const data = new FormData();
        data.append('image', file);

        try {
            const res = await axios.post(`${API_URL}/upload`, data);
            setFormData(prev => ({ ...prev, image: res.data.url }));
        } catch (err) {
            alert('Upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentParent) {
                await axios.put(`${API_URL}/parents/${currentParent.id}`, formData);
            } else {
                await axios.post(`${API_URL}/parents`, formData);
            }
            setIsEditing(false);
            fetchParents();
        } catch (err) {
            alert('Failed to save');
            console.error(err);
        }
    };

    if (isEditing) {
        return (
            <div className="form-container">
                <h2>{currentParent ? 'Edit Parent' : 'Add New Parent'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>

                    <div className="form-group">
                        <label>Upload Photo</label>
                        <input type="file" onChange={handleFileUpload} />
                        {formData.image && <img src={formData.image} alt="Preview" style={{ height: 100, marginTop: 10, borderRadius: 8 }} />}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Role</label>
                            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                <option value="Sire">Sire (Dad)</option>
                                <option value="Dam">Dam (Mom)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Breed</label>
                            <input value={formData.breed} onChange={e => setFormData({ ...formData, breed: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Color</label>
                            <input value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Weight</label>
                            <input value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn-primary">Save Parent</button>
                        <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '0.75rem', background: 'transparent', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Parent Management</h2>
                <button className="btn-primary" onClick={handleAddNew}><Plus size={20} /> Add Parent</button>
            </div>

            <div className="card-grid">
                {parents.map(parent => {
                    const imgUrl = parent.image || '';
                    const displayUrl = imgUrl.startsWith('http') ? imgUrl : `${API_BASE}/${imgUrl.replace(/^\//, '')}`;

                    return (
                        <div key={parent.id} className="cms-card">
                            <img src={displayUrl} alt={parent.name} onError={(e) => e.target.src = 'https://placehold.co/400x300?text=No+Image'} />
                            <h3>{parent.name}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{parent.role} • {parent.breed}</p>
                            <div className="cms-actions">
                                <button className="btn-edit" onClick={() => handleEdit(parent)}><Edit2 size={16} /> Edit</button>
                                <button className="btn-delete" onClick={() => handleDelete(parent.id)}><Trash2 size={16} /> Delete</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
