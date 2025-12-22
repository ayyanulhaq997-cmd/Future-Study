
import { Product, VoucherCode, User, University, Course, CountryGuide, LMSCourse, LMSModule, LMSPracticeTest, Enrollment, CourseVoucher, Qualification, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Admin', email: 'admin@nexus.ai', role: 'Admin' },
  { id: 'u-trainer', name: 'Lead IELTS Trainer', email: 'trainer@nexus.ai', role: 'Trainer' },
  { id: 'u-finance', name: 'Chief Financial Officer', email: 'finance@nexus.ai', role: 'Finance' },
  { id: 'u-agent', name: 'Global Training Center', email: 'partner@edu.com', role: 'Agent', tier: 2 },
  { id: 'u-student', name: 'Alex Smith', email: 'alex@gmail.com', role: 'Customer' },
];

export const products: Product[] = [
  {
    id: 'p-pte',
    name: 'PTE Academic',
    category: 'PTE',
    type: 'Voucher',
    basePrice: 180,
    currency: 'USD',
    description: 'Pearson Test of English voucher. Valid for global test booking.',
    icon: '📊',
    supportsFullRegistration: true,
    priceTiers: [{ minQuantity: 5, discountPercentage: 5 }]
  },
  {
    id: 'p-ielts',
    name: 'IELTS Academic',
    category: 'IELTS',
    type: 'Voucher',
    basePrice: 220,
    currency: 'USD',
    description: 'International English Language Testing System voucher.',
    icon: '🌐',
    supportsFullRegistration: true,
    priceTiers: [{ minQuantity: 3, discountPercentage: 3 }]
  }
];

export const qualifications: Qualification[] = [
  {
    id: 'q-othm-3',
    title: 'OTHM Level 3 Diploma in Business Studies',
    duration: '6 Months',
    qualificationBody: 'OTHM',
    tuitionFees: '$1,200',
    requirements: ['High School Certificate', 'English Proficiency (IELTS 5.0 equivalent)'],
    description: 'Understand the operations and structure of businesses.',
    level: 'Level 3',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop'
  }
];

export const voucherCodes: VoucherCode[] = [];

export const universities: University[] = [
  {
    id: 'uni-manchester',
    name: 'University of Manchester',
    slug: 'manchester',
    location: 'Manchester, UK',
    ranking: 32,
    description: 'A world-class research institution located in the heart of Manchester.',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200&h=200&fit=crop',
    countryId: 'uk',
    website: 'https://www.manchester.ac.uk'
  }
];

export const courses: Course[] = [
  {
    id: 'c-cs-man',
    universityId: 'uni-manchester',
    title: 'MSc Computer Science',
    degree: 'Postgraduate',
    duration: '1 Year',
    tuitionFee: '£28,000',
    description: 'Advanced computing course focusing on AI and software engineering.'
  }
];

