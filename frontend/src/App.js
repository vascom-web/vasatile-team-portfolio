import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SkillsPage from './pages/SkillsPage';
import MembersPage from './pages/MembersPage';
import MemberDetailPage from './pages/MemberDetailPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MemberDashboardPage from './pages/MemberDashboardPage';
import RequestViewPage from './pages/RequestViewPage';

// ---------- Router ----------
const RouterContext = createContext(null);

export function useRouter() { return useContext(RouterContext); }

function Router({ children }) {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/');
  useEffect(() => {
    const handler = () => setRoute(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  const navigate = (r) => { window.location.hash = r; setRoute(r); };
  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

// Route component – smarter matching
function Route({ path, component: Component }) {
  const { route } = useRouter();
  let match = false;

  // Special handling for /member – only match if route is exactly /member
  // or if it starts with /member/ and the rest is a valid ObjectId (24 hex chars)
  if (path === '/member') {
    if (route === '/member') {
      match = true;
    } else if (route.startsWith('/member/')) {
      const id = route.substring('/member/'.length);
      // Check if id is a valid MongoDB ObjectId (24 hex characters)
      if (/^[a-f0-9]{24}$/.test(id)) {
        match = true;
      }
    }
  } else {
    // Default matching: exact match or starts with path + '/' or '?'
    match = route === path || route.startsWith(path + '/') || route.startsWith(path + '?');
  }

  return match ? <Component /> : null;
}

export function Link({ to, children, className = '' }) {
  const { navigate } = useRouter();
  return (
    <a href={`#${to}`} className={className} onClick={(e) => { e.preventDefault(); navigate(to); }}>
      {children}
    </a>
  );
}

// ---------- App ----------
function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Header />
              <Route path="/" component={HomePage} />
              <Route path="/skills" component={SkillsPage} />
              <Route path="/members" component={MembersPage} />
              <Route path="/login" component={LoginPage} />
              <Route path="/admin/dashboard" component={AdminDashboardPage} />
              <Route path="/member/dashboard" component={MemberDashboardPage} />
              <Route path="/member" component={MemberDetailPage} />  {/* only matches /member or /member/<validObjectId> */}
              <Route path="/request" component={RequestViewPage} />
              <Footer />
            </div>
          </ToastProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;