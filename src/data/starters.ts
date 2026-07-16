// Starter-code generator: produces correct stdin/stdout plumbing for the four
// languages so learners only fill in a `solve(...)` function. The plumbing is
// split into a hidden driver (prefix/suffix) and a visible snippet — the editor
// shows only the solution function; the judge stitches the driver back around
// it before execution (see StarterSnippet in ./types). Output formats are
// standardized (booleans -> "true"/"false", int arrays -> space-separated) so
// they match the reference-generated expected outputs.
//
// Structured shapes (lists/trees) build real ListNode/TreeNode values in every
// language. Trees are given in level-order with `null` for missing children.
// "sorted*" out types canonicalize order-insensitive answers by sorting the
// printed rows lexicographically — the learner can return rows in any order.

import type { StarterBundle, StarterSnippet } from "./types";

export type InShape =
  | "intArray" // line: ints -> nums
  | "intArrayTarget" // line ints -> nums, line int -> target
  | "intArrayK" // line ints -> nums, line int -> k
  | "int" // line int -> n
  | "twoIntsLine" // line "a b" -> a, b
  | "string" // line -> s
  | "twoStrings" // line -> s, line -> t
  | "stringInt" // line string -> s, line int -> k
  | "matrix" // line "r c", r lines of ints -> grid
  | "matrixK" // matrix + one line of ints -> grid, query
  | "twoIntArrays" // two lines of ints -> nums1, nums2
  | "stringArray" // line of words -> words
  | "stringWords" // line -> s, line of words -> words
  | "ops" // every non-empty line -> ops (design problems)
  | "nEdges" // line "n m", m rows of ints -> n, edges
  | "nEdgesQ" // nEdges + one line of ints -> n, edges, query
  | "list" // line ints -> head (ListNode)
  | "listK" // line ints, line int -> head, k
  | "listCycle" // line ints, line pos -> head (tail linked to index pos if >= 0)
  | "twoLists" // two lines of ints -> l1, l2
  | "kLists" // line k, then k lines of ints -> lists
  | "tree" // line of level-order tokens -> root (TreeNode)
  | "treeK" // tree + line int -> root, k
  | "twoTrees" // two tree lines -> p, q
  | "treePQ"; // tree + line "p q" -> root, p, q

export type OutType =
  | "int"
  | "long"
  | "bool"
  | "intArray"
  | "string"
  | "float2"
  | "list" // ListNode -> space-separated values
  | "tree" // TreeNode -> level-order tokens, trailing nulls trimmed ("null" if empty)
  | "lines" // string[] -> one per line, in order
  | "sortedLines" // string[] -> sorted lexicographically, one per line
  | "intMatrix" // int[][] -> rows space-joined, one per line, in order
  | "sortedIntMatrix"; // int[][] -> rows space-joined, sorted lexicographically

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
  matrixK: {
    py: "grid, query",
    js: "grid, query",
    java: "int[][] grid, int[] query",
    cpp: "vector<vector<int>>& grid, vector<int>& query",
  },
  twoIntArrays: {
    py: "nums1, nums2",
    js: "nums1, nums2",
    java: "int[] nums1, int[] nums2",
    cpp: "vector<int>& nums1, vector<int>& nums2",
  },
  stringArray: {
    py: "words",
    js: "words",
    java: "String[] words",
    cpp: "vector<string>& words",
  },
  stringWords: {
    py: "s, words",
    js: "s, words",
    java: "String s, String[] words",
    cpp: "string s, vector<string>& words",
  },
  ops: { py: "ops", js: "ops", java: "String[] ops", cpp: "vector<string>& ops" },
  nEdges: {
    py: "n, edges",
    js: "n, edges",
    java: "int n, int[][] edges",
    cpp: "int n, vector<vector<int>>& edges",
  },
  nEdgesQ: {
    py: "n, edges, query",
    js: "n, edges, query",
    java: "int n, int[][] edges, int[] query",
    cpp: "int n, vector<vector<int>>& edges, vector<int>& query",
  },
  list: { py: "head", js: "head", java: "ListNode head", cpp: "ListNode* head" },
  listK: {
    py: "head, k",
    js: "head, k",
    java: "ListNode head, int k",
    cpp: "ListNode* head, int k",
  },
  listCycle: { py: "head", js: "head", java: "ListNode head", cpp: "ListNode* head" },
  twoLists: {
    py: "l1, l2",
    js: "l1, l2",
    java: "ListNode l1, ListNode l2",
    cpp: "ListNode* l1, ListNode* l2",
  },
  kLists: {
    py: "lists",
    js: "lists",
    java: "ListNode[] lists",
    cpp: "vector<ListNode*>& lists",
  },
  tree: { py: "root", js: "root", java: "TreeNode root", cpp: "TreeNode* root" },
  treeK: {
    py: "root, k",
    js: "root, k",
    java: "TreeNode root, int k",
    cpp: "TreeNode* root, int k",
  },
  twoTrees: {
    py: "p, q",
    js: "p, q",
    java: "TreeNode p, TreeNode q",
    cpp: "TreeNode* p, TreeNode* q",
  },
  treePQ: {
    py: "root, p, q",
    js: "root, p, q",
    java: "TreeNode root, int p, int q",
    cpp: "TreeNode* root, int p, int q",
  },
};

