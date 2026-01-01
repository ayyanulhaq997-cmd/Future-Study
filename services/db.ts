
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

// Expanded Country Guides with extensive content
export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in United Kingdom', 
    content: `### Global Excellence in Higher Education
    The United Kingdom remains the global gold standard for international education. With a rich history of academic excellence and home to some of the world's oldest and most prestigious universities, the UK offers students an unparalleled environment for growth. 
    
    ### Diverse Academic Portfolio
    From the ancient spires of Oxford and Cambridge to the cutting-edge facilities of modern Russell Group institutions, the UK higher education system is designed to foster innovation. Students can choose from over 50,000 courses in more than 25 subject areas. 
    
    ### Post-Study Work Opportunities (Graduate Route)
    The Graduate Route allows international students to stay in the UK for at least two years (three years for PhD graduates) after completing their degree. This provides a vital bridge to start a career in one of the world's leading economies.
    
    ### Strategic Industry Connections
    Many UK universities maintain strong ties with industry giants in finance, technology, healthcare, and engineering. Internships and industry placements are often integrated into the curriculum, ensuring graduates are workforce-ready.
    
    ### Quality Assurance (QAA)
    Every university in the UK is strictly monitored by the Quality Assurance Agency for Higher Education (QAA). This ensures that the teaching standards, facilities, and academic rigor remain consistent and globally recognized.
    
    ### Cultural Integration and Life
    The UK is a melting pot of cultures. International students find themselves in a welcoming environment that values diversity. From historic London landmarks to the natural beauty of the Scottish Highlands, life in the UK is a continuous discovery.
    
    ### Application Protocols
    Most undergraduate applications are processed through UCAS, while postgraduate admissions are typically direct to the institution. Our counselors provide end-to-end support for Statement of Purpose (SOP) drafting and CAS issuance.`,
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,100 - £1,400/mo', 
    visaRequirements: 'Student Visa (CAS Required)' 
  },
  { 
    id: 'australia', 
    countryId: 'australia', 
    slug: 'australia', 
    title: 'Study in Australia', 
    content: `### Innovation and Academic Power
    Australia is a leading global destination for international students, known for its high-quality education, vibrant lifestyle, and excellent post-graduation opportunities. The "Group of Eight" universities are recognized for world-class research and academic rigor.
    
    ### Simplified Visa Protocols
    The Subclass 500 Student Visa process has been streamlined to facilitate genuine students. Australia offers a safe, multi-cultural environment with some of the world's highest standards of living.
    
    ### Post-Study Work (PSW) Rights
    Australia provides generous post-study work rights depending on the level of study and the location of the institution. Regional areas often offer additional extensions to stay and work, making it a prime choice for PR pathways.
    
    ### Diverse Career Fields
    Whether it is Nursing, IT, Engineering, or Hospitality, Australian qualifications are designed in consultation with industry bodies to meet global demand.
    
    ### The Australian Way of Life
    Beyond academics, students enjoy a unique lifestyle. Australia boasts world-famous beaches, an outdoor culture, and major cities like Sydney, Melbourne, and Brisbane that consistently rank among the top student cities globally.`, 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: '$1,800 - $2,200 AUD/mo', 
    visaRequirements: 'Subclass 500 Student Visa' 
  },
  { 
    id: 'canada', 
    countryId: 'canada', 
    slug: 'canada', 
    title: 'Study in Canada', 
    content: `### Quality of Life and Education
    Canada is renowned for its welcoming attitude and high standards of academic excellence. Canadian universities and colleges offer globally recognized degrees that are highly valued by employers.
    
    ### Pathway to Permanent Residency
    One of Canada's biggest draws is the clear pathway to permanent residency. The Post-Graduation Work Permit (PGWP) allows students to gain Canadian work experience, which is a major factor in immigration scoring systems like Express Entry.
    
    ### Research and Development
    Canada is a world leader in research, particularly in fields like artificial intelligence, renewable energy, and medicine. Students have access to state-of-the-art labs and funding opportunities.
    
    ### Affordable Excellence
    Compared to the UK or the USA, tuition fees in Canada are often more competitive, providing excellent value for a high-tier education.
    
    ### A Safe and Inclusive Society
    Canada consistently ranks as one of the safest countries in the world. Its multiculturalism policy ensures that international students feel at home and respected.`, 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: '$1,500 - $2,000 CAD/mo', 
    visaRequirements: 'Study Permit (SDS & Non-SDS)' 
  },
  { 
    id: 'usa', 
    countryId: 'usa', 
    slug: 'usa', 
    title: 'Study in USA', 
    content: `### The Global Leader in Education
    The United States remains the top destination for international students due to its sheer diversity of institutions—from Ivy League universities to prestigious state schools and innovative community colleges.
    
    ### Flexibility and Customization
    The US education system is unique for its flexibility. Students can explore different majors before committing, and the "Liberal Arts" approach ensures a well-rounded educational foundation.
    
    ### STEM and OPT
    Science, Technology, Engineering, and Mathematics (STEM) graduates are eligible for up to 3 years of Optional Practical Training (OPT), allowing them to gain invaluable experience at top tech firms like Google, Microsoft, and Tesla.
    
    ### Networking and Resources
    Being a hub of global business, the US provides unmatched networking opportunities. University career centers are aggressive in helping students land internships and jobs.
    
    ### Life on Campus
    US campus life is legendary. From sports and clubs to cultural festivals, the collegiate experience in America is transformative and provides a lifelong network of peers.`, 
    heroImage: 'https://images.unsplash.com/photo-1550945034-5e9721e471ba?w=1200', 
    costOfLiving: '$1,200 - $1,800/mo', 
    visaRequirements: 'F-1 Student Visa' 
  },
  { 
    id: 'new-zealand', 
    countryId: 'new-zealand', 
    slug: 'new-zealand', 
    title: 'Study in New Zealand', 
    content: `### A Place for Innovation
    New Zealand offers a world-class education system based on the British model. All eight of New Zealand's universities are ranked in the top 3% worldwide.
    
    ### Stunning Natural Environment
    For students who value a balance between study and adventure, New Zealand is unbeatable. Its landscapes provide a backdrop for a peaceful yet exciting academic life.
    
    ### Work and Life Balance
    The culture in New Zealand emphasizes a healthy work-life balance. International students are well-supported through the Code of Practice for the Pastoral Care of International Students.
    
    ### Practical Learning
    Universities and institutes of technology (ITPs) in NZ emphasize practical, hands-on learning that prepares students for the global job market.
    
    ### Post-Study Work Rights
    Graduates can apply for a Post-Study Work Visa to stay and work in NZ for up to three years, providing a pathway to residency for skilled individuals.`, 
    heroImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200', 
    costOfLiving: '$1,500 - $2,000 NZD/mo', 
    visaRequirements: 'Student Visa (Fee-paying)' 
  },
  { 
    id: 'ireland', 
    countryId: 'ireland', 
    slug: 'ireland', 
    title: 'Study in Ireland', 
    content: `### Europe's Tech Hub
    Ireland is home to the European headquarters of many of the world's leading tech and pharma companies, including Apple, Google, and Pfizer. This creates a high demand for skilled graduates.
    
    ### Warm Hospitality
    Known for its friendly people and vibrant culture, Ireland provides a safe and welcoming environment for international students.
    
    ### Language Advantage
    As an English-speaking country in the Eurozone, Ireland offers a unique advantage for students wanting to study in English while remaining connected to the European economy.
    
    ### Quality of Higher Education
    Irish universities rank highly for research and innovation. The government invests heavily in education to ensure its workforce remains competitive.
    
    ### Stay Back Option
    International graduates are eligible for a 1-year (undergraduate) or 2-year (postgraduate) stay-back visa to seek employment in Ireland.`, 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed66a1846?w=1200', 
    costOfLiving: '€1,000 - €1,300/mo', 
    visaRequirements: 'Study Visa (Degree Programme)' 
  },
  { 
    id: 'germany', 
    countryId: 'germany', 
    slug: 'germany', 
    title: 'Study in Germany', 
    content: `### Land of Ideas
    Germany is a global leader in engineering, technology, and science. Public universities in Germany offer tuition-free education (only semester fees) for both domestic and international students.
    
    ### Engineering and Precision
    German degrees are synonym with precision and high technical standards. Programs are designed to provide students with the skills needed to lead in modern industry.
    
    ### Economic Powerhouse
    As Europe's largest economy, Germany offers vast job opportunities. Graduates can stay for up to 18 months to find a job related to their studies.
    
    ### Strategic Location
    Studying in Germany gives students easy access to travel and work across the entire European Union.
    
    ### Learning German
    While many programs are taught in English, learning German can significantly enhance your career prospects and integration into the local society.`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€900 - €1,100/mo', 
    visaRequirements: 'Student Visa (Blocked Account Required)' 
  },
  { 
    id: 'italy', 
    countryId: 'italy', 
    slug: 'italy', 
    title: 'Study in Italy', 
    content: `### Cradle of Western Civilization
    Italy offers some of the oldest and most prestigious universities in the world. It is the perfect destination for students of Art, Design, Architecture, and History.
    
    ### Fashion and Design Capital
    Cities like Milan are global centers for fashion and design. Many Italian universities collaborate directly with top brands like Ferrari, Gucci, and Armani.
    
    ### Scholarships and Regional Grants
    The Italian government and regional bodies offer significant grants (DSU) based on financial need, which can cover tuition and living expenses.
    
    ### Mediterranean Lifestyle
    The quality of life, cuisine, and climate make Italy an attractive place for students who want a rich cultural experience alongside their studies.
    
    ### Global Connections
    Italy's membership in the EU and its strategic position in the Mediterranean provide graduates with unique professional opportunities.`, 
    heroImage: 'https://images.unsplash.com/photo-1516483642144-7386221788c4?w=1200', 
    costOfLiving: '€800 - €1,200/mo', 
    visaRequirements: 'Study Visa (Type D)' 
  },
  { 
    id: 'sweden', 
    countryId: 'sweden', 
    slug: 'sweden', 
    title: 'Study in Sweden', 
    content: `### Sustainable Innovation
    Sweden is a global leader in sustainability, green technology, and innovation. It is home to global brands like Spotify, IKEA, and Volvo.
    
    ### Unique Academic Style
    Swedish education emphasizes independent thinking and collaborative learning. Students are encouraged to challenge authority and develop their own ideas.
    
    ### Equality and Inclusion
    Sweden is one of the world's most equal countries. International students are welcomed into an inclusive society that values diversity and human rights.
    
    ### High Quality of Life
    Swedes value a balance between work and leisure. Nature is always close by, and public services are highly efficient.
    
    ### Career Prospects
    Sweden has a high demand for skilled professionals in IT, engineering, and healthcare. Graduates can stay to find work and pursue a career in an innovative environment.`, 
    heroImage: 'https://images.unsplash.com/photo-1506691453919-4d73bf3abd08?w=1200', 
    costOfLiving: 'SEK 9,000 - 12,000/mo', 
    visaRequirements: 'Residence Permit for Studies' 
  },
  { 
    id: 'finland', 
    countryId: 'finland', 
    slug: 'finland', 
    title: 'Study in Finland', 
    content: `### World-Class Education
    Finland is consistently ranked as having the best education system in the world. Finnish universities offer high-quality, research-based programs.
    
    ### Happiest Country in the World
    Finland has been ranked as the world's happiest country multiple times. It offers a safe, stable, and high-quality living environment.
    
    ### Digital Innovation
    Finland is a hub for technology and digital innovation, especially in telecommunications and gaming.
    
    ### Post-Study Work Rights
    Finland recently increased its post-study work rights, allowing graduates to stay for up to two years to look for a job.
    
    ### Nature and Silence
    For those who love nature, Finland is a paradise. From the northern lights to thousands of lakes, the Finnish landscape is breathtaking.`, 
    heroImage: 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?w=1200', 
    costOfLiving: '€800 - €1,000/mo', 
    visaRequirements: 'Student Residence Permit' 
  },
  { 
    id: 'dubai', 
    countryId: 'dubai', 
    slug: 'dubai', 
    title: 'Study in Dubai (UAE)', 
    content: `### The Global Gateway
    Dubai is one of the fastest-growing cities in the world and a global hub for business, tourism, and innovation. Many international universities have campuses in Dubai's Knowledge Park and International Academic City.
    
    ### International Campus Network
    Students can study at branch campuses of top universities from the UK, USA, Australia, and Canada, receiving the same degree while living in a dynamic Middle Eastern hub.
    
    ### Career Opportunities
    Dubai's diverse economy offers vast internship and employment opportunities in finance, hospitality, tech, and engineering.
    
    ### High-End Infrastructure
    Students in Dubai have access to world-class facilities, accommodation, and a lifestyle that is vibrant and multicultural.
    
    ### Tax-Free Earnings
    The UAE offers tax-free income, making it an attractive place for graduates to start their professional lives and save money.`, 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', 
    costOfLiving: 'AED 4,000 - 6,000/mo', 
    visaRequirements: 'Student Residence Visa' 
  },
  { 
    id: 'malaysia', 
    countryId: 'malaysia', 
    slug: 'malaysia', 
    title: 'Study in Malaysia', 
    content: `### Affordable International Hub
    Malaysia has established itself as a major regional education hub, offering high-quality education at a fraction of the cost of Western countries.
    
    ### Twinning Programs
    Malaysia is famous for its twinning programs, where students can complete part of their degree in Malaysia and transfer to partner universities in the UK, Australia, or Canada.
    
    ### Multicultural and Welcoming
    As a multicultural society, Malaysia provides a rich cultural experience and a variety of cuisines. It is one of the most hospitable countries for international students.
    
    ### Quality Standards
    The Malaysian Qualifications Agency (MQA) ensures that all programs meet high academic standards.
    
    ### Strategic Location in SE Asia
    Studying in Malaysia provides easy access to the growing markets of Southeast Asia, making it a strategic choice for business and tech students.`, 
    heroImage: 'https://images.unsplash.com/photo-1520638023360-6def4a3f239b?w=1200', 
    costOfLiving: 'RM 1,500 - 2,500/mo', 
    visaRequirements: 'Student Pass (EMGS Verified)' 
  },
  { 
    id: 'turkey', 
    countryId: 'turkey', 
    slug: 'turkey', 
    title: 'Study in Turkey', 
    content: `### Bridge Between Continents
    Turkey's unique position between Europe and Asia makes it a fascinating destination for students interested in international relations, history, and global trade.
    
    ### Growing Academic Reputation
    Turkish universities are rapidly improving their global rankings. The government offers generous scholarships (Türkiye Bursları) for international students.
    
    ### Modern Facilities
    Many Turkish universities have modern campuses with state-of-the-art labs, libraries, and social facilities.
    
    ### Rich History and Culture
    Studying in Turkey is an immersive cultural experience. From ancient ruins to modern Istanbul, there is always something to explore.
    
    ### Affordable Living
    Turkey offers a very high standard of living at a relatively low cost, making it an excellent choice for budget-conscious students.`, 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: '$400 - $700/mo', 
    visaRequirements: 'Student Residence Permit' 
  },
  { 
    id: 'cyprus', 
    countryId: 'cyprus', 
    slug: 'cyprus', 
    title: 'Study in Cyprus', 
    content: `### Mediterranean Excellence
    Cyprus offers a safe and friendly environment with high academic standards. Its universities are known for their strong emphasis on business, hospitality, and medicine.
    
    ### English-Taught Programs
    Most higher education programs in Cyprus are taught in English, making it accessible to international students.
    
    ### Career Pathways in Tourism
    With a massive tourism industry, Cyprus is an ideal place for students of hospitality and tourism management to gain practical experience.
    
    ### Favorable Visa Policies
    Cyprus maintains favorable visa policies for international students, with streamlined processes for many nationalities.
    
    ### Island Lifestyle
    Beautiful beaches, historic sites, and a Mediterranean climate make Cyprus a popular choice for students looking for a relaxed yet productive study environment.`, 
    heroImage: 'https://images.unsplash.com/photo-1543269664-76ad399779ad?w=1200', 
    costOfLiving: '€700 - €900/mo', 
    visaRequirements: 'Student Visa (Residence Permit)' 
  },
  { 
    id: 'europe', 
    countryId: 'europe', 
    slug: 'europe', 
    title: 'The Europe Education Hub', 
    content: `### The Unified European Higher Education Area
    Studying in Europe offers access to the EHEA, which ensures that degrees are comparable and transferable across the entire continent.
    
    ### Erasumus+ and Mobility
    European students benefit from mobility programs like Erasmus+, allowing them to study or intern in different European countries during their degree.
    
    ### Diverse Cultures and Languages
    Europe is a mosaic of cultures. Studying here allows students to become multilingual and develop a truly global perspective.
    
    ### Innovative Research Networks
    European universities are at the forefront of global research, often collaborating across borders on major scientific projects.
    
    ### Economic Opportunity
    The European Union provides a massive market for graduates. A degree from a European institution is a passport to professional success in one of the world's most stable economic regions.`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: 'Variable by Country', 
    visaRequirements: 'Schengen Study Visa' 
  }
];

