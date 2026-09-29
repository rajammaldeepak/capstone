---
name: cli-drift
description: Use when the user asks whether a CLI reference guide is up to date with a newer build, wants to know what CLI commands changed/are new/deprecated between versions, or asks to validate documentation against a build's command list.
---

# CLI Drift Detection

When invoked, determine how a documented CLI reference guide compares to a build's actual current CLI set, and classify every difference — this mirrors the logic in the `/cli-validator:audit` command, but triggers automatically from a natural question rather than requiring the slash command.

## Step 1 — Locate the two inputs

You need: (1) the documented reference guide (Markdown, listing commands with syntax/description) and (2) the build's CLI manifest (structured data — JSON/CSV — listing what the build actually contains).

If the `build-manifest` MCP server is connected, call its `get_reference_guide` and `get_build_manifest` tools to fetch both live rather than assuming a local file is current — this is the normal path once the plugin is installed. Only fall back to reading local files, or asking the user which files to use, if those tools aren't available.

## Step 2 — Match commands across both sources

Walk every command in the guide and try to find its counterpart in the build manifest:
- Exact string match on the command → compare syntax and description for drift.
- No exact match, but strong keyword/option overlap → likely a rename; say so with your confidence level, don't assert it silently.
- No match at all → deprecated (removed).

Anything left over in the build manifest with no guide counterpart → new.

## Step 3 — Classify each difference

Use these six buckets, and don't collapse them into fewer — they call for different documentation actions:
- **Unchanged** — nothing to do.
- **Updated** — syntax, flags, or required parameters changed; the doc's syntax block needs editing.
- **Behavior-changed** — syntax is identical, but effective behavior differs (a changed unit, a new default, a new confirmation step). These are the highest-risk category because a reader following old docs word-for-word will get a different result than expected, with no visual cue that anything changed.
- **Renamed** — same function, new command name; the doc needs a rename plus, ideally, a redirect/migration note for readers searching the old name.
- **New** — needs a new doc entry.
- **Deprecated** — needs a removal notice and, if there's a replacement, a migration pointer to it.

## Step 4 — Report

One table per non-empty category, then a summary count, then the single highest-priority fix — favor Behavior-changed or Deprecated items for this, since they cause the most user confusion if left undocumented.

Do not edit the reference guide yourself unless asked — report the classification and let the user decide what to update.