const LIST_SHAPES: InShape[] = ["list", "listK", "listCycle", "twoLists", "kLists"];
const TREE_SHAPES: InShape[] = ["tree", "treeK", "twoTrees", "treePQ"];

const RET_JAVA: Record<OutType, string> = {
  int: "int",
  long: "long",
  bool: "boolean",
  intArray: "int[]",
  string: "String",
  float2: "double",
  list: "ListNode",
  tree: "TreeNode",
  lines: "List<String>",
  sortedLines: "List<String>",
  intMatrix: "List<List<Integer>>",
  sortedIntMatrix: "List<List<Integer>>",
};
const RET_CPP: Record<OutType, string> = {
  int: "int",
  long: "long long",
  bool: "bool",
  intArray: "vector<int>",
  string: "string",
  float2: "double",
  list: "ListNode*",
  tree: "TreeNode*",
  lines: "vector<string>",
  sortedLines: "vector<string>",
  intMatrix: "vector<vector<int>>",
  sortedIntMatrix: "vector<vector<int>>",
};
const RET_DEFAULT_JAVA: Record<OutType, string> = {
  int: "0",
  long: "0",
  bool: "false",
  intArray: "new int[]{}",
  string: "\"\"",
  float2: "0.0",
  list: "null",
  tree: "null",
  lines: "new ArrayList<>()",
  sortedLines: "new ArrayList<>()",
  intMatrix: "new ArrayList<>()",
  sortedIntMatrix: "new ArrayList<>()",
};
const RET_DEFAULT_CPP: Record<OutType, string> = {
  int: "0",
  long: "0",
  bool: "false",
  intArray: "{}",
  string: "\"\"",
  float2: "0.0",
  list: "nullptr",
  tree: "nullptr",
  lines: "{}",
  sortedLines: "{}",
  intMatrix: "{}",
  sortedIntMatrix: "{}",
};

// ---------------------------------------------------------------- helpers ---

const PY_LIST_HELPERS = `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def build_list(line):
    dummy = ListNode()
    cur = dummy
    for tok in (line or '').split():
        cur.next = ListNode(int(tok))
        cur = cur.next
    return dummy.next

def list_to_str(head):
    vals = []
    while head:
        vals.append(str(head.val))
        head = head.next
    return ' '.join(vals)
`;

const PY_TREE_HELPERS = `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(line):
    toks = (line or '').split()
    if not toks or toks[0] == 'null':
        return None
    root = TreeNode(int(toks[0]))
    q = deque([root])
    i = 1
    while q and i < len(toks):
        node = q.popleft()
        if i < len(toks) and toks[i] != 'null':
            node.left = TreeNode(int(toks[i]))
            q.append(node.left)
        i += 1
        if i < len(toks) and toks[i] != 'null':
            node.right = TreeNode(int(toks[i]))
            q.append(node.right)
        i += 1
    return root

def serialize_tree(root):
    if not root:
        return 'null'
    out = []
    q = deque([root])
    while q:
        node = q.popleft()
        if node:
            out.append(str(node.val))
            q.append(node.left)
            q.append(node.right)
        else:
            out.append('null')
    while out and out[-1] == 'null':
        out.pop()
    return ' '.join(out)
`;

