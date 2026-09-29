export interface Product {
  id: string;
  name: string;
  craftType: 'terracotta' | 'handloom' | 'woodcraft' | 'brass' | 'fiber';
  categoryLabel: string;
  categoryEmoji: string;
  workshopId: string;
  workshopName: string;
  artisanName: string;
  cluster: string;
  distanceKm: number;
  badge: string;
  badgeType: 'gi' | 'verified' | 'coop' | 'aggregator';
  isOpen: boolean;
  price: number;
  stock: number;
  description: string;
  materials: string;
  image: string;
  coordinates: [number, number];
  passport: {
    hash: string;
    origin: string;
    materials: string;
    technique: string;
    artisanLinage: string;
    sealTimestamp: string;
    govtCertNo: string;
  };
}

export interface Workshop {
  id: string;
  name: string;
  craftType: 'terracotta' | 'handloom' | 'woodcraft' | 'brass' | 'fiber' | 'retail';
  typeLabel: string;
  emoji: string;
  cluster: string;
  artisanName: string;
  badge: string;
  distanceKm: number;
  isOpen: boolean;
  address: string;
  coordinates: [number, number];
  bio: string;
  materials: string;
  image: string;
  phone: string;
  productCount: number;
  trailStopNumber: number;
  trailTitle: string;
  trailSteps: {
    step: number;
    title: string;
    desc: string;
  }[];
}

export interface Commission {
  id: string;
  title: string;
  artisanName: string;
  cluster: string;
  status: string;
  statusCode: 'accepted' | 'shipped' | 'pending' | 'completed';
  statusColor: string;
  eta: string;
  progressPercent: number;
  customText?: string;
  finish?: string;
  size?: string;
  quantity?: number;
  price?: number;
  trackingNo?: string;
  date: string;
}

export interface CraftTrail {
  id: string;
  name: string;
  distance: string;
  duration: string;
  stopCount: number;
  giClustersCount: number;
  highlight: string;
  description: string;
  stops: {
    name: string;
    craft: string;
    cluster: string;
    lat: number;
    lng: number;
  }[];
}

