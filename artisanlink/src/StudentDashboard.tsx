import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Compass, 
  History, 
  Briefcase, 
  Map as MapIcon, 
  User, 
  Settings, 
  Bell, 
  Search, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  X, 
  LogOut, 
  Award,
  AlertTriangle
} from 'lucide-react';
import './StudentDashboard.css';
import { useArtisanEcosystem } from './context/ArtisanContext';

interface StudentTask {
  id: number;
  title: string;
  description: string;
  target: string;
  location: string;
  status: 'Available' | 'In Progress' | 'Verified';
  effort: string;
}

const INITIAL_TASKS: StudentTask[] = [
  {
    id: 1,
    title: 'Verify Teak Deepam Spec & Dimensions',
    description: 'Review woodcraft height, base diameter, and temple export tolerance.',
    target: 'Hand-carved Teak Deepam Stand',
    location: 'Karumandapam, Trichy',
    status: 'Available',
    effort: '10 mins'
  },
  {
    id: 2,
    title: 'Review Woraiyur Handloom GI Geotag',
    description: 'Verify weaver guild membership, loom count, and natural madder dye authenticity.',
    target: 'Woraiyur Traditional Cotton Sari',
    location: 'Woraiyur, Trichy',
    status: 'Available',
    effort: '15 mins'
  },
  {
    id: 3,
    title: 'Inspect Riverbed Terracotta Kiln Runoff',
    description: 'Perform moisture reading and inspect monsoon tarpaulin shelter for unsold pottery.',
    target: 'Musiri Alluvial Clay Lamps',
    location: 'Musiri, Cauvery Basin',
    status: 'Available',
    effort: '20 mins'
  }
];

const CONTRIBUTIONS = [
  { id: 1, target: 'Karumandapam Teak Spec — Dimension Audit', status: 'Verified' },
  { id: 2, target: 'Srirangam Temple Bronzeware — Geotagged', status: 'Verified' },
  { id: 3, target: 'Woraiyur Weavers Guild — Invoice Ledger', status: 'Under Review' }
];

