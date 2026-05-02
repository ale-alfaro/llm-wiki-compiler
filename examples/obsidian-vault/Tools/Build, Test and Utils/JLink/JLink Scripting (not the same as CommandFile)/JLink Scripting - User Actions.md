---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
Two main categories of Actions:

* **Project Actions** → things that modify/configure Ozone itself (project setup, tools,
  window handling, preferences, etc.).

* **Target Actions** → things that affect the debuggee (debug control, ELF info, target
  memory/registers, snapshots, trace, etc.).

Here’s the Markdown conversion, reorganized accordingly:

* * *

# Project Actions (Ozone-side)

## 7.8.4 Edit Actions

| Action | Description |
| --- | --- |
| Edit.Color | Edits an application color. |
| Edit.DisplayFormat | Edits an item’s integer value display format. |
| Edit.Font | Edits an application font. |
| Edit.MemZone | Edits the memory zone of a watched expression. |
| Edit.Preference | Edits a user preference. |
| Edit.RefreshRate | Edits the refresh rate of a window or watched expression. |
| Edit.SysVar | Edits a system variable. |

## 7.8.7 File Actions

| Action | Description |
| --- | --- |
| File.Close | Closes a source code document. |
| File.CloseAll | Closes all open source code documents. |
| File.CloseAllButThis | Closes all but the active source code document. |
| File.CloseAllUnedited | Closes all unedited documents. |
| File.Exit | Closes the application. |
| File.Find | Searches for a text pattern. |
| File.Load | Loads a file. |
| File.NewProject | Creates a new project. |
| File.NewProjectWizard | Opens the Project Wizard. |
| File.Open | Opens a file. |
| File.OpenRecent | Reopens a recently opened program file. |
| File.OpenProjectInEditor | Opens the project file within the source viewer. |
| File.Reload | Reloads a file from disk. |
| File.SaveProjectAs | Saves the project file under a new file path to disk. |
| File.Save | Saves an open document to disk. |
| File.SaveAs | Saves an open document under a new file path to disk. |
| File.SaveCopyAs | Saves a copy of an open document to disk. |
| File.SaveAll | Saves all modified files. |
| File.SelectInExplorer | Selects a source file within the file explorer. |

## 7.8.8 Find Actions

| Action | Description |
| --- | --- |
| Find.Function | Locates a program function. |
| Find.GlobalData | Locates a global symbol. |
| Find.SourceFile | Locates a source file. |
| Find.Text | Opens the Quick Find Widget. |
| Find.TextInFiles | Opens the Find In Files Dialog. |
| Find.TextInTrace | Opens the Find In Trace Dialog. |

## 7.8.9 Help Actions

| Action | Description |
| --- | --- |
| Help.About | Shows the About Dialog. |
| Help.Commands | Prints the command help to the Console Window. |
| Help.UserGuide | Displays the user guide and reference manual. |
| Help.ReleaseNotes | Displays the release notes. |
| Help.LicenseManager | Opens the license manager. |

## 7.8.13 Project Actions

| Action | Description |
| --- | --- |
| Project.AddSvdFile | Adds a register set description file. |
| Project.AddRTTSearchRange | RTT configuration command. |
| Project.AddFileAlias | Sets a file path alias. |
| Project.AddPathSubstitute | Replaces substrings within source file paths. |
| Project.AddRootPath | Specifies the program’s root path. |
| Project.AddSearchPath | Adds a path to the program’s list of search paths. |
| Project.ConfigSWO | Configures the Serial Wire Output (SWO) interface. |
| Project.ConfigSemihosting | Configures the Semihosting interface. |
| Project.ConfigDisassembly | Edits disassembler options. |
| Project.DisableSessionSave | Disables saving of individual session information. |
| Project.RelocateSymbols | Relocates one or multiple symbols. |
| Project.SetDevice | Specifies the target device. |
| Project.SetFlashLoader | Specifies the flash loader(s) to be used for one or more flash banks. |
| Project.SetHostIF | Specifies the host interface. |
| Project.SetTargetIF | Specifies the target interface. |
| Project.SetTIFSpeed | Specifies the target interface speed. |
| Project.SetJTAGConfig | Configures the JTAG target interface. |
| Project.SetTraceSource | Selects the trace source to use. |
| Project.SetTracePortWidth | Specifies the number of trace pins comprising the TP. |
| Project.SetTraceTiming | Configures the trace pin sampling delays. |
| Project.SetRTT | Enables or disables Real Time Transfer (RTT). |
| Project.SetCorePlugin | Specifies the file path of the target support plugin. |
| Project.SetDisassemblyPlugin | Specifies the disassembly support plugin to be used. |
| Project.SetSmartViewPlugin | Specifies the SmartView plugin to be used. |
| Project.SetOSPlugin | Specifies the RTOS awareness plugin to be used. |
| Project.SetBPType | Sets the allowed breakpoint implementation type. |
| Project.SetMemZoneRunning | Sets the default zone accessed when the CPU is running. |
| Project.SetJLinkScript | Sets the J-Link-Script to be executed on debug start. |
| Project.SetJLinkLogFile | Sets the text file that receives J-Link/J-Trace logging output. |
| Project.SetConsoleLogFile | Sets the text file that receives console window output. |
| Project.SetTerminalLogFile | Sets the text file that receives terminal window output. |

