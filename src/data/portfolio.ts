import type { PortfolioData } from "@/types";

/**
 * SINGLE SOURCE OF TRUTH
 * ----------------------
 * All site content lives here so it can be edited without touching components.
 * Every field below is drawn directly from Kashish Chopra's resume.
 * Do not add invented statistics, links, or achievements.
 *
 * To connect live project links later: fill `github` / `demo` on any project.
 * To update the resume: replace /public/assets/Kashish_Chopra_Resume.pdf and
 * bump `resume.lastUpdated`.
 */
export const portfolio: PortfolioData = {
  identity: {
    displayName: "KASHISH'S AI",
    realName: "Kashish Chopra",
    tagline: "AI/ML Developer • Generative AI Explorer • Intelligent Systems Builder",
    roles: ["AI/ML Developer", "Generative AI Explorer", "Intelligent Systems Builder"],
    summary:
      "AI/ML developer and final-stage Computer Science (AIML) undergraduate at The NorthCap University, Gurugram. I build intelligent systems across machine learning, computer vision and generative AI — including RAG pipelines and agentic workflows using LLM APIs, LangChain and LangGraph. Recent hands-on work spans an AI internship at HCL Tech building a RAG-based enterprise knowledge assistant, and an IT internship at Indian Oil Corporation focused on AI/ML applications and backend development.",
    interests: [
      "Generative AI & RAG systems",
      "Agentic AI and agent workflows",
      "Applied machine learning & computer vision",
      "Backend integration & reliable AI systems",
    ],
    location: "Gurugram / New Delhi, India",
    currentStatus: "B.Tech CSE (AIML) — expected 2027",
    availability: "Open to Work — internships & full-time roles (2027 graduate)",
    pronounSubject: "she",
    pronounObject: "her",
    pronounPossessive: "her",
  },
  photo: "/assets/kashish.png",
  resume: {
    file: "/assets/Kashish_Chopra_Resume.pdf",
    lastUpdated: "July 2026",
  },
  github: {
    username: "kashishhchopra",
    profileUrl: "https://github.com/kashishhchopra",
  },
  contact: [
    {
      id: "email",
      label: "Email",
      value: "kashishchopra2k05@gmail.com",
      href: "mailto:kashishchopra2k05@gmail.com",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "linkedin.com/in/kashish-chopra666559356",
      href: "https://www.linkedin.com/in/kashish-chopra666559356/",
    },
    {
      id: "github",
      label: "GitHub",
      value: "github.com/kashishhchopra",
      href: "https://github.com/kashishhchopra",
    },
    {
      id: "leetcode",
      label: "LeetCode",
      value: "leetcode.com/u/kashishchopra152",
      href: "https://leetcode.com/u/kashishchopra152/",
    },
  ],
  education: [
    {
      institution: "The NorthCap University",
      qualification: "B.Tech, Computer Science & Engineering (AIML)",
      score: "CGPA 7.95 / 10 (till Sem 6)",
      year: "Expected 2027",
      location: "Gurugram, Haryana, India",
      coursework: [
        "Data Structures",
        "Reinforcement Learning",
        "Database Management Systems",
        "Computer Networks",
        "Applied Computational Statistics",
        "Cyber Security",
        "Operating Systems",
        "Analysis & Design of Algorithms",
        "Software Engineering & Project Management",
        "AI for Robotics",
      ],
    },
  ],
  skills: [
    {
      id: "programming",
      label: "Programming",
      items: [
        { name: "Python", level: "Experienced" },
        { name: "JavaScript", level: "Working Knowledge" },
        { name: "TypeScript", level: "Working Knowledge" },
        { name: "Java", level: "Working Knowledge" },
        { name: "C", level: "Working Knowledge" },
        { name: "C#", level: "Working Knowledge" },
        { name: "SQL", level: "Working Knowledge" },
      ],
    },
    {
      id: "aiml",
      label: "AI & Machine Learning",
      items: [
        { name: "Machine Learning", level: "Experienced" },
        { name: "Reinforcement Learning", level: "Working Knowledge" },
        { name: "Computer Vision", level: "Working Knowledge" },
        { name: "OpenCV", level: "Working Knowledge" },
        { name: "OCR", level: "Working Knowledge" },
        { name: "NLP", level: "Working Knowledge" },
      ],
    },
    {
      id: "genai",
      label: "Generative AI & RAG",
      items: [
        { name: "Generative AI", level: "Experienced" },
        { name: "RAG", level: "Experienced" },
        { name: "LLM APIs", level: "Experienced" },
        { name: "Agentic AI", level: "Working Knowledge" },
        { name: "AI Agents", level: "Working Knowledge" },
        { name: "LangChain", level: "Working Knowledge" },
        { name: "LangGraph", level: "Working Knowledge" },
      ],
    },
    {
      id: "frameworks",
      label: "Frameworks & Libraries",
      items: [
        { name: "React", level: "Working Knowledge" },
        { name: "Next.js", level: "Working Knowledge" },
        { name: "Node.js", level: "Working Knowledge" },
        { name: "Django", level: "Working Knowledge" },
        { name: "Flask", level: "Working Knowledge" },
        { name: "FastAPI", level: "Working Knowledge" },
        { name: "ASP.NET Core", level: "Working Knowledge" },
        { name: "Entity Framework Core", level: "Working Knowledge" },
        { name: "NumPy", level: "Working Knowledge" },
        { name: "Pandas", level: "Working Knowledge" },
      ],
    },
    {
      id: "backend",
      label: "Backend & APIs",
      items: [
        { name: "REST APIs", level: "Working Knowledge" },
        { name: "API Development", level: "Working Knowledge" },
        { name: "Backend Integration", level: "Working Knowledge" },
        { name: "Data Pipelines", level: "Working Knowledge" },
        { name: "Real-Time Processing", level: "Working Knowledge" },
        { name: "Automation", level: "Working Knowledge" },
      ],
    },
    {
      id: "databases",
      label: "Databases",
      items: [
        { name: "MySQL", level: "Working Knowledge" },
        { name: "SQL Server", level: "Working Knowledge" },
        { name: "Vector Databases", level: "Working Knowledge" },
      ],
    },
    {
      id: "cloud",
      label: "Cloud",
      items: [
        { name: "Azure", level: "Familiar" },
        { name: "AWS", level: "Familiar" },
      ],
    },
    {
      id: "aitools",
      label: "AI-Assisted Development",
      items: [
        { name: "GitHub Copilot", level: "Working Knowledge" },
        { name: "Claude", level: "Working Knowledge" },
        { name: "ChatGPT", level: "Working Knowledge" },
        { name: "AI-Generated Code Debugging", level: "Working Knowledge" },
      ],
    },
    {
      id: "tools",
      label: "Developer Tools & Practice",
      items: [
        { name: "Git", level: "Working Knowledge" },
        { name: "GitHub", level: "Working Knowledge" },
        { name: "Debugging", level: "Working Knowledge" },
        { name: "Code Review", level: "Working Knowledge" },
        { name: "Troubleshooting", level: "Working Knowledge" },
      ],
    },
    {
      id: "web",
      label: "Web Technologies",
      items: [
        { name: "HTML5", level: "Working Knowledge" },
        { name: "CSS3", level: "Working Knowledge" },
        { name: "UI/UX (basic)", level: "Familiar" },
      ],
    },
  ],
  professionalSkills: [
    "Problem-Solving",
    "Team Collaboration",
    "Communication",
    "Adaptability",
    "Time Management",
    "Critical Thinking",
    "Public Speaking (debates / speeches)",
  ],
  projects: [
    {
      id: "enterprise-knowledge-assistant",
      name: "Enterprise Knowledge Assistant",
      tagline: "A RAG chatbot that answers company questions only from company documents.",
      role: "Built during the AI internship at HCL Tech",
      year: "Jun – Jul 2026",
      categories: ["Generative AI", "RAG", "AI/ML"],
      problem:
        "Employees waste time searching scattered company brochures and documents for accurate answers.",
      solution:
        "A RAG-based company chatbot that retrieves relevant information from uploaded brochures and returns accurate, context-aware answers grounded in the source documents.",
      technologies: ["Python", "LLM", "RAG", "Agentic AI", "NLP", "Vector Database"],
      features: [
        "Retrieval-augmented answers grounded in company documents",
        "Agentic AI to automate document search and query understanding",
        "Context-aware responses generated from source material",
      ],
      status: "Completed",
      architecture: {
        summary:
          "Two paths share one vector store: an offline ingestion path that turns brochures into embeddings, and an online query path where an agent step interprets the question before retrieval grounds the answer.",
        nodes: [
          { id: "docs", label: "Company Brochures", kind: "input", detail: "Source PDFs and documents uploaded by the business. Treated as the only source of truth — nothing outside this corpus may appear in an answer." },
          { id: "query", label: "Employee Question", kind: "input", detail: "A natural-language question, often vague or phrased in internal shorthand." },
          { id: "chunk", label: "Chunk & Clean", kind: "process", detail: "Documents are split into overlapping passages small enough to embed precisely but large enough to keep a complete thought intact." },
          { id: "agent", label: "Agentic Query Router", kind: "process", detail: "An agent step rewrites vague questions into retrievable form and decides what to look up before any search runs." },
          { id: "embed", label: "Embedding Model", kind: "model", detail: "Converts each passage into a vector so that semantic similarity — not keyword overlap — drives retrieval." },
          { id: "retrieve", label: "Semantic Retrieval", kind: "process", detail: "Embeds the rewritten query and pulls the closest passages from the store." },
          { id: "vdb", label: "Vector Database", kind: "store", detail: "Holds passage vectors plus the source metadata needed to trace every answer back to a document." },
          { id: "llm", label: "LLM Generation", kind: "model", detail: "Answers using only the retrieved passages, under a prompt that forbids drawing on outside knowledge." },
          { id: "answer", label: "Grounded Answer", kind: "output", detail: "The response, tied to source material. When retrieval returns nothing relevant, the assistant says so instead of guessing." },
        ],
        edges: [
          { from: "docs", to: "chunk" },
          { from: "chunk", to: "embed", label: "passages" },
          { from: "embed", to: "vdb", label: "index" },
          { from: "query", to: "agent" },
          { from: "agent", to: "retrieve", label: "rewritten query" },
          { from: "retrieve", to: "vdb", label: "similarity search" },
          { from: "vdb", to: "llm", label: "top-k context" },
          { from: "llm", to: "answer" },
        ],
        columns: [["docs", "query"], ["chunk", "agent"], ["embed", "retrieve"], ["vdb"], ["llm"], ["answer"]],
      },
      decisions: [
        {
          id: "rag-over-finetune",
          title: "Retrieval instead of fine-tuning",
          choice: "Keep a general LLM and ground it with retrieval at query time.",
          alternatives: ["Fine-tune a base model on the brochure corpus", "Keyword search over documents"],
          rationale:
            "Company documents get revised constantly. Re-indexing a changed brochure takes seconds; retraining a model takes a pipeline and a GPU budget. Retrieval also keeps a traceable link from answer back to source, which fine-tuning destroys.",
          tradeoff:
            "Answer quality becomes a retrieval problem. If the right passage isn't fetched, a capable model still answers badly — so evaluation has to test retrieval separately from generation.",
        },
        {
          id: "chunking",
          title: "Overlapping passages over whole documents",
          choice: "Split documents into overlapping chunks rather than embedding whole files.",
          alternatives: ["One embedding per document", "Fixed-size chunks with no overlap"],
          rationale:
            "A whole-brochure embedding is an average of everything in it and matches nothing precisely. Overlap prevents a definition from being severed from the sentence that uses it.",
          tradeoff:
            "Duplicated text inflates the index and can return several near-identical passages, spending context window on redundancy.",
        },
        {
          id: "agentic-routing",
          title: "An agent step before retrieval",
          choice: "Let an agent interpret and rewrite the query before searching.",
          alternatives: ["Embed the raw user question directly"],
          rationale:
            "Real questions arrive as 'what's the policy on this?' — under-specified text that embeds poorly. Rewriting the query first fixes the retrieval input rather than trying to repair a bad result afterwards.",
          tradeoff: "An extra model call on every question, paid for in latency and tokens before retrieval even starts.",
        },
        {
          id: "refuse-when-ungrounded",
          title: "Refusing beats guessing",
          choice: "When retrieval finds nothing relevant, say so rather than answering from the model's own knowledge.",
          alternatives: ["Fall back to the model's general knowledge", "Always return the closest passage"],
          rationale:
            "A confident wrong answer about company policy is worse than no answer — an employee would act on it. Refusal keeps the assistant's authority tied to the documents.",
          tradeoff: "More 'I don't have that' responses, which read as unhelpful until users learn the boundary is deliberate.",
        },
      ],
      challenges: [
        {
          problem: "Retrieval returned passages that were topically close but answered a different question.",
          approach: "Tightened chunk boundaries so each passage carried one complete idea, and added the agent rewrite step so the query matched the way documents are actually phrased.",
        },
        {
          problem: "The model would quietly fill gaps with plausible-sounding general knowledge.",
          approach: "Constrained the generation prompt to the retrieved context and made 'not in the documents' an explicit, acceptable output.",
        },
      ],
      learnings: [
        "In a RAG system, most quality failures are retrieval failures wearing a generation costume.",
        "Grounding is a product decision as much as a technical one — the assistant is more useful when it is allowed to decline.",
      ],
    },
    {
      id: "vistora",
      name: "VISTORA — E-Commerce Shopping Web Application",
      tagline: "A full-stack ASP.NET Core storefront where authorisation fails closed by default.",
      year: "Jun – Jul 2025",
      categories: ["Web Development"],
      problem:
        "Building a secure, full-stack shopping experience with product, order and user management.",
      solution:
        "A full-stack e-commerce platform built with ASP.NET Core MVC featuring secure authentication and role-based access, backed by SQL Server and Entity Framework Core.",
      technologies: [
        "ASP.NET Core MVC",
        "C#",
        "SQL Server",
        "Entity Framework Core",
        "HTML/CSS",
      ],
      features: [
        "Secure authentication with role-based access control",
        "Product, order and database management",
        "Server-side rendering with ASP.NET Core MVC",
      ],
      status: "Completed",
      github: "https://github.com/kashishhchopra/ecom-site",
      architecture: {
        summary:
          "A conventional server-rendered MVC stack, arranged so that every request passes the authorisation layer before a controller runs, and every price or stock figure is re-checked on the server before an order is written.",
        nodes: [
          { id: "browser", label: "Browser", kind: "input", detail: "Sends requests with an authentication cookie. Nothing it reports about prices, totals or stock is trusted." },
          { id: "auth", label: "Identity & RBAC", kind: "process", detail: "ASP.NET Core Identity establishes who the caller is; role attributes decide what they may reach. Requests fail closed when no rule grants access." },
          { id: "mvc", label: "MVC Controllers", kind: "process", detail: "Coordinate the request: validate input, apply business rules, and hand a view model to the renderer." },
          { id: "ef", label: "EF Core", kind: "process", detail: "Maps entities to tables and wraps order writes in transactions so a half-written order cannot survive a failure." },
          { id: "sql", label: "SQL Server", kind: "store", detail: "Products, orders, users and roles, with relational constraints enforcing integrity the application layer could forget." },
          { id: "views", label: "Razor Views", kind: "output", detail: "Server-rendered HTML — the page arrives complete rather than assembling itself after a JavaScript bundle loads." },
        ],
        edges: [
          { from: "browser", to: "auth", label: "request + cookie" },
          { from: "auth", to: "mvc", label: "authorised" },
          { from: "mvc", to: "ef", label: "queries / commands" },
          { from: "ef", to: "sql" },
          { from: "mvc", to: "views", label: "view model" },
          { from: "views", to: "browser", label: "rendered HTML" },
        ],
        columns: [["browser"], ["auth"], ["mvc"], ["ef"], ["sql", "views"]],
      },
      decisions: [
        {
          id: "ssr-over-spa",
          title: "Server-rendered MVC over a single-page app",
          choice: "Render pages on the server with ASP.NET Core MVC and Razor.",
          alternatives: ["React SPA against a REST API", "Hybrid with islands of interactivity"],
          rationale:
            "A storefront lives or dies on product pages being crawlable and fast on a first visit. Server rendering also keeps sessions in cookies and authorisation in one place, instead of splitting trust across a client bundle and an API.",
          tradeoff: "Richer interactions mean full page loads, and interactivity beyond forms needs progressive enhancement rather than coming for free.",
        },
        {
          id: "authorize-at-framework",
          title: "Authorisation as framework attributes, not view logic",
          choice: "Declare access rules with role attributes on controllers and actions.",
          alternatives: ["Check roles inline in views", "Hide unauthorised links in the UI"],
          rationale:
            "Hiding a link is not access control — the route still answers if typed. Declaring rules at the entry point means an endpoint without a rule is unreachable rather than accidentally public.",
          tradeoff: "Attribute-level rules are coarse; anything row-level still needs an explicit check inside the action.",
        },
        {
          id: "server-side-totals",
          title: "The server recomputes every total",
          choice: "Recalculate prices, stock and totals server-side at checkout, ignoring what the client submits.",
          alternatives: ["Trust the cart totals posted by the browser"],
          rationale: "Anything the client controls, an attacker controls. A cart is a request, not a fact.",
          tradeoff: "An extra round of database reads at checkout, on the most latency-sensitive step in the flow.",
        },
        {
          id: "ef-core",
          title: "EF Core over hand-written SQL",
          choice: "Use Entity Framework Core with migrations for data access.",
          alternatives: ["ADO.NET with hand-written SQL", "Dapper"],
          rationale: "Schema changes become versioned, reviewable migrations, and the entity model stays type-checked against the code that uses it.",
          tradeoff: "The generated SQL is a layer removed from view, so N+1 query patterns hide until you go looking for them.",
        },
      ],
      challenges: [
        {
          problem: "Role checks scattered across views meant an unlisted admin route was still reachable by URL.",
          approach: "Moved every rule onto the controller actions themselves so authorisation happens before the action runs, and treated the UI as presentation only.",
        },
      ],
      learnings: [
        "Access control belongs at the entry point; anything enforced in the UI is a suggestion.",
        "Server rendering removed an entire category of state-synchronisation bugs that an SPA would have introduced for this feature set.",
      ],
    },
    {
      id: "trafficiq",
      name: "TRAFFICIQ — Smart Traffic Control System",
      tagline: "Reinforcement learning that retimes signals from live density — inside hard safety limits.",
      year: "Oct – Nov 2025",
      categories: ["AI/ML", "Computer Vision"],
      problem:
        "Fixed-timing traffic signals ignore real-time density and cause avoidable congestion.",
      solution:
        "A reinforcement-learning system that optimizes signal timings from real-time traffic density, using OpenCV, OCR and IoT sensor data to detect vehicles and improve flow.",
      technologies: [
        "Python",
        "Reinforcement Learning",
        "OpenCV",
        "OCR",
        "Data Pipelines",
      ],
      features: [
        "RL-based signal timing optimization from live density",
        "Vehicle detection via OpenCV and OCR",
        "Integration of IoT sensor data for traffic-flow efficiency",
      ],
      status: "Completed",
      repos: [
        { label: "Full-scale", url: "https://github.com/kashishhchopra/traffic-control-advanced" },
        { label: "Lite", url: "https://github.com/kashishhchopra/traffic-ai-lite" },
      ],
      architecture: {
        summary:
          "A closed control loop. Cameras and sensors are fused into a traffic state, a learned policy proposes a signal phase, and the resulting queue lengths feed back as the reward that shaped the policy in the first place.",
        nodes: [
          { id: "cams", label: "Junction Cameras", kind: "input", detail: "Video of each approach. Rich but unreliable — degraded by night, rain and glare exactly when traffic is worst." },
          { id: "sensors", label: "IoT Density Sensors", kind: "input", detail: "Coarse but weather-independent occupancy counts, used to keep the state estimate honest when vision degrades." },
          { id: "detect", label: "Vehicle Detection", kind: "process", detail: "OpenCV counts vehicles per approach and turns raw frames into per-lane occupancy." },
          { id: "ocr", label: "OCR", kind: "process", detail: "Reads plates and signage where identification matters, kept separate from the counting path so a failure here can't corrupt density." },
          { id: "state", label: "Traffic State", kind: "process", detail: "Fuses camera counts and sensor readings into the observation vector the policy sees — queue lengths, waiting time, current phase." },
          { id: "rl", label: "RL Policy", kind: "model", detail: "Maps the observed state to the next signal phase and its duration. Trained in simulation, never allowed to explore on live traffic." },
          { id: "guard", label: "Safety Constraints", kind: "process", detail: "Minimum and maximum green times, mandatory pedestrian phases, and clearance intervals — enforced on the policy's output, not learned by it." },
          { id: "signal", label: "Signal Timing", kind: "output", detail: "The phase plan actually sent to the junction, after constraints have clipped anything unsafe." },
        ],
        edges: [
          { from: "cams", to: "detect", label: "frames" },
          { from: "cams", to: "ocr" },
          { from: "sensors", to: "state", label: "occupancy" },
          { from: "detect", to: "state", label: "vehicle counts" },
          { from: "ocr", to: "state" },
          { from: "state", to: "rl", label: "observation" },
          { from: "rl", to: "guard", label: "proposed phase" },
          { from: "guard", to: "signal", label: "clipped plan" },
          { from: "signal", to: "state", label: "reward: queue length" },
        ],
        columns: [["cams", "sensors"], ["detect", "ocr"], ["state"], ["rl"], ["guard"], ["signal"]],
      },
      decisions: [
        {
          id: "rl-over-fixed",
          title: "Reinforcement learning over fixed or threshold timing",
          choice: "Learn a policy that maps observed density to phase decisions.",
          alternatives: ["Fixed-time signal plans", "Rule-based thresholds on vehicle counts"],
          rationale:
            "Fixed plans are wrong the moment demand shifts, and threshold rules optimise each junction moment in isolation. A learned policy can trade a short delay now against a shorter queue later — the sequential part of the problem that rules can't express.",
          tradeoff: "You inherit reward design, a simulator dependency, and a policy whose reasoning is far harder to explain to a traffic engineer than an if-statement.",
        },
        {
          id: "train-in-sim",
          title: "Train in simulation, deploy with guardrails",
          choice: "Do all exploration in a simulator and run the trained policy under hard constraints in the loop.",
          alternatives: ["Online learning at a live junction"],
          rationale: "Exploration means trying bad actions on purpose. At a real intersection that is not a slow learning curve, it is a hazard.",
          tradeoff: "The sim-to-real gap: a policy tuned on simulated demand can meet traffic patterns the simulator never produced.",
        },
        {
          id: "safety-outside-policy",
          title: "Safety constraints outside the learned policy",
          choice: "Enforce minimum green, maximum green and pedestrian phases on the policy's output rather than through reward shaping.",
          alternatives: ["Penalise unsafe timings in the reward function"],
          rationale:
            "A penalty makes unsafe behaviour expensive, not impossible — the policy can still choose it if the numbers work out. A hard clip makes it unreachable.",
          tradeoff: "The constraints cap what the policy can achieve, so the best-case improvement is bounded by design.",
        },
        {
          id: "sensor-fusion",
          title: "Fusing sensors with cameras rather than trusting vision alone",
          choice: "Combine IoT occupancy readings with OpenCV counts to build the state.",
          alternatives: ["Camera-only detection"],
          rationale:
            "Vision fails in exactly the conditions that matter most — heavy rain, night, glare. A cheap independent signal keeps the state estimate from silently collapsing.",
          tradeoff: "More hardware to install and maintain, plus the fusion logic itself becomes a component that can be wrong.",
        },
      ],
      challenges: [
        {
          problem: "A reward based purely on throughput starved side roads, holding light approaches indefinitely.",
          approach: "Brought waiting time into the reward alongside throughput, so a queue that sits too long becomes expensive regardless of how few vehicles are in it.",
        },
        {
          problem: "Detection quality varied enough that the policy was reacting to noise in the state.",
          approach: "Smoothed counts over a short window and cross-checked them against sensor occupancy before feeding the observation to the policy.",
        },
      ],
      learnings: [
        "Reward design is the actual engineering in an RL system — the algorithm optimises exactly what you wrote, including the part you didn't mean.",
        "Anything that must never happen belongs in a constraint layer, not in the objective function.",
      ],
    },
    {
      id: "exam-proctoring",
      name: "AI-Based Online Exam Violation Detection System",
      tagline: "Real-time device detection that flags for review rather than accusing automatically.",
      year: "Jun – Jul 2024",
      categories: ["Computer Vision", "AI/ML"],
      problem:
        "Online exams are vulnerable to unauthorized devices being used during the test.",
      solution:
        "An AI-powered proctoring system that detects mobile phones and electronic devices in real time, with automated violation alerts and backend workflows for reliable monitoring.",
      technologies: [
        "Python",
        "FastAPI",
        "OpenCV",
        "AI Agents",
        "Real-Time Processing",
      ],
      features: [
        "Detects electronic devices such as mobile phones and tablets during exams",
        "Displays a “Violation Detected” alert in real time",
        "Backend workflows to support reliable exam monitoring",
      ],
      status: "Completed",
      github: "https://github.com/kashishhchopra/ai-exam-proctor",
      architecture: {
        summary:
          "Frames are sampled rather than streamed, detections must persist across several frames before they count, and the result of the whole pipeline is a reviewable event — not a verdict on a student.",
        nodes: [
          { id: "webcam", label: "Candidate Webcam", kind: "input", detail: "The exam session video feed, of unpredictable quality and framing." },
          { id: "sampler", label: "Frame Sampler", kind: "process", detail: "Takes frames at a fixed interval instead of every frame. A phone on a desk persists for seconds, so full frame-rate inference buys nothing." },
          { id: "detector", label: "Device Detector", kind: "model", detail: "Computer-vision model locating phones and electronic devices in the frame, returning boxes with confidence scores." },
          { id: "rules", label: "Temporal Confirmation", kind: "process", detail: "Requires a detection to hold across consecutive samples before it becomes an event, which is what separates a real device from one frame of noise." },
          { id: "api", label: "FastAPI Backend", kind: "process", detail: "Handles concurrent exam sessions asynchronously and owns the write path for every confirmed event." },
          { id: "store", label: "Event Log", kind: "store", detail: "Timestamped violation events with the evidence frame attached, so a reviewer sees what the system saw." },
          { id: "alert", label: "Proctor Alert", kind: "output", detail: "Notifies a human proctor to review. The system flags; it never decides an exam outcome." },
        ],
        edges: [
          { from: "webcam", to: "sampler", label: "video" },
          { from: "sampler", to: "detector", label: "sampled frames" },
          { from: "detector", to: "rules", label: "boxes + confidence" },
          { from: "rules", to: "api", label: "confirmed event" },
          { from: "api", to: "store" },
          { from: "api", to: "alert" },
        ],
        columns: [["webcam"], ["sampler"], ["detector"], ["rules"], ["api"], ["store", "alert"]],
      },
      decisions: [
        {
          id: "sampling",
          title: "Sampling frames instead of processing all of them",
          choice: "Run inference on frames at an interval rather than on the full stream.",
          alternatives: ["Every-frame inference", "Motion-triggered capture"],
          rationale:
            "The thing being detected persists for seconds. Processing thirty frames to observe the same stationary phone thirty times spends compute — multiplied by every concurrent candidate — to learn nothing new.",
          tradeoff: "A device glimpsed between two samples is missed entirely, so the interval is a direct trade of compute against recall.",
        },
        {
          id: "temporal-confirmation",
          title: "Confirming across frames before flagging",
          choice: "Require a detection to repeat across consecutive samples before raising an event.",
          alternatives: ["Flag on the first detection above threshold"],
          rationale:
            "Single-frame false positives are routine — a dark rectangle, a reflection, a hand. Requiring persistence removes most of them without touching the model, because real objects don't disappear between frames.",
          tradeoff: "Detection is delayed by the confirmation window, and a genuinely brief glance at a phone can fall below it.",
        },
        {
          id: "flag-not-fail",
          title: "Flag for human review, never auto-penalise",
          choice: "Route every confirmed event to a proctor with the evidence frame attached.",
          alternatives: ["Automatically terminate or fail sessions on detection"],
          rationale:
            "The cost of a false accusation lands on a student's academic record. No confidence score justifies automating that, so the system's output is evidence, not judgement.",
          tradeoff: "Proctors remain in the loop, so the system reduces attention required per session rather than removing it.",
        },
        {
          id: "fastapi",
          title: "FastAPI for the backend",
          choice: "Build the event and session API on FastAPI's async stack.",
          alternatives: ["Flask with synchronous workers"],
          rationale:
            "Many exam sessions report concurrently and the work is I/O-bound. Async handling keeps a slow write from blocking other sessions, and typed request models catch malformed events at the boundary.",
          tradeoff: "Async introduces failure modes — blocking calls sneaking into the event loop — that a synchronous framework would not have.",
        },
      ],
      challenges: [
        {
          problem: "Everyday objects were being detected as devices, producing alerts proctors learned to ignore.",
          approach: "Raised the confidence bar and added the temporal confirmation window, treating an alert nobody trusts as a worse outcome than a missed detection.",
        },
        {
          problem: "Per-session inference cost scaled badly with concurrent candidates.",
          approach: "Sampled frames rather than streaming them and moved the write path behind async handlers, so cost grew with events rather than with video minutes.",
        },
      ],
      learnings: [
        "An alerting system's real constraint is the reviewer's trust — precision matters more than recall once people start dismissing alerts.",
        "Where a model's output affects someone's record, the right design keeps a human as the decision-maker and uses the model to direct attention.",
      ],
    },
  ],
  experience: [
    {
      id: "hcl",
      type: "Internship",
      role: "AI Intern",
      organization: "HCL Tech",
      start: "Jun 2026",
      end: "Jul 2026",
      responsibilities: [
        "Developed a RAG-based AI chatbot that retrieves relevant information from company documents and generates accurate, context-aware responses.",
        "Implemented NLP and LLM-powered workflows to automate document search, question answering and internal support operations.",
        "Collaborated with cross-functional teams to build, test and optimize an enterprise knowledge assistant for real-world business applications.",
      ],
      tools: ["Python", "LLM", "RAG", "NLP", "Vector Database"],
    },
    {
      id: "iocl",
      type: "Internship",
      role: "IT Intern",
      organization: "Indian Oil Corporation Limited",
      start: "Jun 2025",
      end: "Jul 2025",
      responsibilities: [
        "Selected for a software development internship focusing on AI/ML applications and backend development.",
        "Developed an e-commerce platform using ASP.NET Core and C#, implementing core functionality for product management, cart, wishlist and order processing.",
        "Contributed to IT department projects while gaining practical experience in enterprise software systems.",
      ],
      tools: ["ASP.NET Core", "C#", "AI/ML", "Backend Development"],
    },
    {
      id: "quantum-club",
      type: "Leadership",
      role: "Graphic Head — Quantum Computing Club",
      organization: "The NorthCap University",
      start: "Feb 2026",
      end: "Present",
      current: true,
      responsibilities: [
        "Created graphic content to support club events, workshops and technical initiatives.",
        "Enhanced student engagement by presenting complex concepts through clear, creative graphics.",
      ],
    },
    {
      id: "yoga-club",
      type: "Leadership",
      role: "Graphic Head — Yoga Club",
      organization: "The NorthCap University",
      start: "Jul 2023",
      end: "Jul 2024",
      responsibilities: [
        "Developed engaging content and posters for events and campaigns to raise awareness.",
        "Helped increase student participation through clear and creative communication.",
      ],
    },
  ],
  certifications: [
    {
      name: "Microsoft Certified: Azure AI Fundamentals (AI-901)",
      authority: "Microsoft",
      url: "https://learn.microsoft.com/api/credentials/share/en-gb/KashishChopra-1301/20D9EF361F54EE24?sharingId=AF63ADE3DD89EF45",
    },
    {
      name: "Smart India Hackathon 2025 — University-level Participant",
      authority: "Ministry of Education, Government of India",
    },
    { name: "IBM SkillsBuild", authority: "IBM" },
  ],
  volunteering: [
    {
      organization: "ZERO Foundation NGO",
      role: "Volunteer",
      cause: "Education & Donation",
      period: "Aug 2024 – Present",
      current: true,
    },
    {
      organization: "National Service Scheme (NSS)",
      role: "Community Service Volunteer",
      cause: "Social Services",
      period: "Aug 2023 – Aug 2024",
    },
    {
      organization: "OJASS Takhte Trust",
      role: "Community Service Volunteer",
      cause: "Plantation Drive (Environmental Sustainability)",
      period: "31 Oct – 7 Nov 2025",
    },
  ],
  activities: [
    {
      title: "On-Stage Event Management Volunteer — Momentum, NorthCap University Fest",
      detail:
        "Coordinated on-stage operations and event flow during the university's annual cultural fest — participant coordination, scheduling and real-time execution — working with the organising teams on stage logistics, audience engagement and transitions.",
    },
  ],
  languages: ["English", "Hindi"],
  learning: [
    "Agentic AI & multi-agent workflows",
    "LangChain / LangGraph orchestration",
    "Production-grade RAG systems",
  ],
  meta: {
    version: "v1.0.0",
    timezone: "Asia/Kolkata",
    timezoneLabel: "IST (Asia/Kolkata)",
  },
};

export default portfolio;
