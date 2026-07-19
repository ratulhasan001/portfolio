export const profile = {
  name: "Ratul Hasan",
  handle: "ratulhasan001",
  role: "CSE Undergraduate · Aspiring PhD Researcher",
  location: "Natore, Bangladesh",
  email: "ratulhasan.cs@gmail.com",
  phone: "+8801760972108",
  website: "ratul-hasan.netlify.app",
  github: "https://github.com/ratulhasan001",
  linkedin: "https://linkedin.com/in/ratul-hasan-linked-in",
  bio: "CSE undergrad researching LLM reliability and biology-informed deep learning for neurodegenerative disease forecasting. Building toward a PhD in machine learning research.",
  interests: [
    "Machine Learning",
    "LLM Bias & Hallucination",
    "Computational Neuroscience",
    "Blockchain Systems",
    "Computer Vision",
  ],
  followersLabel: "Open to research collaboration",
};

export const stats = [
  { label: "Publications", value: 3, suffix: "" },
  { label: "Projects", value: 2, suffix: "" },
  { label: "Contest Awards", value: 6, suffix: "+" },
  { label: "Problems Solved", value: 1000, suffix: "+" },
];

export type Experience = {
  org: string;
  role: string;
  location: string;
  period: string;
  current?: boolean;
  bullets: string[];
  tags: string[];
};

export const experience: Experience[] = [
  {
    org: "ELITE Research Lab LLC",
    role: "Research Intern (Remote)",
    location: "Queens, NY, USA",
    period: "May 2026 - Present",
    current: true,
    bullets: [
      "Researching LLM bias and hallucination behavior across model families.",
      "Ongoing research on LLM performance in mental health and depression contexts.",
    ],
    tags: ["LLM", "NLP", "Research"],
  },
  {
    org: "Lab AR",
    role: "Software Engineering Intern",
    location: "Dhaka, Bangladesh",
    period: "July 2025 - August 2025",
    bullets: [
      "Led a team project to develop a web-based Property Management System.",
      "Contributed to backend development using Laravel (PHP) and collaborated on feature implementation.",
    ],
    tags: ["Laravel", "PHP", "Backend"],
  },
];

export type Education = {
  school: string;
  degree: string;
  location: string;
  period: string;
  detail?: string;
  score?: { label: string; value: number; scale: number };
};

export const education: Education[] = [
  {
    school: "Bangladesh Army University of Engineering & Technology (BAUET)",
    degree: "B.Sc in Computer Science and Engineering",
    location: "Natore, Bangladesh",
    period: "2022 - Present",
    detail:
      "Thesis: Biology-Informed Recurrent Neural Networks for Longitudinal Hippocampal Atrophy Forecasting in Alzheimer's Disease",
    score: { label: "CGPA", value: 3.82, scale: 4.0 },
  },
  {
    school: "Govt. Majid Memorial City College",
    degree: "Higher Secondary School Certificate",
    location: "Khulna, Bangladesh",
    period: "2019 - 2021",
    score: { label: "GPA", value: 5.0, scale: 5.0 },
  },
];

export type Publication = {
  title: string;
  authors: string;
  venue: string;
  date: string;
  status: "published" | "accepted" | "under-review";
  link?: string;
  type: "conference" | "journal";
};

export const publications: Publication[] = [
  {
    title:
      "BI-RNN: Biology-Informed Recurrent Neural Networks for Longitudinal Hippocampal Atrophy Forecasting in Alzheimer's Disease",
    authors: "Ratul Hasan, Md. Momenul Haque, Ananya Sarker",
    venue: "Nature Scientific Reports",
    date: "Under Review",
    status: "under-review",
    type: "journal",
  },
  {
    title:
      "A Gas-Optimized Blockchain Framework for Scalable Document Verification Using Dynamic Access Control and IPFS",
    authors:
      "Ratul Hasan, Samiha Farjana, Yousuf Oley, Md. Ohiduzaman Pranto, Md Arik Rayhan",
    venue:
      "International Conference on Power, Electronics, Communications, Computing, and Intelligent Infrastructure (PECCII 2026) — IEEE Proceedings",
    date: "Expected 2026",
    status: "accepted",
    type: "conference",
  },
  {
    title:
      "Quantum-Resistant FOTA: End-to-End Decentralized Firmware Updates for IoT Using Blockchain and CRYSTALS-Dilithium",
    authors:
      "Ratul Hasan, Md. Momenul Haque, Redoanul Haque, Yousuf Oley, Ruhani Akter",
    venue:
      "12th International Conference on Next Generation Computing, Communication, Systems and Security (NSysS '25), ACM, New York, NY, USA, 110-114",
    date: "December 2025",
    status: "published",
    link: "https://doi.org/10.1145/3777555.3777569",
    type: "conference",
  },
];

