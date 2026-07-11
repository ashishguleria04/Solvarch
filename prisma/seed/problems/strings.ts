import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { boolOut, yt, lines, words, sortedLinesOut } from "../ref-utils";

const line0 = (input: string) => input.split("\n")[0] ?? "";

export const strings: SeedProblem[] = [
  {
    slug: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "EASY",
    statement: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\` (same characters with the same frequencies), otherwise \`false\`.

**Input**: line 1 is \`s\`, line 2 is \`t\`.
**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ s.length, t.length ≤ 5·10^4
- s and t consist of lowercase English letters.`,
    examples: [
      { input: "anagram\nnagaram", output: "true" },
      { input: "rat\ncar", output: "false" },
    ],
    hints: [
      "Anagrams have identical character counts.",
      "Count characters of s, then decrement for t — any mismatch means false.",
    ],
    editorial: `Count the frequency of each character in \`s\`, then walk \`t\` decrementing counts. If any count goes negative or a character is missing, they aren't anagrams. Different lengths are an immediate \`false\`. O(n) time, O(1) space (fixed alphabet).`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode valid anagram"),
    tags: ["string", "hash-table", "sorting"],
    starterCode: buildStarter("twoStrings", "bool", "isAnagram"),
    reference: (input) => {
      const [s, t] = input.split("\n");
      const a = s ?? "";
      const b = t ?? "";
      if (a.length !== b.length) return boolOut(false);
      const cnt: Record<string, number> = {};
      for (const c of a) cnt[c] = (cnt[c] ?? 0) + 1;
      for (const c of b) {
        if (!cnt[c]) return boolOut(false);
        cnt[c]--;
      }
      return boolOut(true);
    },
    tests: [
      { input: "anagram\nnagaram", sample: true },
      { input: "rat\ncar", sample: true },
      { input: "a\nab" },
      { input: "ab\nba" },
      { input: "aacc\nccac" },
    ],
  },

  {
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "EASY",
    statement: `A phrase is a palindrome if, after lowercasing and removing all non-alphanumeric characters, it reads the same forwards and backwards. Return \`true\` if \`s\` is a palindrome.

**Input**: one line \`s\` (may contain spaces and punctuation).
**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ s.length ≤ 2·10^5
- s consists of printable ASCII characters.`,
    examples: [
      { input: "A man, a plan, a canal: Panama", output: "true" },
      { input: "race a car", output: "false" },
    ],
    hints: [
      "Normalize first: lowercase and keep only letters and digits.",
      "Then use two pointers from both ends moving inward.",
    ],
    editorial: `Filter the string to lowercase alphanumeric characters, then compare with two pointers moving inward from both ends. Any mismatch means it isn't a palindrome. O(n) time, O(1) extra space if you skip characters in place.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode valid palindrome"),
    tags: ["string", "two-pointers"],
    starterCode: buildStarter("string", "bool", "isPalindrome"),
    reference: (input) => {
      const s = line0(input);
      const t = s.toLowerCase().replace(/[^a-z0-9]/g, "");
      let i = 0;
      let j = t.length - 1;
      while (i < j) {
        if (t[i] !== t[j]) return boolOut(false);
        i++;
        j--;
      }
      return boolOut(true);
    },
    tests: [
      { input: "A man, a plan, a canal: Panama", sample: true },
      { input: "race a car", sample: true },
      { input: "0P" },
      { input: "ab_a" },
      { input: "Was it a car or a cat I saw?" },
    ],
  },

  {
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "MEDIUM",
    statement: `Given a string \`s\`, return the length of the longest substring that contains no repeating characters.

**Input**: one line \`s\`.
**Output**: the length as an integer.`,
    constraints: `- 0 ≤ s.length ≤ 5·10^4
- s consists of English letters, digits, symbols, and spaces.`,
    examples: [
      { input: "abcabcbb", output: "3", explanation: '"abc" has length 3.' },
      { input: "bbbbb", output: "1", explanation: '"b" has length 1.' },
    ],
    hints: [
      "Use a sliding window over the string.",
      "Remember the last index of each character; when you see a repeat inside the window, jump the left edge past it.",
    ],
    editorial: `Maintain a sliding window \`[start, i]\` and a map of each character's last seen index. When the current character was seen at or after \`start\`, move \`start\` to one past that index. The answer is the maximum window width \`i − start + 1\`. O(n) time.`,
    complexityTime: "O(n)",
    complexitySpace: "O(min(n, alphabet))",
    youtubeUrl: yt("neetcode longest substring without repeating characters"),
    tags: ["string", "sliding-window", "hash-table"],
    starterCode: buildStarter("string", "int", "lengthOfLongestSubstring"),
    reference: (input) => {
      const s = line0(input);
      const last = new Map<string, number>();
      let start = 0;
      let best = 0;
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (last.has(c) && (last.get(c) as number) >= start) {
          start = (last.get(c) as number) + 1;
        }
        last.set(c, i);
        best = Math.max(best, i - start + 1);
      }
      return String(best);
    },
    tests: [
      { input: "abcabcbb", sample: true },
      { input: "bbbbb", sample: true },
      { input: "pwwkew" },
      { input: "" },
      { input: "dvdf" },
      { input: "abba" },
    ],
  },

  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "EASY",
    statement: `Given a string \`s\` containing only the characters \`()[]{}\`, determine if it is valid: brackets must close in the correct order and every opening bracket has a matching closing bracket of the same type.

**Input**: one line \`s\`.
**Output**: \`true\` or \`false\`.`,
    constraints: `- 1 ≤ s.length ≤ 10^4
- s consists only of the characters ()[]{}.`,
    examples: [
      { input: "()[]{}", output: "true" },
      { input: "(]", output: "false" },
    ],
    hints: [
      "A stack naturally models nesting.",
      "Push opening brackets; on a closing bracket, the top of the stack must be its match.",
    ],
    editorial: `Scan the string with a stack. Push each opening bracket. On a closing bracket, the stack top must be the matching opener — otherwise it's invalid. At the end the stack must be empty. O(n) time and space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode valid parentheses"),
    tags: ["string", "stack"],
    starterCode: buildStarter("string", "bool", "isValid"),
    reference: (input) => {
      const s = line0(input);
      const st: string[] = [];
      const m: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
      for (const c of s) {
        if (c === "(" || c === "[" || c === "{") st.push(c);
        else if (st.pop() !== m[c]) return boolOut(false);
      }
      return boolOut(st.length === 0);
    },
    tests: [
      { input: "()[]{}", sample: true },
      { input: "(]", sample: true },
      { input: "()" },
      { input: "([)]" },
      { input: "{[]}" },
      { input: "(" },
    ],
  },

  {
    slug: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    difficulty: "MEDIUM",
    statement: `Given a string \`s\`, return the longest substring of \`s\` that is a palindrome. If several have the same length, return the one that appears first.

**Input**: one line \`s\`.
**Output**: the longest palindromic substring.`,
    constraints: `- 1 ≤ s.length ≤ 1000
- s consists of digits and English letters.`,
    examples: [
      { input: "babad", output: "bab", explanation: '"aba" is also valid, but "bab" appears first.' },
      { input: "cbbd", output: "bb" },
    ],
    hints: [
      "Every palindrome has a center — either a character or a gap between two characters.",
      "Expand outward from each of the 2n−1 possible centers and track the longest.",
    ],
    editorial: `**Expand around center.** There are \`2n − 1\` centers (each character and each gap). Expand outward from each while both sides match, tracking the longest palindrome found. O(n²) time, O(1) space — simple and fast enough for n ≤ 1000.`,
    approaches: [
      {
        name: "Expand around center",
        complexityTime: "O(n²)",
        complexitySpace: "O(1)",
        body: "Try all centers, expand while characters match, keep the longest window.",
      },
    ],
    complexityTime: "O(n²)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode longest palindromic substring"),
    tags: ["string", "dynamic-programming", "two-pointers"],
    starterCode: buildStarter("string", "string", "longestPalindrome"),
    reference: (input) => {
      const s = line0(input);
      if (s.length < 1) return "";
      let start = 0;
      let end = 0;
      const expand = (l: number, r: number): [number, number] => {
        while (l >= 0 && r < s.length && s[l] === s[r]) {
          l--;
          r++;
        }
        return [l + 1, r - 1];
      };
      for (let i = 0; i < s.length; i++) {
        for (const [l, r] of [expand(i, i), expand(i, i + 1)]) {
          if (r - l > end - start) {
            start = l;
            end = r;
          }
        }
      }
      return s.slice(start, end + 1);
    },
    tests: [
      { input: "babad", sample: true },
      { input: "cbbd", sample: true },
      { input: "a" },
      { input: "ac" },
      { input: "aaaa" },
      { input: "abacdfgdcaba" },
    ],
  },

  {
    slug: "longest-common-prefix",
    title: "Longest Common Prefix",
    difficulty: "EASY",
    statement: `Find the longest common prefix among an array of strings. If there is none, print an empty line.

**Input**: one line of space-separated words.
**Output**: the longest common prefix.`,
    constraints: `- 1 ≤ words ≤ 200
- 1 ≤ word length ≤ 200; lowercase letters.`,
    examples: [
      { input: "flower flow flight", output: "fl" },
      { input: "dog racecar car", output: "", explanation: "No common prefix." },
    ],
    hints: [
      "Compare character-by-character across all words (vertical scan).",
      "Stop at the first column where words disagree or run out.",
    ],
    editorial: `**Vertical scan**: take the first word as the candidate and check each character column against every other word, stopping at the first mismatch or end-of-word. Worst case O(total characters), and it exits early on the common short-prefix cases. Sorting-based and divide-and-conquer variants exist but add nothing here.`,
    complexityTime: "O(Σ characters)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("longest common prefix leetcode"),
    tags: ["string", "trie"],
    starterCode: buildStarter("stringArray", "string", "longestCommonPrefix"),
    reference: (input) => {
      const ws = words(lines(input)[0]);
      let prefix = ws[0] ?? "";
      for (const w of ws.slice(1)) {
        let i = 0;
        while (i < prefix.length && i < w.length && prefix[i] === w[i]) i++;
        prefix = prefix.slice(0, i);
        if (!prefix) break;
      }
      return prefix;
    },
    tests: [
      { input: "flower flow flight", sample: true },
      { input: "dog racecar car", sample: true },
      { input: "single" },
      { input: "ab a" },
      { input: "interspecies interstellar interstate" },
    ],
  },

  {
    slug: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "MEDIUM",
    statement: `Group the words that are anagrams of each other.

**Input**: one line of space-separated words.
**Output**: one group per line, the words within a group in **sorted order** (groups themselves may be produced in any order — the template prints them canonically).`,
    constraints: `- 1 ≤ words ≤ 10^4
- 0 ≤ word length ≤ 100; lowercase letters.`,
    examples: [
      {
        input: "eat tea tan ate nat bat",
        output: "ate eat tea\nbat\nnat tan",
        explanation: "Anagram groups: {eat,tea,ate}, {tan,nat}, {bat}.",
      },
      { input: "a", output: "a" },
    ],
    hints: [
      "Anagrams share the same sorted character sequence — use it as a map key.",
      "A 26-letter count signature avoids the per-word sort.",
    ],
    editorial: `Hash each word by a canonical form: its sorted characters (O(L log L) per word) or a 26-count signature (O(L)). Words mapping to the same key are anagrams — collect the map's values as groups. O(n · L) with the counting key. Sorting within each group just makes output deterministic.`,
    complexityTime: "O(n · L)",
    complexitySpace: "O(n · L)",
    youtubeUrl: yt("neetcode group anagrams"),
    tags: ["string", "hash-table", "sorting"],
    starterCode: buildStarter("stringArray", "sortedLines", "groupAnagrams"),
    reference: (input) => {
      const ws = words(lines(input)[0]);
      const groups = new Map<string, string[]>();
      for (const w of ws) {
        const key = w.split("").sort().join("");
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(w);
      }
      const out: string[] = [];
      for (const g of groups.values()) out.push(g.sort().join(" "));
      return sortedLinesOut(out);
    },
    tests: [
      { input: "eat tea tan ate nat bat", sample: true },
      { input: "a", sample: true },
      { input: "abc cba bca xyz" },
      { input: "listen silent enlist inlets google" },
    ],
  },

  {
    slug: "roman-to-integer",
    title: "Roman to Integer",
    difficulty: "EASY",
    statement: `Convert a Roman numeral to an integer. Symbols: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. A smaller symbol before a larger one subtracts (IV=4, IX=9, XL=40, XC=90, CD=400, CM=900).

**Input**: one line, the Roman numeral.
**Output**: the integer value.`,
    constraints: `- 1 ≤ length ≤ 15
- Valid Roman numeral in [1, 3999].`,
    examples: [
      { input: "III", output: "3" },
      { input: "LVIII", output: "58" },
      { input: "MCMXCIV", output: "1994", explanation: "M + CM + XC + IV." },
    ],
    hints: [
      "Scan left to right comparing each symbol with its successor.",
      "If the current value is smaller than the next, subtract it; otherwise add it.",
    ],
    editorial: `One rule covers all six subtractive pairs: a symbol whose value is **less than its right neighbor** is subtracted, all others are added. Single pass with a value lookup table — O(n) time, O(1) space, no special-casing needed.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("roman to integer leetcode"),
    tags: ["string", "hash-table", "math"],
    starterCode: buildStarter("string", "int", "romanToInt"),
    reference: (input) => {
      const s = (lines(input)[0] ?? "").trim();
      const val: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let total = 0;
      for (let i = 0; i < s.length; i++) {
        if (i + 1 < s.length && val[s[i]] < val[s[i + 1]]) total -= val[s[i]];
        else total += val[s[i]];
      }
      return String(total);
    },
    tests: [
      { input: "III", sample: true },
      { input: "LVIII", sample: true },
      { input: "MCMXCIV", sample: true },
      { input: "IX" },
      { input: "MMMCMXCIX" },
    ],
  },

  {
    slug: "string-to-integer-atoi",
    title: "String to Integer (atoi)",
    difficulty: "MEDIUM",
    statement: `Implement \`atoi\`: skip leading spaces, read an optional sign, read digits until a non-digit, and clamp the result to the 32-bit signed range [−2³¹, 2³¹−1]. Anything unreadable yields 0.

**Input**: one line, the raw string.
**Output**: the parsed integer.`,
    constraints: `- 0 ≤ length ≤ 200
- Letters, digits, spaces, '+', '-', '.'.`,
    examples: [
      { input: "42", output: "42" },
      { input: "   -042", output: "-42" },
      { input: "1337c0d3", output: "1337", explanation: "Parsing stops at 'c'." },
      { input: "words and 987", output: "0" },
    ],
    hints: [
      "Follow the spec mechanically: whitespace → sign → digits → stop.",
      "Check for overflow before multiplying by 10, or accumulate in a wider type and clamp.",
    ],
    editorial: `A small state machine: consume leading spaces, one optional sign, then digits, ignoring everything after. The interview substance is **overflow handling** — either test \`result > (INT_MAX − digit) / 10\` before each step or accumulate in a 64-bit value and clamp to \`[−2³¹, 2³¹−1]\`. O(n) single pass.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("string to integer atoi leetcode"),
    tags: ["string", "simulation"],
    starterCode: buildStarter("string", "int", "myAtoi"),
    reference: (input) => {
      const s = lines(input)[0] ?? "";
      let i = 0;
      while (i < s.length && s[i] === " ") i++;
      let sign = 1;
      if (s[i] === "+" || s[i] === "-") {
        if (s[i] === "-") sign = -1;
        i++;
      }
      let num = 0;
      while (i < s.length && s[i] >= "0" && s[i] <= "9") {
        num = num * 10 + (s.charCodeAt(i) - 48);
        if (sign === 1 && num > 2147483647) return "2147483647";
        if (sign === -1 && num > 2147483648) return "-2147483648";
        i++;
      }
      return String(sign * num);
    },
    tests: [
      { input: "42", sample: true },
      { input: "   -042", sample: true },
      { input: "1337c0d3", sample: true },
      { input: "words and 987" },
      { input: "-91283472332" },
      { input: "+1" },
    ],
  },

  {
    slug: "find-the-index-of-the-first-occurrence-in-a-string",
    title: "Find the Index of the First Occurrence in a String",
    difficulty: "EASY",
    statement: `Return the index of the first occurrence of \`needle\` in \`haystack\`, or \`-1\` if absent.

**Input**
- Line 1: \`haystack\`
- Line 2: \`needle\`

**Output**: the index, or -1.`,
    constraints: `- 1 ≤ lengths ≤ 10^4
- Lowercase English letters.`,
    examples: [
      { input: "sadbutsad\nsad", output: "0" },
      { input: "leetcode\nleeto", output: "-1" },
    ],
    hints: [
      "Try aligning the needle at every possible start — O(n·m) is accepted here.",
      "KMP builds a failure table so the scan never re-examines matched text — O(n + m).",
    ],
    editorial: `The sliding comparison — try each alignment and compare — is O(n·m) and perfectly acceptable. The classic follow-up is **KMP**: precompute the needle's longest-proper-prefix-suffix table so that on a mismatch you shift by the table instead of restarting, giving O(n + m). Mentioning (and sketching) KMP is what separates the answer.`,
    approaches: [
      {
        name: "Brute-force alignment",
        complexityTime: "O(n·m)",
        complexitySpace: "O(1)",
        body: "Compare the needle at every start index.",
      },
      {
        name: "KMP",
        complexityTime: "O(n + m)",
        complexitySpace: "O(m)",
        body: "Failure-function table avoids re-scanning matched characters.",
      },
    ],
    complexityTime: "O(n + m)",
    complexitySpace: "O(m)",
    youtubeUrl: yt("find first occurrence strstr kmp"),
    tags: ["string", "two-pointers", "kmp"],
    starterCode: buildStarter("twoStrings", "int", "strStr"),
    reference: (input) => {
      const [haystack = "", needle = ""] = lines(input);
      return String(haystack.indexOf(needle));
    },
    tests: [
      { input: "sadbutsad\nsad", sample: true },
      { input: "leetcode\nleeto", sample: true },
      { input: "a\na" },
      { input: "mississippi\nissip" },
      { input: "abc\nabcd" },
    ],
  },
];
