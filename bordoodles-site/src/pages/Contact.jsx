import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Contact() {
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    useEffect(() => {
        if (location.state?.puppyName) {
            setFormData(prev => ({
                ...prev,
                message: `Hi, I'm interested in ${location.state.puppyName}! Is this puppy still available?`
            }));
        }
    }, [location.state]);

    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const response = await fetch("https://formspree.io/f/manrpkjg", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                alert('Thank you! Your message has been sent successfully.');
            } else {
                setStatus('error');
                alert("Oops! There was a problem submitting your form.");
            }
        } catch (error) {
            setStatus('error');
            alert("Oops! There was a problem submitting your form.");
        }
    };

    return (
        <div className="container page-content">
            <div className="page-header">
                <h1>Contact Us</h1>
                <p>Have questions about our puppies? We'd love to hear from you.</p>
            </div>

            <div className="contact-grid">
                <div className="contact-info">
                    <div className="info-card">
                        <MapPin className="info-icon" />
                        <h3>Location</h3>
                        <p>Pittsburg, Texas</p>
                    </div>
                    <div className="info-card">
                        <Mail className="info-icon" />
                        <h3>Email</h3>
                        <p>ashtinmascorro@gmail.com</p>
                    </div>
                    <div className="info-card">
                        <Phone className="info-icon" />
                        <h3>Phone</h3>
                        <p>903-975-2508</p>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            rows="5"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn-primary" disabled={status === 'sending'}>
                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </div>
        </div>
    );
}