// 8 Verified Workshops representing Trichy & Cauvery Delta
export const WORKSHOPS: Workshop[] = [
  {
    id: 'cholan-arts',
    name: 'Cholan Arts Foundry & Emporium',
    craftType: 'brass',
    typeLabel: 'Bronze & Brass Foundry',
    emoji: '🪔',
    cluster: 'Srirangam',
    artisanName: 'Master S. Soundararajan',
    badge: '✓ Verified GI Workshop',
    distanceKm: 2.1,
    isOpen: true,
    address: 'Near Sri Ranganathaswamy North Gopuram, Srirangam, Trichy',
    coordinates: [10.8625, 78.6948],
    bio: '4th generation lost-wax casting bell-metal masters creating Chola-period devotional iconography, lamps, and heirloom craft pieces with temple foundry pedigree.',
    materials: 'Panchaloha bell metal alloy (copper, tin, zinc), Cauvery river fine-silt molds, natural beeswax models.',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
    phone: '+91 94431 82910',
    productCount: 4,
    trailStopNumber: 1,
    trailTitle: 'Srirangam Temple Bell-Metal & Bronze Casting Hub',
    trailSteps: [
      { step: 1, title: 'Raw Beeswax Modeling & Lost-Wax Mold', desc: 'Watch artisans carve intricate deities in natural beeswax infused with dammar resin.' },
      { step: 2, title: 'Meet Master S. Soundararajan', desc: 'Hear oral history of bronze alloys passed down through four generations.' },
      { step: 3, title: 'Molten Alloy Pouring Demonstration', desc: 'Witness the intense kiln furnace pour at 1,080°C into Cauvery river silt molds.' },
      { step: 4, title: 'Hand Chiveling & Patina Polishing', desc: 'Final detailing using hardened steel styluses and natural lemon-tamarind polishing.' }
    ]
  },
  {
    id: 'vishalini-clay',
    name: 'Vishalini Clay Crafts & Studio',
    craftType: 'terracotta',
    typeLabel: 'Terracotta & Clay Studio',
    emoji: '🏺',
    cluster: 'Musiri',
    artisanName: 'Meenakshi Ammal',
    badge: '✓ Verified Maker',
    distanceKm: 4.2,
    isOpen: true,
    address: 'Cauvery Riverbank Road, Musiri Taluk, Trichy Belt',
    coordinates: [10.9380, 78.4485],
    bio: 'Master potter utilizing ancient alluvial Cauvery silt to mold smoke-fired cookware, ornamental deepams, and village guardian horses.',
    materials: 'Natural Musiri riverbed silt clay, organic rice husk temper, natural terracotta smoke firing.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    phone: '+91 98424 55120',
    productCount: 5,
    trailStopNumber: 2,
    trailTitle: 'Musiri Cauvery Riverbed Alluvial Pottery Trail',
    trailSteps: [
      { step: 1, title: 'Raw Clay Sifting & Husk Tempering', desc: 'River silt is hand-sieved and mixed with rice husk to withstand thermal shock.' },
      { step: 2, title: 'Meet Meenakshi Ammal', desc: 'Discover how women master potters shape temple deepams on pedal wheels.' },
      { step: 3, title: 'Live Wheel Throwing Session', desc: 'Get hands-on on the potters wheel and shape your own raw earthenware cup.' },
      { step: 4, title: 'Open Wood & Hay Straw Kiln Firing', desc: 'Experience the traditional low-temperature pit firing with dry coconut fronds.' }
    ]
  },
  {
    id: 'manamedu-weavers',
    name: 'Manamedu Devanga Weavers Cooperative',
    craftType: 'handloom',
    typeLabel: 'Cooperative Guild',
    emoji: '🧵',
    cluster: 'Manamedu',
    artisanName: 'K. Ramalingam (Head Weaver)',
    badge: '✓ Cooperative Guild',
    distanceKm: 5.4,
    isOpen: true,
    address: 'Main Bazaar, Manamedu Village, Musiri Taluk, Trichy',
    coordinates: [10.9120, 78.4120],
    bio: 'Renowned handloom cooperative housing 140+ active pit-looms producing breathable high-twist cotton sarees and traditional dhotis.',
    materials: '100s count unbleached Combed Cotton, vegetable indigo dye, gold zari thread.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d615e1?auto=format&fit=crop&w=600&q=80',
    phone: '+91 94422 17894',
    productCount: 6,
    trailStopNumber: 3,
    trailTitle: 'Manamedu Delta Pit-Loom Weavers Route',
    trailSteps: [
      { step: 1, title: 'Warping & Reed Threading', desc: 'Over 4,000 individual fine cotton warp threads are precisely aligned along bamboo racks.' },
      { step: 2, title: 'Meet Head Weaver K. Ramalingam', desc: 'Learn how mathematical jacquard punchcards dictate intricate border patterns.' },
      { step: 3, title: 'Rhythmic Fly-Shuttle Demonstration', desc: 'Observe the synchronized foot pedals and wooden shuttle glide in pit-looms.' },
      { step: 4, title: 'Natural Indigo Vat Dyeing Check', desc: 'Inspect the fermented organic indigo dye tanks along the Cauvery canal.' }
    ]
  },
  {
    id: 'woraiyur-handloom',
    name: 'Kodiyampalayam Sri Cauvery Handloom Society',
    craftType: 'handloom',
    typeLabel: 'GI Registered Society',
    emoji: '🧵',
    cluster: 'Woraiyur',
    artisanName: 'S. Meenakshisundaram',
    badge: '✓ GI Registered Society',
    distanceKm: 3.8,
    isOpen: true,
    address: 'Weavers Colony, Woraiyur Heritage Quarters, Trichy',
    coordinates: [10.8250, 78.6830],
    bio: 'Historic weaving epicenter dating back to the Early Chola dynasty, renowned for featherweight cottons and Korvai contrast temple borders.',
    materials: 'Single-origin certified Erode cotton, natural madder & myrobalan dyes.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    phone: '+91 97890 33411',
    productCount: 4,
    trailStopNumber: 4,
    trailTitle: 'Sangam-Era Woraiyur Chola Textile Trail',
    trailSteps: [
      { step: 1, title: 'Ancient Woraiyur History Walk', desc: 'Explore historical alleys where Sangam bards praised fabrics fine as morning vapor.' },
      { step: 2, title: 'Korvai Interlock Technique', desc: 'Watch two weavers collaborate on opposite sides of the loom to lock contrasting borders.' },
      { step: 3, title: 'Organic Herbal Dye Extraction', desc: 'See pure pomegranate rinds and turmeric boiled to create sunny yellow tints.' },
      { step: 4, title: 'Direct Cooperative Showroom Access', desc: 'Access rare archival saree designs woven for temple festival processions.' }
    ]
  },
  {
    id: 'brightbox-crafts',
    name: 'Brightbox Handicrafts & Wood Guild',
    craftType: 'woodcraft',
    typeLabel: 'Woodcraft Guild',
    emoji: '🪵',
    cluster: 'KK Nagar',
    artisanName: 'V. Muruganandam',
    badge: '✓ Certified Aggregator',
    distanceKm: 6.2,
    isOpen: true,
    address: 'Artisan Hub, KK Nagar Central Avenue, Trichy',
    coordinates: [10.7780, 78.7050],
    bio: 'Artisan guild preserving traditional temple architectural wood carving, relief wall crests, and fragrant seasoned rosewood utility wares.',
    materials: 'Reclaimed aged Teakwood, seasoned Rosewood, natural beeswax polish.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    phone: '+91 94862 44781',
    productCount: 3,
    trailStopNumber: 5,
    trailTitle: 'KK Nagar Temple Vahana & Woodcarving Studio',
    trailSteps: [
      { step: 1, title: 'Timber Selection & Grain Analysis', desc: 'Artisans inspect timber grain direction to ensure zero cracking in tropical weather.' },
      { step: 2, title: 'Chisel & Gouge Profiling', desc: 'Master carvers employ over 25 custom hand chisels to sculpt feathered peacock wings.' },
      { step: 3, title: 'Zero-Chemical Beeswax Buffing', desc: 'Natural finish using hot wild beeswax and coarse jute rubbing cloths.' },
      { step: 4, title: 'Custom Architectural Orders Hub', desc: 'Consult directly on custom door lintels and heirloom puja mandapams.' }
    ]
  },
  {
    id: 'koda-exports',
    name: 'Koda Exports & Palmyrah Fiber Collective',
    craftType: 'fiber',
    typeLabel: 'Natural Fiber Collective',
    emoji: '📦',
    cluster: 'Inamkulathur',
    artisanName: 'Kanimozhi & Selvi',
    badge: '✓ Women Artisans Collective',
    distanceKm: 8.5,
    isOpen: true,
    address: 'Rural Cluster Yard, Inamkulathur, Trichy Rural',
    coordinates: [10.7450, 78.6150],
    bio: 'Self-help cooperative of 85 rural women craftswomen harvesting high-tensile Palmyra palm leaf ribs to weave durable, eco-friendly luxury hampers.',
    materials: 'Sun-dried Palmyra palm rib fiber, vetiver roots, natural vegetable stains.',
    image: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=600&q=80',
    phone: '+91 93610 99230',
    productCount: 3,
    trailStopNumber: 6,
    trailTitle: 'Inamkulathur Sustainable Palmyrah Rural Trail',
    trailSteps: [
      { step: 1, title: 'Palm Frond Harvesting & Splitting', desc: 'Learn how resilient palmyrah ribs are stripped into pliable micro-strands.' },
      { step: 2, title: 'Meet Collective Founders Kanimozhi & Selvi', desc: 'Hear how sustainable craft cooperatives transformed livelihoods for 85 families.' },
      { step: 3, title: 'Vetiver Root Weft Intertwining', desc: 'Aromatic vetiver roots are woven into hamper bases for natural insect resistance.' },
      { step: 4, title: 'Zero-Waste Packing Demonstration', desc: 'Discover 100% biodegradable craft packaging crafted on site.' }
    ]
  },
  {
    id: 'rudras-terracotta',
    name: 'Rudras Terracotta Jewellery & Studio',
    craftType: 'terracotta',
    typeLabel: 'Artisan Jewellery Studio',
    emoji: '🏺',
    cluster: 'KK Nagar',
    artisanName: 'Rudra Priyadarshini',
    badge: '✓ Verified Studio',
    distanceKm: 4.8,
    isOpen: true,
    address: 'Karumandapam Bypass Road, Near Railway Colony, Trichy',
    coordinates: [10.7920, 78.6750],
    bio: 'Contemporary clay jewellery designer blending ancient temple terracotta sculpting with modern, lightweight wearable art.',
    materials: 'Triple-filtered fine terracotta clay, surgical-grade hypoallergenic brass hooks, organic gold leaf patina.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    phone: '+91 98941 77209',
    productCount: 2,
    trailStopNumber: 7,
    trailTitle: 'Karumandapam Micro-Clay Jewellery Studio',
    trailSteps: [
      { step: 1, title: 'Micro-Kneading of Alluvial Clay', desc: 'Clay is refined to eliminate any graininess for delicate earring filigrees.' },
      { step: 2, title: 'Miniature Jhumka Moulding', desc: 'Watch intricate temple motifs hand-embossed using antique wooden stamps.' },
      { step: 3, title: 'Controlled Miniature Electric Firing', desc: 'Hardened at 950°C to achieve featherlight yet durable ceramic strength.' },
      { step: 4, title: 'Gold Patina & Gem Setting', desc: 'Hand-painted with waterproof natural earth pigments and antique gold accents.' }
    ]
  },
  {
    id: 'poompuhar-retail',
    name: 'Poompuhar Sales Showroom & State Guild',
    craftType: 'retail',
    typeLabel: 'Govt Heritage Center',
    emoji: '🏛️',
    cluster: 'Woraiyur',
    artisanName: 'TN Handicrafts Development Corp',
    badge: '✓ Govt Verified Center',
    distanceKm: 2.5,
    isOpen: true,
    address: 'Singarathope Market Complex, Main Town, Trichy',
    coordinates: [10.8290, 78.6970],
    bio: 'Apex Tamil Nadu state craft showroom displaying certified Thanjavur art plates, Swamimalai bronzes, and GI heritage artifacts.',
    materials: 'Certified brass, copper, 24K silver leaf, embossed relief motifs.',
    image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80',
    phone: '+91 431 270 4521',
    productCount: 2,
    trailStopNumber: 8,
    trailTitle: 'Singarathope State Heritage Artisanal Hub',
    trailSteps: [
      { step: 1, title: 'GI Verification Seal Archival Room', desc: 'Learn how geographical indication seals verify raw metal purity and regional origin.' },
      { step: 2, title: 'Thanjavur Art Plate Repoussé Demo', desc: 'Examine silver and brass sheets hammered into devotional motifs over pitch beds.' },
      { step: 3, title: 'Curated GI Masterpiece Gallery', desc: 'View master-level museum sculptures from state awardee artisans.' },
      { step: 4, title: 'Government Certificate Issuance', desc: 'Every heirloom purchase receives tamper-proof state provenance documents.' }
    ]
  }
];

