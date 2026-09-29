import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Store,
  UserCheck,
  Package,
  ShoppingBag,
  MessageSquare,
  ClipboardList,
  Sparkles,
  Link as LinkIcon,
  AlertTriangle,
  Compass,
  ShieldCheck,
  TrendingUp,
  Settings,
  LogOut,
  Search,
  Bell,
  MapPin,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
  Waves,
  Building2
} from 'lucide-react';
import './AdminDashboard.css';
import { NODE_TYPE_CONFIG } from './trichyEcosystemData';
import type { EcosystemNode } from './trichyEcosystemData';
import CraftRadarMap from './CraftRadarMap';
import { useArtisanEcosystem, type SOSTicket, type Requirement } from './context/ArtisanContext';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const {
    nodes,
    products,
    requirements,
    opportunities,
    orders,
    enquiries,
    sosTickets,
    activityLogs,
    executeMatch,
    resolveSOS,
    addLog,
    stepOrderStatus,
    connectBuyer,
    closeEnquiry,
    allocateStall,
    calculateMatchScore
  } = useArtisanEcosystem();

  // Active View Tab State
  const [activeNav, setActiveNav] = useState<string>('Dashboard');

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Locality Filter Pill ('Srirangam' | 'Woraiyur' | 'Thillai Nagar' | 'Tollgate' | 'Musiri' | 'All')
  const [selectedLocality, setSelectedLocality] = useState<string>('Srirangam');

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Top 4 Stat Cards: Pure Computed Numbers
  const totalProductsCount = products.length;
  const availableProductsCount = products.filter(p => p.stock > 0).length;
  const pendingRequestsCount = requirements.filter(r => r.status === 'Open').length;
  const activeSOSCount = sosTickets.filter(s => s.status !== 'Resolved').length;

  // Active Inspecting Modal State
  const [modalTicket, setModalTicket] = useState<SOSTicket | null>(null);

  // Active Radar Selected Shop
  const [, setSelectedRadarNode] = useState<EcosystemNode | null>(null);

  // Localities list for pills (with "All" included)
  const localities = ['Srirangam', 'Woraiyur', 'Thillai Nagar', 'Tollgate', 'Musiri', 'All'];

  // =========================================================================
  // 2. DEDUPLICATE THE MATCHER GENERATOR (Set-based deduplication)
  // =========================================================================
  const activeMatches = useMemo(() => {
    const seenPairs = new Set<string>();
    return requirements
      .filter(r => r.status === 'Open')
      .flatMap(req =>
        opportunities.map(opp => {
          const pairKey = `${req.id}-${opp.id}`;
          if (seenPairs.has(pairKey)) return null;
          seenPairs.add(pairKey);

          const analysis = calculateMatchScore(req, opp);
          return {
            key: pairKey,
            requirementId: req.id,
            opportunityId: opp.id,
            title: opp.title,
            locality: opp.locality || 'Trichy',
            artisanName: req.artisanName,
            artisanLocality: req.locality || 'Trichy',
            demandDesc: opp.demandDesc,
            ...analysis
          };
        })
      )
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => b.score - a.score); // Highest percentage match first
  }, [requirements, opportunities, calculateMatchScore]);

  // =========================================================================
  // 1. CLUSTER MATCHING PREDICATE
  // =========================================================================
  const filteredMatches = useMemo(() => {
    return activeMatches.filter(match => {
      if (selectedLocality === 'All') return true;
      const needle = selectedLocality.toLowerCase();
      return (
        (match.locality && match.locality.toLowerCase().includes(needle)) ||
        (match.artisanLocality && match.artisanLocality.toLowerCase().includes(needle))
      );
    });
  }, [activeMatches, selectedLocality]);

  // Filtered Opportunities on Markets view
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      if (selectedLocality === 'All') return true;
      const needle = selectedLocality.toLowerCase();
      return opp.locality && opp.locality.toLowerCase().includes(needle);
    });
  }, [opportunities, selectedLocality]);

  // Open Attention Tickets
  const openAttentionTickets = useMemo(() => {
    let tickets = sosTickets.filter(s => s.status !== 'Resolved');
    if (selectedLocality !== 'All') {
      tickets = tickets.filter(
        t => t.locality === selectedLocality || (selectedLocality === 'Woraiyur' && t.locality === 'Karumandapam')
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      tickets = tickets.filter(
        t =>
          t.problem.toLowerCase().includes(q) ||
          t.artisanName.toLowerCase().includes(q) ||
          t.craft.toLowerCase().includes(q)
      );
    }
    return tickets;
  }, [sosTickets, selectedLocality, searchQuery]);

  // Resolve Attention Item Handler
  const handleResolveAttention = (ticket: SOSTicket, actionDesc?: string) => {
    resolveSOS(ticket.id);
    if (actionDesc) {
      addLog(`Admin resolved: ${actionDesc} (${ticket.problem})`, 'action');
    }
    setModalTicket(null);
    showToast(`✓ Resolved: ${ticket.problem} — Live metrics updated`);
  };

  // Match Action Handler
  const handleMatchAction = (requirementId: string, opportunityId: string, oppTitle: string) => {
    executeMatch(requirementId, opportunityId);
    showToast(`✓ Auto-Assign Confirmed: "${oppTitle}" successfully allocated.`);
  };

  // Trigger Auto-Match from Requirements ledger
  const handleTriggerAutoMatch = (req: Requirement) => {
    const bestMatch = activeMatches.find(m => m.requirementId === req.id);
    if (bestMatch) {
      executeMatch(bestMatch.requirementId, bestMatch.opportunityId);
      showToast(`✓ Auto-Matched ${req.artisanName} to ${bestMatch.title} (${bestMatch.percentage})`);
    } else {
      showToast(`No high-confidence match found for ${req.title}. Broaden search criteria.`);
    }
  };

  // Broadcast Advisory Handler
  const handleBroadcastAdvisory = () => {
    addLog('Flood Advisory Broadcast sent to 38 Cauvery riverbed kilns (Musiri & Srirangam).', 'sos');
    showToast('📢 Cauvery Basin kiln safety advisory SMS broadcasted.');
  };

  // Review All Action
  const handleReviewAll = () => {
    if (openAttentionTickets.length === 0) {
      showToast('Attention queue is already clear.');
      return;
    }
    const count = openAttentionTickets.length;
    openAttentionTickets.forEach(t => resolveSOS(t.id));
    addLog(`Batch review completed: cleared ${count} operational attention items.`, 'action');
    showToast(`✓ Cleared all ${count} attention items. All nodes operational.`);
  };

  // Render Empty Cluster Fallback
  const renderEmptyClusterFallback = (clusterName: string) => (
    <div className="text-center py-12 bg-white rounded-2xl border border-[#ECE7E1] p-6 space-y-3">
      <p className="text-sm font-semibold text-[#1C1917]">No active allocations in {clusterName}</p>
      <p className="text-xs text-[#7A6E63]">
        There are no open requirements or festival stalls flagged in this area right now.
      </p>
      <button
        onClick={() => setSelectedLocality('All')}
        className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#FAF8F5] border border-[#A75D28] text-[#A75D28] hover:bg-[#F7EFE9] transition-colors"
      >
        Show All Clusters
      </button>
    </div>
  );

  return (
    <div className="admin-shell-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast-float" role="status">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white ml-2"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ====================================================================
          2. LEFT SIDEBAR NAVIGATION
          w-64 bg-white border-r border-[#ECE7E1] flex flex-col justify-between p-5 z-40
          ==================================================================== */}
      <aside className="admin-sidebar-rail" aria-label="Operational Navigation">
        {/* Brand Header */}
        <div 
          className="admin-brand-header" 
          onClick={() => setActiveNav('Dashboard')}
          title="Return to Main Dashboard"
        >
          <div className="admin-brand-monogram">AL</div>
          <div className="admin-brand-text">
            <h1 className="admin-brand-title">ARTISANLINK</h1>
            <span className="admin-brand-sub">Command & Ecosystem Layer</span>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="admin-sidebar-scroll">
          {/* Main Dashboard Link */}
          <button
            className={`admin-nav-btn ${activeNav === 'Dashboard' ? 'active' : ''}`}
            onClick={() => setActiveNav('Dashboard')}
          >
            <LayoutDashboard size={18} className="admin-nav-icon" />
            <span className="admin-nav-label">Dashboard</span>
          </button>

          {/* Group 1: NETWORK */}
          <div className="admin-nav-group">
            <span className="admin-group-label">NETWORK</span>
            <button
              className={`admin-nav-btn ${activeNav === 'Artisans' ? 'active' : ''}`}
              onClick={() => setActiveNav('Artisans')}
            >
              <Users size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Artisans</span>
              <span className="admin-count-badge">{nodes.length}</span>
            </button>
            <button
              className={`admin-nav-btn ${activeNav === 'Students' ? 'active' : ''}`}
              onClick={() => setActiveNav('Students')}
            >
              <GraduationCap size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Students</span>
            </button>
            <button
              className={`admin-nav-btn ${activeNav === 'Markets' ? 'active' : ''}`}
              onClick={() => setActiveNav('Markets')}
            >
              <Store size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Markets</span>
              <span className="admin-count-badge">{opportunities.length}</span>
            </button>
            <button
              className={`admin-nav-btn ${activeNav === 'Customers' ? 'active' : ''}`}
              onClick={() => setActiveNav('Customers')}
            >
              <UserCheck size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Customers</span>
            </button>
          </div>

          {/* Group 2: COMMERCE */}
          <div className="admin-nav-group">
            <span className="admin-group-label">COMMERCE</span>
            <button
              className={`admin-nav-btn ${activeNav === 'Products' ? 'active' : ''}`}
              onClick={() => setActiveNav('Products')}
            >
              <Package size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Products</span>
              <span className="admin-count-badge">{totalProductsCount}</span>
            </button>
            <button
              className={`admin-nav-btn ${activeNav === 'Orders' ? 'active' : ''}`}
              onClick={() => setActiveNav('Orders')}
            >
              <ShoppingBag size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Orders & Requests</span>
              <span className="admin-count-badge">{orders.length}</span>
            </button>
            <button
              className={`admin-nav-btn ${activeNav === 'Enquiries' ? 'active' : ''}`}
              onClick={() => setActiveNav('Enquiries')}
            >
              <MessageSquare size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Enquiries</span>
              <span className="admin-count-badge">{enquiries.length}</span>
            </button>
          </div>

          {/* Group 3: MATCHING */}
          <div className="admin-nav-group">
            <span className="admin-group-label">MATCHING</span>
            <button
              className={`admin-nav-btn ${activeNav === 'Requirements' ? 'active' : ''}`}
              onClick={() => setActiveNav('Requirements')}
            >
              <ClipboardList size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Requirements</span>
              <span className="admin-count-badge">{pendingRequestsCount}</span>
            </button>
            <button
              className={`admin-nav-btn ${activeNav === 'Opportunities' ? 'active' : ''}`}
              onClick={() => setActiveNav('Opportunities')}
            >
              <Sparkles size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Opportunities</span>
              <span className="admin-count-badge">{opportunities.length}</span>
            </button>
            <button
              className={`admin-nav-btn ${activeNav === 'Live Matches' ? 'active' : ''}`}
              onClick={() => setActiveNav('Live Matches')}
            >
              <LinkIcon size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Live Matches</span>
              <span className="admin-count-badge badge-emerald">{activeMatches.length}</span>
            </button>
          </div>

          {/* Group 4: MONITORING */}
          <div className="admin-nav-group">
            <span className="admin-group-label">MONITORING</span>
            <button
              className={`admin-nav-btn ${activeNav === 'Artisan SOS' ? 'active' : ''}`}
              onClick={() => setActiveNav('Artisan SOS')}
            >
              <AlertTriangle size={17} className="admin-nav-icon text-red-600" />
              <span className="admin-nav-label">Artisan SOS</span>
              <span className="admin-count-badge badge-sos">{activeSOSCount}</span>
            </button>
            <button
              className={`admin-nav-btn ${activeNav === 'Craft Radar' ? 'active' : ''}`}
              onClick={() => setActiveNav('Craft Radar')}
            >
              <Compass size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Craft Radar</span>
              <span className="admin-radar-dot" title="Live Geo-tracking active" />
            </button>
            <button
              className={`admin-nav-btn ${activeNav === 'Verification' ? 'active' : ''}`}
              onClick={() => setActiveNav('Verification')}
            >
              <ShieldCheck size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Verification Queue</span>
            </button>
            <button
              className={`admin-nav-btn ${activeNav === 'Impact' ? 'active' : ''}`}
              onClick={() => setActiveNav('Impact')}
            >
              <TrendingUp size={17} className="admin-nav-icon" />
              <span className="admin-nav-label">Impact</span>
            </button>
          </div>
        </nav>

        {/* Bottom Group (Separated) */}
        <div className="admin-sidebar-bottom">
          <button
            className={`admin-bottom-btn ${activeNav === 'Settings' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('Settings');
              showToast('System preferences & cluster thresholds: All systems nominal.');
            }}
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button
            className="admin-bottom-btn logout"
            onClick={() => navigate('/')}
            title="End Admin Session"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ====================================================================
          3. MAIN CANVAS & TOP APP BAR
          ==================================================================== */}
      <main className="admin-main-canvas">
        {/* Top App Bar */}
        <header className="admin-top-appbar">
          {/* Search Input (Left) */}
          <div className="admin-search-pill-wrapper">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search products, orders, or support..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
            {searchQuery && (
              <button
                className="admin-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear Search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* User Capsule (Right) */}
          <div className="admin-header-actions">
            <button
              className="admin-bell-btn"
              onClick={() => showToast(`Notifications: ${activeSOSCount} Active SOS, ${activeMatches.length} Match Proposals.`)}
              title="Notifications"
            >
              <Bell size={18} />
              {activeSOSCount > 0 && <span className="admin-bell-dot" />}
            </button>

            <div className="admin-user-capsule">
              <div className="admin-user-text">
                <span className="admin-user-welcome">Welcome back,</span>
                <span className="admin-user-name">
                  Kavya Sharma <span className="admin-medal-icon">🎖</span>
                </span>
              </div>
              <div className="admin-user-avatar" title="Kavya Sharma (Chief Operations Coordinator)">
                KS
              </div>
            </div>
          </div>
        </header>

        {/* Content Router */}
        <div className="admin-canvas-scroll">
          {/* Locality Filter & Breadcrumb Bar */}
          <div className="admin-locality-strip">
            <div className="admin-breadcrumb-pin">
              <MapPin size={17} className="admin-pin-icon" />
              <span>Trichy Craft Ecosystem • Cauvery Basin</span>
            </div>

            <div className="admin-locality-pills">
              {localities.map((loc) => (
                <button
                  key={loc}
                  className={`locality-pill-btn ${selectedLocality === loc ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedLocality(loc);
                    showToast(`Filtered console to: ${loc} cluster`);
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* ============================================================
              VIEW: DASHBOARD (MAIN OPERATIONAL CONSOLE)
              ============================================================ */}
          {activeNav === 'Dashboard' && (
            <>
              {/* 4-COLUMN STAT BAR (PURE COMPUTED FROM REACTIVE STORE) */}
              <section className="admin-stats-grid" aria-label="Ecosystem Metrics">
                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Total Products</span>
                    <div className="admin-stat-icon-wrap icon-brown">
                      <Package size={17} />
                    </div>
                  </div>
                  <div className="admin-stat-numeral">{totalProductsCount}</div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Available Products</span>
                    <div className="admin-stat-icon-wrap icon-green">
                      <Check size={17} />
                    </div>
                  </div>
                  <div className="admin-stat-numeral">{availableProductsCount}</div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Pending Requests</span>
                    <div className="admin-stat-icon-wrap icon-brown">
                      <ShoppingBag size={17} />
                    </div>
                  </div>
                  <div className="admin-stat-numeral">{pendingRequestsCount}</div>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Active SOS Requests</span>
                    <div className="admin-stat-icon-wrap icon-orange">
                      <AlertCircle size={17} />
                    </div>
                  </div>
                  <div className="admin-stat-numeral">{activeSOSCount}</div>
                </div>
              </section>

              {/* SPLIT WORKSPACE GRID (~65% Left Column, ~35% Right Column) */}
              <div className="admin-workspace-split">
                {/* LEFT COLUMN: Requires Attention & Network Stream */}
                <div className="admin-split-left">
                  {/* Requires Attention Section */}
                  <div className="admin-section-box">
                    <div className="admin-section-header-row">
                      <div>
                        <h2 className="admin-section-title-editorial">Requires Attention</h2>
                        <p className="admin-section-subtext">
                          Open tickets awaiting state board review, verification, or crisis resolution
                        </p>
                      </div>
                      <button
                        className="admin-btn-review-all"
                        onClick={handleReviewAll}
                        title="Batch approve and resolve current attention items"
                      >
                        Review All
                      </button>
                    </div>

                    {/* Attention Cards Stack */}
                    <div className="admin-attention-stack">
                      {openAttentionTickets.length === 0 ? (
                        <div className="admin-empty-queue-note">
                          ✨ All attention items for {selectedLocality} cluster have been reviewed and resolved!
                        </div>
                      ) : (
                        openAttentionTickets.map((ticket) => {
                          const initial = ticket.artisanName ? ticket.artisanName.charAt(0) : 'A';
                          const isSOS = ticket.urgency === 'High' || (ticket.quantity && Number(ticket.quantity) >= 30);
                          const isReg = ticket.problem.toLowerCase().includes('verification') || ticket.problem.toLowerCase().includes('uid');
                          const badgeText = isSOS ? 'CRISIS SOS' : isReg ? 'NEW REGISTRATION' : 'DIMENSION CHECK';
                          const badgeClass = isSOS ? 'badge-crisis-sos' : isReg ? 'badge-new-reg' : 'badge-dim-check';
                          const actionLabel = isSOS ? 'Dispatch Support' : isReg ? 'Review Profile' : 'Inspect Spec';

                          return (
                            <div key={ticket.id} className="admin-item-card">
                              <div className="admin-item-avatar-initial">
                                {initial}
                              </div>
                              <div className="admin-item-info">
                                <div className="admin-item-title-line">
                                  <h3 className="admin-item-title">{ticket.problem}</h3>
                                  <span className={badgeClass}>{badgeText}</span>
                                </div>
                                <p className="admin-item-sub">
                                  Artisan: {ticket.artisanName} • {ticket.craft} • {ticket.locality || 'Musiri'}
                                </p>
                              </div>

                              <div className="admin-item-action-group">
                                <button
                                  className={`admin-btn-action-pill ${isSOS ? 'btn-sos-dispatch' : ''}`}
                                  onClick={() => setModalTicket(ticket)}
                                >
                                  {actionLabel}
                                </button>
                                <ChevronRight size={18} className="admin-chevron-icon" />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Live Network Pulse Feed */}
                  <div className="admin-pulse-box">
                    <div className="admin-pulse-header">
                      <div className="admin-pulse-title-wrap">
                        <span className="admin-pulse-beacon" />
                        <h3 className="admin-pulse-title">Live Network Pulse</h3>
                      </div>
                      <span className="admin-pulse-sub">Auto-syncing Cauvery Delta</span>
                    </div>

                    <div className="admin-pulse-timeline">
                      {activityLogs.map((log) => (
                        <div key={log.id} className="admin-pulse-entry">
                          <span className="admin-pulse-time">{log.time}</span>
                          <span className="admin-pulse-desc">{log.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Live Market Matcher (Deterministic Engine) */}
                <div className="admin-split-right">
                  <div className="admin-matcher-box">
                    <div className="admin-matcher-head">
                      <h3 className="admin-matcher-title">Live Market Matcher</h3>
                      <span className="admin-live-tag">
                        <span className="live-blink-dot" /> LIVE
                      </span>
                    </div>

                    <div className="admin-matcher-cards">
                      {filteredMatches.length === 0 ? (
                        renderEmptyClusterFallback(selectedLocality)
                      ) : (
                        filteredMatches.map((m) => (
                          <div key={m.key} className="admin-match-card">
                            <div className="admin-match-card-top">
                              <div className="admin-match-card-titles">
                                <h4 className="admin-match-title">{m.title}</h4>
                                <div className="text-xs font-semibold text-[#A75D28] mt-0.5">
                                  Artisan: {m.artisanName} ({m.artisanLocality})
                                </div>
                                <p className="admin-match-desc mt-1">{m.demandDesc}</p>
                                <div className="admin-match-rationale-tag">
                                  {m.rationale}
                                </div>
                              </div>
                              <span className="admin-match-score-badge">
                                {m.percentage} MATCH
                              </span>
                            </div>

                            <button
                              className="admin-btn-match-action"
                              onClick={() => handleMatchAction(m.requirementId, m.opportunityId, m.title)}
                            >
                              Auto-Assign Artisan
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Cauvery Flood Watch / Environmental Alert Box */}
                  <div className="admin-flood-watch-card">
                    <div className="admin-flood-watch-head">
                      <Waves size={18} />
                      <span>Cauvery Basin Alert: Mettur Outflow Watch</span>
                    </div>
                    <p className="admin-flood-watch-text">
                      Cauvery discharge at Upper Anicut recorded at 24,000 cusecs. Riverbed pottery kilns in Musiri & Srirangam have been placed on elevated moisture advisory.
                    </p>
                    <button
                      className="admin-btn-advisory"
                      onClick={handleBroadcastAdvisory}
                    >
                      Broadcast Kiln Advisory SMS
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ============================================================
              VIEW: ORDERS & REQUESTS (A)
              ============================================================ */}
          {activeNav === 'Orders' && (
            <div className="admin-view-table-wrapper">
              <div className="admin-table-head-bar">
                <div>
                  <h2 className="admin-table-title">Orders & Bespoke Requests</h2>
                  <p className="admin-table-sub">
                    Direct-to-artisan commerce orders, fulfillment tracking, and custom commission requests
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8C827A] font-semibold">
                    {orders.length} Active Orders
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Order ID & Item</th>
                      <th>Customer</th>
                      <th>Artisan Node</th>
                      <th>Total Value</th>
                      <th>Fulfillment</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const statusClass = order.status.toLowerCase();
                      return (
                        <tr key={order.id}>
                          <td>
                            <div className="font-bold text-[#2C241E]">{order.productName}</div>
                            <div className="text-xs text-[#8C827A]">#{order.id.slice(-6)} • {order.timestamp}</div>
                          </td>
                          <td>
                            <div className="font-semibold">{order.customerName}</div>
                            <div className="text-xs text-[#8C827A]">{order.address || 'Local Pickup'}</div>
                          </td>
                          <td>
                            <span className="font-medium text-[#A75D28]">{order.shopName}</span>
                          </td>
                          <td>
                            <span className="font-bold text-[#7C2D12]">₹{order.totalPrice.toLocaleString()}</span>
                            <span className="text-xs text-[#8C827A]"> (x{order.quantity})</span>
                          </td>
                          <td>
                            <span className="table-node-pill bg-[#F7EFE9] text-[#7C2D12] capitalize">
                              {order.fulfillmentType || 'delivery'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-pill-step ${statusClass}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="table-action-btn"
                              onClick={() => {
                                stepOrderStatus(order.id);
                                showToast(`Stepped status for Order #${order.id.slice(-4)}`);
                              }}
                              disabled={order.status === 'Completed'}
                            >
                              {order.status === 'Completed' ? '✓ Completed' : 'Step Status →'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              VIEW: ENQUIRIES (B)
              ============================================================ */}
          {activeNav === 'Enquiries' && (
            <div className="admin-view-table-wrapper">
              <div className="admin-table-head-bar">
                <div>
                  <h2 className="admin-table-title">B2B, Wholesale & Export Enquiries</h2>
                  <p className="admin-table-sub">
                    Direct wholesale and institutional bulk procurement requests connecting to artisan clusters
                  </p>
                </div>
                <button
                  className="locality-pill-btn active"
                  onClick={() => showToast('New B2B Lead Form ready')}
                >
                  + Log External Lead
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Enquiry Item & Specs</th>
                      <th>Institutional Buyer</th>
                      <th>Target Artisan Cluster</th>
                      <th>Volume</th>
                      <th>Est. Deal Value</th>
                      <th>Pipeline Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq) => (
                      <tr key={enq.id}>
                        <td>
                          <div className="font-bold text-[#2C241E]">{enq.title}</div>
                          <div className="text-xs text-[#8C827A]">Received: {enq.date}</div>
                        </td>
                        <td>
                          <div className="font-semibold text-[#1C1917] flex items-center gap-1">
                            <Building2 size={13} className="text-[#A75D28]" />
                            {enq.buyer}
                          </div>
                        </td>
                        <td>
                          <span className="font-medium text-[#7C2D12]">{enq.artisanCluster}</span>
                        </td>
                        <td>{enq.quantity}</td>
                        <td className="font-bold text-[#10B981]">{enq.value}</td>
                        <td>
                          <span
                            className="table-node-pill"
                            style={{
                              backgroundColor:
                                enq.status === 'Connected'
                                  ? '#ECFDF5'
                                  : enq.status === 'Closed'
                                  ? '#F3F4F6'
                                  : '#FEF3C7',
                              color:
                                enq.status === 'Connected'
                                  ? '#059669'
                                  : enq.status === 'Closed'
                                  ? '#6B7280'
                                  : '#92400E'
                            }}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {enq.status !== 'Connected' && enq.status !== 'Closed' && (
                              <button
                                className="table-action-btn"
                                onClick={() => {
                                  connectBuyer(enq.id);
                                  showToast(`Connected ${enq.buyer} with artisan lead.`);
                                }}
                              >
                                Connect Buyer
                              </button>
                            )}
                            {enq.status !== 'Closed' && (
                              <button
                                className="table-action-btn"
                                style={{ backgroundColor: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA' }}
                                onClick={() => {
                                  closeEnquiry(enq.id);
                                  showToast(`Enquiry #${enq.id.slice(-4)} marked closed.`);
                                }}
                              >
                                Mark Closed
                              </button>
                            )}
                            {enq.status === 'Closed' && (
                              <span className="text-xs text-[#8C827A] italic">Archived</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              VIEW: REQUIREMENTS (C)
              ============================================================ */}
          {activeNav === 'Requirements' && (
            <div className="admin-view-table-wrapper">
              <div className="admin-table-head-bar">
                <div>
                  <h2 className="admin-table-title">Artisan Support & Procurement Requirements</h2>
                  <p className="admin-table-sub">
                    Raw material shortages, festival stall requests, and logistics runs flagged across the network
                  </p>
                </div>
                <button
                  className="locality-pill-btn active"
                  onClick={() => showToast('New requirement submission dialog ready')}
                >
                  + Add Artisan Requirement
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Artisan Lead</th>
                      <th>Cluster / Locality</th>
                      <th>Requirement Description</th>
                      <th>Type</th>
                      <th>Volume / Quantity</th>
                      <th>Logged Date</th>
                      <th>Status</th>
                      <th>Matching Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requirements.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <div className="font-bold text-[#2C241E]">{req.artisanName}</div>
                          <div className="text-xs text-[#8C827A]">Craft: {req.craft}</div>
                        </td>
                        <td>{req.locality}</td>
                        <td>
                          <span className="font-semibold">{req.title}</span>
                        </td>
                        <td>
                          <span className="table-node-pill bg-[#FAF5F0] text-[#7C2D12]">
                            {req.type || 'Logistics'}
                          </span>
                        </td>
                        <td className="font-bold text-[#A75D28]">{req.quantity}</td>
                        <td className="text-xs text-[#8C827A]">{req.date || '29 Sep'}</td>
                        <td>
                          <span
                            className="table-node-pill"
                            style={{
                              backgroundColor: req.status === 'Matched' ? '#ECFDF5' : '#FEF3C7',
                              color: req.status === 'Matched' ? '#047857' : '#92400E'
                            }}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td>
                          {req.status === 'Open' ? (
                            <button
                              className="table-action-btn"
                              onClick={() => handleTriggerAutoMatch(req)}
                            >
                              Trigger Auto-Match
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-700 font-semibold">✓ Matched</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              VIEW: OPPORTUNITIES (D)
              ============================================================ */}
          {activeNav === 'Opportunities' && (
            <div className="admin-view-table-wrapper">
              <div className="admin-table-head-bar">
                <div>
                  <h2 className="admin-table-title">Opportunities & Capacity Allocation</h2>
                  <p className="admin-table-sub">
                    Live capacity management across festival pavilions, regional fairs, and institutional contracts
                  </p>
                </div>
                <button
                  className="locality-pill-btn active"
                  onClick={() => showToast('New Opportunity Creator opened')}
                >
                  + Create Opportunity
                </button>
              </div>

              <div className="admin-sos-kanban">
                {opportunities.map((opp) => {
                  const occupied = opp.totalCapacity - opp.availableSlots;
                  const percentFilled = Math.min(100, Math.round((occupied / opp.totalCapacity) * 100));

                  return (
                    <div key={opp.id} className="admin-kanban-card" style={{ padding: '1.25rem' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#7C2D12] uppercase tracking-wide">
                          {opp.craftFocus || opp.category}
                        </span>
                        <span className="table-node-pill bg-[#FAF5F0] text-[#7C2D12]">
                          {opp.locality}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-base text-[#2C241E] my-1">{opp.title}</h4>
                      <p className="text-xs text-[#5C5248] mb-2">{opp.demandDesc}</p>

                      {/* Capacity Bar: occupiedSlots / totalCapacity */}
                      <div className="admin-capacity-wrap">
                        <div className="admin-capacity-label">
                          <span>Capacity: {occupied} / {opp.totalCapacity} Slots Allocated</span>
                          <span>{percentFilled}%</span>
                        </div>
                        <div className="admin-capacity-bar-track">
                          <div
                            className="admin-capacity-bar-fill"
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-[#8C827A] mt-0.5">
                          {opp.availableSlots} open slots available
                        </div>
                      </div>

                      <button
                        className="admin-btn-match-action mt-2"
                        onClick={() => {
                          allocateStall(opp.id);
                          showToast(`Stall allocated at ${opp.title}!`);
                        }}
                        disabled={opp.availableSlots <= 0}
                      >
                        {opp.availableSlots > 0 ? '+ Allocate Stall' : 'Full Capacity'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================
              VIEW: MARKETS (FILTERED WITH EMPTY FALLBACK)
              ============================================================ */}
          {activeNav === 'Markets' && (
            <div className="admin-view-table-wrapper">
              <div className="admin-table-head-bar">
                <div>
                  <h2 className="admin-table-title">Cauvery Market Allocations ({selectedLocality})</h2>
                  <p className="admin-table-sub">
                    Direct festival stall grants, bulk procurement pipelines, and exhibition logistics
                  </p>
                </div>
              </div>

              {filteredOpportunities.length === 0 ? (
                renderEmptyClusterFallback(selectedLocality)
              ) : (
                <div className="admin-sos-kanban">
                  {filteredOpportunities.map((opp) => {
                    const occupied = opp.totalCapacity - opp.availableSlots;
                    const percentFilled = Math.min(100, Math.round((occupied / opp.totalCapacity) * 100));

                    return (
                      <div key={opp.id} className="admin-kanban-card" style={{ padding: '1.25rem' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-[#8C827A]">{opp.locality}</span>
                          <span className="badge-new-reg">{opp.availableSlots} Open</span>
                        </div>
                        <h4 className="font-bold text-base text-[#2C241E]">{opp.title}</h4>
                        <p className="text-xs text-[#5C5248] my-2">{opp.demandDesc}</p>
                        
                        <div className="admin-capacity-wrap">
                          <div className="admin-capacity-label">
                            <span>Filled: {occupied} / {opp.totalCapacity}</span>
                            <span>{percentFilled}%</span>
                          </div>
                          <div className="admin-capacity-bar-track">
                            <div className="admin-capacity-bar-fill" style={{ width: `${percentFilled}%` }} />
                          </div>
                        </div>

                        <button
                          className="admin-btn-match-action mt-3"
                          onClick={() => {
                            allocateStall(opp.id);
                            showToast(`Stall allocated at ${opp.title}`);
                          }}
                          disabled={opp.availableSlots <= 0}
                        >
                          + Allocate Stall
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              VIEW: LIVE MATCHES (DEDUPLICATED & EXPLAINABLE FORMULA)
              ============================================================ */}
          {activeNav === 'Live Matches' && (
            <div className="admin-view-table-wrapper">
              <div className="admin-table-head-bar">
                <div>
                  <h2 className="admin-table-title">Deterministic Match Engine Stream</h2>
                  <p className="admin-table-sub">
                    Multi-factor scoring: Category Fit (Max 40pts) + Proximity Fit (Max 35pts) + Capacity Fit (Max 25pts)
                  </p>
                </div>
                <span className="badge-new-reg font-bold">{filteredMatches.length} Matches Found</span>
              </div>

              {filteredMatches.length === 0 ? (
                renderEmptyClusterFallback(selectedLocality)
              ) : (
                <div className="admin-sos-kanban">
                  {filteredMatches.map((m) => (
                    <div key={m.key} className="admin-kanban-card" style={{ padding: '1.25rem' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="admin-match-score-badge">{m.percentage} MATCH</span>
                        <span className="text-xs font-semibold text-[#8C827A]">{m.locality}</span>
                      </div>
                      <h4 className="font-bold text-base text-[#2C241E]">{m.title}</h4>
                      <p className="text-xs font-semibold text-[#A75D28]">
                        Artisan: {m.artisanName} ({m.artisanLocality})
                      </p>
                      <p className="text-xs text-[#5C5248] my-2">{m.demandDesc}</p>
                      <div className="admin-match-rationale-tag">
                        {m.rationale}
                      </div>
                      <button
                        className="admin-btn-match-action mt-3"
                        onClick={() => handleMatchAction(m.requirementId, m.opportunityId, m.title)}
                      >
                        Auto-Assign Artisan
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================
              VIEW: CUSTOMERS LEDGER
              ============================================================ */}
          {activeNav === 'Customers' && (
            <div className="admin-view-table-wrapper">
              <div className="admin-table-head-bar">
                <div>
                  <h2 className="admin-table-title">Verified Customer & Buyer Accounts</h2>
                  <p className="admin-table-sub">
                    Direct retail buyers, custom commission clients, and registered craft patrons
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Primary Address / Locality</th>
                      <th>Total Orders</th>
                      <th>Preferred Craft</th>
                      <th>Patron Tier</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="font-bold text-[#2C241E]">Arun V.</div>
                        <div className="text-xs text-[#8C827A]">arun.v@chennaimail.com</div>
                      </td>
                      <td>12 K.K. Nagar West, Trichy</td>
                      <td className="font-bold text-[#7C2D12]">3 Orders</td>
                      <td>Woraiyur Handloom Silk</td>
                      <td><span className="table-node-pill bg-[#FEF3C7] text-[#92400E]">Gold Patron</span></td>
                      <td>
                        <button className="table-action-btn" onClick={() => showToast('Buyer Profile loaded for Arun V.')}>
                          View History
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="font-bold text-[#2C241E]">Priya R.</div>
                        <div className="text-xs text-[#8C827A]">priya.r@cauverytrust.org</div>
                      </td>
                      <td>Main Bazaar, Puthur, Trichy</td>
                      <td className="font-bold text-[#7C2D12]">2 Orders</td>
                      <td>Terracotta Pottery</td>
                      <td><span className="table-node-pill bg-[#ECFDF5] text-[#047857]">Verified Patron</span></td>
                      <td>
                        <button className="table-action-btn" onClick={() => showToast('Buyer Profile loaded for Priya R.')}>
                          View History
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="font-bold text-[#2C241E]">Sriram K.</div>
                        <div className="text-xs text-[#8C827A]">sriram.k@rockfortheritage.com</div>
                      </td>
                      <td>45 Convent Road, Melapudur, Trichy</td>
                      <td className="font-bold text-[#7C2D12]">1 Order</td>
                      <td>Chola Bronze Sculptures</td>
                      <td><span className="table-node-pill bg-[#F7EFE9] text-[#7C2D12]">Heritage Collector</span></td>
                      <td>
                        <button className="table-action-btn" onClick={() => showToast('Buyer Profile loaded for Sriram K.')}>
                          View History
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="font-bold text-[#2C241E]">Ananya Krishnan</div>
                        <div className="text-xs text-[#8C827A]">ananya.k@designcauvery.in</div>
                      </td>
                      <td>North Devi Street, Srirangam, Trichy</td>
                      <td className="font-bold text-[#7C2D12]">1 Custom Commission</td>
                      <td>Natural Dye Textiles</td>
                      <td><span className="table-node-pill bg-[#EFF6FF] text-[#1D4ED8]">Bespoke Client</span></td>
                      <td>
                        <button className="table-action-btn" onClick={() => showToast('Commission Specs loaded for Ananya Krishnan.')}>
                          View Spec
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              VIEW: ARTISANS DIRECTORY TABLE
              ============================================================ */}
          {activeNav === 'Artisans' && (
            <div className="admin-view-table-wrapper">
              <div className="admin-table-head-bar">
                <div>
                  <h2 className="admin-table-title">Artisan & Cooperative Registry</h2>
                  <p className="admin-table-sub">
                    Direct access to all 23 verified artisan clusters across Tiruchirappalli and the Cauvery basin
                  </p>
                </div>
                <button
                  className="locality-pill-btn active"
                  onClick={() => showToast('Artisan Onboarding Modal: Ready for registration')}
                >
                  + Register New Artisan
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Cluster / Workshop</th>
                      <th>Category</th>
                      <th>Cluster Lead</th>
                      <th>Locality / Address</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((node) => (
                      <tr key={node.id}>
                        <td>
                          <div className="font-bold text-[#2C241E]">{node.name}</div>
                          <div className="text-xs text-[#8C827A]">{node.speciality}</div>
                        </td>
                        <td>
                          <span className="capitalize font-semibold text-[#A75D28]">
                            {node.category}
                          </span>
                        </td>
                        <td>{node.artisanLeader || 'Ecosystem Cooperative'}</td>
                        <td>{node.address}</td>
                        <td>
                          <span
                            className="table-node-pill"
                            style={{
                              backgroundColor: NODE_TYPE_CONFIG[node.nodeType]?.bg || '#F3F4F6',
                              color: NODE_TYPE_CONFIG[node.nodeType]?.color || '#374151'
                            }}
                          >
                            {NODE_TYPE_CONFIG[node.nodeType]?.label || node.nodeType}
                          </span>
                        </td>
                        <td>
                          <button
                            className="table-action-btn"
                            onClick={() => {
                              setSelectedRadarNode(node);
                              setActiveNav('Craft Radar');
                            }}
                          >
                            Locate on Radar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              VIEW: PRODUCTS INVENTORY LEDGER
              ============================================================ */}
          {activeNav === 'Products' && (
            <div className="admin-view-table-wrapper">
              <div className="admin-table-head-bar">
                <div>
                  <h2 className="admin-table-title">Craft Product Catalog & Passports</h2>
                  <p className="admin-table-sub">
                    Authentic craft catalog with tamper-evident digital craft passports and GI verification
                  </p>
                </div>
                <button
                  className="locality-pill-btn active"
                  onClick={() => showToast('New Spec Upload Modal opened.')}
                >
                  + Add Master Spec
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Origin Hub</th>
                      <th>Price</th>
                      <th>Stock Status</th>
                      <th>Passport UID</th>
                      <th>Integrity Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="font-bold text-[#2C241E]">{p.name}</div>
                          <div className="text-xs text-[#8C827A]">{p.material}</div>
                        </td>
                        <td>{p.shopName}</td>
                        <td className="font-bold text-[#7C2D12]">₹{p.price.toLocaleString()}</td>
                        <td>
                          {p.stock > 0 ? (
                            <span className="badge-new-reg">In Stock ({p.stock})</span>
                          ) : (
                            <span className="badge-crisis-sos">Out of Stock</span>
                          )}
                        </td>
                        <td className="font-mono text-xs text-[#A75D28]">
                          {p.passport?.certId || 'GI-TRICHY-VERIFIED'}
                        </td>
                        <td>
                          <button
                            className="table-action-btn"
                            onClick={() => showToast(`Verified digital craft passport for: ${p.name}`)}
                          >
                            Verify Passport
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              VIEW: ARTISAN SOS CRISIS BOARD
              ============================================================ */}
          {activeNav === 'Artisan SOS' && (
            <div className="admin-view-table-wrapper">
              <div className="admin-table-head-bar">
                <div>
                  <h2 className="admin-table-title">Artisan SOS Response Console</h2>
                  <p className="admin-table-sub">
                    Rapid crisis triage for raw material spoilage, monsoon flooding, and emergency transport
                  </p>
                </div>
                <button
                  className="locality-pill-btn active"
                  style={{ backgroundColor: '#DC2626', borderColor: '#DC2626' }}
                  onClick={handleBroadcastAdvisory}
                >
                  Broadcast Emergency Net
                </button>
              </div>

              <div className="admin-sos-kanban">
                <div className="admin-kanban-col">
                  <div className="admin-kanban-head">
                    <span>Active Emergency</span>
                    <span className="badge-crisis-sos">
                      {sosTickets.filter(s => s.status === 'Reported').length} Open
                    </span>
                  </div>
                  {sosTickets.filter(s => s.status === 'Reported').map(t => (
                    <div key={t.id} className="admin-kanban-card">
                      <h5 className="text-red-700">{t.problem}</h5>
                      <p>Artisan: {t.artisanName} • {t.locality}</p>
                      <p className="text-xs text-[#5C5248]">{t.urgency || 'High Priority'}</p>
                      <button
                        className="admin-btn-action-pill btn-sos-dispatch mt-2"
                        onClick={() => setModalTicket(t)}
                      >
                        Dispatch Support
                      </button>
                    </div>
                  ))}
                </div>

                <div className="admin-kanban-col">
                  <div className="admin-kanban-head">
                    <span>In Progress / Transit</span>
                    <span className="badge-dim-check">
                      {sosTickets.filter(s => s.status === 'In Progress' || s.status === 'Matched').length} Active
                    </span>
                  </div>
                  <div className="admin-kanban-card">
                    <h5>Local Clay Logistics Van</h5>
                    <p>Driver: Selvam • Musiri ➔ Srirangam</p>
                    <span className="text-xs text-[#8C827A]">ETA: 35 minutes</span>
                  </div>
                </div>

                <div className="admin-kanban-col">
                  <div className="admin-kanban-head">
                    <span>Under Review</span>
                    <span className="badge-new-reg">1 Pending</span>
                  </div>
                  <div className="admin-kanban-card">
                    <h5>Raw Clay Quality Inspection</h5>
                    <p>Kallanai Dam Basin Pit #4</p>
                    <span className="text-xs text-[#8C827A]">Moisture test sample verified</span>
                  </div>
                </div>

                <div className="admin-kanban-col">
                  <div className="admin-kanban-head">
                    <span>Resolved</span>
                    <span className="badge-new-reg">
                      {sosTickets.filter(s => s.status === 'Resolved').length} Cleared
                    </span>
                  </div>
                  {sosTickets.filter(s => s.status === 'Resolved').map(t => (
                    <div key={t.id} className="admin-kanban-card">
                      <h5>{t.problem}</h5>
                      <p>Artisan: {t.artisanName}</p>
                      <span className="text-xs text-emerald-700">✓ Resolved by State Admin</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================
              VIEW: CRAFT RADAR LEAFLET MAP
              ============================================================ */}
          {activeNav === 'Craft Radar' && (
            <div className="admin-view-table-wrapper" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #ECE7E1' }}>
                <h2 className="admin-table-title">Cauvery Basin Craft Radar</h2>
                <p className="admin-table-sub">
                  Live geographic telemetry and cluster density mapping for Tiruchirappalli artisans
                </p>
              </div>
              <div style={{ height: '580px', width: '100%', position: 'relative' }}>
                <CraftRadarMap
                  nodes={nodes}
                  onSelectShop={(node) => {
                    setSelectedRadarNode(node);
                    showToast(`Selected Radar Node: ${node.name} (${node.address})`);
                  }}
                />
              </div>
            </div>
          )}

          {/* ============================================================
              VIEW: STUDENTS VERIFICATION QUEUE
              ============================================================ */}
          {(activeNav === 'Students' || activeNav === 'Verification') && (
            <div className="admin-view-table-wrapper">
              <div className="admin-table-head-bar">
                <div>
                  <h2 className="admin-table-title">Youth Facilitators & Verification Queue</h2>
                  <p className="admin-table-sub">
                    NIT Trichy, Bharathidasan University, and St. Joseph's student facilitators bridging artisan technology adoption
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Facilitator</th>
                      <th>Institution</th>
                      <th>Assigned Cluster</th>
                      <th>Pending Field Task</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="font-bold">Anand Kumar</div>
                        <div className="text-xs text-[#8C827A]">ID: STU-NITT-2024</div>
                      </td>
                      <td>NIT Tiruchirappalli (B.Tech)</td>
                      <td>Srirangam Temple Artisans</td>
                      <td>Photo Cataloging & Geotag Verification</td>
                      <td><span className="badge-dim-check">In Progress</span></td>
                      <td>
                        <button
                          className="table-action-btn"
                          onClick={() => showToast('Field log approved for Anand Kumar')}
                        >
                          Approve Task
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="font-bold">Pooja Raman</div>
                        <div className="text-xs text-[#8C827A]">ID: STU-BDU-1082</div>
                      </td>
                      <td>Bharathidasan University (MBA)</td>
                      <td>Woraiyur Handloom Society</td>
                      <td>Direct Buyer Order Sync & Invoice Proof</td>
                      <td><span className="badge-new-reg">Under Review</span></td>
                      <td>
                        <button
                          className="table-action-btn"
                          onClick={() => showToast('Invoice Proof verified for Pooja Raman')}
                        >
                          Verify Proof
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="font-bold">M. Dinesh</div>
                        <div className="text-xs text-[#8C827A]">ID: STU-SJC-0419</div>
                      </td>
                      <td>St. Joseph's College (B.Sc)</td>
                      <td>Musiri Pottery Kilns</td>
                      <td>Emergency Tarpaulin Delivery & Moisture Check</td>
                      <td><span className="badge-crisis-sos">Dispatched</span></td>
                      <td>
                        <button
                          className="table-action-btn"
                          onClick={() => showToast('Tracking ping sent to M. Dinesh')}
                        >
                          Ping Facilitator
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================
              VIEW: IMPACT & METRICS
              ============================================================ */}
          {activeNav === 'Impact' && (
            <div className="admin-view-table-wrapper">
              <div className="admin-table-head-bar">
                <div>
                  <h2 className="admin-table-title">Cauvery Delta Socio-Economic Impact</h2>
                  <p className="admin-table-sub">
                    Real-time livelihood metrics, direct artisan payouts, and GI craft preservation
                  </p>
                </div>
              </div>

              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Direct Revenue Facilitated</span>
                    <TrendingUp size={18} className="text-emerald-600" />
                  </div>
                  <div className="admin-stat-numeral text-emerald-700">₹14.2L</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Artisan Families Supported</span>
                    <Users size={18} className="text-[#A75D28]" />
                  </div>
                  <div className="admin-stat-numeral">{nodes.length * 5}</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Youth Facilitation Hours</span>
                    <GraduationCap size={18} className="text-amber-600" />
                  </div>
                  <div className="admin-stat-numeral">640</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-top">
                    <span className="admin-stat-label">Heritage GI Protected</span>
                    <ShieldCheck size={18} className="text-[#7C2D12]" />
                  </div>
                  <div className="admin-stat-numeral">100%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ====================================================================
          MODAL: ATTENTION ITEM ACTION DIALOG
          ==================================================================== */}
      {modalTicket && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setModalTicket(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="admin-modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-head">
              <div className="flex items-center gap-3">
                <div className="admin-item-avatar-initial" style={{ width: 38, height: 38, fontSize: '1.1rem' }}>
                  {modalTicket.artisanName ? modalTicket.artisanName.charAt(0) : 'A'}
                </div>
                <div>
                  <h3 className="admin-modal-title">{modalTicket.problem}</h3>
                  <p className="text-xs text-[#8C827A]">Artisan: {modalTicket.artisanName}</p>
                </div>
              </div>
              <button
                className="admin-modal-close"
                onClick={() => setModalTicket(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#ECE7E1] flex flex-col gap-2 text-xs">
                <div>
                  <strong className="text-[#2C241E]">Artisan / Lead:</strong>{' '}
                  <span>{modalTicket.artisanName}</span>
                </div>
                {modalTicket.contact && (
                  <div>
                    <strong className="text-[#2C241E]">Contact:</strong>{' '}
                    <span>{modalTicket.contact}</span>
                  </div>
                )}
                {modalTicket.address && (
                  <div>
                    <strong className="text-[#2C241E]">Location:</strong>{' '}
                    <span>{modalTicket.address}</span>
                  </div>
                )}
                <div>
                  <strong className="text-[#2C241E]">Craft Domain:</strong>{' '}
                  <span className="capitalize">{modalTicket.craft}</span>
                </div>
                {modalTicket.quantity && (
                  <div>
                    <strong className="text-[#2C241E]">Quantity:</strong>{' '}
                    <span>{modalTicket.quantity} units</span>
                  </div>
                )}
                <div className="mt-1 p-2 bg-[#FFF7ED] text-[#9A3412] rounded border border-[#FFEDD5]">
                  <strong>Operational Requirement:</strong> {modalTicket.problem}
                </div>
                {modalTicket.urgency && (
                  <div className="p-2 bg-[#FEF2F2] text-[#DC2626] rounded border border-[#FECACA] font-bold">
                    Urgency: {modalTicket.urgency}
                  </div>
                )}
              </div>
            </div>

            <div className="admin-modal-foot">
              <button
                className="table-action-btn"
                onClick={() => setModalTicket(null)}
              >
                Cancel
              </button>

              <button
                className="locality-pill-btn active"
                style={modalTicket.urgency === 'High' ? { backgroundColor: '#DC2626', borderColor: '#DC2626' } : {}}
                onClick={() =>
                  handleResolveAttention(
                    modalTicket,
                    `Resolved ticket #${modalTicket.id}`
                  )
                }
              >
                <Check size={14} className="inline mr-1" />
                Resolve Ticket & Dispatch Support
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
