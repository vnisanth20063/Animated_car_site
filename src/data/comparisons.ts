// Before/after pairs. Add only matching vehicle, angle and result.
// Put files in /public/comparisons and set before/after to e.g. '/comparisons/wheel-before.jpg'.
// Entries without images render as clearly labelled placeholders.
// Set illustrative: false ONLY for photos of real ARS jobs. While true, the slider shows an
// "Illustrative image" label so visitors are not told it is an actual customer result.
export interface Comparison {
  id: string;
  title: string;
  serviceSlug: string;
  vehicle?: string;
  before?: string;
  after?: string;
  illustrative?: boolean;
}
export const comparisons: Comparison[] = [
  {
    id: 'wheels', title: 'Alloy wheel transformation', serviceSlug: 'alloy-wheel-deep-cleaning',
    before: '/comparisons/wheel-before.jpg', after: '/comparisons/wheel-after.jpg', illustrative: true,
  },
  {
    id: 'paint', title: 'Paint protection result', serviceSlug: 'paint-protection-coatings',
    before: '/comparisons/paint-before.jpg', after: '/comparisons/paint-after.jpg', illustrative: true,
  },
  {
    id: 'seat', title: 'Fabric seat extraction', serviceSlug: 'dirt-extraction-fabric-seats-floors',
    before: '/comparisons/seat-before.jpg', after: '/comparisons/seat-after.jpg', illustrative: true,
  },
];
