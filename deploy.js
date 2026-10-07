#!/usr/bin/env node

/**
 * 🚀 One-Click Deploy Script for Office Docs Manager
 * Usage: npm run deploy OR node deploy.js
 */

const { execSync } = require("child_process");
const readline = require("readline");

function run(command) {
  try {
    return execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`\n❌ Command failed: ${command}`);
    process.exit(1);
  }
}

function getOutput(command) {
  try {
    return execSync(command, { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

async function main() {
  console.log("\n==================================================");
  console.log("🚀  OFFICE DOCS MANAGER - GIT PUSH & DEPLOY");
  console.log("==================================================\n");

  // 1. Check Git Status
  const status = getOutput("git status --porcelain");
  const branch = getOutput("git rev-parse --abbrev-ref HEAD") || "main";

  console.log(`📌 Current branch: ${branch}`);

  if (status) {
    console.log("📝 Detected uncommitted changes:");
    console.log(status);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const defaultMsg = `Update: ${new Date().toLocaleString()}`;
    const commitMsg = await new Promise((resolve) => {
      rl.question(`\n💬 Enter commit message (Default: "${defaultMsg}"): `, (answer) => {
        rl.close();
        resolve(answer.trim() || defaultMsg);
      });
    });

    console.log("\n📦 Staging and committing changes...");
    run("git add .");
    run(`git commit -m "${commitMsg}"`);
  } else {
    console.log("✅ Working directory clean (no unstaged changes).");
  }

  // 2. Push to GitHub
  console.log(`\n🚀 Pushing to origin ${branch}...`);
  run(`git push origin ${branch}`);

  console.log("\n==================================================");
  console.log("🎉 SUCCESS! Pushed to GitHub repository.");
  console.log("🌐 Vercel will now automatically build and deploy!");
  console.log("🔗 GitHub Repo: https://github.com/NecByErg/office-docs-manager");
  console.log("==================================================\n");
}

main();
