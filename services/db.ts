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
    title: 'Study in United Kingdom', 
    content: `Are you dreaming of walking through the historic campuses of Oxford, London, Manchester, Birmingham, Glasgow, Cardiff, Belfast? The United Kingdom remains one of the world's premier destinations for higher education, offering a blend of tradition, innovation, and global career opportunities. However, as we move into 2025 and look toward  , the landscape for international students is shifting.

At UniCou, we understand that navigating visa changes and university applications can feel overwhelming. That is why we have put together this comprehensive guide to help you understand exactly what it takes to study in the UK today.

### Why Study in the UK in 2025?
The UK’s reputation for academic excellence is unmatched. With a degree from a UK institution, you aren't just getting an education; you are gaining a globally recognized credential. In 2025, several factors continue to make the UK a top choice:
- **Shorter Course Durations:** Unlike many other countries, most UK Bachelor’s degrees take only three years, and Master’s degrees are typically completed in just one year. This saves you both time and tuition costs.
- **World-Class Research:** UK universities are at the forefront of global innovation, especially in AI, renewable energy, and healthcare.
- **Cultural Diversity:** You will join a vibrant community of students from over 180 countries, building a global network that will last a lifetime.

### The Latest 2025/  UK Student Visa Rules
The UK government has introduced several important updates that you need to be aware of before applying. Staying compliant with these UK study visa requirements is the key to a successful application.

### 1. Increased Financial Maintenance Requirements
As of November 11, 2025, the Home Office has increased the amount of money you must show to cover your living costs.
- **Studying in London:** You now need to demonstrate £1,529 per month (for up to 9 months).
- **Studying Outside London:** You need to show £1,171 per month (for up to 9 months).
These funds must be held in your bank account for at least 28 consecutive days before you submit your application.

### 2. English Language Requirements
Confirmation of Acceptance for Studies (CAS) in 2025, the English language requirements differ strictly based on the level of your course and the institution's status. For below degree-level courses (such as Foundation, Pathway, or Diploma programs), the UK Home Office mandates a Secure English Language Test (SELT) taken at an approved physical test center. In these cases, you must choose from the official SELT list: IELTS for UKVI, PTE Academic UKVI, LanguageCert International ESOL SELT, PSI (Skills for English UKVI), or Trinity College London (ISE/GESE). Unlike degree-level students, those on below-degree programs cannot typically use MOI or internal university tests to satisfy visa requirements.

For students applying to degree-level programs or higher, UK Higher Education Institutions (HEIs) have the flexibility to accept a wider range of online and home-based English exams. These "non-SELT" options are increasingly popular due to their convenience, though acceptance varies by university. Common online and home-based exams accepted for CAS issuance in 2025 include:
- Oxford ELLT (English Language Level Test) Digital
- LanguageCert ESOL (Online with remote proctoring)
- Password Skills Plus
- TOEFL iBT Home Edition (Note: Accepted by universities via self-assessment, but not a SELT)
- IELTS Online
- PTE Academic Online
- Duolingo English Test (DET) (Accepted by a specific list of UK universities)
- University Internal English Tests (In-house assessments designed by specific institutions)

While these online tests are excellent for securing a CAS for degree-level studies, it is vital to confirm that your university is a Student Sponsor with a track record of compliance, as this status allows them to "self-assess" your English proficiency using these non-SELT methods. Always verify with your Education Consultancy or the university's admissions office before booking a home-based exam to ensure it meets the specific criteria for your 2025 enrollment.

### 3. Transition to eVisas
Say goodbye to the physical Biometric Residence Permit (BRP). The UK has fully transitioned to eVisas. You will now access and prove your immigration status online through a secure UKVI account.

### Top Courses in Demand for 2025
Choosing the right course is about balancing your passion with future employability. In the current UK job market, several fields stand out:
- **Computer Science & AI:** With the UK investing billions in tech innovation, specialists in AI, cybersecurity, and data science are in massive demand.
- **Healthcare & Nursing:** The NHS continues to face staffing shortages, making healthcare degrees a reliable pathway to visa sponsorship.
- **Renewable Energy Engineering:** As the UK pushes for "Net Zero," engineers specializing in green technology are seeing a surge in job openings.
- **Business Analytics & FinTech:** London remains a global financial hub, and the demand for graduates who can bridge the gap between finance and technology is at an all-time high.

### Post-Study Work: The Graduate Route Update
One of the most frequent questions we get is: "Can I stay and work in the UK after I graduate?" The answer is yes, but with updated timelines.
Currently, the Graduate Route visa allows you to stay and work (at any skill level) for 2 years after a Bachelor’s or Master’s degree, or 3 years after a PhD.
**Important Change:** For applications made on or after January 1, 2027, the post-study work period for non-PhD graduates will be reduced to 18 months. If you are planning to start your studies in late 2025 or  , you must plan your career timeline carefully to maximize this window.

### Common Mistakes to Avoid in Your Visa Application
Applying for a UK student visa requires precision. Even small errors can lead to a rejection. Here are the most common pitfalls we see:
- **Last-Minute Funding:** Moving large sums of money into your account just before applying is a major "red flag." Ensure your funds are stable for the full 28-day period.
- **Expired CAS:** Your Confirmation of Acceptance for Studies (CAS) is only valid for six months. Don't wait until the last minute to apply.
- **Incomplete TB Testing:** If you are from a country that requires a Tuberculosis (TB) test, ensure you visit a UKVI-approved clinic.

### How UniCou Can Help You
At UniCou, we are more than just agents; we are your partners in success. Our team stays updated on every policy change to ensure your journey to the UK is smooth and stress-free. We provide:
- Personalized University Selection
- Visa Application Support
- Scholarship Guidance

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,171 - £1,529/mo', 
    visaRequirements: 'Student Visa (eVisas Active)' 
  },
  { 
    id: 'australia', 
    countryId: 'australia', 
    slug: 'australia', 
    title: 'Study in Australia', 
    content: `G’day, future leaders! If you are looking for a destination that combines world-class education with an outdoor lifestyle that is second to none, Australia is likely at the top of your list. From the bustling tech hubs of Sydney and Melbourne to the stunning coastlines of Perth and Brisbane, the "Land Down Under" is more than just a place to get a degree it is a place to launch a global career.
