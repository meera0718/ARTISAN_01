// utils/matchingEngine.ts
// Deterministic Multi-Factor Match Engine for Trichy & Cauvery Craft Network

export function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface MatchRequirement {
  id?: string;
  category: string;
  craft?: string;
  lat?: number;
  lng?: number;
  quantity?: number | string;
  artisanName?: string;
  title?: string;
}

export interface MatchOpportunity {
  id?: string;
  category: string;
  title: string;
  lat?: number;
  lng?: number;
  availableSlots?: number;
  demandDesc?: string;
  locality?: string;
}

export interface MatchAnalysis {
  score: number;
  percentage: string;
  distanceKm: string;
  rationale: string;
}

export function calculateMatchScore(
  requirement: MatchRequirement,
  opportunity: MatchOpportunity
): MatchAnalysis {
  // 1. Craft / Category Alignment (Max 40 points)
  let craftScore = 0;
  const reqCat = (requirement.category || '').toLowerCase();
  const oppCat = (opportunity.category || '').toLowerCase();
  const reqCraft = (requirement.craft || reqCat).toLowerCase();
  const oppTitle = (opportunity.title || '').toLowerCase();

  if (reqCat && oppCat && reqCat === oppCat) {
    craftScore = 40;
  } else if (oppCat === 'all' || oppCat === 'handicrafts') {
    craftScore = 25;
  } else if (oppTitle.includes(reqCraft)) {
    craftScore = 20;
  }

  // 2. Proximity Scoring via Haversine Distance (Max 35 points)
  const distKm = getHaversineDistance(
    requirement.lat || 10.8200,
    requirement.lng || 78.6900,
    opportunity.lat || 10.8624,
    opportunity.lng || 78.6946
  );
  let proximityScore = 0;
  if (distKm <= 3.0) proximityScore = 35;
  else if (distKm <= 7.0) proximityScore = 25;
  else if (distKm <= 15.0) proximityScore = 15;
  else proximityScore = 5;

  // 3. Capacity & Volume Feasibility (Max 25 points)
  const reqQty = typeof requirement.quantity === 'number'
    ? requirement.quantity
    : (parseInt(String(requirement.quantity || '1'), 10) || 1);
  const availSlots = opportunity.availableSlots || 1;
  let capacityScore = 0;
  if (availSlots >= reqQty) {
    capacityScore = 25;
  } else if (availSlots > 0) {
    capacityScore = Math.round((availSlots / reqQty) * 25);
  }

  const totalScore = Math.min(craftScore + proximityScore + capacityScore, 98);

  return {
    score: totalScore,
    percentage: `${totalScore}%`,
    distanceKm: distKm.toFixed(1),
    rationale: `${craftScore}pts Category + ${proximityScore}pts Proximity (${distKm.toFixed(1)}km) + ${capacityScore}pts Capacity`
  };
}
