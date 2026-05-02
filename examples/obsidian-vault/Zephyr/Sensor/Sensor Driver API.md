---
tags:
  - sensor
  - fixed-point
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

#sensor #fixed-point

# Sensor API Implementation
Two major APIs exists:

- **Fetch and Get** 
	-  Stable API, introduced in Zephyr v1.2 (Apr 2016) 
	- Fetch: Blocking call that saves channels as driver instance data. Often calls I2C or SPI APIs 
	- Get: Returns channels converted to standard units without manipulating driver state 
- **Read and Decode** 
	- Experimental API, introduced in Zephyr v3.6 (Feb 2024) 
	- Supports polling and streaming reads using the RTIO subsystem 
	- Read: Acquires raw data into a caller-provided buffer 
	- Decode: Decodes raw data into fixed-point q31_t vectors


| Function                | Description                                                              | Notes                  |     |
| ----------------------- | ------------------------------------------------------------------------ | ---------------------- | --- |
| `sensor_sample_fetch_t` | Fetch a sample from the sensor and store it in an internal driver buffer | REQUIRED               |     |
| `sensor_channel_get_t`  | Get a reading from a sensor device                                       | REQUIRED               |     |
| `sensor_trigger_set_t`  | Activate a sensor's trigger and set the trigger handler                  | Optional               |     |
| `sensor_attr_set_t`     | Set an attribute for a sensor                                            | Optional               |     |
| `sensor_attr_get_t`     | Get an attribute for a sensor                                            | Optional               |     |
| `sensor_submit_t `      | Submit an RTIO sqe to the sensor's iodev                                 | REQUIRED for sensor V2 |     |
| `sensor_get_decoder_t`  | Get the sensor's decoder API                                             | REQUIRED for sensor V2 |     |
## Creating the macro for Sensor Driver Instance registration

Creating a Sensor Device Instance through the `SENSOR_DEVICE_DT_INST_DEFINE` macro 

```c title:drivers/sensor/adi/adxl345/adxl345.c:
#define ADXL345_CONFIG_SPI(inst)  \ 
	{ \
	 .bus = {.spi = SPI_DT_SPEC_INST_GET(inst, SPI_WORD_SET(8) | \ 
	 SPI_TRANSFER_MSB | \ 
	 SPI_MODE_CPOL | \ SPI_MODE_CPHA, \ 
	 0)}, \ 
	 .bus_is_ready = adxl345_bus_is_ready_spi, \  
	 .reg_access = adxl345_reg_access_spi, \ 
	} 
#define ADXL345_CONFIG_I2C(inst) \ 
	{ \ 
	.bus = {.i2c = I2C_DT_SPEC_INST_GET(inst)}, \ 
	.bus_is_ready = adxl345_bus_is_ready_i2c, \ 
	.reg_access = adxl345_reg_access_i2c, \
	} 
#define ADXL345_DEFINE(inst) \ 
	static struct adxl345_dev_data adxl345_data_##inst; \ \ 
	static const struct adxl345_dev_config adxl345_config_##inst = \ 
	cOND_CODE_1(DT_INST_ON_BUS(inst, spi), (ADXL345_CONFIG_SPI(inst)), \ 
	(ADXL345_CONFIG_I2C(inst))); \ \ 
SENSOR_DEVICE_DT_INST_DEFINE(inst, adxl345_init, NULL, \ 
	&adxl345_data_##inst, &adxl345_config_##inst, POST_KERNEL, \ 
	CONFIG_SENSOR_INIT_PRIORITY, &adxl345_api_funcs); 
	DT_INST_FOREACH_STATUS_OKAY(ADXL345_DEFINE)
```

# Aside: Fixed Point Numbers

Look at [[Fixed point Arithmetic]] for details but here's the gist of it:

| $$-2^3 = -8$$ | $$2^2 = 4$$ | $$2^1 = 2$$ | $$2^0 = 0$$ | $$2^{{-1}} = 0.5$$ | $$2^{{-2}} = 0.25$$ | $$2^{{-3}} = 0.125$$ | <br>$$2^{{-4}} = {{1/16}}$$ |            |
| ------------- | ----------- | ----------- | ----------- | ------------------ | ------------------- | -------------------- | --------------------------- | ---------- |
| 1             | 0           | 0           | 1           | 0                  | 0                   | 1                    | -1                          | <br>= 6.75 |

- Fixed point math is very common in the DSP space
- Bits right of the arbitrary decimal point have fractional weights
- Decimal point location is defined by the shift. Set shift based on the **sample range** (Slightly different from Qn.m notation)
- Sensors V2 uses 32-bit signed containers

Examles of shift values (not common ones!) and there max and min values:

| Shift Value | $$min = 2^{{shift}}$$ | $$max=2^{{shift}} - 2^{{31+shift}}$$ |
| ----------- | --------------------- | ------------------------------------ |
| -2          | -0.25                 | 0.2499999*                           |
| -1          | -0.5                  | 0.49999*                             |
| 0           | -1                    | 1                                    |
| 1           | -2                    | 1.9999*                              |
| 2           | -4                    | 3.9999*                              |
| 31          | -2,147,483,648        | 2,147,483,647                        |
## Practical Example: Selecting the Shift value based on Expected Sample Value Range

Suppose you have a temperature sensor with range -10℃ to 100℃ 
- Which shift to use? 
	- ANSWER: Shift of 7 → $$[-128, 127.99999994039536]$$
	- Temperature of 50℃ converts to: 
		- $$(50 * 2 31 ) >> 7 = 838860800 = 0x32000000$$
		-  $$(838860800 << 7) / 2 31 = 50.0$$ 

>[!WARNING] Watch out for overflow – order operations carefully and maybe use int64_t 
# Testing
The Generic Sensor Test and Sensor Emul Backend API are built around the newer Zephyr Sensors V2 API
- No longer uses the two-part struct sensor_value object 
- Use 32-bit fixed point numbers with SI units
- Benefits: easier arithmetic and processing, higher throughput using async RTIO tech, compatible with DSP subsystem. See link at end for additional info.
