import { Product, VoucherCode, User, University, Course, CountryGuide, LMSCourse, LMSModule, LMSPracticeTest, Enrollment, CourseVoucher, Qualification, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Admin / Owner', email: 'admin@nexus.ai', role: 'Admin' },
  { id: 'u-finance', name: 'Finance / Audit Team', email: 'finance@nexus.ai', role: 'Finance' },
  { id: 'u-manager', name: 'Operations Manager', email: 'manager@nexus.ai', role: 'Admin' },
  { id: 'u-trainer', name: 'Lead Trainer', email: 'trainer@nexus.ai', role: 'Trainer' },
  { id: 'u-support', name: 'Support / Sales Node', email: 'support@nexus.ai', role: 'Admin' },
  { id: 'u-agent', name: 'Agent Partner / Prep Center', email: 'partner@nexus.ai', role: 'Agent', tier: 2 },
  { id: 'u-student', name: 'Alex Smith (Student)', email: 'alex@gmail.com', role: 'Customer' },
];

export const products: Product[] = [
  { id: 'v-1', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', description: 'Standard British Council/IDP Academic training voucher.', icon: '🌐' },
  { id: 'v-2', name: 'IELTS General Training', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', description: 'Standard IELTS General training voucher for migration.', icon: '🌐' },
  { id: 'v-6', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', description: 'Pearson Test of English Academic standard voucher.', icon: '📊' },
  { id: 'v-10', name: 'LanguageCert SELT B1', category: 'LanguageCert', type: 'Voucher', basePrice: 155, currency: 'USD', description: 'Secure English Language Test (SELT) for UKVI.', icon: '⚡' },
  { id: 'v-11', name: 'LanguageCert SELT B2', category: 'LanguageCert', type: 'Voucher', basePrice: 175, currency: 'USD', description: 'Advanced SELT assessment for University Tier 4.', icon: '⚡' },
  { id: 'v-17', name: 'Skills for English SELT', category: 'Skills for English', type: 'Voucher', basePrice: 160, currency: 'USD', description: 'PSI Skills for English UKVI compliant voucher.', icon: '🛡️' },
  { id: 'v-19', name: 'TOEFL iBT Official', category: 'TOEFL', type: 'Voucher', basePrice: 195, currency: 'USD', description: 'ETS TOEFL iBT Official Global voucher.', icon: '🌎' },
  { id: 'v-20', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 60, currency: 'USD', description: 'Duolingo English Test Global Access.', icon: '🦉' },
  { id: 'v-21', name: 'Oxford ELLT Digital', category: 'ELLT', type: 'Voucher', basePrice: 85, currency: 'USD', description: 'Oxford International Digital English Test.', icon: '🏫' },
  { id: 'v-22', name: 'Password Skills Plus', category: 'OTHER', type: 'Voucher', basePrice: 95, currency: 'USD', description: 'Password Skills Plus Global assessment node.', icon: '🔑' }
];

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in United Kingdom', 
    content: `Are you dreaming of walking through the historic campuses of Oxford, London, Manchester, Birmingham, Glasgow, Cardiff, Belfast? The United Kingdom remains one of the world's premier destinations for higher education, offering a blend of tradition, innovation, and global career opportunities. However, as we move into 2025 and look toward 2026, the landscape for international students is shifting.

At **UniCou**, we understand that navigating visa changes and university applications can feel overwhelming. That is why we have put together this comprehensive guide to help you understand exactly what it takes to study in the UK today.

### Why Study in the UK in 2025?
The UK’s reputation for academic excellence is unmatched. With a degree from a UK institution, you aren't just getting an education; you are gaining a globally recognized credential.
- Shorter Course Durations: Most UK Bachelor's take 3 years, Masters take 1 year. Saves time and tuition.
- World-Class Research: Forefront of global innovation, especially in AI and Healthcare.
- Cultural Diversity: Community from over 180 countries.

### The Latest 2025/2026 UK Student Visa Rules
The UK government has introduced several important updates. Staying compliant with these **UK study visa requirements** is the key to success.

### 1. Increased Financial Maintenance Requirements
As of **November 11, 2025**, the Home Office has increased the maintenance amount.
- Studying in London: You now need to demonstrate **£1,529 per month** (for up to 9 months).
- Studying Outside London: You need to show **£1,171 per month** (for up to 9 months).
Funds must be held for **28 consecutive days** before submission.

### 2. English Language Requirements
For **below degree-level courses**, you must choose a **Secure English Language Test (SELT)**: IELTS for UKVI, PTE Academic UKVI, LanguageCert SELT, or PSI Skills for English.
For **degree-level programs**, institutions accept a wider range of "non-SELT" options:
- Oxford ELLT Digital
- LanguageCert ESOL (Online)
- Password Skills Plus
- Duolingo English Test (Specific University list)

### 3. Transition to eVisas
The UK has fully transitioned to **eVisas**. You will now access and prove your immigration status online through a secure UKVI account.

### Top Courses in Demand
- Computer Science & AI: Massive demand for specialists.
- Healthcare & Nursing: Reliable pathway to visa sponsorship.
- Renewable Energy Engineering: Surge in job openings for Net Zero tech.

### Post-Study Work: The Graduate Route
The **Graduate Route visa** allows you to work for **2 years** after a degree (3 years for PhD).
**Important Change:** For applications on or after **January 1, 2027**, the period for non-PhD graduates will be reduced to **18 months**.

Ready to take the first step? All forms are directed to **connect@unicou.uk** for immediate fulfillment.`,
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,171 - £1,529/mo', 
    visaRequirements: 'Student Visa (eVisas Active)' 
  },
  { 
    id: 'australia', 
    countryId: 'australia', 
    slug: 'australia', 
    title: 'Study in Australia', 
    content: `G’day, future leaders! Australia is undergoing its biggest immigration transformation in a decade. At **UniCou Ltd**, we simplify the noise to provide a clear roadmap to your Australian dream.

### Why Choose Australia?
In 2025/2026, the focus is on **employability**. 
- Rankings: Multiple universities in the global Top 100.
- Lifestyle: Perfect balance to prevent student burnout.
- Post-Study: Refined 485 visa structure for international experience.

### The 2025/2026 National Planning Level (Enrollment Caps)
The Australian government now sets a cap on new international student commencements. Competition is fierce; you must apply **8 to 10 months in advance** to secure your spot.

### Mastering the Genuine Student (GS) Requirement
The **Genuine Student (GS) requirement** is now the heartbeat of your application. You must articulate:
- Course Value: Why this specific course is better than options back home.
- Incentives to Return: Long-term plans in your home country.
- Specificity: Be precise about modules and target employers.

### Financial Capacity Requirements
As of late 2025, students must demonstrate proof of approximately **AUD $30,000+** for living expenses, plus tuition and travel.

### English Language Standards
- Student Visa (Subclass 500): Minimum IELTS 6.0.
- Post-Study Work Visa: Minimum IELTS 6.5.

### High-Demand Courses for PR
- Healthcare & Nursing: Priority state-sponsored visas.
- Green Energy Engineering: Vacuum for skilled engineers.
- Cybersecurity & AI: Fast-tracked skilled migration.

Ready to take the first step? Connect with us via **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: 'AUD $2,500/mo', 
    visaRequirements: 'Subclass 500' 
  },
  { 
    id: 'canada', 
    countryId: 'canada', 
    slug: 'canada', 
    title: 'Study in Canada', 
    content: `Canada in 2025/2026 has shifted toward **quality over quantity**. While rules are stricter, rewards for high-quality students are greater than ever.

### Why Choose Canada?
- Academic Prestige: Globally held in high regard for STEM and Healthcare.
- Quality of Life: Consistently top 10 for safety and healthcare.
- Bilingual Advantage: Edge in global markets with English/French.

### The 2025/2026 Study Permit Caps (PAL System)
Most students now require a **Provincial Attestation Letter (PAL)**. Quotas are limited; speed is essential to secure your provincial spot.

### Updated Financial Requirements
For 2025/2026, a single applicant must show at least **CAD $20,635** for living costs, plus first-year tuition. The **Guaranteed Investment Certificate (GIC)** remains the preferred proof method.

### PGWP Changes
Post-Graduation Work Permit eligibility is now aligned with labor demand.
- College Graduates: Must link to a "long-term shortage" occupation.
- University Graduates: Currently remain exempt from field-of-study restrictions.

### The "Dual Intent" Strategy
IRCC explicitly recognizes **"Dual Intent"**. You can state you want to study and eventually apply for PR, provided you show intent to leave if the visa expires.

### Top Courses
- Healthcare & Nursing
- Skilled Trades (Construction, Electrical)
- STEM (AI, Cybersecurity, Data Science)

Ready to start? Registration hub synced to **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: 'CAD $1,800/mo', 
    visaRequirements: 'Study Permit (SDS/Non-SDS)' 
  },
  { 
    id: 'new-zealand', 
    countryId: 'new-zealand', 
    slug: 'new-zealand', 
    title: 'Study in New Zealand', 
    content: `Kia Ora! New Zealand is a place where innovation and student well-being come first. For 2025/2026, policies focus on **sustainable careers and global citizenship**.

### Why Choose New Zealand?
- 8-University Excellence: All are in the global top 3%.
- Work-Ready: The "Te Pūkenga" model provides practical industry-aligned learning.
- Green Careers: Leader in Environmental and Renewable Energy studies.

### 2025/2026 Student Visa Rules
- Financial Maintenance: You must demonstrate at least **NZD $20,000 per year** for living costs.
- English Standards: IELTS 6.0/6.5 common; LanguageCert ESOL also accepted.

### The Green List (Path to Residency)
This list contains "Hard-to-Fill" roles with fast-tracked residency.
- Construction & Engineering: Massive demand for infrastructure.
- Healthcare: Registered nurses and GPs are top priority.
- ICT & Software: Tech ecosystem looking for developers.

### Post-Study Work Rights
- Level 7+ (Degrees): Generally eligible for a **3-year Post-Study Work Visa**.
- Below Degree: Only eligible if the qualification is on the Green List.

Ready to take the first step? All forms processed at **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1469521669194-b785a1131b20?w=1200', 
    costOfLiving: 'NZD $20,000/yr', 
    visaRequirements: 'Fee-Paying Student Visa' 
  },
  { 
    id: 'usa', 
    countryId: 'usa', 
    slug: 'usa', 
    title: 'Study in USA', 
    content: `Hello, innovators! The U.S. remains the undisputed "Land of Opportunity". In 2025/2026, the strategy focuses on **high-tech labor needs** and digital visa streamlining.

### Why Choose the USA?
- Academic Flexibility: "Liberal Arts" philosophy allows course tailoring.
- STEM Powerhouse: Global epicenter for research and AI.
- Campus Culture: Designed to build leadership outside the classroom.

### The 2025/2026 F-1 Student Visa
- Digital I-20s: Most universities now issue digital forms instantly.
- Financial Proof: You must cover **one full year** of all costs with liquid funds.
- Interview Scrutiny: "Student Intent" is critical; mock interviews are recommended.

### STEM OPT: The 3-Year Advantage
The biggest draw for the USA is **Optional Practical Training (OPT)**.
- Standard: 12 months.
- STEM Extension: Additional 24 months.
- Total: **3 years** to work for U.S. giants without an H-1B.

### The Community College "2+2" Pathway
A major trend: spend 2 years at a Community College (50% less tuition) and transfer to a top university (UCLA, NYU) for the final 2 years.

### High-Growth Courses
- AI & Machine Learning: Highest starting salaries.
- Cybersecurity: Recession-proof roles.
- Sustainability: Massive federal grants for green engineering.

Ready to take the first step? Connect to the hub at **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', 
    costOfLiving: 'USD $1,500/mo', 
    visaRequirements: 'F-1 Student Visa' 
  },
  { 
    id: 'ireland', 
    countryId: 'ireland', 
    slug: 'ireland', 
    title: 'Study in Ireland', 
    content: `Fáilte! Ireland is the only English-speaking country in the Eurozone and a strategic gateway to European tech and pharma.

### Why Choose Ireland in 2025/2026?
- Tech Hub: HQ for 1,000+ multinationals (Google, Meta, Pfizer).
- Research: Universities ranked in top 1% for research worldwide.
- Safety: Frequently ranked among the safest and friendliest globally.

### 2025/2026 Student Visa (Stamp 2) Rules
- Financial Proof: You must demonstrate at least **€12,000 per year** for living expenses.
- Medical Insurance: Mandatory private insurance covering at least €25,000.

### The 1G Graduate Visa
- Master's & PhD: Eligible for a **2-year stay-back visa**.
- Bachelor's: Eligible for a **1-year stay-back visa**.
Transition into the **Critical Skills Employment Permit** for PR.

### High-Demand Courses
- Data Science & AI: Record-high demand in Dublin tech hub.
- Pharmaceutical Sciences: Ireland is the 3rd largest exporter.
- FinTech: Demand for graduates bridging finance and blockchain.

### Working While You Study
International students can work **20 hours/week** (40 hours during holidays). Ireland’s high minimum wage helps cover costs.

Ready to take the first step? Forms processed via **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200', 
    costOfLiving: '€1,000/mo', 
    visaRequirements: 'Stamp 2 Visa' 
  },
  { 
    id: 'cyprus', 
    countryId: 'cyprus', 
    slug: 'cyprus', 
    title: 'Study in Cyprus', 
    content: `Cyprus offers a booming Mediterranean hub with recognized EU degrees. Get the "European experience" without the freezing winters or high tuition.

### Why Cyprus for 2025/2026?
- EU Recognized: Degrees valid across the entire European Union.
- Safe & Sunny: One of the safest countries with a vacation vibe.
- Best Value: Modern universities with significantly lower costs.

### 2025/2026 Visa Protocols
- Digital Verification: Academic documents verified digitally for speed.
- The "Pink Slip": Temporary Residence Permit applied for upon arrival.
- Financial Proof: Bank balance of roughly **€7,000 to €8,000** required.

### Work Rights
Students are generally allowed to work **20 hours per week**. Cyprus is a massive tourism hub; summer breaks offer full-time work in luxury resorts.

### High-Demand Courses
- Hospitality & Tourism Management: Internships in 5-star hotels.
- Maritime & Shipping: Limassol is a global shipping powerhouse.
- Fintech: Cyprus is branding itself as the "Tech Island".

### The Erasmus+ Secret
Access the **Erasmus+ program** to spend a semester in Italy or Germany while paying Cyprus-level tuition.

Ready to take the first step? Initialize registry at **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=1200', 
    costOfLiving: '€700/mo', 
    visaRequirements: 'National Student Visa' 
  },
  { 
    id: 'germany', 
    countryId: 'germany', 
    slug: 'germany', 
    title: 'Study in Germany', 
    content: `Germany is the engine of Europe. Public universities offer near-zero tuition, while private institutions bridge the gap to high-tier careers.

### Public vs. Private
- Public: Tuition-free but highly competitive; often requires German proficiency.
- Private: Charging fees but more flexible; many English-taught programs.

### The "Blocked Account" (Sperrkonto) 2025/2026
You must deposit roughly **€11,904 to €12,200** in a mandatory account to prove you can support yourself for the year.

### The 18-Month Job Seeker Visa
Upon graduation, you can stay for **18 months** to look for a professional role. Switch to the **Blue Card (EU)** for fast-track residency.

### Working While You Study
Generous work rights: **140 full days or 280 half days** per year. Finding a "Minijob" or "Werkstudent" role is easier than ever.

### High-Demand Fields
- Engineering: Civil, Mechanical, and Electrical.
- IT & Cybersecurity: Desperate need for data scientists.
- Renewable Energy: Leader in "Energiewende" (Energy Transition).

Ready to take the first step? All applications synced to **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€934/mo', 
    visaRequirements: 'National Visa (Type D)' 
  },
  { 
    id: 'italy', 
    countryId: 'italy', 
    slug: 'italy', 
    title: 'Study in Italy', 
    content: `Italy is the secret to an affordable, world-class European education. Public university tuition is based on family income, not a fixed high rate.

### Income-Based Tuition (ISEE)
For 2025/2026, tuition ranges from **€500 to €3,000 per year** for many students. We guide you through the ISEE documentation.

### Scholarships: The DSU Advantage
Regional scholarships (DSU) based on financial need can provide:
- Zero tuition fees.
- One free meal a day.
- Yearly stipend of **€5,000 to €7,000**.

### Pre-Enrollment & Universitaly Portal
Must complete a Pre-Enrollment request on the Universitaly portal. One mistake can lead to rejection; UniCou manages this for you.

### Entrance Exams
Competitive tests like **IMAT** (Medicine) or **TOLC** (Engineering) happen once a year.

### Italian Student Visa (Type D)
Show financial means of roughly **€6,500 to €7,500** for the year. Proof of accommodation is critical in busy cities like Milan.

Ready to take the first step? Registry hub: **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200', 
    costOfLiving: '€800/mo', 
    visaRequirements: 'National Visa (Type D)' 
  },
  { 
    id: 'sweden', 
    countryId: 'sweden', 
    slug: 'sweden', 
    title: 'Study in Sweden', 
    content: `Sweden is the land of innovation and sustainability. In 2025/2026, Swedish universities are doubling down on **Sustainable Innovation** across all sectors.

### The Swedish Way: "Lagom"
Collaborative learning where you solve real-world problems. Informal culture; professors encouraged to be mentors.

### Residence Permit & Financials
Must show roughly **SEK 10,500 to 11,000 per month** (approx. €1,000) for your stay. Funds must be "at your disposal" in your own account.

### The "One Portal" Admissions
Apply for up to four programs nationwide via UniversityAdmissions.se. Deadlines are **early** (mid-January for August intake).

### 2025/2026 Scholarships
- SI Global Professionals: Covers full tuition and living costs.
- University-Specific: Waivers ranging from 25% to 75%.

### Work Rights
No official hour limit for students! However, courses are intense, so 10-15 hours/week is recommended.

### High-Demand Careers
- Battery Tech & Green Energy: Gigafactories in northern Sweden.
- IT & Spotify ecosystem: Stockholm produces more unicorns per capita.

Ready to take the first step? Registry: **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?w=1200', 
    costOfLiving: 'SEK 10,500/mo', 
    visaRequirements: 'Residence Permit' 
  },
  { 
    id: 'finland', 
    countryId: 'finland', 
    slug: 'finland', 
    title: 'Study in Finland', 
    content: `Welcome to the world's happiest country and arguably its best education system. In 2025/2026, Finland is focusing on **"Future Skills"**.

### The Finnish Classroom
Informal and empowering. Equality is the motto; memortization is replaced by problem-solving.

### The 2025/2026 Long-term Residence Permit
One permit now covers the **entire duration of your degree**. No need to renew every year.
- Financial proof: Roughly **€800 to €900 per month**.

### Join Application System
Studyinfo.fi manages all applications. Main window is **January 2026** for autumn intake.
- Research Universities vs Universities of Applied Sciences (UAS).

### Tuition & "Early Bird" Deals
- Fees: **€6,000 to €15,000** per year.
- Early Bird: Pay within 2-3 weeks of offer for significant discounts.

### 2-Year Post-Study Work Visa
One of the longest stay-back periods in Europe. Direct path to residency and citizenship.

Ready to take the first step? Initialize via **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?w=1200', 
    costOfLiving: '€900/mo', 
    visaRequirements: 'Residence Permit' 
  },
  { 
    id: 'dubai', 
    countryId: 'dubai', 
    slug: 'dubai', 
    title: 'Study in Dubai', 
    content: `Dubai is your launchpad to a global career in the city of the future. In 2025/2026, it is a leading "Knowledge Economy".

### International Branch Campuses
Study at UK/Australian giants like **Heriot-Watt** or **Murdoch** right in Dubai. Same certificate, lower cost, tax-free hub.

### Efficient Visa Sponsorship
The university acts as your sponsor.
- Medical Fitness Test: Quick check once you arrive.
- Proof of Funds: More flexible than the West.

### The 10-Year Golden Visa
For "Outstanding Students" with a high GPA (3.75+). Long-term residency without a sponsor.

### Working While You Study
International students can take internships with an NOC from the university.
**No Personal Income Tax:** What you earn is what you keep.

### High-Demand Sectors
- Fintech & Blockchain
- Luxury Hospitality
- AI & Ministry of what's next.

Ready to take the first step? All forms processed via **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', 
    costOfLiving: 'AED 3,500/mo', 
    visaRequirements: 'Student Residence Visa' 
  },
  { 
    id: 'malaysia', 
    countryId: 'malaysia', 
    slug: 'malaysia', 
    title: 'Study in Malaysia', 
    content: `Malaysia is a top-10 global hub. Earn a degree from a top-tier UK or Australian university while living in the vibrant tropics.

### The "Branch Campus" Hack
Monash, Nottingham, and Southampton have major campuses here. Get the exact same certificate for **70% lower cost**.

### 2025/2026 e-VAL Process
Fully digital EMGS visa approval letter.
- Approval Time: Typically **14-21 working days**.
- Proof of funds: Show roughly **USD $5,000** for living costs.

### Working Conditions
Work part-time (20 hours) during breaks. Many students land stipends from tech firms in **Cyberjaya** (Silicon Valley).

### Critical Pitfalls
- Attendance: Must maintain **80% attendance** to renew student pass.
- MQA: UniCou only works with **MQA-accredited** institutions.

Ready to take the first step? Synchronize via **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200', 
    costOfLiving: 'USD $500/mo', 
    visaRequirements: 'Student Pass (e-VAL)' 
  },
  { 
    id: 'turkey', 
    countryId: 'turkey', 
    slug: 'turkey', 
    title: 'Study in Turkey', 
    content: `Turkey is a full member of the European Higher Education Area (Bologna Process). European standards with a Mediterranean soul.

### 2025/2026 Ikamet Rules
The Student Residence Permit (Ikamet) process is now digitized for speed.
- Show roughly **USD $5,000 to $7,000** for the first year.
- Interviews often completed directly on campus for larger universities.

### High-Demand Careers
- Architecture & Civil Engineering: Turkey builds the world's landmarks.
- Medicine: "Health Tourism" is booming; billion-dollar investments in hospitals.

### Turkiye Scholarships (Bursları)
One of the world's most comprehensive programs:
- 100% Tuition + Monthly Stipend + Accommodation + Health Insurance.

### "Cultural Intelligence"
Your professional network will include friends from Europe, Africa, and Central Asia. Diversity is your greatest asset in 2025/2026.

Ready to take the first step? Initial registry at **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: 'USD $400/mo', 
    visaRequirements: 'Student Residence Permit' 
  },
  { 
    id: 'europe', 
    countryId: 'europe', 
    slug: 'europe', 
    title: 'Study in Europe Hub', 
    content: `Access the wider Schengen area via underrated "hidden gems". Poland, Hungary, and Spain offer elite-value education for 2025/2026.

### Underrated Hotspots
- Poland: Rising star for Engineering; 40% cheaper than the West.
- Hungary: Best-value destination for Medicine and Dentistry.
- Spain: Top-tier network of global business schools.

### The Blue Card (EU)
If you find a job with a certain salary threshold, transition to the Blue Card for working rights across most of the European Union.

Ready to take the first step? All registry entries directed to **connect@unicou.uk**.`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: 'Variable', 
    visaRequirements: 'Schengen Student Route' 
  },
];

export const voucherCodes: VoucherCode[] = [
  ...Array(50).fill(0).map((_, i) => ({ id: `v1-${i}`, productId: 'v-1', code: `IL-AC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, status: 'Available' as const, expiryDate: '2026-01-01' })),
];