However, if you have been following the news in 2025, you know that Australian immigration is undergoing its biggest transformation in a decade. At UniCou Ltd, we are here to simplify the noise and provide you with a clear, honest roadmap to your Australian dream.

### Why Choose Australia?
Despite the recent policy shifts, Australia remains a global powerhouse in education. In  , the focus is on employability. Australian universities have integrated industry placements into almost every degree, ensuring you don't just graduate with a certificate, but with a professional network.
- **Rankings and Reputation:** Australia continues to host multiple universities in the global Top 100, recognized for excellence in Engineering, Healthcare, and Business.
- **The Lifestyle Factor:** Whether you enjoy surfing, hiking, or exploring cosmopolitan cities, Australia offers a balance that prevents student burnout.
- **Post-Study Opportunities:** With a refined 485 visa structure in  , Australia remains one of the best places to gain international work experience.

### The National Planning Level (Enrollment Caps)
The most significant change for  is the National Planning Level (NPL). The Australian government now sets a cap on the number of new international student commencements across the country.
Because universities have a limited number of spots for international students, competition will be fierce. You can no longer afford to apply at the last minute. To secure your spot for the  intake, you should aim to have your application submitted at least 8 to 10 months in advance.

### Mastering the Genuine Student (GS) Requirement
Gone are the days of the generic GTE essay. In  , the Genuine Student (GS) requirement is the heartbeat of your visa application. The Department of Home Affairs now uses targeted questions to assess your intentions.
When you work with UniCou Ltd, we help you articulate:
- **Course Value:** Why is this specific course better for your career than options available in your home country?
- **Incentives to Return:** What are your long-term plans back home?
- **Circumstances:** A clear explanation of any study gaps or career changes.
Pro Tip: In  , "vague" is the enemy. Be specific about the modules you want to study and the companies you plan to work for after graduation.

### New Financial Capacity Requirements
To ensure students can focus on their studies without financial hardship, the minimum "show money" has been adjusted for inflation. As of late 2025 heading into  , students must demonstrate proof of approximately AUD $30,000+ for living expenses, in addition to their tuition fees and travel costs.
UniCou Ltd ensures that your financial documentation is "visa-ready." We help you verify that your funds have been held for the required duration and that your sources of income are transparent and verifiable.

### English Language Standards: The Benchmark
English proficiency requirements have stabilized at a higher level in  to ensure academic success.
- **Student Visa (Subclass 500):** Minimum IELTS 6.0 (or equivalent).
- **ELICOS Pathways:** Minimum IELTS 5.0.
- **Post-Study Work Visa:** Minimum IELTS 6.5.

### High-Demand Courses for PR and Careers
If your goal is to transition from a student to a permanent resident (PR), your choice of course is critical.
- **Healthcare & Nursing:** Registered nurses and midwives remain at the top of the priority list for state-sponsored visas.
- **Early Childhood Education:** With a massive shortage of teachers, this is a very high-prospect path for international students.
- **Green Energy Engineering:** Australia’s push toward solar and wind energy has created a vacuum for skilled engineers.
- **Cybersecurity & AI:** As digital threats grow, tech specialists are being fast-tracked in the skilled migration streams.

### Post-Study Work Rights (Subclass 485)
- **Bachelor/Master’s Graduates:** Typically 2 years of work rights.
- **Regional Advantage:** If you study at a regional campus (like in Adelaide, Perth, or Hobart), UniCou Ltd can help you apply for an additional 1-2 years of work rights.

### Common Visa Pitfalls to Avoid
- **"Course Hopping":** Switching to a lower-level vocational course after arriving on a university visa is now extremely difficult.
- **Incomplete Documentation:** Missing a single bank statement or a health check can lead to months of delays.
- **Generic Statements:** If your application looks like a "copy-paste" from a website, it will be flagged.

