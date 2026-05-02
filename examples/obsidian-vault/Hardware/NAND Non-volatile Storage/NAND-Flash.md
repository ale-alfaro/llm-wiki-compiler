---
id: NAND-Flash
aliases: []
tags: []
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

# Purpose

**Main purpose**: replace hard disks drives
**Main goal**: lowest cost per bit

Widely used in many consumer devices, embedded systems.

Nand flash is also known as MTD or "Memory Technology Device"

# Comparison with similar technologies

## MTD!= Block devices

First, a MTD, Memory Technology Device, is **not** a block device.

They differ in many ways and needs to be treated differently from many aspects. Block devices has two main operations: **read sector** and **write sector**.

MTD devices on the other hand has three: **read from erase-block**, **write to erase-block** and **erase erase-block**.

MTD devices (well, NAND devices) suffers from bad blocks, bit errors, wear leveling which block devices do not.

This affects which file systems that are suitable for each type as the file-system (or underlying layer, e.g. UBI) have to deal with this. Be aware of that many block devices, e.g. SSD, MMC, eMMC, USB drive flashes is usually (managed) NAND-flashes. The raw NAND is just hidden behind a (proprietary) Flash Translation Layer, FTL, that handles this for you.

You simply have to trust them to do it well.

# Components

- Smallest unit is a _cells_ that holds state as a transistor would (0 - 1 in SLC)
- A NAND _cell_ is grouped into a **row or page**
- This rows are placed in parallel to compact the number of cells. A group of parallel rows is a **block**
- The blocks can then be grouped into an arrangement that depends on the manufacturer. This groupings can have two hierarchies that arent standardized as the previous ones so it depends on the MFG what the terms are. Most commonly they are: - Planes (Grouping of blocks) - Die (Grouping of planes ) - also referred as LUNs
  To summarize:
- _Pages_ are grouped into _blocks_
- _Blocks_ are organized in _planes_ and planes in **dies (also referred as LUNs)**
  And most importantly when writing code the read/write/erase minimum byte size parameters are:
