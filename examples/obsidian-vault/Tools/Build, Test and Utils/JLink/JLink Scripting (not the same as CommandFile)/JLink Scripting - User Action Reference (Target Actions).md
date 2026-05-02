---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# Ozone Debugger Actions Reference

This is a quick reference for common script functions available in the Segger Ozone
debugger.

## J-Link Actions (Exec.*)

| Action | Description | Arguments | Return Value | Notes |
| --- | --- | --- | --- | --- |
| **Exec.Connect** | Establish a J-Link connection to the target. | – |  | Typically invoked during debug start. GUI: none. |
| **Exec.Reset** | Perform a hardware reset via J-Link. | – |  | GUI: none. |
| **Exec.Download** | Download a program/data file to target memory. | `sFilePath` (program/data path) |  | See “Download Behavior Comparison”. GUI: none. |
| **Exec.Command** | Execute a J-Link command string. | `sCommand` |  | See J-Link User Guide for commands. GUI: none. |
| **Exec.AddCommandOnOpen** | Schedule a J-Link command to run **before/after** opening the connection. | `sCommand`; `BeforeNotAfterOpen` (1=before, 0=after) |  | Call from `OnProjectLoad()` only. GUI: none. |

## Breakpoint Actions

Actions for controlling breakpoints.

| Action | Description | Arguments | Notes |
| --- | --- | --- | --- |
| **Break.Set** | Set an instruction breakpoint. | `Address` (U64) | GUI: Breakpoint Window → Set/Clear (Ctrl+Alt+B). |
| **Break.SetEx** | Set an instruction breakpoint with a specific type. | `Address` (U64); `Type` (implementation) | Type: see Breakpoint Implementation Types. GUI: none. |
| **Break.SetOnSrc** | Set a source breakpoint. | `sLocation` (e.g., `Reset_Handler`, `main.c:100`) | GUI: Breakpoint Window → Set/Clear. |
| **Break.SetOnSrcEx** | Set a source breakpoint with a specific type. | `sLocation`; `Type` | GUI: Breakpoint Window → Set/Clear. |
| **Break.SetType** | Restrict an existing breakpoint’s implementation type. | `sLocation` (source or address); `Type` | GUI: Breakpoint Window → Edit (F8). |
| **Break.Clear** | Clear an instruction breakpoint. | `Address` (U64) | GUI: Breakpoint Window → Set/Clear. |
| **Break.ClearOnSrc** | Clear a source breakpoint. | `sLocation` | GUI: Breakpoint Window → Set/Clear. |
| **Break.Enable** | Enable an instruction breakpoint. | `Address` (U64) | GUI: Breakpoint Window → Enable (Ctrl+F9). |
| **Break.Disable** | Disable an instruction breakpoint. | `Address` (U64) | GUI: Breakpoint Window → Disable (Ctrl+F9). |
| **Break.EnableOnSrc** | Enable a source breakpoint. | `sLocation` | GUI: Breakpoint Window → Enable. |
| **Break.DisableOnSrc** | Disable a source breakpoint. | `sLocation` | GUI: Breakpoint Window → Disable. |
| **Break.Edit** | Edit advanced breakpoint properties. | `sLocation`; `sCondition` (expr); `DoTriggerOnChange` (0/1); `SkipCount` (int); `sTaskFilter` (RTOS task name/ID); `sConsoleMsg`; `sMsgBoxMsg` | `sTaskFilter` requires an RTOS plugin (see Project.SetOSPlugin). GUI: Breakpoint Window → Edit (F8). |
| **Break.SetOnData** | Set a data breakpoint. | `Address`; `AddressMask`; `AccessType`; `AccessSize`; `MatchValue`; `ValueMask` | Use mask fields to watch ranges/patterns. GUI: Breakpoint Window → Set (Ctrl+Alt+D). |
| **Break.ClearOnData** | Clear a data breakpoint. | Same parameters as `Break.SetOnData` | GUI: Breakpoint Window → Clear. |
| **Break.ClearAll** | Clear all breakpoints. | – | GUI: Breakpoint Toolbar → Clear All Breakpoints. |
| **Break.ClearAllOnData** | Clear all data breakpoints. | – | GUI: Breakpoint Toolbar → Clear All Data Breakpoints. |
| **Break.EnableOnData** | Enable a data breakpoint. | Same parameters as `Break.SetOnData` | GUI: Breakpoint Window → Enable. |
| **Break.DisableOnData** | Disable a data breakpoint. | Same parameters as `Break.SetOnData` | GUI: Breakpoint Window → Disable. |
| **Break.EditOnData** | Edit a data breakpoint. | Same parameters as `Break.SetOnData` | GUI: Breakpoint Window → Edit (F8). |
| **Break.SetOnSymbol** | Set a data breakpoint on a symbol. | `sSymbolName`; `AccessType`; `AccessSize`; `MatchValue`; `ValueMask` | GUI: Breakpoint Window → Set (Ctrl+Alt+D). |
| **Break.OnChange** | Set a data breakpoint that triggers on value change. | `sSymbolName` | GUI: Source Viewer → Break On Change. |
| **Break.ClearOnSymbol** | Clear a data breakpoint on a symbol. | `sSymbolName`; `AccessType`; `AccessSize`; `MatchValue`; `ValueMask` | GUI: Breakpoint Window → Clear. |
| **Break.EnableOnSymbol** | Enable a symbol data breakpoint. | `sSymbolName`; `AccessType`; `AccessSize`; `MatchValue`; `ValueMask` | GUI: Breakpoint Window → Enable. |
| **Break.DisableOnSymbol** | Disable a symbol data breakpoint. | `sSymbolName`; `AccessType`; `AccessSize`; `MatchValue`; `ValueMask` | GUI: Breakpoint Window → Disable. |
| **Break.EditOnSymbol** | Edit a symbol data breakpoint. | `sSymbolName`; `AccessType`; `AccessSize`; `MatchValue`; `ValueMask` | GUI: Breakpoint Window → Edit (F8). |
| **Break.SetCommand** | Assign a script callback to a breakpoint (on hit). | `sLocation`; `sFuncName` | **Not supported for data breakpoints** (HW limitation). GUI: Breakpoint Window → Edit (F8). |
| **Break.SetCmdOnAddr** | Assign a script callback to a breakpoint at an address. | `Address`; `sFuncName` | **Not supported for data breakpoints**. GUI: Breakpoint Window → Edit (F8). |
| **Break.SetVectorCatch** | Edit vector catch state via bitmask. | `IndexMask` (bits map to Breakpoints/Tracepoints rows) | GUI: Breakpoints/Tracepoints → Vector Catches. |

