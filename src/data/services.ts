export type CategoryId = 'fresh-water-wash' | 'exclusive-treatments' | 'interior-cleaning' | 'paint-protection';

export interface Category { id: CategoryId; letter: string; label: string; blurb: string }
export interface Service {
  id: number;
  slug: string; // also the video / poster file name
  title: string;
  category: CategoryId;
  short: string;
  description: string;
  benefits: string[];
  process: string[];
}

export const categories: Category[] = [
  { id: 'fresh-water-wash', letter: 'A', label: 'Fresh Water Wash', blurb: 'Exterior washes that start the detailing journey.' },
  { id: 'exclusive-treatments', letter: 'B', label: 'Exclusive Treatments', blurb: 'Deep cleaning and protection for the places a wash does not reach.' },
  { id: 'interior-cleaning', letter: 'C', label: 'Interior Cleaning Treatments', blurb: 'Panels, fabric, leather and plastics, cleaned with care.' },
  { id: 'paint-protection', letter: 'D', label: 'Paint Protection', blurb: 'Protective finishes for the paintwork.' },
];

const s = (x: Omit<Service, 'id'>[]): Service[] => x.map((v, i) => ({ ...v, id: i + 1 }));

export const services: Service[] = s([
  {
    slug: 'foam-wax-degrease-ceramic-wash', category: 'fresh-water-wash',
    title: 'Foam, Wax, Degrease & Ceramic Wash',
    short: 'A foam wash with degreasing, finished with wax and ceramic protection.',
    description: 'A full exterior wash that begins with a thick foam pre-wash and degreasing, is rinsed with care, and is finished by hand with wax and ceramic protection.',
    benefits: ['Foam softens and lifts surface dirt before contact', 'Degreasing helps clear oily road film', 'A wax and ceramic stage leaves a protective finish'],
    process: ['Foam pre-wash', 'Degrease and rinse', 'Wheels and lower panels rinsed', 'Wax and ceramic finish applied by hand'],
  },
  {
    slug: 'clay-bar-descaling-wash', category: 'fresh-water-wash',
    title: 'Clay Bar Descaling Wash',
    short: 'Clay bar treatment that lifts bonded contaminants from the paint.',
    description: 'A clay bar is glided over lubricated paint to lift bonded contamination that a normal wash leaves behind, then the panel is wiped clean with microfibre.',
    benefits: ['Helps remove bonded surface contamination', 'Leaves paint feeling smoother', 'Prepares paint for wax or coating'],
    process: ['Panel wetted with lubricant', 'Clay bar worked across the paint', 'Residue wiped away with microfibre', 'Surface inspected'],
  },
  {
    slug: 'engine-bay-deep-cleaning', category: 'exclusive-treatments',
    title: 'Engine Bay Deep Cleaning & Protection',
    short: 'Detailed engine bay cleaning with a protective finish.',
    description: 'The engine bay is cleaned in detail with brushes, cloths and a steam-style wand around connectors, covers and hoses, then finished with protection.',
    benefits: ['Removes dust and grime from visible surfaces', 'Tidier bay makes leaks and wear easier to spot', 'Protective finish on plastics and hoses'],
    process: ['Bay inspected', 'Brush work around edges and connectors', 'Surfaces cleaned and wiped', 'Protection applied'],
  },
  {
    slug: 'alloy-wheel-deep-cleaning', category: 'exclusive-treatments',
    title: 'Alloy Wheel Deep Cleaning & Protection',
    short: 'Brake dust and grime cleaned from alloys, then protected.',
    description: 'Wheel cleaner is applied and agitated with brushes to break down brake dust and grime, rinsed off, dried by hand and finished with protection.',
    benefits: ['Targets brake dust and road grime', 'Reaches spokes and barrel with brushes', 'Protection helps keep wheels cleaner for longer'],
    process: ['Cleaner applied to wheel', 'Brush agitation', 'Pressure rinse', 'Hand dry and protect'],
  },
  {
    slug: 'rat-repellent-treatment', category: 'exclusive-treatments',
    title: 'Rat Repellent Treatment',
    short: 'Repellent applied in the engine bay and around the wheel arches.',
    description: 'A repellent treatment is applied to areas where rodents tend to enter or nest, including the engine bay and wheel arch areas.',
    benefits: ['Targets common rodent entry areas', 'Applied by a trained technician', 'Helps protect wiring and hoses'],
    process: ['Engine bay opened and inspected', 'Repellent applied in the bay', 'Wheel arch areas treated', 'Bay closed and checked'],
  },
  {
    slug: 'rat-entry-odour-eliminate', category: 'exclusive-treatments',
    title: 'Rat Entry Odour Eliminate Process',
    short: 'Odour treatment for vehicles affected by rodent entry.',
    description: 'A fogging treatment is used inside the engine bay to neutralise odours left behind after rodents have entered the vehicle.',
    benefits: ['Targets odour at the source area', 'Fog reaches tight spaces', 'Can be combined with a repellent treatment'],
    process: ['Affected areas inspected', 'Surfaces cleaned', 'Odour-neutralising fog applied', 'Bay ventilated and closed'],
  },
  {
    slug: 'plastic-and-rubber-care', category: 'exclusive-treatments',
    title: 'Plastic and Rubber Care',
    short: 'Faded exterior trim and rubber cleaned and renewed.',
    description: 'Weathered window trim, seals and exterior plastics are cleaned and treated so they look deeper and fresher.',
    benefits: ['Restores a darker, cleaner trim finish', 'Helps protect rubber and plastic from fading', 'Sharpens the overall look of the vehicle'],
    process: ['Trim cleaned', 'Surface scrubbed with applicator', 'Residue wiped away', 'Finish checked'],
  },
  {
    slug: 'underchassis-protection-coating', category: 'exclusive-treatments',
    title: 'Underchassis Protection Coating',
    short: 'Protective coating sprayed on the underbody and sills.',
    description: 'With the vehicle raised, a protective coating is sprayed across the underbody and lower panels to guard exposed surfaces.',
    benefits: ['Covers exposed underbody surfaces', 'Applied with the vehicle on a lift', 'Helps guard against road debris and moisture'],
    process: ['Vehicle lifted', 'Underbody inspected', 'Coating sprayed', 'Coating left to settle'],
  },
  {
    slug: 'silencer-protection-coating', category: 'exclusive-treatments',
    title: 'Silencer Protection Coating',
    short: 'Heat-resistant style coating applied to the silencer.',
    description: 'Surrounding areas are masked and a protective coating is sprayed onto the silencer to help guard it against corrosion and wear.',
    benefits: ['Targets the exhaust silencer surface', 'Neat masking protects nearby parts', 'Helps protect against corrosion'],
    process: ['Silencer inspected', 'Surrounding areas masked', 'Coating sprayed', 'Mask removed and checked'],
  },
  {
    slug: 'critical-parts-cleaning', category: 'exclusive-treatments',
    title: 'Critical Parts Cleaning',
    short: 'Careful detail cleaning of key mechanical components.',
    description: 'Important mechanical components are cleaned with fine brushes, swabs and cloths so dirt is removed from small areas.',
    benefits: ['Detail work in tight spaces', 'Removes built-up grime from components', 'Gentle tools used throughout'],
    process: ['Component exposed', 'Brush and swab cleaning', 'Wiped clean', 'Inspected'],
  },
  {
    slug: 'germ-clean-interior-panels', category: 'interior-cleaning',
    title: 'Germ Clean – Full Interior Panels',
    short: 'Sanitising clean for the dash, controls and steering wheel.',
    description: 'Interior panels, controls, vents and the steering wheel are treated with a germ-cleaning product and wiped by hand.',
    benefits: ['Cleans high-touch surfaces', 'Brushes reach vents and seams', 'Leaves the cabin looking fresh'],
    process: ['Product sprayed on cloth or panel', 'Vents and seams brushed', 'Controls and wheel wiped', 'Cabin checked'],
  },
  {
    slug: 'steam-interior-panels', category: 'interior-cleaning',
    title: 'Steam – Full Interior Panels',
    short: 'Steam cleaning for door panels, dash and trims.',
    description: 'A steam wand loosens dirt from interior panels, switches and trims, followed by a hand wipe.',
    benefits: ['Loosens dirt in textured areas', 'Reaches around switches and seams', 'Chemical-light cleaning approach'],
    process: ['Panels steamed', 'Dirt loosened', 'Hand wipe with microfibre', 'Panels checked'],
  },
  {
    slug: 'dirt-extraction-fabric-seats-floors', category: 'interior-cleaning',
    title: 'Dirt Extraction – Fabric Seats & Floors',
    short: 'Shampoo and extraction for fabric seats and floor mats.',
    description: 'Fabric seats and floors are agitated with shampoo and a brush, then dirt and moisture are pulled out with an extractor.',
    benefits: ['Targets embedded dirt in fabric', 'Works on seats and floors', 'Extractor removes dirty water'],
    process: ['Fabric pre-checked', 'Shampoo agitated with brush', 'Extractor lifts dirt', 'Seats and floors inspected'],
  },
  {
    slug: 'leather-and-plastic-care', category: 'interior-cleaning',
    title: 'Leather & Plastic Care',
    short: 'Gentle cleaning and care for leather seats and cabin plastics.',
    description: 'Leather seats and interior plastics are cleaned with soft brushes and cloths, and cared for with leather and plastic products.',
    benefits: ['Soft tools protect surfaces', 'Cleans seams and grain', 'Leaves leather and plastics looking tidy'],
    process: ['Leather brushed clean', 'Surface wiped', 'Plastics and controls cleaned', 'Finish checked'],
  },
  {
    slug: 'paint-protection-coatings', category: 'paint-protection',
    title: 'Protection – Wax, Sealant, Graphene & Ceramic Coatings',
    short: 'Choose wax, sealant, graphene or ceramic protection for the paint.',
    description: 'A protective layer is applied to the paint by hand. ARS offers wax, sealant, graphene and ceramic options; the right choice is confirmed for your vehicle.',
    benefits: ['Several protection levels to choose from', 'Hand application for even coverage', 'Water beading on protected paint'],
    process: ['Paint inspected', 'Surface prepared', 'Protection applied by hand', 'Finish buffed and checked'],
  },
]);

export const bySlug = (slug?: string) => services.find((x) => x.slug === slug);
export const categoryOf = (id: CategoryId) => categories.find((c) => c.id === id)!;
export const media = (slug: string) => ({
  hd: `/videos/1080/${slug}.mp4`,
  sd: `/videos/720/${slug}.mp4`,
  poster: `/posters/${slug}.jpg`,
});
export const BRAND_INTRO = 'ars-brand-intro';