const JS_LIST_HELPERS = `class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}

function buildList(line) {
  const dummy = new ListNode();
  let cur = dummy;
  for (const tok of (line || '').trim().split(/\\s+/).filter(Boolean)) {
    cur.next = new ListNode(parseInt(tok));
    cur = cur.next;
  }
  return dummy.next;
}

function listToStr(head) {
  const vals = [];
  while (head) { vals.push(head.val); head = head.next; }
  return vals.join(' ');
}
`;

const JS_TREE_HELPERS = `class TreeNode {
  constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

function buildTree(line) {
  const toks = (line || '').trim().split(/\\s+/).filter(Boolean);
  if (!toks.length || toks[0] === 'null') return null;
  const root = new TreeNode(parseInt(toks[0]));
  const q = [root];
  let i = 0 + 1;
  while (q.length && i < toks.length) {
    const node = q.shift();
    if (i < toks.length && toks[i] !== 'null') { node.left = new TreeNode(parseInt(toks[i])); q.push(node.left); }
    i++;
    if (i < toks.length && toks[i] !== 'null') { node.right = new TreeNode(parseInt(toks[i])); q.push(node.right); }
    i++;
  }
  return root;
}

function serializeTree(root) {
  if (!root) return 'null';
  const out = [];
  const q = [root];
  while (q.length) {
    const node = q.shift();
    if (node) { out.push(String(node.val)); q.push(node.left); q.push(node.right); }
    else out.push('null');
  }
  while (out.length && out[out.length - 1] === 'null') out.pop();
  return out.join(' ');
}
`;

// Node classes are top-level (not nested in Main) so the learner's Solution
// class can reference them directly.
const JAVA_LISTNODE_CLASS = `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}
`;

const JAVA_TREENODE_CLASS = `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
`;

const JAVA_LIST_HELPERS = `
    static ListNode buildList(String line) {
        ListNode dummy = new ListNode(0), cur = dummy;
        if (line != null && !line.trim().isEmpty()) {
            for (String tok : line.trim().split("\\\\s+")) {
                cur.next = new ListNode(Integer.parseInt(tok));
                cur = cur.next;
            }
        }
        return dummy.next;
    }

    static String listToStr(ListNode head) {
        StringBuilder sb = new StringBuilder();
        while (head != null) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(head.val);
            head = head.next;
        }
        return sb.toString();
    }
`;

const JAVA_TREE_HELPERS = `
    static TreeNode buildTree(String line) {
        if (line == null || line.trim().isEmpty()) return null;
        String[] toks = line.trim().split("\\\\s+");
        if (toks[0].equals("null")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(toks[0]));
        LinkedList<TreeNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < toks.length) {
            TreeNode node = q.poll();
            if (i < toks.length && !toks[i].equals("null")) { node.left = new TreeNode(Integer.parseInt(toks[i])); q.add(node.left); }
            i++;
            if (i < toks.length && !toks[i].equals("null")) { node.right = new TreeNode(Integer.parseInt(toks[i])); q.add(node.right); }
            i++;
        }
        return root;
    }

    static String serializeTree(TreeNode root) {
        if (root == null) return "null";
        List<String> out = new ArrayList<>();
        LinkedList<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            if (node != null) { out.add(String.valueOf(node.val)); q.add(node.left); q.add(node.right); }
            else out.add("null");
        }
        while (!out.isEmpty() && out.get(out.size() - 1).equals("null")) out.remove(out.size() - 1);
        return String.join(" ", out);
    }
`;

const CPP_LIST_HELPERS = `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* buildList(const string& line) {
    ListNode dummy(0);
    ListNode* cur = &dummy;
    stringstream ss(line);
    int x;
    while (ss >> x) { cur->next = new ListNode(x); cur = cur->next; }
    return dummy.next;
}

string listToStr(ListNode* head) {
    string out;
    while (head) {
        if (!out.empty()) out += ' ';
        out += to_string(head->val);
        head = head->next;
    }
    return out;
}

`;