export const immigrationGuides: ImmigrationGuideData[] = [
  {
    id: 'skilled', countryId: 'skilled', slug: 'skilled-immigration', title: 'Skilled Immigration',
    content: 'In today’s global economy, skilled professionals are increasingly in demand. Countries worldwide actively seek talented individuals to fill labour shortages, drive innovation, and strengthen their economies. By 2026, many countries will face significant labour shortages, especially in healthcare, IT, engineering, construction, teaching, and renewable energy.',
    heroImage: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?w=1200&auto=format&fit=crop',
    pathways: [
      { id: 'uk-sw', title: 'United Kingdom - Skilled Worker', description: 'Points-based route for professionals with a job offer from a licensed sponsor.', requirements: ['CoS from Employer', 'IELTS/PTE Proficiency', '£1,270 Maintenance'] },
      { id: 'ca-ee', title: 'Canada - Express Entry', description: 'Federal pathway for skilled immigrants based on CRS scores (Age, Education, Experience).', requirements: ['ECA Report', 'IELTS/CELPIP CLB 7+', 'Proof of Funds'] },
      { id: 'au-si', title: 'Australia - Skilled Independent', description: 'Points-tested visa for skilled workers not sponsored by an employer or family member.', requirements: ['Skills Assessment', 'EOI Submission', 'Minimum 65 Points'] }
    ]
  },
  {
    id: 'business', countryId: 'business', slug: 'business-immigration', title: 'Business Immigration',
    content: 'Business immigration refers to programs designed for individuals who wish to establish, invest in, manage, or expand businesses in another country. By 2026, many countries are expected to rely heavily on foreign entrepreneurs to stimulate economic growth and job creation.',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop',
    pathways: [
      { id: 'uk-if', title: 'UK Innovator Founder', description: 'For entrepreneurs with an innovative, viable, and scalable business idea endorsed by an approved body.', requirements: ['Endorsement Letter', 'Innovative Business Plan', 'Sufficient Funds'] },
      { id: 'ca-suv', title: 'Canada Start-Up Visa', description: 'Support for innovative founders backed by designated Canadian investors or incubators.', requirements: ['Support Letter', 'Language Proficiency', 'Settlement Funds'] }
    ]
  },
  {
    id: 'nomads', countryId: 'nomads', slug: 'nomads', title: 'Nomad & Remote Work Visas',
    content: 'Live Globally. Work Remotely. Nomad Visas allow you to live in a foreign country while working for overseas clients or employers. By 2026, global work trends are expected to further normalise remote employment.',
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop',
    pathways: [
      { id: 'pt-nomad', title: 'Portugal Digital Nomad', description: 'Residency for remote workers with a minimum monthly income of approx. EUR 3,280.', requirements: ['Foreign Income Proof', 'Health Insurance', 'Clean Record'] },
      { id: 'es-nomad', title: 'Spain Digital Nomad', description: 'Permit for freelancers and remote employees with university degrees or professional experience.', requirements: ['EUR 2,520+ Monthly Income', 'Schengen Coverage', 'Remote Contract'] }
    ]
  }
];

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in UK 2025/2026', 
    content: `Are you dreaming of walking through the historic campuses of Oxford, London, Manchester, Birmingham, Glasgow, Cardiff, Belfast? The United Kingdom remains one of the world's premier destinations for higher education, offering a blend of tradition, innovation, and global career opportunities.

The UK’s reputation for academic excellence is unmatched. With a degree from a UK institution, you aren't just getting an education; you are gaining a globally recognized credential. Shorter course durations save you both time and tuition costs: most Bachelor’s degrees take only three years, and Master’s degrees are typically completed in just one year.

Important 2025/2026 Student Visa Rules:
1. Increased Financial Maintenance: As of November 11, 2025, the Home Office has increased the amount of money you must show. London: £1,529/mo. Outside London: £1,171/mo.
2. English Language Requirements: For below degree-level courses, a SELT (IELTS for UKVI, PTE Academic UKVI) is mandatory. For degree-level programs, HEIs may accept online tests like Oxford ELLT, LanguageCert ESOL Online, or Duolingo.
3. Transition to eVisas: The UK has fully transitioned to eVisas. You will now access your immigration status online through a secure UKVI account.

Post-Study Work: The Graduate Route allows you to stay and work for 2 years after a Bachelor’s or Master’s, or 3 years after a PhD. Note: For applications on or after January 1, 2027, the period will be reduced to 18 months for non-PhD graduates.`, 
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,171 - £1,529/mo', 
    visaRequirements: 'Student Visa (eVisas Active)' 
  },
  { 
    id: 'australia', 
    countryId: 'au', 
    slug: 'australia', 
    title: 'Study in Australia 2026', 
    content: `Australia is undergoing its biggest immigration transformation in a decade. In 2026, the focus is on employability. Australian universities have integrated industry placements into almost every degree, ensuring you don't just graduate with a certificate, but with a professional network.

The most significant change for 2026 is the National Planning Level (NPL), which sets a cap on the number of new international student commencements. Competition is fierce; you should aim to submit at least 8 to 10 months in advance.

Genuine Student (GS) Requirement: This is the heartbeat of your visa application. You must clearly articulate Course Value, Incentives to Return, and Circumstances.

Financial Capacity: Students must demonstrate proof of approximately AUD $30,000+ for living expenses in addition to tuition fees.

English Standards: Student Visa (Subclass 500) requires a minimum IELTS 6.0. Post-Study Work requires 6.5.

High-demand sectors for 2026: Healthcare & Nursing, Early Childhood Education, Green Energy Engineering, and Cybersecurity & AI.`, 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: 'AUD $30,000/year', 
    visaRequirements: 'Subclass 500 (GS Focused)' 
  },
  { 
    id: 'canada', 
    countryId: 'ca', 
    slug: 'canada', 
    title: 'Study in Canada 2026', 
    content: `Canada remains a top-tier destination focusing on high-value education. For 2026, the National Study Permit Cap continues. Most students now require a Provincial Attestation Letter (PAL) from their province of study.

Financial Requirements: The IRCC has significantly increased the "Cost of Living" proof. For 2026, a single applicant must show at least CAD $20,635 plus tuition.

PGWP Changes: The rules for staying after graduation are now aligned with labor market demands. College graduates' fields of study must be linked to "long-term shortage" occupations. University graduates currently remain exempt from these field-of-study restrictions.

Top Courses: Healthcare & Nursing, Skilled Trades (Construction/Electrical), STEM, and Agri-Tech.

UniCou Ltd specializes in financial auditing and GIC preparation to ensure your application meets the strict SDS and Non-SDS standards.`, 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: 'CAD $20,635/year', 
    visaRequirements: 'Study Permit & PAL' 
  },
  { 
    id: 'nz', 
    countryId: 'nz', 
    slug: 'new-zealand', 
    title: 'Study in New Zealand 2026', 
    content: `New Zealand offers a world-class education system where every single university is ranked in the top 3% globally. In 2026, the focus is on sustainable careers and global citizenship.

Financial Maintenance: For 2026, you must demonstrate at least NZD $20,000 per year for living costs.

The Green List: This is your fast-track to residency. Roles in Construction, Engineering, Healthcare, ICT, and Secondary Teaching are highly prioritized for Tier 1 residency pathways.

Post-Study Work Rights: Bachelor's, Master's, and PhD graduates are generally eligible for a 3-year PSWV. Below-degree graduates are only eligible if the qualification is on the Green List.

Most international students can work 20 hours/week during semester and full-time during holidays.`, 
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200', 
    costOfLiving: 'NZD $20,000/year', 
    visaRequirements: 'Fee Paying Student Visa' 
  },
  { 
    id: 'usa', 
    countryId: 'us', 
    slug: 'usa', 
    title: 'Study in USA 2026', 
    content: `The USA remains the undisputed "Land of Opportunity," hosting more international students than any other country. In 2026, digital I-20s and SEVIS updates have streamlined the process.

STEM OPT Advantage: Standard OPT gives 12 months work rights, but STEM-designated degrees offer an additional 24-month extension (3 years total). This is a massive boost for careers at tech giants like Google or Tesla.

The 2+2 Pathway: A popular trend for 2026 where students spend two years at a Community College (saving 50% on tuition) and transfer to a top university for the final two years.

Financial Requirement: You must demonstrate liquid funds to cover one full year of tuition and living expenses as per the university's I-20.

High-Growth Fields: AI & Machine Learning, Data Science, Healthcare Admin, and Cybersecurity.`, 
    heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', 
    costOfLiving: '$18,000 - $30,000/year', 
    visaRequirements: 'F-1 Visa (Digital I-20)' 
  },
  { 
    id: 'ireland', 
    countryId: 'ie', 
    slug: 'ireland', 
    title: 'Study in Ireland 2026', 
    content: `Ireland is the only English-speaking country in the Eurozone, serving as a high-tech modern economy hub. Dublin is the European HQ for giants like Google, Meta, and Pfizer.

Stamp 1G Graduate Visa: Master’s & PhD grads get a 2-year stay-back visa. Bachelor’s grads get 1 year. This is the fastest route to a Critical Skills Employment Permit.

2026 Financial Capacity: Students must demonstrate access to at least €12,000 per year for living expenses.

Mandatory Health Insurance: INIS requires private medical insurance covering at least €25,000 for in-hospital treatment.

High-Demand Sectors: Data Science, Pharmaceutical Sciences, FinTech, and Sustainable Energy. Ireland is the world's 3rd largest exporter of pharmaceuticals.`, 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200', 
    costOfLiving: '€12,000/year', 
    visaRequirements: 'Stamp 2 Student Visa' 
  },
  { 
    id: 'cyprus', 
    countryId: 'cy', 
    slug: 'cyprus', 
    title: 'Study in Cyprus 2026', 
    content: `Cyprus is a sun-soaked Mediterranean hub offering European degrees at lower costs. Degrees are recognized across the entire EU.

2026 Visa Rules: Academic documents can now be verified digitally. You'll need to apply for the "Pink Slip" (Temporary Residence Permit) upon arrival. Financial proof of €7,000 to €8,000 is required.

Work Rights: You are generally allowed to work 20 hours/week during the semester. Dubai is a massive tourism hub; summer breaks offer full-time opportunities in 5-star resorts.

Erasmus+ Access: As an EU destination, you can spend a semester studying in Italy or Germany while paying Cyprus tuition.

High-Demand Sectors: Hospitality & Tourism, Maritime & Shipping (Limassol hub), Computer Science, and Medicine.`, 
    heroImage: 'https://images.unsplash.com/photo-1589146522366-06103e33917d?w=1200', 
    costOfLiving: '€600 - €900/mo', 
    visaRequirements: 'EU Pink Slip Entry' 
  },
  { 
    id: 'germany', 
    countryId: 'de', 
    slug: 'germany', 
    title: 'Study in Germany 2026', 
    content: `Germany is the engine of Europe and the land of precision engineering. It offers world-class education with low or no tuition fees.

Public vs. Private: Public universities are often tuition-free but highly competitive and require German language skills for most undergrad programs. Private universities are more flexible with English-taught courses.

Blocked Account (Sperrkonto): For 2026, you must deposit roughly €11,904 to €12,200 for your first year.

Post-Study Work: Once you finish your degree, you can apply for an 18-month job seeker visa. Finding a professional role allows you to switch to an EU Blue Card.

In-Demand Jobs: Engineering (Mechanical/Electrical), IT, Cybersecurity, and Renewable Energy.`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€12,000/year', 
    visaRequirements: 'Sperrkonto & APS' 
  },
  { 
    id: 'italy', 
    countryId: 'it', 
    slug: 'italy', 
    title: 'Study in Italy 2026', 
    content: `Italy offers some of the oldest and most prestigious universities in the world. For 2026, it is becoming a top choice for its "Income-Based" tuition system.

ISEE System: Public university fees are adjusted based on your family's financial background, ranging from €500 to €3,000 per year.

DSU Scholarships: Italy offers generous regional scholarships based on financial need, which can cover 100% of tuition and provide a yearly stipend of €5,000+.

Universitaly Portal: All pre-enrollment must be completed through this centralized gateway.

Stay-back: You can apply for a 12-month permit for job seeking after your degree. Italy is seeking talent in Automotive Engineering, Fashion Design, and AI.`, 
    heroImage: 'https://images.unsplash.com/photo-1529260839382-3eff517bac74?w=1200', 
    costOfLiving: '€6,000 - €8,000/year', 
    visaRequirements: 'D-Type Visa (Universitaly)' 
  },
  { 
    id: 'sweden', 
    countryId: 'se', 
    slug: 'sweden', 
    title: 'Study in Sweden 2026', 
    content: `Sweden is a global powerhouse of innovation (Spotify, IKEA, Ericsson). In 2026, the focus is on sustainable innovation and collaborative learning.

Financial Requirement: You must show roughly SEK 10,500 to 11,000 per month. The Migration Agency is very strict about "clean" money history.

One-Portal System: Apply for up to four programs nationwide at UniversityAdmissions.se with one set of documents. Deadlines are early (Mid-January 2026).

Post-Study: You can stay for 12 months after graduation to look for a job or start a business.

Work Rights: There is no official hour limit as long as you make academic progress. Most students work 10-15 hours/week to cover their "Fika" and rent.`, 
    heroImage: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1200', 
    costOfLiving: 'SEK 11,000/mo', 
    visaRequirements: 'Residence Permit (SEK Proof)' 
  },
  { 
    id: 'finland', 
    countryId: 'fi', 
    slug: 'finland', 
    title: 'Study in Finland 2026', 
    content: `Finland is the world's happiest country and home to the best education system globally. For 2026, Migri has simplified the "Long-term Residence Permit" which covers your whole degree duration.

Financial Requirement: Show roughly €800 to €900 per month for living costs.

Work Freedom: International students can work an average of 30 hours per week during the semester—one of the highest limits in Europe.

2-Year Post-Study Visa: Finland wants you to stay! Graduates get a 2-year permit to find professional work.

High-Demand Sectors: ICT & Software Engineering, Nursing & Social Care, and Clean Energy. Finnish universities are surprisingly informal and focus on solving real-world problems.`, 
    heroImage: 'https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=1200', 
    costOfLiving: '€850/mo', 
    visaRequirements: 'Whole-Degree Permit' 
  },
  { 
    id: 'dubai', 
    countryId: 'ae', 
    slug: 'dubai', 
    title: 'Study in Dubai 2026', 
    content: `Dubai is the city of the future and a global Knowledge Economy. In 2026, international branch campuses from the UK and Australia (like Heriot-Watt and Murdoch) allow you to earn a Western degree tax-free.

Golden Visa: Outstanding students with a high GPA (3.75+) can qualify for a 10-year residency permit.

Work Rights: Students can take part-time jobs and internships with an NOC from the university. There is NO personal income tax—what you earn, you keep.

Visa Speed: Most universities sponsor your visa, handling the paperwork with the DDA or GDRFA in just a few weeks.

Vision 2030 Sectors: Fintech, Logistics, Real Estate, and Artificial Intelligence.`, 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5eaad0ff3b0d?w=1200', 
    costOfLiving: 'AED 3,000 - 4,500/mo', 
    visaRequirements: 'Institutional Sponsorship' 
  },
  { 
    id: 'malaysia', 
    countryId: 'my', 
    slug: 'malaysia', 
    title: 'Study in Malaysia 2026', 
    content: `Malaysia is a top-10 global hub offering high-quality education at a fraction of the cost. Branch campuses of Nottingham (UK) and Monash (AU) provide identical degrees at 70% lower prices.

EMGS Digital Visa: The "e-VAL" system is nearly 100% digital for 2026. You'll need a valid offer and proof of USD $4,000 to $5,000 for living expenses.

Work Rights: You can work part-time for up to 20 hours/week during semester breaks. However, the real draw is the high-paying internships in Cyberjaya (Malaysia's Silicon Valley).

Strict Compliance: To renew your pass, you must maintain 80% attendance and a CGPA of 2.0.

KL Lifestyle: Luxury student condos with pools often cost just $200/mo. Malaysia is a multicultural food paradise where English is widely spoken.`, 
    heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a594?w=1200', 
    costOfLiving: 'USD $400/mo', 
    visaRequirements: 'Student Pass (EMGS e-VAL)' 
  },
  { 
    id: 'turkey', 
    countryId: 'tr', 
    slug: 'turkey', 
    title: 'Study in Turkey 2026', 
    content: `Turkey is a bridge between history and the future. As a Bologna Process member, Turkish degrees are recognized across all of Europe.

Residence Permit (Ikamet): Turkey has digitized the residency process for 2026. You'll need roughly $5,000 to $7,000 available for your first year.

Turkiye Scholarships (Bursları): One of the world's most generous programs, covering 100% tuition, monthly stipends, and accommodation.

High-Growth Sectors: Architecture & Civil Engineering, Medicine, E-commerce (Trendyol/Getir), and Diplomacy.

Living Cost: Turkey remains incredibly affordable. Healthy meals are just $3-$5, and student travel cards offer massive discounts on domestic flights and metros.`, 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: 'USD $350/mo', 
    visaRequirements: 'Ikamet Residence Permit' 
  },
  { 
    id: 'europe', 
    countryId: 'eu', 
    slug: 'europe', 
    title: 'Study in Europe 2026 (Hidden Gems)', 
    content: `Beyond the "Big Five," Europe offers incredible value in its hidden gems like Poland, Hungary, Spain, and France.

Poland & Hungary: Massive medical hubs offering English-taught programs at 40% lower costs than the West. Stipendium Hungaricum is a major scholarship to watch.

Spain: A netowrk of top-tier private business schools and a rising tech scene. Stay-back permits of 12 months are available for job seekers.

France: Beyond Paris, cities like Lyon and Toulouse are powerhouses for specialized "Grande Écoles" in Engineering.

Digital Visa Shift: The Schengen Student Visa process is becoming digital, allowing you to upload documents online through streamlined portals.`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€500 - €1,100/mo', 
    visaRequirements: 'Schengen Student Visa' 
  }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'pte-mastery', title: 'PTE Academic Mastery', description: 'Complete prep for Pearson Test of English.', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', category: 'PTE', duration: '20 Hours', instructor: 'Dr. Jane Smith', price: 99, status: 'Paid' },
  { id: 'ielts-bootcamp', title: 'IELTS Band 8 Bootcamp', description: 'Intensive prep for Higher Band IELTS scores.', thumbnail: 'https://images.unsplash.com/photo-1544391496-1ca7c97457cd?w=800', category: 'IELTS', duration: '35 Hours', instructor: 'Prof. Mark Wood', price: 149, status: 'Paid' }
];
export const lmsModules: LMSModule[] = [];
export const lmsTests: LMSPracticeTest[] = [];
export const initialEnrollments: Enrollment[] = [];
export const courseVouchers: CourseVoucher[] = [];
export const universityBySlug = (slug: string): University | null => {
  return universities.find(u => u.slug === slug) || null;
};
