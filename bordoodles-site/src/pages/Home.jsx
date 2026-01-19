import { Link } from 'react-router-dom';
import heroBg from '../assets/hero_bg.png';

export default function Home() {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
                <div className="hero-content">
                    <h1>Ashtins Bordoodles</h1>
                    <p className="hero-subtitle">Raising Intelligent, Loving, and Hypoallergenic Family Companions in Pittsburg, Texas.</p>
                    <div className="hero-cta">
                        <Link to="/puppies" className="btn-primary">View Available Puppies</Link>
                        <Link to="/contact" className="btn-secondary">Contact Us</Link>
                    </div>
                </div>
                <div className="hero-overlay"></div>
            </section>

            {/* About Section */}
            <section className="about-section container">
                <div className="about-grid">
                    <div className="about-text">
                        <h2>Why Choose a Bordoodle?</h2>
                        <p>
                            Bordoodles combine the intelligence and loyalty of the Border Collie with the hypoallergenic coat and playful nature of the Poodle.
                            They are the perfect family dog—smart, easy to train, and endlessly affectionate.
                        </p>
                        <p>
                            Welcome to Ashtins Bordoodles. Located in the heart of Pittsburg, Texas, we pride ourselves on raising our puppies in a loving home environment.
                            We focus on health, temperament, and socialization to ensure your new best friend is ready for life with you.
                        </p>
                    </div>
                    <div className="about-features">
                        <div className="feature-card">
                            <h3>🧠 Intelligent</h3>
                            <p>Ranked among the smartest dog breeds, making training a breeze.</p>
                        </div>
                        <div className="feature-card">
                            <h3>❤️ Hypoallergenic</h3>
                            <p>Low-shedding coats perfect for families with allergies.</p>
                        </div>
                        <div className="feature-card">
                            <h3>🏡 Family Raised</h3>
                            <p>Socialized with kids and other pets from day one.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
