#!/usr/bin/env node
/*
<!-- BEGIN RBP GENERATED: progress-ledger-audit-v1-0 -->
Preflight: progress-ledger-audit-v1-0
- Validates docs/progress/progress.log and docs/progress/progress.json are present and mutually consistent.
- Validates schema per entry and sentinel presence in repo.
- Reports duplicates, date anomalies, and optional gaps vs SNAPSHOT.json.
- Report-only; no mutations.
<!-- END RBP GENERATED: progress-ledger-audit-v1-0 -->
*/

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LOG_PATH = path.join(ROOT, 'docs/progress/progress.log');
const JSON_PATH = path.join(ROOT, 'docs/progress/progress.json');
const SNAPSHOT_PATH = path.join(ROOT, 'docs/progress/SNAPSHOT.json');

function fail(msg, details = []) {
  console.error('Progress ledger audit FAIL');
  console.error(msg);
  for (const d of details) console.error('-', d);
  process.exit(1);
}

function readText(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch (e) { return null; }
}

function parseLogEntries(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  for (const line of lines) {
    const i = line.indexOf('RBP_PROGRESS:');
    if (i === -1) continue;
    const raw = line.slice(i + 'RBP_PROGRESS:'.length).trim();
    if (!raw) continue;
    let s = raw;
    // tolerate trailing commas at end of object
    s = s.replace(/,\s*}$/,'}');
    try {
      const obj = JSON.parse(s);
      out.push(obj);
    } catch (e) {
      throw new Error(`progress.log has unparsable JSON at line: ${line.slice(0,200)}`);
    }
  }
  return out;
}

function parseJsonArray(text) {
  try {
    const arr = JSON.parse(text);
    if (!Array.isArray(arr)) throw new Error('progress.json is not an array');
    return arr;
  } catch (e) {
    throw new Error('progress.json is not valid JSON: ' + e.message);
  }
}

const CHANGE_TYPES = new Set(['ADD','MODIFY','BREAKING']);
const TEST_STATES = new Set(['PASS','FAIL','N/A']);
const PREFLIGHT_STATES = new Set(['PASS','FAIL','N/A']);

function isIsoDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(String(s)); }

function validateEntry(e, where) {
  const errs = [];
  if (!isIsoDate(e.date)) errs.push(`${where}: invalid date ${e.date}`);
  if (!e.feature || typeof e.feature !== 'string') errs.push(`${where}: feature missing`);
  if (!CHANGE_TYPES.has(e.change)) errs.push(`${where}: change must be one of ${Array.from(CHANGE_TYPES).join(',')}`);
  if (!e.sentinel || typeof e.sentinel !== 'string') errs.push(`${where}: sentinel missing`);
  if (!Array.isArray(e.apps) || e.apps.length < 1) errs.push(`${where}: apps must be non-empty array`);
  if (!Array.isArray(e.files)) errs.push(`${where}: files must be array`);
  if (!TEST_STATES.has(e.tests)) errs.push(`${where}: tests must be one of ${Array.from(TEST_STATES).join(',')}`);
  if (!PREFLIGHT_STATES.has(e.preflight)) errs.push(`${where}: preflight must be one of ${Array.from(PREFLIGHT_STATES).join(',')}`);
  if (typeof e.notes !== 'string') errs.push(`${where}: notes must be string`);
  if (typeof e.notes === 'string' && e.notes.length > 120) errs.push(`${where}: notes exceeds 120 chars`);
  return errs;
}

function listFiles(dir) {
  const out = [];
  const skip = new Set(['node_modules','.git','dist','build','coverage','.next','.turbo']);
  function walk(d) {
    const ents = fs.readdirSync(d, { withFileTypes: true });
    for (const ent of ents) {
      if (skip.has(ent.name)) continue;
      const fp = path.join(d, ent.name);
      if (ent.isDirectory()) walk(fp);
      else out.push(fp);
    }
  }
  walk(dir);
  return out;
}

