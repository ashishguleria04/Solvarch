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

  // ------------------------------------------------------------- behavioral
  {
    category: "BEHAVIORAL",
    question: "Tell me about a time you disagreed with your manager or tech lead.",
    modelAnswer:
      "Show you can disagree professionally: you stated your position with data, listened to their reasoning, and either changed your mind for good reasons or escalated respectfully. End with commitment — once a decision was made, you executed it fully even if it wasn't your preference.",
    tips: "'Disagree and commit' is the phrase interviewers are listening for. Never frame the manager as incompetent.",
    tags: ["star", "conflict", "communication"],
  },
  {
    category: "BEHAVIORAL",
    question: "Describe a time you had to learn a new technology quickly.",
    modelAnswer:
      "Pick a real deadline-driven ramp-up. Explain your learning system: official docs first, a small throwaway prototype, reading existing code in the repo, and asking targeted questions instead of generic ones. Quantify the outcome — shipped feature, timeline met, and that you later became the team's go-to for it.",
    tips: "Interviewers care about your *method* for learning, not the specific technology.",
    tags: ["star", "learning", "adaptability"],
  },
  {
    category: "BEHAVIORAL",
    question: "Tell me about a time you received difficult feedback.",
    modelAnswer:
      "Choose feedback that genuinely stung — vague communication, code quality, missed expectations. Describe your first reaction honestly, then how you separated ego from signal, asked clarifying questions, and made a concrete visible change. Close with evidence the change stuck (later review, promotion, teammate comment).",
    tips: "Defensiveness is the anti-signal. Showing you *sought more* feedback afterward is the pro move.",
    tags: ["star", "growth", "feedback"],
  },
  {
    category: "BEHAVIORAL",
    question: "Describe a decision you made with incomplete information.",
    modelAnswer:
      "Walk through your framework: what you knew, what you couldn't know in time, the cost of waiting vs the cost of being wrong, and how you made the decision reversible (feature flag, small rollout, checkpoint to revisit). State the outcome and what the retrospective taught you.",
    tips: "Distinguish one-way vs two-way doors — reversible decisions should be made fast.",
    tags: ["star", "judgment", "ambiguity"],
  },
  {
    category: "BEHAVIORAL",
    question: "Tell me about a time you missed a deadline.",
    modelAnswer:
      "Own it without excuses: what you underestimated, when you realized, and — critically — that you flagged it early rather than going silent until the due date. Describe the mitigation (cut scope, negotiated a new date, got help) and the estimation or communication habit you changed afterward.",
    tips: "The failure isn't missing the date; it's surprising people. Show you never surprise stakeholders.",
    tags: ["star", "time-management", "communication"],
  },
  {
    category: "BEHAVIORAL",
    question: "What's the most difficult bug you've ever debugged?",
    modelAnswer:
      "Pick something genuinely hard — race condition, environment-specific failure, heisenbug. Narrate your process: reproduce reliably, shrink the search space (bisect commits, isolate layers), form and kill hypotheses with evidence, and the actual root cause. End with the guardrail you added so it can't recur.",
    tips: "A systematic search beats a lucky guess. Interviewers want method, not heroics.",
    tags: ["star", "debugging", "technical-depth"],
  },
  {
    category: "BEHAVIORAL",
    question: "Tell me about a time you mentored or unblocked a struggling teammate.",
    modelAnswer:
      "Describe noticing the struggle (missed standups, stalled PRs), approaching them privately and without judgment, and diagnosing whether it was skill, clarity, or confidence. Explain the concrete support — pairing sessions, breaking work smaller, better onboarding docs — and their measurable turnaround.",
    tips: "Empathy plus a system. 'I just answered their questions' is too thin.",
    tags: ["star", "leadership", "teamwork"],
  },
  {
    category: "BEHAVIORAL",
    question: "How do you handle disagreements in code review?",
    modelAnswer:
      "Separate taste from substance: style debates go to the linter/team convention, correctness and maintainability debates get discussed with reasoning, not authority. Prefer questions over demands ('what happens if X is null here?'), take long threads to a call, and let the author keep ownership of small judgment calls.",
    tips: "Mention optimizing for the codebase and the relationship, not for being right.",
    tags: ["code-review", "communication", "teamwork"],
  },
  {
    category: "BEHAVIORAL",
    question: "Tell me about a time you pushed back on a requirement or scope.",
    modelAnswer:
      "Show you pushed back with alternatives, not just objections: you quantified the cost (time, complexity, risk), proposed a smaller version that met 80% of the need, and let the stakeholder make the informed call. The outcome should demonstrate the product got better because you spoke up.",
    tips: "Engineers who silently build the wrong thing on time are not senior. Framing matters: 'here's a cheaper path to the same goal'.",
    tags: ["star", "prioritization", "communication"],
  },
  {
    category: "BEHAVIORAL",
    question: "Describe a time you improved a team process or developer experience.",
    modelAnswer:
      "Pick a real friction point — flaky CI, slow reviews, painful releases, missing runbooks. Explain how you measured the pain, the small fix you shipped without asking permission, and the adoption path. Quantify: build minutes saved, review latency halved, incidents avoided.",
    tips: "Bottom-up initiative with measured impact is a strong seniority signal.",
    tags: ["star", "initiative", "impact"],
  },
  {
    category: "BEHAVIORAL",
    question: "Tell me about a time you took ownership of a production incident or mistake.",
    modelAnswer:
      "Structure it like an incident review: detection, immediate mitigation (roll back first, debug later), communication to affected parties, root cause, and the blameless follow-up — tests, alerts, or process changes. Owning the mistake publicly and fixing the system, not just the bug, is the point.",
    tips: "Never blame a teammate or 'bad luck'. Blameless language about yourself included — focus on the system.",
    tags: ["star", "ownership", "incident"],
  },
  {
    category: "BEHAVIORAL",
    question: "Describe a time you had to deliver results under significant ambiguity.",
    modelAnswer:
      "Show how you created clarity instead of waiting for it: wrote a one-pager stating assumptions, got fast feedback on the doc rather than the finished build, timeboxed a spike, and defined 'done' yourself when nobody else had. Deliver the outcome and how your framing became the team's plan.",
    tips: "Writing things down to force alignment is the highest-signal behavior here.",
    tags: ["star", "ambiguity", "initiative"],
  },
  {
    category: "BEHAVIORAL",
    question: "Tell me about a time you had to balance technical debt against shipping features.",
    modelAnswer:
      "Avoid absolutism in either direction. Describe making the debt visible (tickets, a 'tax' estimate on affected features), negotiating a fixed budget for it (e.g., 20% of each sprint or a cleanup milestone), and picking debt that paid for itself in velocity. Give the before/after.",
    tips: "The skill being tested is making invisible engineering costs legible to non-engineers.",
    tags: ["star", "prioritization", "tech-debt"],
  },

  // --------------------------------------------------------------------- hr
  {
    category: "HR",
    question: "What are your greatest strengths?",
    modelAnswer:
      "Pick 2–3 strengths that map directly to the role's needs, and prove each with a one-line example rather than an adjective ('I ramp up fast — at X I owned the payments service within a month'). Strengths without evidence read as filler.",
    tips: "Mirror the job description's language. Evidence beats adjectives.",
    tags: ["self-awareness", "common"],
  },
  {
    category: "HR",
    question: "What is your biggest weakness?",
    modelAnswer:
      "Name a real, non-disqualifying weakness (not a humblebrag like 'I work too hard'), then spend most of your answer on the concrete system you use to manage it and evidence it's improving. Example: over-scoping solutions → now writes a 'simplest version' first and reviews scope with a peer.",
    tips: "Real weakness + active mitigation + trajectory. Never name a core skill for the role.",
    tags: ["self-awareness", "common"],
  },
  {
    category: "HR",
    question: "Why should we hire you?",
    modelAnswer:
      "This is a positioning question: connect the top 2–3 problems this team is hiring to solve with your proof you've solved them before. Be specific and confident without comparing yourself to other candidates — you can't speak to their abilities, only your evidence.",
    tips: "Research the team's actual problems; a tailored answer beats a generic 'I'm hardworking'.",
    tags: ["fit", "positioning"],
  },
  {
    category: "HR",
    question: "Do you have any questions for us?",
    modelAnswer:
      "Always yes — no questions signals no interest. Ask things that show you're evaluating seriously: how success is measured in the first six months, what the team's biggest technical challenge is right now, how decisions get made, why the interviewer joined and stayed. Avoid questions answered on the website.",
    tips: "Prepare 4–5 so you have spares when some get answered mid-interview.",
    tags: ["fit", "common"],
  },
  {
    category: "HR",
    question: "How do you keep your technical skills up to date?",
    modelAnswer:
      "Give a concrete, sustainable system, not aspirations: what you build on the side, what you read regularly, how you learn at work (code review, design docs, postmortems), and one recent example of something you learned and applied. Depth in a few sources beats listing ten newsletters.",
    tips: "One specific recent example ('last month I…') makes the whole answer credible.",
    tags: ["learning", "growth"],
  },
  {
    category: "HR",
    question: "Are you interviewing with other companies?",
    modelAnswer:
      "Be honest but brief: yes, you're exploring a small number of opportunities seriously, and this role is among your top choices for specific reasons. Honest signal helps timelines get taken seriously; naming companies or leveraging aggressively this early usually backfires.",
    tips: "Honesty + genuine enthusiasm for this role. Save leverage talk for the offer stage.",
    tags: ["negotiation", "process"],
  },
  {
    category: "HR",
    question: "What motivates you at work?",
    modelAnswer:
      "Be genuine and tie it to the role: shipping things real users touch, hard technical problems, learning from strong engineers, or measurable impact. Anchor it with an example of the most motivated you've been and why — the pattern should visibly exist in this job.",
    tips: "If your stated motivation can't be found in this role, the interviewer will notice.",
    tags: ["motivation", "fit"],
  },
  {
    category: "HR",
    question: "What kind of work environment helps you do your best work?",
    modelAnswer:
      "Describe real preferences (deep-work blocks, written culture, direct feedback, clear priorities) while showing flexibility — you adapt to the team you join. If you've researched their culture, connect honestly to it; a genuine mismatch here is worth discovering now, not after joining.",
    tips: "This is a two-way fit question — answer honestly, not strategically.",
    tags: ["fit", "culture"],
  },
  {
    category: "HR",
    question: "Can you explain this gap in your résumé?",
    modelAnswer:
      "Answer briefly, honestly, and without apologizing: what the gap was for (health, family, layoff, travel, study), anything you learned or built during it, and clear enthusiasm about returning. Then redirect to your qualifications. Interviewers care about the future, not the gap.",
    tips: "Two or three sentences, no defensiveness, pivot forward. Gaps are normal.",
    tags: ["resume", "honesty"],
  },
  {
    category: "HR",
    question: "Where does this role fit in your longer-term career plan?",
    modelAnswer:
      "Show that this job is a deliberate step, not a fallback: the skills you want to deepen, the scope you want to grow into, and how those line up with what the team offers. Keep titles vague but growth specific — 'owning larger systems and mentoring' beats 'senior in 2 years'.",
    tips: "Companies invest in people who'll grow with them — show the overlap honestly.",
    tags: ["career", "goals"],
  },

  // -------------------------------------------------------------- technical
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between stack and heap memory?",
    modelAnswer:
      "The stack stores function frames — locals, parameters, return addresses — allocated and freed automatically in LIFO order, making it fast but small and scope-bound. The heap holds dynamically allocated objects with arbitrary lifetimes, managed manually (C/C++) or by a garbage collector; it's larger but slower to allocate and prone to leaks/fragmentation.",
    tips: "Mention stack overflow (deep recursion) and memory leaks (heap) as the classic failure of each.",
    tags: ["os", "memory"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between concurrency and parallelism?",
    modelAnswer:
      "Concurrency is structuring a program to make progress on multiple tasks at once (interleaving on even a single core); parallelism is literally executing multiple tasks simultaneously on multiple cores. A single-core machine can be concurrent but never parallel; async I/O is concurrency, multi-core matrix math is parallelism.",
    tips: "'Concurrency is about dealing with lots of things; parallelism is about doing lots of things' — the classic framing.",
    tags: ["os", "concurrency"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between a mutex and a semaphore?",
    modelAnswer:
      "A mutex is a lock providing exclusive access — one owner at a time, and only the locker should unlock it. A semaphore is a counter over N permits: threads acquire/release, so it can admit multiple holders (bounded pools) and be signaled across threads (producer-consumer). A binary semaphore resembles a mutex but has no ownership semantics.",
    tips: "Ownership is the key distinction — mutexes have it, semaphores don't.",
    tags: ["os", "concurrency"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is a race condition and how do you prevent one?",
    modelAnswer:
      "A race condition occurs when correctness depends on the timing of concurrent operations over shared state — e.g., two threads doing read-modify-write on a counter losing updates. Prevent it with mutual exclusion (locks), atomic operations, immutable data, or confining state to a single thread/queue.",
    tips: "Give the lost-update counter example; it's concrete and universally understood.",
    tags: ["os", "concurrency"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is virtual memory?",
    modelAnswer:
      "Virtual memory gives each process the illusion of a large, private, contiguous address space, which the OS and MMU map to physical frames via page tables. It provides isolation between processes, allows overcommitting RAM by paging cold pages to disk, and enables tricks like shared libraries and copy-on-write fork.",
    tips: "Mention page faults and the TLB to show depth beyond the definition.",
    tags: ["os", "memory"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What happens during a context switch?",
    modelAnswer:
      "The kernel saves the running thread's CPU state (registers, program counter, stack pointer) into its control block, picks the next thread via the scheduler, restores that thread's state, and — if switching processes — swaps the address space, flushing TLB entries. It's pure overhead, which is why excessive threads or lock contention hurts throughput.",
    tips: "Note that process switches cost more than thread switches (address space + TLB).",
    tags: ["os", "scheduling"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between kernel mode and user mode?",
    modelAnswer:
      "The CPU enforces privilege levels: user mode restricts direct access to hardware and privileged instructions, while kernel mode has full access. Applications run in user mode and enter the kernel only through controlled gates — system calls, interrupts, exceptions — which is the foundation of OS protection and stability.",
    tips: "Tie it to system calls: 'how does read() actually work' is the natural follow-up.",
    tags: ["os"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Explain the TCP three-way handshake.",
    modelAnswer:
      "The client sends SYN with its initial sequence number; the server replies SYN-ACK, acknowledging the client's number and sending its own; the client sends ACK. Both sides have now agreed on sequence numbers and allocated connection state, so reliable, ordered delivery can begin. Teardown is the separate FIN/ACK exchange.",
    tips: "Know why two-way isn't enough: both directions need their sequence numbers acknowledged.",
    tags: ["networks"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "How does HTTPS/TLS actually secure a connection?",
    modelAnswer:
      "TLS combines asymmetric and symmetric crypto: the server proves identity with a certificate chained to a trusted CA, the handshake (e.g., ECDHE key exchange) derives a shared session key with forward secrecy, and all subsequent traffic is encrypted symmetrically (e.g., AES-GCM) for speed. You get confidentiality, integrity, and server authentication.",
    tips: "The two-phase idea — asymmetric to establish trust and keys, symmetric for bulk data — is the core answer.",
    tags: ["networks", "security"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What are the differences between GET, POST, PUT, and PATCH?",
    modelAnswer:
      "GET reads a resource — safe, idempotent, cacheable, no meaningful body. POST creates or triggers processing — not idempotent (two POSTs, two orders). PUT replaces a resource entirely and is idempotent (same PUT twice, same state). PATCH applies a partial modification and isn't guaranteed idempotent.",
    tips: "Idempotency is what the interviewer is really testing — define it precisely.",
    tags: ["networks", "web", "api"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between HTTP status codes 401 and 403?",
    modelAnswer:
      "401 Unauthorized means the request lacks valid authentication — the server doesn't know who you are; retry with credentials. 403 Forbidden means you are authenticated but not allowed — the server knows who you are and the answer is no. Also know 400 vs 422, 301 vs 302, and 502 vs 503 vs 504.",
    tips: "'401 = who are you?; 403 = I know who you are, and no.'",
    tags: ["networks", "web", "api"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Compare cookies, server-side sessions, and JWTs for auth.",
    modelAnswer:
      "A cookie is just a browser storage/transport mechanism. Classic sessions store state server-side keyed by an opaque cookie ID — easy to revoke, but needs a shared session store to scale. JWTs push signed state to the client — stateless and horizontally friendly, but revocation is hard and tokens must be short-lived. Many systems combine both: short-lived JWT plus refresh-token session.",
    tips: "Revocation is the trade-off that distinguishes a strong answer.",
    tags: ["web", "security", "api"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is SQL injection and how do you prevent it?",
    modelAnswer:
      "SQL injection is when untrusted input is concatenated into a query string so an attacker rewrites the query ('1 OR 1=1', dropping tables, exfiltrating data). The fix is parameterized queries/prepared statements — data is never parsed as SQL — plus least-privilege database accounts and an ORM's bound parameters. Escaping alone is fragile; validation is defense in depth, not the fix.",
    tips: "Say 'parameterized queries' explicitly — it's the expected phrase.",
    tags: ["dbms", "security"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Explain the ACID properties of a transaction.",
    modelAnswer:
      "Atomicity: all statements commit or none do (rollback on failure). Consistency: a transaction moves the database between valid states, preserving constraints. Isolation: concurrent transactions don't see each other's intermediate state (per the isolation level). Durability: once committed, data survives crashes, typically via write-ahead logging.",
    tips: "Have the bank-transfer example ready — debit and credit must be atomic.",
    tags: ["dbms"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is a database index and what does it cost?",
    modelAnswer:
      "An index is an auxiliary ordered structure (usually a B+-tree) mapping column values to rows, turning full scans into logarithmic lookups and serving range queries and sorts. The costs: every write must also update each index, plus storage and cache pressure — so you index the columns your queries filter/join/sort on, not everything.",
    tips: "Mention the leftmost-prefix rule for composite indexes to stand out.",
    tags: ["dbms", "performance"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Explain the different types of SQL JOINs.",
    modelAnswer:
      "INNER JOIN returns only rows matching in both tables. LEFT JOIN returns all left rows with NULLs where the right side has no match (RIGHT JOIN is the mirror). FULL OUTER JOIN keeps unmatched rows from both sides. CROSS JOIN is the Cartesian product. A self-join joins a table to itself, e.g., employees to their managers.",
    tips: "Be ready to write 'find users with zero orders' — LEFT JOIN … WHERE right.id IS NULL.",
    tags: ["dbms", "sql"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between DELETE, TRUNCATE, and DROP?",
    modelAnswer:
      "DELETE removes rows matching a WHERE clause, is fully logged, fires triggers, and can be rolled back within a transaction. TRUNCATE removes all rows by deallocating pages — much faster, minimal logging, resets identity counters, no per-row triggers. DROP removes the table itself, including schema, indexes, and permissions.",
    tips: "Row-level vs page-level vs object-level is the clean mental model.",
    tags: ["dbms", "sql"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between a primary key, unique key, and foreign key?",
    modelAnswer:
      "A primary key uniquely identifies each row — unique, non-null, one per table, and typically the clustered index. A unique constraint also enforces uniqueness but allows (usually one) NULL and a table can have several. A foreign key references another table's key, enforcing referential integrity with options like CASCADE or RESTRICT on delete.",
    tips: "Mention natural vs surrogate keys if asked to choose a primary key.",
    tags: ["dbms", "sql"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is normalization, and when would you denormalize?",
    modelAnswer:
      "Normalization structures tables to eliminate redundancy and update anomalies — 1NF (atomic values), 2NF (no partial dependency on a composite key), 3NF (no transitive dependencies). You denormalize deliberately for read performance: duplicating data to avoid hot joins, maintaining counters or materialized views, accepting controlled redundancy with a strategy to keep it consistent.",
    tips: "Frame denormalization as a conscious read-optimization trade, not sloppiness.",
    tags: ["dbms"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "How does a hash table work, and how are collisions handled?",
    modelAnswer:
      "A hash function maps a key to a bucket index in an array, giving O(1) average insert/lookup/delete. Collisions — two keys hashing to one bucket — are handled by chaining (a list/tree per bucket, as in Java's HashMap which upgrades to a red-black tree) or open addressing (probing for the next free slot, as in Python's dict). When the load factor grows, the table resizes and rehashes.",
    tips: "Know the worst case is O(n) and how equals/hashCode contracts matter.",
    tags: ["dsa", "data-structures"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Array vs linked list — when would you use each?",
    modelAnswer:
      "Arrays give O(1) random access and cache-friendly contiguous memory but O(n) arbitrary insert/delete; linked lists give O(1) insert/delete at a known node but O(n) access and poor cache locality. In practice dynamic arrays win almost everywhere; lists shine for LRU caches, queues/deques with stable node references, and O(1) splicing.",
    tips: "Mentioning cache locality — why arrays beat lists even at 'equal' Big-O — is the senior answer.",
    tags: ["dsa", "data-structures"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "BFS vs DFS — how do they differ and when do you use each?",
    modelAnswer:
      "BFS explores level by level with a queue and finds shortest paths in unweighted graphs; memory can blow up on wide graphs. DFS dives deep with a stack/recursion — natural for cycle detection, topological sort, connected components, and backtracking; memory is bounded by depth. Use BFS when distance matters, DFS when structure matters.",
    tips: "'Shortest path in unweighted graphs ⇒ BFS' is the reflex being tested.",
    tags: ["dsa", "graphs"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Why is quicksort usually preferred over mergesort despite its O(n²) worst case?",
    modelAnswer:
      "Quicksort sorts in place with excellent cache behavior and small constants; its O(n²) worst case is made vanishingly rare by randomized or median-of-three pivots. Mergesort guarantees O(n log n) and is stable but needs O(n) extra space. Real libraries hedge: introsort (C++) falls back to heapsort, and Timsort (Python/Java objects) is a mergesort hybrid chosen for stability.",
    tips: "Knowing what standard libraries actually use elevates this answer.",
    tags: ["dsa", "sorting"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is Big-O notation and why do constants get dropped?",
    modelAnswer:
      "Big-O describes how an algorithm's cost grows with input size, bounding the growth rate asymptotically — O(n), O(n log n), O(n²). Constants and lower-order terms are dropped because growth rate dominates at scale: 100n beats n²/1000 eventually. But in practice constants matter for real workloads — that's why arrays often beat 'better' structures.",
    tips: "Show you know Big-O is a scaling model, not a benchmark.",
    tags: ["dsa", "fundamentals"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is recursion, and what are its pitfalls?",
    modelAnswer:
      "Recursion solves a problem by reducing it to smaller instances of itself, with base cases terminating the descent — natural for trees, divide-and-conquer, and backtracking. Pitfalls: stack overflow on deep inputs, and exponential blowup when subproblems overlap (naive Fibonacci) — fixed by memoization or converting to iteration/explicit stack.",
    tips: "Every recursion needs a base case and provable progress toward it — say both.",
    tags: ["dsa", "fundamentals"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Pass by value vs pass by reference — and what do Java/Python actually do?",
    modelAnswer:
      "Pass by value copies the argument; pass by reference lets the callee rebind the caller's variable. Java is strictly pass-by-value — but for objects the value copied is a reference, so you can mutate the object yet not reassign the caller's variable. Python is the same model ('pass by object reference'): mutation is visible, rebinding isn't.",
    tips: "The Java 'swap two objects' trick question tests exactly this.",
    tags: ["languages", "fundamentals"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between compile time and runtime?",
    modelAnswer:
      "Compile time is when source is translated — syntax checks, static type checks, and optimizations happen here, catching whole error classes before the program runs. Runtime is actual execution — dynamic dispatch, allocation, I/O, and errors like null dereference or division by zero. Static typing shifts error detection earlier; dynamic languages defer more to runtime.",
    tips: "Classify example errors: type mismatch (compile) vs NullPointerException (runtime).",
    tags: ["languages", "fundamentals"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Method overloading vs overriding — what's the difference?",
    modelAnswer:
      "Overloading is multiple same-named methods with different parameter lists in one scope, resolved at compile time by signature — static polymorphism. Overriding is a subclass redefining a superclass's method with the same signature, resolved at runtime via dynamic dispatch — the polymorphism that makes OOP work. Overriding must not narrow visibility or break the parent's contract.",
    tips: "Compile-time vs runtime resolution is the crux; mention @Override catching typos.",
    tags: ["oop", "languages"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between a shallow copy and a deep copy?",
    modelAnswer:
      "A shallow copy duplicates the top-level object but shares all nested objects — mutate a nested list through the copy and the original sees it. A deep copy recursively duplicates the entire object graph, giving full independence at the cost of time, memory, and care around cycles. Immutable data sidesteps the question entirely.",
    tips: "Python's copy vs deepcopy, or spreading an object in JS ({...obj} is shallow), make good concrete examples.",
    tags: ["languages", "fundamentals"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "How does garbage collection work?",
    modelAnswer:
      "GC reclaims memory unreachable from the roots (stack, globals, registers). Tracing collectors mark reachable objects and sweep or compact the rest; generational designs exploit the fact that most objects die young by collecting the nursery frequently and the old generation rarely. Reference counting (Python's primary mechanism) frees immediately but needs cycle detection.",
    tips: "Mention stop-the-world pauses and why generational GC minimizes them.",
    tags: ["languages", "memory"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Can you have a memory leak in a garbage-collected language?",
    modelAnswer:
      "Yes — GC only frees unreachable memory, so anything still referenced leaks: unbounded caches and maps, listeners/observers never unregistered, closures capturing large scopes, ThreadLocals in pooled threads. The fix is bounding lifetimes: weak references, eviction policies, and deregistration in cleanup paths.",
    tips: "The static Map cache that only ever grows is the canonical example.",
    tags: ["languages", "memory"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between processes communicating via IPC options?",
    modelAnswer:
      "Pipes stream bytes between related processes; named pipes/Unix domain sockets extend that to unrelated ones. Message queues pass discrete messages with kernel buffering. Shared memory is fastest — no copying — but requires explicit synchronization. Sockets work across machines and underpin everything networked. Choice trades speed against coupling and complexity.",
    tips: "Shared memory = fastest but you bring your own locks; that trade-off is the answer's core.",
    tags: ["os", "ipc"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What are the differences between containers and virtual machines?",
    modelAnswer:
      "A VM virtualizes hardware and runs a full guest OS per instance — strong isolation, heavyweight, minutes to boot historically. Containers share the host kernel and isolate at the OS level via namespaces and cgroups — near-native performance, megabytes not gigabytes, millisecond starts. Containers trade isolation strength for density and speed; a kernel exploit escapes all containers on the host.",
    tips: "'VMs virtualize hardware; containers virtualize the OS' is the crisp one-liner.",
    tags: ["os", "devops"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Explain git merge vs git rebase.",
    modelAnswer:
      "Merge joins two histories with a merge commit, preserving the true branching topology — safe for shared branches. Rebase replays your commits on top of the target, producing linear history but rewriting commit hashes — great for cleaning up a private feature branch, dangerous on anything others have pulled. Many teams rebase locally and merge (or squash) into main.",
    tips: "The golden rule: never rebase commits that others may have based work on.",
    tags: ["git", "tooling"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is idempotency and why does it matter for APIs?",
    modelAnswer:
      "An operation is idempotent if performing it multiple times yields the same result as once — crucial because networks fail and clients retry. GET/PUT/DELETE should be idempotent by design; for POST-like actions (payments!), APIs accept an idempotency key so the server deduplicates retries instead of double-charging.",
    tips: "The double-charged payment retry is the motivating story interviewers expect.",
    tags: ["api", "distributed-systems"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is the difference between latency and throughput?",
    modelAnswer:
      "Latency is how long one operation takes end to end; throughput is how many operations complete per unit time. They're related but independent — batching raises throughput while worsening per-item latency. Report latency as percentiles (p50/p95/p99), never averages, because tail latency is what users feel.",
    tips: "Saying 'p99, not average' is the senior-engineer tell.",
    tags: ["performance", "distributed-systems"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is caching, and what are the hard parts?",
    modelAnswer:
      "Caching keeps hot data in faster storage to cut latency and load. The hard parts are invalidation (TTLs, explicit purge, or versioned keys — stale data is the tax), and the failure modes: stampedes when a hot key expires (fix with locks/jitter), penetration by non-existent keys (negative caching), and avalanches when a cache node dies (consistent hashing, replication).",
    tips: "Naming the three failure modes — stampede, penetration, avalanche — sets you apart.",
    tags: ["performance", "distributed-systems"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Explain optimistic vs pessimistic locking.",
    modelAnswer:
      "Pessimistic locking takes a lock before touching data — no conflicts, but held locks limit concurrency and risk deadlock; right when contention is high. Optimistic locking proceeds without locks and validates at commit (version column or compare-and-swap), retrying on conflict; right when contention is rare, which is most web workloads.",
    tips: "The version-number UPDATE … WHERE version = ? pattern is the expected concrete example.",
    tags: ["dbms", "concurrency"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is a CDN and when does it help?",
    modelAnswer:
      "A CDN is a geographically distributed fleet of edge caches that serves content close to users, cutting round-trip latency and offloading origin servers. It shines for static assets and cacheable pages, absorbs traffic spikes and some DDoS, and modern CDNs also terminate TLS and run edge logic. Dynamic, per-user responses benefit least.",
    tips: "Cache-Control headers and cache hit ratio are the operative details.",
    tags: ["networks", "performance", "web"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "Compiled vs interpreted languages — is the distinction still meaningful?",
    modelAnswer:
      "Classically, compiled languages translate to machine code ahead of time (C, Go, Rust) while interpreted ones execute source via an interpreter (classic Python, shell). The line has blurred: Java compiles to bytecode then JIT-compiles hot paths; modern JavaScript engines JIT aggressively; Python compiles to bytecode for a VM. What actually matters is startup time vs peak performance vs deployment model.",
    tips: "Bringing up JIT shows the distinction is a spectrum, not a binary.",
    tags: ["languages", "fundamentals"],
  },
  {
    category: "TECHNICAL_TRIVIA",
    question: "What is a deadlock's difference from starvation and livelock?",
    modelAnswer:
      "Deadlock: threads block forever waiting on each other's resources — nobody moves. Livelock: threads keep acting and changing state but make no progress (both repeatedly yield and retry). Starvation: the system progresses but a particular thread never gets scheduled or never wins the lock, often due to unfair priorities. Fixes: lock ordering, backoff with jitter, fair queues.",
    tips: "The hallway-dance metaphor nails livelock in one sentence.",
    tags: ["os", "concurrency"],
  },
];
