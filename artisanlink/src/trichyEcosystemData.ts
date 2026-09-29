export type NodeType = 'maker' | 'cooperative' | 'aggregator' | 'wholesaler' | 'government' | 'retailer';
export type CraftCategory = 'terracotta' | 'woodcraft' | 'sculpture' | 'handloom' | 'handicrafts';

export interface EcosystemProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  material: string;
  image?: string;
  description?: string;
  passport?: {
    certId: string;
    artisanName: string;
    origin: string;
    rawMaterials: string;
    technique: string;
    timestamp: string;
    verifiedBy: string;
  };
}

export interface EcosystemNode {
  id: string;
  name: string;
  nodeType: NodeType;
  category: CraftCategory;
  lat: number;
  lng: number;
  address: string;
  speciality: string;
  googleMapsUrl: string;
  phone?: string;
  artisanLeader?: string;
  products: EcosystemProduct[];
  trailSteps?: {
    step: number;
    title: string;
    desc: string;
  }[];
}

// Haversine distance in km from Trichy reference point (10.8200, 78.6900)
export function getDistanceFromTrichyCenter(lat: number, lng: number): number {
  const centerLat = 10.8200;
  const centerLng = 78.6900;
  const R = 6371; // km
  const dLat = (lat - centerLat) * (Math.PI / 180);
  const dLng = (lng - centerLng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(centerLat * (Math.PI / 180)) *
      Math.cos(lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export const NODE_TYPE_CONFIG: Record<
  NodeType,
  { label: string; color: string; bg: string; iconEmoji: string; tag: string }
> = {
  maker: {
    label: 'Maker',
    color: '#2D6A4F', // Terracotta Green
    bg: '#EAF4EE',
    iconEmoji: '🟢 🏺',
    tag: 'Verified Independent Maker'
  },
  cooperative: {
    label: 'Cooperative',
    color: '#1D3557', // Deep Indigo
    bg: '#EBF1F7',
    iconEmoji: '🔵 🧵',
    tag: 'Weavers Handloom Guild'
  },
  aggregator: {
    label: 'Aggregator',
    color: '#DDA15E', // Warm Ochre
    bg: '#FDF6EC',
    iconEmoji: '🟠 📦',
    tag: 'Multi-Artisan Collective'
  },
  wholesaler: {
    label: 'Wholesaler',
    color: '#C67D34', // Warm Amber Ochre
    bg: '#FDF3E7',
    iconEmoji: '🟠 🏛️',
    tag: 'Artisan Wholesale Hub'
  },
  government: {
    label: 'Government Guild',
    color: '#1E293B', // Slate Navy
    bg: '#EDF1F5',
    iconEmoji: '⚫ 🛡️',
    tag: 'State Apex Heritage Store'
  },
  retailer: {
    label: 'Retailer',
    color: '#7209B7', // Heritage Wine
    bg: '#F4ECF8',
    iconEmoji: '🟣 🛍️',
    tag: 'Curated Heritage Boutique'
  }
};

export const TRICHY_VERIFIED_ECOSYSTEM: EcosystemNode[] = [
  // 🏺 POTTERY & TERRACOTTA (MAKERS)
  {
    id: "trichy-pottery-01",
    name: "Pottery Shop Bishop Road",
    nodeType: "maker", // 🟢 MAKER
    category: "terracotta",
    lat: 10.8165,
    lng: 78.6850,
    address: "63A Bishop Road, Puthur, Tennur, Tiruchirappalli",
    speciality: "Handmade pottery, porous water pots, terracotta earthenware",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=63A+Bishop+Road+Puthur+Tiruchirappalli",
    phone: "+91 94432 10891",
    artisanLeader: "Master Potter Murugan",
    products: [
      { 
        id: "p-01", 
        name: "Terracotta Water Pot", 
        price: 350, 
        stock: 8, 
        material: "Local Riverbed Clay",
        description: "Naturally porous alluvial silt water vessel. Keeps water refreshing and naturally cool using evaporative capillary cooling.",
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=500&q=80",
        passport: {
          certId: "PASSPORT-TN-TRY-001",
          artisanName: "Murugan (Bishop Road Potter Guild)",
          origin: "Puthur Basin, Tiruchirappalli",
          rawMaterials: "100% Cauvery River Silt & Rice Husk Temper",
          technique: "Manual Kick-wheel Throwing & Natural Straw Firing",
          timestamp: "18 Feb 2026 • 11:20 IST",
          verifiedBy: "ArtisanLink Trichy Field Verifier"
        }
      }
    ],
    trailSteps: [
      { step: 1, title: "Cauvery Clay Preparation Pit", desc: "Inspect raw alluvial silt filtered through coarse coir sieves to eliminate pebbles." },
      { step: 2, title: "Meet Potter Murugan", desc: "Hear how 3 generations of family potters supplied Puthur neighbourhood cooling matkas." },
      { step: 3, title: "Hands-on Wheel Shaping Demo", desc: "Sit with the artisan to center a lump of river clay on the traditional kick-wheel." },
      { step: 4, title: "Straw & Husk Pit Firing", desc: "Observe the slow open-air smoke firing technique that gives earthenware its breathability." }
    ]
  },
  {
    id: "trichy-pottery-02",
    name: "Pot Shop In Puthur",
    nodeType: "maker",
    category: "terracotta",
    lat: 10.8142,
    lng: 78.6821,
    address: "Puthur High Road, Puthur, Tiruchirappalli",
    speciality: "Traditional cooking clay handis and earthenware deepams",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pot+Shop+Puthur+High+Road+Tiruchirappalli",
    phone: "+91 98421 77312",
    artisanLeader: "Meenakshi Ammal",
    products: [
      { 
        id: "p-02", 
        name: "Clay Cooking Handi Set", 
        price: 420, 
        stock: 12, 
        material: "Unglazed Terracotta",
        description: "Dual-fired lead-free earthen cooking pot set with natural lid. Retains organic aromas and slow-cooks curries evenly.",
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=500&q=80",
        passport: {
          certId: "PASSPORT-TN-TRY-002",
          artisanName: "Meenakshi Ammal",
          origin: "Puthur High Road Kilns, Tiruchirappalli",
          rawMaterials: "Cauvery Riverbed Terracotta, Organic Sesame Oil Buff",
          technique: "Hand Beating with Wooden Mallet & Low Fire",
          timestamp: "22 Feb 2026 • 15:45 IST",
          verifiedBy: "Trichy Craft Cooperative Board"
        }
      }
    ],
    trailSteps: [
      { step: 1, title: "Clay Handi Beating Bench", desc: "Watch the paddle-and-anvil wooden technique used to thin pot walls evenly." },
      { step: 2, title: "Meet Meenakshi Ammal", desc: "Learn about traditional curing of clay cooking vessels with rice starch water." },
      { step: 3, title: "Oil Burnishing Demonstration", desc: "See raw earthenware burnished with smooth river pebbles for a silky finish." },
      { step: 4, title: "Traditional Kitchen Ware Walk", desc: "Explore local curd churners, biryani pots, and seasonal oil deepams." }
    ]
  },
  {
    id: "trichy-pottery-03",
    name: "Plant Pot Shop Varaganeri",
    nodeType: "maker",
    category: "terracotta",
    lat: 10.8220,
    lng: 78.7080,
    address: "Dhanarathinam Nagar, Varaganeri, Tiruchirappalli",
    speciality: "Garden terracotta planters and large decorative pots",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Plant+Pot+Shop+Varaganeri+Tiruchirappalli",
    phone: "+91 97899 44102",
    artisanLeader: "Selvaraj Sthapathi",
    products: [
      { 
        id: "p-03", 
        name: "Decorative Terracotta Planter", 
        price: 280, 
        stock: 15, 
        material: "Kiln-fired Clay",
        description: "Heavy-duty outdoor garden planter with stamped floral relief motifs. Highly breathable walls prevent root rot.",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=500&q=80",
        passport: {
          certId: "PASSPORT-TN-TRY-003",
          artisanName: "Selvaraj Potter Studio",
          origin: "Varaganeri, Tiruchirappalli",
          rawMaterials: "Fine Red River Silt & Quartz Sand Stabilizer",
          technique: "Press-moulded Relief & Updraft Wood Kiln",
          timestamp: "10 Feb 2026 • 09:15 IST",
          verifiedBy: "ArtisanLink Trichy Field Verifier"
        }
      }
    ],
    trailSteps: [
      { step: 1, title: "Mould Making Yard", desc: "Inspect plaster moulds carved with sacred temple floral borders." },
      { step: 2, title: "Pressing & Relief Stamping", desc: "Artisans hand-press dense clay slabs into intricate decorative contours." },
      { step: 3, title: "Drying Courtyard Walk", desc: "Walk through hundreds of drying planters aligned under thatched shade." },
      { step: 4, title: "Wood Fire Kiln Unloading", desc: "Experience the warm orange glow as freshly fired terracotta is cooled." }
    ]
  },

  // 🪵 WOOD / CARVING (MAKERS & STUDIOS)
  {
    id: "trichy-wood-04",
    name: "New Wood Carving & Wood Works Vinayaga Agencies",
    nodeType: "maker",
    category: "woodcraft",
    lat: 10.7920,
    lng: 78.6690,
    address: "Ashok Nagar, Karumandapam, Trichy",
    speciality: "Chiseled teak doors, temple mandapam panels, custom woodwork",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=New+Wood+Carving+Wood+Works+Vinayaga+Agencies+Karumandapam+Trichy",
    phone: "+91 94431 55601",
    artisanLeader: "V. Shanmugam Acharya",
    products: [
      { 
        id: "p-04", 
        name: "Hand-Carved Wooden Pooja Panel", 
        price: 4500, 
        stock: 2, 
        material: "Country Teakwood",
        description: "Intricately chiseled Country Teak relief plaque featuring traditional Gajalakshmi temple crest. Buffed with natural beeswax.",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80",
        passport: {
          certId: "PASSPORT-TN-TRY-004",
          artisanName: "V. Shanmugam Acharya",
          origin: "Karumandapam Wood Guild, Trichy",
          rawMaterials: "Certified Aged Country Teak, Wild Honey Beeswax",
          technique: "Deep Relief Hand Gouge & Chisel Carving",
          timestamp: "04 Feb 2026 • 16:30 IST",
          verifiedBy: "Tamil Nadu Artisan Federation"
        }
      }
    ],
    trailSteps: [
      { step: 1, title: "Timber Curing Yard", desc: "Examine aged teak logs seasoned for 18 months to prevent dimensional warping." },
      { step: 2, title: "Chisel Profiling Bench", desc: "Watch master carvers use 24 specialized micro-gouges to sculpt fine facial expressions." },
      { step: 3, title: "Beeswax Buffing Station", desc: "Buff natural beeswax into deep relief grooves using coarse jute fabric." },
      { step: 4, title: "Architectural Door Gallery", desc: "View bespoke heavy temple door orders crafted for Cauvery delta shrines." }
    ]
  },
  {
    id: "trichy-wood-05",
    name: "JM House Design World CNC Wood Carving",
    nodeType: "maker",
    category: "woodcraft",
    lat: 10.8040,
    lng: 78.7110,
    address: "Sangillyandapuram Road, Trichy",
    speciality: "Architectural wood panels and detailed relief sculptures",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=JM+House+Design+World+CNC+Wood+Carving+Trichy",
    phone: "+91 99940 88209",
    artisanLeader: "J. Mohammed & Team",
    products: [
      { 
        id: "p-05", 
        name: "Relief Carved Wall Plaque", 
        price: 2200, 
        stock: 4, 
        material: "Hardwood",
        description: "Geometric and floral jaali wall installation blending precise relief carving with traditional hand-sanding.",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },
  {
    id: "trichy-wood-06",
    name: "Sri Selva Vinayagar Wood Carving",
    nodeType: "maker",
    category: "woodcraft",
    lat: 10.8190,
    lng: 78.7040,
    address: "Madurai Road, Marakadai, Tharanallur, Trichy",
    speciality: "Traditional South Indian vahanas and temple wooden crafts",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Sri+Selva+Vinayagar+Wood+Carving+Madurai+Road+Trichy",
    phone: "+91 94862 33110",
    artisanLeader: "R. Selvaraj",
    products: [
      { 
        id: "p-06", 
        name: "Carved Teak Peacock Deepam Stand", 
        price: 3200, 
        stock: 3, 
        material: "Seasoned Teak",
        description: "Freestanding ornate lamp pedestal sculpted with traditional Annam bird motifs.",
        image: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },

  // 🗿 SCULPTURE & STATUES (MAKERS)
  {
    id: "trichy-sculpt-07",
    name: "Kanya Krafts",
    nodeType: "maker",
    category: "sculpture",
    lat: 10.8110,
    lng: 78.6910,
    address: "Madonna Complex, Convent Road, Melapudur, Tiruchirappalli",
    speciality: "Stone, metal, and traditional heritage sculptures",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kanya+Krafts+Melapudur+Tiruchirappalli",
    phone: "+91 94433 99012",
    artisanLeader: "G. Kannan Sthapathi",
    products: [
      { 
        id: "p-07", 
        name: "Traditional Bronze Icon", 
        price: 6500, 
        stock: 2, 
        material: "Lost-wax Bronze",
        description: "Authentic lost-wax (Cire-perdue) cast bell-metal deity study with hand-chiseled facial detailing.",
        image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=500&q=80",
        passport: {
          certId: "PASSPORT-TN-TRY-007",
          artisanName: "G. Kannan Sthapathi",
          origin: "Melapudur Foundry Quarter, Trichy",
          rawMaterials: "Panchaloha Alloy (82% Copper, 18% Tin/Zinc)",
          technique: "Lost-Wax Cast with Natural Beeswax Pattern",
          timestamp: "14 Jan 2026 • 17:00 IST",
          verifiedBy: "State Heritage Metalcraft Board"
        }
      }
    ]
  },
  {
    id: "trichy-sculpt-08",
    name: "Statue Studio",
    nodeType: "maker",
    category: "sculpture",
    lat: 10.8290,
    lng: 78.6810,
    address: "7th Cross Road, Thillai Nagar, Trichy",
    speciality: "Artistic statues, devotional icons, and gallery artefacts",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Statue+Studio+Thillai+Nagar+Trichy",
    phone: "+91 98940 12055",
    artisanLeader: "Anand Natarajan",
    products: [
      { 
        id: "p-08", 
        name: "Cast Brass Nataraja Figurine", 
        price: 4800, 
        stock: 3, 
        material: "Bell Metal Brass",
        description: "Detailed 8-inch classical Chola revival cosmic dancer casting with circular arch of flame (prabhavali).",
        image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },
  {
    id: "trichy-sculpt-09",
    name: "Karuppaiah Sculptures",
    nodeType: "maker",
    category: "sculpture",
    lat: 10.8640,
    lng: 78.6920,
    address: "Kandi Street, Srirangam, Trichy",
    speciality: "Sacred temple stone and metal icon carving",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Karuppaiah+Sculptures+Kandi+Street+Srirangam",
    phone: "+91 94438 77610",
    artisanLeader: "Karuppaiah Sthapathi",
    products: [
      { 
        id: "p-09", 
        name: "Granite Stone Carved Deepam", 
        price: 1800, 
        stock: 5, 
        material: "Black Granite",
        description: "Monolithic black granite prayer oil lamp hollowed by hand hammer and tempered steel points.",
        image: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },
  {
    id: "trichy-sculpt-10",
    name: "M.G.R Statue Workshop",
    nodeType: "maker",
    category: "sculpture",
    lat: 10.7830,
    lng: 78.6380,
    address: "Somarasampettai, Trichy",
    speciality: "Monumental and memorial bronze/cement sculpture casting",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=MGR+Statue+Somarasampettai+Trichy",
    phone: "+91 93610 22390",
    artisanLeader: "Master Ravi",
    products: [
      { 
        id: "p-10", 
        name: "Bronze Bust Study", 
        price: 12000, 
        stock: 1, 
        material: "Cast Metal",
        description: "Bespoke commemorative bronze bust model with antique dark patina.",
        image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },

  // 🧵 HANDLOOM / WEAVERS (COOPERATIVES)
  {
    id: "trichy-loom-11",
    name: "Tiruchirappalli Handloom Weavers Cooperative Society",
    nodeType: "cooperative", // 🔵 COOPERATIVE
    category: "handloom",
    lat: 10.8340,
    lng: 78.6840,
    address: "Panchavarnaswamy Koil Area, Woraiyur, Trichy",
    speciality: "Registered handloom society producing traditional cotton sarees",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tiruchirappalli+Handloom+Weavers+Cooperative+Society+Panchavarnaswamy+Koil+Woraiyur",
    phone: "+91 431 276 1022",
    artisanLeader: "K. Soundararajan (Society Secy)",
    products: [
      { 
        id: "p-11", 
        name: "Woraiyur Pure Cotton Saree", 
        price: 1450, 
        stock: 18, 
        material: "Combed 80s Cotton",
        description: "Historical Woraiyur fine count handwoven saree with traditional temple spire border. Feather-light and cooling.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d615e1?auto=format&fit=crop&w=500&q=80",
        passport: {
          certId: "PASSPORT-TN-TRY-011",
          artisanName: "Woraiyur Handloom Weavers Society",
          origin: "Woraiyur Ancient Capital Loom Belt, Trichy",
          rawMaterials: "100% Long Staple Combed Cotton (Count: 80s)",
          technique: "Pit-Loom Interlocked Korvai Shuttle Weft",
          timestamp: "05 Feb 2026 • 10:00 IST",
          verifiedBy: "Dept of Handlooms & Textiles, Govt of Tamil Nadu"
        }
      }
    ],
    trailSteps: [
      { step: 1, title: "Loom Pit Alley Walk", desc: "Walk through the heritage weaver quarters of Woraiyur where Sangam poets praised diaphanous fabrics." },
      { step: 2, title: "Meet Master Weaver Soundararajan", desc: "Learn how warp threads are stretched across bamboo frames and sized with natural rice gruel." },
      { step: 3, title: "Rhythmic Pit-Loom Demonstration", desc: "Observe the rapid synchronized pedal work that interlocks the contrasting temple borders." },
      { step: 4, title: "Cooperative Archives Room", desc: "Inspect archival hand-drawn graph paper designs dating back to 1948." }
    ]
  },
  {
    id: "trichy-loom-12",
    name: "Woraiyur Devanga Handloom Weavers Cooperative Society",
    nodeType: "cooperative",
    category: "handloom",
    lat: 10.8355,
    lng: 78.6825,
    address: "Panchavarnaswamy Koil Street, Woraiyur, Trichy",
    speciality: "Authentic pit-loom fine cotton drapes with traditional zari borders",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Woraiyur+Devanga+Handloom+Weavers+Cooperative+Society",
    phone: "+91 431 276 3410",
    artisanLeader: "V. Meenakshisundaram (Master Weaver)",
    products: [
      { 
        id: "p-12", 
        name: "Devanga Traditional Cotton Dhoti & Angavastram", 
        price: 850, 
        stock: 25, 
        material: "Organic Cotton",
        description: "Ceremonial unbleached pure cotton dhoti set with maroon and gold zari temple borders.",
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80",
        passport: {
          certId: "PASSPORT-TN-TRY-012",
          artisanName: "Devanga Traditional Weavers Guild",
          origin: "Woraiyur Devanga Quarters, Trichy",
          rawMaterials: "Certified Erode Single-Origin Cotton Yarn",
          technique: "Traditional Pit-Loom with Fly Shuttle",
          timestamp: "12 Feb 2026 • 14:15 IST",
          verifiedBy: "Devanga Weavers Cooperative Directorate"
        }
      }
    ],
    trailSteps: [
      { step: 1, title: "Yarn Dyeing Yard", desc: "Witness herbal yarn boiling with madder roots and pure turmeric." },
      { step: 2, title: "Meet Weaver V. Meenakshisundaram", desc: "Discover how Devanga artisans preserved sacred temple loom traditions." },
      { step: 3, title: "Jacquard Card Punching", desc: "See how floral borders are coded on punchcards." },
      { step: 4, title: "Quality Audit Table", desc: "Examine thread count validation using weaver magnifying glasses." }
    ]
  },
  {
    id: "trichy-loom-13",
    name: "Manamedu Devanga Handloom Weavers Cooperative Society",
    nodeType: "cooperative",
    category: "handloom",
    lat: 10.9125,
    lng: 78.5310,
    address: "Manamedu, Musiri Taluk, Trichy District",
    speciality: "Cauvery basin cotton yardage and traditional checks",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Manamedu+Devanga+Handloom+Weavers+Cooperative+Society+Musiri+Trichy",
    phone: "+91 94422 17894",
    artisanLeader: "K. Ramalingam",
    products: [
      { 
        id: "p-13", 
        name: "Manamedu Loom Checked Fabric (per mtr)", 
        price: 210, 
        stock: 120, 
        material: "100% Handloom Cotton",
        description: "Breathable yarn-dyed Cauvery breeze cotton fabric woven on Musiri riverbank pit-looms.",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },
  {
    id: "trichy-loom-14",
    name: "Manamedu Saliar Handloom Weavers Cooperative Society",
    nodeType: "cooperative",
    category: "handloom",
    lat: 10.9140,
    lng: 78.5330,
    address: "Manamedu, Musiri Taluk, Trichy District",
    speciality: "Heritage Saliar community handloom sarees",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Manamedu+Saliar+Handloom+Weavers+Cooperative+Society+Trichy",
    phone: "+91 94420 89112",
    artisanLeader: "M. Thangavelu",
    products: [
      { 
        id: "p-14", 
        name: "Saliar Handloom Temple Border Saree", 
        price: 1850, 
        stock: 14, 
        material: "Handloom Cotton",
        description: "Classic contrasting pallu saree woven with heritage Saliar pit-loom techniques.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d615e1?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },
  {
    id: "trichy-loom-15",
    name: "Sri Mariamman Saliar Handloom Weavers Cooperative Society",
    nodeType: "cooperative",
    category: "handloom",
    lat: 10.9250,
    lng: 78.5620,
    address: "Kodiampalayam / Manamedu, Trichy",
    speciality: "Rural cooperative society managing collective weaver pit-looms",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Sri+Mariamman+Saliar+Handloom+Weavers+Cooperative+Society+Kodiampalayam+Trichy",
    phone: "+91 97881 55099",
    artisanLeader: "P. Muthusamy",
    products: [
      { 
        id: "p-15", 
        name: "Cauvery Breeze Light Cotton Draped Shawl", 
        price: 550, 
        stock: 30, 
        material: "Fine Cotton",
        description: "Soft unbleached summer wrap woven by rural women weavers along the Cauvery canal.",
        image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },

  // 🛍️ ARTISAN AGGREGATORS & WHOLESALERS
  {
    id: "trichy-agg-16",
    name: "Brightbox Handicrafts & Home Decors",
    nodeType: "aggregator", // 🟠 AGGREGATOR
    category: "woodcraft",
    lat: 10.7765,
    lng: 78.7050,
    address: "LIC Colony Main Road, K.K. Nagar, Trichy",
    speciality: "Aggregator working with 150+ artisans across 5 manufacturing units",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Brightbox+Handicrafts+LIC+Colony+KK+Nagar+Trichy",
    phone: "+91 94862 44781",
    artisanLeader: "V. Muruganandam",
    products: [
      { 
        id: "p-16", 
        name: "Handcrafted Teak Mandapam Gopuram", 
        price: 8500, 
        stock: 4, 
        material: "Teak & Brass Trim",
        description: "Architectural home altar shrine featuring hand-carved pillars and miniature brass kalasams.",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },
  {
    id: "trichy-agg-17",
    name: "Shri Dev Enterprise",
    nodeType: "wholesaler", // 🟠 WHOLESALER
    category: "handicrafts",
    lat: 10.8010,
    lng: 78.6490,
    address: "Vasan Valley, Malliampathu, Vayalur Road, Trichy",
    speciality: "Handicrafts wholesale supplier bridging local artisans to retailers",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Shri+Dev+Enterprise+Vasan+Valley+Trichy",
    phone: "+91 98424 66100",
    artisanLeader: "Devanathan K.",
    products: [
      { 
        id: "p-17", 
        name: "Bulk Handicraft Bell Metal Artifacts", 
        price: 950, 
        stock: 50, 
        material: "Brass Alloy",
        description: "Traditional incense burner holders and ritual bell metal vessels from regional casting units.",
        image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },
  {
    id: "trichy-agg-18",
    name: "Bambi Crafts",
    nodeType: "wholesaler",
    category: "handicrafts",
    lat: 10.8650,
    lng: 78.6960,
    address: "Nelson Road, Srirangam, Trichy",
    speciality: "Wholesale distributor of devotional and temple craft items",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bambi+Crafts+Nelson+Road+Srirangam+Trichy",
    phone: "+91 431 243 4511",
    artisanLeader: "G. Balaji",
    products: [
      { 
        id: "p-18", 
        name: "Thanjavur Art Plate Souvenir", 
        price: 1650, 
        stock: 20, 
        material: "Embossed Brass & Silver Leaf",
        description: "6-inch medallion plate embossed with Sri Ranganatha deity in repoussé technique.",
        image: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },

  // 🏛️ GOVERNMENT & MAJOR CRAFT RETAIL
  {
    id: "trichy-gov-19",
    name: "CO-OPTEX, Pothigai, Trichy",
    nodeType: "government", // ⚫ GOVERNMENT
    category: "handloom",
    lat: 10.7930,
    lng: 78.6870,
    address: "Ashby Hotel Complex, Rockins Road, Central Bus Stand, Trichy",
    speciality: "State handloom apex cooperative showroom retailing authentic Tamil Nadu weaves",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=CO-OPTEX+POTHIGAI+Trichy+Rockins+Road",
    phone: "+91 431 246 0411",
    artisanLeader: "Manager (TN Apex Co-optex)",
    products: [
      { 
        id: "p-19", 
        name: "GI Certified Woraiyur Handloom Saree", 
        price: 2100, 
        stock: 15, 
        material: "Pure Natural Dyed Cotton",
        description: "Official Government certified Woraiyur handloom cotton saree with tamper-proof Silk Mark & Handloom Mark.",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d615e1?auto=format&fit=crop&w=500&q=80",
        passport: {
          certId: "PASSPORT-GOV-COOPTEX-019",
          artisanName: "Co-optex Registered Society Weavers",
          origin: "Woraiyur Co-optex Belt, Tiruchirappalli",
          rawMaterials: "Certified Organic Cotton, Eco-Friendly Reactive Dyes",
          technique: "State-audited Pit-Loom Weft",
          timestamp: "01 Jan 2026 • 11:00 IST",
          verifiedBy: "Handloom Mark Scheme of India"
        }
      }
    ]
  },
  {
    id: "trichy-gov-20",
    name: "Poompuhar Sales Showroom",
    nodeType: "government",
    category: "handicrafts",
    lat: 10.8285,
    lng: 78.6940,
    address: "West Boulevard Road, Singarathope, Trichy",
    speciality: "Official Tamil Nadu Handicrafts Development Corporation emporium",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Poompuhar+Sales+Showroom+West+Boulevard+Road+Trichy",
    phone: "+91 431 270 4521",
    artisanLeader: "Showroom Manager (TNHDC)",
    products: [
      { 
        id: "p-20", 
        name: "Swamimalai Bronze Annam Lamp", 
        price: 3400, 
        stock: 6, 
        material: "GI Tagged Bronze",
        description: "Government certified authentic lost-wax cast brass temple oil lamp with mythical bird crown.",
        image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=500&q=80",
        passport: {
          certId: "PASSPORT-GOV-POOMPUHAR-020",
          artisanName: "State Awardee Bronze Master",
          origin: "Swamimalai / Singarathope Hub, Trichy",
          rawMaterials: "Panchaloha Bell Metal, Organic Beeswax Model",
          technique: "Lost Wax Casting (Cire Perdue)",
          timestamp: "20 Jan 2026 • 15:30 IST",
          verifiedBy: "Tamil Nadu Handicrafts Development Corporation"
        }
      }
    ]
  },
  {
    id: "trichy-ret-21",
    name: "Vijaya's Handicrafts Angadi",
    nodeType: "retailer", // 🟣 RETAILER
    category: "handicrafts",
    lat: 10.8270,
    lng: 78.6790,
    address: "Roja Salai, Annamalai Nagar, Trichy",
    speciality: "Local craft showroom offering curated artisanal household crafts",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Vijaya%27s+Handicrafts+Angadi+Annamalai+Nagar+Trichy",
    phone: "+91 94421 88301",
    artisanLeader: "Vijaya R.",
    products: [
      { 
        id: "p-21", 
        name: "Handmade Terracotta Golu Dolls", 
        price: 850, 
        stock: 10, 
        material: "Painted Terracotta",
        description: "Hand-painted clay figurines sculpted using traditional riverbed mud for Navaratri golu displays.",
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },
  {
    id: "trichy-ret-22",
    name: "Mayon Art & Studio",
    nodeType: "retailer",
    category: "handicrafts",
    lat: 10.8150,
    lng: 78.6880,
    address: "Major Saravanan Road, Raja Colony, Trichy",
    speciality: "Art boutique showcasing contemporary and traditional regional craftwork",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Mayon+Art+Studio+Raja+Colony+Trichy",
    phone: "+91 98424 11980",
    artisanLeader: "S. Mayon",
    products: [
      { 
        id: "p-22", 
        name: "Traditional Thanjavur Foil Painting", 
        price: 4500, 
        stock: 3, 
        material: "Teak Board & 22k Gold Foil",
        description: "Gilded devotional panel on seasoned wood board embossed with limestone paste and semi-precious Jaipur stones.",
        image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=500&q=80"
      }
    ]
  },
  {
    id: "trichy-ret-23",
    name: "MRP Handicrafts and Jewellery",
    nodeType: "retailer",
    category: "handicrafts",
    lat: 10.8060,
    lng: 78.6920,
    address: "Femina Shopping Mall, Williams Road, Trichy",
    speciality: "Retail showcase for terracotta jewellery and traditional handicraft gifts",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=MRP+Handicrafts+and+Jewellery+Femina+Trichy",
    phone: "+91 431 241 1234",
    artisanLeader: "M. R. Pandian",
    products: [
      { 
        id: "p-23", 
        name: "Handmade Terracotta Jewellery Set", 
        price: 650, 
        stock: 16, 
        material: "Earthen Clay with Natural Glaze",
        description: "Kiln-fired earthen necklace with matching jhumkas painted in eco-friendly acrylic gold tones.",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=500&q=80"
      }
    ]
  }
];