// Products available in the ecosystem
export const PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Hand-Cast Brass Annam Kuthu Vilakku',
    craftType: 'brass',
    categoryLabel: 'Brass Metal',
    categoryEmoji: '🪔',
    workshopId: 'cholan-arts',
    workshopName: 'Srirangam Bronze & Brass Foundry',
    artisanName: 'Master S. Soundararajan (Cholan Arts)',
    cluster: 'Srirangam',
    distanceKm: 2.1,
    badge: '✓ Verified GI Workshop',
    badgeType: 'gi',
    isOpen: true,
    price: 2800,
    stock: 3,
    description: 'Lost-wax cast bell metal crafted by Cholan Arts with temple foundry links. Embellished with the mythical Annam bird crest and tiered oil reservoirs.',
    materials: 'Panchaloha bell metal alloy (copper, tin, zinc), fine Cauvery river silt molds.',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80',
    coordinates: [10.8625, 78.6948],
    passport: {
      hash: 'SHA256-SRI-BRASS-7741-2026',
      origin: 'Srirangam Temple Foundry Quarter, Tiruchirappalli',
      materials: '80% Virgin Copper, 20% Tin/Zinc Bell Metal with Cauvery Silt Casting',
      technique: 'Cire-Perdue (Lost Wax Casting) with traditional stone stylus carving',
      artisanLinage: 'Cholan Arts • 4th Generation Temple Sthapathi',
      sealTimestamp: '14 Feb 2026 • 16:40 IST',
      govtCertNo: 'TN-GI-BELLMETAL-TR-402'
    }
  },
  {
    id: 'p-2',
    name: 'Cauvery Clay Terracotta Deepam Set (4 pcs)',
    craftType: 'terracotta',
    categoryLabel: 'Terracotta',
    categoryEmoji: '🏺',
    workshopId: 'vishalini-clay',
    workshopName: 'Musiri Terracotta & Clay Studio',
    artisanName: 'Meenakshi Ammal',
    cluster: 'Musiri',
    distanceKm: 4.2,
    badge: '✓ Verified Maker',
    badgeType: 'verified',
    isOpen: true,
    price: 450,
    stock: 7,
    description: 'Hand-molded earthenware from natural Musiri riverbed clay by Meenakshi Ammal. Fired in small wood batches with natural earthen finish.',
    materials: 'Cauvery alluvial river silt, organic rice husk temper, natural smoke kiln.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    coordinates: [10.9380, 78.4485],
    passport: {
      hash: 'SHA256-MUS-CLAY-1092-2026',
      origin: 'Musiri Cauvery Basin, Tiruchirappalli District',
      materials: '100% Unbleached Riverbed Alluvial Silt, Rice Husk Stabilizer',
      technique: 'Manual Kick-Wheel Shaping & Open Straw Pit Fire',
      artisanLinage: 'Vishalini Clay Crafts • Hereditary Potter Guild',
      sealTimestamp: '22 Feb 2026 • 11:15 IST',
      govtCertNo: 'TN-CRAFT-RURAL-MS-881'
    }
  },
  {
    id: 'p-3',
    name: 'Traditional Woraiyur Fine Cotton Saree',
    craftType: 'handloom',
    categoryLabel: 'Handloom',
    categoryEmoji: '🧵',
    workshopId: 'manamedu-weavers',
    workshopName: 'Manamedu Weavers Society',
    artisanName: 'K. Ramalingam (Head Weaver)',
    cluster: 'Manamedu',
    distanceKm: 5.4,
    badge: '✓ Cooperative Guild',
    badgeType: 'coop',
    isOpen: true,
    price: 1850,
    stock: 12,
    description: 'Pure handloom woven on regional pit-looms with traditional temple border. Extremely soft, lightweight, and engineered for tropical ventilation.',
    materials: '100s count combed cotton, natural vegetable dyes, gold zari accents.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d615e1?auto=format&fit=crop&w=600&q=80',
    coordinates: [10.9120, 78.4120],
    passport: {
      hash: 'SHA256-MNM-LOOM-5532-2026',
      origin: 'Manamedu Village, Musiri Taluk, Trichy Belt',
      materials: 'Certified Erode Cotton 100s Count, Organic Indigo & Madder',
      technique: 'Underground Pit-Loom with Interlocked Korvai Temple Border',
      artisanLinage: 'Manamedu Devanga Weavers Cooperative Society #342',
      sealTimestamp: '05 Jan 2026 • 09:30 IST',
      govtCertNo: 'TN-HANDLOOM-COOP-MNM-140'
    }
  },
  {
    id: 'p-4',
    name: 'Woraiyur GI Cotton Saree with Korvai Temple Border',
    craftType: 'handloom',
    categoryLabel: 'Handloom',
    categoryEmoji: '🧵',
    workshopId: 'woraiyur-handloom',
    workshopName: 'Kodiyampalayam Sri Cauvery Handloom Society',
    artisanName: 'S. Meenakshisundaram',
    cluster: 'Woraiyur',
    distanceKm: 3.8,
    badge: '✓ GI Registered Society',
    badgeType: 'gi',
    isOpen: true,
    price: 2400,
    stock: 6,
    description: 'Historical Early Chola pattern hand-woven with dual shuttles to achieve contrasting ruby red border and pearl ivory body.',
    materials: 'Fine count pure cotton, natural pomegranate and turmeric extracts.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    coordinates: [10.8250, 78.6830],
    passport: {
      hash: 'SHA256-WRY-GI-9921-2026',
      origin: 'Woraiyur Ancient Capital Quarters, Tiruchirappalli',
      materials: '100% Pure Long-Staple Cotton, Bio-Enzyme Washed',
      technique: 'Sangam-Era Korvai Dual-Weft Shuttle Weaving',
      artisanLinage: 'Woraiyur Traditional Cotton Guild (Established 1912)',
      sealTimestamp: '18 Jan 2026 • 14:05 IST',
      govtCertNo: 'GI-APPL-TEXTILE-WRY-99'
    }
  },
  {
    id: 'p-5',
    name: 'Hand-Carved Wooden Peacock Door Crest',
    craftType: 'woodcraft',
    categoryLabel: 'Woodcraft',
    categoryEmoji: '🪵',
    workshopId: 'brightbox-crafts',
    workshopName: 'Brightbox Handicrafts & Wood Guild',
    artisanName: 'V. Muruganandam',
    cluster: 'KK Nagar',
    distanceKm: 6.2,
    badge: '✓ Certified Aggregator',
    badgeType: 'aggregator',
    isOpen: true,
    price: 3200,
    stock: 4,
    description: 'Carved from single block seasoned teakwood depicting the dancing peacock with plumage filigree. Hand finished with wild beeswax.',
    materials: 'Seasoned reclaimed teakwood, pure beeswax, mineral pigment buff.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    coordinates: [10.7780, 78.7050],
    passport: {
      hash: 'SHA256-KKN-WOOD-3382-2026',
      origin: 'KK Nagar Artisan Corridor, Tiruchirappalli',
      materials: 'Certified Sustainable Reclaimed Country Teak (Age: 45 yrs)',
      technique: 'Relief Hand Chisel Carving with 28 Gouge Profiles',
      artisanLinage: 'Muruganandam Woodcraft Atelier',
      sealTimestamp: '02 Feb 2026 • 17:50 IST',
      govtCertNo: 'TN-WOOD-GUILD-KK-77'
    }
  },
  {
    id: 'p-6',
    name: 'Woven Palmyrah Storage Hamper with Vetiver Lining',
    craftType: 'fiber',
    categoryLabel: 'Natural Fiber',
    categoryEmoji: '📦',
    workshopId: 'koda-exports',
    workshopName: 'Koda Exports & Palmyrah Fiber Collective',
    artisanName: 'Kanimozhi & Selvi',
    cluster: 'Inamkulathur',
    distanceKm: 8.5,
    badge: '✓ Women Artisans Collective',
    badgeType: 'coop',
    isOpen: true,
    price: 890,
    stock: 9,
    description: 'High tensile palm frond ribs woven into sturdy cylindrical hampers. Natural vetiver roots woven into the base impart a soothing earthy fragrance.',
    materials: 'Natural sun-cured Palmyrah palm ribs, fragrant vetiver roots.',
    image: 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=600&q=80',
    coordinates: [10.7450, 78.6150],
    passport: {
      hash: 'SHA256-INM-FIBER-4410-2026',
      origin: 'Inamkulathur Rural Cooperative, Trichy South Belt',
      materials: 'Wild Harvested Palm Fronds, Cauvery Delta Vetiver Root',
      technique: 'Interlocking Spiral Braid Weave by Women SHG',
      artisanLinage: 'Inamkulathur Palmyrah Self-Help Enterprise',
      sealTimestamp: '12 Feb 2026 • 12:20 IST',
      govtCertNo: 'TN-ECO-SHG-INM-305'
    }
  },
  {
    id: 'p-7',
    name: 'Terracotta Temple Jhumka Earrings with Gold Patina',
    craftType: 'terracotta',
    categoryLabel: 'Terracotta',
    categoryEmoji: '🏺',
    workshopId: 'rudras-terracotta',
    workshopName: 'Rudras Terracotta Jewellery & Studio',
    artisanName: 'Rudra Priyadarshini',
    cluster: 'KK Nagar',
    distanceKm: 4.8,
    badge: '✓ Verified Studio',
    badgeType: 'verified',
    isOpen: true,
    price: 380,
    stock: 18,
    description: 'Ultra-lightweight hand-stamped clay jhumkas fired at 950°C. Accented with subtle 24k gold leaf highlights and nickel-free brass hooks.',
    materials: 'Triple-sieved alluvial clay, hypoallergenic surgical brass, acrylic lacquer.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    coordinates: [10.7920, 78.6750],
    passport: {
      hash: 'SHA256-KRM-JHUMKA-8812-2026',
      origin: 'Karumandapam Studio, Tiruchirappalli',
      materials: 'Pure Fine Particle Terracotta Clay & Metallic Enamel',
      technique: 'Miniature Ceramic Moulding & Dual-Stage Kiln Harden',
      artisanLinage: 'Rudras Contemporary Craft Atelier',
      sealTimestamp: '25 Feb 2026 • 15:10 IST',
      govtCertNo: 'TN-DESIGN-STUDIO-RP-12'
    }
  },
  {
    id: 'p-8',
    name: 'Thanjavur Art Plate with Sri Ranganatha Motif (7 inch)',
    craftType: 'brass',
    categoryLabel: 'Brass Metal',
    categoryEmoji: '🪔',
    workshopId: 'poompuhar-retail',
    workshopName: 'Poompuhar Sales Showroom',
    artisanName: 'State Master Craftsman (Poompuhar Guild)',
    cluster: 'Woraiyur',
    distanceKm: 2.5,
    badge: '✓ Govt Verified Center',
    badgeType: 'gi',
    isOpen: true,
    price: 4100,
    stock: 5,
    description: 'Authentic GI registered Thanjavur Art Plate with repoussé central brass medallion depicting the reclining Sri Ranganatha deity flanked by copper floral bands.',
    materials: 'Heavy gauge brass base, hand-beaten copper motifs, 24K silver foil inlay.',
    image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80',
    coordinates: [10.8290, 78.6970],
    passport: {
      hash: 'SHA256-PMP-PLATE-0091-2026',
      origin: 'Singarathope Craft Hub / Thanjavur Region Guild',
      materials: 'Certified Virgin Brass Base (70% Cu / 30% Zn) + Pure Copper Foils',
      technique: 'Cold Repoussé Hammering on Pine Rosin Bed with Chasing Stylus',
      artisanLinage: 'Tamil Nadu Handicrafts Development Corp (Poompuhar)',
      sealTimestamp: '10 Feb 2026 • 18:00 IST',
      govtCertNo: 'TN-GI-ARTPLATE-STATE-01'
    }
  }
];

