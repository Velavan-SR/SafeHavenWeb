
// Mock Counselor Data
export const counselors = [
  {
    id: 'c1',
    name: 'Dr. Sarah Johnson',
    title: 'Child Psychologist',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    experience: '15 years',
    specialization: 'Child trauma and anxiety',
    languages: ['English', 'Hindi'],
    email: 'sarah.johnson@safehaven.org',
    phone: '9876543210',
    availability: 'Mon-Fri, 9:00 AM - 5:00 PM',
    rating: 4.9
  },
  {
    id: 'c2',
    name: 'Dr. Rajesh Kumar',
    title: 'Family Counselor',
    image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f',
    experience: '12 years',
    specialization: 'Family dynamics and women empowerment',
    languages: ['Hindi', 'English', 'Tamil'],
    email: 'rajesh.kumar@safehaven.org',
    phone: '9876543211',
    availability: 'Tue-Sat, 10:00 AM - 6:00 PM',
    rating: 4.8
  },
  {
    id: 'c3',
    name: 'Ms. Priya Sharma',
    title: 'Women\'s Rights Advocate',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    experience: '8 years',
    specialization: 'Domestic violence and legal support',
    languages: ['Hindi', 'English', 'Marathi'],
    email: 'priya.sharma@safehaven.org',
    phone: '9876543212',
    availability: 'Mon-Sat, 9:00 AM - 7:00 PM',
    rating: 4.7
  },
  {
    id: 'c4',
    name: 'Dr. Ananya Patel',
    title: 'Trauma Specialist',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    experience: '10 years',
    specialization: 'PTSD and trauma recovery',
    languages: ['English', 'Gujarati', 'Hindi'],
    email: 'ananya.patel@safehaven.org',
    phone: '9876543213',
    availability: 'Wed-Sun, 8:00 AM - 4:00 PM',
    rating: 4.9
  }
];

// Mock Police Station Data
export const policeStations = [
  {
    id: 'p1',
    name: 'Central Police Station',
    address: '123 Main Street, Central City',
    phone: '100',
    emergency: '112',
    email: 'central@police.gov.in',
    inCharge: 'Inspector Vikram Singh'
  },
  {
    id: 'p2',
    name: 'East District Police Station',
    address: '456 East Road, East District',
    phone: '100',
    emergency: '112',
    email: 'east@police.gov.in',
    inCharge: 'Inspector Meera Desai'
  }
];

// Mock NGO Data
export const ngos = [
  {
    id: 'n1',
    name: 'Women Safety Foundation',
    focus: 'Women\'s rights and safety',
    address: '789 NGO Street, Social Hub',
    phone: '9876543220',
    email: 'contact@wsf.org',
    website: 'www.wsf.org'
  },
  {
    id: 'n2',
    name: 'Child Protection Initiative',
    focus: 'Child safety and education',
    address: '101 Care Lane, Child District',
    phone: '9876543221',
    email: 'help@cpi.org',
    website: 'www.cpi.org'
  }
];

