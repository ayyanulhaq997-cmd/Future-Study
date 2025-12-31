
import { Product, VoucherCode, User, University, CountryGuide, UserRole, Course, Qualification, LMSCourse, LMSPracticeTest, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'Zeeshan (Admin)', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true },
  { id: 'u-finance', name: 'Finance Node 1', email: 'finance@unicou.uk', role: 'Finance/Audit Team', isAuthorized: true },
  { id: 'u-manager', name: 'Operations Lead', email: 'manager@unicou.uk', role: 'Operation Manager', isAuthorized: true },
  { id: 'u-agent', name: 'Partner Hub', email: 'partner@unicou.uk', role: 'Agent Partner/Prep Center', tier: 2, isAuthorized: true },
  { id: 'u-student', name: 'Alex Smith', email: 'alex@gmail.com', role: 'Student', isAuthorized: true },
];

export const products: Product[] = [
  { id: 'v-1', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', pricingModel: 'Country-Wise', description: 'British Council/IDP Official.', icon: '🌐' },
  { id: 'v-6', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Pearson Official Standard.', icon: '📊' },
  { id: 'v-19', name: 'TOEFL iBT Official', category: 'TOEFL', type: 'Voucher', basePrice: 195, currency: 'USD', pricingModel: 'Country-Wise', description: 'ETS TOEFL iBT Global.', icon: '🌎' },
  { id: 'v-20', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 60, currency: 'USD', pricingModel: 'Global', description: 'Duolingo Access.', icon: '🦉' },
  { id: 'v-21', name: 'Oxford ELLT Voucher', category: 'ELLT', type: 'Voucher', basePrice: 120, currency: 'GBP', pricingModel: 'Global', description: 'Oxford International Digital.', icon: '🎓' },
  { id: 'v-22', name: 'Password Skills Plus', category: 'Password', type: 'Voucher', basePrice: 110, currency: 'GBP', pricingModel: 'Global', description: 'Secure English Language Test.', icon: '🔑' },
  { id: 'v-23', name: 'GRE General Voucher', category: 'GRE', type: 'Voucher', basePrice: 220, currency: 'USD', pricingModel: 'Global', description: 'ETS GRE Official.', icon: '📝' },
];

export const voucherCodes: VoucherCode[] = products.flatMap(p => 
  Array(50).fill(0).map((_, i) => ({
    id: `vc-${p.id}-${i}`,
    productId: p.id,
    code: `${p.category.substring(0,2).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    status: 'Available' as const,
    expiryDate: '2026-12-31',
    uploadDate: '2024-01-01T00:00:00Z'
  }))
);

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in United Kingdom', 
    content: `Are you dreaming of walking through the historic campuses of Oxford, London, Manchester, Birmingham, Glasgow, Cardiff, Belfast? The United Kingdom remains one of the world's premier destinations for higher education, offering a blend of tradition, innovation, and global career opportunities. However, as we move into 2025 and look toward the future, the landscape for international students is shifting.

At UniCou, we understand that navigating visa changes and university applications can feel overwhelming. That is why we have put together this comprehensive guide to help you understand exactly what it takes to study in the UK today.

### Why Study in the UK in 2025?

The UK’s reputation for academic excellence is unmatched. With a degree from a UK institution, you aren't just getting an education; you are gaining a globally recognized credential. In 2025, several factors continue to make the UK a top choice:

- **Shorter Course Durations**: Unlike many other countries, most UK Bachelor’s degrees take only three years, and Master’s degrees are typically completed in just one year. This saves you both time and tuition costs.
- **World-Class Research**: UK universities are at the forefront of global innovation, especially in AI, renewable energy, and healthcare.
- **Cultural Diversity**: You will join a vibrant community of students from over 180 countries, building a global network that will last a lifetime.

### The Latest 2025 UK Student Visa Rules

The UK government has introduced several important updates that you need to be aware of before applying. Staying compliant with these UK study visa requirements is the key to a successful application.

### 1. Increased Financial Maintenance Requirements
As of **November 11, 2025**, the Home Office has increased the amount of money you must show to cover your living costs.
- **Studying in London**: You now need to demonstrate **£1,529 per month** (for up to 9 months).
- **Studying Outside London**: You need to show **£1,171 per month** (for up to 9 months).
- **Funds Stability**: These funds must be held in your bank account for at least **28 consecutive days** before you submit your application.

### 2. English Language Requirements
For **Confirmation of Acceptance for Studies (CAS)** in 2025, the English language requirements differ strictly based on the level of your course and the institution's status. For **below degree-level courses** (such as Foundation, Pathway, or Diploma programs), the UK Home Office mandates a **Secure English Language Test (SELT)** taken at an approved physical test center. In these cases, you must choose from the official SELT list: IELTS for UKVI, PTE Academic UKVI, LanguageCert International ESOL SELT, PSI (Skills for English UKVI), or Trinity College London (ISE/GESE).

For students applying to **degree-level programs** or higher, UK Higher Education Institutions (HEIs) have the flexibility to accept a wider range of online and home-based English exams. Common online and home-based exams accepted for CAS issuance in 2025 include:
- Oxford ELLT (English Language Level Test) Digital
- LanguageCert ESOL (Online with remote proctoring)
- Password Skills Plus
- TOEFL iBT Home Edition
- IELTS Online
- PTE Academic Online
- Duolingo English Test (DET)
- University Internal English Tests

### 3. Transition to eVisas
Say goodbye to the physical Biometric Residence Permit (BRP). The UK has fully transitioned to **eVisas**. You will now access and prove your immigration status online through a secure UKVI account.

### Top Courses in Demand for 2025
- **Computer Science & AI**: With the UK investing billions in tech innovation, specialists in AI, cybersecurity, and data science are in massive demand.
- **Healthcare & Nursing**: The NHS continues to face staffing shortages, making healthcare degrees a reliable pathway to visa sponsorship.
- **Renewable Energy Engineering**: As the UK pushes for "Net Zero," engineers specializing in green technology are seeing a surge in job openings.
- **Business Analytics & FinTech**: London remains a global financial hub, and the demand for graduates who can bridge the gap between finance and technology is at an all-time high.

### Post-Study Work: The Graduate Route Update
Currently, the **Graduate Route visa** allows you to stay and work (at any skill level) for **2 years** after a Bachelor’s or Master’s degree, or **3 years** after a PhD. 
**Important Change**: For applications made on or after **January 1, 2027**, the post-study work period for non-PhD graduates will be reduced to **18 months**.

### Common Mistakes to Avoid
- **Last-Minute Funding**: Moving large sums of money into your account just before applying is a major red flag.
- **Expired CAS**: Your Confirmation of Acceptance for Studies (CAS) is only valid for six months.
- **Incomplete TB Testing**: Ensure you visit a UKVI-approved clinic if required for your country.

### How UniCou Can Help You
At UniCou, we are more than just agents; we are your partners in success. Our team stays updated on every policy change to ensure your journey to the UK is smooth and stress-free. We provide personalized university selection, visa application support, and scholarship guidance.

### Final Thoughts: Start Your Journey Today
The UK is ready for you, but the rules are more detailed than they used to be. By starting early and working with experts, you can turn your "Study in UK" dream into a reality.`, 
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,171/mo', 
    visaRequirements: 'Student Visa (eVisas)' 
  },
  { 
    id: 'australia', 
    countryId: 'australia', 
    slug: 'australia', 
    title: 'Study in Australia', 
    content: `G’day, future leaders! If you are looking for a destination that combines world-class education with an outdoor lifestyle that is second to none, Australia is likely at the top of your list. From the bustling tech hubs of Sydney and Melbourne to the stunning coastlines of Perth and Brisbane, the "Land Down Under" is more than just a place to get a degree—it is a place to launch a global career.

However, if you have been following the news in 2025, you know that Australian immigration is undergoing its biggest transformation in a decade. At UniCou Ltd, we are here to simplify the noise and provide you with a clear, honest roadmap to your Australian dream.

### Why Choose Australia?

Despite the recent policy shifts, Australia remains a global powerhouse in education. In 2025, the focus is on **employability**. Australian universities have integrated industry placements into almost every degree, ensuring you don't just graduate with a certificate, but with a professional network.

- **Rankings and Reputation**: Australia continues to host multiple universities in the global Top 100, recognized for excellence in Engineering, Healthcare, and Business.
- **The Lifestyle Factor**: Whether you enjoy surfing, hiking, or exploring cosmopolitan cities, Australia offers a balance that prevents student burnout.
- **Post-Study Opportunities**: With a refined 485 visa structure in 2025, Australia remains one of the best places to gain international work experience.

### The 2025/2026 National Planning Level (Enrollment Caps)

The most significant change for the future is the **National Planning Level (NPL)**. The Australian government now sets a cap on the number of new international student commencements across the country.

**What does this mean for you?**
At UniCou Ltd, we advise our students that "timing is everything." Because universities have a limited number of spots for international students, competition will be fierce. To secure your spot for the 2026 intake, you should aim to have your application submitted at least **8 to 10 months** in advance.

### Mastering the Genuine Student (GS) Requirement

Gone are the days of the generic GTE essay. In 2025, the **Genuine Student (GS) requirement** is the heartbeat of your visa application. The Department of Home Affairs now uses targeted questions to assess your intentions.
When you work with UniCou Ltd, we help you articulate:
- **Course Value**: Why is this specific course better for your career than options available in your home country?
- **Incentives to Return**: What are your long-term plans back home?
- **Circumstances**: A clear explanation of any study gaps or career changes.

### New Financial Capacity Requirements

To ensure students can focus on their studies without financial hardship, the minimum "show money" has been adjusted for inflation. As of late 2025 heading into 2026, students must demonstrate proof of approximately **AUD $30,000+** for living expenses, in addition to their tuition fees and travel costs.

### English Language Standards: The Benchmark

English proficiency requirements have stabilized at a higher level in 2025 to ensure academic success:
- **Student Visa (Subclass 500)**: Minimum IELTS 6.0 (or equivalent).
- **ELICOS Pathways**: Minimum IELTS 5.0.
- **Post-Study Work Visa**: Minimum IELTS 6.5.

### High-Demand Courses for PR and Careers

In 2025, the Australian government is prioritizing "Nation Building" sectors for skilled migration:
- **Healthcare & Nursing**: Registered nurses and midwives remain at the top of the priority list.
- **Early Childhood Education**: High-prospect path due to massive teacher shortages.
- **Green Energy Engineering**: Australia’s push toward solar and wind energy.
- **Cybersecurity & AI**: Tech specialists are being fast-tracked.

### How UniCou Ltd Makes the Difference

Navigating the Australian migration landscape alone is risky. UniCou Ltd acts as your professional shield and strategist. We provide university shortlisting, GS Strategy sessions, and end-to-end scholarship hunting support.

### Final Thoughts: Your Australian Dream is Still Possible

While the headlines might make Australia seem "selective," the truth is that it is simply seeking the best and brightest. By starting your process early with UniCou Ltd, you ensure that you are part of that elite group.`, 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: 'AUD $30,000/yr', 
    visaRequirements: 'Student Visa (Subclass 500)' 
  },
  { 
    id: 'canada', 
    countryId: 'canada', 
    slug: 'canada', 
    title: 'Study in Canada', 
    content: `Hello, future leaders! If you are dreaming of world-class education paired with an unmatched quality of life, Canada is likely calling your name. From the bustling tech hub of Toronto and the stunning landscapes of Vancouver to the historic streets of Montreal, Canada is more than just a destination—it’s a global launchpad.

However, as we look toward 2025/2026, the landscape for international students has changed significantly. The Canadian government has shifted its focus toward "quality over quantity." At UniCou Ltd, we believe that while the rules are stricter, the rewards for high-quality students are greater than ever. This guide is your roadmap to navigating the new policies and securing your place in the Great White North.

### Why Choose Canada?

Despite the new regulations, Canada remains a top-tier destination. In 2025, the focus has shifted toward **high-value education**.

- **Academic Prestige**: Canadian degrees are held in high regard globally, particularly in STEM, Healthcare, and Sustainable Technology.
- **Quality of Life**: Canada consistently ranks in the top 10 globally for safety, healthcare, and environmental quality.
- **Bilingual Advantage**: Studying in a country with two official languages (English and French) gives you a competitive edge.
- **Pathways to Residency**: Canada still prioritizes international graduates for its economic immigration programs.

### The 2025/2026 Study Permit Caps and PAL System

The most important update for students is the continuation of the **National Study Permit Cap**. To manage housing and infrastructure, the Canadian government (IRCC) has limited the number of new study permits issued each year.

**What does this mean for you?**
Most students now require a **Provincial Attestation Letter (PAL)** from the province where they intend to study. Each province has a specific quota. At UniCou Ltd, we emphasize that **speed is your best friend**. Because PALs are limited, early application to your chosen college or university is essential.

### Updated Financial Requirements

To ensure students can afford the cost of living without struggling, the IRCC has significantly increased the "Cost of Living" requirement. For 2025 applications, a single applicant must show they have at least **CAD $20,635** (plus first-year tuition and travel costs).
UniCou Ltd specializes in financial auditing. We help you prepare your **Guaranteed Investment Certificate (GIC)**, which is the preferred method for proving financial stability.

### Post-Graduation Work Permit (PGWP) Changes

The rules for staying in Canada after graduation have become more specific. The government now aligns PGWP eligibility with labor market demands:
- **Field of Study Requirement**: If you are graduating from a college program, your field of study must be linked to a "long-term shortage" occupation (such as healthcare, trades, or tech) to be eligible.
- **University Graduates**: Graduates from Bachelor’s, Master’s, and Doctoral programs currently remain exempt from these specific field-of-study restrictions.
- **Language Proficiency**: In 2025, you must prove English or French proficiency (CLB 7 for university grads, CLB 5 for college grads) for your PGWP.

### Top Courses for Career Growth and PR
- **Healthcare & Nursing**: Canada is fast-tracking visas for nursing and specialized care.
- **Skilled Trades**: Construction and electrical engineering are in massive demand.
- **STEM**: AI developers, cybersecurity experts, and data scientists remain high-priority.
- **Early Childhood Education**: Teachers are in high demand across almost every province.

### The "Dual Intent" Strategy
In 2025, the IRCC explicitly recognizes **"Dual Intent."** This means you can state that you want to study in Canada and eventually apply for permanent residency. UniCou Ltd works with you to draft a compelling Study Plan (SOP) that balances these goals.

### How UniCou Ltd Ensures Your Success
Navigating the Canadian system is complex, but UniCou Ltd has the expertise to guide you through. We provide DLI shortlisting, PAL procurement guidance, and residency mapping.

### Final Thoughts: Your Journey to Canada Starts Today
Canada in 2025 is a land of "selective opportunity." It is no longer enough to just "get in"—you must get in with the right course, in the right province, and with the right legal strategy.`, 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: 'CAD $20,635/yr', 
    visaRequirements: 'Study Permit (PAL Required)' 
  },
  { 
    id: 'new-zealand', 
    countryId: 'new-zealand', 
    slug: 'new-zealand', 
    title: 'Study in New Zealand', 
    content: `Kia Ora, future adventurers! If you are looking for a study destination that offers a perfect balance between high-quality education and a lifestyle defined by breathtaking natural beauty, New Zealand (Aotearoa) is calling. Known for its "think new" approach to learning, New Zealand is a place where innovation, creativity, and student well-being come first.

As we look toward 2025/2026, the New Zealand government has refined its immigration and education policies to attract students who are serious about long-term career success. At UniCou Ltd, we specialize in turning these complex regulations into a simple, stress-free journey for you.

### Why Choose New Zealand in 2025?

New Zealand isn't just about the scenery; it’s about a world-class education system where every single university is ranked in the top 3% globally. In 2025, the focus is on **sustainable careers and global citizenship**.

- **The 8-University Excellence**: All eight of New Zealand's universities are government-funded and recognized worldwide for research and teaching quality.
- **Safe and Welcoming**: New Zealand consistently ranks as one of the safest and least corrupt countries in the world.
- **Work-Ready Education**: The "Te Pūkenga" (NZ Institute of Skills and Technology) model provides practical learning aligned with the global job market.
- **A "Green" Career**: Ideal for those interested in environmental science, renewable energy, or sustainable business.

### The 2025/2026 New Zealand Student Visa Rules

To maintain its reputation as a high-quality destination, New Zealand has updated its visa requirements for the future academic year.

### 1. Increased Financial Maintenance
To ensure you can support yourself comfortably, the financial requirement has been adjusted. For 2025 applications, you must demonstrate that you have at least **NZD $20,000 per year** for living costs, in addition to your tuition fees and return airfare.

### 2. English Language Standards
New Zealand continues to uphold high English proficiency standards. While most universities require an IELTS score of 6.0 or 6.5, UniCou Ltd can guide you on alternative tests like PTE Academic, TOEFL iBT, and the newly popular **LanguageCert International ESOL**, which are widely accepted.

### 3. The "Genuine Intent" Focus
Immigration New Zealand (INZ) has become more focused on "bona fide" (genuine) applicants. In 2025, your Statement of Purpose (SOP) must clearly show how your chosen course will add value to your career globally.

### The Green List: Your Pathway to Residency

The New Zealand Green List is the most important document for any student thinking about a long-term future. This list contains "Hard-to-Fill" roles that provide a fast-track to residency.
High-Priority Sectors for 2025 include:
- **Construction & Engineering**: Civil, structural, and electrical engineers are in massive demand.
- **Healthcare**: Registered nurses, GPs, and psychologists remain at the top.
- **ICT & Software**: Software developers and cybersecurity analysts are highly sought after.
- **Secondary Teaching**: Science, Math, and Technology teachers are seeing high visa approval rates.

### Post-Study Work Rights (PSWP)
- **Degree-Level (Level 7+)**: If you complete a Bachelor’s, Master’s, or PhD, you are generally eligible for a **3-year Post-Study Work Visa**.
- **Below-Degree (Level 4-6)**: Eligible only if your qualification is on the Green List.

### Regional Study: The Hidden Advantage
Studying in regional areas like Canterbury, Otago, or Waikato offers lower living costs and access to regional skills shortages, making it easier for graduates to find jobs and secure state-nominated residency.

### Common Visa Pitfalls to Avoid
- **Inadequate Fund History**: INZ requires clear "source of funds." Large, unexplained deposits can lead to rejection.
- **Weak Course Justification**: Applying for a lower-level Diploma if you already have a higher degree requires strong explanation.

### How UniCou Ltd Ensures Your Success
At UniCou Ltd, we build careers. Our specialized New Zealand team offers university matching, document auditing, scholarship guidance, and pre-departure briefings.

### Final Thoughts: Start Your Journey Today
New Zealand is a country that rewards those who think differently. In 2025, it remains a premier destination for students who value quality and safety. Partnering with UniCou Ltd ensures your transition to life in Aotearoa is as smooth as possible.`, 
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200', 
    costOfLiving: 'NZD $20,000/yr', 
    visaRequirements: 'Student Visa (Fee Paying)' 
  },
  { 
    id: 'ireland', 
    countryId: 'ireland', 
    slug: 'ireland', 
    title: 'Study in Ireland', 
    content: `Fáilte! (That’s "Welcome" in Irish). If you are looking for a study destination that perfectly blends a rich cultural heritage with a high-tech, modern economy, Ireland should be at the very top of your list. Known as the "Emerald Isle," Ireland has emerged in 2025 as one of the most strategic choices for international students, especially since it remains the only English-speaking country in the Eurozone.

As we look toward the future academic years, Ireland has updated its policies to better support international talent. At UniCou Ltd, we believe Ireland offers a unique competitive advantage for students who want to bridge the gap between their education and a career in global giants like Google, Meta, and Pfizer.

### Why Choose Ireland in 2025?

In 2025, Ireland is no longer a "hidden gem"—it is a premier global education hub. For students concerned about post-Brexit travel or employment in Europe, Ireland provides the perfect solution.

- **The European Tech Hub**: Dublin is the European headquarters for over 1,000 multinational companies. This creates an ecosystem of internships that you won't find anywhere else.
- **Academic Excellence**: From Trinity College Dublin to University College Dublin (UCD), Irish universities are consistently ranked in the top 1% of research institutions worldwide.
- **A Safety Haven**: Ireland is frequently ranked as one of the safest and friendliest countries in the world.
- **Post-Study Work Rights**: Ireland’s "Third Level Graduate Scheme" remains one of the most generous in the world.

### Ireland Student Visa (Stamp 2) Rules for 2025

Navigating the Irish Student Visa (Stamp 2) process requires attention to detail. For 2025, the Irish Naturalisation and Immigration Service (INIS) has streamlined digital applications but tightened financial scrutiny.

### 1. Increased Financial Capacity Requirements
To account for the rising cost of living in Europe, the financial proof required for a visa has been updated. Students must now demonstrate that they have access to at least **€12,000 per year** for living expenses, in addition to their full tuition fees. UniCou Ltd assists you in preparing your "Summary of Funds" to ensure your bank statements meet the exact Irish standard.

### 2. English Language Standards (SELT)
For 2025, Irish universities accept a wide range of Secure English Language Tests (SELT). While IELTS (6.5) and PTE Academic are the most common, Ireland is a leader in accepting modern alternatives. UniCou Ltd can help you book discounted vouchers for **LanguageCert International ESOL** or **TOEFL iBT**, both of which are widely recognized.

### 3. Mandatory Medical Insurance
A unique requirement for Ireland is that every international student must have private medical insurance. In 2025, this must cover at least €25,000 for in-hospital treatment. We help our students secure group-rate insurance policies that are pre-approved by the immigration authorities.

### The 1G Graduate Visa: Your Pathway to a European Career

The "Third Level Graduate Scheme" (Stamp 1G) is the crown jewel of the Irish education system:
- **Master’s & PhD Graduates**: Eligible for a **2-year stay-back visa**, allowing you to work full-time without a separate work permit.
- **Bachelor’s Graduates**: Eligible for a **1-year stay-back visa**.
This period is designed to allow you to transition into the Critical Skills Employment Permit, which is the fastest route to permanent residency.

### Top High-Demand Courses in Ireland
Ireland’s economy is built on specific "Critical Skills" sectors. We recommend:
- **Data Science & AI**: Dublin being a data hub, specialists are in record-high demand.
- **Pharmaceutical & Biology Sciences**: Ireland is the world’s third-largest exporter of pharmaceuticals.
- **FinTech & Financial Services**: Massive demand for graduates who understand both finance and blockchain.
- **Sustainable Energy Engineering**: Ireland is investing heavily in offshore wind energy.
- **Cybersecurity**: Protecting global HQ operations based in Dublin is a top national priority.

### Working While You Study
International students on a Stamp 2 visa are permitted to work **20 hours per week** during the semester and **40 hours per week** during scheduled holidays.

### Common Visa Pitfalls to Avoid
- **Inconsistent Education History**: Ireland is strict about "study gaps" of more than 2-3 years.
- **Poorly Explained SOP**: Your SOP must focus on why you chose Ireland over other European countries.
- **Insufficient Insurance**: Using basic travel insurance instead of a dedicated Irish plan will result in delays.

### How UniCou Ltd Guides Your Journey
UniCou Ltd provides personalized university selection, digital visa support via the Irish "AVATS" system, interview preparation, and verified accommodation assistance.

### Final Thoughts: Your European Future Starts in Ireland
Ireland is a country that prizes education, community, and innovation. It is a place where you can get a world-class degree on Monday and interview with a Fortune 500 company on Friday. Let UniCou Ltd be your partner in making the Emerald Isle your new home.`, 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200', 
    costOfLiving: '€12,000/yr', 
    visaRequirements: 'Student Visa (Stamp 2)' 
  },
  { 
    id: 'cyprus', 
    countryId: 'cyprus', 
    slug: 'cyprus', 
    title: 'Study in Cyprus', 
    content: `Thinking about studying abroad in 2025? You want the "European experience"—the high-quality degrees, the travel opportunities, and the global career prospects—but maybe you aren’t as keen on the freezing winters of the north or the sky-high tuition fees in cities like London or Paris.

If that sounds like you, let’s talk about Cyprus. At UniCou Ltd, we’ve seen a massive surge in interest for this Mediterranean island recently. Cyprus isn't just a place for a summer holiday; it’s a booming educational hub that offers a unique "best of both worlds" scenario.

### Why Cyprus is the "Smart" Move for 2025

In 2025, the global education market is getting more competitive. Cyprus stands out because it has managed to keep its costs down while pushing its academic standards up. You get to live in one of the safest, sunniest countries in the world while earning a degree that is recognized across the entire European Union.

- **European Recognition**: Degrees are fully aligned with the European Higher Education Area (EHEA).
- **Safety First**: Cyprus consistently ranks as one of the safest countries in the world for international students.
- **Bilingual Culture**: English is widely spoken and used as the medium of instruction in most private universities.
- **Modern Infrastructure**: Booming Tech, Maritime, and Hospitality sectors directly influence the curriculum.

### The "Lowdown" on 2025 Visa Rules

The Cyprus Migration Department has refined its processes to make things smoother for 2025.
- **Digital Verification**: Many academic documents can now be verified digitally, speeding up the process.
- **The "Pink Slip"**: This is your Temporary Residence Permit. Once you arrive, you must apply for this (involving health checks and bank guarantees). UniCou Ltd walks you through every step.
- **Financial Proof**: For 2025, you'll need to demonstrate access to roughly **€7,000 to €8,000** for living expenses. This is significantly lower than major Anglosphere destinations.

### Work Rights: Making Money While You Learn
In 2025, international students in Cyprus are generally allowed to work up to **20 hours per week** during the semester. With Cyprus being a massive tourism hub, summer breaks offer opportunities for full-time work in luxury resorts and bustling ports, helping you cover a large portion of your living costs.

### High-Demand Courses in Cyprus
Pick a field that leads to growth:
- **Hospitality & Tourism Management**: Access to world-class internships in 5-star hotels.
- **Maritime & Shipping**: Study in Limassol, one of the world's premier shipping hubs.
- **Computer Science & FinTech**: Cyprus is rapidly becoming the "Tech Island" of the Mediterranean.
- **Medicine**: High-fidelity medical facilities with much lower tuition than the UK or US.

### The Cost of Living: Real Talk
In 2025, you can live comfortably in Cyprus on about **€600 to €900 a month**. This covers rent (especially in shared student accommodation), groceries, and transport. UniCou Ltd always suggests university-managed housing as the smartest way to save.

### The Erasmus+ Secret
Because Cyprus is in the EU, you have access to the **Erasmus+ program**. You can spend a semester in Italy or Germany while paying your regular Cyprus tuition—a fantastic way to "level up" your degree.

### How UniCou Ltd Makes it Happen
UniCou Ltd helps you find the right school, handles the "scary" visa and migration paperwork, and stays with you until the day you graduate.

### Final Thoughts: 2025 is Your Year
The way we study is changing. Cyprus offers a chance to earn a European degree and gain international experience without breaking the bank. Stop dreaming and start planning your future in the sun.`, 
    heroImage: 'https://images.unsplash.com/photo-1543233446-24835824c041?w=1200', 
    costOfLiving: '€7,000/yr', 
    visaRequirements: 'Residence Permit (Pink Slip)' 
  },
  {
    id: 'germany',
    countryId: 'germany',
    slug: 'germany',
    title: 'Study in Germany',
    content: `Let’s be real for a second. If you’ve been looking into studying abroad, Germany has definitely popped up on your radar. It’s the "engine" of Europe, the land of precision engineering, and most importantly for students—it’s one of the few places left where you can get a world-class education without graduating with a mountain of debt.

But here is the thing: Germany is changing. As we head into 2025/2026, the rules for international students are becoming more digital, but also more specific. At UniCou Ltd, we live and breathe German education. We know that the paperwork can be intimidating, but we are here to help you navigate it.

### Why Germany is the "Smart" Move for 2025

In 2025, the global education market is getting more competitive. Germany stands out because it has managed to keep its costs down while pushing its academic standards up. 

- **Public vs. Private Universities**: Most public universities are tuition-free (with low admin fees) but highly competitive. Private universities charge fees but offer more flexibility and English-taught programs.
- **Blocked Account (Sperrkonto)**: Mandatory for your visa. For 2025, the German government adjusted the monthly requirement for inflation. Expect to deposit roughly **€11,904 to €12,200** for your first year.
- **Working While You Study**: International students are typically allowed to work **140 full days or 280 half days** per year. With a massive labor shortage, finding a "Minijob" or "Werkstudent" position is easier than ever.

### Navigating the 2025 Student Visa

Germany is moving toward a more digital visa process for 2025, but the "intent" is still what matters most. 
When you work with UniCou Ltd, we focus on your **Statement of Purpose (SOP)**. A "copy-paste" SOP won't cut it. You need to explain why Germany, why that specific course, and how it connects to your career. 

### High-Demand Fields for 2025
If you want to stay in Germany after you graduate, be strategic. The German "Green List" of in-demand jobs includes:
- **Engineering**: Civil, Mechanical, and Electrical. 
- **IT & Cybersecurity**: Desperate need for coders and data scientists.
- **Healthcare**: Nursing and medical research demand is at an all-time high.
- **Renewable Energy**: Germany is a leader in "Energiewende" (Energy Transition).

### The 18-Month Post-Study Work Visa
This is the "Golden Ticket." Once you finish your degree, you can apply for an **18-month job seeker visa**. During this period, you can work any job while looking for a professional role related to your degree, eventually switching to a **Blue Card (EU)**.

### Language: Do You Really Need German?
While many Master's programs are in English, for a successful career in 2025, you need the language. UniCou Ltd highly recommends reaching at least **B1 level**.

### Common 2025 Pitfalls to Avoid
- **Late Health Insurance**: Proof of German insurance is mandatory for enrollment.
- **Incomplete APS Certificate**: Mandatory for students from India, China, or Vietnam.
- **Missing Deadlines**: German universities are strictly punctual.

### How UniCou Ltd Strategizes for You
We help with university shortlisting, blocked account support, visa coaching (including mock interviews), and on-arrival guidance. Germany in 2025 is a land of immense opportunity, but it rewards the well-prepared.`,
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200',
    costOfLiving: '€11,904/yr',
    visaRequirements: 'Student Visa (APS Required)'
  },
  {
    id: 'italy',
    countryId: 'italy',
    slug: 'italy',
    title: 'Study in Italy',
    content: `The Secret to an Affordable, World-Class European Education. When you think of Italy, your mind probably goes straight to pizza, the Colosseum, and wandering through cobblestone streets. But for students looking toward 2025/2026, Italy is becoming famous for something else: being one of the most affordable and high-quality study destinations in the world.

If you’ve been dreaming of a European degree but the tuition fees in the UK or the USA have made your jaw drop, Italy is your answer. At UniCou Ltd, we’ve helped countless students navigate the "Italian maze." It’s a country that rewards those who know the system.

### The "Income-Based" Tuition Secret
In Italy, public universities operate on a system called **ISEE**. Essentially, they look at your family's financial background, and your tuition fees are adjusted accordingly.
For 2025/2026, many international students will find that their tuition fees at top-tier public universities range from **€500 to €3,000 per year**. That is not a typo. At UniCou Ltd, we guide you through the ISEE documentation process so you can claim the lowest possible fee.

### The 2025/2026 Pre-Enrollment & Universitaly Portal
If you want to study in Italy in 2025, you need to get familiar with the **Universitaly portal**. This is the centralized gateway for all international students.
The latest rules have made this process even more digital. You don’t just apply to the university; you must complete a "Pre-Enrollment" request on this portal. Our team at UniCou Ltd manages your Universitaly profile to ensure your application is airtight.

### Scholarships: The "DSU" Advantage
Italy offers some of the most generous regional scholarships in Europe, known as **DSU (Diritto allo Studio Universitario)**. For the 2025/2026 intake, these scholarships aren't just based on your grades—they are based on financial need.
If you qualify, you could get:
- **Zero tuition fees**.
- **A free meal a day** at the university canteen.
- **A yearly stipend** of roughly €5,000 to €7,000 to cover your living costs.

### Entrance Exams: IMAT, TOLC, and Beyond
Italy is very big on entrance exams. If you want to study Medicine in English, you’ll need to ace the **IMAT**. For Engineering or Economics, you might need a **TOLC** or **SAT** score. UniCou Ltd provides prep resources and booking assistance for these exams.

### The 2025/2026 Italian Student Visa (Type D)
The Italian student visa is a "National Visa" for stays longer than 90 days. For 2025, you will need to show that you have roughly **€6,500 to €7,500** for the year for living expenses. Visa officers also require proof of accommodation, which can be tricky in busy cities like Milan or Rome.

### Working While You Study & Post-Study Rights
In 2025, international students in Italy are permitted to work **20 hours per week**. Once you graduate, you can apply for a **Permesso di Soggiorno per ricerca lavoro**, allowing you to stay in Italy for **12 months** after your degree to find a job related to your field. 
Italy is currently looking for talent in:
- **Automotive Engineering** (Ferrari, Lamborghini, Ducati).
- **Fashion & Design Management**.
- **Artificial Intelligence & Robotics**.
- **Sustainable Architecture**.

### Common 2025 Pitfalls to Avoid
- **The "Dichiarazione di Valore" (DoV)**: Mandatory document proving your previous education is valid.
- **Residency Permit Deadline**: Within 8 days of arriving, you must apply for your **Permesso di Soggiorno**.
- **Language**: Even if your course is in English, basic Italian is essential for daily life.

### Why Partner with UniCou Ltd?
Italy is beautiful, but the bureaucracy is famous for being "slow." UniCou Ltd acts as your local guide, helping with Universitaly Portal assistance, DOV/CIMEA guidance, and scholarship application support.`,
    heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200',
    costOfLiving: '€6,500/yr',
    visaRequirements: 'Student Visa (Type D)'
  },
  {
    id: 'sweden',
    countryId: 'sweden',
    slug: 'sweden',
    title: 'Study in Sweden',
    content: `If you’re looking to be part of a society building the future, Sweden is your destination in 2025/2026. This isn't just the land of innovation; it's a global powerhouse for Green Tech, Game Design, and Sustainability.

### The Swedish Way: "Lagom" and Collaboration
Studying in Sweden feels different. The concept of **"Lagom"** (just the right amount) reflects in an informal, collaborative education system where professors are mentors rather than authority figures. In 2025, the focus is on **Sustainable Innovation**, making graduates highly employable globally.

### The 2025/2026 Residence Permit & Financial Rules
To study in Sweden, you'll need a Residence Permit for Higher Education. For the 2025/2026 academic year, you must demonstrate proof of approximately **SEK 10,500 to 11,000 per month** for living costs. UniCou Ltd helps you audit your financial story to prevent rejections due to "unexplained deposits."

### Admissions: The "One Portal" Strategy
Sweden uses **UniversityAdmissions.se**, a centralized portal. Application deadlines are early—mid-January for the August 2025 intake. Missing this window often means waiting a full year.

### Tuition & Scholarships
For non-EU students, tuition ranges from **SEK 80,000 to SEK 295,000 per year**. 
Scholarship routes for 2025 include:
- **SI Global Professionals Scholarship**: Fully funded for future leaders.
- **University-Specific Waivers**: 25% to 75% tuition reductions for high achievers.

### Post-Study Work Visa: The 12-Month Hunt
Sweden wants you to stay. In 2025, graduates can stay for **12 months** specifically to find work. Companies like Spotify, Ericsson, and Volvo are constantly seeking international talent.

### High-Demand Careers for 2025
- **Battery Tech & Green Energy**: Northern Sweden’s gigafactories are booming.
- **IT & Software**: Stockholm remains a top producer of "unicorns."
- **Biotechnology**: Medicon Valley is a global life sciences hub.

### Working While You Study
Sweden has **no official hour limit** for student work, provided you maintain academic progress. Most students find 10-15 hours a week is the "Lagom" amount to balance intense studies.

### Why Choose UniCou Ltd for Sweden?
The Swedish system is transparent but unforgiving of document errors. We provide strategic program selection, SOP editing, and residence permit management through the Migrationsverket portal.`,
    heroImage: 'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?w=1200',
    costOfLiving: 'SEK 10,500/mo',
    visaRequirements: 'Residence Permit (Higher Education)'
  },
  {
    id: 'finland',
    countryId: 'finland',
    slug: 'finland',
    title: 'Study in Finland',
    content: `Ranked the happiest country in the world for seven years in a row, Finland offers a world-class education system where "student-life balance" is a reality. In 2025, Finland is a premier choice for students seeking innovation and equity.

### The Finnish Classroom: You are the Expert
Finnish universities are informal and focus on solving real-world problems rather than memorization. By 2025, the focus is on **"Future Skills"** like Robotics, Circular Economy, and sustainable design.

### The 2025/2026 Residence Permit: "One and Done"
Finland has perfected its **Long-term Residence Permit**. Once accepted for a full degree, your permit covers the **entire duration of your studies**. For 2025, you must demonstrate proof of approximately **€800 to €900 per month** for living costs.

### Research vs. Applied Sciences (UAS)
- **Research Universities**: Ideal for academic theory and PhD tracks.
- **Universities of Applied Sciences (UAS)**: Focus on practical skills and direct industry connections.
UniCou Ltd manages your **Studyinfo.fi** profile to meet the strict January deadlines.

### Tuition Fees & "Early Bird" Discounts
Tuition generally ranges from **€6,000 to €15,000 per year**. High achievers can access:
- **Scholarships**: Often covering 50% to 100% of tuition.
- **Early Bird Discounts**: Significant savings if fees are paid within 2-3 weeks of the offer.
- **Language Incentives**: Refunds for passing Finnish language milestones.

### Working While You Study: 30 Hours of Freedom
In 2025, international students are permitted to work an average of **30 hours per week** during semesters—one of the most generous limits in Europe.

### The 2-Year Post-Study Work Visa
Finland wants you to join its workforce. Graduates can apply for a **2-year stay-back permit**, providing ample time to secure a professional role and transition to permanent residency.

### Hot Sectors for 2025
- **ICT & Software**: The birthplace of Linux remains a tech legend.
- **Nursing & Social Care**: Critical national demand.
- **Clean Energy**: Finland aims to be carbon neutral by 2035.

### Why Choose UniCou Ltd for Finland?
Finnish applications require extreme accuracy. We provide entrance exam coaching for UAS programs, "Enter Finland" portal support, and CV polishing for the Nordic market.`,
    heroImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200',
    costOfLiving: '€850/mo',
    visaRequirements: 'Long-term Residence Permit'
  },
  {
    id: 'europe',
    countryId: 'europe',
    slug: 'europe',
    title: 'Study in Europe (Global Hub)',
    content: `If you are thinking about studying abroad in 2025/2026, you want the "European experience"—the high-quality degrees, the travel opportunities, and the global career prospects—but maybe you aren’t as keen on the sky-high tuition fees of major capitals.

If that sounds like you, let’s talk about the hidden gems of Europe. At UniCou Ltd, we don't just follow the crowd; we find the destination that actually fits you. Whether you are dreaming of historic Poland, vibrant Spain, the medical hubs of Hungary, or the business prestige of France, Europe in 2025 is an open door.

### The "New" European hotspots for 2025
In 2025, students are moving away from overcrowded capitals and looking for places where their budget goes further:
- **Poland**: The rising star of Central Europe. Excellent Engineering and English-taught medical programs for a fraction of Western costs.
- **Hungary**: Arguably the best-value destination for Medicine, Dentistry, and Veterinary Science globally.
- **Spain**: A massive network of private business schools ranked top-tier for Business and Tourism.
- **France**: Powerhouse "Grande Écoles" in regional cities like Lyon and Toulouse are now offering more English-taught programs than ever.

### Navigating the 2025 Digital Visa Shift
If you are planning your move for 2025, you need to know about **ETIAS**. While primarily for visa-exempt travelers, it reflects a wider shift toward digital borders. For visa-required students, the process is becoming streamlined, with most nations moving toward digital document uploads.

### The 2025 Financial Strategy
Inflation across Europe has stabilized, but you still need a smart budget. In Poland or Hungary, you can live on **€500 to €700 a month**. Spain or France might require **€800 to €1,100**. The "Proof of Funds" requirement averages around **€9,000 to €11,000 per year**. The secret? Look for "Student Cities" like Poznań or Valencia, where rent is 40% cheaper than in the capital.

### Scholarships: Europe’s Gift to Global Talent
- **Stipendium Hungaricum**: Massive scholarship covering tuition and living costs in Hungary.
- **Erasmus+ Program**: Spend a semester in another country fully funded by the EU.
- **UniCou Ltd Scholarship Hunt**: We find university-specific waivers that slash tuition by 25% to 50%.

### Work Rights & Post-Study Visas
Almost every European country allows international students to work **20 hours per week**. After graduation:
- **Spain & France**: 12-month stay-back permits.
- **Poland**: 9-month stay-back permit.
- **Blue Card (EU)**: The fastest route to working across the entire European Union.

### Studying in English
For 2025, there are over **10,000 English-taught programs** across the continent. While we encourage learning basic "coffee shop" local language, your degree will be 100% in English.

### Why Partner with UniCou Ltd?
Applying to study in Europe can feel like a maze. UniCou Ltd acts as your personal navigator, building strategies for university shortlisting, document verification (apostilles), and visa mastery.`,
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200',
    costOfLiving: '€500 - €1,100/mo',
    visaRequirements: 'Schengen Student Visa'
  },
  {
    id: 'dubai',
    countryId: 'dubai',
    slug: 'dubai',
    title: 'Study in Dubai (UAE)',
    content: `If you’re a student who thrives on energy and innovation, Dubai is your launchpad for 2025/2026. Imagine studying in a city where the world’s tallest buildings and most advanced AI labs are your neighbors. Dubai has officially become a "Knowledge Economy," offering a safe, ultra-modern environment with direct access to global job markets.

### The Dubai Edge: Global Degrees, Tax-Free Hub
One of the best models for 2025 is the "International Branch Campus." Study at world-renowned universities from the UK, Australia, and the USA—like Heriot-Watt or Murdoch—right in Dubai. You receive the exact same degree certificate as in London or Sydney, but in a tax-free, sun-soaked city.

### The 2025/2026 Dubai Student Visa
The UAE has made the student visa process remarkably efficient. Universities typically act as sponsors, handling the bulk of the paperwork. For 2025, you'll need:
- **Valid Offer Letter** from a licensed institution.
- **Medical Fitness Test** upon arrival.
- **Proof of Funds**: Flexible requirements that UniCou Ltd helps you audit for success.

### The "Golden Visa" for Excellence
For 2025, the UAE is expanding its **10-Year Golden Visa** for "Outstanding Students" (typically a GPA of 3.75+). This offers long-term residency without a sponsor—a game-changer for building a global career in the Emirates.

### Working While You Study
In 2025, international students are permitted part-time jobs and internships with a "No Objection Certificate" (NOC). Most importantly: **There is no personal income tax in Dubai.** 

### High-Demand Careers for 2025
- **Fintech & Blockchain**: Dubai is aiming to be the world’s crypto capital.
- **Tourism & Hospitality**: Endless demand in a top global destination.
- **Artificial Intelligence**: Supported by a dedicated national ministry.
- **Logistics**: The heart of global trade with DP World and Emirates SkyCargo.

### Cost of Living & The "Global Gateway"
Live in a city where 80% of the population is international. Budget for **AED 2,500 to 4,500 per month** for housing. Use the world-class Metro with a student **Blue Nol Card** for 50% off fares.

### Why Choose UniCou Ltd for Dubai?
We are your local insiders. We handle university shortlisting, visa liaison, and scholarship mapping (often securing 20-50% merit waivers). Dubai in 2025 is the capital of what’s next.`,
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200',
    costOfLiving: 'AED 3,500/mo',
    visaRequirements: 'Student Residence Visa'
  },
  {
    id: 'malaysia',
    countryId: 'malaysia',
    slug: 'malaysia',
    title: 'Study in Malaysia',
    content: `Kuala Lumpur is the "smart" destination for 2025/2026 studies. If you want a prestigious global degree but need to stick to a budget, Malaysia offers an unbeatable combination of Western quality and Southeast Asian affordability.

### The "Branch Campus" Hack: 70% Cheaper
The biggest secret is the presence of heavyweights like **Monash (Australia)** and **Nottingham (UK)**. You study the same curriculum and receive the exact same certificate as the home campus, but with tuition and living costs slashed by up to 70%.

### The 2025/2026 EMGS Digital Visa
Managed by Education Malaysia Global Services (EMGS), the "e-VAL" system is now 100% digital. UniCou Ltd manages your portal for a fast **14–21 day approval**. You'll need proof of first-year tuition and roughly **USD $4,000 to $5,000** for living expenses.

### Working & Internships
While limited to 20 hours/week during breaks, the **Digital Nomad and Internship** culture is booming. Many students secure stipends in **Cyberjaya** (Malaysia’s Silicon Valley) that cover their entire rent.

### High-Demand Careers for 2025
- **Semiconductors**: A global leader in chip testing.
- **Fintech & Islamic Finance**: The world capital for Shariah-compliant digital finance.
- **Data Science**: Massive data center growth in Johor and Selangor.

### Affordable Luxury Lifestyle
Live like a king on a student budget. Luxury condo rooms with pools range from **USD $150 to $350** a month. Use the ultra-modern LRT/MRT systems with student discounts.

### Why Choose UniCou Ltd for Malaysia?
We help you choose between local powerhouses (Taylor’s, Sunway) and branch campuses, handle the EMGS liaison, and map out 20-50% international grants. Malaysia in 2025 is where global education has no borders.`,
    heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc183f27?w=1200',
    costOfLiving: 'USD $500/mo',
    visaRequirements: 'Student Pass (e-VAL)'
  },
  {
    id: 'turkey',
    countryId: 'turkey',
    slug: 'turkey',
    title: 'Study in Turkey',
    content: `Bridge the gap between history and the future in 2025/2026. Turkey is a full member of the **Bologna Process**, meaning your Turkish degree in Medicine, Engineering, or Architecture is recognized across the entire European Higher Education Area.

### European Standards, Mediterranean Soul
Turkey is doubling down on **English-taught programs** in 2025. Choose between prestigious State Universities (nearly zero fees) or high-tech Private Foundation Universities in Istanbul, Ankara, or Izmir.

### The 2025/2026 Residence Permit (Ikamet)
The process is now digitized via **GÖÇ İDARESİ**. For 2025, you'll need a valid acceptance letter and proof of roughly **USD $5,000 to $7,000** for your first year. Many universities now host residency interviews directly on campus for your convenience.

### Work Rights & The "New Economy"
Work part-time (up to 20 hours/week) while tapping into Turkey’s massive hubs for Textile Design, E-commerce, and International Trade. Istanbul is a booming tech district where English, Arabic, and French speakers are in high demand.

### High-Demand Sectors for 2025
- **Architecture**: Construction firms here build the world's skyscrapers.
- **Medicine**: With a health tourism boom, a medical degree here is a golden ticket.
- **E-commerce**: Home to giants like Trendyol and Getir.

### The 2025 "Turkiye Scholarships" (Bursları)
One of the world's most generous programs. It covers:
- **100% Tuition**.
- **Monthly Stipend & Accommodation**.
- **Turkish Language Training & Insurance**.
UniCou Ltd provides coaching for the critical January/February application window.

### Cultural Intelligence
Living in Turkey builds the ability to navigate different worlds at once. From the Grand Bazaar to high-tech libraries, it changes how you see the world.

### Why Choose UniCou Ltd for Turkey?
We handle the technical "Denklik" (Diploma Equivalence) process, secure exclusive tuition discounts at foundation universities, and help you find safe, student-friendly housing. Cross the bridge to your future in 2025.`,
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200',
    costOfLiving: 'USD $400/mo',
    visaRequirements: 'Student Residence Permit (Ikamet)'
  }
];

export const universities: University[] = [
  { id: 'uni-manchester', name: 'University of Manchester', slug: 'manchester', location: 'Manchester, UK', ranking: 32, description: 'Global research powerhouse.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' },
  { id: 'uni-sydney', name: 'University of Sydney', slug: 'sydney', location: 'Sydney, Australia', ranking: 19, description: 'Leaders in healthcare and tech.', logo: 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?w=200', countryId: 'australia', website: 'https://www.sydney.edu.au' },
  { id: 'uni-toronto', name: 'University of Toronto', slug: 'toronto', location: 'Toronto, Canada', ranking: 21, description: 'Canada\'s top-ranked university.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'canada', website: 'https://www.utoronto.ca' },
  { id: 'uni-auckland', name: 'University of Auckland', slug: 'auckland', location: 'Auckland, NZ', ranking: 65, description: 'New Zealand\'s highest-ranked university.', logo: 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?w=200', countryId: 'new-zealand', website: 'https://www.auckland.ac.nz' },
  { id: 'uni-tcd', name: 'Trinity College Dublin', slug: 'tcd', location: 'Dublin, Ireland', ranking: 81, description: 'Ireland\'s oldest and most prestigious university.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'ireland', website: 'https://www.tcd.ie' },
  { id: 'uni-nicosia', name: 'University of Nicosia', slug: 'nicosia', location: 'Nicosia, Cyprus', ranking: 501, description: 'The largest university in Southern Europe that teaches primarily in English.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'cyprus', website: 'https://www.unic.ac.cy' },
  { id: 'uni-tum', name: 'Technical University of Munich', slug: 'tum', location: 'Munich, Germany', ranking: 37, description: 'The Entrepreneurial University and top choice for engineering.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'germany', website: 'https://www.tum.de' },
  { id: 'uni-bologna', name: 'University of Bologna', slug: 'bologna', location: 'Bologna, Italy', ranking: 133, description: 'The oldest university in the Western world, offering prestige and diverse English programs.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'italy', website: 'https://www.unibo.it' },
  { id: 'uni-kth', name: 'KTH Royal Institute of Technology', slug: 'kth', location: 'Stockholm, Sweden', ranking: 73, description: 'Sweden\'s largest and most respected technical university.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'sweden', website: 'https://www.kth.se' },
  { id: 'uni-aalto', name: 'Aalto University', slug: 'aalto', location: 'Espoo, Finland', ranking: 109, description: 'A unique community where science and art meet technology and business.', logo: 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?w=200', countryId: 'finland', website: 'https://www.aalto.fi' },
  { id: 'uni-warsaw', name: 'University of Warsaw', slug: 'warsaw', location: 'Warsaw, Poland', ranking: 262, description: 'Poland\'s largest and one of the most prestigious universities with extensive English-taught tracks.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'europe', website: 'https://www.uw.edu.pl' },
  { id: 'uni-heriot-dubai', name: 'Heriot-Watt University Dubai', slug: 'heriot-dubai', location: 'Dubai, UAE', ranking: 235, description: 'A global university providing world-class education with UK accreditation.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'dubai', website: 'https://www.hw.ac.uk/dubai' },
  { id: 'uni-monash-malaysia', name: 'Monash University Malaysia', slug: 'monash-malaysia', location: 'Selangor, Malaysia', ranking: 42, description: 'Top-tier Australian research university excellence in the heart of Southeast Asia.', logo: 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?w=200', countryId: 'malaysia', website: 'https://www.monash.edu.my' },
  { id: 'uni-istanbul-tech', name: 'Istanbul Technical University', slug: 'istanbul-tech', location: 'Istanbul, Turkey', ranking: 404, description: 'One of the world\'s oldest technical universities, leading Turkey\'s modern engineering landscape.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'turkey', website: 'https://www.itu.edu.tr' }
];

export const courses: Course[] = [
  { id: 'c-1', universityId: 'uni-manchester', title: 'MSc Data Science', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£28,000', description: 'Advanced analytics and machine learning.' },
  { id: 'c-2', universityId: 'uni-sydney', title: 'Bachelor of Nursing', degree: 'Undergraduate', duration: '3 Years', tuitionFee: 'AUD $42,000', description: 'Priority healthcare pathway.' },
  { id: 'c-3', universityId: 'uni-toronto', title: 'Masters in Applied Computing (AI)', degree: 'Postgraduate', duration: '16 Months', tuitionFee: 'CAD $38,000', description: 'Silicon Valley North pathway.' },
  { id: 'c-4', universityId: 'uni-auckland', title: 'Master of Engineering Studies', degree: 'Postgraduate', duration: '1 Year', tuitionFee: 'NZD $46,000', description: 'Green List structural engineering pathway.' },
  { id: 'c-5', universityId: 'uni-tcd', title: 'MSc Computer Science (Data Science)', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '€22,500', description: 'Dublin tech hub career accelerator.' },
  { id: 'c-6', universityId: 'uni-nicosia', title: 'MSc Blockchain & Digital Currency', degree: 'Postgraduate', duration: '1.5 Years', tuitionFee: '€12,500', description: 'World-first program in the Mediterranean tech hub.' },
  { id: 'c-7', universityId: 'uni-tum', title: 'MSc Robotics, Cognition, Intelligence', degree: 'Postgraduate', duration: '2 Years', tuitionFee: '€0 (Public)', description: 'Cutting-edge AI and robotics in Germany\'s tech heart.' },
  { id: 'c-8', universityId: 'uni-bologna', title: 'International Medical Admissions Test (IMAT) Prep', degree: 'Undergraduate', duration: '6 Years', tuitionFee: 'Variable (ISEE)', description: 'Medicine and Surgery program taught entirely in English.' },
  { id: 'c-9', universityId: 'uni-kth', title: 'MSc Machine Learning', degree: 'Postgraduate', duration: '2 Years', tuitionFee: 'SEK 155,000/yr', description: 'Top-tier tech program in the heart of Stockholm\'s startup scene.' },
  { id: 'c-10', universityId: 'uni-aalto', title: 'MSc Sustainable Energy in Buildings', degree: 'Postgraduate', duration: '2 Years', tuitionFee: '€15,000/yr', description: 'Practical innovation for the carbon-neutral goal of 2035.' },
  { id: 'c-11', universityId: 'uni-warsaw', title: 'MSc International Business Program', degree: 'Postgraduate', duration: '2 Years', tuitionFee: '€4,500/yr', description: 'Highly affordable, top-quality business training in the heart of Central Europe.' },
  { id: 'c-dubai-fintech', universityId: 'uni-heriot-dubai', title: 'MSc Financial Technology', degree: 'Postgraduate', duration: '1 Year', tuitionFee: 'AED 85,000', description: 'Leading program for the world\'s future crypto capital.' },
  { id: 'c-malaysia-business', universityId: 'uni-monash-malaysia', title: 'Bachelor of Business', degree: 'Undergraduate', duration: '3 Years', tuitionFee: 'MYR 45,000/yr', description: 'Australian-standard business degree with global recognition.' },
  { id: 'c-turkey-civil', universityId: 'uni-istanbul-tech', title: 'BSc Civil Engineering', degree: 'Undergraduate', duration: '4 Years', tuitionFee: 'USD $3,500/yr', description: 'Accredited engineering program at a global construction hub.' }
];

export const qualifications: Qualification[] = [
  { id: 'q-1', title: 'OTHM Level 3 Foundation Diploma', qualificationBody: 'OTHM', level: 'Level 3', duration: '6 Months', tuitionFees: '£1,200', description: 'Entry path to UK universities.', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', requirements: ['High School'] }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'lms-1', title: 'PTE Academic Masterclass', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', description: 'Complete prep.', duration: '40 Hours', instructor: 'Dr. Sarah', price: 99 }
];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'full-mock-1',
    title: 'PTE Full Mock Exam A',
    sections: [
      { id: 's-1', title: 'Speaking & Writing', skill: 'Speaking', timeLimit: 77, questions: [] }
    ]
  }
];

export const immigrationGuides: ImmigrationGuideData[] = [
  { id: 'ig-uk', slug: 'uk-pr', title: 'UK PR Pathways', content: 'Skilled worker routes.', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', pathways: [] }
];
