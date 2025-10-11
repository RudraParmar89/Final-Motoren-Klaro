export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentSection[];
  date: string;
  author: string;
  category: string;
  imageUrl?: string;
  keywords?: string[];
  metaDescription?: string;
}

export interface ContentSection {
  type: 'paragraph' | 'heading' | 'subheading' | 'list' | 'quote' | 'table' | 'stats' | 'chart' | 'icon-list' | 'bibliography';
  content?: string;
  items?: string[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  statsData?: {
    value: string;
    label: string;
    icon?: string;
  }[];
  chartData?: {
    title: string;
    data: { name: string; value: number; }[];
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: '6',
    title: 'Electric Revolution: How EVs Are Transforming the Automotive Landscape',
    slug: 'electric-revolution-evs-transforming-automotive',
    excerpt: 'Explore how electric vehicles are reshaping the automotive industry with breakthrough battery technology, charging infrastructure, and sustainable manufacturing.',
    date: 'January 15, 2025',
    author: 'Auto News Team',
    category: 'Electric Vehicles',
    imageUrl: '/lovable-uploads/2b7a23fb-d7fe-45ee-ad27-4d89a6dfe341.png',
    keywords: [
      'electric vehicles',
      'EV technology',
      'battery innovation',
      'charging infrastructure',
      'sustainable automotive',
      'green transportation',
      'Tesla',
      'automotive industry',
      'electric car market',
      'renewable energy',
      'carbon neutral',
      'EV adoption'
    ],
    metaDescription: 'Discover how electric vehicles are revolutionizing the automotive industry with advanced technology, improved infrastructure, and environmental benefits.',
    content: [
      {
        type: 'paragraph',
        content: 'The automotive industry is experiencing its most significant transformation since the invention of the internal combustion engine. Electric vehicles (EVs) are no longer a futuristic concept but a present reality that\'s reshaping how we think about transportation, energy, and environmental responsibility.'
      },
      {
        type: 'stats',
        statsData: [
          {
            value: '14M',
            label: 'EVs sold globally in 2023',
            icon: 'Car'
          },
          {
            value: '35%',
            label: 'Growth in EV sales year-over-year',
            icon: 'TrendingUp'
          },
          {
            value: '400+',
            label: 'Miles average EV range in 2024',
            icon: 'Battery'
          }
        ]
      },
      {
        type: 'heading',
        content: 'Battery Technology Breakthroughs'
      },
      {
        type: 'paragraph',
        content: 'The heart of the EV revolution lies in battery technology. Modern lithium-ion batteries have improved dramatically in energy density, charging speed, and longevity. Major manufacturers are investing billions in solid-state battery research, promising even greater improvements in the coming years.'
      },
      {
        type: 'subheading',
        content: 'Key Battery Innovations'
      },
      {
        type: 'icon-list',
        items: [
          'Solid-state batteries offering 50% more energy density than current lithium-ion technology',
          'Fast-charging capabilities allowing 80% charge in under 15 minutes',
          'Battery management systems extending battery life to over 500,000 miles',
          'Recycling programs recovering 95% of battery materials for reuse'
        ]
      },
      {
        type: 'heading',
        content: 'Charging Infrastructure Expansion'
      },
      {
        type: 'paragraph',
        content: 'One of the biggest barriers to EV adoption has been charging infrastructure. However, governments and private companies worldwide are rapidly expanding charging networks, making long-distance EV travel increasingly practical.'
      },
      {
        type: 'table',
        tableData: {
          headers: ['Region', 'Public Charging Stations', 'Growth Rate'],
          rows: [
            ['North America', '68,000+', '+42% annually'],
            ['Europe', '375,000+', '+38% annually'],
            ['China', '2.6M+', '+65% annually'],
            ['Global Total', '3.2M+', '+55% annually']
          ]
        }
      },
      {
        type: 'heading',
        content: 'Environmental Impact and Sustainability'
      },
      {
        type: 'paragraph',
        content: 'EVs represent a critical step toward reducing transportation emissions. While the environmental benefits depend on the source of electricity used for charging, studies show that even when powered by fossil fuel grids, EVs produce significantly fewer lifecycle emissions than traditional vehicles.'
      },
      {
        type: 'quote',
        content: 'The transition to electric vehicles isn\'t just about changing what powers our cars – it\'s about reimagining our entire relationship with transportation and energy.'
      }
    ]
  },
  {
    id: '5',
    title: 'Autonomous Driving: The Future of Transportation is Here',
    slug: 'autonomous-driving-future-transportation',
    excerpt: 'Discover the latest developments in self-driving car technology, from Level 5 autonomy to the regulatory challenges shaping the future of mobility.',
    date: 'January 8, 2025',
    author: 'Tech Review Team',
    category: 'Technology',
    imageUrl: '/lovable-uploads/6c9678e1-cd7e-40f9-a2c9-0266188db955.png',
    keywords: [
      'autonomous driving',
      'self-driving cars',
      'AI technology',
      'transportation future',
      'vehicle automation',
      'smart cars',
      'machine learning',
      'automotive AI',
      'driverless vehicles',
      'mobility innovation'
    ],
    metaDescription: 'Explore the cutting-edge world of autonomous driving technology and how self-driving cars are revolutionizing transportation.',
    content: [
      {
        type: 'paragraph',
        content: 'Autonomous driving technology has evolved from science fiction to reality, with major automakers and tech companies racing to perfect self-driving systems. From advanced driver assistance to fully autonomous vehicles, the technology is reshaping our expectations of personal transportation.'
      },
      {
        type: 'heading',
        content: 'Levels of Autonomous Driving'
      },
      {
        type: 'paragraph',
        content: 'The Society of Automotive Engineers defines six levels of driving automation, from Level 0 (no automation) to Level 5 (full automation). Most current vehicles operate at Level 2, with some achieving Level 3 capabilities in specific conditions.'
      },
      {
        type: 'list',
        items: [
          'Level 0: No Automation - Driver performs all tasks',
          'Level 1: Driver Assistance - Systems assist with steering or acceleration',
          'Level 2: Partial Automation - Systems control steering and acceleration simultaneously',
          'Level 3: Conditional Automation - Systems handle all aspects under specific conditions',
          'Level 4: High Automation - Systems handle all tasks in defined environments',
          'Level 5: Full Automation - Complete autonomy in all conditions'
        ]
      },
      {
        type: 'heading',
        content: 'Current Market Leaders'
      },
      {
        type: 'paragraph',
        content: 'Several companies are leading the autonomous driving race, each with unique approaches to solving the complex challenge of creating safe, reliable self-driving systems.'
      },
      {
        type: 'quote',
        content: 'The goal isn\'t just to create cars that can drive themselves, but to create a transportation system that\'s safer, more efficient, and accessible to everyone.'
      }
    ]
  },
  {
    id: '4',
    title: 'Luxury Sports Cars: Performance Meets Innovation in 2025',
    slug: 'luxury-sports-cars-performance-innovation-2025',
    excerpt: 'Explore the newest luxury sports cars combining breathtaking performance with cutting-edge technology and sustainable engineering.',
    date: 'December 28, 2024',
    author: 'Performance Review',
    category: 'Luxury',
    imageUrl: '/lovable-uploads/6fffe5ea-9e5e-4d02-a769-140ff301d9d0.png',
    keywords: [
      'luxury sports cars',
      'high performance vehicles',
      'supercar technology',
      'automotive innovation',
      'Ferrari',
      'Lamborghini',
      'McLaren',
      'Porsche',
      'sports car reviews'
    ],
    metaDescription: 'Discover the latest luxury sports cars featuring incredible performance, advanced technology, and innovative engineering for 2025.',
    content: [
      {
        type: 'paragraph',
        content: 'The luxury sports car segment continues to push the boundaries of automotive engineering, combining raw performance with sophisticated technology. In 2025, manufacturers are delivering vehicles that not only achieve incredible speed but also incorporate sustainable materials and hybrid powertrains.'
      },
      {
        type: 'heading',
        content: 'Performance Benchmarks'
      },
      {
        type: 'paragraph',
        content: 'Modern luxury sports cars are setting new performance standards with advanced aerodynamics, lightweight materials, and precision engineering that delivers track-ready performance for the road.'
      },
      {
        type: 'stats',
        statsData: [
          {
            value: '0-60',
            label: 'Under 3 seconds for most supercars',
            icon: 'Zap'
          },
          {
            value: '200+',
            label: 'MPH top speeds becoming standard',
            icon: 'Gauge'
          },
          {
            value: '700+',
            label: 'Horsepower in entry-level supercars',
            icon: 'Engine'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'SUV Market Dominance: Why Crossovers Rule the Roads',
    slug: 'suv-market-dominance-crossovers-rule-roads',
    excerpt: 'Analyze the continued growth of the SUV and crossover market, from compact city SUVs to full-size luxury models.',
    date: 'December 20, 2024',
    author: 'Market Analysis Team',
    category: 'Market Trends',
    imageUrl: '/lovable-uploads/97bf521f-4bb5-4f97-999c-a35171e14718.png',
    keywords: [
      'SUV market',
      'crossover vehicles',
      'automotive trends',
      'vehicle sales',
      'family cars',
      'luxury SUVs',
      'compact SUVs',
      'market analysis'
    ],
    metaDescription: 'Understand why SUVs and crossovers dominate today\'s automotive market and what drives consumer preference for these versatile vehicles.',
    content: [
      {
        type: 'paragraph',
        content: 'Sport Utility Vehicles (SUVs) and crossovers have become the dominant force in the automotive market, accounting for more than half of all vehicle sales in many regions. This shift represents one of the most significant changes in consumer preferences in automotive history.'
      },
      {
        type: 'heading',
        content: 'Market Share Growth'
      },
      {
        type: 'paragraph',
        content: 'The SUV segment has experienced unprecedented growth over the past decade, with crossovers leading the charge due to their combination of car-like handling and SUV versatility.'
      }
    ]
  },
  {
    id: '2',
    title: 'Green Technology in Modern Vehicles: Beyond Electric',
    slug: 'green-technology-modern-vehicles-beyond-electric',
    excerpt: 'Discover how automakers are implementing sustainable technologies beyond electrification, from hydrogen fuel cells to bio-based materials.',
    date: 'December 12, 2024',
    author: 'Sustainability Report',
    category: 'Sustainability',
    imageUrl: '/lovable-uploads/2b47a4d2-db71-4255-b704-5b505288c770.png',
    keywords: [
      'green technology',
      'sustainable automotive',
      'hydrogen fuel cells',
      'bio-based materials',
      'carbon neutral vehicles',
      'eco-friendly cars',
      'renewable energy',
      'clean transportation'
    ],
    metaDescription: 'Explore innovative green technologies in modern vehicles, including hydrogen fuel cells, sustainable materials, and carbon-neutral manufacturing.',
    content: [
      {
        type: 'paragraph',
        content: 'While electric vehicles capture headlines, the automotive industry is implementing numerous green technologies that extend far beyond battery power. From hydrogen fuel cells to recycled materials, manufacturers are finding innovative ways to reduce their environmental impact.'
      },
      {
        type: 'heading',
        content: 'Hydrogen Fuel Cell Technology'
      },
      {
        type: 'paragraph',
        content: 'Hydrogen fuel cells offer an alternative to battery electric vehicles, providing long range and quick refueling times while producing only water vapor as emissions.'
      }
    ]
  },
  {
    id: '1',
    title: 'Connected Car Revolution: IoT and Smart Vehicle Features',
    slug: 'connected-car-revolution-iot-smart-features',
    excerpt: 'Explore how Internet of Things (IoT) technology is transforming vehicles into smart, connected platforms with advanced infotainment and safety features.',
    date: 'December 5, 2024',
    author: 'Connected Tech Team',
    category: 'Technology',
    imageUrl: '/lovable-uploads/9991feb5-603f-4f0f-bffd-66154d72645c.png',
    keywords: [
      'connected cars',
      'IoT automotive',
      'smart vehicles',
      'vehicle connectivity',
      'car infotainment',
      'automotive IoT',
      'smart car features',
      'vehicle technology'
    ],
    metaDescription: 'Learn how IoT technology is creating smarter, more connected vehicles with advanced features for safety, entertainment, and convenience.',
    content: [
      {
        type: 'paragraph',
        content: 'The modern vehicle is evolving into a sophisticated IoT platform, connecting drivers and passengers to a world of digital services, real-time information, and intelligent features that enhance safety, comfort, and convenience.'
      },
      {
        type: 'heading',
        content: 'Smart Connectivity Features'
      },
      {
        type: 'paragraph',
        content: 'Today\'s connected cars offer seamless integration with smartphones, cloud services, and smart home systems, creating a unified digital ecosystem that follows you from home to car and beyond.'
      }
    ]
  }
];