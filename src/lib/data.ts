export const profile = {
  name: "Ratul Hasan",
  handle: "ratulhasan001",
  role: "Computer Science Graduate · Aspiring Graduate Researcher",
  location: "Khulna, Bangladesh",
  email: "ratulhasan.cs@gmail.com",
  phone: "+8801760972108",
  website: "https://ratulhasan.dev",
  github: "https://github.com/ratulhasan001",
  linkedin: "https://linkedin.com/in/ratul-hasan-linked-in",
  orcid: "https://orcid.org/0009-0009-5429-7501",
  scholar: "https://scholar.google.com/citations?user=EfwUJ2cAAAAJ&hl=en",
  headline: "Aspiring Graduate Researcher",
  tagline:
    "Computer Science graduate with research experience in Artificial Intelligence and LLM security, now building hands-on DevOps and MLOps skills",
  /** Research statement shown in the hero; ties the publication record into one thread. */
  summary:
    "My research sits where security meets machine learning: how LLM agents, IoT devices and clinical models can be attacked, and how to make them trustworthy. I have first-authored peer-reviewed work on post-quantum firmware updates and blockchain document verification, and I now study prompt-injection attacks on LLM-based home agents and their defences. I am preparing for graduate research in AI security and trustworthy machine learning.",
  focusAreas: [
    "LLM Safety & Security",
    "Trustworthy ML",
    "IoT & Post-Quantum Security",
    "Healthcare AI",
    "MLOps",
  ],
  followersLabel: "Open to research collaboration",
};

export type Position = {
  role: string;
  period: string;
  current?: boolean;
  /** What this title covered; shown under it in the stacked flow. */
  bullets?: string[];
  /** Supervisor / PI lines shown under the period. */
  supervisors?: Supervisor[];
};

export type Experience = {
  org: string;
  role: string;
  location: string;
  period: string;
  current?: boolean;
  /**
   * Titles held at the same org, newest first. With more than one, the entry
   * renders LinkedIn-style: the org as the heading and each title stacked on a
   * small rail beneath it.
   */
  positions?: Position[];
  bullets: string[];
  tags: string[];
  /** Path under /public — falls back to the timeline dot when absent. */
  logo?: string;
};

