import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const prob = await p.problem.findFirst({
  orderBy: [{ topic: { order: 'asc' } }, { order: 'asc' }],
  select: {
    slug: true, title: true, starterCode: true,
    testCases: { where: { isSample: true }, take: 1, select: { input: true, expectedOutput: true } },
  },
});
console.log('SLUG=' + prob?.slug);
console.log('TITLE=' + prob?.title);
const sc: any = prob?.starterCode;
console.log('HAS_PY_STARTER=' + !!(sc && sc.python));
console.log('SAMPLE_IN=' + JSON.stringify(prob?.testCases?.[0]?.input));
console.log('SAMPLE_OUT=' + JSON.stringify(prob?.testCases?.[0]?.expectedOutput));
await p.$disconnect();