## 7.8.20 Tools Actions

| Action | Description |
| --- | --- |
| Tools.JLinkSettings | Opens the J-Link Settings Dialog. |
| Tools.Preferences | Opens the User Preference Dialog. |
| Tools.SemihostingSettings | Opens the Semihosting Settings Dialog. |
| Tools.SysVars | Opens the System Variable Editor. |
| Tools.TraceSettings | Opens the Trace Settings Dialog. |

## 7.8.21 Toolbar Actions

| Action | Description |
| --- | --- |
| Toolbar.Show | Displays a toolbar. |
| Toolbar.Close | Hides a toolbar. |
| Toolbar.AddCustomButton | Adds a button to the Custom Toolbar. |
| Toolbar.RemoveCustomButton | Removes a button from the Custom Toolbar. |
| Toolbar.EnableCustomButton | Enables a button in the Custom Toolbar. |
| Toolbar.DisableCustomButton | Disables a button in the Custom Toolbar. |
| Toolbar.PressButton | Performs the same action as when clicking on a button in a toolbar. |

## 7.8.24 Window Actions

| Action | Description |
| --- | --- |
| Window.Add | Adds a symbol to a window. |
| Window.Close | Closes a window. |
| Window.CloseAll | Closes all windows. |
| Window.Clear | Clears a window. |
| Window.CollapseAll | Collapses all items of a window. |
| Window.ExpandAll | Expands all items of a window. |
| Window.Export | Exports the window content to file. |
| Window.Insert | Inserts a symbol into a window. |
| Window.Remove | Removes a symbol from a window. |
| Window.Show | Shows a window. |
| Window.SetDisplayFormat | Sets a window’s integer value display format. |
| Window.ShowFullScreen | Toggles main window full screen mode. |
| Window.WaitForUpdateComplete | Waits until all debug windows have completed updating. |

* * *

# Target Actions (Debuggee-side)

## 7.8.1 Breakpoint Actions

| Action | Description |
| --- | --- |
| Break.Clear | Clears an instruction breakpoint. |
| Break.ClearOnSrc | Clears a source breakpoint. |
| Break.ClearOnData | Clears a data breakpoint. |
| Break.ClearOnSymbol | Clears a data breakpoint on a symbol. |
| Break.ClearAllOnData | Clears all data breakpoints. |
| Break.ClearAll | Clears all code breakpoints. |
| Break.Disable | Disables an instruction breakpoint. |
| Break.DisableOnSrc | Disables a source breakpoint. |
| Break.DisableOnData | Disables a data breakpoint. |
| Break.DisableOnSymbol | Disables a data breakpoint on a symbol. |
| Break.Enable | Enables an instruction breakpoint. |
| Break.EnableOnSrc | Enables a source breakpoint. |
| Break.EnableOnData | Enables a data breakpoint. |
| Break.EnableOnSymbol | Enables a data breakpoint on a symbol. |
| Break.Edit | Edits a breakpoint’s advanced properties. |
| Break.EditOnData | Edits a data breakpoint. |
| Break.EditOnSymbol | Edits a data breakpoint on a symbol. |
| Break.OnChange | Sets a data breakpoint on a symbol. |
| Break.Set | Sets an instruction breakpoint. |
| Break.SetEx | Sets an instruction breakpoint. |
| Break.SetOnSrc | Sets a source breakpoint. |
| Break.SetOnSrcEx | Sets a source breakpoint. |
| Break.SetType | Sets a breakpoint’s implementation type. |
| Break.SetCommand | Assigns a script callback function to a breakpoint. |
| Break.SetCmdOnAddr | Assigns a script callback function to a breakpoint. |
| Break.SetOnData | Sets a data breakpoint. |
| Break.SetOnSymbol | Sets a data breakpoint on a symbol. |
| Break.SetVectorCatch | Edits the vector catch state. |

