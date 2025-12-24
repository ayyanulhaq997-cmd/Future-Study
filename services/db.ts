import { Product, VoucherCode, User, University, Course, CountryGuide, LMSCourse, LMSModule, LMSPracticeTest, Enrollment, CourseVoucher, Qualification, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Admin', email: 'admin@unicou.uk', role: 'Admin' },
  { id: 'u-trainer', name: 'Lead IELTS Trainer', email: 'trainer@unicou.uk', role: 'Trainer' },
  { id: 'u-finance', name: 'Chief Financial Officer', email: 'finance@unicou.uk', role: 'Finance' },
  { id: 'u-agent', name: 'Global Training Center', email: 'partner@edu.com', role: 'Agent', tier: 2 },
  { id: 'u-student', name: 'Alex Smith', email: 'alex@gmail.com', role: 'Customer' },
];

export const products: Product[] = [
  { id: 'p-pte-std', name: 'PTE Academic', category: 'PTE', type: 'Voucher', basePrice: 180, currency: 'USD', description: 'Standard Pearson Test of English Academic voucher.', icon: '📊', supportsFullRegistration: true },
  { id: 'p-pte-ukvi', name: 'PTE Academic UKVI', category: 'PTE', type: 'Voucher', basePrice: 210, currency: 'USD', description: 'Pearson Test for UK Visas and Immigration (SELT).', icon: '🇬🇧', supportsFullRegistration: true },
  { id: 'p-pte-core', name: 'PTE Core', category: 'PTE', type: 'Voucher', basePrice: 185, currency: 'USD', description: 'New PTE Core for Canadian migration and general purposes.', icon: '🇨🇦', supportsFullRegistration: true },
  { id: 'p-ielts-std', name: 'IELTS Academic/General', category: 'IELTS', type: 'Voucher', basePrice: 220, currency: 'USD', description: 'Standard IELTS voucher for Academic or General Training.', icon: '🌐', supportsFullRegistration: true },
  { id: 'p-ielts-ukvi', name: 'IELTS for UKVI', category: 'IELTS', type: 'Voucher', basePrice: 255, currency: 'USD', description: 'Secure English Language Test (SELT) for UK immigration.', icon: '🛡️', supportsFullRegistration: true },
  { id: 'p-oet-nurse', name: 'OET (Nursing)', category: 'OET', type: 'Voucher', basePrice: 450, currency: 'USD', description: 'Occupational English Test for Healthcare Professionals.', icon: '🏥', supportsFullRegistration: true },
  { id: 'p-oet-med', name: 'OET (Medicine)', category: 'OET', type: 'Voucher', basePrice: 450, currency: 'USD', description: 'Occupational English Test for Doctors and Specialists.', icon: '🩺', supportsFullRegistration: true },
  { id: 'p-toefl-ibt', name: 'TOEFL iBT', category: 'TOEFL', type: 'Voucher', basePrice: 205, currency: 'USD', description: 'ETS TOEFL iBT voucher for standard and Home Edition.', icon: '🌎', supportsFullRegistration: true },
  { id: 'p-ellt-oxford', name: 'Oxford ELLT Digital', category: 'ELLT', type: 'Voucher', basePrice: 120, currency: 'USD', description: 'Oxford International English Language Level Test.', icon: '🏫', supportsFullRegistration: true },
  { id: 'p-det', name: 'Duolingo English Test', category: 'OTHER', type: 'Voucher', basePrice: 59, currency: 'USD', description: 'Rapid, affordable online English proficiency test.', icon: '🦉', supportsFullRegistration: true },
  { id: 'p-gre', name: 'GRE General Test', category: 'OTHER', type: 'Voucher', basePrice: 220, currency: 'USD', description: 'ETS GRE voucher for Graduate school admissions.', icon: '🎓', supportsFullRegistration: true },
  { id: 'p-gmat', name: 'GMAT Focus Edition', category: 'OTHER', type: 'Voucher', basePrice: 275, currency: 'USD', description: 'Standardized assessment for Business school entry.', icon: '💼', supportsFullRegistration: true },
  { id: 'p-ged', name: 'GED Test Voucher', category: 'OTHER', type: 'Voucher', basePrice: 80, currency: 'USD', description: 'General Educational Development certification.', icon: '📜', supportsFullRegistration: true },
  { id: 'p-langcert-selt', name: 'LanguageCert SELT', category: 'OTHER', type: 'Voucher', basePrice: 195, currency: 'USD', description: 'Secure English Language Test for UKVI.', icon: '⚡', supportsFullRegistration: true }
];

