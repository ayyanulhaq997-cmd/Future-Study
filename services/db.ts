
import { Product, VoucherCode, User, University, CountryGuide, UserRole, Course, Qualification, LMSCourse, LMSPracticeTest, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'Zeeshan (Admin)', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, status: 'Active' },
  { id: 'u-trainer', name: 'Lead Trainer Node', email: 'trainer@unicou.uk', role: 'Lead Trainer', isAuthorized: true, status: 'Active' },
  { id: 'u-finance', name: 'Finance Node 1', email: 'finance@unicou.uk', role: 'Finance/Audit Team', isAuthorized: true, status: 'Active' },
  { id: 'u-sales', name: 'Sales Executive', email: 'sales@unicou.uk', role: 'Support/Sales Node', isAuthorized: true, status: 'Active' },
  { id: 'u-manager', name: 'Operations Lead', email: 'manager@unicou.uk', role: 'Operation Manager', isAuthorized: true, status: 'Active' },
  { id: 'u-agent', name: 'Partner Hub', email: 'partner@unicou.uk', role: 'Agent Partner/Prep Center', tier: 2, isAuthorized: true, status: 'Active' },
  { id: 'u-student', name: 'Alex Smith', email: 'alex@gmail.com', role: 'Student', isAuthorized: true, status: 'Active' },
];