## Utility Actions

Helper functions for logging and script control.

| Action | Description |
| --- | --- |
| `Util.Log(s)` | Prints a message to the console window. |
| `Util.LogHex(s, val)` | Prints a formatted hex message to the console window. |
| `Util.Error(s)` | Shows an error message box and stops the debug session. |
| `Util.Sleep(ms)` | Pauses the current operation for a given amount of time. |

## Target Actions

| Action | Description | Arguments | Return Value | Notes |
| --- | --- | --- | --- | --- |
| **Target.AddMemorySegment** | Adds a memory segment to the memory map. | `sName` (segment name), `Addr` (base address), `Size` (bytes) | `0` on success, `-1` on error | GUI: Memory Usage Window → Context Menu → Edit Regions |
| **Target.EraseChip** | Erases all FLASH memory by writing `0xFF`. | – | `0` on success, `-1` on error | GUI: None |
| **Target.FillMemory** | Fills a block of memory with a value. | `Address` (start), `Size` (bytes), `FillValue` (U8) | `0` on success, `-1` on error | GUI: Memory Window → Context Menu → Fill (Ctrl+I) |
| **Target.FillMemoryEx** | Fills a block with a value using a word width. | `Address`, `Size` (bytes), `Width` (1,2,3,4,8), `FillValue` | `0` on success, `-1` on error | Useful for frame buffers or patterned memory fills. GUI: Memory Window → Context Menu → Fill |
| **Target.GetReg** | Reads a target register. | `sReg` (register name, window path, or system descriptor) | Register value on success, `-1` on error | GUI: Register Window |
| **Target.LoadMemory** | Downloads a binary file to target memory. | `sFilePath` (\*.bin), `Address` (download address) | `0` on success, `-1` on error | GUI: Memory Window → Context Menu → Load |
| **Target.LoadMemoryMap** | Loads a memory map from file. | `sFilePath` (Embedded Studio format) | `0` on success, `-1` on error | GUI: Memory Usage Window → Context Menu → Edit Regions |
| **Target.PowerOn** | Toggles power supply via debug probe. | `On` (1=on, 0=off) | `0` on success, `-1` on error | GUI: Main Menu → Edit → System Variables (Ctrl+Alt+V) |
| **Target.ReadU32** | Reads a 32-bit word from memory. | `Address` (U64) | Memory value on success, `-1` on error | GUI: Memory Window |
| **Target.ReadU16** | Reads a 16-bit half-word from memory. | `Address` (U64) | Memory value on success, `-1` on error | GUI: Memory Window |
| **Target.ReadU8** | Reads an 8-bit byte from memory. | `Address` (U64) | Memory value on success, `-1` on error | GUI: Memory Window |
| **Target.SaveMemory** | Saves a block of memory to a binary file. | `sFilePath` (\*.bin), `Address` (start), `Size` (bytes) | `0` on success, `-1` on error | GUI: Memory Window → Context Menu → Save |
| **Target.SetAccessWidth** | Sets default access width for memory. | `AccessWidth` (see Memory Access Widths) | `0` on success, `-1` on error | GUI: Main Menu → Tools → System Variables |
| **Target.SetEndianess** | Configures debugger’s endianess. | `BigEndian` (0=little, else big) | `0` on success, `-1` on error | GUI: Tools → J-Link Settings → Target Device |
| **Target.SetReg** | Writes a target register. | `sReg` (name, path, or system register), `Value` (U32) | `0` on success, `-1` on error | GUI: Register Window |
| **Target.WriteU32** | Writes a 32-bit word to memory. | `Address` (U64), `Value` (U32) | `0` on success, `-1` on error | GUI: Memory Window |
| **Target.WriteU16** | Writes a 16-bit half-word to memory. | `Address` (U64), `Value` (U16) | `0` on success, `-1` on error | GUI: Memory Window |
| **Target.WriteU8** | Writes an 8-bit byte to memory. | `Address` (U64), `Value` (U8) | `0` on success, `-1` on error | GUI: Memory Window |

