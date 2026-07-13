import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { boolOut, yt, lines, linesOut, words } from "../ref-utils";

export const tries: SeedProblem[] = [
  {
    slug: "implement-trie-prefix-tree",
    title: "Implement Trie (Prefix Tree)",
    difficulty: "MEDIUM",
    statement: `Implement a trie supporting insertion, exact word search, and prefix search.

**Input**: one operation per line —
- \`insert w\` — insert word w
- \`search w\` — print \`true\` if w was inserted
- \`startsWith p\` — print \`true\` if any inserted word starts with p

**Output**: one line per operation — \`insert\` prints \`null\`; the others print \`true\`/\`false\`.`,
    constraints: `- 1 ≤ word length ≤ 2000
- Up to 3·10^4 operations; lowercase letters.`,
    examples: [
      {
        input: "insert apple\nsearch apple\nsearch app\nstartsWith app\ninsert app\nsearch app",
        output: "null\ntrue\nfalse\ntrue\nnull\ntrue",
      },
    ],
    hints: [
      "Each node holds up to 26 children and an end-of-word flag.",
      "search and startsWith walk the same path; only the final check differs.",
    ],
    editorial: `A trie node maps characters to children plus an \`isEnd\` flag. **insert** walks the word creating missing nodes and marks the last one; **search** walks and requires \`isEnd\`; **startsWith** walks and requires only that the path exists. All operations are O(L) in the word length — independent of how many words are stored, which is the whole point of tries.`,
    complexityTime: "O(L) per operation",
    complexitySpace: "O(total characters)",
    youtubeUrl: yt("neetcode implement trie prefix tree"),
    tags: ["trie", "design", "string"],
    starterCode: buildStarter("ops", "lines", "processOps"),
    reference: (input) => {
      const ops = lines(input).filter((l) => l.trim().length > 0);
      type Node = { children: Map<string, Node>; end: boolean };
      const mk = (): Node => ({ children: new Map(), end: false });
      const root = mk();
      const out: string[] = [];
      const walk = (w: string): Node | null => {
        let n: Node = root;
        for (const c of w) {
          const next = n.children.get(c);
          if (!next) return null;
          n = next;
        }
        return n;
      };
      for (const op of ops) {
        const [cmd, arg] = op.trim().split(/\s+/);
        if (cmd === "insert") {
          let n = root;
          for (const c of arg) {
            if (!n.children.has(c)) n.children.set(c, mk());
            n = n.children.get(c)!;
          }
          n.end = true;
          out.push("null");
        } else if (cmd === "search") {
          const n = walk(arg);
          out.push(boolOut(!!n && n.end));
        } else {
          out.push(boolOut(!!walk(arg)));
        }
      }
      return linesOut(out);
    },
    tests: [
      {
        input: "insert apple\nsearch apple\nsearch app\nstartsWith app\ninsert app\nsearch app",
        sample: true,
      },
      { input: "search a\nstartsWith a\ninsert a\nsearch a" },
      { input: "insert ab\ninsert abc\nsearch ab\nstartsWith abc\nstartsWith abcd" },
    ],
  },

  {
    slug: "design-add-and-search-words-data-structure",
    title: "Design Add and Search Words Data Structure",
    difficulty: "MEDIUM",
    statement: `Design a data structure that stores words and supports searching with the wildcard \`.\` (matches any single letter).

**Input**: one operation per line —
- \`addWord w\` — add word w
- \`search p\` — print \`true\` if any stored word matches pattern p (letters and dots)

**Output**: one line per operation — \`addWord\` prints \`null\`; \`search\` prints \`true\`/\`false\`.`,
    constraints: `- 1 ≤ word length ≤ 25
- At most 2 dots per search; up to 10^4 operations.`,
    examples: [
      {
        input: "addWord bad\naddWord dad\naddWord mad\nsearch pad\nsearch bad\nsearch .ad\nsearch b..",
        output: "null\nnull\nnull\nfalse\ntrue\ntrue\ntrue",
      },
    ],
    hints: [
      "A trie handles literal letters; the wildcard needs branching.",
      "On '.', recurse into every child; on a letter, follow just that edge.",
    ],
    editorial: `Store words in a trie. Search runs a DFS over the trie following literal characters directly; a \`.\` fans out into **all** children at that depth. With at most a couple of dots the branching stays cheap; worst case is O(26^d · L) for d dots. Adding is a plain trie insert, O(L).`,
    complexityTime: "O(L) add, O(26^d · L) search",
    complexitySpace: "O(total characters)",
    youtubeUrl: yt("neetcode design add and search words"),
    tags: ["trie", "design", "dfs", "string"],
    starterCode: buildStarter("ops", "lines", "processOps"),
    reference: (input) => {
      const ops = lines(input).filter((l) => l.trim().length > 0);
      type Node = { children: Map<string, Node>; end: boolean };
      const mk = (): Node => ({ children: new Map(), end: false });
      const root = mk();
      const out: string[] = [];
      const match = (n: Node, p: string, i: number): boolean => {
        if (i === p.length) return n.end;
        const c = p[i];
        if (c === ".") {
          for (const child of n.children.values()) {
            if (match(child, p, i + 1)) return true;
          }
          return false;
        }
        const next = n.children.get(c);
        return !!next && match(next, p, i + 1);
      };
      for (const op of ops) {
        const [cmd, arg] = op.trim().split(/\s+/);
        if (cmd === "addWord") {
          let n = root;
          for (const c of arg) {
            if (!n.children.has(c)) n.children.set(c, mk());
            n = n.children.get(c)!;
          }
          n.end = true;
          out.push("null");
        } else {
          out.push(boolOut(match(root, arg, 0)));
        }
      }
      return linesOut(out);
    },
    tests: [
      {
        input: "addWord bad\naddWord dad\naddWord mad\nsearch pad\nsearch bad\nsearch .ad\nsearch b..",
        sample: true,
      },
      { input: "addWord a\nsearch .\nsearch a\nsearch aa" },
      { input: "addWord at\naddWord and\nsearch an.\nsearch .t\nsearch a.d." },
    ],
  },

  {
    slug: "longest-word-in-dictionary",
    title: "Longest Word in Dictionary",
    difficulty: "MEDIUM",
    statement: `Given a list of words, return the longest word that can be **built one character at a time**, where every prefix of it (of every length) is also a word in the list. On ties, return the lexicographically smallest. Return an empty line if no word qualifies.

**Input**: one line of space-separated words.
**Output**: the answer word (or empty).`,
    constraints: `- 1 ≤ words.length ≤ 1000
- 1 ≤ word length ≤ 30; lowercase letters.`,
    examples: [
      { input: "w wo wor worl world", output: "world" },
      { input: "a banana app appl ap apply apple", output: "apple", explanation: "apple and apply tie at length 5; apple is smaller." },
      { input: "abc bd", output: "", explanation: "No single-letter starting point." },
    ],
    hints: [
      "Sort the words; then every buildable word's prefix appears before it.",
      "Keep a set of buildable words: w is buildable if w minus its last char is in the set (or has length 1).",
    ],
    editorial: `Sort the words (shorter/lexicographically-smaller first), then greedily grow a set of buildable words: a word qualifies if its length is 1 or its prefix-minus-one is already buildable. Track the best answer preferring longer, then lexicographically smaller — the sort order makes ties resolve automatically if you only replace on strictly longer. A trie with end-flags gives the same result and is the intended interview framing. O(Σ L log n).`,
    complexityTime: "O(Σ L · log n)",
    complexitySpace: "O(Σ L)",
    youtubeUrl: yt("longest word in dictionary trie"),
    tags: ["trie", "string", "sorting", "hash-table"],
    starterCode: buildStarter("stringArray", "string", "longestWord"),
    reference: (input) => {
      const ws = words(lines(input)[0]).sort();
      const buildable = new Set<string>();
      let best = "";
      for (const w of ws) {
        if (w.length === 1 || buildable.has(w.slice(0, -1))) {
          buildable.add(w);
          if (w.length > best.length) best = w;
        }
      }
      return best;
    },
    tests: [
      { input: "w wo wor worl world", sample: true },
      { input: "a banana app appl ap apply apple", sample: true },
      { input: "abc bd", sample: true },
      { input: "m mo moc mocha" },
      { input: "yo ew fc zrc yodn fcm qm qmo fcmz z ewq yod ewqz y" },
    ],
  },

  {
    slug: "replace-words",
    title: "Replace Words",
    difficulty: "MEDIUM",
    statement: `Given a sentence and a dictionary of **roots**, replace every word in the sentence that has a root as a prefix with its **shortest** such root. Words without a matching root stay unchanged.

**Input**
- Line 1: the sentence (words separated by single spaces)
- Line 2: space-separated dictionary roots

**Output**: the transformed sentence.`,
    constraints: `- 1 ≤ sentence words ≤ 1000
- 1 ≤ roots ≤ 1000; lowercase letters.`,
    examples: [
      { input: "the cattle was rattled by the battery\ncat bat rat", output: "the cat was rat by the bat" },
      { input: "a aadsfasf absbs bbab cadsfafs\na b c", output: "a a a b c" },
    ],
    hints: [
      "Checking every root against every word is O(words × roots × L).",
      "Put the roots in a trie; for each word walk until you hit an end-flag (shortest root wins).",
    ],
    editorial: `Insert all roots into a trie with end-of-word flags. For each sentence word, walk the trie character by character; the first end-flag you meet is the **shortest** matching root — replace and stop. If the walk dies without a flag, keep the original word. Total O(dictionary + sentence) characters.`,
    complexityTime: "O(Σ characters)",
    complexitySpace: "O(dictionary characters)",
    youtubeUrl: yt("replace words trie leetcode"),
    tags: ["trie", "string", "hash-table"],
    starterCode: buildStarter("stringWords", "string", "replaceWords"),
    reference: (input) => {
      const [sentence = "", rootLine = ""] = lines(input);
      const roots = words(rootLine);
      type Node = { children: Map<string, Node>; end: boolean };
      const mk = (): Node => ({ children: new Map(), end: false });
      const root = mk();
      for (const r of roots) {
        let n = root;
        for (const c of r) {
          if (!n.children.has(c)) n.children.set(c, mk());
          n = n.children.get(c)!;
        }
        n.end = true;
      }
      const replace = (w: string): string => {
        let n = root;
        for (let i = 0; i < w.length; i++) {
          const next = n.children.get(w[i]);
          if (!next) return w;
          n = next;
          if (n.end) return w.slice(0, i + 1);
        }
        return w;
      };
      return words(sentence).map(replace).join(" ");
    },
    tests: [
      { input: "the cattle was rattled by the battery\ncat bat rat", sample: true },
      { input: "a aadsfasf absbs bbab cadsfafs\na b c", sample: true },
      { input: "hello world\nxyz" },
      { input: "aa aaa aaaa\na" },
    ],
  },

  {
    slug: "word-break",
    title: "Word Break",
    difficulty: "MEDIUM",
    statement: `Given a string \`s\` and a dictionary of words, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words (words may be reused).

**Input**
- Line 1: the string \`s\`
- Line 2: space-separated dictionary words

**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ s.length ≤ 300
- 1 ≤ dictionary size ≤ 1000; lowercase letters.`,
    examples: [
      { input: "leetcode\nleet code", output: "true" },
      { input: "applepenapple\napple pen", output: "true" },
      { input: "catsandog\ncats dog sand and cat", output: "false" },
    ],
    hints: [
      "Greedy fails: taking the longest matching word first can strand the remainder.",
      "dp[i] = can s[0..i) be segmented? Try every dictionary word as the final piece.",
      "A trie (or a set with bounded word lengths) speeds up the inner matching.",
    ],
    editorial: `Dynamic programming over prefixes: \`dp[i]\` is true when some \`j < i\` has \`dp[j]\` true and \`s[j..i)\` in the dictionary. \`dp[0]\` (empty prefix) seeds it; \`dp[n]\` answers it. With a hash set the check is O(1) per substring → O(n² · L) worst case; a trie walked from each \`j\` avoids re-hashing overlapping substrings.`,
    approaches: [
      {
        name: "DFS + memo on start index",
        complexityTime: "O(n²)",
        complexitySpace: "O(n)",
        body: "Recurse on the remaining suffix; memoize failed start positions.",
      },
      {
        name: "Bottom-up DP",
        complexityTime: "O(n² · L)",
        complexitySpace: "O(n)",
        body: "dp[i] over prefix lengths, checking dictionary membership of each candidate suffix.",
      },
    ],
    complexityTime: "O(n²)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode word break"),
    tags: ["trie", "dynamic-programming", "string", "hash-table"],
    starterCode: buildStarter("stringWords", "bool", "wordBreak"),
    reference: (input) => {
      const [s = "", dictLine = ""] = lines(input);
      const dict = new Set(words(dictLine));
      const n = s.length;
      const dp = new Array(n + 1).fill(false);
      dp[0] = true;
      for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
          if (dp[j] && dict.has(s.slice(j, i))) {
            dp[i] = true;
            break;
          }
        }
      }
      return boolOut(dp[n]);
    },
    tests: [
      { input: "leetcode\nleet code", sample: true },
      { input: "applepenapple\napple pen", sample: true },
      { input: "catsandog\ncats dog sand and cat", sample: true },
      { input: "a\nb" },
      { input: "aaaaaaa\naaaa aaa" },
    ],
  },
];