function grepSentinel(sentinel) {
  const needle = `<!-- BEGIN RBP GENERATED: ${sentinel} -->`;
  const files = listFiles(ROOT);
  let hits = 0;
  for (const f of files) {
    try {
      const size = fs.statSync(f).size;
      if (size > 2_000_000) continue; // skip huge files
      const txt = fs.readFileSync(f, 'utf8');
      if (txt.includes(needle)) hits++;
    } catch {}
  }
  return hits;
}

(function main(){
  const issues = [];
  const logText = readText(LOG_PATH);
  const jsonText = readText(JSON_PATH);
  if (!logText) fail(`Missing ${LOG_PATH}`);
  if (!jsonText) fail(`Missing ${JSON_PATH}`);

  let logEntries, jsonEntries;
  try { logEntries = parseLogEntries(logText); } catch(e){ fail(e.message); }
  try { jsonEntries = parseJsonArray(jsonText); } catch(e){ fail(e.message); }

  // Schema validation
  for (const [i,e] of logEntries.entries()) {
    const errs = validateEntry(e, `progress.log#${i}`);
    if (errs.length) issues.push(...errs);
  }
  for (const [i,e] of jsonEntries.entries()) {
    const errs = validateEntry(e, `progress.json#${i}`);
    if (errs.length) issues.push(...errs);
  }

  // Build sentinel sets
  const logMap = new Map(logEntries.map(e=>[e.sentinel, e]));
  const jsonMap = new Map(jsonEntries.map(e=>[e.sentinel, e]));

  // Duplicates
  if (logEntries.length !== logMap.size) issues.push('progress.log has duplicate sentinels');
  if (jsonEntries.length !== jsonMap.size) issues.push('progress.json has duplicate sentinels');

  // Set consistency
  for (const s of logMap.keys()) if (!jsonMap.has(s)) issues.push(`Missing in progress.json: ${s}`);
  for (const s of jsonMap.keys()) if (!logMap.has(s)) issues.push(`Missing in progress.log: ${s}`);

  // Date monotonicity (warn only)
  function checkDateOrder(arr, label){
    const dates = arr.map(e=>e.date);
    for (let i=1;i<dates.length;i++) {
      if (dates[i] < dates[i-1]) {
        console.warn(`WARN: ${label} date anomaly at index ${i}: ${dates[i-1]} -> ${dates[i]}`);
        break;
      }
    }
  }
  checkDateOrder(logEntries, 'progress.log');
  checkDateOrder(jsonEntries, 'progress.json');

  // Sentinel presence in repo
  for (const s of new Set([...logMap.keys(), ...jsonMap.keys()])) {
    const hits = grepSentinel(s);
    if (hits <= 0) issues.push(`Sentinel not found in repo: ${s}`);
  }

  // Optional SNAPSHOT cross-check
  const snapText = readText(SNAPSHOT_PATH);
  if (snapText) {
    try {
      const snap = JSON.parse(snapText);
      let snapSet = new Set();
      for (const key of ['features','entries','sentinels']) {
        const arr = snap[key];
        if (Array.isArray(arr)) {
          for (const v of arr) if (typeof v === 'string' && /-v\d-\d$/.test(v)) snapSet.add(v);
        }
      }
      if (snapSet.size) {
        const ledgerSet = new Set([...logMap.keys()]);
        const gaps = [];
        for (const s of snapSet) if (!ledgerSet.has(s)) gaps.push(s);
        if (gaps.length) console.warn('WARN: SNAPSHOT features missing in ledger:', gaps.join(', '));
      }
    } catch(_) {
      // ignore
    }
  }

  if (issues.length) fail('Issues found:', issues);

  const count = logMap.size;
  const okLine = `Progress ledger audit OK: ${count} entries, ${count} sentinels, files consistent`;
  console.log(okLine);
})();
