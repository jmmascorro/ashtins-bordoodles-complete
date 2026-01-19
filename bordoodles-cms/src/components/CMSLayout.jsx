import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dog, PawPrint, LogOut } from 'lucide-react';

export default function CMSLayout() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="cms-wrapper">
            <aside className="cms-sidebar">
                <div className="branding">
                    <h2>Ashtins Bordoodles<br /><span>Admin</span></h2>
                </div>

                <nav className="cms-nav">
                    <Link to="/" className={isActive('/') ? 'active' : ''}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/puppies" className={isActive('/puppies') ? 'active' : ''}>
                        <Dog size={20} /> Puppies
                    </Link>
                    <Link to="/parents" className={isActive('/parents') ? 'active' : ''}>
                        <PawPrint size={20} /> Parents
                    </Link>
                </nav>

                <div className="cms-footer">
                    <button className="logout-btn"><LogOut size={16} /> Logout</button>
                </div>
            </aside>

            <main className="cms-content">
                <header className="cms-header">
                    <h3>Dashboard Overview</h3>
                </header>
                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
