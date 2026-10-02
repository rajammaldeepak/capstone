# CLI Reference Updates for v5.0

## New Commands

### show poe interface
Displays Power-over-Ethernet status and power draw for the specified interface.

**Syntax:** `show poe interface <interface-name>`

**Example:**
```
show poe interface ge-0/0/0
```

**Output:**
```
Interface     Status  Power-Draw  Wattage-Limit  State
ge-0/0/0      enabled  6.5W        30W            ok
ge-0/0/1      enabled  12.8W       30W            ok
ge-0/0/2      disabled 0W          30W            off
```

**Use Cases:**
- Monitor PoE power consumption
- Troubleshoot powered device connectivity
- Capacity planning for PoE budgets

---

### set security zones security-zone interfaces
Assigns an interface to a security zone. Security zones are used to apply firewall policies and traffic controls.

**Syntax:** `set security zones security-zone <zone-name> interfaces <interface-name>`

**Example:**
```
set security zones security-zone trust interfaces ge-0/0/0
set security zones security-zone untrust interfaces ge-0/0/1
commit
```

**Common Zones:**
- `trust` — Internal/trusted network interfaces
- `untrust` — External/untrusted network interfaces
- `dmz` — Demilitarized zone interfaces

**Use Cases:**
- Define network segmentation
- Apply zone-based firewall rules
- Implement network access policies

---

### show system storage
Displays disk and storage partition usage.

**Syntax:** `show system storage`

**Example Output:**
```
Filesystem      Total   Used    Available  Use%  Mount-Point
/               20GB    8.5GB   11.5GB     42%   /
/var            10GB    2.3GB   7.7GB      23%   /var
/home           50GB    15.2GB  34.8GB     30%   /home
```

**Use Cases:**
- Monitor disk space utilization
- Identify storage capacity issues
- Plan upgrades for growing logs/data
- Troubleshoot "disk full" errors

---

### set interfaces disable
Administratively disables the specified interface without removing its configuration.

**Syntax:** `set interfaces <interface-name> disable`

**Example:**
```
set interfaces ge-0/0/0 disable
commit
```

**To Re-enable:**
```
delete interfaces ge-0/0/0 disable
commit
```

**Difference from `delete interfaces`:**
- `disable` — keeps configuration, interface is administratively down
- `delete interfaces` — removes configuration completely

**Use Cases:**
- Temporarily disable an interface for maintenance
- Disable problematic ports without losing config
- Quick way to power down a link for troubleshooting

---

## Updated Commands

### set system root-authentication plain-text-password
Sets the root password interactively with password complexity requirements.

**Changes from v4.2:**
- Now requires `--min-complexity` flag
- Three complexity levels available

**Syntax:** `set system root-authentication plain-text-password --min-complexity=<level>`

**Complexity Levels:**
| Level | Requirements | Example |
|-------|--------------|---------|
| `low` | 6+ characters | `abc123` |
| `medium` | 12+ chars, mixed case, numbers | `MyPassword123` |
| `high` | 16+ chars, special chars required | `MyP@ssw0rd!Secure2024` |

**Example:**
```
set system root-authentication plain-text-password --min-complexity=high
```

---

### set interfaces unit family inet address
Assigns IPv4 and optionally IPv6 addresses to an interface.

**Changes from v4.2:**
- Now supports dual-stack IPv6 configuration

**Syntax:** `set interfaces <name> unit 0 family inet address <ipv4> [family inet6 address <ipv6>]`

**Examples:**

IPv4 only (v4.2 compatible):
```
set interfaces ge-0/0/0 unit 0 family inet address 10.1.1.1/24
```

Dual-stack:
```
set interfaces ge-0/0/0 unit 0 family inet address 10.1.1.1/24 family inet6 address 2001:db8::1/64
```

---

### show interfaces terse
Displays a condensed status table of all interfaces.

**Changes from v4.2:**
- Output now includes interface speed

**Syntax:** `show interfaces terse`

**Example Output:**
```
Interface      Admin  Link   Speed
ge-0/0/0       up     up     1000Mbps
ge-0/0/1       up     up     1000Mbps
ge-0/0/2       down   down   1000Mbps (disabled)
```

---

## Renamed Commands

### show vlan brief → show vlan-configuration brief
Displays a summary table of configured VLANs and their member interfaces.

**Old command (deprecated):**
```
show vlan brief
```

**New command:**
```
show vlan-configuration brief
```

---

### set protocols lldp interface all → set protocols lldp-med interface all
Enables LLDP-MED (Link Layer Discovery Protocol - Media Endpoint Discovery) on all interfaces.

**Old command (deprecated):**
```
set protocols lldp interface all
```

**New command:**
```
set protocols lldp-med interface all
```

**Benefits of LLDP-MED:**
- Power negotiation for PoE devices
- Location information advertisement
- Enhanced device discovery

---

### show route summary → show route summary detail
Displays a detailed per-protocol breakdown of routes per routing table.

**Old command (deprecated):**
```
show route summary
```

**New command:**
```
show route summary detail
```

**New behavior:**
- Shows per-protocol route counts by default
- More detailed routing analysis without additional flags

---

## Deprecated Commands

### set snmp community (removed, use SNMPv3 instead)

**Old command:**
```
set snmp community <name> authorization read-only
```

**Replacement:**
```
set snmp v3 usm local-engine user <username> authentication-sha
```

**See:** MIGRATION_GUIDE.md for detailed SNMPv2 → SNMPv3 migration steps.
