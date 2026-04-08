#!/usr/bin/env node
/**
 * Git status for cases directory
 * Saves git status of src/content/cases/ to src/data/git-status.json
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CASES_DIR = './src/content/cases';
const OUTPUT_FILE = './src/data/git-status.json';

// Ensure src/data directory exists
const dataDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function getStatusLabel(statusCode) {
  const statusMap = {
    '??': { label: '未追跡', icon: '🆕', type: 'untracked' },
    ' M': { label: '変更済み', icon: '✏️', type: 'modified' },
    'M ': { label: 'ステージング済み', icon: '➕', type: 'staged' },
    'A ': { label: '追加済み', icon: '📌', type: 'added' },
    ' D': { label: '削除済み', icon: '🗑️', type: 'deleted' },
    'D ': { label: '削除予定', icon: '🗑️', type: 'deleted' },
    'R ': { label: '名前変更', icon: '📝', type: 'renamed' },
    'MM': { label: '変更+ステージング', icon: '🔀', type: 'modified' },
    'AM': { label: '追加+変更', icon: '🔀', type: 'modified' },
  };
  return statusMap[statusCode] || { label: `不明(${statusCode})`, icon: '❓', type: 'unknown' };
}

try {
  // Get git status
  let gitOutput;
  try {
    gitOutput = execSync('git status --porcelain src/content/cases/', {
      encoding: 'utf-8',
      cwd: process.cwd()
    });
  } catch (gitError) {
    console.warn('Git command failed:', gitError.message);
    // Fallback: scan all files in directory
    const allFiles = fs.readdirSync(CASES_DIR).filter(f => f.endsWith('.md'));
    gitOutput = allFiles.map(f => `?? ${CASES_DIR}/${f}`).join('\n');
  }

  const files = [];
  const lines = gitOutput.split('\n').filter(line => line.trim().length > 0);

  for (const line of lines) {
    const statusCode = line.substring(0, 2);
    const filePath = line.substring(3).trim();
    const filename = path.basename(filePath);

    if (!filename.endsWith('.md')) continue;

    // Get file stats
    const fullPath = path.join(CASES_DIR, filename);
    let stats;
    try {
      stats = fs.statSync(fullPath);
    } catch (e) {
      console.warn(`Cannot stat ${filename}:`, e.message);
      continue;
    }

    // Parse frontmatter
    let frontmatter = {};
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const { data } = matter(content);
      frontmatter = data;
    } catch (e) {
      console.warn(`Cannot parse frontmatter for ${filename}:`, e.message);
    }

    const statusInfo = getStatusLabel(statusCode);

    files.push({
      filename,
      status: statusCode,
      statusLabel: statusInfo.label,
      statusIcon: statusInfo.icon,
      statusType: statusInfo.type,
      birthtime: stats.birthtime.toISOString(),
      mtime: stats.mtime.toISOString(),
      frontmatter: {
        title: frontmatter.title || '(タイトルなし)',
        industry: frontmatter.industry || '-',
        domain: frontmatter.domain || '-',
        company_size: frontmatter.company_size || '-',
        tech_tags: frontmatter.tech_tags || [],
        source_url_verified: frontmatter.source_url_verified || false,
        date: frontmatter.date || null,
      }
    });
  }

  // Sort by birthtime (newest first)
  files.sort((a, b) => new Date(b.birthtime) - new Date(a.birthtime));

  const result = {
    generatedAt: new Date().toISOString(),
    count: files.length,
    summary: {
      untracked: files.filter(f => f.statusType === 'untracked').length,
      modified: files.filter(f => f.statusType === 'modified').length,
      staged: files.filter(f => f.statusType === 'staged').length,
      added: files.filter(f => f.statusType === 'added').length,
      deleted: files.filter(f => f.statusType === 'deleted').length,
    },
    files
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  console.log(`✅ Saved git status: ${files.length} files`);
  console.log(`   - 未追跡: ${result.summary.untracked}`);
  console.log(`   - 変更済み: ${result.summary.modified}`);
  console.log(`   - ステージング済み: ${result.summary.staged}`);
  console.log(`   Output: ${OUTPUT_FILE}`);

} catch (error) {
  console.error('Failed to save git status:', error.message);
  
  // Write empty file with error info
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
    generatedAt: new Date().toISOString(),
    count: 0,
    error: error.message,
    files: []
  }, null, 2));
  
  process.exit(1);
}
