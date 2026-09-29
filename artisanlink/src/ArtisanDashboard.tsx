import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  LifeBuoy, 
  QrCode, 
  Map as MapIcon, 
  User, 
  Settings, 
  Bell, 
  Search, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Mic, 
  Activity, 
  Award,
  X,
  Send
} from 'lucide-react';
import './ArtisanDashboard.css';
import { useArtisanEcosystem } from './context/ArtisanContext';

const SOS_CATEGORIES = [
  'Finding Buyers', 'Transportation', 'Raw Materials', 'Product Photography', 'Digital Assistance', 'Monsoon Shelter'
];

export default function ArtisanDashboard() {
  const navigate = useNavigate();
  const {
    products,
    opportunities,
    sosTickets,
    requirements,
    orders,
    activityLogs,
    raiseSOS,
    updateProductStock,
    calculateMatchScore,
    addLog
  } = useArtisanEcosystem();

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedLocality, setSelectedLocality] = useState('Srirangam');
  const [isAiListening, setIsAiListening] = useState(false);
  const [aiTranscript, setAiTranscript] = useState('');
  const [selectedSosCat, setSelectedSosCat] = useState<string>('Transportation');
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosProblemText, setSosProblemText] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Artisan products (Filtered or primary collection)
  const artisanProducts = useMemo(() => {
    return products.slice(0, 6);
  }, [products]);

  // Real-time market matches using the deterministic engine
  const liveMatches = useMemo(() => {
    // Current artisan craft profile
    const artisanProfile = {
      category: 'terracotta',
      craft: 'Terracotta',
      lat: 10.8624,
      lng: 78.6946,
      quantity: 20
    };

    return opportunities.map(opp => {
      const analysis = calculateMatchScore(artisanProfile, opp);
      return {
        id: opp.id,
        market: opp.title,
        demand: opp.demandDesc,
        ...analysis
      };
    }).sort((a, b) => b.score - a.score);
  }, [opportunities, calculateMatchScore]);

  // Open SOS tickets for this artisan
  const activeArtisanSos = useMemo(() => {
    return sosTickets.filter(s => s.status !== 'Resolved')[0] || null;
  }, [sosTickets]);

  const handleNavClick = (tabName: string, id?: string) => {
    setActiveTab(tabName);
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAiStudio = () => {
    setIsAiListening(true);
    setAiTranscript('Listening... (Tamil / தமிழ்)');
    
    setTimeout(() => {
      setAiTranscript('Translating: "I want to add my new Cauvery Clay Cooking Pot..."');
      
      setTimeout(() => {
        setIsAiListening(false);
        setAiTranscript('');
        handleAddProduct();
      }, 1800);
    }, 1800);
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: 'Wheel-thrown Cauvery Clay Pot',
      price: 650,
      stock: 15,
      material: 'Riverbed Alluvial Clay',
      nodeId: 'node-srirangam-01',
      shopName: 'Srirangam Temple Potter Guild',
      locality: 'Srirangam, Trichy',
      lat: 10.8624,
      lng: 78.6946,
      category: 'terracotta' as const
    };
    updateProductStock(newProduct.id, 15);
    addLog(`📦 New Craft Registered: "${newProduct.name}" in Srirangam cluster`);
    showToast(`✓ Added "${newProduct.name}" to inventory!`);
  };

  const handleSubmitSos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sosProblemText.trim()) return;

    raiseSOS({
      artisanName: 'Meenakshi Ammal',
      problem: `${selectedSosCat}: ${sosProblemText}`,
      category: 'terracotta',
      craft: 'Terracotta Pottery',
      quantity: 25,
      locality: 'Musiri',
      urgency: 'High',
      contact: '+91 98422 17409',
      address: '14 Riverbank Road, Musiri, Cauvery Basin'
    });

    setSosProblemText('');
    setSosModalOpen(false);
    showToast('🚨 SOS Request broadcast to Admin Command Center & Student Hub!');
  };

  return (
    <div className="artisan-dashboard-container">
      {/* Toast */}
      {toastMsg && (
        <div className="admin-toast-float" style={{ zIndex: 9999 }}>
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="artisan-sidebar">
        <div className="sidebar-brand">ARTISANLINK</div>
        
        <nav className="sidebar-nav">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeTab === 'Dashboard'}
            onClick={() => handleNavClick('Dashboard', 'dashboard-top')}
          />
          <NavItem
            icon={<Package size={20} />}
            label="My Products"
            active={activeTab === 'My Products'}
            onClick={() => handleNavClick('My Products', 'my-products')}
          />
          <NavItem
            icon={<PlusCircle size={20} />}
            label="Add Product"
            onClick={handleAddProduct}
          />
          <NavItem
            icon={<ShoppingCart size={20} />}
            label="Orders & Requests"
            active={activeTab === 'Orders'}
            onClick={() => handleNavClick('Orders', 'orders-section')}
          />
          
          <div className="nav-divider"></div>
          
          <NavItem
            icon={<LifeBuoy size={20} />}
            label="Artisan SOS"
            active={activeTab === 'Artisan SOS'}
            onClick={() => handleNavClick('Artisan SOS', 'artisan-sos')}
          />
          <NavItem
            icon={<QrCode size={20} />}
            label="Craft Passport"
            active={activeTab === 'Craft Passport'}
            onClick={() => handleNavClick('Craft Passport', 'craft-passport')}
          />
          <NavItem
            icon={<MapIcon size={20} />}
            label="Map"
            active={activeTab === 'Map'}
            onClick={() => navigate('/dashboard/customer')}
          />
          
          <div className="nav-divider"></div>
          
          <NavItem
            icon={<User size={20} />}
            label="Profile"
            active={activeTab === 'Profile'}
            onClick={() => handleNavClick('Profile', 'dashboard-top')}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === 'Settings'}
            onClick={() => handleNavClick('Settings', 'dashboard-top')}
          />
          <NavItem
            icon={<LogOut size={20} />}
            label="Logout"
            onClick={() => navigate('/')}
          />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="artisan-main">
        {/* HEADER */}
        <header className="artisan-header">
          <div className="header-search">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search craft inventory, orders, or support..." />
          </div>
          
          <div className="header-actions">
            <button className="notification-btn" onClick={() => showToast('1 Live Match waiting in Srirangam.')}>
              <Bell size={20} />
              <span className="badge"></span>
            </button>
            <div className="profile-section">
              <div className="profile-info">
                <span className="welcome-text">Welcome back,</span>
                <span className="artisan-name">
                  Meenakshi Ammal <Award size={14} className="verified-icon text-accent" />
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#A75D28] text-white flex items-center justify-center font-bold text-sm">
                MA
              </div>
            </div>
          </div>
        </header>

        {/* REGIONAL BANNER */}
        <div className="regional-banner">
          <span className="regional-title">📍 Trichy Craft Ecosystem • Cauvery Basin</span>
          <div className="regional-filters">
            {['Srirangam', 'Woraiyur', 'Thillai Nagar', 'Tollgate', 'Musiri'].map(loc => (
              <button
                key={loc}
                className={`filter-pill ${selectedLocality === loc ? 'active' : ''}`}
                onClick={() => {
                  setSelectedLocality(loc);
                  showToast(`Selected locality: ${loc}`);
                }}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* DASHBOARD CONTENT */}
        <div className="dashboard-scrollable-content" id="dashboard-top">
          
          {/* STATS OVERVIEW (COMPUTED LIVE) */}
          <section className="stats-grid">
            <StatCard
              label="Total Products"
              value={products.length.toString()}
              icon={<Package className="text-accent" size={24} />}
            />
            <StatCard
              label="Available Products"
              value={products.filter(p => p.stock > 0).length.toString()}
              icon={<CheckCircle2 className="text-green" size={24} />}
            />
            <StatCard
              label="Pending Requests"
              value={requirements.filter(r => r.status === 'Open').length.toString()}
              icon={<ShoppingCart className="text-accent" size={24} />}
            />
            <StatCard
              label="Active SOS Requests"
              value={sosTickets.filter(s => s.status !== 'Resolved').length.toString()}
              icon={<AlertCircle className="text-orange" size={24} />}
            />
          </section>

          <div className="dashboard-main-grid">
            {/* LEFT COLUMN */}
            <div className="main-col">
              
              {/* MY PRODUCTS */}
              <section className="dashboard-section" id="my-products">
                <div className="section-header">
                  <h2 className="section-title">My Craft Products</h2>
                  <div className="flex gap-2">
                    <button className="btn-ai" onClick={handleAiStudio}>
                      <Mic size={16} /> AI Studio (Speak Tamil/English)
                    </button>
                    <button className="btn-secondary" onClick={handleAddProduct}>+ Add Spec</button>
                  </div>
                </div>

                {isAiListening && (
                  <div className="ai-widget-active">
                    <div className="ai-waveform">
                      <Activity size={24} className="waveform-icon animate-pulse text-accent" />
                    </div>
                    <p className="ai-transcript">{aiTranscript}</p>
                  </div>
                )}
                
                <div className="products-list">
                  {artisanProducts.map(product => (
                    <div key={product.id} className="product-card-horizontal">
                      <div className="w-12 h-12 rounded-lg bg-[#ECE7E1] flex items-center justify-center font-serif text-[#A75D28] font-bold text-lg">
                        {product.name.charAt(0)}
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">
                          {product.name} 
                          <span className="verified-pill">GI Verified</span>
                        </h3>
                        <p className="product-meta">{product.category} • {product.locality}</p>
                      </div>
                      <div className="product-status">
                        <span className={`status-badge ${product.stock > 0 ? 'available' : 'low-stock'}`}>
                          {product.stock > 0 ? `In Stock (${product.stock})` : 'Low Stock'}
                        </span>
                      </div>
                      <div className="product-price">₹{product.price.toLocaleString()}</div>
                      <button 
                        className="btn-icon"
                        title="Update Stock"
                        onClick={() => {
                          updateProductStock(product.id, 5);
                          showToast(`Added +5 stock to ${product.name}`);
                        }}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* ORDERS & REQUESTS SECTION */}
              <section className="dashboard-section" id="orders-section">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Direct Customer Orders</h2>
                    <p className="section-subtitle">Real-time orders received from the Customer Portal</p>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-[#8C827A] italic p-3">No pending customer orders.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {orders.map(order => (
                      <div key={order.id} className="p-3 bg-[#FAF8F5] border border-[#ECE7E1] rounded-lg flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-[#2C241E]">
                            Order #{order.id.slice(-4)} — {order.productName}
                          </div>
                          <div className="text-xs text-[#5C5248]">
                            Customer: {order.customerName} • Qty: {order.quantity} • Total: ₹{order.totalPrice.toLocaleString()}
                          </div>
                        </div>
                        <span className="badge-new-reg">{order.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* ARTISAN SOS */}
              <section className="dashboard-section sos-section" id="artisan-sos">
                <div className="section-header">
                  <div>
                    <h2 className="section-title">Need Support? (Artisan SOS)</h2>
                    <p className="section-subtitle">Report a challenge and connect with the state monitoring network.</p>
                  </div>
                  <button className="btn-primary" onClick={() => setSosModalOpen(true)}>
                    Create SOS Request
                  </button>
                </div>

                <div className="sos-categories">
                  {SOS_CATEGORIES.map(cat => (
                    <span
                      key={cat}
                      className={`sos-pill ${selectedSosCat === cat ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedSosCat(cat);
                        setSosModalOpen(true);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                {activeArtisanSos ? (
                  <div className="active-sos">
                    <h4 className="active-sos-title">Active Emergency: {activeArtisanSos.problem}</h4>
                    <p className="text-xs text-[#5C5248] mb-2">
                      Reported at {activeArtisanSos.timestamp} • Priority: {activeArtisanSos.urgency || 'High'}
                    </p>
                    <div className="sos-timeline">
                      <div className="timeline-step completed">Reported</div>
                      <div className={`timeline-step ${activeArtisanSos.status === 'Matched' || activeArtisanSos.status === 'In Progress' ? 'completed' : ''}`}>
                        Triage
                      </div>
                      <div className={`timeline-step ${activeArtisanSos.status === 'In Progress' ? 'active' : ''}`}>
                        Transit Dispatch
                      </div>
                      <div className="timeline-step">Resolved</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded text-xs font-semibold">
                    ✓ All workshop nodes operational. No open crisis tickets.
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="side-col">
              
              {/* MARKET MATCHER (EXPLAINABLE SCORING) */}
              <section className="dashboard-section market-matcher">
                <div className="section-header">
                  <h2 className="section-title">Live Market Matcher</h2>
                  <span className="live-indicator">LIVE</span>
                </div>
                <div className="match-list">
                  {liveMatches.map(match => (
                    <div key={match.id} className="match-card">
                      <div className="match-score">
                        <span className="score-value">{match.percentage}</span>
                        <span className="score-label">Match</span>
                      </div>
                      <div className="match-details">
                        <h4>{match.market}</h4>
                        <p>{match.demand}</p>
                        <div className="text-[10px] text-[#A75D28] mt-1 font-medium bg-[#FAF8F5] p-1 rounded">
                          {match.rationale}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* CRAFT PASSPORT */}
              <section className="dashboard-section passport-section" id="craft-passport">
                <h2 className="section-title">Craft Passport</h2>
                <div className="passport-card">
                  <div className="qr-placeholder">
                    <QrCode size={64} className="qr-icon" />
                  </div>
                  <div className="passport-details">
                    <h3>Meenakshi Ammal</h3>
                    <p className="tradition">Terracotta Pottery & Clay Kilns</p>
                    <p className="traceability">GI Certified • Musiri, Trichy</p>
                  </div>
                  <button
                    className="btn-outline w-full"
                    onClick={() => showToast('Craft Passport UID: GI-TN-TRICHY-2024-001')}
                  >
                    View Authenticity Certificate
                  </button>
                </div>
              </section>

              {/* RECENT ACTIVITY (LIVE REACTIVE LOGS) */}
              <section className="dashboard-section activity-section">
                <h2 className="section-title">Recent Activity Feed</h2>
                <div className="activity-list">
                  {activityLogs.slice(0, 5).map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-content">
                        <p className="activity-text">{activity.text}</p>
                        <span className="activity-time"><Clock size={12} /> {activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* SOS CREATION MODAL */}
      {sosModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setSosModalOpen(false)}>
          <div className="admin-modal-window" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-head">
              <div className="flex items-center gap-2">
                <LifeBuoy className="text-red-600" size={20} />
                <h3 className="admin-modal-title">Raise Emergency SOS Ticket</h3>
              </div>
              <button className="admin-modal-close" onClick={() => setSosModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitSos}>
              <div className="admin-modal-body">
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-[#2C241E] block mb-1">
                      Support Category
                    </label>
                    <select
                      value={selectedSosCat}
                      onChange={e => setSelectedSosCat(e.target.value)}
                      className="w-full border border-[#ECE7E1] rounded p-2 text-xs"
                    >
                      {SOS_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2C241E] block mb-1">
                      Describe your emergency / requirement
                    </label>
                    <textarea
                      rows={3}
                      value={sosProblemText}
                      onChange={e => setSosProblemText(e.target.value)}
                      placeholder="e.g. 30 Unsold Terracotta Lamps exposed to heavy rain; need transport van to Srirangam warehouse."
                      className="w-full border border-[#ECE7E1] rounded p-2 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-foot">
                <button type="button" className="table-action-btn" onClick={() => setSosModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="locality-pill-btn active"
                  style={{ backgroundColor: '#DC2626', borderColor: '#DC2626' }}
                >
                  <Send size={14} className="inline mr-1" />
                  Dispatch SOS to Command Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents
function NavItem({ icon, label, active = false, onClick = () => {} }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </button>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        {icon}
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
