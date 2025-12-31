import React from 'react';

interface PolicyPageProps {
  policyId: string;
}

const POLICY_DATA: Record<string, { title: string; subtitle: string; content: string[] }> = {
  'modern-slavery': {
    title: 'Modern Slavery Policy',
    subtitle: 'Human Trafficking Statement • UniCou International Ltd',
    content: [
      'UniCou International Ltd is committed to preventing modern slavery and human trafficking in all its business operations and supply chains. We recognise our responsibility under the UK Modern Slavery Act 2015 and support international efforts to eradicate slavery, forced labour, child labour, and human trafficking.',
      'UniCou International Ltd operates as an education consultancy firm based in the United Kingdom, working with students, academic institutions, training providers, agents, and business partners across multiple countries. We take a zero-tolerance approach to modern slavery and expect the same high standards from all our partners, suppliers, and associates worldwide.',
      'Our business model does not involve manufacturing or high-risk labour sectors; however, we acknowledge that risks may exist within extended supply chains, particularly in international operations. We actively assess and monitor risks through due diligence, contractual obligations, and ethical standards.',
      'All staff members are expected to act ethically and report any concerns related to modern slavery. We provide guidance to employees to help them recognise signs of exploitation and understand reporting procedures. Any reported concerns are taken seriously and investigated promptly.',
      'UniCou International Ltd only engages with suppliers and associates who demonstrate lawful employment practices and compliance with applicable labour laws. We reserve the right to terminate relationships where breaches of modern slavery laws are identified.',
      'This statement is reviewed annually and reflects our ongoing commitment to ethical business practices and human rights protection.'
    ]
  },
  'accessibility': {
    title: 'Accessibility Statement',
    subtitle: 'Digital Inclusion Standard • UniCou International Ltd',
    content: [
      'UniCou International Ltd is committed to ensuring digital accessibility for all users, including people with disabilities. We aim to provide a website experience that is inclusive, user-friendly, and compliant with recognised accessibility standards.',
      'Our website is designed to align with the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, and relevant UK accessibility regulations. We strive to ensure that our content is accessible through assistive technologies such as screen readers, keyboard navigation, and text enlargement tools.',
      'We regularly review our website design, structure, and content to improve accessibility. This includes ensuring readable fonts, appropriate colour contrast, alternative text for images, and clear navigation.',
      'While we make every effort to maintain accessibility across all areas of our website, some third-party tools or external content may not fully meet accessibility standards. We continue to work with providers to improve accessibility where possible.',
      'If you experience difficulty accessing any part of our website or require information in an alternative format, please contact us. We are committed to responding promptly and making reasonable adjustments where feasible.'
    ]
  },
  'cookies': {
    title: 'Cookie Use Policy',
    subtitle: 'Data Tracking & Analytics • UniCou International Ltd',
    content: [
      'UniCou International Ltd uses cookies and similar technologies to enhance user experience, analyse website performance, and support marketing activities. This Cookie Policy explains how and why cookies are used when you visit our website.',
      'Cookies are small text files stored on your device that help websites function efficiently. We use essential cookies required for website operation, as well as analytical and marketing cookies to understand user behaviour and improve our services.',
      'Our use of cookies complies with the UK GDPR, Data Protection Act 2018, and Privacy and Electronic Communications Regulations (PECR). Where required, we seek user consent before placing non-essential cookies.',
      'Some cookies may be placed by trusted third-party service providers for analytics, advertising, or functionality purposes. These providers process data in accordance with their own privacy policies.',
      'You can manage or disable cookies through your browser settings at any time. Please note that disabling cookies may affect website functionality.'
    ]
  },
  'whistleblowing': {
    title: 'Whistleblowing Policy',
    subtitle: 'Integrity & Transparency • UniCou International Ltd',
    content: [
      'UniCou International Ltd encourages openness and transparency and is committed to conducting business with honesty and integrity. This Whistleblowing Policy provides a framework for employees, contractors, partners, and associates to report concerns safely and confidentially.',
      'Whistleblowing concerns may include unlawful activity, fraud, corruption, data misuse, modern slavery, unethical conduct, or breaches of company policy. Reports can be made without fear of retaliation.',
      'All disclosures are treated seriously and investigated appropriately. UniCou International Ltd ensures confidentiality and protects whistleblowers in line with the Public Interest Disclosure Act 1998.',
      'Concerns can be raised internally through designated reporting channels. Where appropriate, matters may be escalated to external authorities.',
      'Retaliation against whistleblowers is strictly prohibited and may result in disciplinary action.'
    ]
  },
  'privacy': {
    title: 'Privacy Policy',
    subtitle: 'Data Protection & GDPR • UniCou International Ltd',
    content: [
      'UniCou International Ltd is committed to protecting personal data and respecting privacy rights. This Privacy Policy explains how we collect, use, store, and share personal data in compliance with the UK GDPR, Data Protection Act 2018, and applicable international data protection laws.',
      'We collect personal data such as names, contact details, academic records, and identification documents for legitimate business purposes, including student counselling, university applications, visa guidance, marketing, and service improvement.',
      'Personal data may be shared with trusted associates, partner institutions, service providers, and regulatory authorities where necessary and lawful. Such sharing supports education placement, legal compliance, business development, lead management, and market analysis.',
      'We implement appropriate technical and organisational measures to safeguard personal data. Data is retained only for as long as necessary for its intended purpose or legal obligations.',
      'Individuals have rights regarding their personal data, including access, correction, deletion, and objection to processing. Requests can be made by contacting UniCou International Ltd directly.'
    ]
  }
};

const PolicyPage: React.FC<PolicyPageProps> = ({ policyId }) => {
  const policy = POLICY_DATA[policyId];

  if (!policy) return <div className="p-20 text-center font-black uppercase text-slate-400">Policy not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in fade-in duration-700 bg-white">
      <div className="mb-20">
        <span className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.4em] mb-4 block">Official Statement</span>
        <h1 className="text-5xl md:text-7xl font-display font-black text-slate-950 tracking-tighter leading-none mb-6">{policy.title}</h1>
        <p className="text-xl font-bold text-unicou-navy italic border-l-4 border-unicou-navy pl-6">{policy.subtitle}</p>
      </div>

      <div className="space-y-10">
        {policy.content.map((paragraph, i) => (
          <p key={i} className="text-lg text-slate-700 leading-relaxed font-medium italic">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Verified: 2025
        </div>
        <button 
          onClick={() => window.print()}
          className="px-8 py-3 bg-slate-50 border border-slate-200 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-sm"
        >
          Print Document
        </button>
      </div>
    </div>
  );
};

export default PolicyPage;