// Starter-code generator: produces correct stdin/stdout plumbing for the four
// languages so learners only fill in a `solve(...)` function. Output formats are
// standardized (booleans -> "true"/"false", int arrays -> space-separated) so
// they match the reference-generated expected outputs.

export type InShape =
  | "intArray" // line: ints -> nums
  | "intArrayTarget" // line ints -> nums, line int -> target
  | "intArrayK" // line ints -> nums, line int -> k
  | "int" // line int -> n
  | "twoIntsLine" // line "a b" -> a, b
  | "string" // line -> s
  | "twoStrings" // line -> s, line -> t
  | "stringInt" // line string -> s, line int -> k
  | "matrix"; // line "r c", r lines of ints -> grid

export type OutType = "int" | "long" | "bool" | "intArray" | "string" | "float2";

type Params = { py: string; js: string; java: string; cpp: string };

const PARAMS: Record<InShape, Params> = {
  intArray: { py: "nums", js: "nums", java: "int[] nums", cpp: "vector<int>& nums" },
  intArrayTarget: {
    py: "nums, target",
    js: "nums, target",
    java: "int[] nums, int target",
    cpp: "vector<int>& nums, int target",
  },
  intArrayK: {
    py: "nums, k",
    js: "nums, k",
    java: "int[] nums, int k",
    cpp: "vector<int>& nums, int k",
  },
  int: { py: "n", js: "n", java: "int n", cpp: "int n" },
  twoIntsLine: { py: "a, b", js: "a, b", java: "int a, int b", cpp: "int a, int b" },
  string: { py: "s", js: "s", java: "String s", cpp: "string s" },
  twoStrings: {
    py: "s, t",
    js: "s, t",
    java: "String s, String t",
    cpp: "string s, string t",
  },
  stringInt: {
    py: "s, k",
    js: "s, k",
    java: "String s, int k",
    cpp: "string s, int k",
  },
  matrix: {
    py: "grid",
    js: "grid",
    java: "int[][] grid",
    cpp: "vector<vector<int>>& grid",
  },
};

const RET_JAVA: Record<OutType, string> = {
  int: "int",
  long: "long",
  bool: "boolean",
  intArray: "int[]",
  string: "String",
  float2: "double",
};
const RET_CPP: Record<OutType, string> = {
  int: "int",
  long: "long long",
  bool: "bool",
  intArray: "vector<int>",
  string: "string",
  float2: "double",
};
const RET_DEFAULT_JAVA: Record<OutType, string> = {
  int: "0",
  long: "0",
  bool: "false",
  intArray: "new int[]{}",
  string: "\"\"",
  float2: "0.0",
};
const RET_DEFAULT_CPP: Record<OutType, string> = {
  int: "0",
  long: "0",
  bool: "false",
  intArray: "{}",
  string: "\"\"",
  float2: "0.0",
};

// --- Python readers/printers ---
function pyReader(shape: InShape): string {
  switch (shape) {
    case "intArray":
      return "    nums = list(map(int, data[0].split()))";
    case "intArrayTarget":
      return "    nums = list(map(int, data[0].split()))\n    target = int(data[1])";
    case "intArrayK":
      return "    nums = list(map(int, data[0].split()))\n    k = int(data[1])";
    case "int":
      return "    n = int(data[0])";
    case "twoIntsLine":
      return "    a, b = map(int, data[0].split())";
    case "string":
      return "    s = data[0]";
    case "twoStrings":
      return "    s = data[0]\n    t = data[1]";
    case "stringInt":
      return "    s = data[0]\n    k = int(data[1])";
    case "matrix":
      return "    r, c = map(int, data[0].split())\n    grid = [list(map(int, data[1 + i].split())) for i in range(r)]";
  }
}
function pyPrinter(out: OutType): string {
  switch (out) {
    case "bool":
      return "    print('true' if res else 'false')";
    case "intArray":
      return "    print(' '.join(map(str, res)))";
    case "float2":
      return "    print(f'{res:.2f}')";
    default:
      return "    print(res)";
  }
}

