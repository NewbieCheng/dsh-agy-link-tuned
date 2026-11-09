// Applies the tuned backend edits to dsh-agy-link/dist/index.js (v0.6.10).
// Run AFTER every plugin upgrade, before restarting DSH:
//   node tools/patch-index.mjs "C:/Users/Administrator/.dsh/profiles/desktop/node_modules/dsh-agy-link/dist/index.js"
import fs from "node:fs";

const target = process.argv[2];
if (!target) {
  console.error("usage: node tools/patch-index.mjs <path-to-dist/index.js>");
  process.exit(1);
}
let src = fs.readFileSync(target, "utf8");
let applied = 0;
const swap = (from, to, label) => {
  if (!src.includes(from)) {
    console.error("SKIP (anchor moved, edit by hand): " + label);
    return;
  }
  src = src.replace(from, to);
  applied++;
};

// 1. default context budget 1M -> 372K
swap(
  "contextWindowDefault: 1048576,",
  "contextWindowDefault: 372000,",
  "default 372000",
);

// 2. allow it via the /config endpoint + numeric guard
swap(
  '"askTool",\n\t\t\t\t\t\t"workspaceRoot",',
  '"askTool",\n\t\t\t\t\t\t"contextWindowDefault",\n\t\t\t\t\t\t"workspaceRoot",',
  "config allowlist"
);
swap(
  'if (key === "warmupModels" && (!Array.isArray(body.value) || !body.value.every((x) => typeof x === "string"))) {',
  'if (key === "contextWindowDefault" && (!Number.isInteger(body.value) || body.value <= 0)) {\n\t\t\t\t\t\tsendJson(res, 400, { error: "contextWindowDefault must be a positive integer (tokens)" });\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\tif (key === "warmupModels" && (!Array.isArray(body.value) || !body.value.every((x) => typeof x === "string"))) {',
  "numeric guard"
);

// 3. expose the current value in /status
swap(
  "defaultEffort: cfg.defaultEffort,\n\t\t\t\t\t\taskTool: cfg.askTool,",
  "defaultEffort: cfg.defaultEffort,\n\t\t\t\t\t\tcontextWindowDefault: cfg.contextWindowDefault,\n\t\t\t\t\t\taskTool: cfg.askTool,",
  "status field"
);

fs.writeFileSync(target, src);
console.log(`patched ${applied}/4 edits -> ${target}`);
if (applied < 4) process.exit(2);
