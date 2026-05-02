---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

>[!WARNING] Prerequisites
> - Write the driver implementation and have that ready to be tested.  At a minimum the driver must:
> 	- Compile successfully with a sample
## Bus driver emulators

- Emulators test peripheral drivers without real hardware.
- Emulators reuse the same devicetree node as the real driver.
- Set `DT_DRV_COMPAT` in emulator to match the real driver compat.

Example:
```c
#define DT_DRV_COMPAT bosch_bmi160
```

Create an emulator instance with:
- `EMUL_DT_DEFINE()` or `EMUL_DT_INST_DEFINE()`

Emulator APIs:
- `bus_api` (required) for upstream bus connection (I2C/SPI/eSPI/MSPI).
- `_backend_api` (optional) for test control hooks.

Use emulator backends to trigger conditions (faults, calibration missing, etc.)
and validate driver behavior.

## I2C emulation forwarding

You can forward address traffic between emulated controllers to test both ends:

```dts
i2c0: i2c@100 {
    compatible = "zephyr,i2c-emul-controller";
    #address-cells = <1>;
    #size-cells = <0>;
    #forward-cells = <1>;
    forwards = <&i2c1 0x20>;
};
```





```C
static int akm@9918c_emul_backend_get_sample_range(const struct emul *target, enum sensor_channel ch, q31_t *lower, q31_t *upper, q31_t *epsilon, int8_t *shift)
	
	ARG_UNUSED(target);
	
	if (!'lower || !upper || 'epsilon || !shift) {
		return -EINVAL;
	}
	
	switch (ch) {
		case SENSOR_CHAN_MAGN_X:
		case SENSOR_CHAN_MAGN_Y:
		case SENSOR_CHAN_MAGN_Z:
		/* +/- 49.12 Gs is the measurement range. 0.0015 Gs is the granularity */
		
			*shift = 6;
			*upper = (int64_t)(49.12 * ((int64_t)INT32_MAX + 1)) >> *shift;
			*lower = -*upper;
			*epsilon = (int64_t)(0.0015 * ((int64_t)INT32_MAX + 1)) >> *shift;
		break;
		default:
			return -ENOTSUP;
	
	}
	
	return 0;

}

```