### How UniCou Ltd Makes the Difference
Navigating the  Australian migration landscape alone is risky. UniCou Ltd acts as your professional shield and strategist. We provide:
- **University Shortlisting:** Matching your budget and grades to the best available caps.
- **GS Strategy Sessions:** We interview you just like a visa officer would.
- **Scholarship Hunting:** Many Australian universities offer "Regional Support" or "Academic Excellence" scholarships worth up to 25% of tuition.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: 'AUD 2,500/mo', 
    visaRequirements: 'Subclass 500 Student Visa' 
  },
  { 
    id: 'canada', 
    countryId: 'canada', 
    slug: 'canada', 
    title: 'Study in Canada', 
    content: `G’day, future leaders! If you are dreaming of world-class education paired with an unmatched lifestyle, Canada is likely calling your name. From the vibrant cities to the breathtaking landscapes, Canada is more than just a destination it’s a global launchpad.
However, as we look toward  , the landscape for international students has changed significantly. The Canadian government has shifted its focus toward "quality over quantity." At UniCou Ltd, we believe that while the rules are stricter, the rewards for high-quality students are greater than ever.

### Why Choose Canada?
Despite the new regulations, Canada remains a top-tier destination. In  , the focus has shifted toward high-value education.
- **Academic Prestige:** Canadian degrees are held in high regard globally, particularly in STEM, Healthcare, and Sustainable Technology.
- **Quality of Life:** Canada consistently ranks in the top 10 globally for safety, healthcare, and environmental quality.
- **Bilingual Advantage:** Studying in a country with two official languages (English and French) gives you a competitive edge.
- **Pathways to Residency:** While the rules have tightened, Canada still prioritizes international graduates for its economic immigration programs.

### The Study Permit Caps and PAL System
The most important update for  is the continuation of the National Study Permit Cap. To manage housing and infrastructure, the Canadian government (IRCC) has limited the number of new study permits issued each year.
Most students now require a Provincial Attestation Letter (PAL) from the province where they intend to study. Each province has a specific quota. At UniCou Ltd, we emphasize that speed is your best friend.

### Updated Financial Requirements
To ensure you can afford the cost of living in Canada without struggling, the IRCC has significantly increased the "Cost of Living" requirement. For  applications, a single applicant must show they have at least CAD $20,635 (plus first-year tuition and travel costs).
UniCou Ltd specializes in financial auditing for students. We help you prepare your Guaranteed Investment Certificate (GIC), which is the preferred method for proving financial stability.

### Post-Graduation Work Permit (PGWP) Changes
The rules for staying in Canada after graduation have become more specific in  . The government now aligns PGWP eligibility with labor market demands.
- **Field of Study Requirement:** If you are graduating from a college program, your field of study must be linked to a "long-term shortage" occupation to be eligible for a PGWP.
- **University Graduates:** Graduates from Bachelor’s, Master’s, and Doctoral programs currently remain exempt from these specific field-of-study restrictions.
- **Language Proficiency:** In  , you must prove English or French proficiency to apply for your PGWP.

### Top Courses for Career Growth and PR
- **Healthcare & Nursing:** Canada is fast-tracking visas for those in nursing, medicine, and specialized care.
- **Skilled Trades:** Construction, plumbing, and electrical engineering are in massive demand.
- **STEM (Science, Tech, Engineering, Math):** AI developers, cybersecurity experts, and data scientists remain high-priority.
- **Early Childhood Education:** Teachers are in high demand across almost every Canadian province.

### The "Dual Intent" Strategy
In  , the IRCC explicitly recognizes "Dual Intent." This means you can state that you want to study in Canada and eventually apply for permanent residency. However, you must still convince the visa officer that you have the means and intention to leave if your visa expires.

### Common Visa Pitfalls to Avoid
- **Applying to Non-DLIs:** Ensure your institution is a Designated Learning Institution (DLI) with a valid PGWP-eligible status.
- **Inadequate GIC:** Using a standard bank statement instead of a GIC (where required) can lead to immediate rejection.
- **Vague Study Plans:** Visa officers in  are looking for a logical "progression" in your education.

### How UniCou Ltd Ensures Your Success
- **DLI Shortlisting:** We find institutions that are PAL-compliant and PGWP-eligible.
- **PAL Procurement Guidance:** We help you navigate the provincial hurdles to get your attestation letter quickly.
- **Residency Mapping:** We don't just get you to Canada; we help you choose a province that offers the best PR pathways.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: 'CAD 1,800/mo', 
    visaRequirements: 'Study Permit (PAL Required)' 
  },
  { 
    id: 'new-zealand', 
    countryId: 'new-zealand', 
    slug: 'new-zealand', 
    title: 'Study in New Zealand', 
    content: `Kia Ora, future adventurers! If you are looking for a study destination that offers a perfect balance between high-quality education and a lifestyle defined by breathtaking natural beauty, New Zealand (Aotearoa) is calling. Known for its "think new" approach to learning, New Zealand is a place where innovation, creativity, and student well-being come first.
As we look toward  , the New Zealand government has refined its immigration and education policies to attract students who are serious about long-term career success. At UniCou Ltd, we specialize in turning these complex  regulations into a simple, stress-free journey for you.

### Why Choose New Zealand in  ?
New Zealand isn't just about the scenery; it’s about a world-class education system where every single university is ranked in the top 3% globally. In  , the focus is on sustainable careers and global citizenship.
- **The 8-University Excellence:** All eight of New Zealand's universities are government-funded and recognized worldwide.
- **Safe and Welcoming:** New Zealand consistently ranks as one of the safest countries in the world.
- **Work-Ready Education:** The "Te Pūkenga" model provides practical, hands-on learning aligned with the global job market.
- **A "Green" Career:** A premier place for environmental science, renewable energy, or sustainable business.

### The New Zealand Student Visa (Fee Paying) Rules
1. **Increased Financial Maintenance:** For  applications, you must demonstrate that you have at least NZD $20,000 per year for living costs, in addition to your tuition fees and return airfare.
2. **English Language Standards:** While most universities require an IELTS score of 6.0 or 6.5, UniCou Ltd can guide you on alternative tests like PTE Academic and LanguageCert.
3. **The "Genuine Intent" Focus:** Your Statement of Purpose (SOP) must clearly show how your chosen course in New Zealand will add value to your career.

### The Green List: Your Pathway to Residency
The New Zealand Green List is the most important document for any student thinking about a long-term future. This list contains "Hard-to-Fill" roles that provide a fast-track to residency.
- **Construction & Engineering:** Civil, structural, and electrical engineers are in massive demand.
- **Healthcare:** Registered nurses, GPs, and psychologists remain top priority.
- **ICT & Software:** Software developers and cybersecurity analysts are highly sought after.
- **Secondary Teaching:** Science, Math, and Technology teachers see record-high visa approval rates.

### Post-Study Work Rights (PSWP)
- **Degree-Level (Level 7+):** Typically eligible for a 3-year Post-Study Work Visa.
- **Below-Degree (Level 4-6):** Eligible only if the qualification is on the Green List.

### Working While You Study
In  , most international students in New Zealand are permitted to work up to 20 hours per week during the semester and full-time during holidays.

### Regional Study: The Hidden Advantage
Studying in regional areas like Canterbury, Otago, or Waikato offers lower living costs and unique residency pathways through regional skills shortages.

### Common Visa Pitfalls to Avoid
- **Inadequate Fund History:** INZ requires clear "source of funds."
- **Weak Course Justification:** Explain your return to study or level change clearly.
- **Missing Checks:** Ensure medical and police clearances are recent.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200', 
    costOfLiving: 'NZD 1,700/mo', 
    visaRequirements: 'Fee Paying Student Visa' 
  },
  { 
    id: 'usa', 
    countryId: 'usa', 
    slug: 'usa', 
    title: 'Study in USA', 
    content: `Hello, future innovators! If you have ever imagined yourself studying in the heart of Silicon Valley, walking the historic halls of the Ivy League, or researching in world-class labs, the United States remains the undisputed "Land of Opportunity." In  , the USA continues to host more international students than any other country.
At UniCou Ltd, we specialize in cutting through the complexity of the American application process. We don't just help you get "in"; we help you thrive.

### Why Choose the USA in  ?
The U.S. education system is famous for its "Liberal Arts" philosophy. In  , this flexibility is your greatest asset.
- **Global Rankings:** The USA dominates global rankings with hundreds of top-tier programs.
- **STEM Powerhouse:** The epicenter for AI, Robotics, and Biotech research and corporate partnerships.
- **Diversity and Networking:** Study alongside the brightest minds from every corner of the globe.
- **Campus Culture:** NCAA sports and thousands of clubs build leadership skills outside the classroom.

### The F-1 Student Visa: New Rules and Digital Shifts
1. **Digital I-20s and SEVIS Updates:** In  , universities issue digital I-20 forms instantly to your email.
2. **The Financial Requirement:** You must demonstrate that you have "liquid funds" to cover one full year of tuition, fees, and living expenses.
3. **Interview Scrutiny:** The Visa Interview is the "make or break" moment. We provide 1-on-1 mock interviews to prepare you.

### STEM OPT: The 3-Year Work Advantage
- **Standard OPT:** 12 months of work authorization.
- **STEM Extension:** An additional 24-month extension for Science, Tech, Engineering, or Math fields.
Total Work Time: 3 years to work for U.S. companies without needing an H-1B immediately.

### Top High-Growth Courses for  
- **Artificial Intelligence & Machine Learning:** Specialized Master’s programs see the highest starting salaries.
- **Data Science & Business Analytics:** Massive demand for experts across all industries.
- **Healthcare Administration:** managers who understand both health and tech are skyrocketing.
- **Cybersecurity:** Among the most "recession-proof" roles in America.

### The Community College "2+2" Pathway
A major trend for  is spending your first two years at a Community College (50% less tuition) and then transferring to a top-tier University.

### Common Visa Pitfalls to Avoid
- **"Stock" Answers:** Answers must be personal and specific to your life.
- **Inadequate Tie to Home:** Demonstrate strong social or economic ties back home.
- **Late Applications:** U.S. universities have much earlier deadlines than other countries.

### How UniCou Ltd Leads the Way
- **University Matching:** Finding universities where you have the highest chance of admission and scholarships.
- **SOP and Essay Editing:** Crafting a Statement of Purpose that stands out.
- **Visa Mastery:** High success rates through focus on the "why" behind your plan.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1508433957232-3107f5ee20c5?w=1200', 
    costOfLiving: '$1,500 - $2,500/mo', 
    visaRequirements: 'F-1 Student Visa' 
  },
  { 
    id: 'ireland', 
    countryId: 'ireland', 
    slug: 'ireland', 
    title: 'Study in Ireland', 
    content: `Fáilte! If you are looking for a study destination that perfectly blends a rich cultural heritage with a high-tech, modern economy, Ireland should be at the very top of your list. In  , Ireland has emerged as one of the most strategic choices, being the only English-speaking country in the Eurozone.
At UniCou Ltd, we believe Ireland offers a unique competitive advantage for students who want to bridge the gap between their education and a career in global giants like Google, Meta, and Pfizer.

### Why Choose Ireland in  ?
- **The European Tech Hub:** Dublin hosts European headquarters for over 1,000 multinational companies.
- **Academic Excellence:** Irish universities are consistently ranked in the top 1% of research institutions worldwide.
- **Safety and Friendliness:** Frequently ranked as one of the safest countries in the world.
- **Post-Study Work rights:** Ireland’s "Third Level Graduate Scheme" remains one of the most generous.

### Ireland Student Visa (Stamp 2) Rules
1. **Increased Financial Proof:** Students must now demonstrate access to at least €12,000 per year for living expenses, plus tuition fees.
2. **English Language Standards:** Irish universities accept a wide range of tests including IELTS, PTE, and LanguageCert.
3. **Mandatory Medical Insurance:** Must cover at least €25,000 for in-hospital treatment.

### The 1G Graduate Visa: Your Pathway to a European Career
- **Master’s & PhD Graduates:** Eligible for a 2-year stay-back visa.
- **Bachelor’s Graduates:** Eligible for a 1-year stay-back visa.
This period allows you to transition into the Critical Skills Employment Permit.

### Top High-Demand Courses in Ireland
- **Data Science & AI:** Specialists see record-high demand from tech firms in Dublin.
- **Pharmaceutical Sciences:** Ireland is the world’s third-largest exporter of pharmaceuticals.
- **FinTech:** High demand for graduates who understand finance and blockchain technology.
- **Cybersecurity:** Protecting global HQ operations based in Dublin is a top priority.

### Working While You Study
International students on a Stamp 2 visa are permitted to work 20 hours per week during the semester and 40 hours per week during scheduled holidays.

### Common Visa Pitfalls to Avoid
- **Study Gaps:** Gaps of more than 2-3 years require detailed CVs and work experience certificates.
- **Weak SOP:** Focus on why you chose Ireland over other European countries.
- **Insufficient Insurance:** Ensure you have a dedicated Irish Student Health Insurance plan.

### How UniCou Ltd Guides Your Journey
- **University Selection:** Matching you with universities with strong industry ties.
- **Digital Visa Support:** Navigating the Irish "AVATS" online visa system.
- **Accommodation Assistance:** Finding places to stay in student residences.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed66a1846?w=1200', 
    costOfLiving: '€1,000/mo', 
    visaRequirements: 'Student Visa (Stamp 2)' 
  },
  { 
    id: 'cyprus', 
    countryId: 'cyprus', 
    slug: 'cyprus', 
    title: 'Study in Cyprus', 
    content: `Thinking about studying abroad in  ? You want the "European experience" but maybe you aren’t as keen on the freezing winters or sky-high tuition fees in London or Paris. Cyprus is a booming educational hub that offers a unique "best of both worlds" scenario. You live in one of the safest, sunniest countries while earning a degree recognized across the entire European Union.
At UniCou Ltd, we’ve seen a massive surge in interest for this Mediterranean island recently.

### Why Cyprus is the "Smart" Move for  
In  , Cyprus stands out by keeping its costs down while pushing academic standards up.
- **Safety and Sunshine:** One of the safest countries in the world.
- **English Spoken:** English is widely used in both academics and daily life.
- **Future Industries:** Focused on Tech, Maritime, and Hospitality.

### The Lowdown on  Visa Rules
1. **Digital Verification:** Speeds up the process, though you still need apostilled police and medical certificates.
2. **The "Pink Slip":** Your Temporary Residence Permit. We walk you through the blood tests and bank guarantees once you land.
3. **Financial Proof:** You'll need to show a bank balance of roughly €7,000 to €8,000 for living expenses.

### Work Rights: Making Money While You Learn
In  , international students are generally allowed to work up to 20 hours per week during the semester. During summer breaks, students often find full-time work in luxury resorts or vibrant cafes.

### High-Demand Courses
- **Hospitality & Tourism Management:** Access to internships in 5-star hotels.
- **Maritime & Shipping:** Limassol is one of the biggest shipping hubs in the world.
- **Computer Science & Fintech:** Huge demand for developers and blockchain experts.
- **Medicine:** facility standards are high, but costs are much lower than the UK or US.

### The Cost of Living
In  , you can live quite comfortably on about €600 to €900 a month, covering rent, groceries, and weekend travels.

### The Erasmus+ Secret
Because Cyprus is in the EU, you have access to the Erasmus+ program, allowing you to spend a semester studying in another European country like Italy or Germany while paying your regular Cyprus tuition.

### How UniCou Ltd Makes it Happen
- **Right School Selection:** Based on grades, budget, and goals.
- **Handling Paperwork:** Visas, interviews, and migration documentation.
- **Ongoing Support:** From application to graduation.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', 
    costOfLiving: '€700/mo', 
    visaRequirements: 'Pink Slip (Temporary Residence)' 
  },
  { 
    id: 'germany', 
    countryId: 'germany', 
    slug: 'germany', 
    title: 'Study in Germany', 
    content: `Germany is the "engine" of Europe, the land of precision engineering, and one of the few places left where you can get a world-class education without a mountain of debt. As we head into  , the rules for international students are becoming more digital.
At UniCou Ltd, we live and breathe German education. We help you navigate the bureaucracy for a smooth transition.

### Public vs. Private Universities
1. **Public Universities:** Mostly tuition-free but incredibly competitive. High German proficiency is often needed.
2. **Private Universities:** Charge fees but offer more flexibility and English-taught programs.

### The "Blocked Account" (Sperrkonto) Updates
For  , you should expect to deposit roughly €11,904 to €12,200 for your first year into a mandatory blocked account. This isn't a fee; it's your money, returned in monthly installments once you arrive.

### Navigating the  Student Visa
The embassy wants to see a genuine academic goal. We focus on your Statement of Purpose (SOP) to ensure it resonates with the visa officer.

### Working While You Study
In  , international students are typically allowed to work 140 full days or 280 half days per year. Germany is facing a labor shortage, making finding part-time "Minijobs" or "Werkstudent" positions easier than ever.

### Top High-Demand Fields
- **Engineering:** Germany is the heart of global engineering.
- **IT & Cybersecurity:** Companies are desperate for coders and data scientists.
- **Healthcare:** Demand is at an all-time high.
- **Renewable Energy:** Germany is a leader in Energy Transition.

### The 18-Month Post-Study Work Visa
Finish your degree and apply for an 18-month job seeker visa. Once you find a professional role, we can guide you on switching to an EU Blue Card for permanent residency.

### Language: Do You Really Need German?
While many Master’s are in English, if you want a career in Germany, you need the language. We recommend getting to at least a B1 level.

### Common Pitfalls to Avoid
- **Health Insurance:** You cannot enroll without proof of German health insurance.
- **APS Certificate:** Mandatory for students from certain countries like India, China, or Vietnam.
- **Strict Deadlines:** German universities do not accept late applications.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€934/mo', 
    visaRequirements: 'National Visa (Type D)' 
  },
  { 
    id: 'italy', 
    countryId: 'italy', 
    slug: 'italy', 
    title: 'Study in Italy', 
    content: `Italy is becoming famous for being one of the most affordable and high-quality study destinations in the world. We’re talking about some of the oldest and most prestigious universities where tuition is based on family income.
At UniCou Ltd, we’ve helped countless students navigate the "Italian maze."

### The "Income-Based" Tuition Secret
Public universities operate on a system called ISEE. Tuition fees for top-tier public universities often range from €500 to €3,000 per year for international students. We guide you through the ISEE documentation process.

### The  Pre-Enrollment & Universitaly Portal
The  rules require completing a "Pre-Enrollment" request on the Universitaly portal. One mistake here can lead to a visa rejection, so we manage your profile to ensure it is airtight.

### Scholarships: The "DSU" Advantage
Regional scholarships (DSU) are based on financial need and can provide zero tuition, a free meal a day, and a yearly stipend of €5,000 to €7,000.

### Entrance Exams: IMAT, TOLC, and Beyond
Medicine in English requires the IMAT, while Engineering may require TOLC or SAT. These tests often happen only once a year.

### The  Italian Student Visa (Type D)
You will need to show roughly €6,500 to €7,500 for the year. Visa officers also want to see proof of accommodation, which we help you secure.

### Working While You Study
In  , international students are permitted to work 20 hours per week. It’s enough to cover your weekend travels and learn the language.

### Post-Study Work Rights
Apply for a 12-month stay-back permit for job seeking. Italy is looking for talent in Automotive Engineering, Fashion, AI, and Sustainable Architecture.

### Common Pitfalls to Avoid
- **Dichiarazione di Valore (DoV):** proves your previous education is valid. Getting the wrong one can stall enrollment.
- **Permesso Deadline:** You must apply for your Residency Permit within 8 days of arriving.
- **Underestimating Language:** Basic Italian is needed for daily life and work.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1516483601948-9b2832ac29c7?w=1200', 
    costOfLiving: '€600/mo', 
    visaRequirements: 'Student Visa (Type D)' 
  },
  { 
    id: 'sweden', 
    countryId: 'sweden', 
    slug: 'sweden', 
    title: 'Study in Sweden', 
    content: `If you are looking for a society that is actually building the future, Sweden is where you need to be. It is a global powerhouse of innovation in Green Tech, Game Design, and Social Justice.
At UniCou Ltd, we’ve seen Sweden grow into a top-tier choice for students who value quality of life.

### The Swedish Way: Collaborative Learning
The education system follows the concept of "Lagom" (just the right amount). Classes are informal and focused on solving real-world problems through sustainable innovation.

### The  Residence Permit & Financial Rules
You must show that you have roughly SEK 10,500 to 11,000 per month for the duration of your stay. The money must be in your own bank account and at your disposal.

### University Admissions: The "One Portal" System
UniversityAdmissions.se is the single centralized portal for all programs. Deadlines are early; usually mid-January for the August intake.

### Tuition Fees and Scholarships
Tuition ranges from SEK 80,000 to SEK 295,000 per year for non-EU students.
- **SI Global Professionals Scholarship:** Covers full tuition and living costs.
- **University-Specific Scholarships:** waivers ranging from 25% to 75%.

### The  Post-Study Work Visa
Once you complete your degree, you can apply to stay for 12 months specifically to look for a job or start your own business. Major companies like Spotify, Volvo, and Ericsson are constantly looking for talent.

### High-Demand Careers
- **Battery Tech & Green Energy:** Battery engineers are in huge demand.
- **IT & Software Development:** Stockholm is a global hub for "unicorns."
- **Biotechnology:** The "Medicon Valley" region is a global hub for life sciences.

### Working While You Study
Sweden has no official limit on student work hours, but courses are intense. We suggest 10-15 hours a week.

### The Personnummer
If staying for more than a year, the Personnummer is your key to healthcare, bank accounts, and more.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?w=1200', 
    costOfLiving: 'SEK 11,000/mo', 
    visaRequirements: 'Residence Permit for Higher Education' 
  },
  { 
    id: 'finland', 
    countryId: 'finland', 
    slug: 'finland', 
    title: 'Study in Finland', 
    content: `Finland has been ranked the happiest country in the world for seven years in a row. It home to a premier education system where "student-life balance" is a way of life.
At UniCou Ltd, we know that moving to the land of a thousand lakes can feel like a big leap.

### The Finnish Classroom
Informal and equality-driven. Whether studying Robotics or Design, you will be encouraged to think for yourself and solve real-world problems.

### The  Residence Permit: "One for Whole Degree"
Accepted students for Bachelor’s or Master’s programs can apply for a permit that covers the entire duration of their studies. You need to show roughly €800 to €900 per month.

### University Admissions: "Joint Application"
English-taught programs have their main application window in January.
- **Research Universities:** Focus on academic theory.
- **Universities of Applied Sciences (UAS):** Focus on practical, hands-on skills.

### Tuition Fees and the "Early Bird" Discount
Fees range from €6,000 to €15,000 per year. Many universities offer significant discounts for early acceptance.

### Working While You Study: 30 Hours
International students are allowed to work an average of 30 hours per week during the semester. During holidays, there are no limits.

### The 2-Year Post-Study Work Visa
Finland offers a 2-year "stay-back" residence permit after graduation, providing plenty of time to find a job and transition to permanent residency.

### High-Demand Careers
- **ICT & Software Engineering:** The birthplace of Nokia and Linux.
- **Nursing & Social Care:** Critical need for healthcare professionals.
- **Clean Energy:** aiming to be carbon neutral by 2035.

### Cost of Living
- **Student Meals:** Full healthy meals for about €3.00.
- **Housing:** Student Housing Foundations (HOAS/TOAS) offer rooms for €350 - €500.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200', 
    costOfLiving: '€850/mo', 
    visaRequirements: 'Residence Permit (B)' 
  },
  { 
    id: 'dubai', 
    countryId: 'dubai', 
    slug: 'dubai', 
    title: 'Study in Dubai', 
    content: `Imagine studying in a city where the world’s tallest buildings and most advanced AI labs are right outside your classroom door. Dubai has officially become a "Knowledge Economy."
In  , Dubai winning because it offers a safe, ultra-modern environment with direct access to global job markets.

### Global Degrees in a Tax-Free Hub
Through "International Branch Campuses," you can study at universities from the UK, Australia, and USA like Heriot-Watt or Murdoch right in Dubai, getting the exact same degree.

### The  Dubai Student Visa
Efficient and university-sponsored. You need a valid offer letter, a medical fitness test, and proof of funds. Scrutiny is more flexible than in the West.

### The "Golden Visa" for Academic Excellence
For  , students graduating with a high GPA (typically 3.75+) can be eligible for a 10-Year Golden Visa that doesn't require a sponsor.

### Working While You Study: Tax-Free
Students are permitted to take part-time jobs and internships. There is no personal income tax in Dubai—what you earn is what you keep.

### Top High-Demand Careers
- **Fintech & Blockchain:** Dubai aims to be the crypto capital.
- **Tourism & Luxury Hospitality:** Massive demand for management talent.
- **AI & Robotics:** The heart of the region's tech push.
- **Logistics:** DP World and Emirates SkyCargo drive global trade.

### Cost of Living
- **Housing:** AED 2,500 to 4,500 per month.
- **Transport:** Students get 50% off all fares with a Blue Nol Card.
- **Food:** AED 1,000 - 1,500 a month.

### Common Pitfalls to Avoid
- **Accreditation:** Ensure your university is accredited by the CAA or KHDA.
- **Missing Deadlines:** Internship competition at places like Microsoft or Emirates is fierce.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', 
    costOfLiving: 'AED 3,500/mo', 
    visaRequirements: 'Student Entry Permit' 
  },
  { 
    id: 'malaysia', 
    countryId: 'malaysia', 
    slug: 'malaysia', 
    title: 'Study in Malaysia', 
    content: `Malaysia has officially secured its spot as a top-10 global education hub. It offers the ability to earn a degree from a top-tier UK or Australian university while living in one of the most affordable countries in Southeast Asia.

### The "Branch Campus" Hack
Study at campuses of Monash, Nottingham, or Southampton in Malaysia. The curriculum and degree certificate are identical to the home university, but costs are 70% lower.

### The  EMGS Visa Process
Managed via e-VAL (Electronic Visa Approval Letter). You need roughly USD $4,000 to $5,000 for living expenses. Approval time is now only 14–21 working days.

### Working While You Study
Permitted to work 20 hours per week during breaks. However, high-paying internships in Cyberjaya (Malaysia’s Silicon Valley) are the real advantage.

### Top High-Demand Careers
- **Semiconductor & Electronics Engineering:** global leader in chip testing.
- **Fintech & Islamic Finance:** The world’s capital for Shariah-compliant digital finance.
- **Data Science & AI:** Huge demand as data centers move to the region.

### Cost of Living
- **Housing:** luxury condo rooms between USD $150 and $350 a month.
- **Food:** World-class meals for USD $2.
- **Transport:** ultra-modern rail systems with student discounts.

### Common Pitfalls to Avoid
- **Attendance:** You must maintain 80% attendance to renew your visa.
- **Accreditation:** Ensure the course is MQA-approved.
- **Passport:** Must be valid for at least 18 months upon arrival.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200', 
    costOfLiving: 'USD 500/mo', 
    visaRequirements: 'Student Pass (e-VAL)' 
  },
  { 
    id: 'turkey', 
    countryId: 'turkey', 
    slug: 'turkey', 
    title: 'Study in Turkey', 
    content: `Imagine sitting in a lecture in the morning and walking across the Bosphorus bridge by the afternoon. Turkey is rapidly becoming a global powerhouse for international education.

### European Standards, Mediterranean Soul
Turkey is a full member of the Bologna Process. A degree here is recognized across all of Europe. English-taught programs are expanding rapidly in Istanbul and Ankara.

### The  Residence Permit (Ikamet)
You'll need a Student Visa and then an Ikamet. You must show roughly USD $5,000 to $7,000 available for your first year. Interviews can often be completed directly on campus.

### Working While You Study
Permitted to work part-time (20 hours/week) after your first year. Istanbul is a hub for Textile Design, E-commerce, and International Trade.

### Top High-Demand Careers
- **Architecture & Civil Engineering:** Turkish firms build projects worldwide.
- **Medicine:** "Health Tourism" has made a medical degree here a golden ticket.
- **Digital Marketing:** Home to giants like Trendyol and Getir.

### Cost of Living
- **Housing:** State or private dorms ranging from USD $150 to $400.
- **Food:** healthy meals for USD $3 to $5.
- **Transport:** Massive discounts on metros and domestic flights.

### The "Turkiye Scholarships" (Bursları)
One of the most comprehensive programs globally, covering tuition, stipend, housing, and a Turkish language course.

### Common Pitfalls to Avoid
- **Denklik (Equivalence):** verifies previous education. If not done correctly, you can't graduate.
- **Attendance:** Strict requirements to maintain student residency.

Ready to take the first step?`, 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: 'USD 300/mo', 
    visaRequirements: 'Student Visa & Ikamet' 
  },
  { 
    id: 'europe', 
    countryId: 'europe', 
    slug: 'europe', 
    title: 'Study in Europe Hub', 
    content: `Discover hidden gems: Poland, Hungary, Spain, and France. In  , the EU is making a massive push to attract global talent into specialized hubs.

### The New hotspots
- **Poland:** rising star for Engineering and Computer Science.
- **Hungary:** best-value for Medicine, Dentistry, and Veterinary Science.
- **Spain:** Top-tier global business schools and renewable energy hubs.
- **France:** Specialized "Grande Écoles" in Engineering and Management.

### Navigating the  ETIAS Shift
Reflects a wider shift toward digital boundaries. Schengen Student Visas are becoming more streamlined with digital document uploads.

### Financial Strategy
In Poland or Hungary, you can live on €500 - €700 a month. proof of funds averaged around €9,000 - €11,000 per year.

### Scholarships
- **Stipendium Hungaricum:** Covers tuition, insurance, and stipend in Hungary.
- **Erasmus+:** Spend a semester in another country funded by the EU.

### Post-Study Work Visas
Spain and France offer 12-month stay-back permits, while Poland offers 9 months. Transition to an EU Blue Card for long-term rights.

### Studying in English
There are over 10,000 English-taught programs across the continent. Lectures, exams, and textbooks are 100% in English.

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