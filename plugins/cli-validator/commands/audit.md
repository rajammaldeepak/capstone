---
description: Validate a documented CLI reference guide against a build's CLI manifest
argument-hint: (optional) <reference-guide.md> <build-manifest.json> — omit both to pull live via MCP
---

Get the two inputs to compare:

- **If the `build-manifest` MCP server's tools are available**, call `get_reference_guide` and `get_build_manifest` to fetch both documents live — this is the preferred path, since it simulates pulling the current documented state and current build state from their real systems rather than relying on files that may be stale.
- **Otherwise**, if `$ARGUMENTS` gives two file paths, read the reference guide (Markdown) from the first and the build manifest (JSON) from the second.
- If neither is available, ask the user for the file paths.

Once you have both documents, classify every command.

## Matching logic

For each command in the reference guide, look for its counterpart in the build manifest using, in order:
1. **Exact command match** (same command string) → check whether syntax/description changed.
2. **No exact match, but a build entry shares most of the same keywords/option names** (e.g. `show vlan brief` vs `show vlan-configuration brief`) → likely a **rename**, not a deprecation. State your confidence.
3. **No match at all, in either direction** → the guide's version is **deprecated** (removed from the build).

For each build manifest entry with no reference-guide counterpart after the above matching → **new**.

## Classification categories

- **Unchanged** — command and syntax identical.
- **Updated** — same command, but syntax, flags, or required options changed.
- **Behavior-changed** — same command and syntax, but the description indicates a changed default, unit, or runtime behavior (e.g. a units change, a new confirmation prompt). Flag these separately from Updated since they're easy to miss — the syntax looks identical but the effect differs.
- **Renamed** — functionally the same command under a new name.
- **New** — present in the build, absent from the guide.
- **Deprecated** — present in the guide, absent from the build (and not matched as a rename).

## Output

Produce one table per category (omit empty categories), each row showing: command name, what changed (for Updated/Behavior-changed/Renamed), and a one-line documentation action needed (e.g. "Update syntax block", "Add new page", "Mark as deprecated, add migration note", "Rename page, add redirect note").

End with a summary line: total commands in guide, total in build, count per category, and the single highest-priority documentation gap to fix first (usually a Deprecated or Behavior-changed item, since those most often break user workflows silently).
