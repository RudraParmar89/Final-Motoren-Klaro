export type Contact = {
  id: string;
  img: string;
  alt: string;
  name: string;
  role: string;
  subtitle?: string;
  email?: string;
  linkedin?: string;
  phone?: string;
};

export const CONTACTS: Contact[] = [
  {
    id: 'felix',
    img: '/lovable-uploads/aa5291bd-2417-4c1e-9a02-0bcc71a92507.png',
    alt: 'Felix von Heland',
    name: 'Felix von Heland',
    role: 'CEO and Founder',
    subtitle: 'Strategic Leadership & Vision',
    email: 'felix@motorenklaro.com',
    linkedin: 'https://www.linkedin.com/in/felixvonheland/'
  },
  {
    id: 'love',
    img: '/lovable-uploads/a9bb9110-964a-43b0-a5ab-7162140cd133.png',
    alt: 'Love Anderberg',
    name: 'Love Anderberg',
    role: 'COO',
    subtitle: 'Operations & Customer Success',
    email: 'love@motorenklaro.com',
    linkedin: 'https://www.linkedin.com/in/love-anderberg-67549a174/',
    phone: '+46760149508'
  },
  {
    id: 'support',
    img: '/lovable-uploads/b862d5ae-6abb-44da-84f0-00a222f62906.png',
    alt: 'Technical Support Team',
    name: 'Technical Support',
    role: 'Car Experts Team',
    subtitle: 'Car Comparisons & Technical Help',
    email: 'support@motorenklaro.com',
    linkedin: 'https://www.linkedin.com/company/motorenklaro/',
    phone: '+46123456789'
  }
];
