import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult, LMSModule, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-owner', name: 'Business Owner', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-ops', name: 'Ops Manager', email: 'ops@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-finance', name: 'Finance Lead', email: 'finance@unicou.uk', role: 'Finance Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-sales', name: 'Sales Manager', email: 'sales@unicou.uk', role: 'Sales Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
];

export const products: Product[] = [
  { id: 'v-pte-aca', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Official PTE Academic Voucher with instant delivery.', icon: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600', openingStock: 2000 },
  { id: 'v-ielts-aca', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Country-Wise', description: 'Official IELTS Academic Voucher.', icon: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600', openingStock: 150 },
  { id: 'v-toefl-ibt', name: 'TOEFL iBT Voucher', category: 'TOEFL', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Global', description: 'Official TOEFL iBT Voucher.', icon: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600', openingStock: 100 },
];

export const voucherCodes: VoucherCode[] = Array.from({ length: 2250 }).map((_, i) => ({
  id: `vc-${i}`,
  productId: i < 2000 ? 'v-pte-aca' : (i < 2150 ? 'v-ielts-aca' : 'v-toefl-ibt'),
  code: `UC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  status: 'Available',
  expiryDate: '2026-12-31',
  uploadDate: '2025-01-01'
}));

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'ielts-full-mock-1',
    title: 'IELTS Academic Full Mock 1',
    sections: [
      {
        id: 'i-l-s1',
        title: 'Listening Section 1: Host Family Applicant',
        skill: 'Listening',
        timeLimit: 30,
        passageText: 'Host Family Applicant Form. Example Name: Jenny Chan. Address: Sea View Guesthouse. Day time phone: 2237676. Age: 19. Occupation: Student.',
        questions: [
          { id: 'i-l-q1', skill: 'Listening', type: 'Fill-Blanks', text: 'Present Address: Sea View Guesthouse 1 ___________________' },
          { id: 'i-l-q2', skill: 'Listening', type: 'Fill-Blanks', text: 'Best time to contact: 2 ___________________' },
          { id: 'i-l-q3', skill: 'Listening', type: 'Fill-Blanks', text: 'Intended length of stay: 3 ___________________' },
          { id: 'i-l-q4', skill: 'Listening', type: 'Fill-Blanks', text: 'General level of English: 4 ___________________' },
          { id: 'i-l-q5', skill: 'Listening', type: 'Fill-Blanks', text: 'Preferred location: In the 5 ___________________' },
          { id: 'i-l-q6', skill: 'Listening', type: 'Fill-Blanks', text: 'Special diet: 6 ___________________' }
        ]
      },
      {
        id: 'i-r-s1',
        title: 'Reading Part 1: The Life and Work of Marie Curie',
        skill: 'Reading',
        timeLimit: 20,
        passageText: 'Marie Curie is probably the most famous woman scientist who has ever lived. Born Maria Sklodowska in Poland in 1867, she is famous for her work on radioactivity... In 1891 she went to Paris and began to study at the Sorbonne... She found her interest drawn to pitchblende, a mineral whose radioactivity, superior to that of pure uranium, could be explained only by the presence in the ore of small quantities of an unknown substance of very high activity.',
        questions: [
          { id: 'i-r-q1', skill: 'Reading', type: 'TFNG', text: 'Marie Curie’s husband was a joint winner of both Marie’s Nobel Prizes.' },
          { id: 'i-r-q2', skill: 'Reading', type: 'TFNG', text: 'Marie became interested in science when she was a child.' },
          { id: 'i-r-q3', skill: 'Reading', type: 'TFNG', text: 'Marie was able to attend the Sorbonne because of her sister’s financial contribution.' },
          { id: 'i-r-q7', skill: 'Reading', type: 'Fill-Blanks', text: 'When uranium was discovered to be radioactive, Marie Curie found that the element called ___________________ had the same property.' },
          { id: 'i-r-q8', skill: 'Reading', type: 'Fill-Blanks', text: 'Marie and Pierre Curie’s research into the radioactivity of the mineral known as ___________________ led to the discovery of two new elements.' }
        ]
      }
    ]
  },
  {
    id: 'pte-mock-1',
    title: 'PTE Academic Mock Exam 1',
    sections: [
      {
        id: 'p-r-ord1',
        title: 'Reading: Re-order Paragraphs (History)',
        skill: 'Reading',
        timeLimit: 15,
        questions: [
          { 
            id: 'p-q1', 
            skill: 'Reading', 
            type: 'Ordering', 
            text: 'Clothing History Sequence',
            options: [
              'Jackets didn’t become fashionable for casual wear until the 1850s.',
              'By 1817, trousers were shoe-length. Popular with the king, they became accepted as standard daywear.',
              'It was George “Beau” Brummell who started a trend for wearing tight black trousers in the early 1800s.',
              'The favorite patterns for trousers were strong plaids, stripes and checks.'
            ] 
          },
          { 
            id: 'p-q2', 
            skill: 'Reading', 
            type: 'Ordering', 
            text: 'JP Morgan Corporate Node',
            options: [
              'Its business decisions are made on the timely and accurate flow of information.',
              'It has 1700 employees in 13 branches and representative offices across the Asia-Pacific region.',
              'For employees to maintain a competitive edge, they must have quick access to trade data.',
              'JP Morgan is one of the largest banking institutions in the US.'
            ] 
          }
        ]
      }
    ]
  },
  {
    id: 'toefl-mock-1',
    title: 'TOEFL iBT Practice Assessment',
    sections: [
      {
        id: 't-r-s1',
        title: 'Reading: Rise of Teotihuacán',
        skill: 'Reading',
        timeLimit: 30,
        passageText: 'The city of Teotihuacán, which lay about 50 kilometers northeast of modern-day Mexico City, began its growth by 200 –100 B.C. At its height, between about A.D. 150 and 700, it probably had a population of more than 125,000 people and covered at least 20 square kilometers... The valley was rich in obsidian. The hard volcanic stone was a resource that had been in great demand...',
        questions: [
          { id: 't-r-q1', skill: 'Reading', type: 'MCQ', text: 'The word "ingenuity" in the passage is closest in meaning to:', options: ['ambition', 'sincerity', 'faith', 'cleverness'] },
          { id: 't-r-q2', skill: 'Reading', type: 'MCQ', text: 'Which of the following is mentioned as a factor in the rise of Teotihuacán?', options: ['The presence of obsidian', 'An elite military force', 'Isolation from other cities', 'Lack of natural resources'] }
        ]
      }
    ]
  }
];

export const countryGuides: CountryGuide[] = [
  { id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in United Kingdom', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', costOfLiving: '£1,171 / Month', visaRequirements: '£12,000 / Year', content: '### Why Study in the UK?\nWorld-class academic prestige and a gateway to global career opportunities.' },
  { id: 'australia', countryId: 'au', slug: 'australia', title: 'Study in Australia', heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', costOfLiving: 'AUD $2,000 / Month', visaRequirements: 'AUD $25,000 / Year', content: '### Discover Australia\nExcellence in research and a high standard of living.' },
  { id: 'canada', countryId: 'ca', slug: 'canada', title: 'Study in Canada', heroImage: 'https://images.unsplash.com/photo-1503125558445-e1b00be72318?w=1200', costOfLiving: 'CAD $1,800 / Month', visaRequirements: 'CAD $20,635 / Year', content: '### Canadian Opportunities\nFriendly environment with pathways to permanent residency.' },
  { id: 'usa', countryId: 'us', slug: 'usa', title: 'Study in USA', heroImage: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1200', costOfLiving: 'USD $2,000 / Month', visaRequirements: 'USD $20,000 / Year', content: '### USA Academic Excellence\nThe global standard for flexible higher education.' },
  { id: 'germany', countryId: 'de', slug: 'germany', title: 'Study in Germany', heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', costOfLiving: '€950 / Month', visaRequirements: '€11,208 / Year', content: '### Germany: The Heart of Europe\nHigh-quality education with little to no tuition fees.' },
  { id: 'italy', countryId: 'it', slug: 'italy', title: 'Study in Italy', heroImage: 'https://images.unsplash.com/photo-1529260839312-42e3dfda0d6d?w=1200', costOfLiving: '€800 / Month', visaRequirements: '€6,000 / Year', content: '### Italy: Academic Heritage\nRich cultural history combined with modern innovation.' },
  { id: 'new-zealand', countryId: 'nz', slug: 'new-zealand', title: 'Study in New Zealand', heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200', costOfLiving: 'NZD $1,500 / Month', visaRequirements: 'NZD $20,000 / Year', content: '### Pure New Zealand\nSafe environment and world-ranked universities.' },
  { id: 'ireland', countryId: 'ie', slug: 'ireland', title: 'Study in Ireland', heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200', costOfLiving: '€1,200 / Month', visaRequirements: '€10,000 / Year', content: '### Ireland: Land of Scholars\nDynamic tech hub with a friendly atmosphere.' },
  { id: 'finland', countryId: 'fi', slug: 'finland', title: 'Study in Finland', heroImage: 'https://images.unsplash.com/photo-1529906920574-628dc1e49f9a?w=1200', costOfLiving: '€900 / Month', visaRequirements: '€6,720 / Year', content: '### Finland: Innovation Hub\nWorld-leading education and research facilities.' },
  { id: 'sweden', countryId: 'se', slug: 'sweden', title: 'Study in Sweden', heroImage: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1200', costOfLiving: 'SEK 11,000 / Month', visaRequirements: '€10,000 / Year', content: '### Sweden: Sustainability Leader\nLeader in green technology and collaborative learning.' },
  { id: 'dubai', countryId: 'ae', slug: 'dubai', title: 'Study in Dubai', heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', costOfLiving: 'AED $4,000 / Month', visaRequirements: 'AED $30,000 / Year', content: '### Dubai: Global Crossroads\nModern infrastructure and international branch campuses.' },
  { id: 'malaysia', countryId: 'my', slug: 'malaysia', title: 'Study in Malaysia', heroImage: 'https://images.unsplash.com/photo-1520116468816-95b69efe7d7b?w=1200', costOfLiving: 'MYR 2,000 / Month', visaRequirements: 'MYR 15,000 / Year', content: '### Truly Asia\nAffordable living and quality global qualifications.' },
  { id: 'turkey', countryId: 'tr', slug: 'turkey', title: 'Study in Turkey', heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', costOfLiving: 'TRY 10,000 / Month', visaRequirements: 'Varies', content: '### Turkey: Bridge of Continents\nDiverse academic landscape and vibrant culture.' },
  { id: 'cyprus', countryId: 'cy', slug: 'cyprus', title: 'Study in Cyprus', heroImage: 'https://images.unsplash.com/photo-1531366930499-41f53117AD52?w=1200', costOfLiving: '€700 / Month', visaRequirements: '€7,000 / Year', content: '### Cyprus: Gateway to Europe\nMediterranean lifestyle and high-standard English programs.' },
  { id: 'europe', countryId: 'eu', slug: 'europe', title: 'Study in Europe', heroImage: 'https://images.unsplash.com/photo-1471623432079-b009d30b6729?w=1200', costOfLiving: 'Varies', visaRequirements: 'Varies', content: '### European Hub\nSeamless mobility across Schengen and EU zones.' }
];

export const universities: University[] = [
  { id: 'uni-1', name: 'University of Manchester', slug: 'uom', location: 'Manchester, UK', description: 'A world-leading research institution.', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/University_of_Manchester_logo.svg/1200px-University_of_Manchester_logo.svg.png', ranking: 32, countryId: 'uk' }
];

export const courses: Course[] = [
  { id: 'c1', universityId: 'uni-1', title: 'MSc Data Science', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£28,000', description: 'Advanced curriculum covering machine learning.' }
];

export const qualifications: Qualification[] = [
  { id: 'q-othm-3', title: 'Level 3 Diploma in Business Studies', qualificationBody: 'OTHM', level: 'Level 3', tuitionFees: '$1,200', description: 'Foundation entry to UK degree programs.', duration: '6 Months', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800', requirements: ['High School Transcript', 'IELTS 5.5 Node'] }
];

export const immigrationGuides: ImmigrationGuideData[] = [
  { id: 'imm-uk', slug: 'uk', title: 'UK Settlement Paths', heroImage: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=1200', content: 'Explore paths for Graduate Visas.', pathways: [{ id: 'p1', title: 'Graduate Route (PSW)', description: 'Work in the UK for 2-3 years.', requirements: ['Successful Degree Completion'] }] }
];

export const lmsModules: LMSModule[] = [
  { id: 'm1', title: 'Introduction', lessons: [{ id: 'l1', title: 'Start', type: 'Video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'lms-pte-mastery', title: 'PTE Academic Mastery', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', description: 'Complete prep course.', duration: '40 Hours', instructor: 'Dr. Sarah Wilson', price: 99 }
];

export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
