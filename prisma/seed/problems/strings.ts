import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { boolOut, yt } from "../ref-utils";

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
];