export const universities: University[] = [
  { id: 'uni-manchester', name: 'University of Manchester', slug: 'manchester', location: 'Manchester, UK', ranking: 32, description: 'Global research powerhouse.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' }
];

export const courses: Course[] = [
  { id: 'c-1', universityId: 'uni-manchester', degree: 'Postgraduate', title: 'MSc Advanced Computer Science', duration: '1 Year', tuitionFee: '$32,000', description: 'Deep tech specialization.' }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'pte-mastery', title: 'PTE Academic Mastery', description: 'Complete prep for Pearson Test of English.', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', category: 'PTE', duration: '20 Hours', instructor: 'Dr. Jane Smith', price: 99, status: 'Paid' }
];

export const lmsModules: LMSModule[] = [
  { id: 'm1-pte', courseId: 'pte-mastery', title: 'Module 1: Strategy', lessons: [] }
];

export const lmsTests: LMSPracticeTest[] = [
  { id: 'full-mock-1', title: 'IELTS/PTE Alpha Mock', sections: [] }
];

export const qualifications: Qualification[] = [
  { id: 'q-othm-3', title: 'OTHM Level 3 Diploma in Business', duration: '6 Months', qualificationBody: 'OTHM', tuitionFees: '$1,200', requirements: ['High School Certificate'], description: 'Foundation for business management.', level: 'Level 3', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800' }
];

export const initialEnrollments: Enrollment[] = [];
export const courseVouchers: CourseVoucher[] = [];
export const immigrationGuides: ImmigrationGuideData[] = [];
export const universityBySlug = (slug: string): University | null => universities.find(u => u.slug === slug) || null;