---
aliases:
  - Board HWMv2 Schema
tags:
title: Board HWMv2 Schema
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

# Board HWMv2 Schema

This naming schema is how you refer to a board when using `{sh}west build -b {{BOARD}}`

![Board_schema](https://docs.zephyrproject.org/latest/_images/board-terminology.svg)

> [!tldr] Key Points
> - Board Target Format: `board name[@revision][/SoC[/CPU cluster][/variant]]`, where board name is mandatory, revision is optional, and board qualifiers are optional and describe the SoC, CPU cluster, and variant.
> - Single SoC Board Example: For the BL5340 DVK board with a single nRF5340 SoC, two CPU clusters (cpuapp and cpunet), and a non-secure variant (ns), the board target is `bl5340_dvk@1.2.0/nrf5340/cpuapp/ns.`
> - Board with No CPU Clusters or Variants Example: For the Thingy:52 board with a single nRF52832 SoC, the board target is thingy52/nrf52832.

The diagram shows the different terms that are used to describe boards:

- The board name: `bl5340_dvk`
- The optional board revision: 1.2.0
- The board qualifiers, that optionally describe the SoC, CPU cluster and variant: `nrf5340/cpuapp/ns`
- The board target, which uniquely identifies a combination of the above and can be used to specify the hardware to build for when using the tooling provided by Zephyr: `bl5340_dvk@1.2.0/nrf5340/cpuapp/ns`
- Formally this can also be seen as `board name[@revision][/board qualifiers]`, which can be extended to `board name[@revision][/SoC[/CPU cluster][/variant]]`.

> [!tip]- Single-SoC Boards Shorthand can be just the board name
>
> If a board contains only one single-core SoC, then the SoC can be omitted from the board target. This implies that if the board does not define any board qualifiers, the board name can be used as a board target. Conversely, if board qualifiers are part of the board definition, then the SoC can be omitted by leaving it out but including the corresponding forward-slashes: //.

---