export const qualifications: Qualification[] = [
  { id: 'q-othm-3', title: 'OTHM Level 3 Diploma in Business Studies', duration: '6 Months', qualificationBody: 'OTHM', tuitionFees: '$1,200', requirements: ['High School Certificate'], description: 'Business operations foundation.', level: 'Level 3', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800' }
];

export const voucherCodes: VoucherCode[] = [];

export const universities: University[] = [
  { id: 'uni-manchester', name: 'University of Manchester', slug: 'manchester', location: 'Manchester, UK', ranking: 32, description: 'Research powerhouse.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' },
  { id: 'uni-sydney', name: 'University of Sydney', slug: 'sydney', location: 'Sydney, Australia', ranking: 19, description: 'Australia\'s premier university.', logo: 'https://images.unsplash.com/photo-1523050853063-bd8012fec046?w=200', countryId: 'australia', website: 'https://www.sydney.edu.au' }
];

export const courses: Course[] = [
  { id: 'c-cs-man', universityId: 'uni-manchester', title: 'MSc Computer Science', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£28,000', description: 'Advanced AI and Computing.' }
];

export const immigrationGuides: ImmigrationGuideData[] = [
  { id: 'skilled', countryId: 'skilled', slug: 'skilled-immigration', title: 'Skilled Immigration', content: 'Global pathways.', heroImage: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?w=1200', pathways: [] }
];

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in United Kingdom 2025/2026', 
    content: `Are you dreaming of walking through the historic campuses of Oxford, London, Manchester, Birmingham, Glasgow, Cardiff, Belfast? The United Kingdom remains one of the world's premier destinations for higher education, offering a blend of tradition, innovation, and global career opportunities. However, as we move into 2025 and look toward 2026, the landscape for international students is shifting.

### Why Study in the UK in 2025?
The UK’s reputation for academic excellence is unmatched. In 2025, several factors continue to make the UK a top choice:
- **Shorter Course Durations:** Most UK Bachelor’s degrees take only three years, and Master’s degrees are typically completed in just one year. This saves you both time and tuition costs.
- **World-Class Research:** UK universities are at the forefront of global innovation in AI, renewable energy, and healthcare.
- **Cultural Diversity:** You will join a vibrant community of students from over 180 countries, building a global network that will last a lifetime.

### The Latest 2025/2026 UK Student Visa Rules
1. **Increased Financial Maintenance Requirements:** As of November 11, 2025, the Home Office increased living cost requirements:
   - London: £1,529 per month (up to 9 months).
   - Outside London: £1,171 per month (up to 9 months).
   - Funds must be held for 28 consecutive days before submission.

2. **English Language Requirements:** For degree-level programs, UK HEIs can accept online and home-based exams like Oxford ELLT Digital, LanguageCert ESOL Online, Password Skills Plus, and Duolingo (university-dependent). For below-degree level, a SELT from an approved center (IELTS UKVI, PTE UKVI) is mandatory.

3. **Transition to eVisas:** Say goodbye to the physical Biometric Residence Permit (BRP). The UK has fully transitioned to eVisas. Access your status online via UKVI.

### Top Courses in Demand
- Computer Science & AI
- Healthcare & Nursing (NHS Staffing shortages)
- Renewable Energy Engineering
- Business Analytics & FinTech

### Post-Study Work: The Graduate Route
Currently, the Graduate Route visa allows 2 years (Bachelor/Master) or 3 years (PhD) of work. **Important Change:** For applications on/after January 1, 2027, the period for non-PhD graduates will reduce to 18 months. Plan your career timeline now.

### Common Mistakes to Avoid
- Last-Minute Funding (Red flag)
- Expired CAS (Valid for only 6 months)
- Incomplete TB Testing

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,171 - £1,529/mo', 
    visaRequirements: 'Student Visa (eVisas Active)' 
  },
  { 
    id: 'australia', 
    countryId: 'australia', 
    slug: 'australia', 
    title: 'Study in Australia 2025', 
    content: `G’day, future leaders! Australia combines world-class education with an outdoor lifestyle. Australian immigration is undergoing its biggest transformation in a decade.

### Why Choose Australia?
In 2025, the focus is on employability. Universities integrate industry placements into degrees.
- **Rankings:** Multiple unis in global Top 100.
- **Lifestyle:** Surf, hike, and explore cosmopolitan cities.

### The 2025 National Planning Level (Enrollment Caps)
The Australian government now sets a cap on new international student commencements. Competition is fierce; apply 8-10 months in advance.

### Mastering the Genuine Student (GS) Requirement
The Department of Home Affairs uses targeted questions to assess:
- **Course Value:** Why this specific course?
- **Incentives to Return:** Long-term plans back home.
- **Circumstances:** Explanations for gaps or career changes.

### New Financial Capacity Requirements
Proof of approximately **AUD $30,000+** for living expenses is now required.

### High-Demand Courses for PR
- Healthcare & Nursing
- Early Childhood Education
- Green Energy Engineering
- Cybersecurity & AI

### Post-Study Work Rights (Subclass 485)
- Bachelor/Master’s: 2 years.
- Regional Advantage: Additional 1-2 years if studying in Adelaide, Perth, or Hobart.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: 'AUD 2,500/mo', 
    visaRequirements: 'Subclass 500 Student Visa' 
  },
  { 
    id: 'canada', 
    countryId: 'canada', 
    slug: 'canada', 
    title: 'Study in Canada 2025', 
    content: `Canada remains a top-tier destination focusing on "quality over quantity."

### Why Choose Canada?
Canadian degrees are high-value in STEM, Healthcare, and Sustainable Tech. Canada prioritizes graduates for economic immigration.

### The 2025 Study Permit Caps and PAL System
IRCC has limited new study permits. Most students now require a **Provincial Attestation Letter (PAL)**. Apply early to secure your spot.

### Updated Financial Requirements
Applicants must show at least **CAD $20,635** for living expenses. We recommend the Guaranteed Investment Certificate (GIC) for SDS applications.

### PGWP Changes
Eligibility is now aligned with labor market demands for college grads. University grads from Bachelor/Master/Doctoral programs remain exempt from field-of-study restrictions.

### Top Courses for PR
- Healthcare & Nursing
- Skilled Trades (Construction, Plumbing)
- STEM (AI, Data Science)
- Early Childhood Education

### The "Dual Intent" Strategy
IRCC recognizes Dual Intent. You can study and eventually apply for PR, provided you have a compelling Study Plan (SOP).

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: 'CAD 1,800/mo', 
    visaRequirements: 'Study Permit (PAL Required)' 
  },
  { 
    id: 'new-zealand', 
    countryId: 'new-zealand', 
    slug: 'new-zealand', 
    title: 'Study in New Zealand 2025', 
    content: `Kia Ora, future adventurers! New Zealand (Aotearoa) offers a perfect balance between high-quality education and breathtaking nature.

### Why Choose New Zealand?
All 8 universities are ranked in the top 3% globally.
- **Te Pūkenga Model:** Practical, hands-on learning.
- **Safe Haven:** Ranked among the safest countries.

### 2025 Student Visa Rules
1. **Financial Maintenance:** Proof of **NZD $20,000 per year** required for living costs.
2. **English Standards:** IELTS 6.0/6.5 usually required, alternatives like PTE and LanguageCert ESOL accepted.
3. **Genuine Intent:** SOP must show course value.

### The Green List: Your Pathway to Residency
Hard-to-fill roles (Construction, Engineering, Healthcare, ICT) provide a fast-track to residency.

### Post-Study Work Rights
- Level 7+ (Bachelor/Master): 3-year Post-Study Work Visa.
- Below-Degree: Eligible only if the qualification is on the Green List.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200', 
    costOfLiving: 'NZD 1,700/mo', 
    visaRequirements: 'Fee Paying Student Visa' 
  },
  { 
    id: 'usa', 
    countryId: 'usa', 
    slug: 'usa', 
    title: 'Study in USA 2025', 
    content: `Hello, future innovators! The USA remains the undisputed "Land of Opportunity," hosting more international students than any other country.

### Why Choose the USA?
- **Liberal Arts Philosophy:** Academic flexibility.
- **STEM Powerhouse:** Epicenter for AI, Robotics, and Biotech.
- **Campus Culture:** Networking that spans continents.

### The 2025 F-1 Student Visa
- **Digital I-20s:** SEVIS updates are now digital.
- **Financial Proof:** Must cover one full year of attendance with liquid funds.
- **Interview Scrutiny:** Visa interviews are make-or-break.

### STEM OPT: The 3-Year Work Advantage
Standard OPT (12 months) + STEM Extension (24 months) gives you **3 years** to work for giants like Google or Amazon.

### The Community College "2+2" Pathway
Spend two years at a Community College (50% less tuition) and transfer to a University like UCLA or NYU for final years.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1508433957232-3107f5ee20c5?w=1200', 
    costOfLiving: '$1,500 - $2,500/mo', 
    visaRequirements: 'F-1 Student Visa' 
  },
  { 
    id: 'ireland', 
    countryId: 'ireland', 
    slug: 'ireland', 
    title: 'Study in Ireland 2025', 
    content: `Fáilte! Ireland blends rich cultural heritage with a high-tech economy. It is the only English-speaking country in the Eurozone.

### Why Choose Ireland?
- **European Tech Hub:** Dublin hosts HQ for Google, Meta, and Pfizer.
- **Safety:** Friendliest countries rankings.
- **Post-Study Work:** Stamp 1G scheme.

### Student Visa (Stamp 2) Rules
1. **Financial proof:** Access to **€12,000 per year** plus tuition.
2. **Medical Insurance:** Private insurance covering €25,000 in-hospital treatment is mandatory.

### The 1G Graduate Visa
- Master’s/PhD: 2-year stay-back visa.
- Bachelor’s: 1-year stay-back visa.
Transition into the Critical Skills Employment Permit for PR.

### High-Demand Courses
Data Science, Pharma, FinTech, and Cybersecurity.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed66a1846?w=1200', 
    costOfLiving: '€1,000/mo', 
    visaRequirements: 'Student Visa (Stamp 2)' 
  },
  { 
    id: 'cyprus', 
    countryId: 'cyprus', 
    slug: 'cyprus', 
    title: 'Study in Cyprus 2025', 
    content: `Thinking about the "European experience" without high fees or freezing winters? Cyprus is a booming Mediterranean hub.

### Why Cyprus is the "Smart" Move
- **Affordable standards:** Recognized across the EU.
- **Safe and Sunny:** High hospitality.
- **Erasmus+:** Access programs to study semesters in Italy or Germany.

### 2025 Visa Rules
- **Digital Verification:** Faster processing of academic docs.
- **Financial Proof:** Proof of roughly **€7,000 to €8,000** for living expenses.
- **Work Rights:** 20 hours/week during semester, full-time in summer (Tourism).

### High-Demand List
Hospitality & Tourism, Maritime (Limassol hub), Computer Science, and Medicine.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=1200', 
    costOfLiving: '€700/mo', 
    visaRequirements: 'Pink Slip (Temporary Residence)' 
  },
  { 
    id: 'germany', 
    countryId: 'germany', 
    slug: 'germany', 
    title: 'Study in Germany 2025', 
    content: `Germany is the "engine" of Europe and the land of precision engineering.

### Public vs. Private Universities
- **Public:** Tuition-free (mostly), highly competitive, high German proficiency often needed.
- **Private:** Fees apply but offer flexibility and English-taught programs.

### The Blocked Account (Sperrkonto)
Deposit requirement adjusted for inflation to roughly **€11,904 to €12,200** for the first year.

### 18-Month Post-Study Work Visa
Finish your degree and stay for 1.5 years to look for work related to your degree. Switch to an **EU Blue Card** for PR.

### Do You Need German?
While many Master's are in English, career success in Germany often requires at least **B1 level** proficiency.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€934/mo', 
    visaRequirements: 'National Visa (Type D)' 
  },
  { 
    id: 'italy', 
    countryId: 'italy', 
    slug: 'italy', 
    title: 'Study in Italy 2025', 
    content: `Italy is becoming famous as one of the most affordable high-quality destinations.

### "Income-Based" Tuition (ISEE)
Fees are based on family income. Public unis range from **€500 to €3,000 per year**. 

### Universitaly Portal
Mandatory "Pre-Enrollment" request for all international students.

### DSU Scholarships
Regional scholarships offering zero tuition, free meals, and a yearly stipend of **€5,000 to €7,000**.

### Post-Study Work
Stay for 12 months (Permesso di Soggiorno per ricerca lavoro) after graduation.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1516483601948-9b2832ac29c7?w=1200', 
    costOfLiving: '€600/mo', 
    visaRequirements: 'Student Visa (Type D)' 
  },
  { 
    id: 'sweden', 
    countryId: 'sweden', 
    slug: 'sweden', 
    title: 'Study in Sweden 2025', 
    content: `Sweden is a global powerhouse of innovation (Spotify, Northvolt, Ericsson, Volvo).

### The Swedish Way: Collaborative Learning
Informal education, call professors by first names, focus on "Sustainable Innovation."

### Residence Permit Rules
Financial proof adjusted to roughly **SEK 10,500 to 11,000 per month**. Money must be "at your disposal" in your own account.

### UniversityAdmissions.se
One portal to apply for up to four programs across the country.

### Post-Study Work
Apply to stay for 12 months specifically to look for a job or start a business.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?w=1200', 
    costOfLiving: 'SEK 11,000/mo', 
    visaRequirements: 'Residence Permit for Higher Education' 
  },
  { 
    id: 'finland', 
    countryId: 'finland', 
    slug: 'finland', 
    title: 'Study in Finland 2025', 
    content: `Finland is home to the world’s happiest education system.

### One Permit for Your Whole Degree
No annual renewals; a single permit covers the entire duration of studies.

### Financial Requirements
Proof of **€800 to €900 per month** required.

### Tuition & Early Bird Discounts
Fees range from €6,000 to €15,000. Many unis offer discounts for early acceptance.

### Work Rights
Allowed to work **30 hours per week** during the semester. 2-year post-study work visa for residency path.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200', 
    costOfLiving: '€850/mo', 
    visaRequirements: 'Residence Permit (B)' 
  },
  { 
    id: 'dubai', 
    countryId: 'dubai', 
    slug: 'dubai', 
    title: 'Study in Dubai 2025', 
    content: `Dubai is officially a "Knowledge Economy" and a launchpad for global careers.

### Branch Campus Model
Study at Heriot-Watt, Murdoch, or Wollongong and get the same degree as UK/Australia.

### 10-Year Golden Visa
Available for outstanding graduates with GPAs of 3.75+.

### Working While Studying
Part-time jobs and internships allowed with a No Objection Certificate (NOC). **No personal income tax** in Dubai.

### Cost of Living
Metro-linked accommodation saves costs. AED 2,500 to 4,500 for housing.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', 
    costOfLiving: 'AED 3,500/mo', 
    visaRequirements: 'Student Entry Permit' 
  },
  { 
    id: 'malaysia', 
    countryId: 'malaysia', 
    slug: 'malaysia', 
    title: 'Study in Malaysia 2025', 
    content: `Earn a Western degree (Monash, Nottingham) for 70% cheaper in Kuala Lumpur.

### e-VAL System
Digital visa approval letter processed in 14-21 days.

### Financial Proof
Cover tuition plus roughly **USD $4,000 to $5,000** for living.

### Career Hub
Cyberjaya (Silicon Valley of Malaysia) offers high-paying internships in tech.

### Conditions
Must maintain 80% attendance and 2.0 CGPA for visa renewal.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200', 
    costOfLiving: 'USD 500/mo', 
    visaRequirements: 'Student Pass (e-VAL)' 
  },
  { 
    id: 'turkey', 
    countryId: 'turkey', 
    slug: 'turkey', 
    title: 'Study in Turkey 2025', 
    content: `A bridge between history and the future. European standards with a Mediterranean soul.

### Bologna Process
Turkish degrees are recognized across the entire European Higher Education Area.

### Ikamet (Residence Permit)
Digitized process often completed directly on campus. Proof of **USD $5,000 to $7,000** for first year living.

### Türkiye Bursları
100% tuition, monthly stipend, and housing for top applicants. 

### High Demand
Architecture, Medicine, E-commerce, and Diplomacy.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: 'USD 300/mo', 
    visaRequirements: 'Student Visa & Ikamet' 
  },
  { 
    id: 'europe', 
    countryId: 'europe', 
    slug: 'europe', 
    title: 'Study in Europe 2025 Hub', 
    content: `Discover hidden gems of the continent: Poland, Hungary, Spain, and France.

### European hotspots
- **Poland:** Rising star in Computer Science and Engineering.
- **Hungary:** Best-value medical programs in Budapest.
- **Spain:** Top-tier global business schools.
- **France:** specialized "Grande Écoles" in Engineering and Management.

### ETIAS & Digital Visa
Shift toward digital boundaries and streamlined Schengen Student Visas.

### Stipendium Hungaricum
Full-ride scholarships in Hungary.

### Work Rights
Typically 20 hours/week during the semester. 9-12 month stay-back permits available after graduation.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€700/mo', 
    visaRequirements: 'Schengen Student Visa' 
  }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'pte-mastery', title: 'PTE Academic Mastery', description: 'Complete prep for Pearson Test of English.', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', category: 'PTE', duration: '20 Hours', instructor: 'Dr. Jane Smith', price: 99, status: 'Paid' }
];

export const lmsModules: LMSModule[] = [
  { id: 'm1-pte', courseId: 'pte-mastery', title: 'Module 1: Speaking & Writing Strategy', lessons: [] }
];

export const lmsTests: LMSPracticeTest[] = [
  { id: 'full-mock-1', title: 'IELTS/PTE Combined Mock Exam Alpha', sections: [] }
];

export const initialEnrollments: Enrollment[] = [];
export const courseVouchers: CourseVoucher[] = [];
export const universityBySlug = (slug: string): University | null => universities.find(u => u.slug === slug) || null;