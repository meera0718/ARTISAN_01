// context/ArtisanContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TRICHY_VERIFIED_ECOSYSTEM } from '../trichyEcosystemData';
import type { EcosystemNode, EcosystemProduct, CraftCategory } from '../trichyEcosystemData';
import { calculateMatchScore } from '../utils/matchingEngine';

export interface EcosystemProductItem extends EcosystemProduct {
  nodeId: string;
  shopName: string;
  locality: string;
  lat: number;
  lng: number;
  category: CraftCategory;
}

export interface SOSTicket {
  id: string;
  artisanId?: string;
  artisanName: string;
  problem: string;
  category: string;
  craft: string;
  quantity?: number;
  lat?: number;
  lng?: number;
  status: 'Reported' | 'Matched' | 'In Progress' | 'Resolved';
  timestamp: string;
  locality?: string;
  urgency?: string;
  contact?: string;
  address?: string;
}

export interface Requirement {
  id: string;
  artisanId?: string;
  artisanName: string;
  title: string;
  category: string;
  craft: string;
  type?: 'Materials' | 'Logistics' | 'Market Stall' | 'Photography';
  quantity: number | string;
  lat: number;
  lng: number;
  status: 'Open' | 'Matched' | 'Resolved';
  locality?: string;
  date?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  category: string;
  availableSlots: number;
  totalCapacity: number;
  lat: number;
  lng: number;
  demandDesc: string;
  locality?: string;
  craftFocus?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  shopName: string;
  customerName: string;
  quantity: number;
  totalPrice: number;
  fulfillmentType?: 'pickup' | 'delivery';
  address?: string;
  status: 'Requested' | 'Accepted' | 'Preparing' | 'Shipped' | 'Completed';
  timestamp: string;
}

export interface CustomCommission {
  id: string;
  productId: string;
  productName: string;
  shopName: string;
  customerName: string;
  notes: string;
  finish?: string;
  size?: string;
  status: 'Pending Review' | 'Accepted' | 'In Crafting' | 'Completed';
  timestamp: string;
}

export interface EnquiryItem {
  id: string;
  title: string;
  buyer: string;
  artisanCluster: string;
  quantity: string;
  value: string;
  status: 'Quote Sent' | 'Artisan Review' | 'Negotiating' | 'Connected' | 'Closed';
  date: string;
}

export interface ActivityLog {
  id: string;
  time: string;
  text: string;
  type?: 'action' | 'system' | 'match' | 'sos' | 'order';
}

interface ArtisanContextType {
  nodes: EcosystemNode[];
  products: EcosystemProductItem[];
  sosTickets: SOSTicket[];
  requirements: Requirement[];
  opportunities: Opportunity[];
  orders: OrderItem[];
  customCommissions: CustomCommission[];
  enquiries: EnquiryItem[];
  activityLogs: ActivityLog[];
  
  // Handlers
  raiseSOS: (sosData: Partial<SOSTicket>) => void;
  updateProductStock: (productId: string, delta: number) => void;
  placeOrder: (orderData: Omit<OrderItem, 'id' | 'status' | 'timestamp'>) => OrderItem;
  stepOrderStatus: (orderId: string) => void;
  submitCustomCommission: (commData: Omit<CustomCommission, 'id' | 'status' | 'timestamp'>) => CustomCommission;
  connectBuyer: (enquiryId: string) => void;
  closeEnquiry: (enquiryId: string) => void;
  allocateStall: (opportunityId: string) => void;
  executeMatch: (requirementId: string, opportunityId: string) => void;
  resolveSOS: (sosId: string) => void;
  addLog: (text: string, type?: ActivityLog['type']) => void;
  calculateMatchScore: typeof calculateMatchScore;
}

const ArtisanContext = createContext<ArtisanContextType | undefined>(undefined);

