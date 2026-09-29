# SwitchOS CLI Reference Guide (v4.2 — current published docs)

> Fictional product, for training/demo purposes only. All commands, outputs, and behavior are invented and do not represent any real vendor's CLI.

This guide documents the SwitchOS command-line interface as of the v4.2 release.

---

### show system uptime
Displays elapsed time since the last system boot.
**Syntax:** `show system uptime`

### show interfaces terse
Displays a condensed status table of all interfaces (name, admin state, link state).
**Syntax:** `show interfaces terse`

### show interfaces extensive
Displays full interface statistics including error counters and traffic rates.
**Syntax:** `show interfaces extensive [interface-name]`

### show chassis hardware
Displays installed hardware components and serial numbers.
**Syntax:** `show chassis hardware`

### show vlan brief
Displays a summary table of configured VLANs and their member interfaces.
**Syntax:** `show vlan brief`

### set interfaces \<name\> unit 0 family inet address \<ip\>
Assigns an IPv4 address to the specified interface.
**Syntax:** `set interfaces ge-0/0/0 unit 0 family inet address 10.1.1.1/24`

### set vlan \<name\> vlan-id \<id\>
Creates a VLAN and assigns it a VLAN ID.
**Syntax:** `set vlan sales vlan-id 100`

### set system hostname \<name\>
Sets the device's hostname.
**Syntax:** `set system hostname switch-01`

### set system root-authentication plain-text-password
Sets the root password interactively (prompts for password entry).
**Syntax:** `set system root-authentication plain-text-password`

### delete interfaces \<name\>
Removes the configuration for the specified interface immediately.
**Syntax:** `delete interfaces ge-0/0/0`

### commit
Applies the active candidate configuration.
**Syntax:** `commit`

### commit confirmed \<minutes\>
Applies the configuration but automatically rolls back if not confirmed within the given number of **minutes**.
**Syntax:** `commit confirmed 10`

### rollback \<number\>
Reverts to a previous committed configuration by rollback number.
**Syntax:** `rollback 1`

### show configuration
Displays the current active configuration.
**Syntax:** `show configuration`

### show route summary
Displays a summary count of routes per routing table.
**Syntax:** `show route summary`

### set protocols lldp interface all
Enables LLDP (Link Layer Discovery Protocol) on all interfaces.
**Syntax:** `set protocols lldp interface all`

### set snmp community \<name\> authorization read-only
Configures an SNMPv2 community string with read-only access.
**Syntax:** `set snmp community public authorization read-only`

### show log messages
Displays the system message log.
**Syntax:** `show log messages`

### request system reboot
Reboots the device.
**Syntax:** `request system reboot`

### show system alarms
Displays active system alarms.
**Syntax:** `show system alarms`