// --- JS readers/printers ---
function jsReader(shape: InShape): string {
  switch (shape) {
    case "intArray":
      return "  const nums = (data[0]||'').trim().split(/\\s+/).filter(Boolean).map(Number);";
    case "intArrayTarget":
      return "  const nums = (data[0]||'').trim().split(/\\s+/).filter(Boolean).map(Number);\n  const target = parseInt(data[1]);";
    case "intArrayK":
      return "  const nums = (data[0]||'').trim().split(/\\s+/).filter(Boolean).map(Number);\n  const k = parseInt(data[1]);";
    case "int":
      return "  const n = parseInt(data[0]);";
    case "twoIntsLine":
      return "  const [a, b] = data[0].trim().split(/\\s+/).map(Number);";
    case "string":
      return "  const s = data[0] ?? '';";
    case "twoStrings":
      return "  const s = data[0] ?? '';\n  const t = data[1] ?? '';";
    case "stringInt":
      return "  const s = data[0] ?? '';\n  const k = parseInt(data[1]);";
    case "matrix":
      return "  const [r, c] = data[0].trim().split(/\\s+/).map(Number);\n  const grid = [];\n  for (let i = 0; i < r; i++) grid.push(data[1 + i].trim().split(/\\s+/).map(Number));";
  }
}
function jsPrinter(out: OutType): string {
  switch (out) {
    case "bool":
      return "  console.log(res ? 'true' : 'false');";
    case "intArray":
      return "  console.log(res.join(' '));";
    case "float2":
      return "  console.log(Number(res).toFixed(2));";
    default:
      return "  console.log(res);";
  }
}

// --- Java readers/printers ---
function javaReader(shape: InShape): string {
  switch (shape) {
    case "intArray":
      return "        int[] nums = parseInts(br.readLine());";
    case "intArrayTarget":
      return "        int[] nums = parseInts(br.readLine());\n        int target = Integer.parseInt(br.readLine().trim());";
    case "intArrayK":
      return "        int[] nums = parseInts(br.readLine());\n        int k = Integer.parseInt(br.readLine().trim());";
    case "int":
      return "        int n = Integer.parseInt(br.readLine().trim());";
    case "twoIntsLine":
      return "        int[] ab = parseInts(br.readLine());\n        int a = ab[0], b = ab[1];";
    case "string":
      return "        String s = br.readLine();";
    case "twoStrings":
      return "        String s = br.readLine();\n        String t = br.readLine();";
    case "stringInt":
      return "        String s = br.readLine();\n        int k = Integer.parseInt(br.readLine().trim());";
    case "matrix":
      return "        int[] rc = parseInts(br.readLine());\n        int r = rc[0], c = rc[1];\n        int[][] grid = new int[r][];\n        for (int i = 0; i < r; i++) grid[i] = parseInts(br.readLine());";
  }
}
function javaPrinter(out: OutType, callArgs: string, fnName: string): string {
  const call = `${RET_JAVA[out]} res = ${fnName}(${callArgs});`;
  switch (out) {
    case "bool":
      return `        ${call}\n        System.out.println(res ? "true" : "false");`;
    case "intArray":
      return `        ${call}\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.length; i++) { if (i > 0) sb.append(' '); sb.append(res[i]); }\n        System.out.println(sb.toString());`;
    case "float2":
      return `        ${call}\n        System.out.printf("%.2f%n", res);`;
    default:
      return `        ${call}\n        System.out.println(res);`;
  }
}