* * *

## 7.8.2 Code Profile Actions

| Action | Description |
| --- | --- |
| Coverage.Exclude | Filters program entities from the code coverage statistic. |
| Coverage.Include | Re-adds program entities to the code coverage statistic. |
| Coverage.ExcludeNOPs | Filters trailing NOPs from the code coverage statistic. |

* * *

## 7.8.3 Debug Actions

| Action | Description |
| --- | --- |
| Debug.Connect | Connects the debugger to the target. |
| Debug.Continue | Resumes program execution. |
| Debug.Disconnect | Disconnects the debugger from the target. |
| Debug.Download | Downloads the program file to the target. |
| Debug.Halt | Halts program execution. |
| Debug.IsHalted | Queries the program state. |
| Debug.Reset | Reset the program. |
| Debug.ReadIntoInstCache | Reads a code block into the instruction cache. |
| Debug.RunTo | Advances program execution to a particular location. |
| Debug.SetConnectMode | Sets the connection mode. |
| Debug.Start | Starts the debug session. |
| Debug.Stop | Stops the debug session. |
| Debug.StepInto | Steps into the current function. |
| Debug.StepOver | Steps over the current function. |
| Debug.StepOut | Steps out of the current function. |
| Debug.SetNextPC | Sets the next machine instruction to be executed. |
| Debug.SetNextStatement | Sets the next source statement to be executed. |
| Debug.SetResetMode | Sets the reset mode. |
| Debug.SaveSnapshot | Saves a debug snapshot. |
| Debug.LoadSnapshot | Loads a debug snapshot. |

* * *

## 7.8.5 ELF Actions

| Action | Description |
| --- | --- |
| Elf.GetBaseAddr | Returns the program file’s download address. |
| Elf.GetFileClass | Returns the ELF file class of the program file. |
| Elf.GetEntryPointPC | Returns the initial value of the program counter. |
| Elf.GetEntryFuncPC | Returns the first PC of the program’s entry function. |
| Elf.GetExprValue | Evaluates a symbol expression. |
| Elf.GetEndianess | Returns the program file’s byte order. |
| Elf.SetConfig | Configures the ELF parser. |
| Elf.PrintSectionInfo | Prints ELF file section information. |

* * *

## 7.8.6 Export Actions

| Action | Description |
| --- | --- |
| Export.CodeProfile | Exports code profile data. |
| Export.DataGraphs | Exports all data graphs to a CSV file. |
| Export.Disassembly | Exports program disassembly. |
| Export.PowerGraphs | Exports all power graphs to a CSV file. |
| Export.Trace | Exports instruction trace data to a CSV file. |

* * *

## 7.8.10 J-Link Actions

| Action | Description |
| --- | --- |
| Exec.AddCommandOnOpen | Schedules a J-Link command to be executed before/after opening connection. |
| Exec.Connect | Connects the debugger to the target. |
| Exec.Command | Executes a J-Link/J-Trace command. |
| Exec.Download | Downloads a program or data file to target memory. |
| Exec.Reset | Performs a hardware reset of the target. |

* * *

## 7.8.11 OS Actions

| Action | Description |
| --- | --- |
| OS.AddContextSwitchSymbol | Identifies a code symbol that executes a task switch. |

* * *

## 7.8.12 Process Actions

| Action | Description |
| --- | --- |
| Process.Exec | Spawns a process and executes an external application. |

* * *

## 7.8.14 Register Actions

| Action | Description |
| --- | --- |
| Register.Addr | Returns the memory location of a target register. |

\

## 7.8.15 Script Actions

| Action | Description |
| --- | --- |
| Script.DefineConst | Defines an integer constant for use in project script. |
| Script.Exec | Executes a project file script function. |

* * *

## 7.8.16 Show Actions

