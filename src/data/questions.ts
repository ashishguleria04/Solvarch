export type SeedQuestion = {
  category: "BEHAVIORAL" | "HR" | "TECHNICAL_TRIVIA";
  question: string;
  modelAnswer: string;
  tips?: string;
  tags: string[];
};

export const questions: SeedQuestion[] = [
  {
    category: "BEHAVIORAL",
    question: "Tell me about yourself.",
    modelAnswer:
      "Keep it to 60–90 seconds and structure it present → past → future: what you do now, a couple of relevant highlights that got you here, and why this role is the logical next step. Tailor the highlights to the job description rather than reciting your résumé.",
    tips: "Rehearse a crisp 3-sentence version. Anchor each part to impact, not job titles.",
    tags: ["intro", "common"],
  },
  {
    category: "BEHAVIORAL",
    question: "Tell me about a time you faced a conflict with a teammate.",
    modelAnswer:
      "Use STAR (Situation, Task, Action, Result). Describe the disagreement objectively, focus on what YOU did to understand their view and find common ground, and end with the outcome and what you learned. Avoid blaming the other person.",
    tips: "Pick a real, resolved conflict. Emphasize communication and empathy over 'winning'.",
    tags: ["star", "teamwork", "conflict"],
  },
  {
    category: "BEHAVIORAL",
    question: "Describe a time you failed. What did you learn?",
    modelAnswer:
      "Choose a genuine failure with a clear lesson. Own your part without excessive self-flagellation, explain the concrete change you made afterward, and show the improved result next time. Interviewers want growth and self-awareness.",
    tips: "The 'what you changed' part matters more than the failure itself.",
    tags: ["star", "growth"],
  },
  {
    category: "BEHAVIORAL",
    question: "Tell me about a project you're most proud of.",
    modelAnswer:
      "Explain the problem and why it mattered, your specific contribution, the technical decisions and trade-offs you owned, and the measurable impact. Quantify wherever possible (latency, users, revenue, time saved).",
    tips: "Be ready for deep follow-ups on any technical claim you make.",
    tags: ["star", "impact"],
  },
  {
    category: "BEHAVIORAL",
    question: "How do you handle tight deadlines and competing priorities?",
    modelAnswer:
      "Describe how you clarify scope, rank by impact and dependencies, communicate trade-offs early to stakeholders, and cut or defer the least critical work. Give a concrete example where this approach shipped something on time.",
    tips: "Show you negotiate scope rather than silently burning out.",
    tags: ["prioritization", "time-management"],
  },
  {
    category: "HR",
    question: "Why do you want to work here?",
    modelAnswer:
      "Connect specifics about the company (product, mission, engineering culture, a technology they use) to your own goals and strengths. Show you did your research and that the fit is mutual — not just that you need a job.",
    tips: "Name 2–3 concrete, researched reasons. Avoid generic flattery.",
    tags: ["motivation", "fit"],
  },
  {
    category: "HR",
    question: "What are your salary expectations?",
    modelAnswer:
      "Ideally defer until you understand the full scope, or give a researched range based on market data for the role, level, and location. Anchor to your value and signal flexibility on the total package, not just base.",
    tips: "Know your number beforehand. A range with a solid floor beats a single figure.",
    tags: ["compensation", "negotiation"],
  },
  {
    category: "HR",
    question: "Where do you see yourself in five years?",
    modelAnswer:
      "Show ambition aligned with a realistic growth path at the company — deepening technical expertise, taking on scope/ownership, and possibly mentoring. Emphasize learning and impact over rigid titles.",
    tips: "Tie your growth to value you'd create for the team.",
    tags: ["career", "goals"],
  },
  {
    category: "HR",
    question: "Why are you leaving your current job?",
    modelAnswer:
      "Stay positive and forward-looking: you're seeking growth, a new challenge, or a mission you care about. Never disparage a current or former employer — it reads as a red flag.",
    tips: "Frame it as running toward something, not away from something.",
    tags: ["motivation"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between a process and a thread?",
    modelAnswer:
      "A process is an independent program in execution with its own address space and resources; a thread is a lightweight unit of execution within a process that shares the process's memory and resources. Threads are cheaper to create and switch between but require synchronization to avoid data races.",
    tips: "Mention shared memory (threads) vs isolated memory (processes) and the cost trade-off.",
    tags: ["os", "concurrency"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Explain the difference between TCP and UDP.",
    modelAnswer:
      "TCP is connection-oriented and reliable: it guarantees ordered, error-checked delivery via handshakes, acknowledgments, and retransmission — at the cost of overhead. UDP is connectionless and unreliable but low-latency, making it ideal for streaming, gaming, and DNS where speed beats guaranteed delivery.",
    tips: "Give a use case for each: TCP for web/APIs, UDP for real-time media.",
    tags: ["networks"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is a deadlock and how can it be prevented?",
    modelAnswer:
      "A deadlock is a state where processes are each waiting on resources held by the others, so none can proceed. It requires four conditions (mutual exclusion, hold-and-wait, no preemption, circular wait). Prevent it by breaking one condition — e.g., acquiring locks in a global order to remove circular wait, or using timeouts.",
    tips: "Naming the four Coffman conditions signals depth.",
    tags: ["os", "concurrency"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between SQL and NoSQL databases?",
    modelAnswer:
      "SQL databases are relational with a fixed schema and strong ACID guarantees, ideal for structured data and complex joins. NoSQL databases (document, key-value, wide-column, graph) trade some consistency for flexible schemas and horizontal scalability, suiting large-scale, evolving, or semi-structured workloads.",
    tips: "Discuss consistency vs scalability and give an example of each.",
    tags: ["dbms"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What happens when you type a URL into the browser and press Enter?",
    modelAnswer:
      "DNS resolves the domain to an IP; a TCP connection (and TLS handshake for HTTPS) is established; the browser sends an HTTP request; the server responds with HTML; the browser parses HTML/CSS/JS, builds the DOM/CSSOM, and renders the page, fetching additional resources as needed.",
    tips: "A classic systems question — hit DNS, TCP/TLS, HTTP, and rendering.",
    tags: ["networks", "web"],
  },
];
