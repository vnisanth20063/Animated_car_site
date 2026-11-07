// Packages are configured by ARS. Only entries with approved: true are shown to visitors.
// Drafts below are NOT official. Open /packages?preview=drafts to see how they render.
export interface Package {
  id: string;
  name: string;
  description: string;
  includes: string[]; // service slugs
  approved: boolean;
}
export const packages: Package[] = [
  { id: 'interior-refresh', name: 'Interior Refresh', description: 'Draft: a combined interior clean.', includes: ['germ-clean-interior-panels', 'steam-interior-panels', 'dirt-extraction-fabric-seats-floors'], approved: false },
  { id: 'exterior-care', name: 'Exterior Care', description: 'Draft: wash, decontamination and protection.', includes: ['foam-wax-degrease-ceramic-wash', 'clay-bar-descaling-wash', 'paint-protection-coatings'], approved: false },
  { id: 'underbody-guard', name: 'Underbody Guard', description: 'Draft: underbody and exhaust protection.', includes: ['underchassis-protection-coating', 'silencer-protection-coating'], approved: false },
];