export function ArtisanProvider({ children }: { children: ReactNode }) {
  // 1. Core Ecosystem Nodes (23 verified Trichy locations)
  const [nodes] = useState<EcosystemNode[]>(() => {
    try {
      const saved = localStorage.getItem('artisanlink_nodes');
      return saved ? JSON.parse(saved) : TRICHY_VERIFIED_ECOSYSTEM;
    } catch {
      return TRICHY_VERIFIED_ECOSYSTEM;
    }
  });

  // 2. Collections (Flattened from nodes, reactive stock)
  const [products, setProducts] = useState<EcosystemProductItem[]>(() => {
    try {
      const savedProducts = localStorage.getItem('artisanlink_products');
      if (savedProducts) return JSON.parse(savedProducts);
    } catch {
      // ignore
    }
    return nodes.flatMap(node =>
      node.products.map(p => ({
        ...p,
        nodeId: node.id,
        shopName: node.name,
        locality: node.address,
        lat: node.lat,
        lng: node.lng,
        category: node.category
      }))
    );
  });

  const [sosTickets, setSosTickets] = useState<SOSTicket[]>([
    {
      id: 'sos-01',
      artisanId: 'trichy-pottery-01',
      artisanName: 'Meenakshi Ammal',
      problem: '30 Unsold Terracotta Lamps ahead of monsoon rains',
      category: 'terracotta',
      craft: 'Terracotta',
      quantity: 30,
      lat: 10.8165,
      lng: 78.6850,
      status: 'Reported',
      timestamp: '09:15 AM',
      locality: 'Musiri',
      urgency: 'HIGH - Cauvery flood advisory in effect.',
      contact: '+91 98422 17409',
      address: '14 Riverbank Road, Musiri, Cauvery Basin'
    },
    {
      id: 'sos-02',
      artisanId: 'trichy-pottery-02',
      artisanName: 'Lakshmi Ramanathan',
      problem: 'Awaiting State Handicrafts Development Board UID verification and geotag approval',
      category: 'terracotta',
      craft: 'Pottery',
      quantity: 1,
      lat: 10.8170,
      lng: 78.6860,
      status: 'Reported',
      timestamp: '09:30 AM',
      locality: 'Musiri',
      urgency: 'Medium',
      contact: '+91 94431 82910',
      address: '14 Riverbank Road, Musiri, Trichy'
    },
    {
      id: 'sos-03',
      artisanId: 'trichy-wood-01',
      artisanName: 'Master S. Durairaj',
      problem: 'Hand-carved Teak Deepam Stand requires dimensional tolerance clearance for temple export registry',
      category: 'woodcraft',
      craft: 'Woodcraft',
      quantity: 1,
      lat: 10.8200,
      lng: 78.6900,
      status: 'Reported',
      timestamp: '09:35 AM',
      locality: 'Woraiyur',
      urgency: 'Medium',
      contact: '+91 98424 55120',
      address: 'Karumandapam, Trichy'
    }
  ]);

  const [requirements, setRequirements] = useState<Requirement[]>([
    {
      id: 'req-01',
      artisanId: 'trichy-pottery-01',
      artisanName: 'Meenakshi Ammal',
      title: 'Transport to Srirangam',
      category: 'terracotta',
      craft: 'Terracotta',
      type: 'Logistics',
      quantity: '30 Lamps',
      lat: 10.8165,
      lng: 78.6850,
      status: 'Open',
      locality: 'Musiri',
      date: '29 Sep'
    },
    {
      id: 'req-02',
      artisanId: 'trichy-loom-11',
      artisanName: 'Woraiyur Weavers Guild',
      title: 'Bulk Cotton Yarn Supply',
      category: 'handloom',
      craft: 'Handloom',
      type: 'Materials',
      quantity: '50 kg',
      lat: 10.8340,
      lng: 78.6840,
      status: 'Open',
      locality: 'Woraiyur',
      date: '28 Sep'
    },
    {
      id: 'req-03',
      artisanId: 'trichy-sculpt-05',
      artisanName: 'Karuppaiah Sculptures',
      title: 'Granite Chisel Toolkits',
      category: 'sculpture',
      craft: 'Granite Sculpture',
      type: 'Materials',
      quantity: '4 Sets',
      lat: 10.8624,
      lng: 78.6946,
      status: 'Matched',
      locality: 'Srirangam',
      date: '27 Sep'
    },
    {
      id: 'req-04',
      artisanId: 'trichy-wood-01',
      artisanName: 'Karumandapam Woodcraft Guild',
      title: 'Teak Deepam Exhibition Logistics',
      category: 'woodcraft',
      craft: 'Woodcraft',
      type: 'Market Stall',
      quantity: '15 Units',
      lat: 10.8200,
      lng: 78.6900,
      status: 'Open',
      locality: 'Woraiyur',
      date: '29 Sep'
    }
  ]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 'opp-01',
      title: 'Srirangam Temple Fest Pavilion',
      category: 'terracotta',
      availableSlots: 25,
      totalCapacity: 30,
      lat: 10.8624,
      lng: 78.6946,
      demandDesc: 'High demand for Clay Vases, Deepams & Brass Ware',
      locality: 'Srirangam',
      craftFocus: 'Terracotta / Brass'
    },
    {
      id: 'opp-02',
      title: 'Cauvery Artisan Mela (Singarathope)',
      category: 'handloom',
      availableSlots: 40,
      totalCapacity: 50,
      lat: 10.8285,
      lng: 78.6940,
      demandDesc: 'Looking for Woraiyur Handloom Drapes & Stalls',
      locality: 'Singarathope',
      craftFocus: 'Handloom / Textiles'
    },
    {
      id: 'opp-03',
      title: 'Brightbox Regional Procurement',
      category: 'woodcraft',
      availableSlots: 150,
      totalCapacity: 200,
      lat: 10.8100,
      lng: 78.6900,
      demandDesc: 'Large-scale export pipeline for carved temple panels',
      locality: 'KK Nagar',
      craftFocus: 'Woodcraft'
    },
    {
      id: 'opp-04',
      title: 'Local Clay Logistics Van Route',
      category: 'terracotta',
      availableSlots: 28,
      totalCapacity: 30,
      lat: 10.8165,
      lng: 78.6850,
      demandDesc: 'Driver Selvam matched to Musiri ➔ Srirangam route',
      locality: 'Musiri',
      craftFocus: 'Pottery & Clay'
    }
  ]);

  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 'ord-101',
      productId: 'p-loom-1',
      productName: 'Woraiyur Pure Cotton Saree',
      shopName: 'Woraiyur Devanga Handloom Society',
      customerName: 'Arun V.',
      quantity: 1,
      totalPrice: 1850,
      fulfillmentType: 'delivery',
      address: '12 K.K. Nagar West, Trichy',
      status: 'Shipped',
      timestamp: '28 Sep, 04:30 PM'
    },
    {
      id: 'ord-102',
      productId: 'p-pot-2',
      productName: 'Cauvery Terracotta Deepam (Set of 4)',
      shopName: 'Pottery Shop Puthur',
      customerName: 'Priya R.',
      quantity: 2,
      totalPrice: 450,
      fulfillmentType: 'pickup',
      address: 'Main Bazaar, Puthur, Trichy',
      status: 'Preparing',
      timestamp: '29 Sep, 09:15 AM'
    },
    {
      id: 'ord-103',
      productId: 'p-bronze-3',
      productName: 'Lost-Wax Cast Bronze Icon',
      shopName: 'Kanya Krafts Melapudur',
      customerName: 'Sriram K.',
      quantity: 1,
      totalPrice: 6500,
      fulfillmentType: 'delivery',
      address: '45 Convent Road, Melapudur, Trichy',
      status: 'Requested',
      timestamp: '29 Sep, 10:20 AM'
    }
  ]);

  const [customCommissions, setCustomCommissions] = useState<CustomCommission[]>([
    {
      id: 'comm-2001',
      productId: 'p-2',
      productName: 'Woraiyur Cotton Sari',
      shopName: 'Woraiyur Handloom Weavers Cooperative',
      customerName: 'Ananya Krishnan',
      notes: 'Custom temple border in natural madder red dye',
      finish: 'Natural Madder',
      size: 'Standard 6 Yards',
      status: 'In Crafting',
      timestamp: '09:05 AM'
    }
  ]);

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([
    {
      id: 'enq-01',
      title: 'Palm Leaf Storage Baskets (300 units)',
      buyer: 'Trichy Eco-Exporters',
      artisanCluster: 'Koda Exports (Inamkulathur)',
      quantity: '300 units',
      value: '₹45,000',
      status: 'Quote Sent',
      date: '28 Sep'
    },
    {
      id: 'enq-02',
      title: 'Teak Mandapam Carving Panels',
      buyer: 'Srirangam Heritage Foundation',
      artisanCluster: 'Brightbox Woodcraft (KK Nagar)',
      quantity: '8 panels',
      value: '₹1,20,000',
      status: 'Artisan Review',
      date: '27 Sep'
    },
    {
      id: 'enq-03',
      title: 'Traditional Cooking Handis (50 units)',
      buyer: 'Organic Restaurant Group',
      artisanCluster: 'Pot Shop Puthur',
      quantity: '50 units',
      value: '₹22,500',
      status: 'Negotiating',
      date: '29 Sep'
    }
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: 'log-1', time: '09:42', text: 'Ecosystem initialized across 23 Trichy nodes', type: 'system' },
    { id: 'log-2', time: '09:38', text: 'Tollgate craft warehouse received 40 terracotta garden pots', type: 'system' },
    { id: 'log-3', time: '09:31', text: 'NIT Trichy student facilitator assigned to Woraiyur handloom scan', type: 'action' },
    { id: 'log-4', time: '09:24', text: 'Direct buyer enquiry logged for Bronze Nataraja replica (Rockfort)', type: 'order' },
    { id: 'log-5', time: '09:18', text: 'Automated flood gauge near Musiri bridge elevated to Warning Level 1', type: 'sos' }
  ]);

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('artisanlink_nodes', JSON.stringify(nodes));
      localStorage.setItem('artisanlink_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [nodes, products]);

  const addLog = (text: string, type: ActivityLog['type'] = 'action') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityLogs(prev => [
      { id: `log-${Date.now()}`, time, text, type },
      ...prev.slice(0, 24)
    ]);
  };

  // --- CROSS-ROLE MUTATION HANDLERS ---

  // 1. Artisan raises SOS (From Artisan Dashboard)
  const raiseSOS = (sosData: Partial<SOSTicket>) => {
    const ticket: SOSTicket = {
      id: `sos-${Date.now()}`,
      artisanName: sosData.artisanName || 'Cauvery Artisan',
      problem: sosData.problem || 'Material / Logistics Assistance Required',
      category: sosData.category || 'terracotta',
      craft: sosData.craft || 'Terracotta',
      quantity: sosData.quantity || 1,
      lat: sosData.lat || 10.8165,
      lng: sosData.lng || 78.6850,
      status: 'Reported',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      locality: sosData.locality || 'Musiri',
      urgency: sosData.urgency || 'High',
      contact: sosData.contact,
      address: sosData.address
    };
    setSosTickets(prev => [ticket, ...prev]);
    addLog(`🚨 Emergency SOS raised by ${ticket.artisanName}: ${ticket.problem}`, 'sos');
  };

  // 2. Artisan modifies stock (From Voice Ledger or UI)
  const updateProductStock = (productId: string, delta: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newStock = Math.max(0, p.stock + delta);
          addLog(`📦 Stock updated: ${p.name} (${newStock} available)`, 'action');
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // 3. Customer places Order (From Customer Portal)
  const placeOrder = (orderData: Omit<OrderItem, 'id' | 'status' | 'timestamp'>): OrderItem => {
    const order: OrderItem = {
      ...orderData,
      id: `ord-${Date.now()}`,
      status: 'Requested',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setOrders(prev => [order, ...prev]);
    // Immediately decrement inventory from the product pool
    updateProductStock(order.productId, -order.quantity);
    addLog(`🛍️ Order #${order.id.slice(-4)}: ${order.productName} by ${order.customerName}`, 'order');
    return order;
  };

  // 4. Step order lifecycle: Requested -> Accepted -> Preparing -> Shipped -> Completed
  const stepOrderStatus = (orderId: string) => {
    const transitions: Record<OrderItem['status'], OrderItem['status']> = {
      Requested: 'Accepted',
      Accepted: 'Preparing',
      Preparing: 'Shipped',
      Shipped: 'Completed',
      Completed: 'Completed'
    };

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const next = transitions[o.status];
          addLog(`Order #${o.id.slice(-4)} status advanced: ${o.status} ➔ ${next}`, 'order');
          return { ...o, status: next };
        }
        return o;
      })
    );
  };

  // 5. Customer submits Custom Commission ("Make It Yours")
  const submitCustomCommission = (
    commData: Omit<CustomCommission, 'id' | 'status' | 'timestamp'>
  ): CustomCommission => {
    const comm: CustomCommission = {
      ...commData,
      id: `comm-${Date.now()}`,
      status: 'Pending Review',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setCustomCommissions(prev => [comm, ...prev]);
    addLog(`🎨 Custom request: ${comm.productName} for ${comm.customerName}`, 'action');
    return comm;
  };

  // 6. Connect B2B buyer for Enquiry
  const connectBuyer = (enquiryId: string) => {
    setEnquiries(prev =>
      prev.map(e => {
        if (e.id === enquiryId) {
          addLog(`Buyer Connected: ${e.buyer} ➔ ${e.artisanCluster}`, 'action');
          return { ...e, status: 'Connected' };
        }
        return e;
      })
    );
  };

  // 7. Mark Enquiry Closed
  const closeEnquiry = (enquiryId: string) => {
    setEnquiries(prev =>
      prev.map(e => {
        if (e.id === enquiryId) {
          addLog(`Enquiry #${e.id.slice(-4)} closed: ${e.title}`, 'action');
          return { ...e, status: 'Closed' };
        }
        return e;
      })
    );
  };

  // 8. Allocate Stall in Opportunity
  const allocateStall = (opportunityId: string) => {
    setOpportunities(prev =>
      prev.map(o => {
        if (o.id === opportunityId && o.availableSlots > 0) {
          const remaining = o.availableSlots - 1;
          addLog(`Stall allocated at "${o.title}" (${remaining} slots remaining)`, 'action');
          return { ...o, availableSlots: remaining };
        }
        return o;
      })
    );
  };

  // 9. Admin / Student executes an Auto-Match
  const executeMatch = (requirementId: string, opportunityId: string) => {
    const req = requirements.find(r => r.id === requirementId);
    const opp = opportunities.find(o => o.id === opportunityId);
    
    setRequirements(prev =>
      prev.map(r => (r.id === requirementId ? { ...r, status: 'Matched' } : r))
    );
    setOpportunities(prev =>
      prev.map(o =>
        o.id === opportunityId ? { ...o, availableSlots: Math.max(0, o.availableSlots - 1) } : o
      )
    );
    
    const artisanLabel = req ? req.artisanName : `Requirement #${requirementId.slice(-4)}`;
    const oppLabel = opp ? opp.title : `Opportunity #${opportunityId.slice(-4)}`;
    addLog(`Match Confirmed: ${artisanLabel} ➔ ${oppLabel}`, 'match');
  };

  // 10. Admin resolves an Attention/SOS ticket
  const resolveSOS = (sosId: string) => {
    setSosTickets(prev =>
      prev.map(s => (s.id === sosId ? { ...s, status: 'Resolved' } : s))
    );
    addLog(`✓ SOS Ticket #${sosId.slice(-4)} resolved by State Admin`, 'action');
  };

  return (
    <ArtisanContext.Provider
      value={{
        nodes,
        products,
        sosTickets,
        requirements,
        opportunities,
        orders,
        customCommissions,
        enquiries,
        activityLogs,
        raiseSOS,
        updateProductStock,
        placeOrder,
        stepOrderStatus,
        submitCustomCommission,
        connectBuyer,
        closeEnquiry,
        allocateStall,
        executeMatch,
        resolveSOS,
        addLog,
        calculateMatchScore
      }}
    >
      {children}
    </ArtisanContext.Provider>
  );
}

export const useArtisanEcosystem = () => {
  const context = useContext(ArtisanContext);
  if (!context) {
    throw new Error('useArtisanEcosystem must be used within an ArtisanProvider');
  }
  return context;
};
