import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../service/service';

export default function Navbar(){
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await authService.getAuthStatus();
                setIsAuthenticated(data.isAuthenticated);
                setUser(data.user);
            } catch {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, [currentPath]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            setIsAuthenticated(false);
            setUser(null);
            // Dispatch a custom event to reset timer and tasks
            window.dispatchEvent(new Event('user-logged-out'));
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    const [menuOpen, setMenuOpen] = useState(false);

    return(
        <nav className='w-full px-6 py-6 flex flex-col sm:flex-row justify-between items-center bg-gray-800 gap-2 sm:gap-0'>
            <div className='w-full sm:w-auto flex justify-between items-center'>
                <Link to='/'>
                    <h1 className='text-white text-xl sm:text-2xl md:text-3xl font-bold hover:text-gray-300 transition-colors text-center'>Pomexa</h1>
                </Link>
                {/* Hamburger button for mobile */}
                <button
                    className='sm:hidden flex items-center px-2 py-1 rounded text-white focus:outline-none focus:ring-2 focus:ring-gray-500'
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label='Toggle navigation menu'
                >
                    <svg
                        className={`w-8 h-8 transition-transform duration-300 ${menuOpen ? 'transform rotate-90' : ''}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        {menuOpen ? (
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                        ) : (
                            <>
                                <line x1='4' y1='6' x2='20' y2='6' strokeWidth='2'/>
                                <line x1='4' y1='12' x2='20' y2='12' strokeWidth='2'/>
                                <line x1='4' y1='18' x2='20' y2='18' strokeWidth='2'/>
                            </>
                        )}
                    </svg>
                </button>
            </div>

            {/* Nav links */}
            <div className={`w-full sm:w-auto flex ${menuOpen ? 'flex' : 'hidden'} sm:flex justify-center sm:justify-end`}> 
                <ul className='flex flex-col sm:flex-row gap-2 sm:gap-6 items-center'>
                    <li><Link to='/' className='text-white text-base sm:text-lg md:text-xl font-semibold hover:text-gray-400'>Home</Link></li>
                    {isAuthenticated ? (
                        <>
                            <li>
                                <Link to='/profile' className='text-white text-base sm:text-lg md:text-xl font-semibold hover:text-gray-400'>
                                    {user?.username || 'Profile'}
                                </Link>
                            </li>
                            <li>
                                <button 
                                    onClick={handleLogout}
                                    className='text-white text-base sm:text-lg md:text-xl font-semibold hover:text-gray-400'
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            {currentPath !== '/login' && (
                                <li><Link to='/login' className='text-white text-base sm:text-lg md:text-xl font-semibold hover:text-gray-400'>Login</Link></li>
                            )}
                            {currentPath !== '/register' && (
                                <li><Link to='/register' className='text-white text-base sm:text-lg md:text-xl font-semibold hover:text-gray-400'>Register</Link></li>
                            )}
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}