# SwitchOS v5.0 Migration Guide

## Breaking Changes Overview

This guide covers critical breaking changes between SwitchOS v4.2 and v5.0. These changes affect both command syntax and runtime behavior.

---

## 🔴 Critical: SNMPv2 → SNMPv3 Migration

**Deprecated Command (v4.2):**
```
set snmp community <name> authorization read-only
Example: set snmp community public authorization read-only
```

**Replacement (v5.0):**
```
set snmp v3 usm local-engine user <username> authentication-sha
Example: set snmp v3 usm local-engine user admin authentication-sha
```

### Migration Steps:
1. Remove all SNMPv2 community string configurations
2. Create SNMPv3 users with authentication:
   ```
   set snmp v3 usm local-engine user admin authentication-sha
   commit
   ```
3. Update monitoring tools to use SNMPv3 credentials
4. Verify connectivity with `show snmp v3 users`

### Why:
SNMPv2 community strings are deprecated for security reasons. SNMPv3 provides authentication and encryption.

---

## 🟡 High Priority: Unit Changes

### `commit confirmed` — Minutes → Seconds

**Before (v4.2):**
```
commit confirmed 10
(waits 10 minutes for confirmation)
```

**After (v5.0):**
```
commit confirmed 600
(waits 600 seconds = 10 minutes for confirmation)
```

### Impact:
- **Scripts will break** if they don't update the timeout value
- A `commit confirmed 10` in v5.0 waits only 10 seconds, not 10 minutes
- Automatic rollback will occur much faster than expected

### Migration Steps:
1. Find all `commit confirmed` commands in your automation
2. Convert timeout: `new_value = old_value * 60`
3. Test in a lab environment first
4. Deploy updated scripts to production

### Example Conversion:
```bash
# Old (v4.2)
commit confirmed 5

# New (v5.0)
commit confirmed 300  # 5 minutes in seconds
```

---

## 🟠 Medium Priority: Behavior Changes

### `delete interfaces` — Now Requires Confirmation

**Before (v4.2):**
```
delete interfaces ge-0/0/0
(deletes immediately)
```

**After (v5.0):**
```
delete interfaces ge-0/0/0
(prompts for confirmation unless --force is used)
```

### Forcing Deletion:
```
delete interfaces ge-0/0/0 --force
```

### Impact:
- Interactive scripts may hang waiting for user confirmation
- Automation scripts need the `--force` flag

### Migration Steps:
1. Add `--force` flag to all scripted `delete interfaces` commands
2. Test with user prompts enabled in interactive environments
3. Update documentation for operators

---

## Option Name Changes

### `set vlan` — `vlan-id` → `id`

**Before (v4.2):**
```
set vlan sales vlan-id 100
```

**After (v5.0):**
```
set vlan sales id 100
```

### Migration:
Simply replace `vlan-id` with `id` in all configuration files and scripts.

---

## Command Renames

### 1. `show vlan brief` → `show vlan-configuration brief`
- Same functionality, new command name
- Old command deprecated

### 2. `set protocols lldp interface all` → `set protocols lldp-med interface all`
- Upgraded to LLDP-MED (Media Endpoint Discovery)
- Adds support for power negotiation and location data

### 3. `show route summary` → `show route summary detail`
- New name reflects updated default behavior
- Now shows per-protocol breakdown by default

---

## New Commands (v5.0)

These commands are new and have no v4.2 equivalent:

1. **`show poe interface`** — Power-over-Ethernet status
2. **`set security zones security-zone interfaces`** — Security zone configuration
3. **`show system storage`** — Storage/disk usage
4. **`set interfaces disable`** — Administrative interface disable

---

## Syntax Enhancements

### `set interfaces` — IPv6 Support Added

**Before (v4.2):**
```
set interfaces ge-0/0/0 unit 0 family inet address 10.1.1.1/24
```

**After (v5.0):**
```
set interfaces ge-0/0/0 unit 0 family inet address 10.1.1.1/24 [family inet6 address <ipv6>]
```

Dual-stack configuration example:
```
set interfaces ge-0/0/0 unit 0 family inet address 10.1.1.1/24 family inet6 address 2001:db8::1/64
```

### `set system root-authentication` — Complexity Flag

**Before (v4.2):**
```
set system root-authentication plain-text-password
(no password complexity requirement)
```

**After (v5.0):**
```
set system root-authentication plain-text-password --min-complexity=medium
```

**Accepted values:**
- `low` — 6+ characters
- `medium` — 12+ characters, mixed case, numbers (default)
- `high` — 16+ characters, special characters required

---

## Verification Checklist

- [ ] Audit all automation scripts for `commit confirmed` timeouts
- [ ] Update SNMP configurations to use v3
- [ ] Add `--force` to scripted `delete` commands
- [ ] Rename deprecated commands in configurations
- [ ] Test dual-stack IPv6 on updated interfaces
- [ ] Update monitoring tools for new SNMP protocol
- [ ] Review security zone configurations
- [ ] Test power-over-Ethernet queries on PoE-enabled interfaces

---

## Support

For questions about specific commands, refer to the updated CLI Reference Guide or contact support.
