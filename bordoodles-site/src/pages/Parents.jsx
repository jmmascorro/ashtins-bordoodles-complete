import { useState, useEffect } from 'react';

export default function Parents() {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        fetch(`${API_URL}/api/parents`)
            .then(res => res.json())
            .then(data => {
                setParents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch parents:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="container page-content"><p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading parents...</p></div>;
    }

    return (
        <div className="container page-content">
            <div className="page-header">
                <h1>Our Parents</h1>
                <p>Meet the health-tested parents behind our beautiful puppies.</p>
            </div>

            <div className="puppy-grid">
                {parents.map((parent) => (
                    <div key={parent.id} className="puppy-card">
                        <div className="card-image-container">
                            <img
                                src={parent.image?.startsWith('http') ? parent.image : `${API_URL}${parent.image}`}
                                alt={parent.name}
                                className="card-image"
                            />
                            <div className="status-badge available" style={{ background: '#e2e8f0', color: '#1e293b' }}>
                                {parent.role}
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="card-header">
                                <h2>{parent.name}</h2>
                            </div>
                            <p className="card-breed">{parent.breed} • {parent.weight}</p>
                            <p className="card-desc">{parent.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
