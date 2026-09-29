import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { EcosystemNode, NodeType } from './trichyEcosystemData';
import { NODE_TYPE_CONFIG, getDistanceFromTrichyCenter } from './trichyEcosystemData';
import { MapPin, Flame, Store, Compass, X, ChevronRight } from 'lucide-react';

interface CraftRadarMapProps {
  nodes: EcosystemNode[];
  selectedNodeId?: string | null;
  onSelectShop: (node: EcosystemNode) => void;
}

export default function CraftRadarMap({
  nodes,
  selectedNodeId,
  onSelectShop
}: CraftRadarMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);

  const [mapMode, setMapMode] = useState<'locations' | 'heatmap'>('locations');
  const [activeDrawerNode, setActiveDrawerNode] = useState<EcosystemNode | null>(null);
  const [filterType, setFilterType] = useState<NodeType | 'all'>('all');

  // Initialize Map
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || mapInstanceRef.current) return;

    // Reset any lingering leaflet id from strict mode remount
    if ((container as unknown as { _leaflet_id?: number })._leaflet_id) {
      delete (container as unknown as { _leaflet_id?: number })._leaflet_id;
    }

    let map: L.Map | null = null;
    try {
      // Centered on Tiruchirappalli
      map = L.map(container, {
        center: [10.8200, 78.6900],
        zoom: 12,
        minZoom: 10,
        maxZoom: 18,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Warm sepia CSS filter on OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors • Tiruchirappalli Craft Radar',
        maxZoom: 19,
        className: 'sepia-craft-tiles'
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      const heatmapLayer = L.layerGroup();

      markersLayerRef.current = markersLayer;
      heatmapLayerRef.current = heatmapLayer;
      mapInstanceRef.current = map;
    } catch (err) {
      console.warn('Leaflet initialization recovered:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (container) {
        delete (container as unknown as { _leaflet_id?: number })._leaflet_id;
      }
    };
  }, []);

  // Update Markers or Heatmap
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !heatmapLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    heatmapLayerRef.current.clearLayers();

    const filteredNodes = filterType === 'all' 
      ? nodes 
      : nodes.filter(n => n.nodeType === filterType);

    if (mapMode === 'locations') {
      if (map.hasLayer(heatmapLayerRef.current)) {
        map.removeLayer(heatmapLayerRef.current);
      }
      if (!map.hasLayer(markersLayerRef.current)) {
        map.addLayer(markersLayerRef.current);
      }

      // Render custom pins strictly colored by node classification
      filteredNodes.forEach(node => {
        const config = NODE_TYPE_CONFIG[node.nodeType];
        const isSelected = selectedNodeId === node.id || activeDrawerNode?.id === node.id;
        const distance = getDistanceFromTrichyCenter(node.lat, node.lng);

        // Icon symbol based on classification
        let iconSymbol = '🏺';
        if (node.nodeType === 'cooperative') iconSymbol = '🧵';
        else if (node.category === 'woodcraft') iconSymbol = '🪵';
        else if (node.nodeType === 'aggregator' || node.nodeType === 'wholesaler') iconSymbol = '📦';
        else if (node.nodeType === 'retailer') iconSymbol = '🛍️';
        else if (node.nodeType === 'government') iconSymbol = '🏛️';

        const markerHtml = `
          <div class="radar-node-pin ${isSelected ? 'selected-pin' : ''}" style="--pin-color: ${config.color}">
            <div class="pin-bubble" style="background-color: ${config.color};">
              <span class="pin-symbol">${iconSymbol}</span>
            </div>
            <div class="pin-stem" style="border-top-color: ${config.color};"></div>
            <div class="pin-label">${node.name.split(' ')[0]}</div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-node-icon',
          html: markerHtml,
          iconSize: [44, 48],
          iconAnchor: [22, 44],
          popupAnchor: [0, -42]
        });

        const marker = L.marker([node.lat, node.lng], { icon: customIcon });

        marker.on('click', () => {
          setActiveDrawerNode(node);
        });

        marker.bindTooltip(`
          <div class="marker-preview-tooltip">
            <strong style="color: ${config.color}; font-size: 0.85rem;">${node.name}</strong><br/>
            <span style="font-size: 0.75rem; color: #5C5753;">${config.label} • ${node.speciality}</span><br/>
            <small style="color: #8C8781;">📍 ${distance} km from center • ${node.products.length} in-stock item(s)</small>
          </div>
        `, { direction: 'top', offset: [0, -40] });

        marker.addTo(markersLayerRef.current!);
      });

    } else {
      // Heatmap Density Mode
      if (map.hasLayer(markersLayerRef.current)) {
        map.removeLayer(markersLayerRef.current);
      }
      if (!map.hasLayer(heatmapLayerRef.current)) {
        map.addLayer(heatmapLayerRef.current);
      }

      // Hotspot 1: Woraiyur Handloom Belt (High Concentration)
      const woraiyurHotspot = L.circle([10.8340, 78.6830], {
        radius: 1800,
        color: '#1D3557',
        fillColor: '#1D3557',
        fillOpacity: 0.38,
        weight: 2
      }).bindTooltip('🔥 <strong>Woraiyur Weaving Belt</strong><br/>High density of registered Handloom pit-looms (Click to inspect)').addTo(heatmapLayerRef.current);
      
      woraiyurHotspot.on('click', () => {
        map.setView([10.8340, 78.6830], 14, { animate: true });
        setMapMode('locations');
      });

      // Hotspot 2: Musiri & Manamedu Cauvery Handloom & Terracotta
      const manameduHotspot = L.circle([10.9130, 78.5320], {
        radius: 3500,
        color: '#2D6A4F',
        fillColor: '#2D6A4F',
        fillOpacity: 0.35,
        weight: 2
      }).bindTooltip('🔥 <strong>Manamedu & Musiri Delta Hub</strong><br/>Major cluster of cooperative pit-looms & river clay kilns').addTo(heatmapLayerRef.current);

      manameduHotspot.on('click', () => {
        map.setView([10.9130, 78.5320], 13, { animate: true });
        setMapMode('locations');
      });

      // Hotspot 3: Puthur & Bishop Road Pottery Cluster
      const puthurHotspot = L.circle([10.8155, 78.6835], {
        radius: 1200,
        color: '#B24322',
        fillColor: '#C85A32',
        fillOpacity: 0.4,
        weight: 2
      }).bindTooltip('🔥 <strong>Puthur Pottery Cluster</strong><br/>Independent potter wheel workshops & cooking earthenware').addTo(heatmapLayerRef.current);

      puthurHotspot.on('click', () => {
        map.setView([10.8155, 78.6835], 15, { animate: true });
        setMapMode('locations');
      });

      // Hotspot 4: Srirangam Temple Crafts & Sacred Bronze
      const srirangamHotspot = L.circle([10.8640, 78.6940], {
        radius: 1600,
        color: '#7209B7',
        fillColor: '#7209B7',
        fillOpacity: 0.3,
        weight: 2
      }).bindTooltip('🔥 <strong>Srirangam Temple Artisans</strong><br/>Sacred stone carving, bronze icons & temple souvenirs').addTo(heatmapLayerRef.current);

      srirangamHotspot.on('click', () => {
        map.setView([10.8640, 78.6940], 14, { animate: true });
        setMapMode('locations');
      });

      // Individual density rings for all 23 nodes
      nodes.forEach(node => {
        const config = NODE_TYPE_CONFIG[node.nodeType];
        L.circle([node.lat, node.lng], {
          radius: 450,
          color: config.color,
          fillColor: config.color,
          fillOpacity: 0.5,
          weight: 1
        }).bindTooltip(`${node.name} (${config.label})`).addTo(heatmapLayerRef.current!);
      });
    }

  }, [nodes, mapMode, filterType, selectedNodeId, activeDrawerNode]);

  // Center on selected node if passed
  useEffect(() => {
    if (selectedNodeId && mapInstanceRef.current) {
      const match = nodes.find(n => n.id === selectedNodeId);
      if (match) {
        mapInstanceRef.current.setView([match.lat, match.lng], 14, { animate: true });
        setActiveDrawerNode(match);
      }
    }
  }, [selectedNodeId, nodes]);

  return (
    <div className="progressive-radar-container">
      {/* Top Header Controls Bar */}
      <div className="radar-header-bar">
        <div className="radar-title-stack">
          <span className="radar-kicker">CRAFT RADAR • LOCATION-AWARE GRID</span>
          <h3 className="radar-h3">Verified Artisan Nodes in Tiruchirappalli</h3>
        </div>

        {/* Mode Switcher */}
        <div className="radar-controls-right">
          <div className="radar-mode-pills">
            <button
              className={`mode-pill ${mapMode === 'locations' ? 'active' : ''}`}
              onClick={() => setMapMode('locations')}
            >
              <MapPin size={14} /> 📍 Locations View
            </button>
            <button
              className={`mode-pill ${mapMode === 'heatmap' ? 'active' : ''}`}
              onClick={() => setMapMode('heatmap')}
            >
              <Flame size={14} /> 🔥 Craft Density Heatmap
            </button>
          </div>
        </div>
      </div>

      {/* Filter by Node Classification (Maker, Cooperative, Wholesaler, Government, Retailer) */}
      <div className="classification-filter-bar">
        <button
          className={`filter-node-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All 23 Nodes
        </button>
        <button
          className={`filter-node-btn maker ${filterType === 'maker' ? 'active' : ''}`}
          onClick={() => setFilterType('maker')}
        >
          🟢 Makers (10)
        </button>
        <button
          className={`filter-node-btn coop ${filterType === 'cooperative' ? 'active' : ''}`}
          onClick={() => setFilterType('cooperative')}
        >
          🔵 Cooperatives (5)
        </button>
        <button
          className={`filter-node-btn agg ${filterType === 'aggregator' ? 'active' : ''}`}
          onClick={() => setFilterType('aggregator')}
        >
          🟠 Aggregators / Wholesalers (3)
        </button>
        <button
          className={`filter-node-btn gov ${filterType === 'government' ? 'active' : ''}`}
          onClick={() => setFilterType('government')}
        >
          ⚫ Government (2)
        </button>
        <button
          className={`filter-node-btn ret ${filterType === 'retailer' ? 'active' : ''}`}
          onClick={() => setFilterType('retailer')}
        >
          🟣 Retailers (3)
        </button>
      </div>

      {/* Map Canvas */}
      <div className="radar-map-frame">
        <div ref={mapContainerRef} className="leaflet-radar-map-canvas" />

        {/* Legend */}
        <div className="radar-legend">
          <span className="legend-entry"><span className="dot maker-dot"></span> 🟢 Maker</span>
          <span className="legend-entry"><span className="dot coop-dot"></span> 🔵 Cooperative</span>
          <span className="legend-entry"><span className="dot agg-dot"></span> 🟠 Aggregator</span>
          <span className="legend-entry"><span className="dot ret-dot"></span> 🟣 Retailer</span>
          <span className="legend-entry"><span className="dot gov-dot"></span> ⚫ Government</span>
        </div>

        {/* Bottom Slide-Up Drawer when Node is Clicked */}
        {activeDrawerNode && (
          <div className="node-slide-card">
            <button 
              className="card-close-x" 
              onClick={() => setActiveDrawerNode(null)}
              aria-label="Close details"
            >
              <X size={16} />
            </button>

            <div className="card-top-row">
              <span 
                className="classification-pill"
                style={{ 
                  backgroundColor: NODE_TYPE_CONFIG[activeDrawerNode.nodeType].bg,
                  color: NODE_TYPE_CONFIG[activeDrawerNode.nodeType].color 
                }}
              >
                {NODE_TYPE_CONFIG[activeDrawerNode.nodeType].iconEmoji} {NODE_TYPE_CONFIG[activeDrawerNode.nodeType].label.toUpperCase()}
              </span>
              <span className="dist-badge">
                📍 {getDistanceFromTrichyCenter(activeDrawerNode.lat, activeDrawerNode.lng)} km away
              </span>
            </div>

            <h4 className="node-name">{activeDrawerNode.name}</h4>
            <p className="node-spec">{activeDrawerNode.speciality}</p>
            <p className="node-addr">{activeDrawerNode.address}</p>

            <div className="card-actions-row">
              <button
                className="btn-open-shop"
                onClick={() => onSelectShop(activeDrawerNode)}
              >
                <Store size={15} />
                <span>View Shop & In-Stock Products</span>
                <ChevronRight size={15} />
              </button>

              <a
                href={activeDrawerNode.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dir-maps"
                title="Google Maps"
              >
                <Compass size={15} /> <span>Directions</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