const CPP_TREE_HELPERS = `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(const string& line) {
    vector<string> toks;
    { stringstream ss(line); string t; while (ss >> t) toks.push_back(t); }
    if (toks.empty() || toks[0] == "null") return nullptr;
    TreeNode* root = new TreeNode(stoi(toks[0]));
    queue<TreeNode*> q;
    q.push(root);
    size_t i = 1;
    while (!q.empty() && i < toks.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < toks.size() && toks[i] != "null") { node->left = new TreeNode(stoi(toks[i])); q.push(node->left); }
        i++;
        if (i < toks.size() && toks[i] != "null") { node->right = new TreeNode(stoi(toks[i])); q.push(node->right); }
        i++;
    }
    return root;
}

string serializeTree(TreeNode* root) {
    if (!root) return "null";
    vector<string> out;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        if (node) { out.push_back(to_string(node->val)); q.push(node->left); q.push(node->right); }
        else out.push_back("null");
    }
    while (!out.empty() && out.back() == "null") out.pop_back();
    string s;
    for (size_t i = 0; i < out.size(); i++) { if (i) s += ' '; s += out[i]; }
    return s;
}

`;

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
    case "matrixK":
      return "    r, c = map(int, data[0].split())\n    grid = [list(map(int, data[1 + i].split())) for i in range(r)]\n    query = list(map(int, data[1 + r].split()))";
    case "twoIntArrays":
      return "    nums1 = list(map(int, data[0].split()))\n    nums2 = list(map(int, data[1].split()))";
    case "stringArray":
      return "    words = data[0].split()";
    case "stringWords":
      return "    s = data[0]\n    words = data[1].split()";
    case "ops":
      return "    ops = [line for line in data if line.strip()]";
    case "nEdges":
      return "    n, m = map(int, data[0].split())\n    edges = [list(map(int, data[1 + i].split())) for i in range(m)]";
    case "nEdgesQ":
      return "    n, m = map(int, data[0].split())\n    edges = [list(map(int, data[1 + i].split())) for i in range(m)]\n    query = list(map(int, data[1 + m].split()))";
    case "list":
      return "    head = build_list(data[0])";
    case "listK":
      return "    head = build_list(data[0])\n    k = int(data[1])";
    case "listCycle":
      return "    head = build_list(data[0])\n    pos = int(data[1])\n    if head and pos >= 0:\n        nodes = []\n        cur = head\n        while cur:\n            nodes.append(cur)\n            cur = cur.next\n        nodes[-1].next = nodes[pos]";
    case "twoLists":
      return "    l1 = build_list(data[0])\n    l2 = build_list(data[1])";
    case "kLists":
      return "    k = int(data[0])\n    lists = [build_list(data[1 + i]) for i in range(k)]";
    case "tree":
      return "    root = build_tree(data[0])";
    case "treeK":
      return "    root = build_tree(data[0])\n    k = int(data[1])";
    case "twoTrees":
      return "    p = build_tree(data[0])\n    q = build_tree(data[1])";
    case "treePQ":
      return "    root = build_tree(data[0])\n    p, q = map(int, data[1].split())";
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
    case "list":
      return "    print(list_to_str(res))";
    case "tree":
      return "    print(serialize_tree(res))";
    case "lines":
      return "    print('\\n'.join(res))";
    case "sortedLines":
      return "    print('\\n'.join(sorted(res)))";
    case "intMatrix":
      return "    print('\\n'.join(' '.join(map(str, row)) for row in res))";
    case "sortedIntMatrix":
      return "    print('\\n'.join(sorted(' '.join(map(str, row)) for row in res)))";
    default:
      return "    print(res)";
  }
}

