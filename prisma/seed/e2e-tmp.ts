// End-to-end judge check: fill real Python solutions into generated starter
// templates and run them against reference-generated test cases via the
// configured execution provider. Exercises tree and list plumbing.
import { buildStarter } from "./starters";
import { dsaTopics } from "./topics";
import { runTestCase } from "../../src/lib/execution";

const find = (slug: string) => {
  for (const t of dsaTopics) {
    const p = t.problems.find((x) => x.slug === slug);
    if (p) return p;
  }
  throw new Error(`problem not found: ${slug}`);
};

const SOLUTIONS: Record<string, { starter: () => string; body: string }> = {
  "invert-binary-tree": {
    starter: () => buildStarter("tree", "tree", "invertTree").python,
    body: `def invertTree(root):
    if not root:
        return None
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`,
  },
  "merge-two-sorted-lists": {
    starter: () => buildStarter("twoLists", "list", "mergeTwoLists").python,
    body: `def mergeTwoLists(l1, l2):
    dummy = ListNode()
    cur = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            cur.next = l1
            l1 = l1.next
        else:
            cur.next = l2
            l2 = l2.next
        cur = cur.next
    cur.next = l1 or l2
    return dummy.next`,
  },
};

async function main() {
  let failures = 0;
  for (const [slug, sol] of Object.entries(SOLUTIONS)) {
    const p = find(slug);
    const template = sol.starter();
    const marker = new RegExp(
      `def \\w+\\([^)]*\\):\\n    # Write your solution here\\n    pass`
    );
    if (!marker.test(template)) throw new Error(`marker not found in ${slug} template`);
    const code = template.replace(marker, sol.body);
    for (const t of p.tests.slice(0, 3)) {
      const expected = p.reference(t.input);
      const outcome = await runTestCase("python", code, {
        input: t.input,
        expectedOutput: expected,
      });
      const mark = outcome.passed ? "✓" : "✗";
      console.log(
        `${mark} ${slug} input=${JSON.stringify(t.input)} expected=${JSON.stringify(expected)} got=${JSON.stringify(outcome.stdout.trim())} status=${outcome.status}`
      );
      if (!outcome.passed) {
        failures++;
        if (outcome.stderr) console.log(`  stderr: ${outcome.stderr.slice(0, 500)}`);
      }
    }
  }
  console.log(failures === 0 ? "\nALL E2E CHECKS PASSED" : `\n${failures} FAILURES`);
  process.exit(failures ? 1 : 0);
}

main();
