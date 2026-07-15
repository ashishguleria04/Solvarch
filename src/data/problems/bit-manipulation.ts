import type { SeedProblem } from "../types";
import { buildStarter } from "../starters";
import { ints, int, boolOut, arrOut, yt, lines } from "../ref-utils";

const first = (s: string) => ints(s.split("\n")[0]);

export const bitManipulation: SeedProblem[] = [
  {
    slug: "single-number",
    title: "Single Number",
    difficulty: "EASY",
    statement: `Every element of \`nums\` appears exactly twice except one, which appears once. Find it in O(n) time and O(1) space.

**Input**: one line of space-separated integers.
**Output**: the single number.`,
    constraints: `- 1 ≤ nums.length ≤ 3·10^4 (odd)
- Each value appears twice except one.`,
    examples: [
      { input: "2 2 1", output: "1" },
      { input: "4 1 2 1 2", output: "4" },
    ],
    hints: [
      "x ^ x = 0 and x ^ 0 = x.",
      "XOR everything — pairs annihilate, the loner survives.",
    ],
    editorial: `XOR is associative, commutative, and self-inverse, so XOR-folding the whole array cancels every pair and leaves the unique element. One pass, no extra memory — the cleanest bit-trick in the interview canon.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode single number"),
    tags: ["bit-manipulation", "array"],
    starterCode: buildStarter("intArray", "int", "singleNumber"),
    reference: (input) => {
      const nums = first(input);
      return String(nums.reduce((a, b) => a ^ b, 0));
    },
    tests: [
      { input: "2 2 1", sample: true },
      { input: "4 1 2 1 2", sample: true },
      { input: "1" },
      { input: "-3 5 5" },
      { input: "7 3 7 9 3" },
    ],
  },

  {
    slug: "single-number-ii",
    title: "Single Number II",
    difficulty: "MEDIUM",
    statement: `Every element appears exactly **three times** except one, which appears once. Find it in O(n) time and O(1) space.

**Input**: one line of space-separated integers.
**Output**: the single number.`,
    constraints: `- 1 ≤ nums.length ≤ 3·10^4
- -2^31 ≤ values ≤ 2^31 − 1`,
    examples: [
      { input: "2 2 3 2", output: "3" },
      { input: "0 1 0 1 0 1 99", output: "99" },
    ],
    hints: [
      "Plain XOR doesn't cancel triples.",
      "Count each bit position mod 3: the remainder pattern is the answer's bit.",
      "The slick version tracks 'seen once' and 'seen twice' masks with two variables.",
    ],
    editorial: `Per bit position, the total count of set bits across the array is ≡ the unique number's bit (mod 3), since triples contribute multiples of 3. Summing each of the 32 positions mod 3 reconstructs the answer (mind the sign bit). The two-variable automaton (\`ones\`, \`twos\`) does the same in a single elegant pass. O(32n) → O(n), O(1) space.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("single number ii bit manipulation"),
    tags: ["bit-manipulation", "array"],
    starterCode: buildStarter("intArray", "int", "singleNumberII"),
    reference: (input) => {
      const nums = first(input);
      let ones = 0;
      let twos = 0;
      for (const x of nums) {
        ones = (ones ^ x) & ~twos;
        twos = (twos ^ x) & ~ones;
      }
      return String(ones);
    },
    tests: [
      { input: "2 2 3 2", sample: true },
      { input: "0 1 0 1 0 1 99", sample: true },
      { input: "5" },
      { input: "-2 -2 1 -2" },
      { input: "30000 500 100 30000 100 30000 100" },
    ],
  },

  {
    slug: "number-of-1-bits",
    title: "Number of 1 Bits",
    difficulty: "EASY",
    statement: `Return the number of set bits (the Hamming weight) in the binary representation of a non-negative integer \`n\`.

**Input**: one line, the integer \`n\`.
**Output**: the count of 1 bits.`,
    constraints: `- 0 ≤ n ≤ 2^31 − 1`,
    examples: [
      { input: "11", output: "3", explanation: "1011₂." },
      { input: "128", output: "1", explanation: "10000000₂." },
    ],
    hints: [
      "Checking all 32 bits works. Can you loop only over the set bits?",
      "n & (n − 1) clears the lowest set bit.",
    ],
    editorial: `The check-each-bit loop is fine, but **Kernighan's trick** is the expected answer: \`n & (n − 1)\` zeroes the lowest set bit, so looping until n hits 0 iterates exactly once per set bit. O(number of 1s) — and the same identity powers the "power of two" test.`,
    complexityTime: "O(set bits)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("number of 1 bits kernighan"),
    tags: ["bit-manipulation"],
    starterCode: buildStarter("int", "int", "hammingWeight"),
    reference: (input) => {
      let n = int(lines(input)[0]);
      let count = 0;
      while (n !== 0) {
        n &= n - 1;
        count++;
      }
      return String(count);
    },
    tests: [
      { input: "11", sample: true },
      { input: "128", sample: true },
      { input: "0" },
      { input: "1" },
      { input: "2147483647" },
    ],
  },

  {
    slug: "counting-bits",
    title: "Counting Bits",
    difficulty: "EASY",
    statement: `For every \`i\` from 0 to \`n\`, output the number of 1 bits in \`i\`. Aim for O(n) total — better than calling popcount n times.

**Input**: one line, the integer \`n\`.
**Output**: n+1 counts, space-separated.`,
    constraints: `- 0 ≤ n ≤ 10^5`,
    examples: [
      { input: "2", output: "0 1 1" },
      { input: "5", output: "0 1 1 2 1 2" },
    ],
    hints: [
      "Relate bits(i) to a smaller, already-computed value.",
      "bits(i) = bits(i >> 1) + (i & 1) — shift off the last bit.",
      "Or: bits(i) = bits(i & (i−1)) + 1.",
    ],
    editorial: `A one-line DP: \`bits[i] = bits[i >> 1] + (i & 1)\` — i without its last bit is already solved, then add the last bit back. Each entry is O(1) → O(n) total, meeting the follow-up bound. Equivalent recurrence: \`bits[i & (i−1)] + 1\` via Kernighan.`,
    complexityTime: "O(n)",
    complexitySpace: "O(n)",
    youtubeUrl: yt("neetcode counting bits"),
    tags: ["bit-manipulation", "dynamic-programming"],
    starterCode: buildStarter("int", "intArray", "countBits"),
    reference: (input) => {
      const n = int(lines(input)[0]);
      const bits = new Array(n + 1).fill(0);
      for (let i = 1; i <= n; i++) bits[i] = bits[i >> 1] + (i & 1);
      return arrOut(bits);
    },
    tests: [
      { input: "2", sample: true },
      { input: "5", sample: true },
      { input: "0" },
      { input: "16" },
      { input: "31" },
    ],
  },

  {
    slug: "missing-number",
    title: "Missing Number",
    difficulty: "EASY",
    statement: `Array \`nums\` holds \`n\` distinct values from the range \`[0, n]\` — exactly one value is missing. Find it in O(n) time and O(1) space.

**Input**: one line of space-separated integers.
**Output**: the missing value.`,
    constraints: `- 1 ≤ n ≤ 10^4
- Values are distinct and within [0, n].`,
    examples: [
      { input: "3 0 1", output: "2" },
      { input: "9 6 4 2 3 5 7 0 1", output: "8" },
    ],
    hints: [
      "Gauss: the full range sums to n(n+1)/2.",
      "Or XOR indices against values — matched pairs cancel.",
    ],
    editorial: `Two O(1)-space one-liners: subtract the array's sum from \`n(n+1)/2\` (Gauss), or XOR every index 0..n with every value — everything pairs off except the missing number. XOR avoids any overflow concern in fixed-width languages.`,
    complexityTime: "O(n)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("neetcode missing number"),
    tags: ["bit-manipulation", "math", "array"],
    starterCode: buildStarter("intArray", "int", "missingNumber"),
    reference: (input) => {
      const nums = first(input);
      const n = nums.length;
      let x = n;
      for (let i = 0; i < n; i++) x ^= i ^ nums[i];
      return String(x);
    },
    tests: [
      { input: "3 0 1", sample: true },
      { input: "9 6 4 2 3 5 7 0 1", sample: true },
      { input: "0" },
      { input: "1" },
      { input: "1 2" },
    ],
  },

  {
    slug: "power-of-two",
    title: "Power of Two",
    difficulty: "EASY",
    statement: `Return \`true\` if integer \`n\` is a power of two (n = 2ᵏ for some k ≥ 0). No loops or recursion needed.

**Input**: one line, the integer \`n\` (may be negative).
**Output**: \`true\` or \`false\`.`,
    constraints: `- -2^31 ≤ n ≤ 2^31 − 1`,
    examples: [
      { input: "1", output: "true", explanation: "2⁰." },
      { input: "16", output: "true" },
      { input: "3", output: "false" },
    ],
    hints: [
      "A power of two has exactly one set bit.",
      "n & (n − 1) == 0 for powers of two — but watch n ≤ 0.",
    ],
    editorial: `A positive power of two has exactly one set bit, so \`n > 0 && (n & (n − 1)) == 0\` decides it in O(1). The \`n > 0\` guard matters: 0 and negatives would otherwise slip through the bit test.`,
    complexityTime: "O(1)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("power of two bit manipulation"),
    tags: ["bit-manipulation", "math"],
    starterCode: buildStarter("int", "bool", "isPowerOfTwo"),
    reference: (input) => {
      const n = int(lines(input)[0]);
      return boolOut(n > 0 && (n & (n - 1)) === 0);
    },
    tests: [
      { input: "1", sample: true },
      { input: "16", sample: true },
      { input: "3", sample: true },
      { input: "0" },
      { input: "-16" },
      { input: "1073741824" },
    ],
  },

  {
    slug: "reverse-bits",
    title: "Reverse Bits",
    difficulty: "EASY",
    statement: `Given the 32-bit binary representation of an unsigned integer, reverse the bits and return the resulting unsigned integer value.

**Input**: one line — a 32-character binary string.
**Output**: the decimal value after reversal.`,
    constraints: `- The input is exactly 32 binary digits.`,
    examples: [
      {
        input: "00000010100101000001111010011100",
        output: "964176192",
        explanation: "Reversed: 00111001011110000010100101000000₂.",
      },
      {
        input: "11111111111111111111111111111101",
        output: "3221225471",
      },
    ],
    hints: [
      "Build the result bit by bit: shift the result left, append n's lowest bit, shift n right.",
      "Watch unsigned semantics — the result can exceed a signed 32-bit int.",
    ],
    editorial: `Peel bits off one end and push them onto the other: 32 iterations of \`result = (result << 1) | (n & 1); n >>= 1\`. In Java use \`long\`/unsigned shifts and in Python mask with \`0xFFFFFFFF\` — the reversed value may not fit a signed int. Divide-and-conquer mask swapping (swap halves, then quarters…) does it in 5 operations for extra credit.`,
    complexityTime: "O(32)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("reverse bits leetcode"),
    tags: ["bit-manipulation"],
    starterCode: buildStarter("string", "long", "reverseBits"),
    reference: (input) => {
      const s = (lines(input)[0] ?? "").trim();
      const reversed = s.split("").reverse().join("");
      return String(parseInt(reversed, 2));
    },
    tests: [
      { input: "00000010100101000001111010011100", sample: true },
      { input: "11111111111111111111111111111101", sample: true },
      { input: "00000000000000000000000000000000" },
      { input: "11111111111111111111111111111111" },
      { input: "10000000000000000000000000000000" },
    ],
  },

  {
    slug: "sum-of-two-integers",
    title: "Sum of Two Integers",
    difficulty: "MEDIUM",
    statement: `Compute \`a + b\` **without using + or -**.

**Input**: one line, two integers \`a b\`.
**Output**: their sum.`,
    constraints: `- -1000 ≤ a, b ≤ 1000`,
    examples: [
      { input: "1 2", output: "3" },
      { input: "2 3", output: "5" },
    ],
    hints: [
      "XOR adds without carrying; AND finds where carries happen.",
      "Repeat: sum = a ^ b, carry = (a & b) << 1, until the carry dies.",
      "In Python, mask to 32 bits to simulate fixed-width overflow.",
    ],
    editorial: `Binary addition splits into a carry-less sum (\`a ^ b\`) and the carries (\`(a & b) << 1\`); iterating until the carry is zero converges because each round pushes carries one bit left. Fixed-width languages get negative numbers free via two's complement; Python needs explicit 32-bit masking. O(32) iterations max.`,
    complexityTime: "O(1)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("sum of two integers bit manipulation neetcode"),
    tags: ["bit-manipulation", "math"],
    starterCode: buildStarter("twoIntsLine", "int", "getSum"),
    reference: (input) => {
      const [a, b] = ints(lines(input)[0]);
      return String(a + b);
    },
    tests: [
      { input: "1 2", sample: true },
      { input: "2 3", sample: true },
      { input: "-1 1" },
      { input: "-12 -8" },
      { input: "1000 -999" },
    ],
  },

  {
    slug: "add-binary",
    title: "Add Binary",
    difficulty: "EASY",
    statement: `Given two binary strings \`a\` and \`b\`, return their sum as a binary string.

**Input**
- Line 1: binary string \`a\`
- Line 2: binary string \`b\`

**Output**: the binary sum.`,
    constraints: `- 1 ≤ lengths ≤ 10^4
- No leading zeros except the string "0".`,
    examples: [
      { input: "11\n1", output: "100" },
      { input: "1010\n1011", output: "10101" },
    ],
    hints: [
      "Grade-school addition from the rightmost bits with a carry.",
      "Loop while either string has digits or a carry remains.",
    ],
    editorial: `Walk both strings from the right summing \`bitA + bitB + carry\`; emit \`sum % 2\`, carry \`sum / 2\`, and keep going while any digits or carry remain (999…+1 analog: "1" + "1" → "10"). Building the answer backwards and reversing avoids O(n²) prepends. O(max(m, n)).`,
    complexityTime: "O(max(m, n))",
    complexitySpace: "O(max(m, n))",
    youtubeUrl: yt("add binary leetcode"),
    tags: ["bit-manipulation", "string", "math"],
    starterCode: buildStarter("twoStrings", "string", "addBinary"),
    reference: (input) => {
      const [a = "0", b = "0"] = lines(input);
      let i = a.length - 1;
      let j = b.length - 1;
      let carry = 0;
      const out: string[] = [];
      while (i >= 0 || j >= 0 || carry) {
        const s = (i >= 0 ? +a[i--] : 0) + (j >= 0 ? +b[j--] : 0) + carry;
        out.push(String(s % 2));
        carry = s >> 1;
      }
      return out.reverse().join("");
    },
    tests: [
      { input: "11\n1", sample: true },
      { input: "1010\n1011", sample: true },
      { input: "0\n0" },
      { input: "1\n111" },
      { input: "1111\n1111" },
    ],
  },

  {
    slug: "hamming-distance",
    title: "Hamming Distance",
    difficulty: "EASY",
    statement: `The Hamming distance between two integers is the number of bit positions where they differ. Given \`x\` and \`y\`, return their Hamming distance.

**Input**: one line, two integers \`x y\`.
**Output**: the Hamming distance.`,
    constraints: `- 0 ≤ x, y ≤ 2^31 − 1`,
    examples: [
      {
        input: "1 4",
        output: "2",
        explanation: "001 vs 100 — bits 0 and 2 differ.",
      },
      { input: "3 1", output: "1" },
    ],
    hints: [
      "XOR marks exactly the differing positions with 1s.",
      "The problem reduces to popcount(x ^ y).",
      "Count set bits with Kernighan: n & (n − 1) clears the lowest one.",
    ],
    editorial: `Two ideas you already own, composed: \`x ^ y\` produces a mask whose set bits are precisely the disagreements, and Kernighan's loop (\`n &= n − 1\`, once per set bit) counts them. O(number of differing bits), O(1) space. Hamming distance is the unit of error detection — it's why parity bits catch single-bit flips and how error-correcting codes measure themselves — so this tiny problem has real hardware pedigree. Follow-up to expect: *total* Hamming distance over an array — per-bit column counting (ones × zeros per position), not pairwise XOR.`,
    approaches: [
      {
        name: "XOR + Kernighan popcount",
        complexityTime: "O(set bits)",
        complexitySpace: "O(1)",
        body: "Diff mask via XOR; strip lowest set bit until zero.",
      },
    ],
    complexityTime: "O(1)",
    complexitySpace: "O(1)",
    youtubeUrl: yt("hamming distance leetcode"),
    tags: ["bit-manipulation"],
    starterCode: buildStarter("twoIntsLine", "int", "hammingDistance"),
    reference: (input) => {
      const [a, b] = ints(lines(input)[0]);
      let x = a ^ b;
      let count = 0;
      while (x !== 0) {
        x &= x - 1;
        count++;
      }
      return String(count);
    },
    tests: [
      { input: "1 4", sample: true },
      { input: "3 1", sample: true },
      { input: "0 0" },
      { input: "0 2147483647" },
      { input: "93 73" },
    ],
  },
];