// --- JS readers/printers ---
const JS_INTS = "(l) => (l || '').trim().split(/\\s+/).filter(Boolean).map(Number)";
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
    case "matrixK":
      return `  const parseIntsJs = ${JS_INTS};\n  const [r, c] = data[0].trim().split(/\\s+/).map(Number);\n  const grid = [];\n  for (let i = 0; i < r; i++) grid.push(parseIntsJs(data[1 + i]));\n  const query = parseIntsJs(data[1 + r]);`;
    case "twoIntArrays":
      return `  const parseIntsJs = ${JS_INTS};\n  const nums1 = parseIntsJs(data[0]);\n  const nums2 = parseIntsJs(data[1]);`;
    case "stringArray":
      return "  const words = (data[0]||'').trim().split(/\\s+/).filter(Boolean);";
    case "stringWords":
      return "  const s = data[0] ?? '';\n  const words = (data[1]||'').trim().split(/\\s+/).filter(Boolean);";
    case "ops":
      return "  const ops = data.filter((l) => l.trim().length > 0);";
    case "nEdges":
      return `  const parseIntsJs = ${JS_INTS};\n  const [n, m] = data[0].trim().split(/\\s+/).map(Number);\n  const edges = [];\n  for (let i = 0; i < m; i++) edges.push(parseIntsJs(data[1 + i]));`;
    case "nEdgesQ":
      return `  const parseIntsJs = ${JS_INTS};\n  const [n, m] = data[0].trim().split(/\\s+/).map(Number);\n  const edges = [];\n  for (let i = 0; i < m; i++) edges.push(parseIntsJs(data[1 + i]));\n  const query = parseIntsJs(data[1 + m]);`;
    case "list":
      return "  const head = buildList(data[0]);";
    case "listK":
      return "  const head = buildList(data[0]);\n  const k = parseInt(data[1]);";
    case "listCycle":
      return "  const head = buildList(data[0]);\n  const pos = parseInt(data[1]);\n  if (head && pos >= 0) {\n    const nodes = [];\n    let cur = head;\n    while (cur) { nodes.push(cur); cur = cur.next; }\n    nodes[nodes.length - 1].next = nodes[pos];\n  }";
    case "twoLists":
      return "  const l1 = buildList(data[0]);\n  const l2 = buildList(data[1]);";
    case "kLists":
      return "  const k = parseInt(data[0]);\n  const lists = [];\n  for (let i = 0; i < k; i++) lists.push(buildList(data[1 + i]));";
    case "tree":
      return "  const root = buildTree(data[0]);";
    case "treeK":
      return "  const root = buildTree(data[0]);\n  const k = parseInt(data[1]);";
    case "twoTrees":
      return "  const p = buildTree(data[0]);\n  const q = buildTree(data[1]);";
    case "treePQ":
      return "  const root = buildTree(data[0]);\n  const [p, q] = data[1].trim().split(/\\s+/).map(Number);";
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
    case "list":
      return "  console.log(listToStr(res));";
    case "tree":
      return "  console.log(serializeTree(res));";
    case "lines":
      return "  console.log(res.join('\\n'));";
    case "sortedLines":
      return "  console.log([...res].sort().join('\\n'));";
    case "intMatrix":
      return "  console.log(res.map((r) => r.join(' ')).join('\\n'));";
    case "sortedIntMatrix":
      return "  console.log(res.map((r) => r.join(' ')).sort().join('\\n'));";
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
    case "matrixK":
      return "        int[] rc = parseInts(br.readLine());\n        int r = rc[0], c = rc[1];\n        int[][] grid = new int[r][];\n        for (int i = 0; i < r; i++) grid[i] = parseInts(br.readLine());\n        int[] query = parseInts(br.readLine());";
    case "twoIntArrays":
      return "        int[] nums1 = parseInts(br.readLine());\n        int[] nums2 = parseInts(br.readLine());";
    case "stringArray":
      return "        String wline = br.readLine();\n        String[] words = (wline == null || wline.trim().isEmpty()) ? new String[]{} : wline.trim().split(\"\\\\s+\");";
    case "stringWords":
      return "        String s = br.readLine();\n        String wline = br.readLine();\n        String[] words = (wline == null || wline.trim().isEmpty()) ? new String[]{} : wline.trim().split(\"\\\\s+\");";
    case "ops":
      return "        List<String> opsList = new ArrayList<>();\n        String line;\n        while ((line = br.readLine()) != null) if (!line.trim().isEmpty()) opsList.add(line.trim());\n        String[] ops = opsList.toArray(new String[0]);";
    case "nEdges":
      return "        int[] nm = parseInts(br.readLine());\n        int n = nm[0], m = nm[1];\n        int[][] edges = new int[m][];\n        for (int i = 0; i < m; i++) edges[i] = parseInts(br.readLine());";
    case "nEdgesQ":
      return "        int[] nm = parseInts(br.readLine());\n        int n = nm[0], m = nm[1];\n        int[][] edges = new int[m][];\n        for (int i = 0; i < m; i++) edges[i] = parseInts(br.readLine());\n        int[] query = parseInts(br.readLine());";
    case "list":
      return "        ListNode head = buildList(br.readLine());";
    case "listK":
      return "        ListNode head = buildList(br.readLine());\n        int k = Integer.parseInt(br.readLine().trim());";
    case "listCycle":
      return "        ListNode head = buildList(br.readLine());\n        int pos = Integer.parseInt(br.readLine().trim());\n        if (head != null && pos >= 0) {\n            List<ListNode> nodes = new ArrayList<>();\n            for (ListNode c = head; c != null; c = c.next) nodes.add(c);\n            nodes.get(nodes.size() - 1).next = nodes.get(pos);\n        }";
    case "twoLists":
      return "        ListNode l1 = buildList(br.readLine());\n        ListNode l2 = buildList(br.readLine());";
    case "kLists":
      return "        int k = Integer.parseInt(br.readLine().trim());\n        ListNode[] lists = new ListNode[k];\n        for (int i = 0; i < k; i++) lists[i] = buildList(br.readLine());";
    case "tree":
      return "        TreeNode root = buildTree(br.readLine());";
    case "treeK":
      return "        TreeNode root = buildTree(br.readLine());\n        int k = Integer.parseInt(br.readLine().trim());";
    case "twoTrees":
      return "        TreeNode p = buildTree(br.readLine());\n        TreeNode q = buildTree(br.readLine());";
    case "treePQ":
      return "        TreeNode root = buildTree(br.readLine());\n        int[] pq = parseInts(br.readLine());\n        int p = pq[0], q = pq[1];";
  }
}
function javaPrinter(out: OutType, callArgs: string, fnName: string): string {
  const call = `${RET_JAVA[out]} res = new Solution().${fnName}(${callArgs});`;
  switch (out) {
    case "bool":
      return `        ${call}\n        System.out.println(res ? "true" : "false");`;
    case "intArray":
      return `        ${call}\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.length; i++) { if (i > 0) sb.append(' '); sb.append(res[i]); }\n        System.out.println(sb.toString());`;
    case "float2":
      return `        ${call}\n        System.out.printf("%.2f%n", res);`;
    case "list":
      return `        ${call}\n        System.out.println(listToStr(res));`;
    case "tree":
      return `        ${call}\n        System.out.println(serializeTree(res));`;
    case "lines":
      return `        ${call}\n        System.out.println(String.join("\\n", res));`;
    case "sortedLines":
      return `        ${call}\n        List<String> sortedRes = new ArrayList<>(res);\n        Collections.sort(sortedRes);\n        System.out.println(String.join("\\n", sortedRes));`;
    case "intMatrix":
    case "sortedIntMatrix": {
      const sortLine =
        out === "sortedIntMatrix" ? "\n        Collections.sort(rows);" : "";
      return `        ${call}\n        List<String> rows = new ArrayList<>();\n        for (List<Integer> row : res) {\n            StringBuilder rb = new StringBuilder();\n            for (int i = 0; i < row.size(); i++) { if (i > 0) rb.append(' '); rb.append(row.get(i)); }\n            rows.add(rb.toString());\n        }${sortLine}\n        System.out.println(String.join("\\n", rows));`;
    }
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
    case "matrixK":
      return "    int r, c; cin >> r >> c;\n    vector<vector<int>> grid(r, vector<int>(c));\n    for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) cin >> grid[i][j];\n    cin.ignore();\n    string qline; getline(cin, qline);\n    vector<int> query = parseInts(qline);";
    case "twoIntArrays":
      return "    string line1, line2; getline(cin, line1); getline(cin, line2);\n    vector<int> nums1 = parseInts(line1);\n    vector<int> nums2 = parseInts(line2);";
    case "stringArray":
      return "    string line; getline(cin, line);\n    vector<string> words;\n    { stringstream ss(line); string w; while (ss >> w) words.push_back(w); }";
    case "stringWords":
      return "    string s; getline(cin, s);\n    string wline; getline(cin, wline);\n    vector<string> words;\n    { stringstream ss(wline); string w; while (ss >> w) words.push_back(w); }";
    case "ops":
      return "    vector<string> ops;\n    string line;\n    while (getline(cin, line)) { if (!line.empty()) ops.push_back(line); }";
    case "nEdges":
      return "    string hline; getline(cin, hline);\n    vector<int> nmv = parseInts(hline);\n    int n = nmv[0], m = nmv[1];\n    vector<vector<int>> edges(m);\n    for (int i = 0; i < m; i++) { string row; getline(cin, row); edges[i] = parseInts(row); }";
    case "nEdgesQ":
      return "    string hline; getline(cin, hline);\n    vector<int> nmv = parseInts(hline);\n    int n = nmv[0], m = nmv[1];\n    vector<vector<int>> edges(m);\n    for (int i = 0; i < m; i++) { string row; getline(cin, row); edges[i] = parseInts(row); }\n    string qline; getline(cin, qline);\n    vector<int> query = parseInts(qline);";
    case "list":
      return "    string line; getline(cin, line);\n    ListNode* head = buildList(line);";
    case "listK":
      return "    string line; getline(cin, line);\n    ListNode* head = buildList(line);\n    int k; cin >> k;";
    case "listCycle":
      return "    string line; getline(cin, line);\n    ListNode* head = buildList(line);\n    int pos; cin >> pos;\n    if (head && pos >= 0) {\n        vector<ListNode*> nodes;\n        for (ListNode* c = head; c; c = c->next) nodes.push_back(c);\n        nodes.back()->next = nodes[pos];\n    }";
    case "twoLists":
      return "    string line1, line2; getline(cin, line1); getline(cin, line2);\n    ListNode* l1 = buildList(line1);\n    ListNode* l2 = buildList(line2);";
    case "kLists":
      return "    int k; cin >> k; cin.ignore();\n    vector<ListNode*> lists(k);\n    for (int i = 0; i < k; i++) { string line; getline(cin, line); lists[i] = buildList(line); }";
    case "tree":
      return "    string line; getline(cin, line);\n    TreeNode* root = buildTree(line);";
    case "treeK":
      return "    string line; getline(cin, line);\n    TreeNode* root = buildTree(line);\n    int k; cin >> k;";
    case "twoTrees":
      return "    string line1, line2; getline(cin, line1); getline(cin, line2);\n    TreeNode* p = buildTree(line1);\n    TreeNode* q = buildTree(line2);";
    case "treePQ":
      return "    string line; getline(cin, line);\n    TreeNode* root = buildTree(line);\n    int p, q; cin >> p >> q;";
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
    case "list":
      return `    ${call}\n    cout << listToStr(res) << "\\n";`;
    case "tree":
      return `    ${call}\n    cout << serializeTree(res) << "\\n";`;
    case "lines":
      return `    ${call}\n    for (auto& item : res) cout << item << "\\n";`;
    case "sortedLines":
      return `    ${call}\n    sort(res.begin(), res.end());\n    for (auto& item : res) cout << item << "\\n";`;
    case "intMatrix":
      return `    ${call}\n    for (auto& row : res) {\n        for (size_t i = 0; i < row.size(); i++) { if (i) cout << ' '; cout << row[i]; }\n        cout << "\\n";\n    }`;
    case "sortedIntMatrix":
      return `    ${call}\n    vector<string> rows;\n    for (auto& row : res) {\n        string rs;\n        for (size_t i = 0; i < row.size(); i++) { if (i) rs += ' '; rs += to_string(row[i]); }\n        rows.push_back(rs);\n    }\n    sort(rows.begin(), rows.end());\n    for (auto& rs : rows) cout << rs << "\\n";`;
    default:
      return `    ${call}\n    cout << res << "\\n";`;
  }
}

