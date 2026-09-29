import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home as HomeIcon,
  Search, 
  Map as MapIcon, 
  Route, 
  ShoppingBag, 
  FileText, 
  Settings, 
  LogOut, 
  MapPin, 
  Store, 
  Compass, 
  Phone, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Mic, 
  MicOff, 
  Upload, 
  X,
  ChevronRight,
  Award
} from 'lucide-react';
import type { EcosystemNode, EcosystemProduct } from './trichyEcosystemData';
import { 
  TRICHY_VERIFIED_ECOSYSTEM, 
  NODE_TYPE_CONFIG, 
  getDistanceFromTrichyCenter 
} from './trichyEcosystemData';
import CraftRadarMap from './CraftRadarMap';
import './CustomerPortal.css';
import { useArtisanEcosystem } from './context/ArtisanContext';

export type MainNavTab = 
  | 'HOME' 
  | 'RESULTS' 
  | 'RADAR_MAP' 
  | 'CRAFT_TRAILS' 
  | 'MY_ORDERS' 
  | 'CRAFT_PASSPORTS';

export type ProgressiveSubView = 
  | null 
  | 'SHOP_VIEW' 
  | 'PRODUCT_VIEW' 
  | 'PASSPORT_MODAL' 
  | 'CUSTOMIZE_DRAWER' 
  | 'ORDER_CONFIRM' 
  | 'CONTEXTUAL_TRAIL';

export interface CustomerOrder {
  id: string;
  type: 'direct_order' | 'custom_commission';
  productName: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  price: number;
  quantity: number;
  customizationText?: string;
  finish?: string;
  size?: string;
  fulfilmentMode: 'pickup' | 'delivery';
  deliveryAddress?: string;
  status: 'Requested' | 'Accepted' | 'Preparing' | 'Ready for Pickup' | 'Completed';
  timestamp: string;
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { placeOrder, submitCustomCommission } = useArtisanEcosystem();

  // Navigation State
  const [activeTab, setActiveTab] = useState<MainNavTab>('HOME');
  const [subView, setSubView] = useState<ProgressiveSubView>(null);

  // Search State - Combined directly into Home / Discovery canvas
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [showAllLocations, setShowAllLocations] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active Context Selections
  const [selectedShop, setSelectedShop] = useState<EcosystemNode | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<EcosystemProduct | null>(null);
  const [passportViewProduct, setPassportViewProduct] = useState<EcosystemProduct | null>(null);

  // Location indicator state
  const [userLocation, setUserLocation] = useState('Tiruchirappalli, Tamil Nadu');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState('Tiruchirappalli, Tamil Nadu');

