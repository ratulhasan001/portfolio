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
    "Computer Science graduate with research experience in Artificial Intelligence and Cybersecurity, now building hands-on DevOps skills",
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
  /** Path under `public/` to proof of this title, shown after the bullets. */
  certificate?: string;
  certificateLabel?: string;
};

export type Experience = {
  org: string;
  /** Organisation's site; the org name links to it. */
  website?: string;
  /** The organisation's own social pages, shown beside its location. */
  socials?: { kind: "linkedin" | "github"; href: string }[];
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
  /** Path under `public/` to an experience letter or certificate for the role. */
  certificate?: string;
  certificateLabel?: string;
  /**
   * Verification details shown under the org. `email` renders as a mailto
   * link; leave it out for identifiers that only look like an address.
   */
  contacts?: { label: string; value: string; email?: boolean }[];
};

export const experience: Experience[] = [
  {
    org: "ELITE Research Lab LLC",
    website: "https://elitelab.ai/",
    socials: [
      { kind: "linkedin", href: "https://www.linkedin.com/company/elite-lab-ai/" },
      { kind: "github", href: "https://github.com/eliteresearchlab" },
    ],
    role: "Research Assistant",
    location: "Queens, NY, USA (Remote)",
    period: "June 2026 - Present",
    current: true,
    positions: [
      {
        role: "Research Assistant",
        period: "October 2026 - Present",
        current: true,
        certificate: "/certificates/elite-research-assistant-certificate.pdf",
        certificateLabel: "Recognition certificate",
        supervisors: [
          {
            name: "Md Kishor Morol",
            role: "Supervisor",
            link: "https://www.linkedin.com/in/kishormorol/",
          },
        ],
        bullets: [
          "Contributing to a journal study on prompt-injection security risks in LLM-based smart-home agents.",
          "Designing and running experiments to measure how such attacks affect agent behaviour in a simulated home environment.",
          "Evaluating defences and their trade-off between security and task performance.",
        ],
      },
      {
        role: "Research Intern",
        period: "June 2026 - September 2026",
        certificate: "/certificates/elite-research-intern-certificate.pdf",
        certificateLabel: "Completion certificate",
        supervisors: [
          {
            name: "Md Kishor Morol",
            role: "Supervisor",
            link: "https://www.linkedin.com/in/kishormorol/",
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
    logo: "/logo/elitelab.png",
    contacts: [
      // Lab account ID (also the portal login), not a mailbox, so it is shown as plain text.
      { label: "Lab Member ID", value: "ratul.hasan@elitelab.ai" },
      { label: "Lab Contact", value: "info@elitelab.ai", email: true },
    ],
  },
  {
    org: "BAUET Computer Society, Dept. of CSE, BAUET",
    role: "Programming Instructor",
    location: "Natore, Bangladesh",
    period: "July 2024 - December 2025",
    bullets: [
      "Taught C, C++ and basic data structures to undergraduate students as a volunteer instructor over three semesters.",
      "Ran coding exercises and programming contest practice sessions.",
    ],
    tags: ["C", "C++", "Data Structures", "Teaching"],
    logo: "/logo/bsc.png",
    certificate: "/certificates/bauet-cse-programming-instructor-experience-letter.pdf",
    certificateLabel: "Experience letter",
  },
  {
    org: "Lab AR",
    role: "Software Engineering Intern",
    location: "Dhaka, Bangladesh",
    period: "July 2025 - August 2025",
    bullets: [
      "Led a team project to develop a web-based Property Management System.",
      "Built backend features in Laravel (PHP).",
    ],
    tags: ["Laravel", "PHP", "Backend"],
    logo: "/logo/labar.jpeg",
  },
];

export type Supervisor = {
  name: string;
  /** "Supervisor", "Co-supervisor" or "PI". */
  role: string;
  /** Position and affiliation; optional, the name alone is shown when absent. */
  title?: string;
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
  /** Path under `public/` to proof of presentation, for papers whose proceedings aren't out yet. */
  certificate?: string;
  /** Paragraphs separated by a blank line ("\n\n"). */
  abstract?: string;
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
    date: "Submitted September 2026",
    status: "under-review",
    type: "journal",
    abstract:
      "Post-quantum key generation rests on an assumption that is rarely measured: that the random seed behind the key carried enough entropy. FIPS 204 makes the dependence exact, since ML-DSA key generation is a deterministic function of a 32-byte seed. The post-quantum Internet-of-Things literature has nonetheless concentrated on scheme performance rather than on where that seed comes from. We characterise a seven-source hardware entropy module, comprising six analogue sensor channels and a watchdog-oscillator jitter source, under NIST SP 800-90B with 10⁶ raw samples per analogue source, and connect the measured source to FIPS 204 ML-DSA-87 key generation on a Raspberry Pi 4 gateway. Three results follow. Per-source min-entropy varies by a factor of 3.4 across the array, from 0.214 to 0.726 bits per sample, so a single aggregate figure misrepresents the source. Three nominally independent sensor channels prove strongly dependent, with Pearson correlation up to +0.966 on raw sample values; treating them as independent inflates the entropy budget from a corrected 203 to 412 bits per block to a nominal 680, and under the most conservative grouping the budget falls below the 256 bits an ML-DSA seed requires. Correlation measured on least significant bits alone conceals two of the three dependent pairs, so the test a multi-source design would most naturally apply is the one least able to detect the problem. Finally, an eight-scheme benchmark on a Cortex-A72 grounds the selection of ML-DSA-87 against Falcon and SLH-DSA, and corrects a previously published sub-millisecond verification figure by two orders of magnitude. We argue that inter-source independence testing belongs in the validation path of any multi-source entropy design, and that entropy provenance should be recorded alongside the keys it produces.",
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
    abstract:
      "Accurate prediction of longitudinal hippocampal atrophy is essential for the monitoring of Alzheimer's disease (AD) progression. While Recurrent Neural Networks (RNNs) excel at time-series forecasting, traditional data-driven models make predictions across the volume that do not align with the known disease mechanisms of neurodegeneration and thus cannot generally be relied upon in clinical practice. In this paper, we propose a novel Biology-Informed RNN framework that mathematically incorporates physiological constraints in the optimization of the network. Hippocampal volumes were extracted from 382 ADNI subjects (99 AD, 148 MCI, 135 CN) using FastSurfer, spanning 36 months of longitudinal follow-up. Using this data, we formulated a custom objective function that enforces three biological constraints: monotonic decline, bounded growth within MRI noise limits, and plausible atrophy rates. We integrated this physiological corridor into standard architectures and compared their predictive performance against eight model variants spanning statistical (ARIMA), ensemble (XGBoost), and standard recurrent (GRU, LSTM, Bi-LSTM) baselines. The results demonstrate that embedding biological rules actively guides the network toward more generalizable loss minima. Unconstrained architectures exhibited both elevated prediction error and systematic biological implausibility: the standard LSTM yielded a Mean Absolute Error (MAE) of 140.13 mm³ with a 7.79% biological violation rate, while the standard Bi-LSTM reached 9.10% violations. The Bio-Informed LSTM reduced MAE to 119.56 mm³ and eliminated all biological violations (0.00%), consistent with the atrophic hippocampal patterns typical of AD/MCI population. The Bio-Informed GRU achieved the best overall predictive performance (MAE: 115.00 mm³; Pearson r: 0.9938; violation rate: 0.00%). By harmonizing empirical risk minimization with domain-specific neurological constraints, our proposed approach offers a highly accurate and clinically trustworthy deep learning framework for longitudinal biomarker tracking, achieving Pearson correlations exceeding 0.993 across all Biology-Informed recurrent architectures.",
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
    date: "Submitted 2026",
    status: "under-review",
    type: "journal",
    abstract:
      "Background. Large language models (LLMs) are being applied to a range of mental health tasks. Seven systematic or scoping reviews retrieved by this search are organised around application areas rather than methodology and each closed its search before the majority of the studies included here were published.\n\nObjective. To synthesise, compare and critically appraise the research methodologies used in the included LLM-based mental health studies and to characterise their evidential standards rather than their reported performance.\n\nMethods. Methodology-only extraction was performed across 82 studies using a uniform 24-field instrument. Four fields were dedicated to risk reporting: hallucination, bias, safety and human evaluation. Absence was recorded as data, with “Not Reported” distinguished from “not applicable”. Results were deliberately excluded from extraction. Findings were synthesised narratively; no quantitative pooling was attempted.\n\nResults. Studies clustered into corpus construction, model adaptation, benchmark construction, human and clinical evaluation and risk assurance. Clinical data underpinned 4 of 13 corpus-building studies. Of 82 studies, 35 (43%) reported inferential statistics and 24 (29%) any reliability coefficient; 51 of the 74 studies using human evaluation reported no agreement statistic. Risk coverage was high but shallow: 74 studies addressed safety yet 22 tested output behaviour and 69 addressed bias yet 8 applied a recognisable bias method. Decoding parameters were absent from 66 of 82 studies and 2 studies were preregistered. One underpowered exploratory trial constituted the prospective evidence base within the corpus.\n\nConclusions. Constraints on interpretation are the scarcity of reported agreement statistics, the gap between nominal and substantive risk evaluation and the absence of powered clinical trials among the included studies. Reliability reporting and output-safety testing are more common among the more recently published studies, though decoding-parameter reporting and preregistration are not.",
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
    abstract:
      "A deployed mental-health classifier faces two quite different kinds of change. The annotation scheme may be revised, or the data source may change. Federated continual learning is usually evaluated with a single forgetting number that mixes the two, so a practitioner cannot tell which change to prepare for. We separate them by construction. The first two stages of our stream use the same 3,553 Reddit posts, first under a binary stress label space and then under a four-class depression severity scale. The join was verified at a 100% match rate, so the text is fixed and only the label space moves. A third stage brings in a different corpus and a different task. We run seven training regimes over three seeds. In four of the five methods where the two terms can be compared, the label-space change alone accounts for most of the forgetting on the first task, and the later stage that adds a new corpus costs little more. For three methods it partially restores first-task performance. The mitigations disagree about which drift they handle. Replay gives the lowest label-shift forgetting (+0.066 macro-F1) but the largest additional cost from the new corpus (+0.096), and elastic weight consolidation behaves the other way round. Federation raises average macro-F1 by 0.071 over local-only training and lowers the weakest client by 0.089. No new algorithm is proposed here. The contribution is the controlled decomposition, and what it shows about when each existing mitigation is worth using.",
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
    "5th IEEE International Conference on Signal Processing, Information, Communication and Systems (SPICSCON 2026), IEEE Proceedings",
  date: "Presented 2026",
  status: "presented",
  type: "conference",
  digitalLibrary: "IEEE Xplore Digital Library",
  certificate:
    "/certificates/spicscon2026-splitsafe-ultra-presentation-certificate.pdf",
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
    "5th IEEE International Conference on Signal Processing, Information, Communication and Systems (SPICSCON 2026), IEEE Proceedings",
  date: "Presented 2026",
  status: "presented",
  type: "conference",
  digitalLibrary: "IEEE Xplore Digital Library",
  certificate:
    "/certificates/spicscon2026-activisionnet-fusion-presentation-certificate.pdf",
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
      "International Conference on Power, Electronics, Communications, Computing, and Intelligent Infrastructure (PECCII 2026), IEEE Proceedings",
    date: "2026",
    status: "published",
    link: "https://doi.org/10.1109/PECCII70991.2026.11662071",
    type: "conference",
    abstract:
      "Existing blockchain-based document verification systems suffer from scalability bottlenecks and high gas costs due to unrestricted uploads, duplicate on-chain storage, and inefficient transaction processing. To address these limitations, this paper proposes a decentralized framework integrating IPFS for off-chain document storage and Ethereum smart contracts for secure on-chain state management. An owner-controlled dynamic access mechanism using OpenZeppelin AccessControl restricts uploads to authorized entities, proactively reverts duplicate hash entries, and employs direct Solidity state-mapping for constant-time, dataset-independent cryptographic lookups. The system’s operational scalability is confirmed through performance analysis in the 1,000 fuzzed transaction executions and 10,000-document batch load test run using the Foundry testing suite. In the architecture, the duplication of gas usage is avoided actively by reverting uploads, average 41,317 gas is spent on the baseline document storage. More importantly, a batch-processing also helps to keep the amortized cost to 32,297 gas per document, and it gives 21.8% efficiency improvement. The verification process is also very lightweight in terms of read cost at the average read cost of 1,471 gas, and the highest read cost of 36 gas was recorded over all fuzzed inputs. These findings illustrate that a dynamic permissioning approach, active de-duplication and batch optimization is a feasible and less expensive solution to the problem of applications that need to have a robust document provenance, namely, enterprise credentialing and legal workflows.",
    digitalLibrary: "IEEE Xplore Digital Library",
    certificate:
      "/certificates/peccii2026-gas-optimized-blockchain-presentation-certificate.pdf",
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
    abstract:
      "The advent of quantum computing necessitates a paradigm shift in securing Firmware-Over-The-Air (FOTA) updates for Internet of Things (IoT) devices. To address this issue, we propose and evaluate a novel quantum-resistant FOTA architecture that integrates three key technologies: the CRYSTALS-Dilithium-5 signature scheme for post-quantum authentication, leveraging an Ethereum smart contract for immutable firmware registration, and the InterPlanetary File System (IPFS) for resilient distribution. Our prototype, benchmarked over 1,000 iterations in a browser environment, validates the practicality of this approach. We measured an average signature verification time of 0.1214 ms for Dilithium, providing 192-bit post-quantum security while incurring a manageable 1.5× performance overhead compared to the quantum-vulnerable ECDSA P-256 standard. While publisher-side signing incurs a 7.7× overhead, yet the sub-millisecond verification confirms client-side feasibility. This paper presents the full system design, a comprehensive performance analysis, and discusses adapting this model to embedded Linux platforms (e.g., Raspberry Pi) and the challenges for resource-constrained microcontrollers.",
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
    "AI in Medical Imaging",
    "Cloud Infrastructure",
    "DevOps",
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
  "Tools & Databases": [
    "Git",
    "GitHub",
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

export type Achievement = {
  text: string;
  /** Path under `public/` to the certificate backing this line. */
  certificate?: string;
  /** Link text when the certificate proves less than the line claims, e.g. participation only. */
  certificateLabel?: string;
};

export const achievements: Achievement[] = [
  { text: "1x ICPC Regionalist (Team: BAUET_Rong_Answer)" },
  {
    text: "1x National Collegiate Programming Contest (JU): Rank 149 (Team: BAUET_PARADIGM)",
  },
  {
    text: "2x Inter-University Programming Contest: Best Rank 45 at IUT (Team: BAUET_Twisted_Minds)",
    certificate: "/certificates/iut-national-ict-fest-2024-participation-certificate.pdf",
    certificateLabel: "Participation certificate",
  },
  {
    text: "Ranked 10th, Independence Day Programming Contest, Military Institute of Science & Technology",
    certificate:
      "/certificates/mist-independence-day-programming-contest-2023-10th-place-certificate.pdf",
  },
  {
    text: "1x Champion, Intra-University Programming Contest (Team)",
    certificate:
      "/certificates/intra-bauet-programming-contest-2023-team-champion-certificate.pdf",
  },
  {
    text: "1x 2nd Runner-up, MIND STORM 4.0 Programming Contest, BAUET",
    certificate: "/certificates/mind-storm-4-programming-contest-2nd-runner-up-certificate.pdf",
  },
  {
    text: "1x Runner-up, Intra-University Programming Contest (Solo)",
    certificate:
      "/certificates/intra-bauet-programming-contest-2023-individual-1st-runner-up-certificate.pdf",
  },
  {
    text: "1x 1st Runner-up, Intra-University Three Minute Thesis (3MT) Presentation",
    certificate:
      "/certificates/bauet-tech-fair-2025-three-minute-thesis-1st-runner-up-certificate.pdf",
  },
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
  /** Path under `public/` to the certificate for the senior role. */
  certificate?: string;
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
    certificate: "/certificates/bauet-computer-society-president-certificate.pdf",
  },
  {
    org: "Intra-University Programming Contest, BAUET",
    roles: ["Problem Setter"],
  },
  {
    org: "Hult Prize, BAUET",
    roles: ["Officer of Documentation"],
    certificate: "/certificates/hult-prize-bauet-officer-of-documentation-certificate.pdf",
  },
];