// Mock quiz questions for all activities
export const quizQuestions = {
  brainBooster: [
    {
      id: 'q1',
      question: 'What is the emergency number to call in India?',
      options: ['112', '100', '911'],
      answer: '112',
      explanation: 'The all-in-one emergency number in India is 112, which connects to all emergency services.'
    },
    {
      id: 'q2',
      question: 'What does GPS help you with?',
      options: ['Battery backup', 'Location tracking', 'Voice control'],
      answer: 'Location tracking',
      explanation: 'GPS (Global Positioning System) helps track your location precisely.'
    },
    {
      id: 'q3',
      question: 'Under which law can a woman report workplace harassment?',
      options: ['IPC 302', 'POSH Act', 'IT Act'],
      answer: 'POSH Act',
      explanation: 'The Prevention of Sexual Harassment (POSH) Act protects women from workplace harassment.'
    },
    {
      id: 'q4',
      question: 'Which is a strong password example?',
      options: ['password123', 'iloveyou', 'S@feH4ven!2024'],
      answer: 'S@feH4ven!2024',
      explanation: 'Strong passwords contain a mix of uppercase, lowercase, numbers, and special characters.'
    },
    {
      id: 'q5',
      question: 'What is phishing?',
      options: ['Playing a game online', 'Tricking users to steal personal data', 'Searching in Google'],
      answer: 'Tricking users to steal personal data',
      explanation: 'Phishing is a cybercrime where attackers pose as legitimate organizations to steal sensitive information.'
    }
  ],
  
  safetyQuest: [
    {
      id: 's1',
      scenario: "You're walking alone and someone follows you – what do you do?",
      options: ['Call a friend', 'Use SafeHaven SOS', 'Ignore them'],
      bestAction: 'Use SafeHaven SOS',
      explanation: 'Using the SOS feature immediately alerts your emergency contacts and police with your location.'
    },
    {
      id: 's2',
      scenario: "Someone offers you a ride home – what should you ask first?",
      options: ['Their name', 'Show ID or Safe Code', 'Just get in'],
      bestAction: 'Show ID or Safe Code',
      explanation: 'Always verify the identity of someone offering a ride, especially if they claim to be sent by someone you know.'
    },
    {
      id: 's3',
      scenario: "A stranger sends you a friend request online – what do you do?",
      options: ['Accept it', 'Check mutual friends first', 'Ignore or decline'],
      bestAction: 'Ignore or decline',
      explanation: 'It\'s safest to ignore or decline friend requests from people you don\'t know in real life.'
    }
  ],
  
  selfDefenseMoves: [
    {
      id: 'd1',
      move: 'Palm Strike',
      target: 'nose or chin',
      description: 'Use the heel of your palm to strike upward against an attacker\'s nose or chin.'
    },
    {
      id: 'd2',
      move: 'Elbow Strike',
      target: 'face or ribs',
      description: 'Use your elbow to strike an attacker\'s face or ribs with force.'
    },
    {
      id: 'd3',
      move: 'Knee Strike',
      target: 'groin or thigh',
      description: 'Drive your knee upward into the attacker\'s groin or thigh.'
    },
    {
      id: 'd4',
      move: 'Wrist Release',
      target: 'grip escape',
      description: 'Rotate your wrist toward the attacker\'s thumb (the weakest part of their grip) to break free.'
    }
  ],
  
  relaxationExercises: [
    {
      id: 'r1',
      name: 'Deep Breathing',
      duration: '2 minutes',
      steps: [
        'Sit comfortably with your back straight',
        'Breathe in slowly through your nose for 4 counts',
        'Hold your breath for 1-2 counts',
        'Exhale slowly through your mouth for 6 counts',
        'Repeat 10 times'
      ]
    },
    {
      id: 'r2',
      name: 'Progressive Muscle Relaxation',
      duration: '5 minutes',
      steps: [
        'Tense the muscles in your toes for 5 seconds',
        'Release and notice the difference',
        'Work your way up through each muscle group',
        'End with facial muscles',
        'Notice how your body feels afterward'
      ]
    },
    {
      id: 'r3',
      name: 'Guided Visualization',
      duration: '3 minutes',
      steps: [
        'Close your eyes',
        'Imagine a peaceful place (beach, forest, etc.)',
        'Notice the sounds, smells, and feelings there',
        'Spend time exploring this safe place',
        'When ready, slowly return to awareness'
      ]
    }
  ],
  
  lawsAndRights: [
    {
      id: 'l1',
      law: 'POSH Act',
      description: 'Prevention of Sexual Harassment at Workplace'
    },
    {
      id: 'l2',
      law: 'POCSO Act',
      description: 'Protection of Children from Sexual Offences'
    },
    {
      id: 'l3',
      law: 'Section 498A',
      description: 'Protection from cruelty by husband or his relatives'
    },
    {
      id: 'l4',
      law: 'Domestic Violence Act',
      description: 'Protection of women from domestic violence'
    }
  ]
};

// Legal assistance topics
export const legalTopics = [
  {
    id: 'lt1',
    title: 'Domestic Violence',
    description: 'Legal remedies for victims of domestic violence',
    keywords: ['domestic', 'violence', 'abuse', 'home', 'husband', 'protection']
  },
  {
    id: 'lt2',
    title: 'Sexual Harassment',
    description: 'Laws against sexual harassment at workplace and public places',
    keywords: ['harassment', 'sexual', 'workplace', 'posh', 'inappropriate']
  },
  {
    id: 'lt3',
    title: 'Child Safety Laws',
    description: 'Laws protecting children from abuse and exploitation',
    keywords: ['child', 'abuse', 'pocso', 'minor', 'juvenile']
  },
  {
    id: 'lt4',
    title: 'Cybercrime',
    description: 'Legal protection against online harassment and cybercrime',
    keywords: ['cyber', 'online', 'social media', 'harassment', 'bullying', 'stalking']
  }
];