## Debug Actions

| Action | Description | Arguments | Return Value | Notes |
| --- | --- | --- | --- | --- |
| **Debug.Connect** | Connects the debugger to the target. | – | `0` on success, `-1` on error | GUI: Toolbar → Connect (F11) |
| **Debug.Continue** | Resumes program execution. | – | `0` on success, `-1` on error | GUI: Toolbar → Go (F5) |
| **Debug.Disconnect** | Disconnects the debugger from the target. | – | `0` on success, `-1` on error | GUI: Toolbar → Disconnect |
| **Debug.Download** | Downloads the program file to the target. | – | `0` on success, `-1` on error | GUI: Toolbar → Download |
| **Debug.Halt** | Halts program execution. | – | `0` on success, `-1` on error | GUI: Toolbar → Halt (F6) |
| **Debug.IsHalted** | Queries the program state. | – | `1` if halted, `0` if running, `-1` on error | GUI: Status bar indicator |
| **Debug.Reset** | Resets the target. | – | `0` on success, `-1` on error | GUI: Toolbar → Reset (Ctrl+F2) |
| **Debug.ReadIntoInstCache** | Reads a code block into the instruction cache. | `Addr` (U64), `NumBytes` (U32) | `0` on success, `-1` on error | No direct GUI equivalent |
| **Debug.RunTo** | Runs to a specific address or source line. | `Addr` (U64) or `sLine` (string) | `0` on success, `-1` on error | GUI: Context Menu → Run To Cursor (Ctrl+F10) |
| **Debug.SetConnectMode** | Sets the connection mode. | `Mode` (0=Normal, 1=HotAttach, 2=PreReset) | `0` on success, `-1` on error | GUI: Tools → J-Link Settings → Connection |
| **Debug.Start** | Starts the debug session. | – | `0` on success, `-1` on error | GUI: Toolbar → Start Debugging (Ctrl+F5) |
| **Debug.Stop** | Stops the debug session. | – | `0` on success, `-1` on error | GUI: Toolbar → Stop Debugging (Shift+F5) |
| **Debug.StepInto** | Steps into the current function. | – | `0` on success, `-1` on error | GUI: Toolbar → Step Into (F11) |
| **Debug.StepOver** | Steps over the current function. | – | `0` on success, `-1` on error | GUI: Toolbar → Step Over (F10) |
| **Debug.StepOut** | Steps out of the current function. | – | `0` on success, `-1` on error | GUI: Toolbar → Step Out (Shift+F11) |
| **Debug.SetNextPC** | Sets the next machine instruction to execute. | `Addr` (U64) | `0` on success, `-1` on error | GUI: Disassembly Window → Set Next Statement |
| **Debug.SetNextStatement** | Sets the next source statement to execute. | `sLine` (string, source location) | `0` on success, `-1` on error | GUI: Source Window → Set Next Statement |
| **Debug.SetResetMode** | Sets the reset mode. | `Mode` (0=Normal, 1=Core, 2=Peripheral, etc.) | `0` on success, `-1` on error | GUI: Tools → J-Link Settings → Reset |
| **Debug.SaveSnapshot** | Saves a debug snapshot. | `sFilePath` | `0` on success, `-1` on error | GUI: File → Save Snapshot |
| **Debug.LoadSnapshot** | Loads a debug snapshot. | `sFilePath` | `0` on success, `-1` on error | GUI: File → Load Snapshot |

## ELF Actions

