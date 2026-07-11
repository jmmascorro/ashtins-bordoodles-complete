import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');
const API_URL = `${API_BASE}/api`;

console.log('🔌 CMS Debug:', {
    MODE: import.meta.env.MODE,
    BASE_URL: import.meta.env.BASE_URL,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    ALL_ENV: import.meta.env
});

export default function PuppyManager() {
    const [puppies, setPuppies] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPuppy, setCurrentPuppy] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '', breed: '', color: '', gender: '', price: '', status: 'Available', dob: '', description: '',
        images: [] // Array of image URLs
    });

    useEffect(() => {
        fetchPuppies();
    }, []);

    const fetchPuppies = async () => {
        try {
            const res = await axios.get(`${API_URL}/puppies`);
            setPuppies(res.data);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this puppy?')) return;
        try {
            await axios.delete(`${API_URL}/puppies/${id}`);
            fetchPuppies();
        } catch (err) { alert('Failed to delete'); }
    };

    const handleEdit = (puppy) => {
        setIsEditing(true);
        setCurrentPuppy(puppy);
        // Ensure images is always an array
        const images = puppy.images && Array.isArray(puppy.images) ? puppy.images : (puppy.image ? [puppy.image] : []);
        setFormData({ ...puppy, images });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddNew = () => {
        setIsEditing(true);
        setCurrentPuppy(null);
        setFormData({
            name: '', breed: 'Bordoodle (F1)', color: '', gender: '', price: '', status: 'Available', dob: '', description: '',
            images: []
        });
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newImageUrls = [];

        // Upload each file individually
        for (const file of files) {
            const data = new FormData();
            data.append('image', file);

            try {
                const res = await axios.post(`${API_URL}/upload`, data);
                newImageUrls.push(res.data.url);
            } catch (err) {
                console.error('Upload failed for file:', file.name);
                alert(`Failed to upload ${file.name}`);
            }
        }

        // Add new URLs to existing images
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImageUrls]
        }));
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure we send the proper JSON array for images
        // We also sync the legacy 'image' field to the first image for backward compat
        const payload = {
            ...formData,
            image: formData.images.length > 0 ? formData.images[0] : ''
        };

        try {
            if (currentPuppy) {
                await axios.put(`${API_URL}/puppies/${currentPuppy.id}`, payload);
            } else {
                await axios.post(`${API_URL}/puppies`, payload);
            }
            setIsEditing(false);
            fetchPuppies();
        } catch (err) {
            alert('Failed to save');
            console.error(err);
        }
    };

    const getDisplayUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${API_BASE}/${url.replace(/^\//, '')}`;
    };

    if (isEditing) {
        return (
            <div className="form-container">
                <h2>{currentPuppy ? 'Edit Puppy' : 'Add New Puppy'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Puppy Name</label>
                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>

                    <div className="form-group">
                        <label>Photos (Select multiple)</label>
                        <div className="image-upload-container">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                                style={{ marginBottom: '1rem' }}
                            />

                            {formData.images.length > 0 && (
                                <div className="image-preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                                    {formData.images.map((img, index) => (
                                        <div key={index} style={{ position: 'relative' }}>
                                            <img
                                                src={getDisplayUrl(img)}
                                                alt={`Preview ${index}`}
                                                style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                style={{
                                                    position: 'absolute', top: 2, right: 2,
                                                    background: 'rgba(0,0,0,0.7)', color: 'white',
                                                    border: 'none', borderRadius: '50%', width: '24px', height: '24px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                                }}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Breed</label>
                            <input value={formData.breed} onChange={e => setFormData({ ...formData, breed: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Color</label>
                            <input value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Gender</label>
                            <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Sold">Sold</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn-primary">Save Puppy</button>
                        <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '0.75rem', background: 'transparent', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Puppy Management</h2>
                <button className="btn-primary" onClick={handleAddNew}><Plus size={20} /> Add Puppy</button>
            </div>

            <div className="card-grid">
                {puppies.map(puppy => {
                    // Check for images array first, fallback to single image
                    const images = puppy.images && Array.isArray(puppy.images) && puppy.images.length > 0
                        ? puppy.images
                        : (puppy.image ? [puppy.image] : []);

                    const mainImage = images.length > 0 ? images[0] : '';
                    const displayUrl = getDisplayUrl(mainImage);

                    return (
                        <div key={puppy.id} className="cms-card">
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={displayUrl}
                                    alt={puppy.name}
                                    onError={(e) => e.target.src = 'https://placehold.co/400x300?text=No+Image'}
                                />
                                {images.length > 1 && (
                                    <span style={{
                                        position: 'absolute', bottom: '8px', right: '8px',
                                        background: 'rgba(0,0,0,0.6)', color: 'white',
                                        padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem'
                                    }}>
                                        +{images.length - 1} photos
                                    </span>
                                )}
                            </div>
                            <h3>{puppy.name}</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{puppy.breed} • {puppy.status}</p>
                            <div className="cms-actions">
                                <button className="btn-edit" onClick={() => handleEdit(puppy)}><Edit2 size={16} /> Edit</button>
                                <button className="btn-delete" onClick={() => handleDelete(puppy.id)}><Trash2 size={16} /> Delete</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