export const products: Product[] = [
  { id: 'v-1', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', pricingModel: 'Country-Wise', description: 'British Council/IDP Official.', icon: '🌐' },
  { id: 'v-6', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Pearson Official Standard.', icon: '📊' },
  { id: 'v-19', name: 'TOEFL iBT Official', category: 'ETS', type: 'Voucher', basePrice: 195, currency: 'USD', pricingModel: 'Country-Wise', description: 'ETS TOEFL iBT Global.', icon: '🌎' },
  { id: 'v-20', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 60, currency: 'USD', pricingModel: 'Global', description: 'Duolingo Access.', icon: '🦉' },
  { id: 'v-21', name: 'Oxford ELLT Voucher', category: 'Oxford ELLT', type: 'Voucher', basePrice: 120, currency: 'GBP', pricingModel: 'Global', description: 'Oxford International Digital.', icon: '🎓' },
  { id: 'v-22', name: 'Password Skills Plus', category: 'Password', type: 'Voucher', basePrice: 110, currency: 'GBP', pricingModel: 'Global', description: 'Secure English Language Test.', icon: '🔑' },
  { id: 'v-23', name: 'GRE General Voucher', category: 'ETS', type: 'Voucher', basePrice: 220, currency: 'USD', pricingModel: 'Global', description: 'ETS GRE Official.', icon: '📝' },
  { id: 'v-24', name: 'LanguageCert Academic', category: 'LanguageCert', type: 'Voucher', basePrice: 180, currency: 'USD', pricingModel: 'Global', description: 'LanguageCert International Academic Exam.', icon: '📜' },
  { id: 'v-25', name: 'LanguageCert International ESOL', category: 'LanguageCert', type: 'Voucher', basePrice: 170, currency: 'USD', pricingModel: 'Global', description: 'Secure English Language Test (SELT).', icon: '🗣️' },
  { id: 'v-26', name: 'Skills for English (SELT)', category: 'Skills for English', type: 'Voucher', basePrice: 175, currency: 'GBP', pricingModel: 'Global', description: 'PSI Global Skills for English.', icon: '🎯' },
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
    content: `The United Kingdom remains the global gold standard for international education. With a rich history of academic excellence and home to some of the world's oldest and most prestigious universities, the UK offers students an unparalleled environment for growth. 

### Why Study in the UK?
- **World-Class Institutions:** Home to Russell Group universities like Oxford, Cambridge, UCL, and Manchester.
- **Short Duration Degrees:** Most Undergraduate degrees are 3 years and Master's degrees are 1 year, saving time and money.
- **Post-Study Work (PSW):** The Graduate Route allows international students to stay and work for 2 years (3 years for PhD) after completion.
- **Global Recognition:** UK degrees are respected by employers and governments worldwide.

### Admission Protocol & Vouchers
To secure admission in 2025/2026, students must demonstrate English proficiency. UniCou provides official vouchers for **PTE Academic**, **IELTS**, and **Oxford ELLT** to streamline this process. Most universities require an overall IELTS score of 6.0-6.5 or equivalent.

### Living & Cost Dynamics
The UK offers a diverse cultural landscape. While London remains the hub, cities like Manchester, Birmingham, and Glasgow offer more affordable living options. Students can work part-time up to 20 hours per week during term time.`, 
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,100 - £1,400/mo', 
    visaRequirements: 'Student Visa (CAS Required)' 
  },
  { 
    id: 'australia', 
    countryId: 'australia', 
    slug: 'australia', 
    title: 'Study in Australia', 
    content: `Australia is a leading global destination for international students, known for its high-quality education, vibrant lifestyle, and excellent post-graduation opportunities. The country boasts a robust education system governed by strict quality standards.

### The Australian Advantage
- **Research Excellence:** Australia is at the forefront of innovation in medicine, technology, and environmental sciences.
- **Work Rights:** Graduates of Australian institutions are eligible for the Subclass 485 Temporary Graduate visa, which offers extended work rights.
- **Quality of Life:** Cities like Sydney, Melbourne, and Brisbane consistently rank among the most liveable in the world.
- **Global Standards:** The ESOS Act ensures the protection of international students' interests and rights.

### Entry Requirements
Students typically need to meet the Genuine Student (GS) requirement. English proficiency via **PTE Academic** or **IELTS** is mandatory. UniCou facilitates these exam procurements through our secure node. Undergraduate applicants usually require a 12-year education foundation.

### Financial Planning
Australia offers a high standard of living, which comes with corresponding costs. However, high minimum wages for part-time work help students manage their expenses effectively.`, 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: '$1,800 - $2,200 AUD/mo', 
    visaRequirements: 'Subclass 500 Student Visa' 
  },
  { 
    id: 'usa', 
    countryId: 'usa', 
    slug: 'usa', 
    title: 'Study in USA', 
    content: `The United States of America offers the most diverse and flexible education system in the world. From Ivy League universities to large state colleges and community colleges, the USA provides a path for every type of student.

### Academic Innovation
- **Diverse Coursework:** The US system allows students to explore multiple subjects before choosing a major.
- **STEM OPT Extension:** Science, Technology, Engineering, and Math graduates can work in the US for up to 3 years post-study.
- **Cutting-Edge Facilities:** US universities invest billions in research and development, providing students with world-class labs.
- **Campus Culture:** Experience a dynamic social environment with thousands of clubs and organizations.

### Secure Your F-1 Visa
The application process for the USA is rigorous. Students must obtain an I-20 form before applying for the F-1 visa. **TOEFL iBT** and **PTE Academic** are widely accepted across all 50 states. UniCou provides the necessary exam vouchers for these tests.

### Funding & Scholarships
While US education can be expensive, it offers the most significant amount of financial aid and merit-based scholarships globally. Contact our consultancy node for a strategic mapping of affordable US colleges.`, 
    heroImage: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1200', 
    costOfLiving: '$1,500 - $2,500/mo', 
    visaRequirements: 'F-1 Student Visa (SEVIS)' 
  },
  { 
    id: 'canada', 
    countryId: 'canada', 
    slug: 'canada', 
    title: 'Study in Canada', 
    content: `Canada has emerged as a top choice for students due to its welcoming culture, high academic standards, and clear pathways to Permanent Residency (PR). 

### Why Choose Canada?
- **Path to PR:** The Post-Graduation Work Permit (PGWP) is a direct route to gaining Canadian work experience, which is crucial for PR applications.
- **Affordability:** Tuition fees in Canada are generally more affordable than in the UK or the USA.
- **Safety & Inclusion:** Consistently ranked as one of the safest and most multicultural countries.
- **Natural Beauty:** Study amidst stunning landscapes, from the Rocky Mountains to the Atlantic coast.

### SDS & Language Requirements
The Student Direct Stream (SDS) offers faster processing for students from specific countries. A high **IELTS Academic** or **PTE Academic** score is essential for a successful study permit application. UniCou's voucher vault ensures you get these codes at the best rates.

### Life in Canada
Canada offers a high quality of life with excellent healthcare and social services. Students are permitted to work off-campus while studying.`, 
    heroImage: 'https://images.unsplash.com/photo-1517935703635-27c736ec3b97?w=1200', 
    costOfLiving: '$1,200 - $1,800 CAD/mo', 
    visaRequirements: 'Study Permit (SDS Available)' 
  },
  { 
    id: 'new-zealand', 
    countryId: 'nz', 
    slug: 'new-zealand', 
    title: 'Study in New Zealand', 
    content: `New Zealand offers a unique blend of high-quality education and an adventurous lifestyle. It is a peaceful, safe, and innovative country that welcomes international students with open arms.

### Unique Benefits
- **Quality Assurance:** All New Zealand universities are ranked in the top 3% globally.
- **Sustainability Focus:** Leading the world in environmental science and agricultural research.
- **Work-Study Balance:** Excellent opportunities for part-time work and post-study work visas.
- **Safe Environment:** Consistently ranked in the top 5 of the Global Peace Index.

### Admissions Gateway
To study in NZ, you must prove your English capability. **IELTS** and **PTE** are the primary accepted tests. Our platform provides instant vouchers for these exams. You will also need to show sufficient funds for maintenance.

### Living in Aotearoa
New Zealand's cities are compact and friendly. The cost of living is comparable to Australia but offers a more relaxed pace of life.`, 
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200', 
    costOfLiving: '$1,500 - $1,900 NZD/mo', 
    visaRequirements: 'Fee Paying Student Visa' 
  },
  { 
    id: 'ireland', 
    countryId: 'ireland', 
    slug: 'ireland', 
    title: 'Study in Ireland', 
    content: `Ireland, the "Emerald Isle," is a tech hub and one of the fastest-growing economies in Europe. It offers a rich cultural heritage alongside a modern, innovative education system.

### The Irish Advantage
- **Tech Hub of Europe:** Home to the European headquarters of Google, Meta, Apple, and Intel.
- **English-Speaking:** One of the few English-speaking countries in the Eurozone.
- **Stay-Back Option:** The Third Level Graduate Scheme allows Master's students to stay for 2 years to find work.
- **Friendly Culture:** Famous for its hospitality and safety.

### English Nodes
Irish universities have high standards for English proficiency. **Duolingo English Test** and **PTE Academic** are increasingly popular. UniCou's automated vault provides these vouchers with node-to-node security.

### Costs & Career
While Dublin can be expensive, other cities like Cork, Galway, and Limerick offer great value. The employment market for graduates is exceptionally strong in STEM and Finance.`, 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200', 
    costOfLiving: '€1,000 - €1,500/mo', 
    visaRequirements: 'Study Visa (Stamp 2)' 
  },
  { 
    id: 'germany', 
    countryId: 'germany', 
    slug: 'germany', 
    title: 'Study in Germany', 
    content: `Germany is the economic engine of Europe and a global leader in engineering and technology. It offers world-class education with a focus on practical application and research.

### German Excellence
- **Low Tuition Fees:** Most public universities offer tuition-free education even for international students (only semester fees apply).
- **Strong Economy:** Abundant job opportunities for skilled graduates.
- **18-Month Job Seeker Visa:** Graduates can stay for a year and a half to secure employment.
- **Central Europe Hub:** Ideally located for exploring the entire European continent.

### Admission Strategy
Most Master's programs are taught in English, but basic German knowledge is an asset. You will need an **IELTS** or **PTE** certificate to apply. UniCou handles your voucher needs instantly. A "Blocked Account" is a mandatory visa requirement to show living funds.

### Living & Integration
Germany offers a high standard of living. Student life is affordable, especially in cities outside of Munich or Berlin.`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€950 - €1,100/mo', 
    visaRequirements: 'National Visa (Blocked Account)' 
  },
  { 
    id: 'italy', 
    countryId: 'italy', 
    slug: 'italy', 
    title: 'Study in Italy', 
    content: `Italy is a land of art, culture, and ancient academic tradition. It offers a unique educational experience, particularly in design, fashion, architecture, and medicine.

### Cultural Majesty
- **Historic Universities:** Home to the University of Bologna, the oldest university in the Western world.
- **Affordability:** Low tuition fees and generous DSU scholarships.
- **Fashion & Design Capital:** Unmatched opportunities for students in creative fields.
- **Mediterranean Lifestyle:** World-famous cuisine and climate.

### Voucher Access
English-taught programs are expanding rapidly in Italy. Prepare for the **IMAT** (for medicine) or standard proficiency tests like **IELTS**. Get your vouchers from the UniCou store to avoid local gateway issues.

### Financial Support
The DSU regional grants can cover tuition and provide free meals and accommodation for eligible international students.`, 
    heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200', 
    costOfLiving: '€800 - €1,200/mo', 
    visaRequirements: 'National Visa Type D' 
  },
  { 
    id: 'sweden', 
    countryId: 'sweden', 
    slug: 'sweden', 
    title: 'Study in Sweden', 
    content: `Sweden is known for its innovation, sustainability, and high standard of equality. It is a pioneer in green technology and digital design.

### Innovation Leadership
- **Creative Learning:** Swedish education encourages critical thinking and collaboration.
- **Home of Global Brands:** IKEA, Spotify, H&M, and Volvo all started here.
- **Sustainability Focus:** Leading the world in renewable energy research.
- **Quality of Life:** Safe, clean, and highly efficient social systems.

### Application Protocol
Sweden has a centralized application system. English tests like **PTE** and **IELTS** are mandatory. Use UniCou's verified vouchers for your application.

### The Nordic Experience
Living costs are higher than in Southern Europe, but the quality of infrastructure and services is world-class.`, 
    heroImage: 'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?w=1200', 
    costOfLiving: '€900 - €1,300/mo', 
    visaRequirements: 'Residence Permit for Study' 
  },
  { 
    id: 'finland', 
    countryId: 'finland', 
    slug: 'finland', 
    title: 'Study in Finland', 
    content: `Finland is consistently ranked as the happiest country in the world and has one of the most innovative education systems globally.

### Nordic Success
- **Student-Centric:** Focus on well-being and practical skills.
- **Tech Innovation:** A hub for mobile gaming and cybersecurity.
- **Post-Study Work:** Generous work permit options for graduates.
- **Beautiful Nature:** Experience the Northern Lights and pristine wilderness.

### Requirements Node
International students usually need to pay tuition fees, but many scholarships are available. An **IELTS** or **PTE** score is a standard entry node. Procure your vouchers securely through UniCou.

### Finnish Life
Life in Finland is organized and peaceful. The education system is designed to help students succeed in the global market.`, 
    heroImage: 'https://images.unsplash.com/photo-1528150232491-1250268571f5?w=1200', 
    costOfLiving: '€800 - €1,100/mo', 
    visaRequirements: 'Student Residence Permit' 
  },
  { 
    id: 'cyprus', 
    countryId: 'cyprus', 
    slug: 'cyprus', 
    title: 'Study in Cyprus', 
    content: `Cyprus is a beautiful island nation in the Mediterranean offering affordable education with a focus on business, tourism, and healthcare.

### Island Advantage
- **Affordability:** Some of the lowest tuition fees in Europe.
- **Gateway to Europe:** A strategic location between Europe, Asia, and Africa.
- **Quality Education:** Many institutions have partnerships with UK and US universities.
- **Perfect Climate:** Over 300 days of sunshine a year.

### Admission Hub
Admission is straightforward, often requiring **IELTS** or **LanguageCert** vouchers. UniCou supports students in securing these test codes for quick university processing.

### Lifestyle
Cyprus offers a safe and friendly environment for international students, with a low cost of living compared to the mainland.`, 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', 
    costOfLiving: '€600 - €900/mo', 
    visaRequirements: 'Student Entry Permit' 
  },
  { 
    id: 'dubai', 
    countryId: 'dubai', 
    slug: 'dubai', 
    title: 'Study in Dubai (UAE)', 
    content: `Dubai is a global city and a major hub for business, tourism, and international education. It hosts branch campuses from some of the world's most renowned universities.

### Global Business Hub
- **Branch Campuses:** Study at University of Birmingham, Murdoch, or Wollongong while living in Dubai.
- **Tax-Free Income:** Excellent part-time and post-graduate job opportunities.
- **Modern Infrastructure:** World-class facilities and a hyper-modern lifestyle.
- **Safe & Inclusive:** One of the safest cities in the world with a diverse international population.

### Academic Entry
Most universities require **IELTS** or **PTE Academic**. UniCou provides these vouchers with instant delivery. Our consultancy node can help you navigate the various university free zones.

### Living in the Future
Dubai offers an unmatched lifestyle with endless entertainment and professional networking opportunities.`, 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', 
    costOfLiving: '$1,200 - $2,000/mo', 
    visaRequirements: 'Student Residence Visa' 
  },
  { 
    id: 'malaysia', 
    countryId: 'malaysia', 
    slug: 'malaysia', 
    title: 'Study in Malaysia', 
    content: `Malaysia is a rising star in international education, offering high-quality degrees at a fraction of the cost of Western countries.

### Asian Education Hub
- **Affordability:** Low tuition fees and living costs.
- **Branch Campuses:** Home to Monash University, University of Nottingham, and more.
- **Multicultural Society:** A rich mix of cultures and cuisines.
- **English Proficiency:** English is widely spoken and used as the medium of instruction.

### Admissions Registry
To study in Malaysia, you must be verified through the EMGS portal. English tests like **PTE** and **IELTS** are essential nodes. UniCou's voucher vault is optimized for Malaysian applications.

### Vibrant Life
Malaysia offers a tropical climate and a high standard of living for students. It is a scale and welcoming destination.`, 
    heroImage: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=1200', 
    costOfLiving: '$500 - $800/mo', 
    visaRequirements: 'Student Pass (VAL)' 
  },
  { 
    id: 'turkey', 
    countryId: 'turkey', 
    slug: 'turkey', 
    title: 'Study in Turkey', 
    content: `Turkey offers a unique bridge between East and West, with a growing number of English-taught programs and high-quality universities.

### Strategic Bridge
- **Affordable Excellence:** High-quality education with low tuition fees at public universities.
- **Rich History:** Study in a country with a deep cultural and historical heritage.
- **Scholarship Opportunities:** The Türkiye Bursları program is one of the most comprehensive in the world.
- **Modern Campus Life:** Investing heavily in university infrastructure.

### Entry Protocol
Preparation for the **IELTS** or **PTE** is key to securing admission in top private and state universities. Get your exam vouchers from UniCou. Our platform is the preferred partner for Turkish university applications.

### Turkish Hospitality
Experience a warm welcome and a vibrant social life in cities like Istanbul, Ankara, and Izmir.`, 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: '$400 - $700/mo', 
    visaRequirements: 'Student Residence Permit' 
  },
  { 
    id: 'europe', 
    countryId: 'europe', 
    slug: 'europe', 
    title: 'Europe Hub Admissions', 
    content: `The UniCou Europe Hub provides a centralized admissions gateway for students looking to study in countries like Austria, Netherlands, Belgium, and beyond.

### Unified European Access
- **Schengen Benefits:** Travel freely across 27 European countries with a student visa.
- **Diverse Options:** From technical universities in the Netherlands to business schools in France.
- **Research Mobility:** Benefit from Erasmus+ and other intra-European exchange programs.
- **Career Pathways:** Access the vast European job market post-graduation.

### Language Nodes
While many programs are in English, language proficiency is strictly checked. Use our **PTE**, **IELTS**, or **LanguageCert** vouchers to meet these requirements. UniCou's helpdesk specializes in complex European visa strategy.

### Strategic Consultation
Every European country has different rules. Contact our consultancy node for a customized roadmap for your European study journey.`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€700 - €1,300/mo', 
    visaRequirements: 'National D Visa (Schengen)' 
  },
];

export const universities: University[] = [
  { id: 'uni-manchester', name: 'University of Manchester', slug: 'manchester', location: 'Manchester, UK', ranking: 32, description: 'Global research powerhouse and member of the Russell Group.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' },
  { id: 'uni-sydney', name: 'University of Sydney', slug: 'sydney', location: 'Sydney, Australia', ranking: 19, description: 'Australia oldest and one of its most prestigious universities.', logo: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=200', countryId: 'australia', website: 'https://www.sydney.edu.au' },
];

export const courses: Course[] = [
  { id: 'c-1', universityId: 'uni-manchester', title: 'MSc Data Science', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£28,000' }
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
