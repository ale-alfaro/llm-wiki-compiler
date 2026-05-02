---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
<!--toc:start-->

- [Overview](#overview)
- [Command Table](#command-table)
  - [Feature and Configuration commands](#feature-and-configuration-commands)
  - [Read operations](#read-operations)
  - [Write Operation](#write-operation)
  - [Erase Operation](#erase-operation)
- [Timing Characteristics](#timing-characteristics)
<!--toc:end-->

# Overview

- Single-level cell (SLC) technology
- 4Gb density
- Organization
  - Page size: 4096 bytes (+ 256 bytes of spare region for ECC)
  - Block size: 64 pages (256K bytes)
  - LUN size: 2048 blocks (LUN is an alias for plane/die, or simply a grouping of blocks)
- Memory mapping
  - Column Address (Page Column) = [11:0] = `0x00 - LOG2(PAGE_SIZE)`
  - Row Address (Page number/address) = [16:0] = `0x00 - LOG2(PAGE_COUNT)`

# Command Table

- All commands expect Big Endian order (i.e MSB first)
- All commands with address bit width above 8 (1 byte) should send the address as a 3-byte value with
  Most Significant Bits being dummy bits.

| Command         |      Op Code | Address Bit Width | Direction | Data Size (Bytes) | Comments                                                                         |
| --------------- | -----------: | ----------------: | --------: | ----------------: | -------------------------------------------------------------------------------- |
| RESET           |        `FFh` |                 0 |         - |                 - | Reset the device. It is accepted by all stacked die.                             |
| GET FEATURE     |        `0Fh` |                 8 |        IN |                 1 | Get features. It is accepted by all stacked die.                                 |
| SET FEATURE     |        `1Fh` |                 8 |       OUT |                 1 | Set features.                                                                    |
| READ ID         |        `9Fh` |                 8 |        IN |                 2 | Read device ID. The address byte is a DUMMY BYTE (i.e can be any value)          |
| PAGE READ       |        `13h` |                17 |         - |                 - | Array read.                                                                      |
| READ FROM CACHE | `03h`, `0Bh` |                11 |        IN |         1 to 4096 | Output cache data at column address                                              |
| WRITE ENABLE    |        `06h` |                 0 |         - |                 - | Sets the WEL bit; Enables operations that change the content of the memory array |
| WRITE DISABLE   |        `04h` |                 0 |         - |                 - | Clears the WEL; Disables operations that change the content of the memory array. |
| BLOCK ERASE     |        `D8h` |                17 |         - |                 - | Block erase.                                                                     |
| PROGRAM EXECUTE |        `10h` |                11 |         - |                 - | Array program.                                                                   |
| PROGRAM LOAD    |        `02h` |                17 |       OUT |         1 to 4096 | Load program data into cache register on SI.                                     |
| PROTECT         |        `2Ch` |                 0 |         - |                 - | Permanently protect.                                                             |

## Feature and Configuration commands

> [!CITE]GET FEATURE (0Fh) and SET FEATURE (1Fh)
> These commands either monitor the device status or alter the device configuration from the default at power-on.
> They use a 1-byte feature address to determine which feature is to be read or modified.
> Typically, the status register at feature address C0h is read to check the device status, except WEL, which is a writable bit with the WRITE ENABLE (06h) command.
>
> When a feature is set, it remains active until the device is power cycled or the feature is written to. Unless specified otherwise, when the device is set, it remains set even if a RESET (FFh) command is issued. CFG[2:0] will be cleared to 000 after a reset and the device is back to normal operation.

**Table 7: Feature Address Settings and Data Bits**

| Register      | Feature Address | 7       | 6       | 5        | 4        | 3        | 2        | 1         | 0          | Notes                                 |
| ------------- | --------------- | ------- | ------- | -------- | -------- | -------- | -------- | --------- | ---------- | ------------------------------------- |
| Block lock    | `A0h`           | `BRWD`  | `BP3`   | `BP2`    | `BP1`    | `BP0`    | `TB`     | `WP/HOLD` | –          |                                       |
| Configuration | `B0h`           | `CFG2`  | `CFG1`  | `LOT_EN` | `ECC_EN` | `DS_S1`  | `DS_S0`  | `CFG0`    | `CONTI_RD` |                                       |
| Status        | `C0h`           | `CRBSY` | `ECCS2` | `ECCS1`  | `ECCS0`  | `P_Fail` | `E_Fail` | `WEL`     | `OIP`      | Read-only                             |
| Die select    | `D0h`           | –       | `DS0`   | –        | –        | –        | –        | –         | –          | Only available in stacked die devices |

> [!CITE] Status Register Bits
> All bits are read-only register except WEL, which could be changed by WRITE DIS- ABLE (04h) and WRITE ENABLE (06h) commands.
> None of bits can be changed by SET FEATURE (1Fh) command.
> The status register can be read by issuing the GET FEATURE (0Fh) command, followed by the feature address (C0h).
> The status register will output the status of the operation.

| Bit   |                      Bit Name | Description |
| ----- | ----------------------------: | ----------- |
| 7     |      Cache read busy(`CRBSY`) |             |
| [6:4] | `ECC` status register(`ECCS`) | N/A         |
| 3     |        Program fail(`P_Fail`) |             |
| 2     |         Erase fail (`E_Fail`) |             |
| 1     |    Write enable latch (`WEL`) |             |
| 0     | Operation in progress (`OIP`) |             |

## Read operations

The device provides a capability to read the whole block with a single command after power-up via a SET FEATURE command that enables the CONTINUOUS READ operation.
Upon power-up, this mode is disabled by default but can be enabled using SET FEATURE command to set `CONTI_RD` bit.
With the continuous read mode, it is possible to read out the en- tire block using a single READ command

| Read mode       | `CONFIG`                     | Notes                                                          |
| --------------- | ---------------------------- | -------------------------------------------------------------- |
| Cache read      | `CONT_RD = 0` `ECC_EN = 0/1` |                                                                |
| Continuous read | `CONTI_RD = 1` `ECC_EN = 1`  | ECC is enabled automatically and must be enabled while reading |

> [!CITE] Cache read
>
> The PAGE READ (13h) command transfers data from the NAND Flash array to the cache register.
> It requires a 24-bit address consisting of 7 dummy bits and a 17-bit block/page address.
> After the block/page address is registered, the device starts the transfer from the main array to the cache register.
> During this data transfer busy time of `tRD`, the GET FEATURE command can be issued to monitor the operation.
> Following successful completion of PAGE READ, the READ FROM CACHE command must be issued to read data out of cache.
>
> The command sequence is as follows to transfer data from array to output:
>
> - 13h (PAGE READ command to cache)
> - 0Fh (GET FEATURE command to read the status)
> - 03h or 0Bh (READ FROM CACHE)

> [!CITE] Continuous Read
>
> The CONTINUOUS READ command doesn't require the starting column address. The device always output the data starting from the first column (byte 0) of the cache register.
> Once the end of the cache register is reached, the data output continues through the next page
> Once the end of the block is reached, the output pins become High-Z state and the data output can be terminated by de-selecting the CS#.
> If the continuous read is terminated by deselecting the CS# then all the data inside the data buffer are lost and unreliable to use.
>
> Below is the outline of the read sequence:
>
> - PAGE READ (13h) command
> - Wait until OIP bit of the status register is busy
> - READ FROM CACHE (03h, 0Bh) command sequence
> - Read the data from address 0 until the end of the block or CS# is de-selected.
>   If the device is coming out of a power reset the first two steps can be skipped

## Write Operation

> A write operation sequence enables the host to input 1 byte to 4352 bytes of data within a page to a cache register, and then move the data from the cache register to the specified block and page address in the array using the PROGRAM LOAD and PROGRAM EXECUTE operations respectively

> [!CITE] PROGRAM LOAD
>
> Prior to performing the PROGRAM LOAD operation, a WRITE ENABLE (06h) command must be issued and then followed by a PROGRAM LOAD (02h) command.
> The PROGRAM LOAD command consists of an 8-bit op code, followed by 3 dummy bits and a 13-bit column address, and then the data bytes to be programmed.
> The data bytes are loaded into a cache register that is 4352 bytes long. Only four partial-page programs are allowed on a single page.
> If more than 4352 bytes are loaded, those additional bytes are ignored by the cache register. The command sequence ends when CS# goes from LOW to HIGH.

> [!CITE] PROGRAM EXECUTE
>
> The PROGRAM EXECUTE command consists of an 8-bit op code, followed by a 24-bit address. After the page/block address is registered, the device starts the transfer from the cache register to the main array and is busy for `tPROG` time.
> During this busy time, the status register can be polled to monitor the status of the operation. When the operation completes successfully, the next series of data can be loaded with the PROGRAM LOAD command.

> The page program sequence is as follows:
>
> - 06h (WRITE ENABLE command)
> - 02h (PROGRAM LOAD command)
> - 10h (PROGRAM EXECUTE command)
> - 0Fh (GET FEATURE command to read the status)

## Erase Operation

> [!CITE] The BLOCK ERASE (D8h)
>
> The BLOCK ERASE (D8h) command operates on one block at a time, or in other words 64 pages at a time.
> Similar to the write operation, this command requires the WRITE ENABLE command
> This command requires a 24-bit address consisting of dummy bits followed by a valid block address.
> After the address is registered, the control logic automatically controls timing and ERASE and VERIFY operations.
> The device is busy for `tERS` time during the BLOCK ERASE operation.
> The GET FEATURE (0Fh) command can be used to monitor the status of the operation.
> The command sequence for the BLOCK ERASE operation is as follows:
>
> - 06h (WRITE ENABLE command)
> - D8h (BLOCK ERASE command)
> - 0Fh (GET FEATURE command to read the status register)

[[MT29F_Datasheet.pdf#page=37&selection=19,0,37,34|MT29F_Datasheet, page 37]]

# Timing Characteristics

Table 21: PROGRAM/READ/ERASE Characteristics

**ECC Disabled**

| Parameter                   | Symbol   | Typical | Max | Unit |
| --------------------------- | -------- | ------- | --- | ---- |
| `BLOCK_ERASE`               | `tERS `  | 2       | 10  | ms   |
| `PROGRAM_PAGE`              | `tPROG`  | 200     | 600 | μs   |
| `PAGE_READ`                 | `tRD`    | -       | 25  | μs   |
| Data transfer time to cache | `tRCBSY` | -       | 5   | μs   |

**ECC Enabled**

| Parameter                   | Symbol   | Typical | Max | Unit |
| --------------------------- | -------- | ------- | --- | ---- |
| `BLOCK_ERASE`               | `tERS `  | 2       | 10  | ms   |
| `PROGRAM_PAGE`              | `tPROG`  | 220     | 600 | μs   |
| `PAGE_READ`                 | `tRD`    | 80      | 115 | μs   |
| Data transfer time to cache | `tRCBSY` | 80      | 100 | μs   |