const CRAFTS = [
  {
    id: 1,
    name: 'Woraiyur Handloom',
    region: 'Trichy, Tamil Nadu',
    description: 'Centuries-old woven cotton sarees known for fine count and temple borders.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d615e1?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Cauvery Riverbed Terracotta',
    region: 'Musiri & Srirangam, Tamil Nadu',
    description: 'Hand-thrown earthenware using mineral-rich Cauvery silt.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Swamimalai & Trichy Bronze Icons',
    region: 'Cauvery Delta, Tamil Nadu',
    description: 'Lost-wax casting tradition dating back to the Imperial Chola era.',
    image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=400&q=80'
  }
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { sosTickets, opportunities, activityLogs, addLog, resolveSOS } = useArtisanEcosystem();

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [tasks, setTasks] = useState<StudentTask[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<StudentTask | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleNavClick = (tabName: string, id?: string) => {
    setActiveTab(tabName);
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleStartVerification = (task: StudentTask) => {
    setSelectedTask(task);
    setVerificationStatus('Pending');
  };

  const handleSubmitVerification = () => {
    setVerificationStatus('In Review');
    setTimeout(() => {
      setVerificationStatus('Verified');
      setTimeout(() => {
        if (selectedTask) {
          setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, status: 'Verified' } : t));
          addLog(`Student Facilitator Rahul Verma verified: ${selectedTask.title} (${selectedTask.location})`, 'action');
          showToast(`✓ Field verification logged for ${selectedTask.target}`);
        }
        setSelectedTask(null);
        setVerificationStatus(null);
      }, 1000);
    }, 1000);
  };

  const openSosTickets = sosTickets.filter(s => s.status !== 'Resolved');

  return (
    <div className="student-dashboard-container">
      {/* Toast */}
      {toastMsg && (
        <div className="admin-toast-float" style={{ zIndex: 9999 }}>
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="student-sidebar">
        <div className="sidebar-brand">ARTISANLINK</div>
        
        <nav className="sidebar-nav">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => handleNavClick('Dashboard', 'dashboard-top')} />
          <NavItem icon={<ClipboardCheck size={20} />} label="Verification Tasks" active={activeTab === 'Verification Tasks'} onClick={() => handleNavClick('Verification Tasks', 'verification-tasks')} />
          <NavItem icon={<Compass size={20} />} label="Explore Crafts" active={activeTab === 'Explore Crafts'} onClick={() => handleNavClick('Explore Crafts', 'explore-crafts')} />
          
          <div className="nav-divider"></div>
          
          <NavItem icon={<History size={20} />} label="My Contributions" active={activeTab === 'My Contributions'} onClick={() => handleNavClick('My Contributions', 'my-contributions')} />
          <NavItem icon={<Briefcase size={20} />} label="Opportunities" active={activeTab === 'Opportunities'} onClick={() => handleNavClick('Opportunities', 'opportunities')} />
          <NavItem icon={<MapIcon size={20} />} label="Craft Radar Map" active={activeTab === 'Map'} onClick={() => navigate('/dashboard/customer')} />
          
          <div className="nav-divider"></div>
          
          <NavItem icon={<User size={20} />} label="Profile" active={activeTab === 'Profile'} onClick={() => handleNavClick('Profile', 'dashboard-top')} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'Settings'} onClick={() => handleNavClick('Settings', 'dashboard-top')} />
          <NavItem icon={<LogOut size={20} />} label="Logout" onClick={() => navigate('/')} />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="student-main">
        {/* HEADER */}
        <header className="student-header">
          <div className="header-search">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search tasks, crafts, or student opportunities..." />
          </div>
          
          <div className="header-actions">
            <button className="notification-btn" onClick={() => showToast('NIT Trichy Student Chapter: 3 Tasks assigned.')}>
              <Bell size={20} />
              <span className="badge"></span>
            </button>
            <div className="profile-section">
              <div className="profile-info">
                <span className="welcome-text">Good evening,</span>
                <span className="student-name">
                  Rahul Verma <Award size={14} className="verified-icon text-accent" />
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-sm">
                RV
              </div>
            </div>
          </div>
        </header>

        {/* REGIONAL BANNER */}
        <div className="regional-banner">
          <span className="regional-title">📍 Trichy Craft Ecosystem • Cauvery Basin</span>
          <div className="regional-filters">
            <button className="filter-pill active">Srirangam</button>
            <button className="filter-pill">Woraiyur</button>
            <button className="filter-pill">Thillai Nagar</button>
            <button className="filter-pill">Tollgate</button>
            <button className="filter-pill">Musiri</button>
          </div>
        </div>

        {/* DASHBOARD CONTENT */}
        <div className="dashboard-scrollable-content" id="dashboard-top">
          
          {/* WELCOME / CONTRIBUTION AREA */}
          <section className="welcome-banner">
            <div className="banner-content">
              <h1>Help preserve and verify India's craft ecosystem.</h1>
              <p>Your field contributions help make artisan information and GI passports discoverable and trustworthy across the Cauvery Delta.</p>
              <button className="btn-primary banner-btn" onClick={() => handleNavClick('Verification Tasks', 'verification-tasks')}>
                View Field Verification Tasks
              </button>
            </div>
            <div className="banner-graphic">
              <ShieldCheck size={120} className="graphic-icon" />
            </div>
          </section>

          {/* IMPACT METRICS */}
          <section className="impact-grid">
            <StatCard label="Tasks Completed" value={(tasks.filter(t => t.status === 'Verified').length + 24).toString()} />
            <StatCard label="Products Verified" value="18" />
            <StatCard label="Crafts Documented" value="3" />
            <StatCard label="Artisans Supported" value="12" />
          </section>

          {/* ACTIVE SOS RESPONSES FOR STUDENTS */}
          {openSosTickets.length > 0 && (
            <section className="p-4 bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl mb-6">
              <div className="flex items-center gap-2 mb-2 text-[#C2410C]">
                <AlertTriangle size={18} />
                <h3 className="font-bold text-sm">Artisan Emergency SOS: Volunteers Needed</h3>
              </div>
              <div className="flex flex-col gap-2">
                {openSosTickets.map(ticket => (
                  <div key={ticket.id} className="p-3 bg-white rounded-lg border border-[#FDBA74] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-[#2C241E]">{ticket.problem}</div>
                      <div className="text-xs text-[#5C5248]">
                        Artisan: {ticket.artisanName} • {ticket.locality} • Priority: {ticket.urgency || 'High'}
                      </div>
                    </div>
                    <button
                      className="px-3 py-1 bg-[#EA580C] text-white rounded text-xs font-bold hover:bg-[#C2410C] transition-colors"
                      onClick={() => {
                        resolveSOS(ticket.id);
                        addLog(`Student Rahul Verma dispatched field aid for: ${ticket.problem}`, 'action');
                        showToast(`✓ Acknowledged SOS for ${ticket.artisanName}`);
                      }}
                    >
                      Acknowledge & Assist
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="dashboard-main-grid">
            {/* LEFT COLUMN */}
            <div className="main-col">
              
              {/* VERIFICATION TASKS */}
              <section className="dashboard-section" id="verification-tasks">
                <div className="section-header">
                  <h2 className="section-title">Field Verification Tasks</h2>
                  <span className="text-xs text-[#8C827A] font-semibold">{tasks.length} Assigned</span>
                </div>
                
                <div className="tasks-list">
                  {tasks.map(task => (
                    <div key={task.id} className="task-card">
                      <div className="task-header">
                        <span className={`status-badge ${task.status.toLowerCase()}`}>{task.status}</span>
                        <span className="task-effort"><Clock size={14} /> {task.effort}</span>
                      </div>
                      <h3 className="task-title">{task.title}</h3>
                      <p className="task-desc">{task.description}</p>
                      <div className="task-meta">
                        <span className="target-craft">{task.target}</span> • <span>{task.location}</span>
                      </div>
                      <button 
                        className="btn-primary w-full mt-3"
                        onClick={() => handleStartVerification(task)}
                        disabled={task.status === 'Verified'}
                      >
                        {task.status === 'Verified' ? '✓ Verification Complete' : 'Start Verification'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* MY CONTRIBUTIONS */}
              <section className="dashboard-section" id="my-contributions">
                <div className="section-header">
                  <h2 className="section-title">My Recent Verifications</h2>
                </div>
                
                <div className="contributions-list">
                  {CONTRIBUTIONS.map(contrib => (
                    <div key={contrib.id} className="contribution-item">
                      <div className="contrib-info">
                        <CheckCircle2 size={16} className="text-green" />
                        <span>{contrib.target}</span>
                      </div>
                      <div className="contrib-status">
                        <span className={`status-text ${contrib.status.toLowerCase().replace(' ', '-')}`}>
                          {contrib.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="side-col">
              
              {/* EXPLORE CRAFTS */}
              <section className="dashboard-section" id="explore-crafts">
                <div className="section-header">
                  <h2 className="section-title">Cauvery Delta Heritage</h2>
                </div>
                <div className="craft-cards">
                  {CRAFTS.map(craft => (
                    <div key={craft.id} className="craft-card">
                      <img src={craft.image} alt={craft.name} className="craft-image" />
                      <div className="craft-overlay">
                        <h4>{craft.name}</h4>
                        <p>{craft.region}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* OPPORTUNITIES */}
              <section className="dashboard-section" id="opportunities">
                <div className="section-header">
                  <h2 className="section-title">Ecosystem Opportunities</h2>
                </div>
                <div className="opportunities-list">
                  {opportunities.map(opp => (
                    <div key={opp.id} className="opportunity-card">
                      <h4>{opp.title}</h4>
                      <p className="opp-meta">Available Slots: {opp.availableSlots} • {opp.locality || 'Trichy'}</p>
                      <p className="text-xs text-[#5C5248] my-1">{opp.demandDesc}</p>
                      <button
                        className="btn-text"
                        onClick={() => showToast(`Applied for Facilitator Role: ${opp.title}`)}
                      >
                        Apply as Student Facilitator <ChevronRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* RECENT ACTIVITY */}
              <section className="dashboard-section activity-section">
                <h2 className="section-title">Live Network Feed</h2>
                <div className="activity-list">
                  {activityLogs.slice(0, 4).map(activity => (
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

      {/* VERIFICATION MODAL */}
      {selectedTask && (
        <div className="verification-modal-overlay">
          <div className="verification-modal">
            <div className="modal-header">
              <h3>Task Verification: {selectedTask.target}</h3>
              <button className="btn-close" onClick={() => setSelectedTask(null)}><X size={20} /></button>
            </div>
            
            <div className="modal-body">
              <p className="modal-desc">{selectedTask.description}</p>
              
              <div className="verify-checklist">
                <h4>Checklist to Verify:</h4>
                <label className="checklist-item">
                  <input type="checkbox" defaultChecked />
                  <span>Verify raw materials conform to Cauvery Basin GI specification</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" defaultChecked />
                  <span>Cross-reference artisan UID with State Handicrafts Board registry</span>
                </label>
                <label className="checklist-item">
                  <input type="checkbox" defaultChecked />
                  <span>Inspect photographic proof of workshop geotag</span>
                </label>
              </div>

              {/* Verification Progress Indicator */}
              <div className="verification-progress">
                <div className={`verify-step ${verificationStatus === 'Pending' || verificationStatus === 'In Review' || verificationStatus === 'Verified' ? 'active' : ''}`}>
                  1. Ready
                </div>
                <div className={`verify-step ${verificationStatus === 'In Review' || verificationStatus === 'Verified' ? 'active' : ''}`}>
                  2. Reviewing
                </div>
                <div className={`verify-step ${verificationStatus === 'Verified' ? 'active' : ''}`}>
                  3. Verified
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedTask(null)}>Cancel</button>
              <button 
                className="btn-primary" 
                onClick={handleSubmitVerification}
                disabled={verificationStatus === 'In Review' || verificationStatus === 'Verified'}
              >
                {verificationStatus === 'In Review' ? 'Verifying...' : verificationStatus === 'Verified' ? 'Approved!' : 'Approve & Submit'}
              </button>
            </div>
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

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="impact-card">
      <div className="impact-value">{value}</div>
      <div className="impact-label">{label}</div>
    </div>
  );
}
