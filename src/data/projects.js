// Projects, in display order (first = first on the home page and /projects).
// Copy fields are { en, sq } — read them through `pick(value, locale)`.
// `cta` picks the button label: 'open' → projects.ctaOpen, 'play' → projects.playNow.
export const projects = [
  {
    id: 2,
    slug: 'tools',
    name: 'Skriptura Tools',
    tagline: {
      en: 'Free image, PDF, developer and business tools in the browser.',
      sq: 'Vegla falas për imazhe, PDF, zhvillues dhe biznes, në shfletues.',
    },
    description: {
      en: 'tools.skriptura.net — 18 free web tools in English and Albanian. Convert, compress and resize images; merge, split and convert PDFs; format JSON, generate hashes, UUIDs and passwords; build QR codes and meta tags; calculate TVSH. Developer tools run entirely in your browser; image and PDF files are processed on our server and deleted as soon as the result is sent. No account, no storage.',
      sq: 'tools.skriptura.net — 18 vegla web falas, në shqip dhe anglisht. Konverto, kompreso dhe ridimensiono imazhe; bashko, ndaj dhe konverto PDF; formato JSON, gjenero hash, UUID dhe fjalëkalime; krijo kode QR dhe meta tags; llogarit TVSH-në. Veglat për zhvillues punojnë krejt në shfletuesin tënd; imazhet dhe PDF-të përpunohen në serverin tonë dhe fshihen sapo dërgohet rezultati. Pa llogari, pa ruajtje.',
    },
    url: 'https://tools.skriptura.net',
    status: 'live',
    cta: 'open',
    tools: {
      en: [
        'Image converter',
        'Image compressor',
        'Image resizer',
        'EXIF remover & viewer',
        'Merge PDF',
        'Split PDF & extract pages',
        'Images to PDF',
        'PDF to images',
        'JSON formatter & validator',
        'Base64 encode / decode',
        'URL encode / decode',
        'Hash generator',
        'UUID & ULID generator',
        'Password generator',
        'Protobuf decoder & encoder',
        'QR code generator',
        'Meta tag & Open Graph generator',
        'TVSH calculator',
      ],
      sq: [
        'Konvertues imazhesh',
        'Kompresues imazhesh',
        'Ridimensionues imazhesh',
        'Heqës & shikues EXIF',
        'Bashko PDF',
        'Ndaj PDF & nxirr faqe',
        'Imazhe në PDF',
        'PDF në imazhe',
        'Formatues & validues JSON',
        'Base64 kodo / dekodo',
        'URL kodo / dekodo',
        'Gjenerues hash',
        'Gjenerues UUID & ULID',
        'Gjenerues fjalëkalimesh',
        'Dekodues & kodues Protobuf',
        'Gjenerues kodi QR',
        'Gjenerues meta tags & Open Graph',
        'Kalkulator TVSH',
      ],
    },
    tags: ['Tools', 'Image', 'PDF', 'Developer Tools', 'React', 'NestJS'],
    type: 'community',
  },
  {
    id: 1,
    slug: 'spyfall',
    name: 'Spyfall',
    tagline: {
      en: 'The social deduction party game.',
      sq: 'Loja shoqërore e zbulimit të spiunit.',
    },
    description: {
      en: 'Spyfall is a multiplayer social deduction game where players receive location cards — except the spy, who must figure out the location before being caught. Players ask each other questions to find the spy, while the spy tries to blend in without knowing where they are.',
      sq: 'Spyfall është lojë multiplayer ku secili lojtar merr një kartë me vendndodhjen — përveç spiunit, i cili duhet ta gjejë vendndodhjen para se ta zbulojnë. Lojtarët i bëjnë pyetje njëri-tjetrit për ta gjetur spiunin, ndërsa spiuni mundohet të përshtatet pa e ditur ku ndodhet.',
    },
    url: 'https://spyfall.rgnpcrz.com',
    status: 'live',
    cta: 'play',
    tags: ['Game', 'Multiplayer', 'React', 'Real-time'],
    type: 'fun',
  },
]

/** A `{ en, sq }` copy field in the given locale (plain strings pass through). */
export function pick(value, locale) {
  if (value == null || typeof value === 'string' || Array.isArray(value)) return value
  return value[locale] ?? value.en
}
