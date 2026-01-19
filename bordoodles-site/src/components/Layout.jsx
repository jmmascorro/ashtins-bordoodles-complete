import { Link, Outlet } from 'react-router-dom';
import { Dog, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="app-wrapper">
            <header className="site-header">
                <div className="container header-content">
                    <Link to="/" className="brand">
                        <Dog className="brand-icon" size={32} />
                        <span>Ashtins Bordoodles</span>
                    </Link>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <nav className={`main-nav ${isMenuOpen ? 'active' : ''}`}>
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link to="/puppies" onClick={() => setIsMenuOpen(false)}>Available Puppies</Link>
                        <Link to="/parents" onClick={() => setIsMenuOpen(false)}>Parents</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                    </nav>
                </div>
            </header>

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="site-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Ashtins Bordoodles. All rights reserved.</p>
                    <p>Located in Pittsburg, Texas</p>
                </div>
            </footer>
        </div>
    );
}