// --- C++ readers/printers ---
function cppReader(shape: InShape): string {
  switch (shape) {
    case "intArray":
      return "    string line; getline(cin, line);\n    vector<int> nums = parseInts(line);";
    case "intArrayTarget":
      return "    string line; getline(cin, line);\n    vector<int> nums = parseInts(line);\n    int target; cin >> target;";
    case "intArrayK":
      return "    string line; getline(cin, line);\n    vector<int> nums = parseInts(line);\n    int k; cin >> k;";
    case "int":
      return "    int n; cin >> n;";
    case "twoIntsLine":
      return "    int a, b; cin >> a >> b;";
    case "string":
      return "    string s; getline(cin, s);";
    case "twoStrings":
      return "    string s, t; getline(cin, s); getline(cin, t);";
    case "stringInt":
      return "    string s; getline(cin, s);\n    int k; cin >> k;";
    case "matrix":
      return "    int r, c; cin >> r >> c;\n    vector<vector<int>> grid(r, vector<int>(c));\n    for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) cin >> grid[i][j];";
  }
}
function cppPrinter(out: OutType, callArgs: string, fnName: string): string {
  const call = `auto res = ${fnName}(${callArgs});`;
  switch (out) {
    case "bool":
      return `    ${call}\n    cout << (res ? "true" : "false") << "\\n";`;
    case "intArray":
      return `    ${call}\n    for (size_t i = 0; i < res.size(); i++) { if (i) cout << ' '; cout << res[i]; }\n    cout << "\\n";`;
    case "float2":
      return `    ${call}\n    cout << fixed << setprecision(2) << res << "\\n";`;
    default:
      return `    ${call}\n    cout << res << "\\n";`;
  }
}

function callArgsFor(shape: InShape): string {
  return PARAMS[shape].py; // param *names* are identical across langs
}

export function buildStarter(
  shape: InShape,
  out: OutType,
  fnName: string
): { python: string; javascript: string; java: string; cpp: string } {
  const args = callArgsFor(shape);

  const python = `import sys

def ${fnName}(${PARAMS[shape].py}):
    # Write your solution here
    pass

def main():
    data = sys.stdin.read().split('\\n')
${pyReader(shape)}
    res = ${fnName}(${args})
${pyPrinter(out)}

main()
`;

  const javascript = `function ${fnName}(${PARAMS[shape].js}) {
  // Write your solution here
}

function main() {
  const data = require('fs').readFileSync(0, 'utf8').split('\\n');
${jsReader(shape)}
  const res = ${fnName}(${args});
${jsPrinter(out)}
}

main();
`;

  const needsParseInts = /parseInts/.test(javaReader(shape));
  const javaHelper = needsParseInts
    ? `\n    static int[] parseInts(String line) {\n        if (line == null || line.trim().isEmpty()) return new int[]{};\n        String[] p = line.trim().split("\\\\s+");\n        int[] a = new int[p.length];\n        for (int i = 0; i < p.length; i++) a[i] = Integer.parseInt(p[i]);\n        return a;\n    }\n`
    : "";

  const java = `import java.util.*;
import java.io.*;

public class Main {
    static ${RET_JAVA[out]} ${fnName}(${PARAMS[shape].java}) {
        // Write your solution here
        return ${RET_DEFAULT_JAVA[out]};
    }
${javaHelper}
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
${javaReader(shape)}
${javaPrinter(out, args, fnName)}
    }
}
`;

  const needsCppParse = /parseInts/.test(cppReader(shape));
  const cppHelper = needsCppParse
    ? `vector<int> parseInts(const string& line) {\n    vector<int> v; stringstream ss(line); int x;\n    while (ss >> x) v.push_back(x);\n    return v;\n}\n\n`
    : "";

  const cpp = `#include <bits/stdc++.h>
using namespace std;

${cppHelper}${RET_CPP[out]} ${fnName}(${PARAMS[shape].cpp}) {
    // Write your solution here
    return ${RET_DEFAULT_CPP[out]};
}

int main() {
${cppReader(shape)}
${cppPrinter(out, args, fnName)}
    return 0;
}
`;

  return { python, javascript, java, cpp };
}