export const experience: Experience[] = [
  {
    org: "ELITE Research Lab LLC",
    role: "Research Assistant",
    location: "Queens, NY, USA (Remote)",
    period: "June 2026 - Present",
    current: true,
    positions: [
      {
        role: "Research Assistant",
        period: "October 2026 - Present",
        current: true,
        supervisors: [
          {
            name: "Md Kishor Morol",
            role: "Supervisor",
            title: "PhD Student, Cornell University, USA",
            link: "https://scholar.google.com/citations?user=pjn3jg4AAAAJ",
          },
          {
            name: "S M Musfequr Rahman",
            role: "PI",
            title: "PhD Student, Tampere University, Finland",
            link: "https://scholar.google.com/citations?user=GdaEBwsAAAAJ&hl=en",
          },
        ],
        bullets: [
          "Contributing to a journal study that maps attacker-controllable IoT metadata as an indirect prompt-injection surface for LLM-based home agents.",
          "Measuring which Home Assistant device and integration text fields reach its built-in LLM conversation agents, and how often injected instructions trigger unauthorized physical actions or leak private state in a simulated home.",
          "Evaluating how provenance tagging, actuating-tool gating and action confirmation reduce attack success, and their cost in benign-task utility.",
        ],
      },
      {
        role: "Research Intern",
        period: "June 2026 - September 2026",
        supervisors: [
          {
            name: "Md Kishor Morol",
            role: "Supervisor",
            title: "PhD Student, Cornell University, USA",
            link: "https://scholar.google.com/citations?user=pjn3jg4AAAAJ",
          },
          {
            name: "Shakib Sadat Shanto",
            role: "PI",
            title: "PhD Student, University of Maine, USA",
            link: "https://scholar.google.com/citations?user=twShbgIAAAAJ&hl=en",
          },
        ],
        bullets: [
          "First-authored a systematic review of 82 studies on LLMs in mental health, appraising methodological rigour and risk reporting (hallucination, bias, safety, human evaluation) with a 24-field extraction instrument.",
          "Studied catastrophic forgetting in federated continual learning for mental health text classification, separating label-space shift from domain shift on Reddit stress and depression data.",
          "Benchmarked seven training regimes, including FedAvg, FedProx, EWC, replay and centralized baselines, across 10 clients and three seeds with a MiniLM encoder.",
        ],
      },
    ],
    bullets: [],
    tags: ["LLM", "NLP", "LLM Security", "Federated Learning", "Research"],
    logo: "/logo/elitelab.jpeg",
  },
  {
    org: "BAUET Computer Society, Dept. of CSE, BAUET",
    role: "Programming Instructor",
    location: "Natore, Bangladesh",
    period: "July 2024 - December 2025",
    bullets: [
      "Conducted programming classes for undergraduate students covering C, C++ and basic data structures.",
      "Led coding exercises and programming contest preparation sessions to strengthen students' problem-solving and analytical skills.",
      "Explained programming concepts to students of varying skill levels and supported the development of their programming fundamentals.",
    ],
    tags: ["C", "C++", "Data Structures", "Teaching"],
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

export type Supervisor = {
  name: string;
  /** "Supervisor", "Co-supervisor" or "PI". */
  role: string;
  title: string;
  /** Google Scholar or faculty profile. */
  link?: string;
};

export type Education = {
  school: string;
  degree: string;
  location: string;
  period: string;
  detail?: string;
  merit?: string;
  score?: { label: string; value: number; scale: number };
  supervisors?: Supervisor[];
  /** Path under /public — falls back to the timeline dot when absent. */
  logo?: string;
};

export const education: Education[] = [
  {
    school: "Bangladesh Army University of Engineering & Technology (BAUET)",
    degree: "B.Sc. in Computer Science and Engineering",
    location: "Natore, Bangladesh",
    period: "2022 - July 2026",
    detail:
      "Thesis: Biology-Informed Recurrent Neural Networks for Longitudinal Hippocampal Atrophy Forecasting in Alzheimer's Disease",
    score: { label: "CGPA", value: 3.82, scale: 4.0 },
    supervisors: [
      {
        name: "Ananya Sarker",
        role: "Supervisor",
        title: "Associate Professor & Head, Dept. of CSE, BAUET",
        link: "https://scholar.google.com/citations?user=Ugm8unoAAAAJ&hl=en",
      },
      {
        name: "Md. Momenul Haque",
        role: "Co-supervisor",
        title: "Lecturer, Dept. of CSE, BAUET",
        link: "https://scholar.google.com/citations?user=mqiCTO8AAAAJ&hl=en",
      },
    ],
    logo: "/logo/bsc.png",
  },
  {
    school: "Govt. Majid Memorial City College",
    degree: "Higher Secondary School Certificate",
    location: "Khulna, Bangladesh",
    period: "2019 - 2021",
    score: { label: "GPA", value: 5.0, scale: 5.0 },
    logo: "/logo/hsc.png",
  },
];

export type Publication = {
  title: string;
  /** Full byline in submission order; `profile.name` is highlighted on render. */
  authors: string[];
  venue: string;
  date: string;
  status:
    | "published"
    | "accepted"
    | "presented"
    | "under-review"
    | "under-submission"
    | "preprint";
  link?: string;
  type: "conference" | "journal" | "preprint";
  /** Manuscript isn't public yet; offer the preprint by email instead. */
  preprintOnRequest?: boolean;
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
  "Frontiers in Digital Health": "Frontiers",
  SSRN: "SSRN",
};

export const publications: Publication[] = [
  {
    title:
      "Entropy-assured post-quantum key generation on IoT edge devices: source independence, measured min-entropy and signature scheme selection",
    authors: ["Ratul Hasan", "Md Arik Rayhan", "Md Ohiduzaman Pranto"],
    venue: "PLOS ONE",
    date: "Submitted 2026",
    status: "under-review",
    type: "journal",
    digitalLibrary: "PLOS ONE",
    preprintOnRequest: true,
  },
  {
    title:
      "BI-RNN: Biology-Informed Recurrent Neural Networks for Longitudinal Hippocampal Atrophy Forecasting in Alzheimer's Disease",
    authors: ["Ratul Hasan", "Md. Momenul Haque", "Ananya Sarker"],
    venue: "Scientific Reports",
    date: "Submitted May 2026",
    status: "under-review",
    type: "journal",
    digitalLibrary: "Springer Nature Link",
    preprintOnRequest: true,
  },
  {
    title:
      "Methodological Rigour and Risk Evaluation of Large Language Models in Mental Health: A Systematic Review",
    authors: [
      "Ratul Hasan",
      "Mizanul Hoque",
      "Moinul Hossain",
      "Md Kishor Morol",
      "Tze Hui Liew",
    ],
    venue: "Frontiers in Digital Health (Digital Mental Health section)",
    date: "2026",
    status: "under-submission",
    type: "journal",
    digitalLibrary: "Frontiers in Digital Health",
    preprintOnRequest: true,
  },
  {
    title:
      "Disentangling Label-Space Shift from Domain Shift in Federated Continual Learning for Mental Health Text Classification",
    authors: ["Ratul Hasan", "Mizanul Hoque"],
    venue: "SSRN (preprint)",
    date: "2026",
    status: "preprint",
    link: "https://doi.org/10.2139/ssrn.7662638",
    type: "preprint",
    digitalLibrary: "SSRN",
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
  date: "Presented 2026 · proceedings pending",
  status: "presented",
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
  date: "Presented 2026 · proceedings pending",
  status: "presented",
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
    date: "2025",
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
  /** External repo or live site; optional when `detailsHref` is set. */
  link?: string;
  /** Key into `projectIcons` — the stack's real brand mark on the tile. */
  icon: string;
  language: string;
  languageColor: string;
  stars?: string;
  supervisors?: Supervisor[];
  /** Work still in progress; the card carries a live "Ongoing" badge. */
  ongoing?: boolean;
  /** Short track label shown next to the ongoing badge, e.g. "DevOps". */
  track?: string;
  /** Internal case-study page; takes over the card footer from `link`. */
  detailsHref?: string;
};

export const projects: Project[] = [
  {
    name: "LedgerSeal",
    icon: "solidity",
    description:
      "A decentralized application (DApp) for constant-time document verification with dynamic access control on IPFS, built on an EVM-compatible blockchain.",
    tools: ["React", "Anvil EVM", "Foundry", "MetaMask", "Pinata IPFS"],
    link: "https://github.com/ratulhasan001/LedgerSeal",
    language: "Solidity",
    languageColor: "#AA6746",
    supervisors: [
      {
        name: "Mohammed Golam Sarwar Bhuyan",
        role: "Supervisor",
        title: "Professor & Dean, Faculty of ECE, BAUET",
      },
    ],
  },
  {
    name: "Folionix",
    icon: "kubernetes",
    description:
      "My hands-on DevOps learning project: my BAUET thesis archive rebuilt as a 5-service platform, which I am taking step by step through containers, CI/CD, Kubernetes, Terraform and observability.",
    tools: ["Docker", "GitHub Actions", "Trivy", "Django", "FastAPI"],
    detailsHref: "/projects/folionix",
    language: "DevOps",
    languageColor: "#326CE5",
    ongoing: true,
    track: "DevOps",
  },
  {
    name: "BAUET Project & Thesis Archive",
    icon: "django",
    description:
      "A repository website built with Django (MVT & REST) that indexes and presents theses and projects from BAUET.",
    tools: ["HTML", "Tailwind CSS", "JavaScript", "Django", "PostgreSQL"],
    link: "https://github.com/ratulhasan001/BAUET_archive_project",
    language: "Python",
    languageColor: "#3572A5",
  },
];

/**
 * Ordered from the most transferable to the most specialised, so the grid
 * reads languages -> what they are built with -> where the work sits.
 */
export const skills = {
  "Research Interests": [
    "Deep Learning",
    "NLP & Large Language Models",
    "LLM Safety & Security",
    "MLOps & DevOps for ML Systems",
    "Cloud Infrastructure & CI/CD Automation",
  ],
  Languages: ["Python", "C", "C++", "JavaScript", "SQL", "Solidity"],
  "ML & Research": ["PyTorch", "Hugging Face"],
  "Web & Blockchain": [
    "Django",
    "Django REST Framework",
    "Laravel",
    "React",
    "Foundry",
    "IPFS",
  ],
  "DevOps & Databases": [
    "Git",
    "GitHub",
    "GitHub Actions",
    "Docker",
    "Trivy",
    "Linux",
    "PostgreSQL",
    "MySQL",
  ],
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

export type Certification = {
  title: string;
  issuer: string;
  issued: string;
  expired?: string;
  credentialId: string;
  link: string;
};

export const certifications: Certification[] = [
  {
    title: "Learning Linux Basics Course & Labs",
    issuer: "KodeKloud",
    issued: "Oct 2026",
    credentialId: "aabb68ba-e4fa-4406-b8ba-d666f416785d",
    link: "https://learn.kodekloud.com/certificate/aabb68ba-e4fa-4406-b8ba-d666f416785d",
  },
  {
    title: "Certification: Blockchain Basics",
    issuer: "Cyfrin",
    issued: "Jun 2025",
    expired: "Jun 2026",
    credentialId: "BBCC-DGDYVBMXZR1E",
    link: "https://updraft.cyfrin.io/courses/blockchain-basics/final/proficiency-exam",
  },
  {
    title: "CSE Fundamentals with Phitron",
    issuer: "Programming Hero",
    issued: "Jan 2025",
    credentialId: "PHBATCH32834351116",
    link: "https://phitron.io/verification",
  },
  {
    title: "Supervised Machine Learning: Regression and Classification",
    issuer: "Coursera",
    issued: "Jan 2025",
    credentialId: "09NLSY4G7XI5",
    link: "https://www.coursera.org/account/accomplishments/records/09NLSY4G7XI5",
  },
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
