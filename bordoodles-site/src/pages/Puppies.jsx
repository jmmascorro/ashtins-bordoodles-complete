import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* Subcomponent for Carousel to manage its own state */
function PuppyCard({ puppy }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    // Handle image cycling
    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % puppy.images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + puppy.images.length) % puppy.images.length);
    };

    /* Fallback if images array is empty or undefined (backward compatibility) */
    const displayImages = puppy.images && puppy.images.length > 0 ? puppy.images : [puppy.image];

    // Helper to resolve image URL
    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        console.log('🖼️ Image Debug:', { path, API_URL, result: `${API_URL}${path}` }); // Debug Log
        return `${API_URL}${path}`;
    };

    const currentImage = getImageUrl(displayImages[currentImageIndex]);

    const handleInquiry = () => {
        // Navigate to contact page with puppy details
        navigate('/contact', { state: { puppyName: puppy.name } });
    };

    return (
        <div className="puppy-card">
            <div className="card-image-container">
                <img src={currentImage} alt={puppy.name} className="card-image" />

                {displayImages.length > 1 && (
                    <>
                        <button className="carousel-btn prev" onClick={prevImage}>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="carousel-btn next" onClick={nextImage}>
                            <ChevronRight size={20} />
                        </button>
                        <div className="carousel-dots">
                            {displayImages.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className={`status-badge ${puppy.status.toLowerCase()}`}>
                    {puppy.status}
                </div>
            </div>

            <div className="card-content">
                <div className="card-header">
                    <h2>{puppy.name}</h2>
                    <div className="card-price">${puppy.price}</div>
                </div>
                <p className="card-breed">{puppy.breed} • {puppy.gender}</p>
                <p className="card-desc">{puppy.description}</p>

                <div className="card-features">
                    <span>🎂 {new Date(puppy.dob).toLocaleDateString()}</span>
                    <span>🎨 {puppy.color}</span>
                </div>

                <button className="btn-primary card-btn" onClick={handleInquiry}>
                    Is this my puppy?
                </button>
            </div>
        </div>
    );
}

export default function Puppies() {
    const [puppies, setPuppies] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        fetch(`${API_URL}/api/puppies`)
            .then(res => res.json())
            .then(data => {
                setPuppies(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch puppies:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="container page-content"><p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading available puppies...</p></div>;
    }

    return (
        <div className="container page-content">
            <div className="page-header">
                <h1>Available Puppies</h1>
                <p>Find your new best friend.</p>
            </div>

            <div className="puppy-grid">
                {puppies.map((puppy) => (
                    <PuppyCard key={puppy.id} puppy={puppy} />
                ))}
            </div>
        </div>
    );
}
