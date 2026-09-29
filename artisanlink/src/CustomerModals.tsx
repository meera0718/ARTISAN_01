import React, { useState } from 'react';
import type { Product, Workshop, Commission } from './customerData';
import { 
  X, 
  Sparkles, 
  Mic, 
  MicOff, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  MapPin, 
  Phone, 
  ShoppingBag, 
  Download,
  Layers,
  Award
} from 'lucide-react';

/* -------------------------------------------------------------
 * 1. "MAKE IT YOURS" CRAFT CUSTOMIZER MODAL
 * ------------------------------------------------------------- */
interface CustomizerModalProps {
  product: Product;
  onClose: () => void;
  onSubmitCommission: (newCommission: Commission) => void;
}

export function CustomizerModal({ product, onClose, onSubmitCommission }: CustomizerModalProps) {
  const [selectedFinish, setSelectedFinish] = useState('Natural Earthen');
  const [customText, setCustomText] = useState('');
  const [selectedSize, setSelectedSize] = useState<'Standard' | 'Large'>('Standard');
  const [quantity, setQuantity] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tamil quick suggestion chips
  const TAMIL_SUGGESTIONS = [
    { label: 'நல்வரவு (Welcome)', text: 'நல்வரவு' },
    { label: 'மங்கலம் (Auspicious)', text: 'மங்கலம் பொங்கட்டும்' },
    { label: 'ஓம் (Sacred Om)', text: 'ஓம்' },
    { label: 'திருச்சி கைவினை (Trichy Craft)', text: 'திருச்சி கைவினை 2026' },
    { label: 'வாழ்க வளமுடன் (Prosperity)', text: 'வாழ்க வளமுடன்' }
  ];

  const sizeExtra = selectedSize === 'Large' ? 350 : 0;
  const totalPrice = (product.price + sizeExtra) * quantity;

  // Simulate voice recording & transcription
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setVoiceTranscript(
          `"Please engrave family name on the base in classical Tamil script. Prefer antique ${selectedFinish.toLowerCase()} tone for wedding altar display."`
        );
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const commissionId = `comm-${Date.now()}`;
    const newComm: Commission = {
      id: commissionId,
      title: `${product.name} — Bespoke Inscription`,
      artisanName: product.artisanName,
      cluster: product.cluster,
      status: 'Pending Artisan Review (Just Dispatched)',
      statusCode: 'pending',
      statusColor: '#C85A32',
      eta: 'Artisan will review within 4 business hours',
      progressPercent: 15,
      customText: customText || voiceTranscript || 'Custom bespoke specification',
      finish: selectedFinish,
      size: selectedSize,
      quantity,
      price: totalPrice,
      date: 'Just now'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitCommission(newComm);
      onClose();
    }, 700);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-container-card customizer-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header-strip">
          <div className="modal-header-title">
            <span className="modal-badge-pill">
              <Sparkles size={14} className="text-terracotta" /> Make It Yours • Bespoke Commission
            </span>
            <h2>Personalize Your Cauvery Craft</h2>
            <p className="modal-subtitle">Direct collaboration with {product.artisanName} ({product.cluster})</p>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="customizer-form">
          <div className="customizer-grid">
            {/* Left Col: Product Spec Summary */}
            <div className="customizer-summary-col">
              <div className="product-mini-preview">
                <img src={product.image} alt={product.name} className="product-mini-thumb" />
                <div className="mini-details">
                  <span className="mini-cluster">📍 {product.cluster} • {product.categoryLabel}</span>
                  <h4>{product.name}</h4>
                  <p className="mini-artisan">Crafted by: {product.artisanName}</p>
                  <div className="mini-price">
                    ₹{product.price.toLocaleString()} <span className="base-label">(Base price)</span>
                  </div>
                </div>
              </div>

              {/* Verified Artisan Badge */}
              <div className="artisan-trust-card">
                <ShieldCheck size={28} className="text-forest" />
                <div>
                  <h5>Direct Master Artisan Guarantee</h5>
                  <p>Zero middlemen. 100% of customizer remuneration reaches {product.artisanName} directly.</p>
                </div>
              </div>

              {/* Total Price Calculator */}
              <div className="customizer-cost-breakdown">
                <div className="breakdown-row">
                  <span>Base Unit Cost:</span>
                  <span>₹{product.price}</span>
                </div>
                {selectedSize === 'Large' && (
                  <div className="breakdown-row">
                    <span>Large Size Premium:</span>
                    <span>+₹350</span>
                  </div>
                )}
                <div className="breakdown-row">
                  <span>Quantity:</span>
                  <span>× {quantity}</span>
                </div>
                <div className="breakdown-total">
                  <span>Total Estimated Price:</span>
                  <span className="total-amount">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="advance-note">
                  🛡️ No payment charged now. Artisan reviews and accepts bespoke feasibility first.
                </div>
              </div>
            </div>

            {/* Right Col: Customizer Controls */}
            <div className="customizer-controls-col">
              {/* 1. Finish Selection */}
              <div className="form-field-group">
                <label className="field-label">1. Choose Surface Finish / Patina</label>
                <div className="pill-choice-row">
                  {['Natural Earthen', 'Antique Patina', 'Smoke Black'].map(finish => (
                    <button
                      type="button"
                      key={finish}
                      className={`choice-pill ${selectedFinish === finish ? 'active' : ''}`}
                      onClick={() => setSelectedFinish(finish)}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Custom Text / Tamil & English Inscription */}
              <div className="form-field-group">
                <label className="field-label">
                  2. Custom Inscription / Family Crest (Tamil & English)
                </label>
                <input
                  type="text"
                  className="custom-text-input"
                  placeholder="e.g. நல்வரவு or Sundar Family Heirloom 2026..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                />
                
                {/* Tamil Suggestion Chips */}
                <div className="tamil-suggestions-box">
                  <span className="suggestion-hint">Suggested Tamil Inscriptions:</span>
                  <div className="suggestion-chips">
                    {TAMIL_SUGGESTIONS.map(s => (
                      <button
                        type="button"
                        key={s.text}
                        className="suggestion-chip"
                        onClick={() => setCustomText(s.text)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Size & Quantity Row */}
              <div className="form-row-dual">
                <div className="form-field-group">
                  <label className="field-label">3. Dimension / Size</label>
                  <div className="pill-choice-row">
                    <button
                      type="button"
                      className={`choice-pill ${selectedSize === 'Standard' ? 'active' : ''}`}
                      onClick={() => setSelectedSize('Standard')}
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      className={`choice-pill ${selectedSize === 'Large' ? 'active' : ''}`}
                      onClick={() => setSelectedSize('Large')}
                    >
                      Large (+₹350)
                    </button>
                  </div>
                </div>

                <div className="form-field-group">
                  <label className="field-label">Quantity</label>
                  <div className="quantity-counter">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <span className="qty-val">{quantity}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Voice Instructions Simulator */}
              <div className="form-field-group">
                <label className="field-label">4. Voice Instruction to Artisan (Tamil or English)</label>
                <div className="voice-recorder-card">
                  <button
                    type="button"
                    className={`voice-btn ${isRecording ? 'recording' : ''}`}
                    onClick={toggleRecording}
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                    <span>{isRecording ? 'Listening to voice...' : '🎙 Describe your requirement'}</span>
                  </button>
                  {isRecording && (
                    <div className="audio-wave-animation">
                      <span className="bar"></span>
                      <span className="bar"></span>
                      <span className="bar"></span>
                      <span className="bar"></span>
                      <span className="bar"></span>
                    </div>
                  )}
                </div>
                {voiceTranscript && (
                  <div className="voice-transcript-result">
                    <small>Auto-transcribed requirement:</small>
                    <p>{voiceTranscript}</p>
                  </div>
                )}
              </div>

              {/* 5. Reference Sketch Upload */}
              <div className="form-field-group">
                <label className="field-label">5. Optional Reference Photo or Motifs</label>
                <label className="image-upload-dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden-file-input"
                  />
                  {uploadedImagePreview ? (
                    <div className="uploaded-preview">
                      <img src={uploadedImagePreview} alt="Reference" />
                      <span>✓ Reference motif attached (Click to change)</span>
                    </div>
                  ) : (
                    <div className="dropzone-inner">
                      <Upload size={18} className="text-secondary" />
                      <span>Upload design sketch or monogram (PNG/JPG)</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Submit CTA */}
              <div className="modal-cta-row">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit-commission"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Dispatching to {product.artisanName}...</span>
                  ) : (
                    <span>🎨 Send Custom Request (₹{totalPrice.toLocaleString()})</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


/* -------------------------------------------------------------
 * 2. "CRAFT PASSPORT" TRACE THE MAKER QR MODAL
 * ------------------------------------------------------------- */
interface CraftPassportModalProps {
  product: Product;
  onClose: () => void;
}

export function CraftPassportModal({ product, onClose }: CraftPassportModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(product.passport.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-container-card passport-modal" onClick={e => e.stopPropagation()}>
        {/* Passport Certificate Frame */}
        <div className="passport-certificate-wrapper">
          {/* Certificate Header Banner */}
          <div className="passport-gold-seal-header">
            <div className="seal-emblem">
              <Award size={32} className="text-gold" />
            </div>
            <div className="seal-titles">
              <span className="gov-header-tag">GOVERNMENT OF TAMIL NADU • HANDICRAFT PROVENANCE REGISTRY</span>
              <h2 className="passport-heading">OFFICIAL CRAFT PASSPORT</h2>
              <p className="passport-sub">Geographical Indication & Artisan Identity Verification Certificate</p>
            </div>
            <button className="modal-close-icon" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>

          {/* Certificate Content Grid */}
          <div className="passport-body-grid">
            {/* Left QR Column */}
            <div className="passport-qr-column">
              <div className="qr-code-frame">
                {/* Pure SVG QR Code visual with artisan motif */}
                <svg className="svg-qr-code" viewBox="0 0 160 160" width="160" height="160">
                  <rect width="160" height="160" fill="#FFFFFF" rx="8" />
                  {/* Top-Left Finder */}
                  <rect x="15" y="15" width="40" height="40" fill="#1C1917" rx="4" />
                  <rect x="23" y="23" width="24" height="24" fill="#FFFFFF" rx="2" />
                  <rect x="29" y="29" width="12" height="12" fill="#C85A32" rx="1" />
                  {/* Top-Right Finder */}
                  <rect x="105" y="15" width="40" height="40" fill="#1C1917" rx="4" />
                  <rect x="113" y="23" width="24" height="24" fill="#FFFFFF" rx="2" />
                  <rect x="119" y="29" width="12" height="12" fill="#C85A32" rx="1" />
                  {/* Bottom-Left Finder */}
                  <rect x="15" y="105" width="40" height="40" fill="#1C1917" rx="4" />
                  <rect x="23" y="113" width="24" height="24" fill="#FFFFFF" rx="2" />
                  <rect x="29" y="119" width="12" height="12" fill="#C85A32" rx="1" />
                  {/* Grid Dots */}
                  <rect x="65" y="20" width="10" height="10" fill="#1C1917" />
                  <rect x="85" y="20" width="10" height="10" fill="#1C1917" />
                  <rect x="65" y="40" width="10" height="10" fill="#C85A32" />
                  <rect x="85" y="50" width="10" height="10" fill="#1C1917" />
                  <rect x="20" y="65" width="10" height="10" fill="#1C1917" />
                  <rect x="40" y="75" width="10" height="10" fill="#1C1917" />
                  <rect x="65" y="65" width="30" height="30" fill="#B24322" rx="4" />
                  {/* Center Emblem in QR */}
                  <circle cx="80" cy="80" r="10" fill="#FFFFFF" />
                  <circle cx="80" cy="80" r="6" fill="#C85A32" />
                  {/* Additional patterns */}
                  <rect x="105" y="65" width="10" height="10" fill="#1C1917" />
                  <rect x="125" y="80" width="10" height="10" fill="#1C1917" />
                  <rect x="65" y="105" width="10" height="10" fill="#1C1917" />
                  <rect x="85" y="115" width="10" height="10" fill="#C85A32" />
                  <rect x="105" y="115" width="20" height="10" fill="#1C1917" />
                  <rect x="130" y="130" width="15" height="15" fill="#1C1917" />
                </svg>
                <span className="scan-me-label">Scan to verify cryptographic ledger record</span>
              </div>

              <div className="passport-hash-strip">
                <span className="hash-label">Ledger Provenance ID</span>
                <code className="hash-code">{product.passport.hash}</code>
                <button className="copy-hash-btn" onClick={handleCopyHash}>
                  {copied ? '✓ Copied' : 'Copy Hash'}
                </button>
              </div>

              <div className="cert-seal-badge">
                <ShieldCheck size={20} className="text-forest" />
                <span>GI Verified • Tamper Proof</span>
              </div>
            </div>

            {/* Right Provenance Specifications */}
            <div className="passport-specs-column">
              <div className="spec-item-group">
                <span className="spec-label">Artisan Master & Guild</span>
                <h4 className="spec-value-main">{product.artisanName}</h4>
                <p className="spec-sub">{product.passport.artisanLinage}</p>
              </div>

              <div className="spec-grid-dual">
                <div className="spec-item">
                  <span className="spec-label">Geographic Provenance</span>
                  <p className="spec-val">📍 {product.passport.origin}</p>
                  <small className="geo-coords">GPS: {product.coordinates[0]}° N, {product.coordinates[1]}° E</small>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Official Registry Certificate</span>
                  <p className="spec-val font-mono">🔖 {product.passport.govtCertNo}</p>
                  <small className="seal-time">Timestamp: {product.passport.sealTimestamp}</small>
                </div>
              </div>

              <div className="spec-item-group">
                <span className="spec-label">Certified Single-Origin Raw Materials</span>
                <p className="spec-val-highlight">{product.passport.materials}</p>
              </div>

              <div className="spec-item-group">
                <span className="spec-label">Heritage Craft Technique</span>
                <p className="spec-val">{product.passport.technique}</p>
              </div>

              <div className="blockchain-guarantee-box">
                <Layers size={18} className="text-indigo" />
                <p>
                  This item's physical batch and raw mineral extracts have been certified by regional craft coordinators. Verified authentic Indian handloom & handicraft.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="passport-actions-row">
                <button className="btn-download-passport" onClick={handleDownload}>
                  <Download size={16} />
                  {downloadSuccess ? '✓ Certificate Saved' : 'Download Digital Certificate'}
                </button>
                <a
                  href={`https://maps.google.com/?q=${product.coordinates[0]},${product.coordinates[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-verify-location"
                >
                  <MapPin size={16} /> View Origin Workshop
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* -------------------------------------------------------------
 * 3. SHOP PAGE & CONTEXTUAL CRAFT TRAIL MODAL
 * ------------------------------------------------------------- */
interface ShopAndTrailModalProps {
  workshop: Workshop;
  onClose: () => void;
  onCustomizeProduct: (product: Product) => void;
  onOrderProduct: (product: Product) => void;
  products: Product[];
}

export function ShopAndTrailModal({
  workshop,
  onClose,
  onCustomizeProduct,
  onOrderProduct,
  products
}: ShopAndTrailModalProps) {
  const [trailStarted, setTrailStarted] = useState(false);
  const workshopProducts = products.filter(p => p.workshopId === workshop.id || p.cluster === workshop.cluster);

  const handleStartTrail = () => {
    setTrailStarted(true);
    const destinationUrl = `https://www.google.com/maps/dir/?api=1&destination=${workshop.coordinates[0]},${workshop.coordinates[1]}`;
    window.open(destinationUrl, '_blank');
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-container-card shop-trail-modal" onClick={e => e.stopPropagation()}>
        {/* Hero Banner of Workshop */}
        <div className="shop-hero-banner" style={{ backgroundImage: `linear-gradient(to bottom, rgba(28, 25, 23, 0.4), rgba(28, 25, 23, 0.9)), url(${workshop.image})` }}>
          <button className="shop-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
          
          <div className="shop-hero-content">
            <div className="shop-pill-row">
              <span className="shop-badge-gold">
                <ShieldCheck size={14} /> {workshop.badge}
              </span>
              <span className="shop-status-pill">
                {workshop.isOpen ? '🟢 Open for Visitors' : 'Closed'} • {workshop.distanceKm} km away
              </span>
            </div>
            <h2 className="shop-hero-title">{workshop.name}</h2>
            <p className="shop-hero-artisan">Lead Artisan: <strong>{workshop.artisanName}</strong> • {workshop.cluster} Cluster</p>
            <p className="shop-address"><MapPin size={14} /> {workshop.address}</p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="shop-modal-body">
          {/* Section 1: Artisan Bio & Provenance */}
          <div className="shop-bio-section">
            <div className="bio-col">
              <h4 className="section-subheading">About the Workshop</h4>
              <p className="bio-text">{workshop.bio}</p>
              <div className="materials-meta">
                <strong>Authentic Materials:</strong> {workshop.materials}
              </div>
            </div>
            <div className="contact-col">
              <div className="contact-box">
                <div className="contact-item">
                  <Phone size={15} /> <span>{workshop.phone}</span>
                </div>
                <div className="contact-item">
                  <Compass size={15} /> <span>Cauvery Basin Trail Stop #{workshop.trailStopNumber}</span>
                </div>
                <button className="btn-call-artisan" onClick={() => window.open(`tel:${workshop.phone}`)}>
                  Direct Artisan Contact
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: LIVING CRAFT TRAIL ITINERARY */}
          <div className="living-trail-section">
            <div className="trail-section-header">
              <div>
                <span className="trail-tag">LIVING HERITAGE WORKSHOP WALK</span>
                <h3 className="trail-title">{workshop.trailTitle}</h3>
              </div>
              <button 
                className={`btn-start-trail ${trailStarted ? 'started' : ''}`}
                onClick={handleStartTrail}
              >
                <Compass size={16} />
                {trailStarted ? 'Navigation Opened in Google Maps' : '🧭 Start Walking / Driving Trail'}
              </button>
            </div>

            {/* 4 Steps Itinerary Flow */}
            <div className="trail-steps-grid">
              {workshop.trailSteps.map(stepItem => (
                <div key={stepItem.step} className="trail-step-card">
                  <div className="step-number-bubble">Step {stepItem.step}</div>
                  <h5 className="step-title">{stepItem.title}</h5>
                  <p className="step-desc">{stepItem.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: LIVE WORKSHOP STOCK */}
          <div className="shop-stock-section">
            <div className="stock-header">
              <h3 className="stock-title">Available Products at this Workshop ({workshopProducts.length})</h3>
              <span className="stock-subtitle">Handmade items currently ready for direct purchase or custom order</span>
            </div>

            <div className="shop-products-grid">
              {workshopProducts.map(prod => (
                <div key={prod.id} className="shop-product-card">
                  <img src={prod.image} alt={prod.name} className="shop-prod-img" />
                  <div className="shop-prod-info">
                    <span className="shop-prod-badge">{prod.categoryEmoji} {prod.categoryLabel}</span>
                    <h5 className="shop-prod-title">{prod.name}</h5>
                    <p className="shop-prod-price">₹{prod.price.toLocaleString()} • <span className="stock-status">{prod.stock} in stock</span></p>
                    
                    <div className="shop-prod-actions">
                      <button 
                        className="btn-shop-customize"
                        onClick={() => {
                          onClose();
                          onCustomizeProduct(prod);
                        }}
                      >
                        🎨 Customize
                      </button>
                      <button 
                        className="btn-shop-buy"
                        onClick={() => {
                          onClose();
                          onOrderProduct(prod);
                        }}
                      >
                        🛒 Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* -------------------------------------------------------------
 * 4. INSTANT ORDER / DIRECT CHECKOUT MODAL
 * ------------------------------------------------------------- */
interface OrderModalProps {
  product: Product;
  onClose: () => void;
  onConfirmOrder: (product: Product, quantity: number) => void;
}

export function OrderModal({ product, onClose, onConfirmOrder }: OrderModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 4B, Cauvery Palms, Thillai Nagar, Trichy - 620018');
  const [paymentMode, setPaymentMode] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const total = product.price * quantity;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      onConfirmOrder(product, quantity);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-container-card order-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header-strip">
          <div>
            <span className="modal-badge-pill">
              <ShoppingBag size={14} className="text-terracotta" /> Direct Artisan Purchase
            </span>
            <h2>Confirm Your Craft Order</h2>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {orderComplete ? (
          <div className="order-success-view">
            <CheckCircle2 size={54} className="text-forest" />
            <h3>Order Dispatched to {product.workshopName}!</h3>
            <p>Your order ID <strong>#TR-ORD-{Math.floor(1000 + Math.random() * 9000)}</strong> has been registered. The artisan is packing your item with organic craft packaging.</p>
            <div className="success-cluster-badge">
              Cluster Van Dispatches Tomorrow from {product.cluster}
            </div>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="order-form">
            <div className="order-product-card">
              <img src={product.image} alt={product.name} className="order-prod-thumb" />
              <div className="order-prod-details">
                <h4>{product.name}</h4>
                <p className="order-artisan">{product.artisanName} • {product.cluster}</p>
                <div className="order-price-row">
                  <span className="price-tag">₹{product.price.toLocaleString()}</span>
                  <span className="stock-hint">({product.stock} pieces remaining)</span>
                </div>
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">Quantity</label>
              <div className="quantity-counter">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="qty-val">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="form-field-group">
              <label className="field-label">Delivery Address in Trichy / Delta</label>
              <textarea
                className="delivery-address-input"
                rows={2}
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
              />
            </div>

            <div className="form-field-group">
              <label className="field-label">Payment Method</label>
              <div className="payment-options">
                <label className={`payment-pill ${paymentMode === 'upi' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="pay"
                    value="upi"
                    checked={paymentMode === 'upi'}
                    onChange={() => setPaymentMode('upi')}
                  />
                  <span>⚡ Instant UPI (GPay / PhonePe)</span>
                </label>
                <label className={`payment-pill ${paymentMode === 'cod' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="pay"
                    value="cod"
                    checked={paymentMode === 'cod'}
                    onChange={() => setPaymentMode('cod')}
                  />
                  <span>🤝 Cash on Delivery / Workshop Pickup</span>
                </label>
              </div>
            </div>

            <div className="order-total-bar">
              <div className="total-left">
                <span className="total-lbl">Total Payable Amount:</span>
                <span className="total-val">₹{total.toLocaleString()}</span>
              </div>
              <button 
                type="submit" 
                className="btn-confirm-order"
                disabled={isProcessing}
              >
                {isProcessing ? 'Confirming with Workshop...' : `Place Direct Order (₹${total.toLocaleString()})`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
