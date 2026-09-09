export const profile = {
  name: "Ratul Hasan",
  handle: "ratulhasan001",
  role: "Computer Science Graduate · Aspiring Graduate Researcher",
  location: "Khulna, Bangladesh",
  email: "ratulhasan.cs@gmail.com",
  phone: "+8801760972108",
  website: "https://ratulhasan.xyz",
  github: "https://github.com/ratulhasan001",
  linkedin: "https://linkedin.com/in/ratul-hasan-linked-in",
  orcid: "https://orcid.org/0009-0009-5429-7501",
  scholar: "https://scholar.google.com/citations?user=EfwUJ2cAAAAJ&hl=en",
  tagline:
    "Computer Science graduate with research experience in AI & Security",
  summary:
    "Computer Science graduate with research experience in machine learning, healthcare AI, blockchain, and cybersecurity. Published in peer-reviewed conference proceedings, with research interests in trustworthy AI, large language models, and AI for healthcare. Aspiring to pursue graduate research in Artificial Intelligence.",
  focusAreas: [
    "Artificial Intelligence",
    "Machine Learning",
    "Computer Vision",
    "Large Language Models",
    "Blockchain & Decentralized Systems",
  ],
  followersLabel: "Open to research collaboration",
};

export type Experience = {
  org: string;
  role: string;
  location: string;
  period: string;
  current?: boolean;
  bullets: string[];
  tags: string[];
  /** Path under /public — falls back to the timeline dot when absent. */
  logo?: string;
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
    logo: "/logo/elitelab.jpeg",
  },
  {
    org: "BAUET Computer Society, Dept. of CSE, BAUET",
    role: "Programming Instructor",
    location: "Natore, Bangladesh",
    period: "July 2024 - December 2025",
    bullets: [
      "Conducted regular training sessions on C programming and competitive programming for undergraduate students.",
      "Designed coding exercises and problem-solving sessions, and conducted practice contests.",
      "Mentored students in programming fundamentals and competitive programming techniques to strengthen analytical and coding skills.",
    ],
    tags: ["C", "Competitive Programming", "Teaching"],
    logo: "/logo/bsc.png",
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
    logo: "/logo/labar.jpeg",
  },
];

export type Education = {
  school: string;
  degree: string;
  location: string;
  period: string;
  detail?: string;
  merit?: string;
  score?: { label: string; value: number; scale: number };
  /** Path under /public — falls back to the timeline dot when absent. */
  logo?: string;
};

export const education: Education[] = [
  {
    school: "Bangladesh Army University of Engineering & Technology (BAUET)",
    degree: "B.Sc in Computer Science and Engineering",
    location: "Natore, Bangladesh",
    period: "2022 - 2026",
    detail:
      "Thesis: Biology-Informed Recurrent Neural Networks for Longitudinal Hippocampal Atrophy Forecasting in Alzheimer's Disease",
    score: { label: "CGPA", value: 3.82, scale: 4.0 },
    logo: "/logo/bsc.png",
  },
  {
    school: "Govt. Majid Memorial City College",
    degree: "Higher Secondary School Certificate",
    location: "Khulna, Bangladesh",
    period: "2019 - 2021",
    score: { label: "GPA", value: 5.0, scale: 5.0 },
    logo: "/logo/hsc.jpg",
  },
];

export type Publication = {
  title: string;
  /** Full byline in submission order; `profile.name` is highlighted on render. */
  authors: string[];
  venue: string;
  date: string;
  status: "published" | "accepted" | "under-review";
  link?: string;
  type: "conference" | "journal";
  /** Key into `digitalLibraryLabels`. */
  digitalLibrary?: string;
};

/**
 * Short, typeset labels for each digital library. Publication cards used to
 * carry publisher artwork; a mono wordmark keeps the section quiet and reads
 * the same in both themes.
 */
export const digitalLibraryLabels: Record<string, string> = {
  "IEEE Xplore Digital Library": "IEEE Xplore",
  "ACM Digital Library": "ACM",
  "Springer Nature Link": "Scientific Reports",
  "PLOS ONE": "PLOS ONE",
};