| Action | Description |
| --- | --- |
| Show.CallGraph | Displays the call graph of a function. |
| Show.Data | Displays the data location of a program variable. |
| Show.Definition | Displays the source code definition of a symbol. |
| Show.Declaration | Displays the source code declaration of a symbol. |
| Show.Disassembly | Displays the assembly code of an object. |
| Show.InstTrace | Displays a position in the instruction execution history. |
| Show.Line | Displays a text line in the active document. |
| Show.Memory | Displays a memory location. |
| Show.MemoryMap | Displays a symbol within the memory map of the target. |
| Show.NextResult | Displays the next search result item. |
| Show.PC | Displays the PC instruction in the Disassembly Window. |
| Show.PCLine | Displays the PC line in the Source Viewer. |
| Show.PrevResult | Displays the previous search result item. |
| Show.Source | Displays the source code location of an object. |
| Show.ValueData | Displays the symbol within the memory window. |
| Show.ValueDisassembly | Displays the symbol within the disassembly window. |
| Show.ValueSource | Displays the symbol within the source viewer. |

* * *

## 7.8.17 Snapshot Actions

| Action | Description |
| --- | --- |
| Snapshot.LoadReg | Reads a register from a snapshot and writes it to target. |
| Snapshot.LoadU32 | Reads a memory value from a snapshot and writes it to target. |
| Snapshot.ReadReg | Reads a register from a snapshot. |
| Snapshot.ReadU32 | Reads a memory value from a snapshot. |
| Snapshot.SaveReg | Saves a register to a snapshot. |
| Snapshot.SaveU32 | Saves a memory value to a snapshot. |

* * *

## 7.8.18 Target Actions

| Action | Description |
| --- | --- |
| Target.AddMemorySegment | Adds a memory segment to the memory map. |
| Target.EraseChip | Erases the target’s FLASH memory (to 0xFF). |
| Target.FillMemory | Fills a block of memory with a value. |
| Target.FillMemoryEx | Fills a block with a value and specific word width. |
| Target.GetReg | Reads a target register. |
| Target.LoadMemory | Downloads contents of a data file to target memory. |
| Target.LoadMemoryMap | Loads a memory map from a file. |
| Target.PowerOn | Toggles target power supply by J-Link/J-Trace. |
| Target.ReadU32 | Reads a word from memory. |
| Target.ReadU16 | Reads a half word from memory. |
| Target.ReadU8 | Reads a byte from memory. |
| Target.SaveMemory | Saves a block of memory to a binary data file. |
| Target.SetAccessWidth | Specifies the memory access width. |
| Target.SetEndianess | Configures debugger for data endianess. |
| Target.SetReg | Writes a target register. |
| Target.WriteU32 | Writes a word to memory. |
| Target.WriteU16 | Writes a half word to memory. |
| Target.WriteU8 | Writes a byte to memory. |

* * *

## 7.8.19 Timeline Actions

| Action | Description |
| --- | --- |
| Timeline.Reset | Resets trace and sampling data. |

* * *

## 7.8.22 Trace Actions

| Action | Description |
| --- | --- |
| Trace.SetPoint | Sets a tracepoint. |
| Trace.ClearPoint | Clears a tracepoint. |
| Trace.EnablePoint | Enables a tracepoint. |
| Trace.DisablePoint | Disables a tracepoint. |
| Trace.ClearAllPoints | Clears all tracepoints. |
| Trace.Reset | Resets instruction trace data. |

* * *

## 7.8.23 Utility Actions

| Action | Description |
| --- | --- |
| Util.Error | Shows an error message box and stops the debug session. |
| Util.Log | Prints a message to the console window. |
| Util.LogHex | Prints a formatted message to the console window. |
| Util.Sleep | Pauses the current operation for a given amount of time. |

* * *

## 7.8.25 Watch Actions

| Action | Description |
| --- | --- |
| Watch.Add | Adds an expression to the Watched Data Window. |
| Watch.Insert | Inserts an expression into the Watched Data Window. |
| Watch.Remove | Removes an expression from the Watched Data Window. |
| Watch.Quick | Shows an expression in the Quick Watch Dialog. |

* * *

✅ Now you have **both Project and Target actions fully expanded in Markdown tables**. Do
you want me to bundle these into a single **`.md` file** so you can drop it straight
into your workflow, or keep it here inline for copy/paste?
