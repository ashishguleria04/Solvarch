// TEMP: validates that generated JS starter plumbing + a correct solution body
// produce outputs matching each problem's reference. Covers every (shape,out)
// combo in use. Run: npx tsx prisma/seed/_validate.ts
import { execFileSync } from "child_process";
import { writeFileSync, mkdtempSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { dsaTopics } from "./topics";

// Correct param-based solution bodies for one problem per (shape,out) combo.
const solutions: Record<string, string> = {
  "two-sum":
    "const seen=new Map();for(let i=0;i<nums.length;i++){const need=target-nums[i];if(seen.has(need))return [seen.get(need),i];seen.set(nums[i],i);}return [];",
  "maximum-subarray":
    "let best=nums[0],cur=nums[0];for(let i=1;i<nums.length;i++){cur=Math.max(nums[i],cur+nums[i]);best=Math.max(best,cur);}return best;",
  "contains-duplicate": "return new Set(nums).size!==nums.length;",
  "product-of-array-except-self":
    "const n=nums.length,res=new Array(n).fill(1);let pre=1;for(let i=0;i<n;i++){res[i]=pre;pre*=nums[i];}let post=1;for(let i=n-1;i>=0;i--){res[i]*=post;post*=nums[i];}return res;",
  "valid-anagram":
    "if(s.length!==t.length)return false;const c={};for(const ch of s)c[ch]=(c[ch]||0)+1;for(const ch of t){if(!c[ch])return false;c[ch]--;}return true;",
  "valid-parentheses":
    "const st=[],m={')':'(',']':'[','}':'{'};for(const ch of s){if(ch==='('||ch==='['||ch==='{')st.push(ch);else if(st.pop()!==m[ch])return false;}return st.length===0;",
  "longest-substring-without-repeating-characters":
    "const last=new Map();let start=0,best=0;for(let i=0;i<s.length;i++){const ch=s[i];if(last.has(ch)&&last.get(ch)>=start)start=last.get(ch)+1;last.set(ch,i);best=Math.max(best,i-start+1);}return best;",
  "longest-palindromic-substring":
    "if(s.length<1)return '';let a=0,b=0;const ex=(l,r)=>{while(l>=0&&r<s.length&&s[l]===s[r]){l--;r++;}return [l+1,r-1];};for(let i=0;i<s.length;i++){for(const [l,r] of [ex(i,i),ex(i,i+1)]){if(r-l>b-a){a=l;b=r;}}}return s.slice(a,b+1);",
};

const dir = mkdtempSync(join(tmpdir(), "solvarch-val-"));
let fail = 0;
let ran = 0;

for (const topic of dsaTopics) {
  for (const p of topic.problems) {
    const body = solutions[p.slug];
    if (!body) continue;
    const src = p.starterCode.javascript.replace(
      "  // Write your solution here",
      "  " + body
    );
    const file = join(dir, `${p.slug}.js`);
    writeFileSync(file, src);

    for (const t of p.tests) {
      ran++;
      const expected = p.reference(t.input);
      let got = "";
      try {
        got = execFileSync("node", [file], { input: t.input, encoding: "utf8" });
      } catch (e: unknown) {
        console.log(`✗ ${p.slug} RUNTIME ERROR on input ${JSON.stringify(t.input)}`);
        fail++;
        continue;
      }
      const norm = (s: string) => s.replace(/\r\n/g, "\n").replace(/\n+$/g, "").trimEnd();
      if (norm(got) !== norm(expected)) {
        console.log(
          `✗ ${p.slug}: input=${JSON.stringify(t.input)} expected=${JSON.stringify(
            norm(expected)
          )} got=${JSON.stringify(norm(got))}`
        );
        fail++;
      }
    }
  }
}

console.log(
  `\n${fail === 0 ? "✅" : "❌"} validated ${ran} runs across ${
    Object.keys(solutions).length
  } problems — ${fail} failures`
);
process.exit(fail === 0 ? 0 : 1);