- Erase - _Blocks_ are the smallest area than can be erased,
- Read or Write - _Pages_ are the smallest region that can be **read or programmed(written) **.
  ![[NAND_Overview.pdf#page=4|NAND_Overview, page 4]]

# Characteristics

- Can only **read or program** a **page**
- Can only **erase** a **block**
- Can only program a **page** to zero (This is a WRITE operation)
- Can only erase a **block** to a **one** (This is an ERASE operation)
  ![[NAND_Overview.pdf#page=8|NAND_Overview, page 8]]

# Configurations and Variants

## Variants

- Bit-width: - SLC, MLC, 3BPC - [Video explainer](https://youtu.be/5zLk7nJdJcc?si=Mn7enIHQ6eHeNBg_)
  ![[SLC_v_MLC.jpeg]]
- Serial Interface:
  - Raw/Parallel IO lines
  - SPI/QSPI (mostly SPI)
- Capacity
  - Number of dies of 2048 blocks (4GBit = 1 die)
- Managed NAND with FTL (Flash Translation Layer)

## Example Configuration

```
CONFIG_SYS_NAND_USE_FLASH_BBT=y: Use Bad Block Table stored in the OOB area.
CONFIG_SYS_NAND_4BIT_HW_ECC_OOBFIRST=y: OOB/ECC layout
CONFIG_SYS_NAND_PAGE_2K=y: Use 2k pages
CONFIG_SYS_NAND_BLOCK_SIZE=0x20000: Block size is 128k
CONFIG_SYS_NAND_PAGE_COUNT=0x40: 64 pages per block
CONFIG_SYS_NAND_PAGE_SIZE=0x800: Each page is 2k
CONFIG_SYS_NAND_OOBSIZE=0x40: OOB area for each page is 64 bytes
CONFIG_SYS_NAND_BAD_BLOCK_POS=0: Bad block marker start at position 0
CONFIG_SYS_NAND_U_BOOT_OFFS=0x100000: The U-Boot image should be read from address 0x100000
```

# Commands and Features

NAND flash follow a serial communication spec to a certain degree , Manufacturer may add or modify the spec for their product, The following contains the standardized commands and features (specific term used to describe certain registers to configure and get the status)

## Commands

```C nand_cmd.h
/** SPI NAND commands */
enum spi_nand_cmd {
	/** Clear WEL bit in the status register */
	SPI_NAND_CMD_WRITE_DISABLE = 0x04,
	/** Set WEL bit in the status register */
	SPI_NAND_CMD_WRITE_ENABLE = 0x06,
	/** Read data from main storage to NAND cache */
	SPI_NAND_CMD_PAGE_READ = 0x13,
	/** Read data from NAND cache */
	SPI_NAND_CMD_READ_CACHE = 0x03,
	/** Write memory contents to NAND cache */
	SPI_NAND_CMD_PROGRAM_LOAD = 0x2,
	/** Copy data from NAND cache to main storage */
	SPI_NAND_CMD_PROGRAM_EXECUTE = 0x10,
	/** Erase a single block in main storage */
	SPI_NAND_CMD_BLOCK_ERASE = 0xD8,
	/** Get device configuration */
	SPI_NAND_CMD_GET_FEATURE = 0x0F,
	/** Set device configuration */
	SPI_NAND_CMD_SET_FEATURE = 0x1F,
	/** Read 2 byte device identifier */
	SPI_NAND_CMD_READ_ID = 0x9F,
	/** Reset memory device into known state */
	SPI_NAND_CMD_RESET = 0xFF,
};
```

I like to categorize the commands in 3 broad sets:

- Read commands
  - `SPI_NAND_CMD_PAGE_READ`
  - `SPI_NAND_CMD_READ_CACHE
- Write command
  - `SPI_NAND_CMD_WRITE_ENABLE`
  - `SPI_NAND_CMD_WRITE_DISABLE`
  - `SPI_NAND_CMD_PROGRAM_EXECUTE`
  - `SPI_NAND_CMD_PROGRAM_LOAD
- Configuration and Regular Operation commands
  - `SPI_NAND_CMD_BLOCK_ERASE`
  - `SPI_NAND_CMD_READ_ID`
  - `SPI_NAND_CMD_RESET`
  - `SPI_NAND_CMD_GET_FEATURE`
  - `SPI_NAND_CMD_SET_FEATURE`

# ECC

NAND flash memories is organized into blocks, pages and Out Of Bound (==OOB==) areas .

![/media/omapl138-nand-layout.png](https://www.marcusfolkesson.se/media/omapl138-nand-layout.png)

The smallest addressable unit in a NAND flash is a page, typically 2KB. Every page has a few extra spare bytes spare used to store metadata.

One block consists of 64 pages (2k page + 64 OOB) x 64 = 128k + 4k OOB in total.

## OOB

OOB stand for out of band and is a spare area adjecent to the page The OOB area could be used by the filesystem, but the common usage of the area is to enable ECC (Error Correction Code) and bad block management.

## ECC and bad blocks

As already mentioned, all NAND flashes have problem with data integrity, this problem is known as "bit errors".

The bit is stored as a voltage level in a cell, and many things can affect this voltage level. Charge leakage, read disturbance, cell-to-cell interference or cosmic radiation just mention a few. Bit errors **will** happened and the most efficient way to protect the data is by Error Correction Codes, ECCs.

There are many ECC algorithms out there, but the most commonly used is the Bose Chaudhuri Hocquenghem, BCH code. The ECC is usually, but not necessary, calculated in hardware. The hardware support could be in the CPU (as in this case) or in the NAND flash itself, so-called on-die. The number of bits in the ECC determines how many bitflips it could detect and correct.

OMAPL138 has hardware support for a 4bit ECC with an unknown algorithm - I cannot find anything about what algorithm they are using in the datasheet.

It is also important that all included components (bootloader, kernel) have the same idea about which ECC should be used and saved to which part of the OOB area. Otherwise, it is not possible to e.g. read data saved by U-boot in Linux.
