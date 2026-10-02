---
name: release-notes-drafting
description: Use when the user asks to write, draft, or generate release notes, a changelog, or "what's new" content from a Jira project or a set of tickets — e.g. "write release notes for the KAN project", "what shipped this sprint?", "draft a changelog from Jira".
---

# Release Notes Drafting

When invoked, produce reader-facing release notes sourced from real ticket data — never from assumption or memory of what a project "probably" shipped.

## Step 1 — Get real ticket data

Call the `get_jira_tickets` tool from the `jira-snapshot` MCP server. This returns a bundled snapshot of real ticket data (key, summary, status, description) without needing a live Jira login or connector.

## Step 2 — Only report what's actually Done

Jira tickets in To Do or In Progress status have not shipped. Including them in release notes as if they're available is a common and damaging mistake — it tells readers a capability exists when it doesn't. Strictly separate:
- **Done** → goes in the release notes body.
- **Everything else** → goes in a separate "still in progress" note, clearly marked as not yet available.

## Step 3 — Rewrite, don't copy

Internal ticket descriptions are written for engineers (deliverables, success criteria, coverage percentages). Release notes are for readers deciding whether something affects them. Translate each Done ticket into one or two plain sentences about the capability and its benefit — don't paste internal metrics or Definition-of-Done checklists.

## Step 4 — Group and report

Group under New / Improved / Fixed based on what each ticket actually represents, omitting empty groups. Follow with the still-in-progress list (names only, no detail) and a one-line total count of released vs. pending items.
