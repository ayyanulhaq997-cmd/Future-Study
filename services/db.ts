
import { Product, VoucherCode, User, University, Course, CountryGuide, LMSCourse, LMSModule, LMSPracticeTest, Enrollment, CourseVoucher, Qualification, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Admin / Owner', email: 'admin@unicou.uk', role: 'Admin' },
  { id: 'u-finance', name: 'Finance / Audit Team', email: 'finance@unicou.uk', role: 'Finance' },
  { id: 'u-manager', name: 'Operations Manager', email: 'manager@unicou.uk', role: 'Manager' },
  { id: 'u-sales-exec', name: 'Global Sales Executive', email: 'sales@unicou.uk', role: 'Sales Executive' },
  { id: 'u-support', name: 'Support / Sales Node', email: 'support@unicou.uk', role: 'Support' },
  { id: 'u-agent', name: 'Agent Partner / Prep Center', email: 'partner@unicou.uk', role: 'Agent', tier: 2 },
  { id: 'u-student', name: 'Alex Smith (Student)', email: 'alex@gmail.com', role: 'Customer' },
];

export const products: Product[] = [
  { id: 'v-1', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', description: 'Standard British Council/IDP Academic training voucher.', icon: '🌐' },
  { id: 'v-2', name: 'IELTS General Training', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', description: 'Standard IELTS General training voucher for migration.', icon: '🌐' },
  { id: 'v-6', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', description: 'Pearson Test of English Academic standard voucher.', icon: '📊' },
  { id: 'v-10', name: 'LanguageCert SELT B1', category: 'LanguageCert', type: 'Voucher', basePrice: 130, currency: 'GBP', description: 'Secure English Language Test (SELT) for UKVI.', icon: '⚡' },
  { id: 'v-11', name: 'LanguageCert SELT B2', category: 'LanguageCert', type: 'Voucher', basePrice: 145, currency: 'GBP', description: 'Advanced SELT assessment for University Tier 4.', icon: '⚡' },
  { id: 'v-17', name: 'Skills for English SELT', category: 'Skills for English', type: 'Voucher', basePrice: 135, currency: 'GBP', description: 'PSI Skills for English UKVI compliant voucher.', icon: '🛡️' },
  { id: 'v-19', name: 'TOEFL iBT Official', category: 'TOEFL', type: 'Voucher', basePrice: 195, currency: 'USD', description: 'ETS TOEFL iBT Official Global voucher.', icon: '🌎' },
  { id: 'v-20', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 60, currency: 'USD', description: 'Duolingo English Test Global Access.', icon: '🦉' },
  { id: 'v-21', name: 'Oxford ELLT Digital', category: 'ELLT', type: 'Voucher', basePrice: 75, currency: 'GBP', description: 'Oxford International Digital English Test.', icon: '🏫' },
  { id: 'v-22', name: 'Password Skills Plus', category: 'OTHER', type: 'Voucher', basePrice: 85, currency: 'GBP', description: 'Password Skills Plus Global assessment node.', icon: '🔑' }
];

export const voucherCodes: VoucherCode[] = products.flatMap(p => 
  Array(100).fill(0).map((_, i) => ({
    id: `vc-${p.id}-${i}`,
    productId: p.id,
    code: `${p.category.substring(0,2).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    status: 'Available' as const,
    expiryDate: '2026-12-31'
  }))
);

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in United Kingdom', 
    content: `Are you dreaming of walking through the historic campuses of Oxford, London, Manchester, Birmingham, Glasgow, Cardiff, Belfast? The United Kingdom remains one of the world's premier destinations for higher education, offering a blend of tradition, innovation, and global career opportunities.
    
    ### Why Study in the UK in 2025?
    The UK’s reputation for academic excellence is unmatched. In 2025, factors like **Shorter Course Durations** (3-year Bachelors, 1-year Masters) and **World-Class Research** in AI and healthcare continue to make the UK a top choice.
    
    ### Latest 2025 UK Student Visa Rules
    - **Increased Financial Maintenance:** As of November 11, 2025, students in London need **£1,529 per month** and those outside London need **£1,171 per month** (for up to 9 months). Funds must be held for **28 consecutive days**.
    - **English Language Requirements:** Below-degree level courses mandate a **SELT** (IELTS for UKVI, PTE Academic UKVI, etc.). Degree-level programs may accept "non-SELT" online options like **Oxford ELLT Digital**, **LanguageCert ESOL**, or **Password Skills Plus**.
    - **Transition to eVisas:** The UK has fully transitioned to **eVisas**. Access your status online through your secure UKVI account.
    
    ### Top Courses in Demand
    - Computer Science & AI
    - Healthcare & Nursing (NHS Pathways)
    - Renewable Energy Engineering
    - Business Analytics & FinTech
    
    ### Post-Study Work: The Graduate Route
    The Graduate Route visa currently allows graduates to stay for **2 years** (3 years for PhD). Important: Applications made on or after January 1, 2027, will see this reduced to **18 months** for non-PhD graduates.`,
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,171 - £1,529/mo', 
    visaRequirements: 'Student Visa (eVisas Active)' 
  },
  { 
    id: 'australia', 
    countryId: 'australia', 
    slug: 'australia', 
    title: 'Study in Australia', 
    content: `Australia is undergoing its biggest immigration transformation in a decade. Australia remains a global powerhouse in education, focusing on employability and industry placements.
    
    ### The 2025 National Planning Level (NPL)
    The Australian government now sets a cap on the number of new international student commencements. This means competition is fierce; students should apply **8 to 10 months in advance** to secure their spot.
    
    ### Mastering the Genuine Student (GS) Requirement
    The Genuine Student (GS) requirement is now the heartbeat of your visa application. You must clearly articulate the **Course Value**, **Incentives to Return**, and explain any **Study Gaps**.
    
    ### New Financial Capacity Requirements
    Students must demonstrate proof of approximately **AUD $30,000+** for living expenses, in addition to tuition and travel costs.
    
    ### English Language Standards: The Benchmark
    - **Student Visa (Subclass 500):** Minimum IELTS 6.0.
    - **Post-Study Work Visa:** Minimum IELTS 6.5.
    
    ### High-Demand Courses for PR
    Registered Nursing, Early Childhood Education, Green Energy Engineering, and Cybersecurity remain on the **Medium and Long-term Strategic Skills List (MLTSSL)**.`,
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: 'AUD $2,500/mo', 
    visaRequirements: 'Subclass 500 (GS Protocol)' 
  },
  { 
    id: 'canada', 
    countryId: 'canada', 
    slug: 'canada', 
    title: 'Study in Canada', 
    content: `As we look toward 2025, the landscape for international students in Canada has changed. The focus has shifted toward "quality over quantity."
    
    ### Study Permit Caps and PAL System
    The **National Study Permit Cap** manages housing and infrastructure. Most students now require a **Provincial Attestation Letter (PAL)**. Each province has a specific quota, so early application is essential.
    
    ### Updated Financial Requirements
    For 2025 applications, a single applicant must show at least **CAD $20,635** for living costs. The **Guaranteed Investment Certificate (GIC)** is the preferred method for proving stability.
    
    ### PGWP Changes in 2025
    If graduating from a college program, your field of study must be linked to a "long-term shortage" occupation to be eligible for a **Post-Graduation Work Permit (PGWP)**. University graduates from Bachelor/Master programs currently remain exempt from these field-of-study restrictions.
    
    ### Top Courses for Growth
    - Healthcare & Nursing
    - Skilled Trades (Construction, Electrical)
    - STEM (AI, Data Science)
    - Agriculture & Agri-Tech
    
    ### The "Dual Intent" Strategy
    IRCC explicitly recognizes "Dual Intent"—you can state your goal to study and eventually apply for PR, provided you prove the means and intention to leave if your visa expires.`,
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: 'CAD $2,000/mo', 
    visaRequirements: 'Study Permit / SDS' 
  },
  { 
    id: 'usa', 
    countryId: 'usa', 
    slug: 'usa', 
    title: 'Study in USA', 
    content: `The USA remains the undisputed "Land of Opportunity." In 2025, it continues to host more international students than any other country, offering unparalleled academic flexibility.
    
    ### The F-1 Student Visa: Digital Shifts
    - **Digital I-20s:** Most universities now issue digital I-20 forms instantly via SEVIS synchronization.
    - **Financial Requirement:** You must demonstrate "liquid funds" (cash, loans, scholarships) to cover **one full year** of attendance.
    - **Interview Mastery:** First-time applicants must ace the Visa Interview, explaining their "Student Intent" and ties to their home country.
    
    ### STEM OPT: The 3-Year Work Advantage
    Standard OPT grants 12 months of work authorization. Graduates from **STEM-designated** courses are eligible for a **24-month extension**, totaling **3 years** to work for U.S. giants like Google or Tesla.
    
    ### The Community College "2+2" Pathway
    A major trend for 2025: spend two years at a Community College (50% less tuition) and transfer to a top-tier University (like UCLA or NYU) for the final two years.
    
    ### High-Growth Courses
    Artificial Intelligence, Data Science, Healthcare Administration, and Sustainability Engineering see the highest starting salaries.`,
    heroImage: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=1200', 
    costOfLiving: '$2,500/mo', 
    visaRequirements: 'F-1 Student Visa' 
  },
  { 
    id: 'new-zealand', 
    countryId: 'nz', 
    slug: 'new-zealand', 
    title: 'Study in New Zealand', 
    content: `New Zealand (Aotearoa) is known for its "think new" approach. Every single NZ university is ranked in the top 3% globally.
    
    ### 2025 Visa Rules
    - **Financial Maintenance:** You must demonstrate at least **NZD $20,000 per year** for living costs.
    - **English Standards:** Universities typically require IELTS 6.0/6.5. Alternatives like **LanguageCert International ESOL** are widely accepted.
    
    ### The Green List: Pathway to Residency
    The **New Zealand Green List** contains "Hard-to-Fill" roles like Civil Engineering, Registered Nursing, ICT Managers, and Secondary Teaching. These offer a fast-track to residency.
    
    ### Post-Study Work Rights (PSWP)
    - **Degree-Level (Level 7+):** Eligible for a **3-year Post-Study Work Visa**.
    - **Below-Degree:** Eligible only if your qualification is on the Green List.
    
    ### Working While You Study
    International students can typically work **20 hours per week** during the semester and full-time during holidays.`,
    heroImage: 'https://images.unsplash.com/photo-1469521669194-b785a4361b00?w=1200', 
    costOfLiving: 'NZD $1,800/mo', 
    visaRequirements: 'Fee Paying Student Visa' 
  },
  { 
    id: 'ireland', 
    countryId: 'ie', 
    slug: 'ireland', 
    title: 'Study in Ireland', 
    content: `Ireland is the only English-speaking country in the Eurozone and a premier global tech hub.
    
    ### Why Choose Ireland?
    Dublin is the European headquarters for over 1,000 multinationals like Google, Meta, and Pfizer, creating an ecosystem of internship opportunities.
    
    ### 2025 Visa (Stamp 2) Rules
    - **Financial Capacity:** Students must demonstrate at least **€12,000 per year** for living expenses.
    - **Mandatory Medical Insurance:** Must cover at least €25,000 for in-hospital treatment.
    
    ### The 1G Graduate Visa
    - **Masters & PhD:** 2-year stay-back visa.
    - **Bachelors:** 1-year stay-back visa.
    This period is designed for transition into the **Critical Skills Employment Permit**, the fastest route to PR.
    
    ### High-Demand Sectors
    Data Science, Pharmaceutical Sciences, FinTech, Sustainable Energy, and Cybersecurity.
    
    ### Working Rights
    Students on Stamp 2 can work **20 hours per week** during the semester and **40 hours** during summer/winter holidays.`,
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200', 
    costOfLiving: '€1,200/mo', 
    visaRequirements: 'Stamp 2 Visa' 
  },
  { 
    id: 'germany', 
    countryId: 'de', 
    slug: 'germany', 
    title: 'Study in Germany', 
    content: `Germany is the "engine" of Europe and one of the few places left with world-class, tuition-free public universities.
    
    ### Public vs. Private Universities
    - **Public:** Tuition-free but highly competitive; often requires high German proficiency.
    - **Private:** Fees apply, but offer more English-taught programs and flexible admission.
    
    ### The Blocked Account (Sperrkonto) 2025
    The mandatory monthly requirement has been adjusted for inflation. Expect to deposit roughly **€11,904 to €12,200** for your first year.
    
    ### Work Rights and The "Minijob"
    Students can work **140 full days** per year. "Werkstudent" positions at tech firms are highly valued.
    
    ### The 18-Month Post-Study Work Visa
    Once you finish your degree, you can apply for an **18-month job seeker visa**. Finding a professional job leads to the **EU Blue Card**, the fastest path to residency.
    
    ### Mandatory APS Certificate
    For students from countries like India, China, or Vietnam, the **APS certificate** is mandatory for enrollment.`,
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€950/mo', 
    visaRequirements: 'National Visa (D)' 
  },
  { 
    id: 'italy', 
    countryId: 'it', 
    slug: 'italy', 
    title: 'Study in Italy', 
    content: `Italy is becoming famous for being one of the most affordable high-quality study destinations in the world.
    
    ### The "Income-Based" Tuition (ISEE)
    Italian public universities use the ISEE system. Tuition fees are adjusted based on family income, ranging from **€500 to €3,000 per year** for many international students.
    
    ### The DSU Scholarship Advantage
    Regional **DSU scholarships** can provide zero tuition, free meals at the canteen, and a yearly stipend of **€5,000 to €7,000**.
    
    ### Pre-Enrollment & Universitaly
    You must complete a "Pre-Enrollment" request on the **Universitaly portal**. This centralized node is mandatory for visa issuance.
    
    ### Entrance Exams
    - **IMAT:** For Medicine in English.
    - **TOLC/SAT:** For Engineering and Economics.
    
    ### Post-Study Work
    Graduates can apply for a **12-month stay-back permit** for job seeking in fields like Automotive Engineering, Fashion Design, or AI.`,
    heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200', 
    costOfLiving: '€900/mo', 
    visaRequirements: 'Study Visa Type D' 
  },
  { 
    id: 'sweden', 
    countryId: 'se', 
    slug: 'sweden', 
    title: 'Study in Sweden', 
    content: `Sweden is the land of innovation (Spotify, Volvo, Ericsson) and sustainability. It offers a collaborative and informal learning environment.
    
    ### 2025 Residence Permit & Financials
    For the 2025 academic year, you must show roughly **SEK 11,000 per month** in your own bank account.
    
    ### University Admissions Portal
    Sweden uses a centralized portal (**UniversityAdmissions.se**) where you apply for up to four programs with one set of documents. Note: deadlines are very early (mid-January for August intake).
    
    ### Scholarships
    - **SI Global Professionals:** Covers full tuition, living costs, and travel.
    - **University-Specific:** Waivers ranging from 25% to 75%.
    
    ### Post-Study Work Visa
    Complete your degree and stay for **12 months** specifically to look for work or start a business.
    
    ### The Personal Identity Number (Personnummer)
    If staying for more than a year, the Personnummer is your key to free healthcare and opening a bank account.`,
    heroImage: 'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?w=1200', 
    costOfLiving: 'SEK 12,000/mo', 
    visaRequirements: 'Residence Permit' 
  },
  { 
    id: 'finland', 
    countryId: 'fi', 
    slug: 'finland', 
    title: 'Study in Finland', 
    content: `Finland is ranked the happiest country in the world and home to arguably the best education system on the planet.
    
    ### 2025 Long-term Residence Permit
    Finland now issues one permit that covers the **entire duration of your degree**. You need to show roughly **€800 to €900 per month** for living costs.
    
    ### Universities of Applied Sciences (UAS) vs Research
    - **UAS:** Focus on practical, industry-connected skills.
    - **Research:** Focus on academic theory.
    
    ### Working While You Study: 30 Hours
    Finland is incredibly generous, allowing students to work an average of **30 hours per week** during the semester.
    
    ### The 2-Year Post-Study Work Visa
    Finland offers one of the longest stay-back periods in Europe—**two years** to find a job matching your degree.
    
    ### Student Benefits
    Healthy university meals cost about **€3.00**, and student housing foundations (HOAS/TOAS) offer rooms for **€350 - €500**.`,
    heroImage: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200', 
    costOfLiving: '€800/mo', 
    visaRequirements: 'Residence Permit' 
  },
  { 
    id: 'cyprus', 
    countryId: 'cy', 
    slug: 'cyprus', 
    title: 'Study in Cyprus', 
    content: `Cyprus is a Mediterranean hub offering EU-recognized degrees with a focus on Tech, Maritime, and Hospitality.
    
    ### Affordable European Experience
    Living costs range from **€700 to €900 per month**. Tuition fees are significantly lower than in Northern Europe or the UK.
    
    ### Work Rights
    International students can work up to **20 hours per week**. Cyprus is a tourism giant, offering massive internship opportunities in 5-star resorts during summer breaks.
    
    ### High-Demand List
    - Hospitality & Tourism Management
    - Maritime & Shipping (Limassol Hub)
    - Computer Science & Fintech
    - Medicine (Top-tier facilities, lower cost)
    
    ### The "Pink Slip"
    The Temporary Residence Permit is issued after arrival, following medical tests and bank guarantees.`,
    heroImage: 'https://images.unsplash.com/photo-1543233134-8c886659c03b?w=1200', 
    costOfLiving: '€700/mo', 
    visaRequirements: 'Cyprus Student Visa' 
  },
  { 
    id: 'dubai', 
    countryId: 'ae', 
    slug: 'dubai', 
    title: 'Study in Dubai', 
    content: `Dubai is an ultra-modern Knowledge Economy. It hosts "International Branch Campuses" from the UK, Australia, and USA (Heriot-Watt, Murdoch, etc.).
    
    ### The Dubai Edge
    You get the same degree certificate as students in London or Sydney but live in a tax-free hub closer to home.
    
    ### Simple 2025 Visa Process
    The university typically acts as your "sponsor," handling the bulk of the paperwork. A medical fitness test is required upon arrival.
    
    ### The "Golden Visa"
    Graduates with a high GPA (typically 3.75+) are eligible for a **10-Year Golden Visa**, providing long-term residency without a sponsor.
    
    ### Tax-Free Earnings
    There is no personal income tax in Dubai. Part-time roles in events, tech, and retail allow you to keep 100% of your earnings.
    
    ### High-Demand Careers
    Fintech, Blockchain, AI, Luxury Hospitality, and Logistics.`,
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', 
    costOfLiving: 'AED 5,000/mo', 
    visaRequirements: 'Student Residence Visa' 
  },
  { 
    id: 'malaysia', 
    countryId: 'my', 
    slug: 'malaysia', 
    title: 'Study in Malaysia', 
    content: `Malaysia is a top-10 global education hub offering Western degrees (Monash, Nottingham, Southampton) at 60-70% lower costs.
    
    ### The EMGS Digital Visa (e-VAL)
    The Student Pass process is nearly 100% digital. The **e-VAL** is typically approved in **14–21 working days**.
    
    ### Financial Requirement
    Demonstrate enough for first-year tuition plus roughly **USD $4,000 to $5,000** for living expenses.
    
    ### High-Demand Sectors
    Semiconductor Engineering, Islamic Finance, Data Science, and Digital Marketing.
    
    ### KL Budget Lifestyle
    Luxury condos with gyms and pools cost between **USD $150 and $350** a month. Local meals (Mamak) cost around **USD $2**.
    
    ### Strict Attendance
    To renew your permit, you must maintain at least **80% attendance** and a CGPA of at least 2.0.`,
    heroImage: 'https://images.unsplash.com/photo-1528277342758-f1d7613953a2?w=1200', 
    costOfLiving: 'RM 2,500/mo', 
    visaRequirements: 'Student Pass' 
  },
  { 
    id: 'turkey', 
    countryId: 'tr', 
    slug: 'turkey', 
    title: 'Study in Turkey', 
    content: `Turkey (Türkiye) is the bridge between Europe and Asia. As a full member of the **Bologna Process**, Turkish degrees are recognized across all of Europe.
    
    ### 2025 Intelligence
    - **Ikamet (Residence Permit):** The process is digitized; initial residency interviews are often conducted directly on campus.
    - **Financial Proof:** Show roughly **USD $5,000 to $7,000** for your first year.
    
    ### Turkiye Bursları Scholarships
    A highly competitive program covering **100% tuition**, monthly stipend, accommodation, and a one-year Turkish language course.
    
    ### High-Demand Careers
    Architecture, Civil Engineering, Medicine, and E-commerce (Trendyol/Getir hub).
    
    ### The "Denklik" Protocol
    UNICOU manages the mandatory diploma equivalence verification required by the Council of Higher Education (YÖK).`,
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: '₺15,000/mo', 
    visaRequirements: 'Education Visa' 
  },
  { 
    id: 'europe', 
    countryId: 'eu', 
    slug: 'europe', 
    title: 'Europe Hub', 
    content: `Explore hidden gems across Europe. The EU is making a massive push to attract global talent into specialized regional hubs.
    
    ### Rising Hotspots for 2025
    - **Poland:** Massive growth in IT and Engineering with very low living costs.
    - **Hungary:** World-famous English-taught medical and veterinary programs.
    - **Spain:** Top-tier private business schools and renewable energy hubs.
    - **France:** Specialized "Grande Écoles" for Engineering and Management.
    
    ### ETIAS and Digital Visas
    The Schengen Student Visa process is becoming digital, allowing for document uploads rather than heavy physical dossiers.
    
    ### Erasmus+ Secret
    International students at EU universities can apply for grants to spend a semester in another country—all funded by the EU!
    
    ### Post-Study Work
    France and Spain offer 12-month stay-back permits. Finding a professional role leads to the **EU Blue Card**, granting working rights across the Union.`,
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: 'Variable', 
    visaRequirements: 'EU National Visa' 
  }
];

export const universities: University[] = [
  { id: 'uni-manchester', name: 'University of Manchester', slug: 'manchester', location: 'Manchester, UK', ranking: 32, description: 'Global research powerhouse and member of the Russell Group.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' }
];

export const courses: Course[] = [
  { id: 'c-1', universityId: 'uni-manchester', degree: 'Postgraduate', title: 'MSc Advanced Computer Science', duration: '1 Year', tuitionFee: '$32,000', description: 'Deep tech specialization focusing on AI and scalable systems.' }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'pte-mastery', title: 'PTE Academic Mastery', description: 'Complete prep for Pearson Test of English Academic with AI-powered feedback simulation.', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', category: 'PTE', duration: '20 Hours', instructor: 'Dr. Jane Smith', price: 99, status: 'Paid' }
];

export const lmsModules: LMSModule[] = [
  { 
    id: 'm1-pte', 
    courseId: 'pte-mastery', 
    title: 'Module 1: Strategy & Architecture', 
    lessons: [
        { id: 'l1', title: 'PTE Introduction & Scoring Logic', type: 'Video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: 'l2', title: 'Academic Integrity Protocols', type: 'Text', content: '### Core Principles\n- Precision in response\n- Lexical variety\n- Grammatical range\n\nEnsure you follow the strict timing constraints for each node.' },
        { id: 'l3', title: 'Foundational Knowledge Quiz', type: 'Quiz', content: JSON.stringify([
            { id: 'q1', question: 'What does PTE stand for?', options: ['Pearson Test of English', 'Professional Testing Engine', 'Primary Teaching Exam'], correct: 0 }
        ])}
    ] 
  }
];

export const lmsTests: LMSPracticeTest[] = [
  { 
    id: 'full-mock-1', 
    title: 'IELTS/PTE Alpha Mock', 
    sections: [
        {
            id: 'sec-1',
            skill: 'Reading',
            title: 'Critical Content Analysis',
            timeLimit: 20,
            questions: [
                { id: 'q-r1', text: 'Select the primary tone of the academic abstract provided.', type: 'MCQ', options: ['Objective', 'Persuasive', 'Critical'], skill: 'Reading', maxScore: 1 }
            ]
        },
        {
            id: 'sec-2',
            skill: 'Writing',
            title: 'Reflective Essay Node',
            timeLimit: 40,
            questions: [
                { id: 'q-w1', text: 'Discuss the impact of AI on international education systems.', type: 'Essay', skill: 'Writing', maxScore: 9 }
            ]
        }
    ] 
  }
];

export const qualifications: Qualification[] = [
  { id: 'q-othm-3', title: 'OTHM Level 3 Diploma in Business', duration: '6 Months', qualificationBody: 'OTHM', tuitionFees: '$1,200', requirements: ['High School Certificate'], description: 'Foundation for business management and international mobility.', level: 'Level 3', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800' }
];

// Added missing immigrationGuides export to fix apiService error
export const immigrationGuides: ImmigrationGuideData[] = [];

export const initialEnrollments: Enrollment[] = [];
export const courseVouchers: CourseVoucher[] = [];
export const universityBySlug = (slug: string): University | null => universities.find(u => u.slug === slug) || null;
