---
description: Generate reader-facing release notes from a Jira project's completed tickets
argument-hint: <jira-project-key> (e.g. KAN)
---

Using the connected Jira/Atlassian tool, search for issues in the project given in `$ARGUMENTS` using JQL: `project = <key> ORDER BY status DESC, created DESC`. Fetch full descriptions for each.

## Step 1 — Separate by status

Split the results into:
- **Done** — these are the only items that go into the release notes.
- **Not Done** (To Do, In Progress, or anything else) — never include these as if they shipped. List them separately under a "Still in progress" note at the end instead.

## Step 2 — Rewrite for a reader, not a developer

For each Done ticket, do not copy the Jira description verbatim. Translate the internal deliverables/success-criteria language into one or two reader-facing sentences describing the capability that's now available and why it matters. Drop internal-only detail (test counts, coverage percentages, story-point-style metrics) unless the audience is clearly technical.

## Step 3 — Group and format

Group entries under **New**, **Improved**, and **Fixed** — infer the right group from each ticket's content (a new system/feature → New; an enhancement to something existing → Improved; a bug/defect resolution → Fixed). Omit any group with nothing in it.

## Step 4 — Output

Produce the release notes as a dated section, followed by a short "Still in progress" list naming the Not-Done tickets by key and title (no detail — just a heads-up that they're coming). End with a one-line summary: X items released, Y still in progress.

Never fabricate a ticket, a status, or a capability that isn't actually in the fetched data.