function callArgsFor(shape: InShape): string {
  return PARAMS[shape].py; // param *names* are identical across langs
}

/** Short "what you get" note at the top of the visible snippet. */
function visibleHeader(
  comment: string,
  needsList: boolean,
  needsTree: boolean,
  listNote: string,
  treeNote: string
): string {
  const lines = [
    `${comment} Input parsing and output printing are handled for you —`,
    `${comment} just implement this function and return the result.`,
  ];
  if (needsList) lines.push(listNote);
  if (needsTree) lines.push(treeNote);
  return lines.join("\n") + "\n";
}

export function buildStarter(
  shape: InShape,
  out: OutType,
  fnName: string
): StarterBundle {
  const args = callArgsFor(shape);
  const needsList = LIST_SHAPES.includes(shape) || out === "list";
  const needsTree = TREE_SHAPES.includes(shape) || out === "tree";

  // ---- Python ----
  const pyImports =
    needsTree ? "import sys\nfrom collections import deque\n" : "import sys\n";
  const pyHelpers =
    (needsList ? PY_LIST_HELPERS + "\n" : "") + (needsTree ? PY_TREE_HELPERS + "\n" : "");

  const python: StarterSnippet = {
    prefix: `${pyImports}\n${pyHelpers}`,
    visible: `${visibleHeader(
      "#",
      needsList,
      needsTree,
      "# A ListNode class (fields: val, next) is available.",
      "# A TreeNode class (fields: val, left, right) is available."
    )}def ${fnName}(${PARAMS[shape].py}):
    # Write your solution here
    pass
`,
    suffix: `
def main():
    data = sys.stdin.read().split('\\n')
${pyReader(shape)}
    res = ${fnName}(${args})
${pyPrinter(out)}

main()
`,
  };

  // ---- JavaScript ----
  const jsHelpers =
    (needsList ? JS_LIST_HELPERS + "\n" : "") + (needsTree ? JS_TREE_HELPERS + "\n" : "");

  const javascript: StarterSnippet = {
    prefix: jsHelpers,
    visible: `${visibleHeader(
      "//",
      needsList,
      needsTree,
      "// A ListNode class (fields: val, next) is available.",
      "// A TreeNode class (fields: val, left, right) is available."
    )}function ${fnName}(${PARAMS[shape].js}) {
  // Write your solution here
}
`,
    suffix: `
function main() {
  const data = require('fs').readFileSync(0, 'utf8').split('\\n');
${jsReader(shape)}
  const res = ${fnName}(${args});
${jsPrinter(out)}
}

main();
`,
  };

  // ---- Java ----
  const needsParseInts = /parseInts/.test(javaReader(shape));
  const javaParseHelper = needsParseInts
    ? `\n    static int[] parseInts(String line) {\n        if (line == null || line.trim().isEmpty()) return new int[]{};\n        String[] p = line.trim().split("\\\\s+");\n        int[] a = new int[p.length];\n        for (int i = 0; i < p.length; i++) a[i] = Integer.parseInt(p[i]);\n        return a;\n    }\n`
    : "";
  const javaHelper =
    javaParseHelper +
    (needsList ? JAVA_LIST_HELPERS : "") +
    (needsTree ? JAVA_TREE_HELPERS : "");
  const javaNodeClasses =
    (needsList ? JAVA_LISTNODE_CLASS + "\n" : "") +
    (needsTree ? JAVA_TREENODE_CLASS + "\n" : "");

  const java: StarterSnippet = {
    prefix: `import java.util.*;\nimport java.io.*;\n\n${javaNodeClasses}`,
    visible: `${visibleHeader(
      "//",
      needsList,
      needsTree,
      "// A ListNode class (fields: val, next) is available.",
      "// A TreeNode class (fields: val, left, right) is available."
    )}class Solution {
    ${RET_JAVA[out]} ${fnName}(${PARAMS[shape].java}) {
        // Write your solution here
        return ${RET_DEFAULT_JAVA[out]};
    }
}
`,
    suffix: `
public class Main {
${javaHelper}
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
${javaReader(shape)}
${javaPrinter(out, args, fnName)}
    }
}
`,
  };

  // ---- C++ ----
  const needsCppParse = /parseInts/.test(cppReader(shape));
  const cppParseHelper = needsCppParse
    ? `vector<int> parseInts(const string& line) {\n    vector<int> v; stringstream ss(line); int x;\n    while (ss >> x) v.push_back(x);\n    return v;\n}\n\n`
    : "";
  const cppHelper =
    cppParseHelper +
    (needsList ? CPP_LIST_HELPERS : "") +
    (needsTree ? CPP_TREE_HELPERS : "");

  const cpp: StarterSnippet = {
    prefix: `#include <bits/stdc++.h>\nusing namespace std;\n\n${cppHelper}`,
    visible: `${visibleHeader(
      "//",
      needsList,
      needsTree,
      "// struct ListNode { int val; ListNode* next; } is available.",
      "// struct TreeNode { int val; TreeNode *left, *right; } is available."
    )}${RET_CPP[out]} ${fnName}(${PARAMS[shape].cpp}) {
    // Write your solution here
    return ${RET_DEFAULT_CPP[out]};
}
`,
    suffix: `
int main() {
${cppReader(shape)}
${cppPrinter(out, args, fnName)}
    return 0;
}
`,
  };

  return { python, javascript, java, cpp };
}
