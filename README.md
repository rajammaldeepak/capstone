# capstone — AI Mastery: CLI Reference Validator

A Claude Code marketplace with one plugin, `cli-validator`, built for the TWT AI Mastery capstone.

## The problem

CLI reference guides go stale every release: commands get added, changed, renamed, or removed, and nobody has an easy way to spot the drift. This plugin compares a documented reference guide against a build's actual CLI list and classifies every difference.

## What's in this repo

```
.claude-plugin/marketplace.json      ← the catalog (lists the plugin below)
plugins/cli-validator/
├── .claude-plugin/plugin.json        ← plugin manifest
├── commands/audit.md                  ← /cli-validator:audit
├── skills/cli-drift/SKILL.md          ← auto-invoked comparison logic
├── .mcp.json                          ← registers the local MCP server
├── mcp-servers/
│   ├── build-manifest-server.mjs      ← the MCP server itself
│   └── package.json                   ← its one dependency
└── data/                              ← dummy data the MCP server reads
    ├── reference-guide.md
    └── latest-build-clis.json
sample-data/                          ← same dummy files, readable directly (no install needed)
├── reference-guide.md
├── latest-build-clis.json
└── demo-comparison-report.md          ← a worked example of the expected output
```

All CLI commands are fictional ("SwitchOS") — invented for this project, not from any real product.

## Setup

1. `git clone` this repo (or clone via GitHub Desktop).
2. Open a terminal in `plugins/cli-validator/mcp-servers/` and run:
   ```
   npm install
   ```
   This installs the one dependency the local MCP server needs. `node_modules/` is gitignored — you only need to do this locally, not commit it.

## Install into Claude Code

```
/plugin marketplace add rajammaldeepak/capstone
/plugin install cli-validator@capstone
```

Run `/mcp` afterward to confirm the `build-manifest` server shows as connected.

## Try it

```
/cli-validator:audit
```
run with no arguments, pulls both documents live through the MCP server and returns a classification report. Or ask in plain English: *"Does the reference guide still match the latest build?"* — that triggers the `cli-drift` skill automatically.

Compare the output against `sample-data/demo-comparison-report.md`, which shows the expected six-category breakdown: unchanged, updated, behavior-changed, renamed, deprecated, new.
