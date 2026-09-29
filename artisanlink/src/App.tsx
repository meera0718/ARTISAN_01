import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useParams } from 'react-router-dom';
import { Palette, GraduationCap, Users, Shield, ArrowLeft } from 'lucide-react';
import './index.css';
import ArtisanDashboard from './ArtisanDashboard';
import StudentDashboard from './StudentDashboard';
import CustomerDashboard from './CustomerDashboard';
import AdminDashboard from './AdminDashboard';
import { ArtisanProvider } from './context/ArtisanContext';

// ROLES CONFIG
const ROLES = [
  {
    id: 'artisan',
    name: 'Artisan',
    icon: <Palette size={24} />,
    description: 'Creates and manages products. Gets support and market opportunities.',
    welcome: 'Welcome, Artisan',
    subtitle: 'Access your craft workspace',
  },
  {
    id: 'student',
    name: 'Student',
    icon: <GraduationCap size={24} />,
    description: 'Supports artisans. Handles digital facilitation and verification tasks.',
    welcome: 'Welcome, Student',
    subtitle: 'Support artisans. Complete tasks. Create impact.',
  },
  {
    id: 'customer',
    name: 'Customer',
    icon: <Users size={24} />,
    description: 'Discovers crafts and artisans. Finds, customizes and traces products.',
    welcome: 'Welcome, Customer',
    subtitle: 'Discover makers, products and craft experiences.',
  },
  {
    id: 'admin',
    name: 'Admin',
    icon: <Shield size={24} />,
    description: 'Coordinates and monitors the ecosystem. Oversees products and requests.',
    welcome: 'Welcome, Admin',
    subtitle: 'Monitor and coordinate the craft ecosystem.',
  }
];

// --- SCREENS ---

function LandingScreen() {
  const navigate = useNavigate();

  return (
    <div className="landing-page split-layout">
      <div className="layout-content">
        <div className="hero-section">
          <h1 className="brand-title">ARTISANLINK</h1>
          <p className="brand-tagline">Youth-powered AI craft commerce and support network</p>
          <p className="brand-support">Connecting the people, products and stories behind India's crafts.</p>
        </div>

        <div className="role-selection-section">
          <h2 className="role-selection-title">Choose how you’re entering ArtisanLink</h2>
          <div className="role-grid">
            {ROLES.map((role) => (
              <button 
                key={role.id} 
                className="role-card"
                onClick={() => navigate(`/login/${role.id}`)}
              >
                <div className="role-icon-wrapper">{role.icon}</div>
                <h3 className="role-name">{role.name}</h3>
                <p className="role-desc">{role.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="layout-visual">
        <img src="/bg_potter.jpg" alt="Indian artisan potter" className="visual-bg" />
        <div className="visual-overlay"></div>
        <div className="visual-decorative-elements">
          <div className="deco-item deco-1">
            <img src="/deco_handloom.jpg" alt="Handloom textile" />
          </div>
          <div className="deco-item deco-2">
            <img src="/deco_jewelry.jpg" alt="Traditional jewelry" />
          </div>
          <div className="deco-item deco-3">
            <img src="/deco_terracotta.jpg" alt="Terracotta" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginScreen() {
  const navigate = useNavigate();
  const { roleId } = useParams();
  const role = ROLES.find(r => r.id === roleId);

  if (!role) return <Navigate to="/" />;

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/dashboard/${role.id}`);
  };

  return (
    <div className="login-page split-layout">
      <div className="layout-content">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Change role
        </button>

        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">{role.welcome}</h2>
            <p className="login-subtitle">{role.subtitle}</p>
          </div>

          <form className="login-form" onSubmit={handleDemoLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" required className="form-input" placeholder="Enter your email" />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" required className="form-input" placeholder="Enter your password" />
            </div>

            <label className="form-options">
              <input type="checkbox" /> Remember me
            </label>

            <button type="submit" className="btn-primary">Demo Login</button>
          </form>

          <p className="demo-notice">This is a prototype environment. No actual credentials required.</p>
        </div>
      </div>
      
      <div className="layout-visual">
        <img src="/bg_potter.jpg" alt="Indian artisan potter" className="visual-bg" />
        <div className="visual-overlay"></div>
        <div className="visual-decorative-elements">
          <div className="deco-item deco-1">
            <img src="/deco_handloom.jpg" alt="Handloom textile" />
          </div>
          <div className="deco-item deco-2">
            <img src="/deco_jewelry.jpg" alt="Traditional jewelry" />
          </div>
          <div className="deco-item deco-3">
            <img src="/deco_terracotta.jpg" alt="Terracotta" />
          </div>
        </div>
      </div>
    </div>
  );
}











export default function App() {
  return (
    <ArtisanProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LandingScreen />} />
            <Route path="/login/:roleId" element={<LoginScreen />} />
            
            <Route path="/dashboard/artisan" element={<ArtisanDashboard />} />
            <Route path="/dashboard/student" element={<StudentDashboard />} />
            <Route path="/dashboard/customer" element={<CustomerDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </ArtisanProvider>
  );
}
