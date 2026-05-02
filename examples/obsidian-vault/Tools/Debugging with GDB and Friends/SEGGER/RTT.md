---
id: RTT
aliases: []
tags:
  - segger
  - rtt
  - zephyr
  - logging
  - shell
  - debugging
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

# How it works

[Segger RTT Docs](https://kb.segger.com/RTT#Integrating_RTT_in_host_applications)

RTT uses a SEGGER RTT Control Block structure and ring buffers for each configured direction of each channel, located in RAM.
The maximum number of available channels can be configured at compile time and each buffer can be configured and added by the application at run time.

Up and down buffers can be handled separately (see RTT Channels).
Each channel can be configured to be blocking or non-blocking (see Buffer configuration):
Blocking: Prevents data from being lost but may pause the application.
Non-blocking: Excess information will be discarded, allowing the application to run in real-time, even when no debugger is connected.
The image on the right shows the simplified structure of RTT in the target. Each element is explained in the following.

## RTT Control Block

The RTT control block (CB) contains of multiple elements to allow RTT to work. It is located in RAM. It always starts with an ID which is used to

make the CB (auto-)detectable in memory by a connected J-Link and
for a CB validity check.
It is followed by the Buffer descriptors which hold all required RTT channel information.

### Buffer Descriptors

The buffer descriptors provide information about the ring buffers for each channel, used by J-Link to read information from and write information to the target.
There may be any number of Up (Target -> Host) / Down (Host -> Target) Buffer Descriptors up to the maximum number of allowed channels.

#### For Up buffers,

    - the Write Pointer is only written by the target and
    - the Read Pointer is only written by the debug probe (J-Link, Host).

#### Down buffers:

    - the Write Pointer is only written by the debug probe (J-Link, Host) and
    - the Read Pointer is only written by the target.

This assures that no race conditions can occur. When the Read and Write Pointers point to the same element, the buffer is empty.

### Buffers

The ring buffers buffers are also located in RAM but are not part of the RTT CB. The buffer size can be configured individually, for each channel & each direction. The gray areas of the buffers in the image above show the areas containing valid data.
![RTT Control Block](https://kb.segger.com/File:RTT_Schematics_Simple_tn.png)

# Specs

## Performance

The performance of SEGGER RTT is significantly higher than any other technology used to output data to a host PC. An average line of text can be output in one microsecond or less. Basically only the time to do a single memcopy().

![ RTT SpeedComparison.png ](https://kb.segger.com/File:RTT_SpeedComparison.png)

## Memory footprint

The RTT implementation code uses ~500 Bytes of ROM and 24 Bytes ID + 24 Bytes per channel for the control block in RAM. Each channel requires some memory for the buffer. The recommended sizes are 1 kByte for up channels and 16 to 32 Bytes for down channels depending on the load of in- / output.
