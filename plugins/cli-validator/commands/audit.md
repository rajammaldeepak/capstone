---
description: Validate a documented CLI reference guide against a build's CLI manifest
argument-hint: (optional) <reference-guide.md> <build-manifest.json> — omit both to pull live via MCP
---

Get the two inputs to compare:

- **If the `build-manifest` MCP server's tools are available**, call `get_reference_guide` and `get_build_manifest` to fetch both documents live — this is the preferred path, since it simulates pulling the current documented state and current build state from their real systems rather than relying on files that may be stale.
- **Otherwise**, if `$ARGUMENTS` gives two file paths, read the reference guide (Markdown) from the first and the build manifest (JSON) from the second.
- If neither is available, ask the user for the file paths.

Once you have both documents, classify every command using the enumeration process below. Do not skip straight to writing the report — work through the passes in order first.

## Step 1 — Build two checklists

List every command from the reference guide (status: unmatched) and every command from the build manifest (status: unmatched). You will resolve every single item on both lists — nothing gets left off silently.

## Step 2 — Match in passes, don't skip ahead

**Pass 1 — exact match.** For each unmatched guide command, look for an unmatched build command with the identical command string. Mark both matched. If syntax/required options differ → **Updated**. If syntax is identical but the description signals a changed default, unit, or runtime behavior (words like "now", "previously", "changed", "default", a unit change) → **Behavior-changed**. Otherwise → **Unchanged**.

**Pass 2 — rename match.** For every *still-unmatched* guide command, compare it against every *still-unmatched* build command for shared distinctive keywords (e.g. both mention "vlan", both mention "lldp", both mention "snmp", both mention "route summary"). A shared root subject plus a similar purpose in the description is a rename candidate — mark both matched as **Renamed**, and say so explicitly even if you're not 100% certain; note your confidence rather than silently defaulting to New/Deprecated instead. Do this pass exhaustively — check every remaining unmatched guide item against every remaining unmatched build item before moving on, not just the first plausible pair you find.

**Pass 3 — leftovers.** Any guide command still unmatched after passes 1–2 → **Deprecated**. Any build command still unmatched after passes 1–2 → **New**.

Every command from both lists must land in exactly one category by the end of Pass 3 — if your final tables don't account for every item on both original lists, go back and re-run Pass 2 rather than defaulting the leftovers to New/Deprecated out of convenience.

## Classification categories

- **Unchanged** — command and syntax identical.
- **Updated** — same command, but syntax, flags, or required options changed.
- **Behavior-changed** — same command and syntax, but the description indicates a changed default, unit, or runtime behavior. Flag these separately from Updated since they're easy to miss — the syntax looks identical but the effect differs.
- **Renamed** — functionally the same command under a new name.
- **New** — present in the build, absent from the guide, with no rename match found in Pass 2.
- **Deprecated** — present in the guide, absent from the build, with no rename match found in Pass 2.

## Output

Produce **all six tables, always, in this order**: Unchanged, Updated, Behavior-changed, Renamed, Deprecated, New — even when a category is empty, show its heading with a single row saying "None in this run" rather than omitting the table. This makes it visible that every category was actually checked, not skipped.

Each row: command name, what changed (for Updated/Behavior-changed/Renamed), and a one-line documentation action needed (e.g. "Update syntax block", "Add new page", "Mark as deprecated, add migration note", "Rename page, add redirect note").

End with a summary line: total commands in guide, total in build, count per category (should sum correctly against both totals), and the single highest-priority documentation gap to fix first (usually a Deprecated or Behavior-changed item, since those most often break user workflows silently).