  // Customizer Drawer State
  const [customFinish, setCustomFinish] = useState('Natural Clay');
  const [customSize, setCustomSize] = useState<'Standard' | 'Large'>('Standard');
  const [customQuantity, setCustomQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [customImageAttached, setCustomImageAttached] = useState<string | null>(null);

  // Order Confirmation State
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 4B, Cauvery Palms, Thillai Nagar, Trichy');

  // Active Orders Store
  const [activeOrders, setActiveOrders] = useState<CustomerOrder[]>([
    {
      id: 'ORD-TR-701',
      type: 'custom_commission',
      productName: 'Terracotta Cooking Handi Set',
      shopName: 'Pot Shop In Puthur',
      shopAddress: 'Puthur High Road, Puthur, Tiruchirappalli',
      shopPhone: '+91 98421 77312',
      price: 420,
      quantity: 1,
      customizationText: 'மங்கலம் பொங்கட்டும் (Auspicious Tamil Inscription)',
      finish: 'Smoke Black Earthen',
      size: 'Standard',
      fulfilmentMode: 'pickup',
      status: 'Preparing',
      timestamp: 'Today, 2:30 PM'
    },
    {
      id: 'ORD-TR-402',
      type: 'direct_order',
      productName: 'Woraiyur Pure Cotton Saree',
      shopName: 'Tiruchirappalli Handloom Weavers Cooperative Society',
      shopAddress: 'Panchavarnaswamy Koil Area, Woraiyur, Trichy',
      shopPhone: '+91 431 276 1022',
      price: 1450,
      quantity: 1,
      fulfilmentMode: 'delivery',
      deliveryAddress: 'Flat 4B, Cauvery Palms, Thillai Nagar, Trichy',
      status: 'Ready for Pickup',
      timestamp: 'Yesterday, 11:15 AM'
    }
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Quick Category Filter Pills on Home
  const HOME_CATEGORY_PILLS = [
    { label: '🏺 Terracotta', category: 'terracotta' },
    { label: '🧵 Handloom', category: 'handloom' },
    { label: '🪵 Woodcraft', category: 'woodcraft' },
    { label: '🗿 Sculpture', category: 'sculpture' },
    { label: '🏛️ Emporiums', category: 'handicrafts' }
  ];

  // 3 Curated High-Demand Items for "Recently Available Near You"
  const RECENT_PREVIEW_ITEMS = useMemo(() => {
    return [
      {
        node: TRICHY_VERIFIED_ECOSYSTEM.find(n => n.id === 'trichy-pottery-01')!,
        product: TRICHY_VERIFIED_ECOSYSTEM.find(n => n.id === 'trichy-pottery-01')!.products[0]
      },
      {
        node: TRICHY_VERIFIED_ECOSYSTEM.find(n => n.id === 'trichy-loom-11')!,
        product: TRICHY_VERIFIED_ECOSYSTEM.find(n => n.id === 'trichy-loom-11')!.products[0]
      },
      {
        node: TRICHY_VERIFIED_ECOSYSTEM.find(n => n.id === 'trichy-gov-20')!,
        product: TRICHY_VERIFIED_ECOSYSTEM.find(n => n.id === 'trichy-gov-20')!.products[0]
      }
    ];
  }, []);

  // Is Search or Filter active
  const isSearchActive = searchQuery.trim().length > 0 || activeCategoryFilter !== 'all' || showAllLocations;

  // Filtered Nodes Engine with Multi-field and Multi-word Search Matching
  const filteredNodes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const words = q.split(/\s+/).filter(Boolean);

    return TRICHY_VERIFIED_ECOSYSTEM.filter(node => {
      // 1. Category Filter
      const matchCat = activeCategoryFilter === 'all' || node.category === activeCategoryFilter;
      if (!matchCat) return false;

      // If no search words typed, match category filter
      if (words.length === 0) return true;

      // 2. Comprehensive text search across node attributes
      const nodeText = [
        node.name,
        node.speciality,
        node.address,
        node.category,
        node.nodeType,
        node.artisanLeader || '',
        NODE_TYPE_CONFIG[node.nodeType]?.label || '',
        NODE_TYPE_CONFIG[node.nodeType]?.tag || ''
      ].join(' ').toLowerCase();

      // Text from all products verified at this location
      const productTexts = node.products.map(p => [
        p.name,
        p.material,
        p.description || '',
        p.passport?.rawMaterials || '',
        p.passport?.artisanName || '',
        p.passport?.technique || '',
        p.passport?.origin || ''
      ].join(' ').toLowerCase());

      // Every word in query must match either the node or at least one of its products
      return words.every(word => 
        nodeText.includes(word) || productTexts.some(pt => pt.includes(word))
      );
    });
  }, [searchQuery, activeCategoryFilter]);

  // Search Controls
  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveCategoryFilter('all');
    setShowAllLocations(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleCategorySelect = (category: string) => {
    if (activeCategoryFilter === category && category !== 'all') {
      setActiveCategoryFilter('all');
    } else {
      setActiveCategoryFilter(category);
    }
    setActiveTab('HOME');
    setSubView(null);
  };

  const handleExecuteSearch = (query: string, category: string = 'all') => {
    setSearchQuery(query);
    setActiveCategoryFilter(category);
    setActiveTab('HOME');
    setSubView(null);
  };

  // Select Shop Profile (Step 5)
  const handleSelectShop = (shop: EcosystemNode) => {
    setSelectedShop(shop);
    setSubView('SHOP_VIEW');
  };

  // Select Product (Step 7)
  const handleSelectProduct = (product: EcosystemProduct, shop?: EcosystemNode) => {
    if (shop) setSelectedShop(shop);
    setSelectedProduct(product);
    setSubView('PRODUCT_VIEW');
  };

  // Submit Customization (Step 9 -> Step 12)
  const handleSubmitCustomRequest = () => {
    if (!selectedProduct || !selectedShop) return;

    const newOrder: CustomerOrder = {
      id: `CUST-TR-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'custom_commission',
      productName: selectedProduct.name,
      shopName: selectedShop.name,
      shopAddress: selectedShop.address,
      shopPhone: selectedShop.phone || '+91 94432 10891',
      price: (selectedProduct.price + (customSize === 'Large' ? 250 : 0)) * customQuantity,
      quantity: customQuantity,
      customizationText: customText || voiceTranscript || 'Bespoke hand finish',
      finish: customFinish,
      size: customSize,
      fulfilmentMode: 'pickup',
      status: 'Requested',
      timestamp: 'Just now'
    };

    setActiveOrders(prev => [newOrder, ...prev]);
    submitCustomCommission({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      shopName: selectedShop.name,
      customerName: 'Ananya Krishnan',
      notes: customText || voiceTranscript || 'Bespoke hand finish',
      finish: customFinish,
      size: customSize
    });
    setSubView(null);
    setActiveTab('MY_ORDERS');
    showToast(`🎨 Custom request dispatched to ${selectedShop.name}!`);
  };

  // Submit Direct Order (Step 11 -> Step 12)
  const handleConfirmOrderPlacement = () => {
    if (!selectedProduct || !selectedShop) return;

    const newOrder: CustomerOrder = {
      id: `ORD-TR-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'direct_order',
      productName: selectedProduct.name,
      shopName: selectedShop.name,
      shopAddress: selectedShop.address,
      shopPhone: selectedShop.phone || '+91 94432 10891',
      price: selectedProduct.price * orderQuantity,
      quantity: orderQuantity,
      fulfilmentMode: fulfillmentType,
      deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
      status: 'Requested',
      timestamp: 'Just now'
    };

    setActiveOrders(prev => [newOrder, ...prev]);
    placeOrder({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      shopName: selectedShop.name,
      customerName: 'Aarav Sundaram',
      quantity: orderQuantity,
      totalPrice: selectedProduct.price * orderQuantity,
      fulfillmentType,
      address: fulfillmentType === 'delivery' ? deliveryAddress : selectedShop.address
    });
    setSubView(null);
    setActiveTab('MY_ORDERS');
    showToast(`🛍️ Order confirmed with ${selectedShop.name}!`);
  };

  // Voice recording simulation
  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setVoiceTranscript('"Please inscribe family name in classical Tamil script on the rim. Prefer natural kiln firing."');
        setIsRecording(false);
      }, 2400);
    } else {
      setIsRecording(false);
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCustomImageAttached(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="portal-app-container">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="portal-toast">
          <Sparkles size={16} className="text-terracotta" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =====================================================================
          1. PERMANENT LEFT SIDE NAVBAR (w-64, bg-white, border-r border-[#EFEAE2])
         ===================================================================== */}
      <aside className="portal-sidebar">
        {/* Top Brand Header */}
        <div className="sidebar-brand-block" onClick={() => { setActiveTab('HOME'); setSubView(null); }}>
          <div className="brand-monogram">AL</div>
          <div className="brand-text-stack">
            <h1 className="brand-logo-text">ARTISANLINK</h1>
            <span className="brand-subtitle">Trichy Craft Network</span>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="sidebar-menu">
          <button 
            className={`nav-menu-btn ${activeTab === 'HOME' && !subView ? 'active' : ''}`}
            onClick={() => { setActiveTab('HOME'); setSubView(null); }}
          >
            <HomeIcon size={18} className="menu-icon" />
            <span className="menu-label">Home & Discovery</span>
            {isSearchActive && filteredNodes.length > 0 && (
              <span className="menu-pill-count">{filteredNodes.length}</span>
            )}
          </button>

          <button 
            className={`nav-menu-btn ${activeTab === 'RADAR_MAP' && !subView ? 'active' : ''}`}
            onClick={() => { setActiveTab('RADAR_MAP'); setSubView(null); }}
          >
            <MapIcon size={18} className="menu-icon" />
            <span className="menu-label">Craft Radar</span>
            <span className="live-status-dot" title="23 Live Nodes"></span>
          </button>

          <button 
            className={`nav-menu-btn ${activeTab === 'CRAFT_TRAILS' && !subView ? 'active' : ''}`}
            onClick={() => { setActiveTab('CRAFT_TRAILS'); setSubView(null); }}
          >
            <Route size={18} className="menu-icon" />
            <span className="menu-label">Living Craft Trails</span>
          </button>

          <button 
            className={`nav-menu-btn ${activeTab === 'MY_ORDERS' && !subView ? 'active' : ''}`}
            onClick={() => { setActiveTab('MY_ORDERS'); setSubView(null); }}
          >
            <ShoppingBag size={18} className="menu-icon" />
            <span className="menu-label">My Orders & Requests</span>
            {activeOrders.length > 0 && (
              <span className="menu-badge-alert">{activeOrders.length}</span>
            )}
          </button>

          <button 
            className={`nav-menu-btn ${activeTab === 'CRAFT_PASSPORTS' && !subView ? 'active' : ''}`}
            onClick={() => { setActiveTab('CRAFT_PASSPORTS'); setSubView(null); }}
          >
            <FileText size={18} className="menu-icon" />
            <span className="menu-label">Craft Passports</span>
          </button>
        </nav>

        {/* Bottom Profile & Session Group */}
        <div className="sidebar-bottom-block">
          <div className="user-profile-card">
            <div className="user-avatar-circle">AV</div>
            <div className="user-info">
              <span className="user-name">Arun V.</span>
              <div 
                className="user-loc-sub" 
                onClick={() => setIsEditingLocation(!isEditingLocation)}
                title="Click to edit location"
              >
                <MapPin size={11} className="text-terracotta" />
                <span>{userLocation.split(',')[0]}</span>
              </div>
            </div>
          </div>

          {isEditingLocation && (
            <div className="location-edit-pop">
              <input 
                type="text" 
                value={locationInput}
                onChange={e => setLocationInput(e.target.value)}
                placeholder="Enter city or taluk..."
                className="loc-edit-input"
              />
              <button 
                className="loc-save-btn"
                onClick={() => {
                  setUserLocation(locationInput || 'Tiruchirappalli');
                  setIsEditingLocation(false);
                  showToast('Location updated: ' + locationInput);
                }}
              >
                Save
              </button>
            </div>
          )}

          <div className="sidebar-utility-row">
            <button className="sub-nav-btn" onClick={() => showToast('Preferences configured for Trichy')}>
              <Settings size={15} /> <span>Settings</span>
            </button>
            <button className="sub-nav-btn logout-text" onClick={() => navigate('/')}>
              <LogOut size={15} /> <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          2. MAIN CONTENT CANVAS (FLUID SCROLLABLE PANE)
         ===================================================================== */}
      <main className="portal-main-canvas">

        {/* -------------------------------------------------------------------
            SUBVIEW OVERLAYS: SHOP PROFILE, PRODUCT DETAIL, TRAIL, PASSPORT, CUSTOMIZER
           ------------------------------------------------------------------- */}
        
        {/* SUBVIEW: SHOP PROFILE (Step 5) */}
        {subView === 'SHOP_VIEW' && selectedShop && (
          <div className="subview-pane">
            <div className="subview-nav-bar">
              <button className="btn-canvas-back" onClick={() => setSubView(null)}>
                <ArrowLeft size={16} /> Back to {isSearchActive ? 'Search Results' : 'Explore'}
              </button>
            </div>

            <section className="shop-profile-banner">
              <div className="shop-banner-meta">
                <span 
                  className="shop-badge-tag"
                  style={{ 
                    backgroundColor: NODE_TYPE_CONFIG[selectedShop.nodeType].bg,
                    color: NODE_TYPE_CONFIG[selectedShop.nodeType].color 
                  }}
                >
                  {NODE_TYPE_CONFIG[selectedShop.nodeType].iconEmoji} {NODE_TYPE_CONFIG[selectedShop.nodeType].tag}
                </span>
                <span className="shop-distance-pill">
                  📍 {getDistanceFromTrichyCenter(selectedShop.lat, selectedShop.lng)} km from city center
                </span>
              </div>

              <h1 className="shop-banner-title">{selectedShop.name}</h1>
              <p className="shop-banner-speciality">{selectedShop.speciality}</p>
              <p className="shop-banner-address"><MapPin size={14} /> {selectedShop.address}</p>

              <div className="shop-cta-row">
                <a 
                  href={selectedShop.googleMapsUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-shop-map"
                >
                  <Compass size={15} /> <span>🧭 Directions (Google Maps Pin)</span>
                </a>

                {selectedShop.phone && (
                  <a href={`tel:${selectedShop.phone}`} className="btn-shop-contact">
                    <Phone size={14} /> <span>📞 Contact ({selectedShop.phone})</span>
                  </a>
                )}

                {/* CONTEXTUAL OPTION: Explore Craft Trail appears HERE */}
                {selectedShop.trailSteps && selectedShop.trailSteps.length > 0 && (
                  <button 
                    className="btn-shop-trail-trigger"
                    onClick={() => setSubView('CONTEXTUAL_TRAIL')}
                  >
                    <Route size={15} /> <span>🗺️ Explore Craft Trail at this Workshop</span>
                  </button>
                )}
              </div>
            </section>

            {/* In-Stock Products Feed Verified at this Location */}
            <section className="shop-stock-section">
              <div className="stock-section-head">
                <h2>In-Stock Products at this Location</h2>
                <span className="stock-count-indicator">
                  {selectedShop.products.length} product(s) physically verified in stock
                </span>
              </div>

              <div className="products-card-grid">
                {selectedShop.products.map(product => (
                  <div 
                    key={product.id}
                    className="verified-product-card"
                    onClick={() => handleSelectProduct(product, selectedShop)}
                  >
                    {product.image && (
                      <div className="card-photo-wrapper">
                        <img src={product.image} alt={product.name} />
                      </div>
                    )}
                    <div className="card-info-pane">
                      <h3 className="card-prod-title">{product.name}</h3>
                      <p className="card-prod-mat">Material: <strong>{product.material}</strong></p>
                      <div className="card-price-stock-line">
                        <span className="prod-price-text">₹{product.price.toLocaleString()}</span>
                        <span className="prod-stock-pill">{product.stock} available</span>
                      </div>
                      <button className="btn-card-inspect">
                        Inspect Product Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* SUBVIEW: CONTEXTUAL CRAFT TRAIL (Step 6) */}
        {subView === 'CONTEXTUAL_TRAIL' && selectedShop && selectedShop.trailSteps && (
          <div className="subview-pane">
            <div className="subview-nav-bar">
              <button className="btn-canvas-back" onClick={() => setSubView('SHOP_VIEW')}>
                <ArrowLeft size={16} /> Back to {selectedShop.name}
              </button>
            </div>

            <div className="trail-experience-card">
              <span className="trail-sub-tag">LIVING HERITAGE WORKSHOP WALK</span>
              <h2 className="trail-main-title">Experience Trail: {selectedShop.name}</h2>
              <p className="trail-intro">
                Follow this 4-step itinerary anchored directly to this master workshop. Experience live material preparation and master demonstrations.
              </p>

              <div className="trail-four-steps">
                {selectedShop.trailSteps.map(stepItem => (
                  <div key={stepItem.step} className="trail-step-box">
                    <div className="step-num-capsule">STEP {stepItem.step}</div>
                    <h4>{stepItem.title}</h4>
                    <p>{stepItem.desc}</p>
                  </div>
                ))}
              </div>

              <div className="trail-action-foot">
                <a 
                  href={selectedShop.googleMapsUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-start-trail-nav"
                >
                  <Compass size={16} /> <span>Open Navigation Route to Workshop Stop</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* SUBVIEW: PRODUCT DETAIL ("DO YOU WANT THIS?" VIEW - Step 7) */}
        {subView === 'PRODUCT_VIEW' && selectedProduct && selectedShop && (
          <div className="subview-pane">
            <div className="subview-nav-bar">
              <button className="btn-canvas-back" onClick={() => setSubView('SHOP_VIEW')}>
                <ArrowLeft size={16} /> Back to {selectedShop.name}
              </button>
            </div>

            <div className="product-stage-card">
              <div className="product-photo-half">
                {selectedProduct.image ? (
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                ) : (
                  <div className="photo-placeholder">
                    <Store size={48} className="text-terracotta" />
                    <span>Verified Handmade Item</span>
                  </div>
                )}
              </div>

              <div className="product-specs-half">
                <div className="workshop-link-line" onClick={() => setSubView('SHOP_VIEW')}>
                  📍 Available at: <strong>{selectedShop.name}</strong> ({selectedShop.address})
                </div>

                <h1 className="product-title-large">{selectedProduct.name}</h1>
                <p className="product-desc-body">
                  {selectedProduct.description || 'Authentic regional handicraft crafted using traditional Cauvery delta techniques.'}
                </p>

                <div className="product-pricing-cluster">
                  <div>
                    <span className="price-lbl">Verified Price</span>
                    <span className="price-val">₹{selectedProduct.price.toLocaleString()}</span>
                  </div>
                  <div className="stock-count-indicator">
                    {selectedProduct.stock} items verified in stock
                  </div>
                </div>

                <div className="product-material-row">
                  <span>Primary Material:</span>
                  <strong>{selectedProduct.material}</strong>
                </div>

                {/* Primary Action Buttons */}
                <div className="product-actions-stack">
                  <button 
                    className="btn-order-primary"
                    onClick={() => { setOrderQuantity(1); setSubView('ORDER_CONFIRM'); }}
                  >
                    <ShoppingBag size={18} /> <span>Place Order / Reserve Now</span>
                  </button>

                  <button 
                    className="btn-customize-secondary"
                    onClick={() => setSubView('CUSTOMIZE_DRAWER')}
                  >
                    <Sparkles size={18} className="text-terracotta" /> <span>Make It Yours (Customize)</span>
                  </button>

                  <button 
                    className="btn-passport-tertiary"
                    onClick={() => { setPassportViewProduct(selectedProduct); setSubView('PASSPORT_MODAL'); }}
                  >
                    <QrCode size={17} /> <span>View Craft Passport</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBVIEW: CRAFT PASSPORT MODAL (Step 8) */}
        {subView === 'PASSPORT_MODAL' && passportViewProduct && (
          <div className="modal-screen-mask" onClick={() => setSubView('PRODUCT_VIEW')}>
            <div className="passport-paper-card" onClick={e => e.stopPropagation()}>
              <div className="passport-card-top">
                <div className="gold-seal-circle">
                  <Award size={26} className="text-gold" />
                </div>
                <div>
                  <span className="gov-seal-eyebrow">GOVERNMENT OF TAMIL NADU • HANDICRAFT PROVENANCE REGISTRY</span>
                  <h3 className="passport-modal-title">CRAFT PASSPORT CERTIFICATE</h3>
                </div>
                <button className="btn-modal-close" onClick={() => setSubView('PRODUCT_VIEW')}>
                  <X size={18} />
                </button>
              </div>

              <div className="passport-body-split">
                <div className="qr-certificate-pane">
                  <svg className="svg-qr-symbol" viewBox="0 0 140 140" width="140" height="140">
                    <rect width="140" height="140" fill="#FFFFFF" rx="6" />
                    <rect x="10" y="10" width="36" height="36" fill="#1C1917" rx="3" />
                    <rect x="18" y="18" width="20" height="20" fill="#FFFFFF" />
                    <rect x="23" y="23" width="10" height="10" fill="#C85A32" />
                    <rect x="94" y="10" width="36" height="36" fill="#1C1917" rx="3" />
                    <rect x="102" y="18" width="20" height="20" fill="#FFFFFF" />
                    <rect x="107" y="23" width="10" height="10" fill="#C85A32" />
                    <rect x="10" y="94" width="36" height="36" fill="#1C1917" rx="3" />
                    <rect x="18" y="102" width="20" height="20" fill="#FFFFFF" />
                    <rect x="23" y="107" width="10" height="10" fill="#C85A32" />
                    <rect x="56" y="20" width="12" height="12" fill="#1C1917" />
                    <rect x="74" y="20" width="12" height="12" fill="#1C1917" />
                    <rect x="56" y="44" width="28" height="28" fill="#B24322" rx="4" />
                    <circle cx="70" cy="58" r="6" fill="#FFFFFF" />
                    <rect x="56" y="80" width="12" height="12" fill="#1C1917" />
                    <rect x="74" y="94" width="16" height="16" fill="#1C1917" />
                    <rect x="100" y="56" width="14" height="14" fill="#1C1917" />
                  </svg>
                  <span className="qr-caption">Scan with phone to verify provenance</span>
                </div>

                <div className="provenance-specs-pane">
                  <div className="spec-item">
                    <span className="spec-label">Product Name</span>
                    <span className="spec-val-bold">{passportViewProduct.name}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Master Maker / Guild</span>
                    <span className="spec-val-bold">
                      {passportViewProduct.passport?.artisanName || selectedShop?.artisanLeader || selectedShop?.name || 'Verified Master Artisan'}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Origin Coordinates</span>
                    <span className="spec-val-text">
                      📍 {passportViewProduct.passport?.origin || selectedShop?.address || 'Tiruchirappalli, Tamil Nadu'}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Material Provenance Audit</span>
                    <span className="spec-val-highlight">
                      {passportViewProduct.passport?.rawMaterials || `${passportViewProduct.material} (Cauvery Basin Origin)`}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Verification Timestamp</span>
                    <span className="spec-val-text">
                      {passportViewProduct.passport?.timestamp || '16 Feb 2026 • Certified Batch'}
                    </span>
                  </div>
                  <div className="cert-verified-badge">
                    <ShieldCheck size={16} />
                    <span>Cryptographic Certificate #{passportViewProduct.passport?.certId || 'TN-TRY-904'}</span>
                  </div>
                </div>
              </div>

              <div className="passport-footer">
                <button className="btn-passport-done" onClick={() => setSubView('PRODUCT_VIEW')}>
                  ← Return to Product View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBVIEW: CUSTOMIZATION DRAWER (Step 9 & 10) */}
        {subView === 'CUSTOMIZE_DRAWER' && selectedProduct && selectedShop && (
          <div className="modal-screen-mask" onClick={() => setSubView('PRODUCT_VIEW')}>
            <div className="customizer-flyout" onClick={e => e.stopPropagation()}>
              <div className="flyout-header">
                <div>
                  <span className="flyout-eyebrow"><Sparkles size={12} /> MAKE IT YOURS</span>
                  <h3 className="flyout-title">Bespoke Artisan Commission</h3>
                  <p className="flyout-sub">Direct custom collaboration with {selectedShop.name}</p>
                </div>
                <button className="btn-modal-close" onClick={() => setSubView('PRODUCT_VIEW')}>
                  <X size={18} />
                </button>
              </div>

              <div className="flyout-scroll-body">
                <div className="flyout-prod-box">
                  <h4>{selectedProduct.name}</h4>
                  <p>Base price: ₹{selectedProduct.price} • Material: {selectedProduct.material}</p>
                </div>

                {/* 1. Finish / Colour */}
                <div className="flyout-field">
                  <label className="field-title">1. Select Finish / Patina</label>
                  <div className="choice-pills-row">
                    {['Natural Clay', 'Antique Patina', 'Smoke Black Earthen', 'Organic Lacquer'].map(f => (
                      <button
                        type="button"
                        key={f}
                        className={`pill-option ${customFinish === f ? 'active' : ''}`}
                        onClick={() => setCustomFinish(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Custom Text */}
                <div className="flyout-field">
                  <label className="field-title">2. Custom Inscription / Family Name (Tamil & English)</label>
                  <input
                    type="text"
                    className="flyout-input"
                    placeholder="e.g. நல்வரவு or Sundaram Family Heirloom 2026..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                  />
                  <div className="tamil-suggestions">
                    {['நல்வரவு', 'மங்கலம் பொங்கட்டும்', 'ஓம்', 'வாழ்க வளமுடன்'].map(t => (
                      <button 
                        type="button" 
                        key={t}
                        className="tamil-quick-btn"
                        onClick={() => setCustomText(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Size & Quantity */}
                <div className="flyout-dual-fields">
                  <div>
                    <label className="field-title">3. Size</label>
                    <div className="choice-pills-row">
                      <button
                        type="button"
                        className={`pill-option ${customSize === 'Standard' ? 'active' : ''}`}
                        onClick={() => setCustomSize('Standard')}
                      >
                        Standard
                      </button>
                      <button
                        type="button"
                        className={`pill-option ${customSize === 'Large' ? 'active' : ''}`}
                        onClick={() => setCustomSize('Large')}
                      >
                        Large (+₹250)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="field-title">Quantity</label>
                    <div className="stepper-cluster">
                      <button type="button" onClick={() => setCustomQuantity(Math.max(1, customQuantity - 1))}>-</button>
                      <span>{customQuantity}</span>
                      <button type="button" onClick={() => setCustomQuantity(customQuantity + 1)}>+</button>
                    </div>
                  </div>
                </div>

                {/* 4. Audio Note */}
                <div className="flyout-field">
                  <label className="field-title">4. Audio Instruction for Artisan</label>
                  <button
                    type="button"
                    className={`btn-audio-record ${isRecording ? 'recording' : ''}`}
                    onClick={toggleVoiceRecording}
                  >
                    {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
                    <span>{isRecording ? 'Listening to voice...' : '🎙 Describe your requirement'}</span>
                  </button>
                  {voiceTranscript && (
                    <div className="transcription-box">
                      <small>Transcribed:</small>
                      <p>{voiceTranscript}</p>
                    </div>
                  )}
                </div>

                {/* 5. Reference Photo */}
                <div className="flyout-field">
                  <label className="field-title">5. Reference Sketch (Optional)</label>
                  <label className="dropzone-box">
                    <input type="file" accept="image/*" onChange={handleImageFile} style={{ display: 'none' }} />
                    <Upload size={16} />
                    <span>{customImageAttached ? '✓ Reference photo attached' : 'Click to attach photo or motif sketch'}</span>
                  </label>
                </div>

                <div className="flyout-total-calc">
                  <span>Total Estimated Custom Cost:</span>
                  <strong>
                    ₹{((selectedProduct.price + (customSize === 'Large' ? 250 : 0)) * customQuantity).toLocaleString()}
                  </strong>
                </div>

                <div className="flyout-submit-bar">
                  <button type="button" className="btn-cancel" onClick={() => setSubView('PRODUCT_VIEW')}>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn-submit-ticket"
                    onClick={handleSubmitCustomRequest}
                  >
                    Send Custom Request (Awaiting Review)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBVIEW: ORDER CONFIRMATION (Step 11) */}
        {subView === 'ORDER_CONFIRM' && selectedProduct && selectedShop && (
          <div className="subview-pane">
            <div className="subview-nav-bar">
              <button className="btn-canvas-back" onClick={() => setSubView('PRODUCT_VIEW')}>
                <ArrowLeft size={16} /> Back to Product
              </button>
            </div>

            <div className="order-confirm-box">
              <h2 className="confirm-heading">Confirm Artisan Order</h2>
              <p className="confirm-desc">Direct purchase from {selectedShop.name}</p>

              <div className="confirm-prod-line">
                <div>
                  <h4>{selectedProduct.name}</h4>
                  <p>Workshop: {selectedShop.name} • {selectedShop.address}</p>
                  <span className="unit-cost-tag">₹{selectedProduct.price} per piece</span>
                </div>
                <div className="stepper-cluster">
                  <button onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}>-</button>
                  <span>{orderQuantity}</span>
                  <button onClick={() => setOrderQuantity(Math.min(selectedProduct.stock, orderQuantity + 1))}>+</button>
                </div>
              </div>

              <div className="fulfilment-picker">
                <label className="picker-title">Fulfilment Option:</label>
                <div className="picker-options">
                  <label className={`picker-card ${fulfillmentType === 'pickup' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="fulfilment" 
                      value="pickup" 
                      checked={fulfillmentType === 'pickup'}
                      onChange={() => setFulfillmentType('pickup')}
                    />
                    <div>
                      <strong>🏪 Direct Workshop Pickup</strong>
                      <p>Collect in person at {selectedShop.name} ({getDistanceFromTrichyCenter(selectedShop.lat, selectedShop.lng)} km away)</p>
                    </div>
                  </label>

                  <label className={`picker-card ${fulfillmentType === 'delivery' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="fulfilment" 
                      value="delivery" 
                      checked={fulfillmentType === 'delivery'}
                      onChange={() => setFulfillmentType('delivery')}
                    />
                    <div>
                      <strong>🚚 Trichy Cluster Van Delivery</strong>
                      <p>Delivered to your address within 24 hours</p>
                    </div>
                  </label>
                </div>
              </div>

              {fulfillmentType === 'delivery' && (
                <div className="address-entry-field">
                  <label className="picker-title">Delivery Address in Trichy:</label>
                  <textarea 
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="address-textarea"
                  />
                </div>
              )}

              <div className="confirm-actions-footer">
                <div>
                  <span className="tot-lbl">Total Payable Amount:</span>
                  <span className="tot-val">₹{(selectedProduct.price * orderQuantity).toLocaleString()}</span>
                </div>
                <button className="btn-place-order" onClick={handleConfirmOrderPlacement}>
                  Confirm Reservation / Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            PRIMARY TABS (WHEN NO SUBVIEW IS ACTIVE)
           ------------------------------------------------------------------- */}

        {/* TAB 1: HOME & DISCOVERY (COMBINED WITH SEARCH & RESULTS) */}
        {!subView && (activeTab === 'HOME' || activeTab === 'RESULTS') && (
          <div className="tab-pane home-pane">
            
            {/* Top Persistent Search Hero */}
            <div className="home-search-hero">
              <div className="hero-top-meta">
                <span className="hero-loc-pill">
                  <MapPin size={13} /> {userLocation}
                </span>
                {isSearchActive && (
                  <button 
                    type="button" 
                    className="hero-reset-badge"
                    onClick={handleClearSearch}
                  >
                    <X size={12} /> Clear Filter
                  </button>
                )}
              </div>

              <h2 className="hero-search-heading">Discover Authentic Trichy Crafts</h2>
              <p className="hero-search-sub">Direct access to verified master artisans across the Cauvery Basin</p>

              {/* Wide Pill Search Input Form */}
              <form 
                className="main-search-pill-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExecuteSearch(searchQuery, activeCategoryFilter);
                }}
              >
                <Search size={19} className="search-icon" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  className="search-input"
                  placeholder="Search by craft, product, material, or artisan (e.g., 'pot', 'cotton saree', 'bronze lamp')..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim().length > 0) {
                      setShowAllLocations(false);
                    }
                  }}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <button 
                    type="button" 
                    className="search-clear-inline"
                    onClick={() => {
                      setSearchQuery('');
                      if (searchInputRef.current) searchInputRef.current.focus();
                    }}
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
                <button type="submit" className="btn-search-go">
                  Search
                </button>
              </form>

              {/* Quick Category Filter Pills */}
              <div className="home-category-pills">
                <button
                  type="button"
                  className={`category-pill-btn ${activeCategoryFilter === 'all' && !searchQuery ? 'active' : ''}`}
                  onClick={() => handleCategorySelect('all')}
                >
                  All Crafts ({TRICHY_VERIFIED_ECOSYSTEM.length})
                </button>
                {HOME_CATEGORY_PILLS.map((pill) => (
                  <button
                    key={pill.category}
                    type="button"
                    className={`category-pill-btn ${activeCategoryFilter === pill.category ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(pill.category)}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Content: Either Default Discovery Preview or Live Search Results */}
            {!isSearchActive ? (
              <>
                {/* "Recently Available Near You" (3 High-Demand Items Only) */}
                <section className="recently-available-section">
                  <div className="section-head-bar">
                    <h3 className="section-title">Recently available near you</h3>
                    <span className="section-meta">23 Verified Nodes Across Trichy Clusters</span>
                  </div>

                  <div className="recent-trio-grid">
                    {RECENT_PREVIEW_ITEMS.map(({ node, product }) => {
                      const dist = getDistanceFromTrichyCenter(node.lat, node.lng);
                      const config = NODE_TYPE_CONFIG[node.nodeType];

                      return (
                        <article 
                          key={node.id} 
                          className="trio-product-card"
                          onClick={() => handleSelectProduct(product, node)}
                        >
                          <div className="trio-card-header">
                            <span 
                              className="trio-badge"
                              style={{ backgroundColor: config.bg, color: config.color }}
                            >
                              {config.label}
                            </span>
                            <span className="trio-dist">📍 {dist} km away</span>
                          </div>

                          <h4 className="trio-shop-name">{node.name}</h4>
                          <p className="trio-shop-spec">{node.speciality}</p>

                          <div className="trio-product-box">
                            <span className="trio-prod-title">Featured: {product.name}</span>
                            <span className="trio-prod-price">₹{product.price} • {product.stock} in stock</span>
                          </div>

                          <div className="trio-footer-hint">
                            <span>View maker & in-stock items</span>
                            <ChevronRight size={14} />
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {/* Explore All Locations Prompt */}
                  <div className="home-browse-banner">
                    <div>
                      <h4>Explore the Full Tiruchirappalli Craft Network</h4>
                      <p>23 verified independent makers, handloom weavers cooperatives, and government emporiums.</p>
                    </div>
                    <button 
                      type="button"
                      className="btn-browse-all"
                      onClick={() => setShowAllLocations(true)}
                    >
                      Browse All 23 Locations →
                    </button>
                  </div>
                </section>
              </>
            ) : (
              /* ACTIVE LIVE RESULTS SECTION DIRECTLY UNDER PERSISTENT SEARCH BAR */
              <section className="home-search-results-section">
                <div className="results-top-control-bar">
                  <div>
                    <h2 className="results-view-title">
                      {filteredNodes.length > 0 
                        ? `Found ${filteredNodes.length} Verified Artisan Location${filteredNodes.length === 1 ? '' : 's'}`
                        : 'No Artisan Locations Found'}
                    </h2>
                    <p className="results-view-subtitle">
                      {searchQuery ? `Matching "${searchQuery}"` : 'All clusters'}
                      {activeCategoryFilter !== 'all' ? ` in ${activeCategoryFilter}` : ''}
                      {' '}• Tiruchirappalli Craft Network
                    </p>
                  </div>

                  <div className="results-action-cluster">
                    <button 
                      type="button"
                      className="btn-clear-filter-strip"
                      onClick={handleClearSearch}
                    >
                      <X size={14} /> Clear Search
                    </button>

                    <button 
                      type="button"
                      className="btn-switch-map-strip"
                      onClick={() => setActiveTab('RADAR_MAP')}
                    >
                      <MapIcon size={14} /> Switch to Map View
                    </button>
                  </div>
                </div>

                {filteredNodes.length === 0 ? (
                  <div className="no-results-banner">
                    <h4>No verified artisan locations found matching "{searchQuery}"</h4>
                    <p>Try searching for crafts like <em>"pottery"</em>, <em>"handloom"</em>, <em>"cotton saree"</em>, <em>"terracotta"</em>, or <em>"bronze"</em>.</p>
                    <button 
                      className="btn-reset-search"
                      onClick={handleClearSearch}
                    >
                      Show All 23 Locations
                    </button>
                  </div>
                ) : (
                  <div className="results-locations-stack">
                    {filteredNodes.map(node => {
                      const dist = getDistanceFromTrichyCenter(node.lat, node.lng);
                      const config = NODE_TYPE_CONFIG[node.nodeType];
                      const totalStock = node.products.reduce((acc, p) => acc + p.stock, 0);

                      return (
                        <article key={node.id} className="location-result-card">
                          <div className="loc-card-header">
                            <div>
                              <div className="loc-pill-line">
                                <span 
                                  className="loc-node-tag"
                                  style={{ backgroundColor: config.bg, color: config.color }}
                                >
                                  {config.iconEmoji} {config.label}
                                </span>
                                <span className="loc-dist-tag">📍 {dist} km away</span>
                                <span className="loc-stock-tag">{totalStock} available</span>
                              </div>
                              <h3 
                                className="loc-name-link"
                                onClick={() => handleSelectShop(node)}
                              >
                                {node.name}
                              </h3>
                              <p className="loc-address-text">{node.address}</p>
                            </div>

                            <div className="loc-actions">
                              <button 
                                className="btn-loc-view"
                                onClick={() => handleSelectShop(node)}
                              >
                                <Store size={15} /> <span>View Shop & Products</span>
                              </button>
                              <a 
                                href={node.googleMapsUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn-loc-dir"
                              >
                                <Compass size={15} /> <span>Directions</span>
                              </a>
                            </div>
                          </div>

                          {/* In-Stock items preview at this shop with match highlighting */}
                          <div className="loc-products-preview-row">
                            {node.products.map(prod => {
                              const q = searchQuery.toLowerCase().trim();
                              const isProductMatch = q && (
                                prod.name.toLowerCase().includes(q) ||
                                prod.material.toLowerCase().includes(q)
                              );

                              return (
                                <div 
                                  key={prod.id} 
                                  className={`preview-chip ${isProductMatch ? 'match-highlight' : ''}`}
                                  onClick={() => handleSelectProduct(prod, node)}
                                >
                                  <div className="preview-chip-text">
                                    <span className="preview-chip-name">
                                      {isProductMatch ? '★ ' : ''}{prod.name}
                                    </span>
                                    <span className="preview-chip-mat">Material: {prod.material}</span>
                                  </div>
                                  <span className="preview-chip-price">₹{prod.price}</span>
                                </div>
                              );
                            })}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* TAB 3: CRAFT RADAR & MAP */}
        {!subView && activeTab === 'RADAR_MAP' && (
          <div className="tab-pane radar-pane">
            <CraftRadarMap
              nodes={filteredNodes.length > 0 ? filteredNodes : TRICHY_VERIFIED_ECOSYSTEM}
              selectedNodeId={selectedShop?.id}
              onSelectShop={(node) => handleSelectShop(node)}
            />
          </div>
        )}

        {/* TAB 4: LIVING CRAFT TRAILS */}
        {!subView && activeTab === 'CRAFT_TRAILS' && (
          <div className="tab-pane trails-pane">
            <div className="trails-header-banner">
              <h2>Cauvery Delta Living Heritage Craft Trails</h2>
              <p>Curated driving and walking itineraries connecting master kilns, pit-loom cooperatives, and temple foundries</p>
            </div>

            <div className="trails-cards-grid">
              {/* Trail 1: Woraiyur Ancient Handloom Circuit */}
              <div className="curated-trail-card">
                <div className="trail-meta-strip">
                  <span className="trail-pill">🧵 Handloom Heritage</span>
                  <span className="trail-pill">📍 3 Stops • 4.2 km</span>
                </div>
                <h3>Woraiyur Chola Heritage Handloom Trail</h3>
                <p>Walk through the ancient weaver lanes of Woraiyur where Sangam poets praised fabrics sheer as morning mist.</p>
                <div className="trail-stops-bullets">
                  <div className="bullet-row"><span className="bullet-idx">1</span> Tiruchirappalli Handloom Weavers CS (Panchavarnaswamy Koil)</div>
                  <div className="bullet-row"><span className="bullet-idx">2</span> Woraiyur Devanga Handloom Weavers CS (Pit-Looms)</div>
                  <div className="bullet-row"><span className="bullet-idx">3</span> CO-OPTEX Pothigai Showroom (Central Bus Stand)</div>
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Woraiyur+Devanga+Handloom+Weavers+Cooperative+Society"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-trail-open"
                >
                  <Compass size={15} /> <span>Start Driving Navigation</span>
                </a>
              </div>

              {/* Trail 2: Puthur & Varaganeri Terracotta Odyssey */}
              <div className="curated-trail-card">
                <div className="trail-meta-strip">
                  <span className="trail-pill">🏺 Pottery & Kilns</span>
                  <span className="trail-pill">📍 3 Stops • 5.1 km</span>
                </div>
                <h3>Cauvery Riverbed Alluvial Pottery Odyssey</h3>
                <p>Discover kick-wheel pottery shaping, cooking handi beating, and straw pit firing in urban Trichy.</p>
                <div className="trail-stops-bullets">
                  <div className="bullet-row"><span className="bullet-idx">1</span> Pottery Shop Bishop Road (Puthur)</div>
                  <div className="bullet-row"><span className="bullet-idx">2</span> Pot Shop In Puthur (Cooking Handis)</div>
                  <div className="bullet-row"><span className="bullet-idx">3</span> Plant Pot Shop Varaganeri (Terracotta Planters)</div>
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=63A+Bishop+Road+Puthur+Tiruchirappalli"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-trail-open"
                >
                  <Compass size={15} /> <span>Start Driving Navigation</span>
                </a>
              </div>

              {/* Trail 3: Srirangam Temple Bronzecraft & Sacred Carving */}
              <div className="curated-trail-card">
                <div className="trail-meta-strip">
                  <span className="trail-pill">🗿 Sacred Sculptures</span>
                  <span className="trail-pill">📍 3 Stops • 6.8 km</span>
                </div>
                <h3>Srirangam Temple Bell-Metal & Stone Circuit</h3>
                <p>Experience lost-wax bronze casting, monolithic granite stone carving, and embossed Thanjavur plates.</p>
                <div className="trail-stops-bullets">
                  <div className="bullet-row"><span className="bullet-idx">1</span> Karuppaiah Sculptures (Kandi Street, Srirangam)</div>
                  <div className="bullet-row"><span className="bullet-idx">2</span> Bambi Crafts (Nelson Road, Srirangam)</div>
                  <div className="bullet-row"><span className="bullet-idx">3</span> Poompuhar Showroom (Singarathope)</div>
                </div>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Karuppaiah+Sculptures+Kandi+Street+Srirangam"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-trail-open"
                >
                  <Compass size={15} /> <span>Start Driving Navigation</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MY ORDERS & REQUESTS */}
        {!subView && activeTab === 'MY_ORDERS' && (
          <div className="tab-pane orders-pane">
            <div className="orders-header-strip">
              <h2>My Orders & Customizer Requests</h2>
              <p>Real-time lifecycle tracking of verified workshop reservations and custom pieces</p>
            </div>

            <div className="orders-stack">
              {activeOrders.map(order => {
                const STATUS_STEPS: ('Requested' | 'Accepted' | 'Preparing' | 'Ready for Pickup' | 'Completed')[] = [
                  'Requested',
                  'Accepted',
                  'Preparing',
                  'Ready for Pickup',
                  'Completed'
                ];
                const currentIdx = STATUS_STEPS.indexOf(order.status);

                return (
                  <div key={order.id} className="order-progress-card">
                    <div className="order-meta-head">
                      <div>
                        <span className="order-ref-badge">{order.id}</span>
                        <span className="order-tag">
                          {order.type === 'custom_commission' ? '🎨 Custom Commission' : '🛍️ Direct Purchase'}
                        </span>
                      </div>
                      <span className="order-time">{order.timestamp}</span>
                    </div>

                    <div className="order-content-grid">
                      <div>
                        <h3 className="order-name">{order.productName}</h3>
                        <p className="order-shop">Workshop: <strong>{order.shopName}</strong></p>
                        <p className="order-addr"><MapPin size={13} /> {order.shopAddress}</p>
                        <p className="order-phone"><Phone size={13} /> Contact: {order.shopPhone}</p>

                        {order.customizationText && (
                          <div className="custom-text-quote">
                            <strong>Custom Inscription:</strong> "{order.customizationText}"
                          </div>
                        )}
                      </div>

                      <div className="order-price-pane">
                        <span className="amount-label">Total Payable</span>
                        <span className="amount-number">₹{order.price.toLocaleString()}</span>
                        <span className="qty-note">Quantity: {order.quantity}</span>
                        <span className="mode-pill">
                          {order.fulfilmentMode === 'pickup' ? '🏪 Direct Workshop Pickup' : '🚚 Van Delivery'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Progression Stepper */}
                    <div className="lifecycle-stepper-box">
                      <div className="stepper-label">Fulfillment Status Progression:</div>
                      <div className="stepper-dots-row">
                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;

                          return (
                            <div key={step} className={`step-dot-wrap ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                              <div className="step-circle">{isDone ? '✓' : idx + 1}</div>
                              <span className="step-text">{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="order-foot-actions">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shopAddress)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-order-navigate"
                      >
                        <Compass size={14} /> Get Directions to Workshop
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: CRAFT PASSPORTS ARCHIVE */}
        {!subView && activeTab === 'CRAFT_PASSPORTS' && (
          <div className="tab-pane passports-pane">
            <div className="passports-header-strip">
              <h2>Saved Craft Passports & Provenance Certificates</h2>
              <p>Cryptographic physical-to-digital certificates verifying authentic GI origins, raw material purity, and artisan lineage</p>
            </div>

            <div className="passports-catalog-grid">
              {TRICHY_VERIFIED_ECOSYSTEM.flatMap(node => node.products.map(p => ({ node, product: p }))).map(({ node, product }) => (
                <div key={product.id} className="passport-preview-box">
                  <div className="passport-box-top">
                    <span className="gi-tag">Official GI Provenance</span>
                    <span className="cert-hash">{product.passport?.certId || 'TN-TRY-001'}</span>
                  </div>
                  <h4>{product.name}</h4>
                  <p className="maker-name">Maker: {product.passport?.artisanName || node.name}</p>
                  <p className="origin-name">📍 {node.address}</p>
                  <div className="materials-snippet">
                    <strong>Materials:</strong> {product.passport?.rawMaterials || product.material}
                  </div>
                  <button 
                    className="btn-inspect-passport-qr"
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedShop(node);
                      setPassportViewProduct(product);
                      setSubView('PASSPORT_MODAL');
                    }}
                  >
                    <QrCode size={15} /> <span>Inspect Digital Passport & QR</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
