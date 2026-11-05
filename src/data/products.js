// Products: systems Skriptura builds and maintains, available to any client.
// Shown on /projects (// PRODUCTS, above the fun projects) and on the home page.
// Copy fields are { en, sq } — read them through `pick(value, locale)` from ./projects.
// `clients` are slugs from ./clients.js — only list a client that actually runs the system.
export const products = [
  {
    slug: 'clinic-management',
    name: {
      en: 'Clinic management system',
      sq: 'Sistem për menaxhimin e klinikës',
    },
    tagline: {
      en: 'Patients, appointments, medical records and billing in one system.',
      sq: 'Pacientët, terminet, kartelat mjekësore dhe faturimi në një sistem.',
    },
    features: {
      en: ['Patient intake', 'Appointment scheduling', 'Medical records', 'Billing'],
      sq: ['Regjistrimi i pacientëve', 'Caktimi i termineve', 'Kartelat mjekësore', 'Faturimi'],
    },
    clients: ['ultra-medical'],
  },
  {
    slug: 'pos',
    name: {
      en: 'POS system',
      sq: 'Sistem POS',
    },
    tagline: {
      en: 'Point of sale for in-store sales, connected to the online shop.',
      sq: 'Pikë shitjeje për shitjet në dyqan, e lidhur me dyqanin online.',
    },
    features: {
      en: ['In-store sales', 'Online shop integration'],
      sq: ['Shitje në dyqan', 'Integrim me dyqanin online'],
    },
    clients: ['furra-lumi'],
  },
  {
    slug: 'sef',
    name: {
      en: 'SEF — electronic fiscalization system',
      sq: 'SEF — sistem elektronik i fiskalizimit',
    },
    tagline: {
      en: 'Fiscal coupons issued to the Kosovo Tax Administration (ATK) rules.',
      sq: 'Kupona fiskalë të lëshuar sipas rregullave të ATK-së.',
    },
    features: {
      en: ['Sales coupons', 'Returns', 'Cancellations', 'Offline mode', 'Copies & reprints'],
      sq: ['Kupona shitjeje', 'Kthime', 'Anulime', 'Punë offline', 'Kopje & ribotime'],
    },
    clients: [],
  },
  {
    slug: 'hotel-management',
    name: {
      en: 'Hotel management system',
      sq: 'Sistem për menaxhimin e hotelit',
    },
    tagline: {
      en: 'Reservations, rooms, billing and guest services, with online booking.',
      sq: 'Rezervimet, dhomat, faturimi dhe shërbimet për mysafirët, me rezervim online.',
    },
    features: {
      en: ['Reservations', 'Room management', 'Billing', 'Extra services', 'Online booking'],
      sq: ['Rezervime', 'Menaxhimi i dhomave', 'Faturimi', 'Shërbime shtesë', 'Rezervim online'],
    },
    clients: ['starhill-spa', 'hotel-starhill'],
  },
  {
    slug: 'car-rental',
    name: {
      en: 'Car rental system',
      sq: 'Sistem për rent-a-car',
    },
    tagline: {
      en: 'Fleet, availability, pricing and bookings managed in one system.',
      sq: 'Flota, disponueshmëria, çmimet dhe rezervimet në një sistem.',
    },
    features: {
      en: ['Fleet listings', 'Availability', 'Pricing', 'Bookings'],
      sq: ['Lista e flotës', 'Disponueshmëria', 'Çmimet', 'Rezervimet'],
    },
    clients: ['king-rent-auto'],
  },
]
