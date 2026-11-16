/**
 * Approximate geographic position of each branch's TOWN (not the exact shop door).
 * Values are public town-centre coordinates used only to place pins on the district map.
 * If exact shop coordinates are available, replace them here (lat, lng in decimal degrees).
 * Keyed by Branch.slug from `@/data/branches`.
 */
export const BRANCH_GEO: Record<string, { lat: number; lng: number }> = {
  "karad-hq": { lat: 17.2894, lng: 74.1829 },
  "karad-kolhapur-naka": { lat: 17.2755, lng: 74.19 },
  undale: { lat: 17.19, lng: 74.1 },
  "patan-mhavashi": { lat: 17.375, lng: 73.904 },
  "satara-bombay-rest": { lat: 17.685, lng: 74.001 },
  "satara-guruwar-peth": { lat: 17.6805, lng: 74.0183 },
  vaduj: { lat: 17.5981, lng: 74.4478 },
  wai: { lat: 17.95, lng: 73.89 },
  shirwal: { lat: 18.158, lng: 73.98 },
  koregaon: { lat: 17.7, lng: 74.16 },
  dahiwadi: { lat: 17.68, lng: 74.55 },
  "ishwarpur-islampur": { lat: 17.04, lng: 74.26 },
  "sangli-vishrambag": { lat: 16.8524, lng: 74.5815 },
  miraj: { lat: 16.823, lng: 74.645 },
  vita: { lat: 17.27, lng: 74.54 },
  palus: { lat: 17.09, lng: 74.45 },
  tasgaon: { lat: 17.04, lng: 74.6 },
  "kolhapur-kawala-naka": { lat: 16.705, lng: 74.2433 },
  ichalkaranji: { lat: 16.691, lng: 74.46 },
  "pune-moshi": { lat: 18.67, lng: 73.85 },
  "pune-kharadi": { lat: 18.551, lng: 73.94 },
  "pune-hadapsar": { lat: 18.5, lng: 73.926 },
  "solapur-employment-chowk": { lat: 17.6599, lng: 75.9064 },
  "ratnagiri-port": { lat: 16.981, lng: 73.285 },
  "malvan-port": { lat: 16.059, lng: 73.463 },
};
