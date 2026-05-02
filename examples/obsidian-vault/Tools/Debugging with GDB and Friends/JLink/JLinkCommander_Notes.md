---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# J-Link Commander Notes

J-Link Commander (JLink.exe / JLinkExe) is a free, command-line based utility for
verifying the functionality of a J-Link and for simple analysis of the target system.
It supports commands like memory dump, halt, step, go, etc.

## Commands

Commands are case-insensitive.

### Basic

| Command (long) | Command (short) | Explanation |
| --- | --- | --- |
| `?` | `?` | Show information about all or specific commands |
| `Exit` | `Exit` | Close J-Link connection and quit |
| `ExitOnError` | `EoE` | Exit on error |
| `Sleep` | `Sleep` | Waits the given time (in milliseconds) |
| `Log` | `Log` | Enables log to file |
| `ExpDevList` | `ExpDevList` | Export device names from DLL internal device list to text file |
| `ExpDevListXML` | `ExpDevListXML` | Export device names from DLL internal device list to XML file |

### Configuration - J-Link

| Command (long) | Command (short) | Explanation |
| --- | --- | --- |
| `USB` | `USB` | Connect to J-Link via USB |
| `IP` | `IP` | Connect to J-Link via TCP/IP or to Remote Server |
| `SelectProbe` | `SelPrb` | Show list of all connected probes via specified interface. The Probe to communicate with can then be selected |
| `ShowEmuList` | `ShowEmuList` | Show list of all connected probes via specified interface |
| `Power` | `Power` | Switch power supply for target (5V-Supply pin) on or off |
| `VTREF` | `VTREF` | Set fixed value for VTref on J-Link |
| `VCOM` | `VCOM` | Enable/disable VCOM Takes effect after power cycle of the probe |
| `BootMode` | `BootMode` | Select boot mode of the connected probe. |
| `Reboot` | `Reboot` | Reboot the connected probe. |
| `Uptime` | `Uptime` | Show Probe uptime since boot. |
| `ShowFWInfo` | `F` | Show firmware info |
| `ShowHWStatus` | `St` | Show hardware status |
| `License` | `License` | Show list of all available license commands |
| `IPAddr` | `IPAddr` | Show/Assign IP address and subnetmask of/to connected Probe |
| `GWAddr` | `GWAddr` | Show/Assign network gateway address of/to connected Probe |
| `DNSAddr` | `DNSAddr` | Show/Assign network DNS server address of/to connected Probe |
| `ShowConf` | `Conf` | Show configuration of the connected Probe |
| `Calibrate` | `Calib` | Calibrate the target current measurement |

### Configuration - Target (CPU)

| Command (long) | Command (short) | Explanation |
| --- | --- | --- |
| `Connect` | `Con` | Connect to target device |
| `Device` | `Device` | Select specific device J-Link shall connect to |
| `SelectInterface` | `SI` | Select target interface |
| `Speed` | `Speed` | Set target interface speed |
| `LE` | `LE` | Change mode to little endian |
| `BE` | `BE` | Change mode to big endian |

### Debugging

| Command (long) | Command (short) | Explanation |
| --- | --- | --- |
| `Halt` | `H` | Halt CPU |
| `IsHalted` | `IH` | Return current CPU state |
| `WaitHalt` | `WH` | Wait until CPU is halted or timeout is reached |
| `Go` | `G` | Start CPU if halted |
| `Reset` | `R` | Reset CPU |
| `ResetX` | `RX` | Reset CPU with delay after reset |
| `RSetType` | `Rst` | Set the current reset type |
| `Step` | `S` | Execute step(s) on the CPU |
| `IS` | `IS` | Identify length of scan chain select register |
| `MS` | `MS` | Measure length of scan chain |
| `Regs` | `Regs` | Display CPU register contents |
| `RReg` | `RReg` | Read register |
| `WReg` | `WReg` | Write register |
| `MoE` | `MoE` | Shows mode-of-entry (CPU halt reason) |
| `SetBP` | `SetBP` | Set breakpoint |
| `ClearBP` | `ClearBP` | Clear breakpoint |
| `SetWP` | `SetWP` | Set watchpoint |
| `ClearWP` | `ClearWP` | Clear watchpoint |
| `VCatch` | `VC` | Write vector catch |
| `SetPC` | `SetPC` | Set the PC to specified value |
| `ReadAP` | `ReadAP` | Read CoreSight AP register |
| `WriteAP` | `WriteAP` | Write CoreSight AP register |
| `ReadDP` | `ReadDP` | Read CoreSight DP register |
| `WriteDP` | `WriteDP` | Write CoreSight DP register |
| `RCP15Ex` | `RCE` | Read CP15 register |
| `WCP15Ex` | `WCE` | Write CP15 register |
| `Term` | `Term` | Visualize printf output using DCC (SEGGER DCC handler running on target) |

### Debugging - Memory operation

| Command (long) | Command (short) | Explanation |
| --- | --- | --- |
| `Mem` | `Mem` | Read memory and show corresponding ASCII values |
| `Mem8` | `Mem8` | Read 8-bit items |
| `Mem16` | `Mem16` | Read 16-bit items |
| `Mem32` | `Mem32` | Read 32-bit items |
| `Write1` | `W1` | Write 8-bit items |
| `Write2` | `W2` | Write 16-bit items |
| `Write4` | `W4` | Write 32-bit items |
| `Write8` | `W8` | Write 64-bit items |

### Debugging - JTAG related

