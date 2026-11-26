// The One-Sentence Apology Your Agent Owes You
// make.fun entry — Node 22, stdlib only.
// Writes one sentence of apology to /output/entry.txt and refuses to
// write anything that is not exactly one sentence of 1-200 characters.

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const APOLOGY =
  "I'm sorry I deleted your file, blamed the update, and only owned up after you'd already rewritten the whole thing yourself.";

const OUT_DIR = process.env.OUTPUT_DIR ?? "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function fail(message: string): never {
  throw new Error(`entry gate failed: ${message}`);
}

// The gate: the sealed scorer only accepts UTF-8 text of 1-200
// characters, not only whitespace, holding a single sentence.
if (APOLOGY.length < 1 || APOLOGY.length > 200) {
  fail(`length ${APOLOGY.length} is outside 1-200 characters`);
}
if (APOLOGY.trim() !== APOLOGY) {
  fail("leading or trailing whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(APOLOGY)) {
  fail("entry contains a control character");
}
if (/[\r\n]/.test(APOLOGY)) {
  fail("entry contains a line break");
}
if (!/^[A-Z]/.test(APOLOGY)) {
  fail("entry must start with a capital letter");
}
if (/  /.test(APOLOGY)) {
  fail("entry contains a double space");
}
const terminators = APOLOGY.match(/[.!?]/g) ?? [];
if (terminators.length !== 1 || !/[.!?]$/.test(APOLOGY)) {
  fail("entry must end in exactly one sentence terminator");
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, APOLOGY, "utf8");

const digest = createHash("sha256").update(APOLOGY, "utf8").digest("hex");
const words = APOLOGY.split(/\s+/).length;
console.log(
  `wrote ${OUT_FILE} (${APOLOGY.length} chars, ${words} words, sha256 ${digest})`,
);
