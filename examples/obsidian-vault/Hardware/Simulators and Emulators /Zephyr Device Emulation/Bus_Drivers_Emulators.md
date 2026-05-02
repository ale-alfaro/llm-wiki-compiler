---
id: Bus_Drivers_Emulators
aliases: []
tags: []
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

# Overview

Zephyr supports a simple emulator framework to support testing of external peripheral drivers
without requiring real hardware.

Emulators are used to emulate external hardware devices, to support testing of
various subsystems. For example, it is possible to write an emulator
for an I2C compass such that it appears on the I2C bus and can be used just like a real hardware device.

Emulators often implement special features for testing. For example a
compass may support returning bogus data if the I2C bus speed is too
high, or may return invalid measurements if calibration has not yet
been completed. This allows for testing that high-level code can
handle these situations correctly. Test coverage can therefore
approach 100% if all failure conditions are emulated.

Conceptually emulators are made to test a specific sub-section of tests that are not covered by any other simulator.
In the image below the code that the emulators are meant to tests is the "Peripheral Drivers" and "Application code/tests".
"API tests" that are specifically done to test the [[../Device Model/Drivers Overview.md|Device API]] implemented by the driver

## Creating a Device Driver Emulator


> [!NOTE] Take a look at the Google  Chromebook [Repositories](https://source.chromium.org/chromiumos/chromiumos/codesearch/+/main:src/platform/ec/zephyr/)
> They contain rhe best examples of emulator authoring. Some highlights from their repository:
> - Emulator [sources](https://source.chromium.org/chromiumos/chromiumos/codesearch/+/main:src/platform/ec/zephyr/emul/)
> - [tests for bmi3xx](https://source.chromium.org/chromiumos/chromiumos/codesearch/+/main:src/platform/ec/zephyr/test/drivers/bmi3xx/src/bmi3xx.c)
> - NFC Host/Poller [Driver](https://source.chromium.org/chromiumos/chromiumos/codesearch/+/main:src/platform/ec/driver/nfc/)
> More can be found in [[ZDS2022 - Zephyr for Embedded Controllers - with links.pdf|ZDS2022 - Zephyr for Embedded Controllers - with links]]

The emulator subsystem is modeled on the `device_model_api`. You create
an emulator instance using one of the `EMUL_DT_DEFINE()` or
`EMUL_DT_INST_DEFINE()` APIs.

Emulators for peripheral devices reuse the same devicetree node as the real
device driver. This means that your emulator defines `DT_DRV_COMPAT` using the
same `compat` value from the real driver.

```C drivers/sensor/bm160/bm160.c
#define DT_DRV_COMPAT bosch_bmi160
```

```C drivers/sensor/bmi160/emul_bmi160.c
#define DT_DRV_COMPAT bosch_bmi160
```

The `EMUL_DT_DEFINE()` function accepts two API types:

- `bus_api` - This points to the API for the upstream bus that the emulator
  connects to. The `bus_api` parameter is required. The supported
  emulated bus types include I2C, SPI, eSPI, and MSPI.
- `_backend_api` - This points to the device-class specific backend API for
  the emulator. The `_backend_api` parameter is optional.

> [!quote] Example from the [Zephyr docs on emulators](https://docs.zephyrproject.org/latest/hardware/emulator/bus_emulators.html) 
> 
> The diagram below demonstrates the logical organization of the `bus_api` and
> `_backend_api` using the BC1.2 charging detector driver as the model
> device-class.
> 
> ![[device_class_emulator.svg]]
> The real code is shown in green, while the emulator code is shown in yellow.
> 
> The `bus_api` connects the BC1.2 emulators to the `native_sim` I2C
> controller. The real BC1.2 drivers are unchanged and operate exactly as if there
> was a physical I2C controller present in the system. The `native_sim` I2C
> controller uses the `bus_api` to initiate register reads and writes to the
> emulator.
> 
> The `_backend_api` provides a mechanism for tests to manipulate the emulator
> out of band. Each device class defines it's own API functions. The backend API
> functions focus on high-level behavior and do not provide hooks for specific
> emulators.
> 
> In the case of the BC1.2 charging detector the backend API provides functions
> to simulate connecting and disconnecting a charger to the emulated BC1.2 device.
> Each emulator is responsible for updating the correct vendor specific registers
> and potentially signalling an interrupt.
> 
> Example test flow:
> 
> 1. Test registers BC1.2 detection callback using the Zephyr BC1.2 driver API.
> 2. Test connects a charger using the BC1.2 emulator backend.
> 3. Test verifies B1.2 detection callback invoked with correct charger type.
> 4. Test disconnects a charger using the BC1.2 emulator backend.
> 
> With this architecture, the same test can be used will all supported drivers in
> the same driver class.

# Available Emulators

Zephyr includes the following emulators:

- I2C emulator driver, allowing drivers to be connected to an emulator so that
  tests can be performed without access to the real hardware

- SPI emulator driver, which does the same for SPI

- eSPI emulator driver, which does the same for eSPI. The emulator is being
  developed to support more functionalities.

- MSPI emulator driver, allowing drivers to be connected to an emulator so that
  tests can be performed without access to the real hardware.

## I2C Emulation features

In the binding of the I2C emulated bus, there's a custom property for address
based forwarding. Given the following devicetree node:

```devicetree

i2c0: i2c@100 {
    status = "okay";
    compatible = "zephyr,i2c-emul-controller";
    clock-frequency = <I2C_BITRATE_STANDARD>;
    #address-cells = <1>;
    #size-cells = <0>;
    #forward-cells = <1>;
    reg = <0x100 4>;
    forwards = <&i2c1 0x20>;
};
```

The final property, `forwards` indicates that any read/write requests sent to
address `0x20` should be sent to `i2c1` with the same address. This allows
us to test both the controller and the target end of the communication on the
same image.

> [!note]
> The `#forward-cells` attribute should always be 1. Each entry in the
> `forwards` attribute consists of the phandle followed by the address. In
> the example above, `<&i2c1 0x20>` will forward all read/write operations
> made to `i2c0` at port `0x20` to `i2c1` on the same port. Since no
> additional cells are used by the emulated controller, the number of cells
> should remain 1.

# In-tree Samples

Here are some examples present in Zephyr:

- Bosch BMI160 sensor driver connected via both I2C and SPI to an emulator:

```sh
west build -b native_sim tests/drivers/sensor/bmi160
```

- The same test can be built with a second EEPROM which is an Atmel AT24 EEPROM driver
  connected via I2C an emulator:

```sh
west build -b native_sim tests/drivers/eeprom/api -- -DDTC_OVERLAY_FILE=at2x_emul.overlay -DEXTRA_CONF_FILE=at2x_emul.conf
```
