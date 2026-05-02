---
aliases:
  - Recommendations
tags:
title: Recommendations
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

# Recommendations

For consistency and to make it easier for users to build applications which remain board agnostic, please follow these guidelines when porting a board you intend to contribute to Zephyr:

## Enable Valuable Components in Devicetree

Devicetree nodes for valuable onboard components (LEDs, buttons, sensors, onboard USB/Ethernet/BLE/Wi-Fi, etc.) must be enabled by default and have correct pin control and driver configuration so that they work out of the box.

## Keep Subsystems Disabled by Default (Kconfig)

Do not enable subsystems in the board defconfig unless they are strictly required for basic board operation, or are explicitly listed as exceptions in these recommendations.

## Configure System Clock and Tick Source

Set up a functioning system clock and tick source.

## Provide a Default Console

Use the zephyr,console chosen node to point to the UART controller used for console output.

## Boards with Built-in Debug or a USB-to-UART Adapter Should Set the Console to the UART Controller Connected to that Adapter

USB only boards without any debug adapter must include the common USB CDC-ACM `Kconfig <boards/common/usb/Kconfig.cdc_acm_serial.defconfig>` and `DTS <boards/common/usb/cdc_acm_serial.dtsi>` fragments to enable CDC-ACM UART as a default backend for logging and shell.

## Add `shield interface <shield-interfaces>` Definitions

For boards exposing standard expansion headers, add connector nodes and pin-muxing. Enable only the peripherals needed for the expected/standard connector functionality.

## Configure Pins and Peripheral Instances

Map peripherals to the correct pins (e.g., SPI on Arduino SPI pins) and provide default pinmux entries supporting the board's features.

## Enable Networking Interfaces

If networking hardware is present, configure default interfaces for each supported technology so that networking samples work out of the box.

## Enable GPIO Controllers

All GPIO ports connected to onboard components or expansion headers should be enabled.

## Enable MPU and Stack Protection

It is recommended to enable the MPU when available (unless memory resources are too limited). When the MPU is enabled, it is recommended to also enable hardware stack protection (option:`CONFIG_HW_STACK_PROTECTION`) to ease debugging by allowing the kernel to detect stack overflows.
