
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-agent', name: 'Global Partner Hub', email: 'partner@unicou.uk', role: 'Agent', tier: 2, isAuthorized: true, status: 'Active' },
  { id: 'u-institute', name: 'Uni-Connect Institute', email: 'connect@unicou.uk', role: 'Institute', isAuthorized: true, status: 'Active' },
  { id: 'u-student', name: 'Alex Smith', email: 'alex@gmail.com', role: 'Student', isAuthorized: true, status: 'Active' },
];

export const products: Product[] = [
  { id: 'v-1', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', pricingModel: 'Country-Wise', description: 'British Council/IDP Official.', icon: '🌐' },
  { id: 'v-6', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Pearson Official Standard.', icon: '📊' },
  { id: 'v-19', name: 'TOEFL iBT Official', category: 'ETS', type: 'Voucher', basePrice: 195, currency: 'USD', pricingModel: 'Country-Wise', description: 'ETS TOEFL iBT Global.', icon: '🌎' },
  { id: 'v-20', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 60, currency: 'USD', pricingModel: 'Global', description: 'Duolingo Access.', icon: '🦉' },
  { id: 'v-21', name: 'Oxford ELLT Voucher', category: 'Oxford ELLT', type: 'Voucher', basePrice: 120, currency: 'GBP', pricingModel: 'Global', description: 'Oxford International Digital.', icon: '🎓' },
  { id: 'v-24', name: 'LanguageCert Academic', category: 'LanguageCert', type: 'Voucher', basePrice: 180, currency: 'USD', pricingModel: 'Global', description: 'LanguageCert International Academic Exam.', icon: '📜' },
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

// RESTORED & MASSIVELY EXPANDED COUNTRY GUIDES (15 DESTINATIONS)
export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in United Kingdom', 
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,200 - £1,500/mo', visaRequirements: 'Student Visa (CAS)',
    content: `### The Global Gold Standard for Education
    The United Kingdom remains the most prestigious destination for international students worldwide. Home to ancient institutions like Oxford and Cambridge, alongside modern research powerhouses, the UK offers a legacy of academic rigor that is unmatched globally.
    
    ### Academic Verticals & Nodes
    UK higher education is divided into clear specializations. Russell Group universities lead in research, while modern "Post-92" institutions excel in employability and industry links. 
    - **Business & Economics**: London, Manchester, and Edinburgh offer top-tier financial hubs.
    - **STEM & Health**: Sheffield, Bristol, and Nottingham provide world-class clinical labs.
    - **Creative Arts**: London remains the global design capital.

    ### The Graduate Route (PSW)
    The UK government offers the "Graduate Route" (Post-Study Work), allowing international graduates to stay and work for 2 years (3 years for PhD) after completion. This node is critical for career establishment.
    
    ### Admissions & SOP Protocol
    UNICOU provides end-to-end guidance on UCAS undergraduate applications and direct postgraduate submissions. Our specialists assist in Statement of Purpose (SOP) drafting to ensure alignment with UKVI compliance.
    
    ### Life & Culture Nodes
    From the historic highlands of Scotland to the vibrant multicultural streets of Birmingham, life in the UK is a blend of tradition and modernity. Students benefit from the NHS healthcare system and an extensive transport node infrastructure.`
  },
  { 
    id: 'australia', countryId: 'australia', slug: 'australia', title: 'Study in Australia', 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: '$1,800 - $2,200 AUD/mo', visaRequirements: 'Subclass 500',
    content: `### Excellence in Research and Innovation
    Australia is globally recognized for its high-quality education, vibrant lifestyle, and excellent post-graduation work rights. The "Group of Eight" universities lead the world in medical research and tech innovation.
    
    ### Streamlined Visa Strategy
    The Subclass 500 visa process has been refined for genuine students. UNICOU helps manage GTE requirements and financial verification to ensure a smooth transition to Melbourne, Sydney, or Brisbane.
    
    ### Regional Extensions (PR Pathways)
    Studying in regional areas like Perth, Adelaide, or the Gold Coast offers additional PSW rights and migration points, making Australia a top choice for those seeking permanent residency pathways.
    
    ### Industry Integration & Internships
    Australian universities maintain deep ties with industry. Internships are often built into the curriculum, particularly in Nursing, IT, and Engineering.
    
    ### Climate & Global Lifestyle
    With some of the world's most livable cities, Australia offers a unique balance of rigorous study and outdoor adventure. Experience world-famous beaches and an inclusive multicultural society.`
  },
  { 
    id: 'canada', countryId: 'canada', slug: 'canada', title: 'Study in Canada', 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: '$1,500 - $1,900 CAD/mo', visaRequirements: 'Study Permit (SDS/Non-SDS)',
    content: `### Global Excellence and Inclusivity
    Canada is renowned for its welcoming attitude and high standards of research. Canadian degrees are considered equivalent to those from the USA or UK, but often with more competitive tuition rates.
    
    ### The PR Gateway (Express Entry)
    One of the strongest reasons to choose Canada is the clear pathway to Permanent Residency. The Post-Graduation Work Permit (PGWP) allows graduates to gain Canadian work experience, a key component for immigration scoring.
    
    ### Research Powerhouse Nodes
    From AI research in Toronto to sustainable forestry in BC, Canada leads in global innovation. Students have access to federal and provincial research grants.
    
    ### Two Official Languages
    While most students study in English, the opportunity to learn or improve French provides a massive advantage in the global and local job market.
    
    ### Safety and Stability Protocols
    Canada consistently ranks as one of the safest and most stable countries in the world. Its healthcare and social systems are global benchmarks.`
  },
  { 
    id: 'usa', countryId: 'usa', slug: 'usa', title: 'Study in USA', 
    heroImage: 'https://images.unsplash.com/photo-1550945034-5e9721e471ba?w=1200', 
    costOfLiving: '$1,200 - $1,800/mo', visaRequirements: 'F-1 Student Visa',
    content: `### The Global Innovation Hub
    The United States offers the most diverse range of higher education options in the world. From the Ivy League to cutting-edge community colleges, the US system is designed for flexibility and individual growth.
    
    ### STEM OPT Extension Node
    Science, Tech, Engineering, and Math graduates can extend their Optional Practical Training (OPT) for up to 3 years, allowing for significant professional development at Silicon Valley giants.
    
    ### Networking and Career Terminals
    US campuses are built on networking. Career fairs, alumni associations, and research labs provide students with direct links to Fortune 500 companies.
    
    ### Liberal Arts Philosophy
    The US encourages broad learning. Students can explore different majors before committing, ensuring they find the perfect alignment for their career goals.
    
    ### Iconic Campus Culture
    The American "college experience" is iconic. From collegiate sports to student organizations, the social infrastructure builds lifelong leadership skills.`
  },
  { 
    id: 'new-zealand', countryId: 'new-zealand', slug: 'new-zealand', title: 'Study in New Zealand', 
    heroImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200', 
    costOfLiving: '$1,500 - $1,800 NZD/mo', visaRequirements: 'Fee-paying Student Visa',
    content: `### High-Quality Academic Environment
    New Zealand's eight universities all rank in the top 3% globally. The system follows the British model but with a focus on practical, innovation-led learning.
    
    ### Sustainable Future Nodes
    NZ is a world leader in environmental science, renewable energy, and creative technologies (Weta Digital).
    
    ### Work-Life Harmony Protocol
    The "Kiwi" lifestyle is about balance. Students enjoy a safe, peaceful environment with access to some of the most stunning natural landscapes on Earth.
    
    ### Skilled Post-Study Pathways
    New Zealand offers a pathway for skilled graduates to stay and contribute to its growing economy, especially in tech and agriculture.
    
    ### Pastoral Care Standards
    NZ was the first country to establish a Code of Practice for the Pastoral Care of International Students, ensuring you are supported every step of the way.`
  },
  { 
    id: 'ireland', countryId: 'ireland', slug: 'ireland', title: 'Study in Ireland', 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed66a1846?w=1200', 
    costOfLiving: '€1,000 - €1,300/mo', visaRequirements: 'Degree Programme Visa',
    content: `### Europe's Tech Hub Nodes
    Ireland is the European headquarters for Apple, Google, Meta, and Pfizer. This creates an incredible demand for high-skilled international graduates in Dublin and Cork.
    
    ### Island of Saints and Scholars
    With a rich literary and scientific history, Irish education emphasizes critical thinking and creativity.
    
    ### English Speaking Advantage
    As the only primary English-speaking country in the Eurozone, Ireland offers students easy integration into the European business hub.
    
    ### 24-Month Stay Back Route
    Masters and PhD graduates can stay for 2 years post-completion to seek employment, providing a high ROI on your educational investment.
    
    ### Unmatched Irish Hospitality
    Consistently voted among the world's friendliest people, Ireland provides a safe and warm environment for students.`
  },
  { 
    id: 'germany', countryId: 'germany', slug: 'germany', title: 'Study in Germany', 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€900 - €1,100/mo', visaRequirements: 'Blocked Account Required',
    content: `### Land of Ideas and Engineering
    Germany is a global powerhouse for engineering, automotive tech, and renewable energy. Public universities offer tuition-free education (semester fees only) for most programs.
    
    ### Economic Leadership Terminals
    As Europe's largest economy, the career opportunities in Germany are vast. Graduates can stay for 18 months to find a job related to their degree.
    
    ### Research & Development Focus
    Germany invests billions in research annually. Institutes like Max Planck and Fraunhofer collaborate closely with universities.
    
    ### Central European Connectivity
    Located in the heart of Europe, studying in Germany allows for easy travel and networking across the entire Schengen area.
    
    ### Language Integration Strategy
    While many Masters are in English, UNICOU recommends basic German skills to enhance your employability in the local market.`
  },
  { 
    id: 'italy', countryId: 'italy', slug: 'italy', title: 'Study in Italy', 
    heroImage: 'https://images.unsplash.com/photo-1516483642144-7386221788c4?w=1200', 
    costOfLiving: '€800 - €1,200/mo', visaRequirements: 'Study Visa (D)',
    content: `### Heritage and Global Innovation
    Italy offers a unique blend of ancient tradition (University of Bologna, founded 1088) and modern design leadership.
    
    ### Regional Scholarships (DSU Nodes)
    The Italian government and regional bodies offer significant grants based on financial need, which can cover both tuition and living costs.
    
    ### Fashion, Design, and Art Hubs
    Milan and Florence are global capitals for creative industries. Direct industry links to Ferrari, Gucci, and Prada are common.
    
    ### Mediterranean Academic Lifestyle
    Experience the world-renowned cuisine, climate, and architecture while pursuing a globally recognized degree.
    
    ### Scientific & Aerospace Excellence
    Beyond the arts, Italy leads in physics, medicine, and aerospace engineering.`
  },
  { 
    id: 'sweden', countryId: 'sweden', slug: 'sweden', title: 'Study in Sweden', 
    heroImage: 'https://images.unsplash.com/photo-1506691453919-4d73bf3abd08?w=1200', 
    costOfLiving: '9,000 - 12,000 SEK/mo', visaRequirements: 'Residence Permit',
    content: `### Sustainable Innovation Culture
    Sweden is the birthplace of global brands like Spotify, IKEA, and Volvo. The education system focuses on independent thinking and collaborative problem-solving.
    
    ### Equality and Progress Protocols
    Sweden ranks as one of the most inclusive and equal societies in the world. International students are welcomed as equals in the learning process.
    
    ### Green Transition & Tech Nodes
    Lead the charge in climate tech and digital innovation. Sweden is at the forefront of the global energy transition.
    
    ### High Quality of Life Standards
    Swedes value "Lagom" (just the right amount). The balance between work, study, and nature is perfect.
    
    ### English Proficiency Advantage
    Swedes are among the world's best non-native English speakers, making daily life very easy for international students.`
  },
  { 
    id: 'finland', countryId: 'finland', slug: 'finland', title: 'Study in Finland', 
    heroImage: 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?w=1200', 
    costOfLiving: '€800 - €1,000/mo', visaRequirements: 'Type D Visa',
    content: `### World's Premier Education System
    Finland is consistently ranked as the #1 education system globally. The focus is on research-based learning and student autonomy.
    
    ### The Happiest Society Node
    Finland has been the world's happiest country for multiple consecutive years, offering safety, stability, and high-trust society.
    
    ### Digital Transformation Hubs
    A hub for gaming (Supercell, Rovio) and telecommunications (Nokia), Finland is perfect for tech-focused students.
    
    ### Enhanced Post-Study Work Rights
    Finland recently increased its stay-back period to 2 years, facilitating easier integration into the Finnish workforce.
    
    ### Northern Lights & Nature Silence
    From the Northern Lights to thousands of lakes, the Finnish environment offers peace and inspiration for academic focus.`
  },
  { 
    id: 'cyprus', countryId: 'cyprus', slug: 'cyprus', title: 'Study in Cyprus', 
    heroImage: 'https://images.unsplash.com/photo-1543269664-76ad399779ad?w=1200', 
    costOfLiving: '€700 - €900/mo', visaRequirements: 'MFA Study Permit',
    content: `### Mediterranean Academic Intersection
    Cyprus offers high-quality education at a fraction of the cost of Western Europe. Its strategic location makes it a bridge between Europe, Asia, and Africa.
    
    ### Tourism and Hospitality Specializations
    With a massive tourism sector, Cyprus is the ideal location for students pursuing management and hospitality degrees.
    
    ### European Union Membership Perks
    Studying in Cyprus (South) provides the benefits of an EU degree, including mobility and recognition across the continent.
    
    ### Safe and Economical Nodes
    Cyprus is one of the safest countries in the world, with a relaxed island lifestyle and low living expenses.
    
    ### English Taught Academic Tracks
    Most higher education programs in Cyprus are delivered in English, catering to a large international student community.`
  },
  { 
    id: 'dubai', countryId: 'dubai', slug: 'dubai', title: 'Study in Dubai (UAE)', 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', 
    costOfLiving: '4,000 - 6,000 AED/mo', visaRequirements: 'Student Residence Visa',
    content: `### The Global Gateway Terminal
    Dubai is the fastest-growing city in the world. Its Knowledge Park and Academic City house branch campuses of the world's top universities from the UK, Australia, and USA.
    
    ### Logistics and Trade Opportunities
    Dubai's status as a trade and tech hub provides students with unmatched internship opportunities in finance, logistics, and engineering.
    
    ### Tax-Free Career Earnings
    Graduates entering the Dubai workforce benefit from tax-free salaries, allowing for high savings and a premium lifestyle.
    
    ### Multicultural Networking Nodes
    With over 200 nationalities, Dubai is a truly global melting pot. You will network with future leaders from every corner of the globe.
    
    ### Futuristic Infrastructure Standards
    Students have access to the most modern facilities, transport, and leisure nodes in the world.`
  },
  { 
    id: 'malaysia', countryId: 'malaysia', slug: 'malaysia', title: 'Study in Malaysia', 
    heroImage: 'https://images.unsplash.com/photo-1520638023360-6def4a3f239b?w=1200', 
    costOfLiving: '1,500 - 2,500 RM/mo', visaRequirements: 'EMGS Student Pass',
    content: `### Affordable International Education Hub
    Malaysia has established itself as a regional education hub, offering "Twinning Programs" with top UK and Australian universities at a third of the cost.
    
    ### Cultural Mosaic Integration
    Experience the rich diversity of Malay, Chinese, and Indian cultures in one safe and welcoming country.
    
    ### Culinary & Lifestyle Nodes
    Malaysia is a global food capital. The cost of living is exceptionally low compared to the quality of infrastructure.
    
    ### Strategic Hub for SE Asian Markets
    Business and Tech students benefit from Malaysia's central position in the rapidly growing Southeast Asian markets.
    
    ### Quality Academic Standards (MQA)
    The Malaysian Qualifications Agency (MQA) ensures rigorous academic standards across all private and public institutions.`
  },
  { 
    id: 'turkey', countryId: 'turkey', slug: 'turkey', title: 'Study in Turkey', 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: '$400 - $700/mo', visaRequirements: 'Education Residence Permit',
    content: `### Bridge Between Global Continents
    Turkey offers a unique academic environment that blends Western and Eastern perspectives. Istanbul is a living history book.
    
    ### Rapidly Rising Global Rankings
    Turkish universities are climbing global charts, especially in Engineering, Medicine, and Architecture.
    
    ### High-Tech Campus Infrastructure
    Modern Turkish universities boast state-of-the-art labs, sports facilities, and digital libraries.
    
    ### Millennial Historic Legacy
    Study in a country that has been at the center of world civilization for millennia.
    
    ### Low Cost, Premium Quality Nodes
    Turkey offers a very high standard of living for international students at a relatively low monthly budget.`
  },
  { 
    id: 'europe', countryId: 'europe', slug: 'europe', title: 'The Europe Education Hub', 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: 'Variable', visaRequirements: 'Schengen Study Visa',
    content: `### Unified Higher Education Area (EHEA)
    Europe offers a standardized credit system (ECTS) that makes your degree recognizable and transferable across 48 countries.
    
    ### Erasmus+ Mobility Funding
    European students benefit from massive mobility funding, allowing them to study in different countries during their degree.
    
    ### Diverse Cultures and Language Nodes
    Become a global citizen by living in a continent of diverse languages and rich historic traditions.
    
    ### Economic Marketplace Opportunity
    The EU is the world's largest single market. A degree from a European institution is your passport to success in this stable and prosperous region.
    
    ### Innovative Scientific Research Networks
    European universities are at the forefront of global scientific collaboration and research.`
  }
];

export const universities: University[] = [
  { id: 'uni-manchester', name: 'University of Manchester', slug: 'manchester', location: 'Manchester, UK', ranking: 32, description: 'Global research powerhouse and member of the Russell Group.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' },
  { id: 'uni-sydney', name: 'University of Sydney', slug: 'sydney', location: 'Sydney, Australia', ranking: 19, description: 'Australia oldest and one of its most prestigious universities.', logo: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=200', countryId: 'australia', website: 'https://www.sydney.edu.au' },
  { id: 'uni-toronto', name: 'University of Toronto', slug: 'toronto', location: 'Toronto, Canada', ranking: 21, description: 'Canada highest-ranked university, known for innovation.', logo: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=200', countryId: 'canada', website: 'https://www.utoronto.ca' }
];

export const courses: Course[] = [
  { id: 'c-1', universityId: 'uni-manchester', title: 'MSc Data Science', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£28,000' },
  { id: 'c-2', universityId: 'uni-sydney', title: 'Bachelor of Commerce', degree: 'Undergraduate', duration: '3 Years', tuitionFee: '$45,000 AUD/Year' }
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
