# CLI Drift Report — SwitchOS Reference Guide (v4.2 docs) vs. Build v5.0

**Inputs:** `capstone/reference-guide.md` (20 documented commands) vs. `capstone/latest-build-clis.json` (24 commands in build v5.0)

---

## ✅ Unchanged (10)
No documentation action needed.

| Command |
|---|
| show system uptime |
| show interfaces extensive |
| show chassis hardware |
| set system hostname |
| commit |
| rollback |
| show configuration |
| show log messages |
| request system reboot |
| show system alarms |

## 🔧 Updated (4)
Syntax or required options changed — doc's syntax block needs editing.

| Command | What changed | Action |
|---|---|---|
| show interfaces terse | Output table now includes a Speed column | Update sample output table |
| set interfaces \<name\> unit 0 family inet address | Now also accepts an optional `family inet6 address` clause | Add IPv6 example |
| set vlan \<name\> vlan-id \<id\> | Option renamed: `vlan-id` → `id` | Update syntax line and all examples |
| set system root-authentication plain-text-password | Now requires a `--min-complexity` flag | Add flag description + default value |

## ⚠️ Behavior-changed (2) — highest risk, flag first
Syntax looks identical, but the effective result differs — a reader following the old doc word-for-word gets a different outcome with no visual warning.

| Command | What changed | Action |
|---|---|---|
| commit confirmed \<n\> | Unit changed from **minutes** to **seconds** | Update parameter description; add a callout warning about the unit change |
| delete interfaces \<name\> | Now prompts for confirmation by default (previously immediate); `--force` restores old immediate behavior | Add note on new prompt + `--force` flag |

## 🔀 Renamed (2)
Same function, new command name — needs a rename plus a findability note for readers searching the old name.

| Old name | New name | Action |
|---|---|---|
| show vlan brief | show vlan-configuration brief | Rename page/section; add "formerly known as" note |
| set protocols lldp interface all | set protocols lldp-med interface all | Rename page/section; add migration note |

## 🗑️ Deprecated (2)
Removed from the build; a replacement exists for both.

| Command | Status | Replacement |
|---|---|---|
| show route summary | Removed | show route summary detail |
| set snmp community \<name\> authorization read-only | Removed (SNMPv2 community strings retired) | set snmp v3 usm local-engine user |

## 🆕 New (6)
Not in the current guide — needs new doc entries.

| Command | Purpose |
|---|---|
| show route summary detail | Detailed per-protocol route breakdown (replaces show route summary) |
| set snmp v3 usm local-engine user | SNMPv3 user-based access (replaces community strings) |
| show poe interface | PoE status and power draw per interface |
| set security zones security-zone interfaces | Assigns an interface to a security zone |
| show system storage | Disk/storage partition usage |
| set interfaces \<name\> disable | Administratively disables an interface |

---

## Summary

| Metric | Count |
|---|---|
| Commands in current guide | 20 |
| Commands in build v5.0 | 24 |
| Unchanged | 10 |
| Updated | 4 |
| Behavior-changed | 2 |
| Renamed | 2 |
| Deprecated | 2 |
| New | 6 |

**Highest-priority fix:** The `commit confirmed` unit change (minutes → seconds) is the single riskiest gap — a reader entering `commit confirmed 10` expecting a 10-minute window now gets a 10-second window, with identical-looking syntax and no error. This should be documented with a prominent callout, not just a table update.