| Action | Description | Arguments | Return Value | Notes |
| --- | --- | --- | --- | --- |
| **Elf.GetBaseAddr** | Returns the ELF download address. | – | Address (U64) | Used internally for relocation handling. |
| **Elf.GetFileClass** | Returns ELF class. | – | `1` (32-bit), `2` (64-bit) | No GUI equivalent. |
| **Elf.GetEntryPointPC** | Returns ELF entry point PC. | – | Address (U64) | Equivalent to reset vector for many MCUs. |
| **Elf.GetEntryFuncPC** | Returns PC of program’s entry function. | – | Address (U64) | May differ from `GetEntryPointPC`. |
| **Elf.GetExprValue** | Evaluates a symbol expression in ELF. | `sExpr` (string) | Evaluated result (U32/U64) | No GUI equivalent. |
| **Elf.GetEndianess** | Returns ELF endianess. | – | `0` = little, `1` = big | GUI: Tools → J-Link Settings (Target Info) |
| **Elf.SetConfig** | Configures ELF parser behavior. | `sKey`, `sValue` (strings) | `0` on success, `-1` on error | Advanced use only. |
| **Elf.PrintSectionInfo** | Prints ELF section info. | – | `0` on success | Output goes to console window. |

## Other Actions

| Action | Description | Arguments | Return Value | Notes |
| --- | --- | --- | --- | --- |
| **Trace.SetPoint** | Sets a tracepoint at a given address or symbol. | `Addr` (U64) or `sSymbol` (string) | `0` on success, `-1` on error | GUI: Source/Disassembly Window → Set Tracepoint |
| **Trace.ClearPoint** | Clears a tracepoint. | `Addr` (U64) or `sSymbol` | `0` on success, `-1` on error | GUI: Source/Disassembly Window → Clear Tracepoint |
| **Trace.EnablePoint** | Enables a previously defined tracepoint. | `Addr` (U64) or `sSymbol` | `0` on success, `-1` on error | GUI: Breakpoints Window → Enable Tracepoint |
| **Trace.DisablePoint** | Disables a tracepoint without removing it. | `Addr` (U64) or `sSymbol` | `0` on success, `-1` on error | GUI: Breakpoints Window → Disable Tracepoint |
| **Trace.ClearAllPoints** | Removes all tracepoints. | – | `0` on success, `-1` on error | GUI: Breakpoints Window → Clear All Tracepoints |
| **Trace.Reset** | Resets all trace data. | – | `0` on success, `-1` on error | GUI: Trace Window → Reset |

| Action | Description | Arguments | Return Value | Notes |
| --- | --- | --- | --- | --- |
| **Watch.Add** | Adds an expression to the Watch Window. | `sExpr` (expression string) | `0` on success, `-1` on error | GUI: Watch Window → Add Expression |
| **Watch.Insert** | Inserts an expression at a specific index. | `sExpr` (expression string), `Index` (int) | `0` on success, `-1` on error | GUI: Watch Window → Insert Expression |
| **Watch.Remove** | Removes an expression from the Watch Window. | `Index` (int) or `sExpr` (string) | `0` on success, `-1` on error | GUI: Watch Window → Remove Expression |
| **Watch.Quick** | Opens an expression in the Quick Watch dialog. | `sExpr` (expression string) | `0` on success, `-1` on error | GUI: Quick Watch Dialog (Ctrl+Alt+Q) |

| Action | Description | Arguments | Return Value | Notes |
| --- | --- | --- | --- | --- |
| **Snapshot.LoadReg** | Loads a register value from a snapshot into the target. | `sReg` (register name), `sSnapshot` (file path) | `0` on success, `-1` on error | GUI: File → Load Snapshot (Registers option) |
| **Snapshot.LoadU32** | Loads a 32-bit memory value from a snapshot into the target. | `Addr` (U64), `sSnapshot` (file path) | `0` on success, `-1` on error | GUI: File → Load Snapshot (Memory option) |
| **Snapshot.ReadReg** | Reads a register value from a snapshot. | `sReg` (register name), `sSnapshot` (file path) | Register value on success, `-1` on error | Used for comparing saved vs. current state. |
| **Snapshot.ReadU32** | Reads a 32-bit memory value from a snapshot. | `Addr` (U64), `sSnapshot` (file path) | Memory value on success, `-1` on error | Useful for offline inspection. |
| **Snapshot.SaveReg** | Saves a register value to a snapshot file. | `sReg` (register name), `sSnapshot` (file path) | `0` on success, `-1` on error | GUI: File → Save Snapshot (Registers option) |
| **Snapshot.SaveU32** | Saves a 32-bit memory value to a snapshot file. | `Addr` (U64), `sSnapshot` (file path) | `0` on success, `-1` on error | GUI: File → Save Snapshot (Memory option) |