export const publications: Publication[] = [
  {
    title:
      "Entropy-assured post-quantum key generation on IoT edge devices: source independence, measured min-entropy and signature scheme selection",
    authors: ["Ratul Hasan"],
    venue: "PLOS ONE",
    date: "Submitted 2026",
    status: "under-review",
    type: "journal",
    digitalLibrary: "PLOS ONE",
  },
  {
    title:
      "BI-RNN: Biology-Informed Recurrent Neural Networks for Longitudinal Hippocampal Atrophy Forecasting in Alzheimer's Disease",
    authors: ["Ratul Hasan", "Md. Momenul Haque", "Ananya Sarker"],
    venue: "Nature Scientific Reports",
    date: "Submitted May 2026",
    status: "under-review",
    type: "journal",
    digitalLibrary: "Springer Nature Link",
  },
{
  title:
    "SplitSafe Ultra: A Moving-Target Defense Framework for Entropy-Aware Encrypted File Persistence on IPFS",
  authors: [
    "Md. Ahnaf Muhaimin",
    "Ratul Hasan",
    "Yousuf Oley",
    "Samiha Farjana",
    "Bristi Rani Roy",
    "Subrata Kumer Paul",
    "Md. Ekramul Hamid",
  ],
  venue:
    "5th IEEE International Conference on Signal Processing, Information, Communication and Systems (SPICSCON 2026) — IEEE Proceedings",
  date: "Expected 2026",
  status: "accepted",
  type: "conference",
  digitalLibrary: "IEEE Xplore Digital Library",
},
{
  title:
    "ActiVisionNet-Fusion: A Dual-Stream Explainable Deep Learning Framework for Driver Drowsiness Detection",
  authors: [
    "Nasim Ahmed",
    "Ratul Hasan",
    "Subrata Kumer Paul",
    "Dewan Nafiul Islam Noor",
    "Md. Momenul Haque",
    "Md. Ekramul Hamid",
  ],
  venue:
    "5th IEEE International Conference on Signal Processing, Information, Communication and Systems (SPICSCON 2026) — IEEE Proceedings",
  date: "Expected 2026",
  status: "accepted",
  type: "conference",
  digitalLibrary: "IEEE Xplore Digital Library",
},
  {
    title:
      "A Gas-Optimized Blockchain Framework for Scalable Document Verification Using Dynamic Access Control and IPFS",
    authors: [
      "Ratul Hasan",
      "Samiha Farjana",
      "Yousuf Oley",
      "Md. Ohiduzaman Pranto",
      "Md Arik Rayhan",
    ],
    venue:
      "International Conference on Power, Electronics, Communications, Computing, and Intelligent Infrastructure (PECCII 2026) — IEEE Proceedings",
    date: "2026",
    status: "published",
    link: "https://doi.org/10.1109/PECCII70991.2026.11662071",
    type: "conference",
    digitalLibrary: "IEEE Xplore Digital Library",
  },
  {
    title:
      "Quantum-Resistant FOTA: End-to-End Decentralized Firmware Updates for IoT Using Blockchain and CRYSTALS-Dilithium",
    authors: [
      "Ratul Hasan",
      "Md. Momenul Haque",
      "Redoanul Haque",
      "Yousuf Oley",
      "Ruhani Akter",
    ],
    venue:
      "12th International Conference on Next Generation Computing, Communication, Systems and Security (NSysS '25), ACM, New York, NY, USA, 110-114",
    date: "December 2025",
    status: "published",
    link: "https://doi.org/10.1145/3777555.3777569",
    type: "conference",
    digitalLibrary: "ACM Digital Library",
  },
];

export type Project = {
  name: string;
  description: string;
  tools: string[];
  link: string;
  /** Key into `projectIcons` — the stack's real brand mark on the tile. */
  icon: string;
  language: string;
  languageColor: string;
  stars?: string;
};

