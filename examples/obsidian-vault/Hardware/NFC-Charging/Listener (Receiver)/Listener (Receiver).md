---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# NFC Charging Listener (Sibel Design)


**Relevant Parties**

NXP:
	Vendor and chipmaker of the active components in the design used by Sibel
CISC:
	Vendor and designer of the charging block of the NXP suggested implementation of the NFC Charging receiver
	- [CISC Deliverables](https://docs.google.com/spreadsheets/d/1abp2veKTDLIH0KccsiY8CP8gLcYl_iNUDY8sFprCkpo/edit?gid=0#gid=0)
		- Importantly here's the documentation on the FW and HW design [Docs](https://drive.google.com/drive/folders/1j7Et8Oux9adpcHQJ-BChJDB1Uftb9tc5?usp=drive_link)
		- It's spread around, I might've missed something

# Components

### CRN120 NFC WLC Receiver

>[!abstract] CRN120 is designed to follow the NFC Forum standard for wireless charging. 
>It is part of a solution offering from NXP for NFC wireless charging. With its T2T memory layout and the
> I2C target interface a reliable and fast data transfer between WLC Listener and WLC poller is ensured.

- The NFC front end is mainly responsible for handling wireless power transfer and communication.
- Here `CRN120` is used, the wireless charging and wireless power transfer solution that NXP offers.


### PCA430 Battery Charger 


> [!warning] IF YOU DONT DO THIS SENSOR WONT BOOT UP
Charge Receiver Power-On:
> - The WLC-Charge Rx device (PCA943x) is only powered in the presence of RF Field from coil through AC1 and AC2 pins with internal high efficiency rectifier. So any I2C acess will be NAK-ed if RF is not present.
> 	- What does this mean? **TO WAKE UP THE SENSOR PUT IT ON THE CHARGER AND WAIT FOR BOOT UP**
> - Sleep Pin Setting: The WLC-Charge Rx device has an active high sleep pin which is usually pulled-up. It is required that the host controller needs to wake up the WLC-Charge Rx by driving SLEEP pin to Low. 
> 	- What does this mean? **SET THE FUCKING PIN LOW AT INITIALIZATION**
> 
> 
- The charging handler also known as the `WLC-Listener`(WLC-L) has an integrated low-power WLC-Charge Receiver(WLC-Charge Rx), based on the `PCA943x` family of Charging ICs.
- The `PCA9430` is a Low-power wireless charging receiver with a liner battery charger function.
- The output voltage of this IC is responsible for charging the Battery.


> [!QUOTE] CISC on PCA9430
> PCA9430 is used as the NFC charging power receiver with linear battery charger:
> - PCA_VPWR serves as a dead-battery LDO.
> - PCA_VOUT is the output of the linear battery charger.
> - PCA_NTC is an optional pin and can be used as external temperature sensor
> - PCA_INTB is a must-have pin, connected to the MCU GPIO Input. An external pull-up is recommended, but internal MCU Pull up can be used if needed.
> - PCA_SLEEP is an optional pin recommended to be connected to MCU GPIO Input pin.
> - I2C_SDA and I2C_SCL are I2C communication lines (up to 1 MHz, but it’s recommended to use same clock as for CRN120


> [!QUOTE] NXP Documentaiton
> The WLC-Listener(WLC-L) has an integrated low power WLC-Charge Receiver(WLC-Charge Rx). 
> WLC-L library includes a WLC-Charge Rx wrapper, based on PCA943x family of Charging ICs.  PCA943x variants are :  
> 	- PCA9431 Low power wireless charging receiver.  
> 	- PCA9430 Low power wireless charging receiver with liner battery charger functions. 
> WLC-Charge Rx devices have an I2C interface for host micro controller or application processor to control the device features. WLC-Charge Rx device supports following features : 
> 	- High efficiency active rectifier with voltage regulations and protections. 
> 	- Temperature sensing by NTC pin(JEITA compliant charging). 
> 	- Auxiliary supply for dead battery. 
> 	- Linear battery charger/ LDO out. 
> 	- WLC-L(receiver) side interrupt function(RXIR) to WLC-P(transmitter) side. 
> 	- Antenna tuning. 
> 	- ADC to measure parameters for system control for system level safety. •
> 	- Comprehensive chip protections. Refer WLC-Charge Receiver(PCA943x) data sheet for detailed functional description. 

![[Wlc_Charging_Receiver-Documentation.pdf#page=1&selection=3,0,67,21|Wlc_Charging_Receiver-Documentation, page 1]]


# Bengal Tiger Schematic



>[!IMPORTANT] Charger PCA9430 
> - **GPIOs**:
> 	- Sleep pin
> 	- INTB for charging alerts
> - **I2C**:
> 	- Address: 0x70

![[Bengal-Tiger-Battery-Charger.png]]


> [!IMPORTANT] NFC Frontend - CRN120 
> - **GPIOs**:
> 	- Enable pin
> 	- Field Detect Pin
> 	- Event Detect Pin
> - **I2C**:
> 	- Address: 0x55




![[Bengal-NFC-FRONTEND.png]]