export const universities: University[] = [
  { id: 'uni-manchester', name: 'University of Manchester', slug: 'manchester', location: 'Manchester, UK', ranking: 32, description: 'Global research powerhouse and member of the Russell Group.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' },
  { id: 'uni-sydney', name: 'University of Sydney', slug: 'sydney', location: 'Sydney, Australia', ranking: 19, description: 'Australia oldest and one of its most prestigious universities.', logo: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=200', countryId: 'australia', website: 'https://www.sydney.edu.au' },
  { id: 'uni-toronto', name: 'University of Toronto', slug: 'toronto', location: 'Toronto, Canada', ranking: 21, description: 'Canada highest-ranked university, known for innovation.', logo: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=200', countryId: 'canada', website: 'https://www.utoronto.ca' },
  { id: 'uni-nyu', name: 'New York University', slug: 'nyu', location: 'New York, USA', ranking: 38, description: 'A global university with a footprint in the heart of NYC.', logo: 'https://images.unsplash.com/photo-1550945034-5e9721e471ba?w=200', countryId: 'usa', website: 'https://www.nyu.edu' },
  { id: 'uni-trinity', name: 'Trinity College Dublin', slug: 'trinity', location: 'Dublin, Ireland', ranking: 81, description: 'Irelands leading university with a global reputation for research.', logo: 'https://images.unsplash.com/photo-1590089415225-401ed66a1846?w=200', countryId: 'ireland', website: 'https://www.tcd.ie' },
  { id: 'uni-munich', name: 'Technical University of Munich', slug: 'tum', location: 'Munich, Germany', ranking: 37, description: 'The entrepreneurial university with top-tier engineering.', logo: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=200', countryId: 'germany', website: 'https://www.tum.de' },
  { id: 'uni-sapienza', name: 'Sapienza University of Rome', slug: 'sapienza', location: 'Rome, Italy', ranking: 134, description: 'One of the oldest universities in the world, located in Rome.', logo: 'https://images.unsplash.com/photo-1516483642144-7386221788c4?w=200', countryId: 'italy', website: 'https://www.uniroma1.it' }
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