export const projects: Project[] = [
  {
    name: "LedgerSeal",
    icon: "solidity",
    description:
      "A decentralized application (DApp) for constant-time document verification with dynamic access control on IPFS, built on a public blockchain.",
    tools: ["React JS", "Anvil EVM", "Foundry", "Metamask", "Pinata IPFS"],
    link: "https://github.com/ratulhasan001",
    language: "Solidity",
    languageColor: "#AA6746",
  },
  {
    name: "BAUET Project & Thesis Archive",
    icon: "django",
    description:
      "A repository website built with Django (MVT & REST) that indexes and presents theses and projects from BAUET.",
    tools: ["HTML", "Tailwind CSS", "JavaScript", "Django", "PostgreSQL"],
    link: "https://github.com/ratulhasan001",
    language: "Python",
    languageColor: "#3572A5",
  },
  {
    name: "PheroTube",
    icon: "javascript",
    description:
      "A basic JavaScript project for API fetching that mimics video streaming platform functionality with dynamic content loading.",
    tools: ["HTML", "CSS", "JavaScript", "API Integration"],
    link: "https://ratul-phero-tube.netlify.app/",
    language: "JavaScript",
    languageColor: "#F1E05A",
  },
  {
    name: "Library Management System",
    icon: "java",
    description:
      "A library management desktop application with comprehensive book and user management features.",
    tools: ["Java Swing", "MySQL"],
    link: "https://github.com/ratulhasan001/LMS",
    language: "Java",
    languageColor: "#B07219",
  },
  {
    name: "Fashion Quest",
    icon: "bootstrap",
    description:
      "A basic static website using CSS showcasing fashion trends and styles with modern responsive design and elegant layouts.",
    tools: ["HTML", "CSS", "Bootstrap", "Responsive Design"],
    link: "https://ratul-fashion-quest.netlify.app/",
    language: "Bootstrap",
    languageColor: "#7952B3",
  },
];

export const stats = [
  {
    label: "Publications",
    value: publications.filter(
      (p) => p.status === "accepted" || p.status === "published"
    ).length,
    suffix: "",
  },
  { label: "Research Projects", value: projects.length, suffix: "" },
  { label: "Problems Solved", value: 1000, suffix: "+" },
  { label: "Programming Awards", value: 6, suffix: "+" },
];

/**
 * Ordered from the most transferable to the most specialised, so the grid
 * reads languages -> what they are built with -> where the work sits.
 */
export const skills = {
  "Research Areas": [
    "Artificial Intelligence",
    "Cybersecurity",
    "Computer Vision",
    "Blockchain",
  ],
  Languages: ["Python", "C++", "C", "JavaScript", "SQL"],
  "Frameworks & Libraries": ["Django", "Laravel", "REST", "Foundry"],
  Databases: ["PostgreSQL", "MySQL"],
  "Tools & Workflow": ["Git", "GitHub"],
};

export const onlineJudges = [
  {
    platform: "Codeforces",
    stat: "Max Rating 1650 (Expert)",
    handle: "Ratul_Hasan",
    link: "https://codeforces.com/profile/Ratul_Hasan",
  },
  {
    platform: "Codechef",
    stat: "Max Rating 1676 (3 Star)",
    handle: "ratulhasan2108",
    link: "https://www.codechef.com/users/ratulhasan2108",
  },
  {
    platform: "LeetCode",
    stat: "50+ problems solved",
    handle: "ratulhasan001",
    link: "https://leetcode.com/u/ratulhasan001/",
  },
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

export type LeadershipEntry = {
  org: string;
  roles: string[];
  /** What the role actually involved, a point at a time. */
  points?: string[];
};

export const leadership: LeadershipEntry[] = [
  {
    org: "BAUET Computer Society",
    roles: [
      "President",
      "General Secretary",
      "IT Secretary 1",
      "IT Secretary 2",
      "Deputy IT and Skill Development Secretary",
      "Deputy Editorial Secretary",
    ],
  },
  {
    org: "Intra University Programming Contest, BAUET",
    roles: ["Problem Setter"],
    points: [
      "Wrote and reviewed the problems that went into the contest set.",
      "Prepared test cases and reference solutions for each problem.",
      "Tuned the difficulty so there was something for every skill level.",
    ],
  },
  {
    org: "HULT Prize, BAUET",
    roles: ["Officer of Documentation"],
    points: [
      "Looked after team registrations and records for the campus round.",
      "Wrote up the event reports once each stage wrapped.",
      "Kept submission material organised so the committee could find things fast.",
    ],
  },
];
