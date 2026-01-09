
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult, LMSModule } from '../types';

export const users: User[] = [
  { id: 'u-owner', name: 'Business Owner', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-ops', name: 'General Manager', email: 'ops@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-finance', name: 'Finance Lead', email: 'finance@unicou.uk', role: 'Finance Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-trainer', name: 'Academic Head', email: 'trainer@unicou.uk', role: 'Teacher', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-std', name: 'Alex Student', email: 'student@test.com', role: 'Student', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
];

export const products: Product[] = [
  { id: 'v-pte-aca', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard PTE Academic.', icon: '', openingStock: 2000 },
  { id: 'v-ielts-aca', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Country-Wise', description: 'IELTS Academic.', icon: '', openingStock: 150 },
  { id: 'v-toefl-ibt', name: 'TOEFL iBT Voucher', category: 'TOEFL', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Global', description: 'TOEFL iBT Official Code.', icon: '', openingStock: 19 },
];

// Mock codes to reach the 2169 count seen in the PDF screenshots
export const voucherCodes: VoucherCode[] = Array.from({ length: 2169 }).map((_, i) => ({
  id: `vc-${i}`,
  productId: i < 2000 ? 'v-pte-aca' : (i < 2150 ? 'v-ielts-aca' : 'v-toefl-ibt'),
  code: `UC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  status: 'Available',
  expiryDate: '2026-12-31',
  uploadDate: '2025-01-01'
}));

export const countryGuides: CountryGuide[] = [
  { id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in United Kingdom', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£10,539 (Outer London) - £13,761 (Inner London)', 
    visaRequirements: '£10,000 – £18,000 / Annual', 
    content: '### Why Study in the UK in 2025?\nThe UK’s reputation for academic excellence is unmatched. Shorter Course Durations: Unlike many other countries, most UK Bachelor’s degrees take only three years, and Master’s degrees are typically completed in just one year. This saves you both time and tuition costs.\n\n### The Latest 2025 Student Visa Rules\nAs of November 11, 2025, the Home Office has increased maintenance requirements. Studying in London: £1,529 per month. Outside London: £1,171 per month.\n\n### Transition to eVisas\nSay goodbye to the physical BRP. The UK has fully transitioned to eVisas for 2025. Access and prove your status via a secure UKVI account.' 
  },
  { id: 'australia', countryId: 'au', slug: 'australia', title: 'Study in Australia', heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200', 
    costOfLiving: 'AUD 21,000 / Annual', 
    visaRequirements: 'AUD 20,000 – 40,000 / Annual', 
    content: '### Why Choose Australia?\nDespite policy shifts, Australia remains a powerhouse. Enrollment Caps (NPL): The government now sets a cap on new international student commencements across the country.\n\n### Mastering the Genuine Student (GS) Requirement\nGone are the days of the GTE essay. The GS requirement is the heartbeat of your visa application. You must articulate course value, incentives to return, and explain study gaps.\n\n### Financial Capacity Requirements\nLate 2025 heading into 2026 requires proof of AUD $30,000+ for living expenses.' 
  },
  { id: 'canada', countryId: 'ca', slug: 'canada', title: 'Study in Canada', heroImage: 'https://images.unsplash.com/photo-1517935703635-27c736827375?w=1200', 
    costOfLiving: 'CAD 12,000 – 15,000 / Annual', 
    visaRequirements: 'CAD 11,000 – 35,000 / Annual', 
    content: '### Why Choose Canada?\nAcademic Prestige: Canadian degrees are held in high regard globally, particularly in STEM and Healthcare. Quality of Life: Canada consistently ranks in the top 10 globally for safety.\n\n### Study Permit Caps and PAL System\nMost students now require a Provincial Attestation Letter (PAL). Speed is your best friend as each province has a specific quota.\n\n### Post-Graduation Work Permit (PGWP) Changes\nRules for staying after graduation align with labor market demands. University graduates remain exempt from specific field-of-study restrictions.' 
  },
  { id: 'usa', countryId: 'us', slug: 'usa', title: 'Study in USA', heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', 
    costOfLiving: 'USD 12,000 – 18,000 / Annual', 
    visaRequirements: 'USD 11,000 – 40,000 / Annual', 
    content: '### Why Choose the USA?\nThe U.S. system is famous for its Liberal Arts philosophy. Diversity and Networking: Study alongside the brightest minds from every corner of the globe.\n\n### The F-1 Student Visa\nTransition to digital I-20s. Most universities now issue these instantly. You must demonstrate "liquid funds" for one full year of attendance.\n\n### STEM OPT: The 3-Year Advantage\nGraduates in STEM fields are eligible for an additional 24-month extension, giving a total of 3 years of work rights.' 
  },
  { id: 'new-zealand', countryId: 'nz', slug: 'new-zealand', title: 'Study in New Zealand', heroImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200', 
    costOfLiving: 'NZD 15,000 / Annual', 
    visaRequirements: 'NZD 16,000 – 35,000 / Annual', 
    content: '### Kia Ora, Future Adventurers!\nNew Zealand is known for its "think new" approach to learning. Every single university is ranked in the top 3% globally.\n\n### The Green List\nYour pathway to residency. Hard-to-Fill roles provide a fast-track to residency if your course leads to a Green List occupation.\n\n### Work Rights\nInternational students are permitted to work up to 20 hours per week during semesters and full-time during holidays.' 
  },
  { id: 'ireland', countryId: 'ie', slug: 'ireland', title: 'Study in Ireland', heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200', 
    costOfLiving: '€7,000 / Annual', 
    visaRequirements: '€8,000 – 22,000 / Annual', 
    content: '### Why Choose Ireland?\nKnown as the "Emerald Isle," Ireland is a premier global education hub and the only English-speaking country in the Eurozone. Tech Capital: Dublin is the HQ for over 1,000 multinational companies.\n\n### 1G Graduate Visa\nMaster’s & PhD graduates are eligible for a 2-year stay-back visa. Fastest route to permanent residency via Critical Skills permits.' 
  },
  { id: 'germany', countryId: 'de', slug: 'germany', title: 'Study in Germany', heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€11,208 / Annual (Blocked Account)', 
    visaRequirements: '€0 – 5,000 / Annual', 
    content: '### The "Engine" of Europe\nGet a world-class education without graduating with a mountain of debt. Public Universities are mostly tuition-free.\n\n### Blocked Account (Sperrkonto)\nMandatory deposit of roughly €11,904 to €12,200 for your first year. This ensures you can support yourself.\n\n### The 18-Month Post-Study Work Visa\nThe "Golden Ticket". After finishing your degree, apply for an 18-month job seeker visa.' 
  },
  { id: 'italy', countryId: 'it', slug: 'italy', title: 'Study in Italy', heroImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200', 
    costOfLiving: '€7,000 – 10,000 / Annual', 
    visaRequirements: '€2,000 – 6,000 / Annual', 
    content: '### The Income-Based Tuition Secret\nIn Italy, public universities operate on a system called ISEE. Tuition fees at top-tier unis range from €500 to €3,000 per year.\n\n### DSU Advantage\nScholarships are based on financial need. If you qualify, you could get zero tuition, free canteen meals, and a stipend of €5k-€7k.' 
  },
  { id: 'sweden', countryId: 'se', slug: 'sweden', title: 'Study in Sweden', heroImage: 'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?w=1200', 
    costOfLiving: 'SEK 96,000 - 120,000 / Annual', 
    visaRequirements: '€8,000 – 17,000 / Annual', 
    content: '### The "Lagom" Life\nSweden is a global powerhouse of innovation. Whether into Green Tech or Social Justice, Sweden offers collaborative learning.\n\n### Sustainable Innovation\nSwedish unis are doubling down on sustainability, making you incredibly employable in the climate crisis era.' 
  },
  { id: 'finland', countryId: 'fi', slug: 'finland', title: 'Study in Finland', heroImage: 'https://images.unsplash.com/photo-1528154032344-a6986460762c?w=1200', 
    costOfLiving: '€7,000 – 9,000 / Annual', 
    visaRequirements: '€6,000 – 15,000 / Annual', 
    content: '### The World’s Happiest Education System\nInnovation is part of the daily routine and student-life balance is a way of life. Call your professors by their first names.\n\n### Long-term Residence Permit\nA single permit now covers the entire duration of your Bachelor’s or Master’s studies.' 
  },
  { id: 'cyprus', countryId: 'cy', slug: 'cyprus', title: 'Study in Cyprus', heroImage: 'https://images.unsplash.com/photo-1505305976870-c0be1cd39939?w=1200', 
    costOfLiving: '€7,000 – 8,000 / Annual', 
    visaRequirements: '€4,800 – 9,800 / Annual', 
    content: '### The European Experience\nCyprus is a booming educational hub offering a unique "best of both worlds" scenario. Safe, sunny, and recognized across the EU.\n\n### Real Talk Costs\nLive comfortably on €600 to €900 a month. Rent alone in mainland Europe can be €1,200; Cyprus is a breath of fresh air.' 
  },
  { id: 'dubai', countryId: 'ae', slug: 'dubai', title: 'Study in Dubai', heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', 
    costOfLiving: 'AED 4,000 – 9,000 / Annual', 
    visaRequirements: 'AED 35,000 – 80,000 / Annual', 
    content: '### Your Launchpad to a Global Career\nDubai has officially become a "Knowledge Economy". Safe, ultra-modern environment with direct job market access.\n\n### Tax-Free Earnings\nThere is no personal income tax in Dubai. What you earn is what you keep. Gain "Dubai Experience" highly valued by local employers.' 
  },
  { id: 'malaysia', countryId: 'my', slug: 'malaysia', title: 'Study in Malaysia', heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a594?w=1200', 
    costOfLiving: 'RM 1,500 – 3,000 / Annual', 
    visaRequirements: 'USD 4,000 – 9,000 / Annual', 
    content: '### Twinning Programs\nEarn a UK or Australian degree at  Campuses like Monash or Nottingham in Malaysia. Exams and certificates are identical, but costs are 70% lower.\n\n### e-VAL System\nNearly 100% digital "e-VAL" visa approval letter system. One of the fastest countries to process international nodes.' 
  },
  { id: 'turkey', countryId: 'tr', slug: 'turkey', title: 'Study in Turkey', heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: 'USD 400 – 800 / Annual', 
    visaRequirements: 'USD 3,000 – 10,000 / Annual', 
    content: '### Where Continents Meet\nTurkey is a full member of the European Higher Education Area (Bologna Process). Degree recognition across all of Europe.\n\n### Ikamet (Residence Permit)\nTurkish Migration Management has digitized the process. Students can often complete residency interviews directly on campus.' 
  },
  { id: 'europe', countryId: 'eu', slug: 'europe', title: 'Study in Europe', heroImage: 'https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=1200', 
    costOfLiving: '€8,000 – 12,000 / Annual', 
    visaRequirements: '€6,000 – 18,000 / Annual', 
    content: '### Discover Hidden Gems\nPoland is the rising star of Central Europe. Engineering and CS degrees that rival the West at a fraction of the cost.\n\n### Schengen Mobility\nAccess the entire zone via 10,000+ English-taught programs. Erasmus+ Program allows you to study in one country and spend a semester in another.' 
  }
];

export const universities: University[] = [
  { id: 'u-oxford', name: 'University of Oxford', slug: 'oxford', location: 'Oxford, UK', description: 'Consistently ranked top globally.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=200', ranking: 1, countryId: 'uk', website: 'https://ox.ac.uk' },
  { id: 'u-manchester', name: 'University of Manchester', slug: 'uom', location: 'Manchester, UK', description: 'Preeminent Russell Group institution.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=200', ranking: 32, countryId: 'uk', website: 'https://manchester.ac.uk' },
  { id: 'u-anu', name: 'Australian National University', slug: 'anu', location: 'Canberra, AU', description: 'Leading global research university.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=200', ranking: 30, countryId: 'au', website: 'https://anu.edu.au' },
  { id: 'u-toronto', name: 'University of Toronto', slug: 'utoronto', location: 'Toronto, CA', description: 'Canada\'s global leader.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=200', ranking: 21, countryId: 'ca', website: 'https://utoronto.ca' },
  { id: 'u-nyu', name: 'New York University', slug: 'nyu', location: 'New York, USA', description: 'Premier private university in Manhattan.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=200', ranking: 38, countryId: 'us', website: 'https://nyu.edu' },
];

export const courses: Course[] = [
  { id: 'cs-msc-ai', universityId: 'u-manchester', title: 'MSc Artificial Intelligence', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£28,000', description: 'Advanced AI and Machine Learning nodes.' }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'c-pte-master', title: 'PTE 79+ Masterclass', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', description: 'Complete training for PTE Academic.', duration: '25 Hours', instructor: 'Prof. Michael Aris', price: 49 },
];

export const lmsModules: LMSModule[] = [
  { id: 'm-intro', title: 'Core Foundations', lessons: [{ id: 'l-01', title: 'Introduction', type: 'Video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] }
];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'full-mock-1', title: 'IELTS Academic Full Simulation',
    sections: [
      {
        id: 'ielts-reading-1', title: 'Reading Part 1: Marie Curie', skill: 'Reading', timeLimit: 20,
        passageText: `Marie Curie is probably the most famous woman scientist who has ever lived. Born Maria Sklodowska in Poland in 1867, she is famous for her work on radioactivity, and was twice a winner of the Nobel Prize. With her husband, Pierre Curie, and Henri Becquerel, she was awarded the 1903 Nobel Prize for Physics, and was then sole winner of the 1911 Nobel Prize for Chemistry. She was the first woman to win a Nobel Prize.`,
        questions: [
          { id: 'q1', skill: 'Reading', type: 'TFNG', text: 'Marie Curie’s husband was a joint winner of both Marie’s Nobel Prizes.' },
          { id: 'q2', skill: 'Reading', type: 'TFNG', text: 'Marie became interested in science when she was a child.' },
          { id: 'q3', skill: 'Reading', type: 'TFNG', text: 'Marie was able to attend the Sorbonne because of her sister’s financial contribution.' }
        ]
      },
      {
        id: 'ielts-reading-2', title: 'Reading Part 2: Physics of Traffic', skill: 'Reading', timeLimit: 20,
        passageText: `Some years ago, several theoretical physicists, principally Dirk Helbing and Boris Kerner... noted that traffic congestion can arise spontaneously. Under the right conditions, a local fluctuation in speed is all it takes to trigger a system-wide breakdown. This shows striking similarities to chaos theory.`,
        questions: [
          { id: 'q4', skill: 'Reading', type: 'Ordering', text: 'Restore order of history of trousers:', options: ['By 1817, trousers were shoe-length.', 'Jackets didn’t become fashionable for casual wear until the 1850s.', 'It was George "Beau" Brummell who started a trend for tight black trousers in the early 1800s.'] }
        ]
      }
    ]
  }
];

export const qualifications: Qualification[] = [
  { id: 'othm-l3', title: 'OTHM Level 3 Foundation', qualificationBody: 'OTHM', level: 'Level 3', tuitionFees: '£1,500', description: 'Pathway to UK Universities.', duration: '6 Months', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', requirements: ['English B2', 'High School'] }
];

export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
export const immigrationGuides: any[] = [];
