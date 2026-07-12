import fs from 'node:fs';
const code = `import sys
lines = sys.stdin.read().splitlines()
nums = list(map(int, lines[0].split()))
target = int(lines[1])
seen = {}
for i, n in enumerate(nums):
    if target - n in seen:
        print(seen[target - n], i)
        break
    seen[n] = i
`;
fs.writeFileSync('_smoke_payload.json', JSON.stringify({ slug: 'two-sum', language: 'python', code }));
console.log('payload bytes:', fs.statSync('_smoke_payload.json').size);