export type Project = {
  name: string;
  description: string;
  tools: string[];
  link: string;
  language: string;
  languageColor: string;
  stars?: string;
};

export const projects: Project[] = [
  {
    name: "LedgerSeal",
    description:
      "A decentralized application (DApp) for constant-time document verification with dynamic access control on IPFS, built on a public blockchain.",
    tools: ["React JS", "Anvil EVM", "Foundry", "Metamask", "Pinata IPFS"],
    link: "https://github.com/ratulhasan001",
    language: "Solidity",
    languageColor: "#AA6746",
  },
  {
    name: "BAUET Project & Thesis Archive",
    description:
      "A repository website built with Django (MVT & REST) that indexes and presents theses and projects from BAUET.",
    tools: ["HTML", "Tailwind CSS", "JavaScript", "Django", "PostgreSQL"],
    link: "https://github.com/ratulhasan001",
    language: "Python",
    languageColor: "#3572A5",
  },
  {
    name: "PheroTube",
    description:
      "A basic JavaScript project for API fetching that mimics video streaming platform functionality with dynamic content loading.",
    tools: ["HTML", "CSS", "JavaScript", "API Integration"],
    link: "https://ratul-phero-tube.netlify.app/",
    language: "JavaScript",
    languageColor: "#F1E05A",
  },
  {
    name: "Library Management System",
    description:
      "A library management desktop application with comprehensive book and user management features.",
    tools: ["Java Swing", "MySQL"],
    link: "https://github.com/ratulhasan001/LMS",
    language: "Java",
    languageColor: "#B07219",
  },
  {
    name: "Fashion Quest",
    description:
      "A basic static website using CSS showcasing fashion trends and styles with modern responsive design and elegant layouts.",
    tools: ["HTML", "CSS", "Responsive Design", "Static Website"],
    link: "https://ratul-fashion-quest.netlify.app/",
    language: "CSS",
    languageColor: "#563D7C",
  },
];

export const skills = {
  Languages: ["C", "C++", "Python", "JavaScript", "SQL"],
  Frameworks: ["Django", "REST", "Foundry", "Laravel"],
  "Project Management": ["Git", "GitHub"],
  Database: ["MySQL", "PostgreSQL"],
  Technologies: [
    "Machine Learning",
    "Computer Vision",
    "Backend Development",
    "Blockchain",
  ],
};

export const onlineJudges = [
  { platform: "Codeforces", stat: "Max Rating 1650 (Expert)", handle: "Ratul_Hasan" },
  { platform: "Codechef", stat: "Max Rating 1676 (3 Star)", handle: "ratulhasan2108" },
  { platform: "LeetCode", stat: "50+ problems solved", handle: "ratulhasan001" },
];

export const achievements = [
  "1x ICPC Regionalist (Team: BAUET_Rong_Answer)",
  "1x National Collegiate Programming Contest by JU — Rank 149 (Team: BAUET_PARADIGM)",
  "2x Inter University Programming Contest — Best Rank 45 at IUT (Team: BAUET_Twisted_Minds)",
  "Ranked 10th, Independence Day Programming Contest, Military Institute of Science & Technology",
  "1x Champion, 1x 2nd Runners-up, Intra University Programming Contest (Team)",
  "1x Runners-up, Intra University Programming Contest (Solo)",
  "1x 1st Runners-up, Intra University Three Minute Thesis Presentation",
];

export const leadership = [
  "President, BAUET Computer Society",
  "Problem Setter, Intra University Programming Contest at BAUET",
  "Trainer of Competitive Programming, BAUET Computer Society",
  "Officer of Documentation, HULT Prize at BAUET",
];
