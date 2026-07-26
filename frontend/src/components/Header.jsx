import React, { useState } from 'react';
import { Link, useRouter } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { admin, member, logoutAdmin, logoutMember } = useAuth();
  const { route } = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAdminLogout = () => {
    logoutAdmin();
    window.location.hash = '/';
    setIsMenuOpen(false);
  };

  const handleMemberLogout = () => {
    logoutMember();
    window.location.hash = '/';
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass dark:bg-gray-900/90 dark:border-gray-700 border-b border-gray-200/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white" onClick={closeMenu}>
            <span className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-sm">v</span>
            <span className="gradient-text">Vasatile~Portfolio</span>
          </Link>

          {/* Desktop Navigation (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Home</Link>
            <Link to="/skills" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Skills</Link>
            <Link to="/members" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Team</Link>

            {admin && (
              <>
                <span className="text-indigo-600 dark:text-indigo-400 text-xs bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">Admin</span>
                <button onClick={handleAdminLogout} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs">Logout</button>
              </>
            )}
            {member && (
              <>
                <span className="text-emerald-600 dark:text-emerald-400 text-xs bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full">{member.name}</span>
                <button onClick={handleMemberLogout} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs">Logout</button>
              </>
            )}
            {!admin && !member && (
              <Link to="/login" className="text-xs text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Login</Link>
            )}

            {/* Theme toggle - desktop */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <i className="fas fa-sun text-yellow-400" />
              ) : (
                <i className="fas fa-moon text-indigo-600" />
              )}
            </button>
          </nav>

          {/* Mobile controls: Hamburger + theme toggle (always visible on mobile) */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Theme toggle on mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <i className="fas fa-sun text-yellow-400" />
              ) : (
                <i className="fas fa-moon text-indigo-600" />
              )}
            </button>

            {/* Hamburger button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition focus:outline-none"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu (slide down) */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-3 text-sm font-medium">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition" onClick={closeMenu}>Home</Link>
              <Link to="/skills" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition" onClick={closeMenu}>Skills</Link>
              <Link to="/members" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition" onClick={closeMenu}>Team</Link>

              {admin && (
                <>
                  <span className="text-indigo-600 dark:text-indigo-400 text-xs bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full inline-block w-fit">Admin</span>
                  <button onClick={handleAdminLogout} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs text-left">Logout</button>
                </>
              )}
              {member && (
                <>
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full inline-block w-fit">{member.name}</span>
                  <button onClick={handleMemberLogout} className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs text-left">Logout</button>
                </>
              )}
              {!admin && !member && (
                <Link to="/login" className="text-xs text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition" onClick={closeMenu}>Login</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}