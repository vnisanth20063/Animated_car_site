// Central site configuration. Fill in real ARS details here - nothing is invented.
export const site = {
  name: 'ARS Automotive Care',
  tagline: 'Experience the art of automotive detailing.',
  supporting: 'More than a wash. An experience of perfection.',
  currency: '₹', // change if ARS prices in another currency
  // Leave a value undefined until ARS supplies the real detail.
  contact: {
    phone: undefined as string | undefined,
    whatsapp: undefined as string | undefined,
    email: undefined as string | undefined,
    address: undefined as string | undefined,
    hours: undefined as string | undefined,
  },
  // Optional assets. Set a path (inside /public) once the file exists.
  assets: {
    finalReveal: undefined as string | undefined, // e.g. '/videos/final-reveal.mp4'
    finalRevealPoster: undefined as string | undefined,
  },
};
export const vehicleBrands = [
  'Audi', 'BMW', 'Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Jeep', 'Kia', 'Mahindra', 'Maruti Suzuki',
  'Mercedes-Benz', 'MG', 'Nissan', 'Renault', 'Skoda', 'Tata', 'Toyota', 'Volkswagen', 'Volvo', 'Other',
];