| Command (long) | Command (short) | Explanation |
| --- | --- | --- |
| `JTAGConf` | `JTAGConf` | Set number of IR/DR bits before Target device |
| `JTAGId` | `I` | Read JTAG Id |
| `WJTAGIR` | `WJIR` | Write JTAG command (IR) |
| `WJTAGDR` | `WJDR` | Write JTAG data (DR) |
| `WJTAGRaw` | `WJR` | Write Raw JTAG data |
| `ResetTAP` | `RTAP` | Reset TAP Controller using state machine (111110) |
| `ResetTRST` | `RT` | Reset TAP Controller using nTRST |

### Flash programming

| Command (long) | Command (short) | Explanation |
| --- | --- | --- |
| `Erase` | `Erase` | Erase flash (range) of selected device |
| `LoadFile` | `LoadFile` | Load data file into target memory |
| `SaveBin` | `SaveBin` | Save target memory range into binary file |
| `VerifyBin` | `VerifyBin` | Verfy if specified bin file is at the specified target memory location |

## Command Line Options

| Command line option | Explanation |
| --- | --- |
| **Batch mode specific** |  |
| `-AutoConnect <Value>` | `Value==1`: Forces the J-Link Commander to connect to the target, automatically. |
| `-CommandFile <CommandFilePath>` | Selects a J-Link Command file which contains the commands for batch mode / auto execution. |
| `-ExitOnError <Value>` | `Value==1`: Exit J-Link Commander on Error. |
| `-NoGui <Value>` | `Value==1`: Suppresses GUI dialogs. |
| **J-Link connection specific** |  |
| `-IP <IP/Tunnel/SerialNo/Nickname>` | Selects a specific J-Link (via IP/Tunnel/SerialNo/Nickname) to connect to via TCP/IP. |
| `-USB <SerialNo/Nickname>` | Selects a specific J-Link (via its serial number) or nickname to connect to. |
| **Device connection specific** |  |
| `-Device <DeviceName>` | Selects the target device. |
| `-If <TargetInterface>` | Configures the target interface. |
| `-JLinkScriptFile <ScriptFilePath>` | Selects a specific J-Link script file to use. |
| `-JTAGConf <IRPre>,<DRPre>` | Configures the JTAG scan configuration of the target device. |
| `-Speed <InterfaceSpeed>` | Configures the target interface speed. |
| **Misc** |  |
| `-Log <LogFilePath>` | Sets a path a J-Link log file is to be created. |
| `-RTTTelnetPort <PortNo>` | Set the J-Link RTT Telnet port to `<PortNo>` |

**Example:** `JLink.exe -device CC2538SF53 -if JTAG -speed 4000 -jtagconf -1,-1
-autoconnect 1 -CommandFile C:\Work\JLinkCommandFile.jlink`

## Usage and Examples

### Using J-Link Command Files

J-Link Commander can be used in batch mode by passing a command file.
The syntax in the command file is the same as in the interactive mode (one line per
command). C-style comments (`//` and `/* ... */`) are supported.

**Example:** `JLink.exe -device STM32F103ZE -CommandFile C:\CommandFile.jlink`

*Contents of `CommandFile.jlink`:*

```jlink
si 1                                  // Select interface
speed 4000                            // Select speed
/* Perform reset and halt */
r
h
loadfile C:\firmware.bin 0x08000000   // Load data file
```

### Perform Flash Download

1. Connect J-Link to the PC and the target system.

2. Start J-Link Commander and enter the required settings (device, interface, etc.).

3. Type the following commands:

   * `r` (resets the target)

   * `loadfile <PathToFile> [<DestAddr>]`

### Reading from another MEM-AP

This example shows how to read data via a MEM-AP while the device is running.

**Assumptions:**

* MCU with a core AP & another AP for background memory access.

* AP[0]: AHB-AP: CPU

* AP[1]: APB-AP: System AP (for background access)

**Example sequence:**

```c
WriteDP 2 0x01000000 // SELECT register: Select AP[1] bank 0
WriteAP 0 0x80006012 // CSW register: DbgSwEnable: Enable, AddrInc: Increment, Size: 32 bits
WriteAP 1 0x00000000 // TAR register: Select address to start reading from
ReadAP  3            // DRW register: Read @0x0000_0000
ReadAP  3            // DRW register: Read @0x0000_0004
...
```

### Setup External CFI NOR Flash

Example sequence for a ST STM32F103ZE device:

```jlink
r
speed 1000
exec setcfiflash 0x64000000 - 0x64FFFFFF
exec setworkram 0x20000000 - 0x2000FFFF
w4 0x40021014 0x00000114 // RCC_AHBENR, FSMC clock enable
w4 0x40021018 0x000001FD // GPIOD~G clock enable
w4 0x40011400 0xB4BB44BB // GPIOD low config, NOE, NWE => Output, NWAIT => Input
w4 0x40011404 0xBBBBBBBB // GPIOD high config, A16-A18
w4 0x40011800 0xBBBBBBBB // GPIOE low config, A19-A23
w4 0x40011804 0xBBBBBBBB // GPIOE high config, D5-D12
w4 0x40011C00 0x44BBBBBB // GPIOF low config, A0-A5
w4 0x40011C04 0xBBBB4444 // GPIOF high config, A6-A9
w4 0x40012000 0x44BBBBBB // GPIOG low config, A10-A15
w4 0x40012004 0x444B4BB4 // GPIOG high config, NE2 => output
w4 0xA0000008 0x00001059 // CS control reg 2, 16-bit, write enable, Type: NOR flash
w4 0xA000000C 0x10000505 // CS2 timing reg (read access)
w4 0xA000010C 0x10000505 // CS2 timing reg (write access)
speed 4000
mem 0x64000000 100
loadfile C:\STMB672_STM32F103ZE_TestBlinky.bin 0x64000000
mem 0x64000000 100
```
