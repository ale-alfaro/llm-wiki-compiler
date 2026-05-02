---
aliases:
  - Methods
tags:
title: Methods
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---



# Power Management Subsystem 

2 types exist:
 - System PM
	 - Power States (idle / sleep states)
	 - Policy Manager
 - Device PM
	 - **Static** System-Managed Device Power Management
	 - Device **Runtime** Power Management

> [!note] Kernel Idling and Tickless Kernel mode (purely event driven kernel) is also a way to reduce power although not really part of the power management subsystem 

## How to use it

> [!info] Using Power Management
> - `CONFIG_PM`: Enable system power management
> - `CONFIG_PM_DEVICE`: Enable System Managed Device PM
> - `CONFIG_DEVICE_RUNTIME_PM` : Automatically suspend devices when they are not in us
---

# System Power Management

Look at [[power-management-oss-eoss24_zds.pdf|power-management-oss-eoss24_zds]] and [[notes-on-zephyr-power-management|Zephyr_4.3_Power_Management]] for more info. Not really important for applications development

---

# Device Power Management

> [!todo] Device PM
>  - Set device busy\
> -`CONFIG_PM_NEED_ALL_DEVICES_IDLE`
>   - Set initial device state
>   - Wake-up source
>   - Tunning pm policy

# STATIC Device Power Management

The (Static) Device Power Management module provides an interface that the device drivers use to be informed about entering the suspend state or resuming from the suspend state. This allows the device drivers to do any necessary power management operations, such as turning off device clocks and peripherals, which lowers the power consumption.

To enable suspending peripherals when the CPU goes to sleep, set the `CONFIG_PM_DEVICE` Kconfig option to y.

# Device Runtime Power Management

Real gem #TODO Need to add `CONFIG_PM_DEVICE_RUNTIME=y` and no additional API to implement


![[implementing-pm-device.pdf#page=1&offset=0,405,0.40625|p.1]]

---

# Power Domains

> [!tldr] TLDR
> - Enabled with`CONFIG_PM_DEVICE_POWER_DOMAIN=y`
> - Power domains are a special kind of device:  They must be declared compatible with "power-domain" in DT or initialized with the flag `PM_DEVICE_FLAG_PD`

## What

- They are responsible to notify their children when they are suspended and resumed
- Device runtime power management takes care to resume a power domain if a children device is resumed

> [!important] Device Runtime PM API\
> `int pm_device_runtime_enable(const struct device *dev);`
>
> `int pm_device_runtime_disable(const struct device *dev);`
>
> `int pm_device_runtime_get(const struct device *dev);`
>
> `int pm_device_runtime_put(const struct device *dev);`
>
> `int pm_device_runtime_put_async(const struct device *dev, k_timeout_t)`
