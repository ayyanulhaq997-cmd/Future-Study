
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult } from '../types';

export const users: User[] = [
  { id: 'u-owner', name: 'Business Owner', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-ops', name: 'General Manager', email: 'ops@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-fin', name: 'Finance Lead', email: 'finance@unicou.uk', role: 'Finance Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-aca', name: 'Academic Director', email: 'academic@unicou.uk', role: 'Academic Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-sal-m', name: 'Sales Director', email: 'sales_mgr@unicou.uk', role: 'Sales Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-sal-a', name: 'Support Frontline', email: 'sales_agent@unicou.uk', role: 'Sales Agent', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-agent', name: 'Consultancy Alpha', email: 'agent@test.com', role: 'Agent', isAuthorized: true, verified: true, status: 'Active', tier: 2, country: 'Pakistan' },
  { id: 'u-inst', name: 'Prep Center Beta', email: 'center@test.com', role: 'Academic Institute', isAuthorized: true, verified: true, status: 'Active', country: 'United Arab Emirates' },
  { id: 'u-teacher', name: 'Lead Instructor', email: 'teacher@test.com', role: 'Teacher', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-std', name: 'Alex Student', email: 'student@test.com', role: 'Student', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
];

export const products: Product[] = [
  { id: 'v-pte-aca', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard PTE Academic for University Admissions.', icon: '📊' },
  { id: 'v-pte-core', name: 'PTE Core Voucher', category: 'PTE', type: 'Voucher', basePrice: 170, currency: 'USD', pricingModel: 'Country-Wise', description: 'PTE Core for Canadian Migration.', icon: '🇨🇦' },
  { id: 'v-pte-ukvi', name: 'PTE Academic UKVI', category: 'PTE', type: 'Voucher', basePrice: 185, currency: 'USD', pricingModel: 'Country-Wise', description: 'SELT version for UK Visa & Immigration.', icon: '🇬🇧' },
  { id: 'v-ielts-aca', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Country-Wise', description: 'IELTS Academic for Higher Education.', icon: '🌐' },
  { id: 'v-ielts-ukvi', name: 'IELTS for UKVI', category: 'IELTS', type: 'Voucher', basePrice: 195, currency: 'USD', pricingModel: 'Country-Wise', description: 'Official SELT IELTS for UKVI purposes.', icon: '👑' },
  { id: 'v-ielts-ls', name: 'IELTS Life Skills (A1/B1)', category: 'IELTS', type: 'Voucher', basePrice: 140, currency: 'USD', pricingModel: 'Global', description: 'IELTS Life Skills for Spouse/Settlement visas.', icon: '🗣️' },
  { id: 'v-toefl-ibt', name: 'TOEFL iBT Voucher', category: 'TOEFL', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Global', description: 'TOEFL iBT Official Exam Code.', icon: '📜' },
  { id: 'v-duolingo', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 59, currency: 'USD', pricingModel: 'Global', description: 'Fast, affordable online English test.', icon: '🦉' },
  { id: 'v-lc-aca', name: 'LanguageCert Academic', category: 'LanguageCert', type: 'Voucher', basePrice: 155, currency: 'USD', pricingModel: 'Global', description: 'LanguageCert International ESOL.', icon: '📝' },
  { id: 'v-sfe-selt', name: 'Skills for English SELT', category: 'Skills for English', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'PSI Skills for English for UKVI.', icon: '🎓' },
  { id: 'v-gre-gen', name: 'GRE General Test', category: 'OTHER', type: 'Voucher', basePrice: 220, currency: 'USD', pricingModel: 'Global', description: 'GRE General Voucher for Grad School.', icon: '📈' },
  { id: 'v-gmat-focus', name: 'GMAT Focus Edition', category: 'OTHER', type: 'Voucher', basePrice: 275, currency: 'USD', pricingModel: 'Global', description: 'GMAT Voucher for Business School.', icon: '💼' },
  { id: 'c-pte-master', name: 'PTE 79+ Masterclass', category: 'PTE', type: 'Course', basePrice: 49, currency: 'USD', pricingModel: 'Global', description: 'Complete video training for PTE Academic.', icon: '📽️' },
  { id: 'c-ielts-7', name: 'IELTS Band 7.0 Express', category: 'IELTS', type: 'Course', basePrice: 39, currency: 'USD', pricingModel: 'Global', description: 'Intensive 2-week IELTS preparation.', icon: '⚡' },
];

export const lmsCourses: LMSCourse[] = [
  { id: 'c-pte-master', title: 'PTE 79+ Masterclass', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', description: 'Complete video training for PTE Academic, covering all 20 task types.', duration: '25 Hours', instructor: 'Prof. Michael Aris', price: 49 },
  { id: 'c-ielts-7', title: 'IELTS Band 7.0 Express', category: 'IELTS', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', description: 'Intensive preparation focusing on Writing and Speaking high-score criteria.', duration: '12 Hours', instructor: 'Dr. Anna Bell', price: 39 },
  { id: 'c-othm-l3', title: 'OTHM Level 3 Diploma in Business', category: 'OTHM', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', description: 'Foundation diploma for entry into UK bachelor degrees.', duration: '6 Months', instructor: 'Academic Board', price: 850 },
  { id: 'c-academic-writing', title: 'Advanced Academic Writing', category: 'Academic', thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800', description: 'Master the art of high-stakes academic essays and SOP drafting.', duration: '10 Hours', instructor: 'Sarah Jenkins', price: 29 },
];

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in United Kingdom', 
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,171 - £1,529 / Month', 
    visaRequirements: 'Student Visa (eVisa)', 
    content: `Are you dreaming of walking through the historic campuses of Oxford, London, Manchester, Birmingham, Glasgow, Cardiff, Belfast? The United Kingdom remains one of the world's premier destinations for higher education, offering a blend of tradition, innovation, and global career opportunities. However, as we move into 2025 and look toward 2026, the landscape for international students is shifting.\n\n### Why Study in the UK in 2025?\n- Shorter Course Durations: Most UK Bachelor’s degrees take only three years, and Master’s degrees are completed in just one year, saving time and tuition.\n- World-Class Research: Leading global innovation in AI, renewable energy, and healthcare.\n- Cultural Diversity: Join a vibrant community from over 180 countries.\n\n### The Latest 2025/2026 UK Student Visa Rules\n1. Increased Financial Maintenance: As of November 11, 2025, students in London must show £1,529 per month (up to 9 months). Outside London, it is £1,171 per month.\n2. English Language Requirements: Below degree-level courses mandate a Secure English Language Test (SELT). For degree-level, HEIs accept online exams like Oxford ELLT, LanguageCert ESOL (Online), and Duolingo (university-specific).\n3. Transition to eVisas: The UK has fully transitioned to eVisas accessed via a secure UKVI account.\n\n### Top Courses in Demand\nComputer Science & AI, Healthcare & Nursing, Renewable Energy Engineering, and Business Analytics & FinTech.\n\n### Post-Study Work: The Graduate Route Update\nThe Graduate Route visa allows 2 years of work (3 years for PhD). Note: For applications on or after January 1, 2027, the period for non-PhDs will be reduced to 18 months.\n\nReady to take the first step? Open the student registration form to connect with our experts.`
  },
  { 
    id: 'australia', 
    countryId: 'au', 
    slug: 'australia', 
    title: 'Study in Australia', 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: 'AUD $2,500 / Month', 
    visaRequirements: 'Subclass 500 (GS)', 
    content: `G’day, future leaders! If you are looking for a destination that combines world-class education with an outdoor lifestyle that is second to none, Australia is likely at the top of your list. From the tech hubs of Sydney and Melbourne to the coastlines of Perth and Brisbane, the "Land Down Under" is the perfect place to launch a global career.\n\n### Why Choose Australia?\n- Industry-Integrated Education: Australian universities integrate industry placements into almost every degree.\n- Lifestyle Balance: Surfing, hiking, and cosmopolitan life prevent student burnout.\n\n### The 2025/2026 National Planning Level (Enrollment Caps)\nThe Australian government now sets a cap on new international student commencements. Competition is fierce—submit your application at least 8 to 10 months in advance to secure a spot for 2026.\n\n### Mastering the Genuine Student (GS) Requirement\nGone is the generic GTE essay. The GS requirement is the heartbeat of your visa application. We help you articulate course value, incentives to return, and personal circumstances clearly.\n\n### New Financial Capacity Requirements\nStudents must demonstrate proof of approximately AUD $30,000+ for living expenses, in addition to tuition and travel costs.\n\n### High-Demand Courses for PR\nHealthcare & Nursing, Early Childhood Education, Green Energy Engineering, Cybersecurity & AI, and Social Work.`
  },
  { 
    id: 'canada', 
    countryId: 'ca', 
    slug: 'canada', 
    title: 'Study in Canada', 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: 'CAD $1,800 / Month', 
    visaRequirements: 'Study Permit (PAL Req)', 
    content: `Canada remains a top-tier destination focusing on high-value education. While rules have tightened in 2025, the rewards for high-quality students are greater than ever. This is your roadmap to navigating new policies and securing your place.\n\n### Why Choose Canada?\n- Academic Prestige: Canadian degrees are held in high regard globally, particularly in STEM and Healthcare.\n- Bilingual Advantage: Studying in a country with two official languages gives you a competitive edge.\n- Pathways to Residency: Canada still prioritizes international graduates for economic immigration programs.\n\n### The 2025/2026 Study Permit Caps and PAL System\nMost students now require a Provincial Attestation Letter (PAL) from the province where they intend to study. Each province has a specific quota. Early application is essential.\n\n### Updated Financial Requirements\nSingle applicants must show they have at least CAD $20,635 plus first-year tuition. We specialize in GIC preparation to prove financial stability.\n\n### Post-Graduation Work Permit (PGWP) Changes\nPGWP eligibility now aligns with labor market demands. college programs must be linked to long-term shortage occupations. University degrees remain a safer long-term bet for residency.\n\n### The "Dual Intent" Strategy\nIRCC explicitly recognizes "Dual Intent"—you can study and eventually apply for PR. We help you draft a compelling SOP that balances these goals.`
  },
  { 
    id: 'new-zealand', 
    countryId: 'nz', 
    slug: 'new-zealand', 
    title: 'Study in New Zealand', 
    heroImage: 'https://images.unsplash.com/photo-1469521669194-bdf95559c13d?w=1200', 
    costOfLiving: 'NZD $1,700 / Month', 
    visaRequirements: 'Fee Paying Student Visa', 
    content: `Kia Ora, future adventurers! New Zealand (Aotearoa) is calling. Known for its "think new" approach to learning, New Zealand is a place where innovation, creativity, and student well-being come first. Every single university is ranked in the top 3% globally.\n\n### Why Choose New Zealand in 2025/2026?\n- The 8-University Excellence: Government-funded and recognized worldwide for research quality.\n- Work-Ready Education: The "Te Pūkenga" model provides practical, hands-on learning.\n- Safe and Welcoming: Consistently ranks as one of the safest and least corrupt countries.\n\n### The 2025 New Zealand Student Visa Rules\n1. Increased Financial Maintenance: Applications must demonstrate at least NZD $20,000 per year for living costs.\n2. English Standards: Most universities require IELTS 6.0 or 6.5. Alternative tests like PTE Academic and LanguageCert are widely accepted.\n3. Genuine Intent: Statement of Purpose (SOP) must clearly show course value to your global career.\n\n### The Green List Pathway\nThe NZ Green List contains "Hard-to-Fill" roles that provide a fast-track to residency. Priority sectors include Construction, Engineering, Healthcare, ICT, and Teaching.\n\n### Post-Study Work Rights\nBachelor’s, Master’s, or PhD graduates are generally eligible for a 3-year Post-Study Work Visa.`
  },
  { 
    id: 'usa', 
    countryId: 'us', 
    slug: 'usa', 
    title: 'Study in United States', 
    heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', 
    costOfLiving: '$2,500 USD / Month', 
    visaRequirements: 'F-1 Student Visa', 
    content: `Hello, future innovators! The United States remains the undisputed "Land of Opportunity." In 2025, it continues to host more international students than any other country, offering unparalleled academic flexibility.\n\n### Why Choose the USA?\n- Global Rankings: Dominates the QS and Times Higher Education rankings.\n- STEM Powerhouse: Global epicenter for AI, Robotics, and Biotech research.\n- Campus Culture: NCAA sports and thousands of clubs build leadership skills.\n\n### The 2025 F-1 Student Visa: Digital Shifts\n- Digital I-20s: Universities now issue digital forms sent instantly via email.\n- Financial Requirement: Must demonstrate "liquid funds" (cash, loans, scholarships) to cover one full year of tuition and living expenses.\n- Expanded Interview Waivers: Increased for returning students, but critical for first-time applicants.\n\n### STEM OPT: The 3-Year Work Advantage\nScience, Tech, Engineering, and Math graduates are eligible for a 24-month extension, giving a total of 3 years to work for US companies like Google, Tesla, or Amazon without a H-1B visa.\n\n### The Community College "2+2" Pathway\nSpend two years at a Community College (50% lower tuition) and transfer to top-tier Universities like UCLA or NYU for the final two years.`
  },
  { 
    id: 'ireland', 
    countryId: 'ie', 
    slug: 'ireland', 
    title: 'Study in Ireland', 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200', 
    costOfLiving: '€1,000 / Month', 
    visaRequirements: 'Stamp 2 Visa', 
    content: `Fáilte! Ireland has emerged as one of the most strategic choices for international students, as the only English-speaking country in the Eurozone. It bridges the gap between education and careers in global giants like Google, Meta, and Pfizer.\n\n### Why Choose Ireland?\n- European Tech Hub: Dublin is the HQ for over 1,000 multinational companies.\n- Academic Excellence: Trinity College and UCD are in the top 1% of research institutions.\n- Safety Haven: Frequently ranked as one of the safest and friendliest countries.\n\n### Ireland Student Visa (Stamp 2) Rules 2025\n- Increased Financial Capacity: Must demonstrate at least €12,000 per year for living expenses.\n- English Standards: Acceptance of IELTS, PTE, and LanguageCert.\n- Mandatory Insurance: Private medical insurance must cover at least €25,000.\n\n### The 1G Graduate Visa\nMaster’s & PhD graduates are eligible for a 2-year stay-back visa. Bachelor’s graduates get 1 year. This is the fastest route to a Critical Skills Employment Permit.\n\n### High-Demand Courses\nData Science & AI, Pharmaceutical Sciences, FinTech, and Sustainable Energy Engineering.`
  },
  { 
    id: 'cyprus', 
    countryId: 'cy', 
    slug: 'cyprus', 
    title: 'Study in Cyprus', 
    heroImage: 'https://images.unsplash.com/photo-1543233301-042234f9a0c1?w=1200', 
    costOfLiving: '€700 / Month', 
    visaRequirements: 'Pink Slip Residence', 
    content: `If you want the "European experience" with affordable tuition and sun-soaked days, Cyprus is your answer. It is a booming educational hub offering EU-recognized degrees.\n\n### Why Cyprus in 2025/2026?\n- European Hub: English is widely spoken and culture is welcoming.\n- Digital Visa Verification: Faster processing for academic documents.\n- The "Pink Slip": Our team walks you through the Temporary Residence Permit process upon arrival.\n\n### Work Rights & Costs\n- Work While You Study: International students are allowed 20 hours per week.\n- Affordable Living: Comfortably live on €600 to €900 a month.\n- Erasmus+ Secret: Access grants to spend a semester in other EU countries like Italy or Germany.\n\n### High-Demand Programs\nHospitality & Tourism, Maritime & Shipping (Limassol is a global hub), Computer Science & Fintech, and Medicine.\n\nReady to plan your 2026 year? Start your application with UniCou Ltd today.`
  },
  { 
    id: 'germany', 
    countryId: 'de', 
    slug: 'germany', 
    title: 'Study in Germany', 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€1,000 / Month', 
    visaRequirements: 'Sperrkonto (Blocked A/C)', 
    content: `Germany is the engine of Europe and the land of precision engineering. It remains one of the few places where you can get a world-class education without a mountain of debt.\n\n### Public vs. Private Universities\nPublic universities are tuition-free but highly competitive. Private universities offer more English-taught programs and strong international corporate links.\n\n### The "Blocked Account" (Sperrkonto) 2025\nTo account for inflation, the German government now requires a deposit of roughly €11,904 to €12,200 for your first year. We help you set this up with Fintiba or Expatrio.\n\n### Working While You Study\nGermany is generous—international students can work 140 full days or 280 half days per year. "Werkstudent" positions at tech firms can cover most living costs.\n\n### High-Demand Careers\nEngineering, IT & Cybersecurity, Healthcare, and Renewable Energy (Energiewende).\n\n### 18-Month Job Seeker Visa\nFinish your degree and stay for 1.5 years to look for a role. Once found, we guide you toward a Blue Card (EU) for permanent residency.`
  },
  { 
    id: 'italy', 
    countryId: 'it', 
    slug: 'italy', 
    title: 'Study in Italy', 
    heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200', 
    costOfLiving: '€800 / Month', 
    visaRequirements: 'Type D (Study) Visa', 
    content: `Italy is becoming one of the most affordable and high-quality destinations in the world. Tuition is based on family income, not a fixed high rate.\n\n### The "Income-Based" Tuition Secret\nPublic universities use the ISEE system. Fees range from €500 to €3,000 per year. We guide you through the documentation to claim the lowest fees.\n\n### The 2025/2026 Universitaly Portal\nAll applications must go through the centralized Universitaly gateway. Mistakes lead to rejection; our team manages your profile for security.\n\n### DSU Scholarships\nRegional grants can provide zero tuition, a free meal a day, and a yearly stipend of up to €7,000. These are based on financial need, not just grades.\n\n### Entrance Exams\nPreparation for IMAT (Medicine), TOLC (Engineering), and SAT is critical as competition increases.\n\n### Post-Study Work\nApply for a "Permesso di Soggiorno" to stay for 12 months for job seeking in Automotive Engineering, Fashion Design, or AI.`
  },
  { 
    id: 'sweden', 
    countryId: 'se', 
    slug: 'sweden', 
    title: 'Study in Sweden', 
    heroImage: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1200', 
    costOfLiving: 'SEK 10,500 / Month', 
    visaRequirements: 'Residence Permit', 
    content: `Sweden is for students who want to be part of a society building the future. Innovation, Green Tech, and Social Justice are part of the collaborative learning style.\n\n### The Swedish Way: "Lagom"\nFocus on "Sustainable Innovation." Professors are called by their first names, and small groups solve real-world problems.\n\n### 2025 Residence Permit Rules\nYou must show SEK 10,500 to 11,000 per month for your stay. Money must be in your own account and "at your disposal."\n\n### Admissions Portal\nSweden uses a single portal (UniversityAdmissions.se) for up to four programs. Deadlines are early—mid-January for the August intake.\n\n### Post-Study Work Visa\nSweden wants you to stay! Apply for 12 months to look for work with Spotify, Volvo, or Ericsson.\n\n### High-Demand Careers\nBattery Technology (Gigafactories), IT & Software, Biotechnology, and Health & Welfare.`
  },
  { 
    id: 'finland', 
    countryId: 'fi', 
    slug: 'finland', 
    title: 'Study in Finland', 
    heroImage: 'https://images.unsplash.com/photo-1527330263441-105a8827d9a2?w=1200', 
    costOfLiving: '€900 / Month', 
    visaRequirements: 'Single-Permit Strategy', 
    content: `Finland is the world’s happiest country and home to the best education system on the planet. Innovation is part of the routine and "student-life balance" is a way of life.\n\n### The Finnish Classroom\nInformal environments where you solve real-world problems. Equality means your ideas are just as valid as your professor’s.\n\n### One Permit for Your Whole Degree\nNew for 2025: Residence permits cover the entire duration of your studies—no annual renewals needed!\n\n### Financial Proof 2025/2026\nShow roughly €800 to €900 per month for living costs. Finland accepts digital funding proof but scrutinizes stability.\n\n### Work While You Study\n30 hours of work per week allowed during the semester. No limits during holidays. Talent shortages in ICT and Nursing mean great opportunities.\n\n### 2-Year Post-Study Work Visa\nOne of the longest stay-back periods in Europe. A direct path to PR and Finnish citizenship.`
  },
  { 
    id: 'europe', 
    countryId: 'eu', 
    slug: 'europe', 
    title: 'Europe Hub', 
    heroImage: 'https://images.unsplash.com/photo-1471623197341-389f41434f8d?w=1200', 
    costOfLiving: 'Variable', 
    visaRequirements: 'Schengen Educational', 
    content: `Discover the hidden gems of Europe! Beyond the major capitals, destinations like Poland, Hungary, Spain, and France offer affordable, high-quality education.\n\n### 2025 Rising Stars\n- Poland: Rising star for Engineering and Computer Science at a fraction of Western costs.\n- Hungary: Best-value destination for Medicine and Dentistry.\n- Spain: World-leading private business schools and renewable energy hubs.\n- France: Specialized "Grande Écoles" for Engineering and Management.\n\n### Digital Visa Shifts (ETIAS)\nStreamlined digital borders in the Schengen zone. Most nations now use digital uploads instead of physical folder submissions.\n\n### Financial Strategy\nLive well on a budget by choosing "Student Cities" like Poznań (Poland) or Valencia (Spain) instead of capitals.\n\n### Post-Study Work Visas\nSpain and France offer 12-month stay-back permits. Poland offers 9 months. Transition to an EU Blue Card for long-term mobility.`
  },
  { 
    id: 'dubai', 
    countryId: 'ae', 
    slug: 'dubai', 
    title: 'Study in Dubai', 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea4a73a88d6?w=1200', 
    costOfLiving: 'AED 3,500 / Month', 
    visaRequirements: 'Student Visa (Tax-Free)', 
    content: `Dubai is your launchpad in the city of the future. It has officially become a "Knowledge Economy" with ultra-modern environments and direct job market access.\n\n### The Dubai Edge: Global Degrees\nStudy at international branch campuses of UK and Australian universities (Heriot-Watt, Monash). You get the same degree certificate as in London or Sydney.\n\n### Efficient Visa Process\nUniversities act as sponsors, handling the bulk of the migration paperwork. Medical tests and health insurance are mandatory but streamlined.\n\n### The "Golden Visa"\nHigh-achieving students (GPA 3.75+) are eligible for a 10-Year Golden Visa, allowing long-term residency without a sponsor.\n\n### Tax-Free Earnings\nNo personal income tax in Dubai. Work part-time and keep what you earn. Huge demand in Fintech, Luxury Hospitality, and AI.`
  },
  { 
    id: 'malaysia', 
    countryId: 'my', 
    slug: 'malaysia', 
    title: 'Study in Malaysia', 
    heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200', 
    costOfLiving: '$500 USD / Month', 
    visaRequirements: 'e-VAL / EMGS', 
    content: `Malaysia is a top-10 global education hub. Earn degrees from top-tier UK or Australian universities while living in one of the most affordable countries in Asia.\n\n### The "Branch Campus" Hack\nUniversities like Monash or Nottingham in Malaysia issue identical degree certificates to their home campuses at 60-70% lower costs.\n\n### 2025 EMGS Digital Visa\ne-VAL approvals now take only 14-21 working days. Financial requirement: Proof of USD $4,000 to $5,000 for living expenses.\n\n### High-Demand Careers\nSemiconductor Engineering, Fintech, Islamic Finance, and Data Science. Kuala Lumpur is a gateway to the entire ASEAN region.\n\n### Attendance is King\nTo renew your Student Pass, you must maintain 80% attendance and a CGPA of 2.0. EMGS is strict on academic progress.`
  },
  { 
    id: 'turkey', 
    countryId: 'tr', 
    slug: 'turkey', 
    title: 'Study in Turkey', 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: '$400 USD / Month', 
    visaRequirements: 'Ikamet Residence', 
    content: `Turkey is where continents meet.坐 sitting in a lecture in Europe and walking to Asia in minutes. Turkey offers European-quality degrees without the "Western" price tag.\n\n### The Turkish Edge\nFull member of the Bologna Process—degrees are recognized across all of Europe. Doubling of English-taught programs in Istanbul, Ankara, and Izmir.\n\n### Student Residence (Ikamet) 2025\nDigitized process for faster permits. Financial proof required: USD $5,000 to $7,000 for your first year. Residency interviews often happen directly on campus.\n\n### Turkiye Bursları (Scholarships)\none of the most comprehensive programs globally, covering 100% tuition, stipend, accommodation, and language courses.\n\n### High-Demand Careers\nArchitecture & Civil Engineering, Medicine & Health Sciences, and Digital Marketing.`
  },
];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'full-mock-1',
    title: 'IELTS Academic Full Simulation (v4.1)',
    sections: [
      {
        id: 'ielts-reading-1',
        title: 'Reading Section: Academic Text Analysis',
        skill: 'Reading',
        timeLimit: 60,
        passageText: `The Impact of Urban Green Spaces\n\nRecent studies in environmental psychology have highlighted the vital role that urban green spaces play in enhancing the mental well-being of city dwellers. As populations continue to shift towards metropolitan areas, the scarcity of natural environments becomes a pressing public health concern. Researchers found that proximity to parks and gardens correlates with lower stress levels and higher cognitive performance.`,
        questions: [
          { id: 'q1', skill: 'Reading', type: 'TFNG', text: 'Urban green spaces have a negative impact on mental health.' },
          { id: 'q2', skill: 'Reading', type: 'Fill-Blanks', text: 'Proximity to natural environments leads to increased ___________________ levels.' }
        ]
      }
    ]
  },
  {
    id: 'test-lc-academic-02',
    title: 'LanguageCert Academic Test 2 (Full Mock)',
    sections: [
      {
        id: 'lc-listening-3',
        title: 'Listening Part 3: Lecture Note Completion',
        skill: 'Listening',
        timeLimit: 10,
        audioUrl: 'SIMULATED_LECTURE_FEED',
        questions: [
          { id: 'l3q18', skill: 'Listening', type: 'Note-Completion', text: 'This cave art was first brought to public attention in (18) ___________________.' },
          { id: 'l3q19', skill: 'Listening', type: 'Note-Completion', text: 'Adam Brumm dated a Sulawesi cave painting by analysing material found on an image of a (19) ______________________.' },
          { id: 'l3q21', skill: 'Listening', type: 'Note-Completion', text: 'The artwork they found near Makassar is probably intended to show (21) ______________________ between pigs.' },
          { id: 'l3q22', skill: 'Listening', type: 'Note-Completion', text: 'The picture of pigs may be the earliest known example of (22) ______________________ art.' },
          { id: 'l3q24', skill: 'Listening', type: 'Note-Completion', text: 'Scientists use the word (24) ______________________ to describe the calcite deposit.' }
        ]
      }
    ]
  }
];

export const universities: University[] = [];
export const courses: Course[] = [];
export const qualifications: Qualification[] = [];
export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
export const immigrationGuides: any[] = [];
export const voucherCodes: VoucherCode[] = [];