// Initial commissions in user account
export const INITIAL_COMMISSIONS: Commission[] = [
  {
    id: 'comm-1',
    title: 'Terracotta Deepam — Bespoke Tamil Inscription',
    artisanName: 'Meenakshi Ammal',
    cluster: 'Musiri',
    status: 'In Progress (Artisan Accepted)',
    statusCode: 'accepted',
    statusColor: '#4D6A55',
    eta: 'Estimated completion: 3 days',
    progressPercent: 65,
    customText: 'மங்கலம் பொங்கட்டும் (May prosperity bloom)',
    finish: 'Natural Smoke Black Earthen',
    size: 'Large',
    quantity: 4,
    price: 950,
    date: '24 Feb 2026'
  },
  {
    id: 'comm-2',
    title: 'Woraiyur Handloom Saree — Natural Indigo Border',
    artisanName: 'Manamedu Weavers Society',
    cluster: 'Manamedu',
    status: 'Shipped via Cluster Van',
    statusCode: 'shipped',
    statusColor: '#2C3E50',
    eta: 'Tracking: #TR-402 • Arriving tomorrow',
    progressPercent: 90,
    customText: 'Heirloom Korvai Temple Weave with Indigo Selvedge',
    finish: 'Organic Indigo Dyed Border',
    size: 'Standard 6.2m with Blouse',
    quantity: 1,
    price: 2600,
    trackingNo: '#TR-402',
    date: '20 Feb 2026'
  }
];

// Curated living heritage workshop itineraries
export const CRAFT_TRAILS: CraftTrail[] = [
  {
    id: 'trail-cauvery-full',
    name: 'The Grand Cauvery Delta Heritage Craft Circuit',
    distance: '68 km',
    duration: 'Full Day (6.5 hrs)',
    stopCount: 7,
    giClustersCount: 4,
    highlight: 'Lost-wax bronze, ancient pit-loom silk, riverbed terracotta, and sacred woodcraft',
    description: 'An immersive route connecting the temple foundry of Srirangam, Sangam textile lanes of Woraiyur, all the way along the Cauvery riverbank to Musiri and Manamedu.',
    stops: [
      { name: 'Cholan Arts Foundry', craft: 'Lost-Wax Bronze & Bell Metal', cluster: 'Srirangam', lat: 10.8625, lng: 78.6948 },
      { name: 'Poompuhar State Heritage Center', craft: 'Thanjavur Art Plates', cluster: 'Woraiyur', lat: 10.8290, lng: 78.6970 },
      { name: 'Kodiyampalayam Handloom Society', craft: 'Woraiyur Cotton Saree', cluster: 'Woraiyur', lat: 10.8250, lng: 78.6830 },
      { name: 'Rudras Studio', craft: 'Terracotta Jewellery', cluster: 'KK Nagar', lat: 10.7920, lng: 78.6750 },
      { name: 'Brightbox Wood Guild', craft: 'Teakwood Temple Carving', cluster: 'KK Nagar', lat: 10.7780, lng: 78.7050 },
      { name: 'Vishalini Clay Crafts', craft: 'Riverbed Terracotta & Kiln', cluster: 'Musiri', lat: 10.9380, lng: 78.4485 },
      { name: 'Manamedu Weavers Society', craft: 'Underground Pit-Looms', cluster: 'Manamedu', lat: 10.9120, lng: 78.4120 }
    ]
  },
  {
    id: 'trail-srirangam-spiritual',
    name: 'Sacred Temples & Foundry Walk',
    distance: '6.4 km',
    duration: 'Morning (3 hrs)',
    stopCount: 3,
    giClustersCount: 2,
    highlight: 'Temple bell metal, Thanjavur repoussé art plates & holy garlands',
    description: 'Stroll around the majestic corridors of Srirangam and Singarathope to experience sacred metalcraft casting.',
    stops: [
      { name: 'Cholan Arts Foundry', craft: 'Lost-Wax Bronze & Bell Metal', cluster: 'Srirangam', lat: 10.8625, lng: 78.6948 },
      { name: 'Poompuhar State Heritage Center', craft: 'Thanjavur Art Plates', cluster: 'Woraiyur', lat: 10.8290, lng: 78.6970 },
      { name: 'Kodiyampalayam Handloom Society', craft: 'Woraiyur Cotton Saree', cluster: 'Woraiyur', lat: 10.8250, lng: 78.6830 }
    ]
  },
  {
    id: 'trail-musiri-riverbed',
    name: 'Cauvery Riverbed Clay & Pit-Loom Odyssey',
    distance: '24 km',
    duration: 'Afternoon (4 hrs)',
    stopCount: 3,
    giClustersCount: 2,
    highlight: 'Hands-on potter wheel sessions, organic indigo vats & pit-looms',
    description: 'Journey west along the lush Cauvery canal into rural Musiri and Manamedu to work with raw silt and fly-shuttles.',
    stops: [
      { name: 'Vishalini Clay Crafts', craft: 'Riverbed Terracotta & Kiln', cluster: 'Musiri', lat: 10.9380, lng: 78.4485 },
      { name: 'Manamedu Weavers Society', craft: 'Underground Pit-Looms', cluster: 'Manamedu', lat: 10.9120, lng: 78.4120 },
      { name: 'Koda Palmyrah Collective', craft: 'Woven Fiber & Vetiver', cluster: 'Inamkulathur', lat: 10.7450, lng: 78.6150 }
    ]
  },
  {
    id: 'trail-urban-guilds',
    name: 'Contemporary Studios & Guild Corridors',
    distance: '14 km',
    duration: 'Half Day (3.5 hrs)',
    stopCount: 3,
    giClustersCount: 1,
    highlight: 'Micro-terracotta jewellery, sustainable palm fiber & teakwood carving',
    description: 'Explore emerging contemporary craft studios and women collectives innovating traditional materials in urban Trichy.',
    stops: [
      { name: 'Rudras Studio', craft: 'Terracotta Jewellery', cluster: 'KK Nagar', lat: 10.7920, lng: 78.6750 },
      { name: 'Brightbox Wood Guild', craft: 'Teakwood Temple Carving', cluster: 'KK Nagar', lat: 10.7780, lng: 78.7050 },
      { name: 'Koda Palmyrah Collective', craft: 'Woven Fiber & Vetiver', cluster: 'Inamkulathur', lat: 10.7450, lng: 78.6150 }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Artisan Update • Meenakshi Ammal',
    desc: 'Began straw-pit firing for your custom inscribed Terracotta Deepams in Musiri.',
    time: '25m ago',
    unread: true
  },
  {
    id: 2,
    title: 'Cluster Van Transit • Saree #TR-402',
    desc: 'Handloom saree package departed Manamedu cooperative consolidation point.',
    time: '2h ago',
    unread: true
  },
  {
    id: 3,
    title: 'New Craft Trail Unlocked',
    desc: 'The Grand Cauvery Delta Heritage Circuit is now open for weekend bookings.',
    time: '1d ago',
    unread: false
  }
];
