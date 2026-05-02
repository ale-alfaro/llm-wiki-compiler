---
id: Babblesim
aliases: []
tags:
  - test
  - simulator
  - BLE
  - babblesim
  - zephyr
  - must-try
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---
# Quick Start

Good intro [video](https://www.youtube.com/watch?v=D0v3rlla9c8&t=225s) Zephyr
[docs](https://docs.zephyrproject.org/latest/develop/test/bsim.html)

![[Babblesim_diagram.png]]
## How to install

Using the Zephyr repository and west fetch the source code and build with
```sh
west config manifest.group-filter -- +babblesim
west update
cd ${ZEPHYR_BASE}/../tools/bsim
make everything -j 8
```

To use this env variables must be set:
```sh
export BSIM_OUT_PATH=${ZEPHYR_BASE}/../tools/bsim
export BSIM_COMPONENTS_PATH=${BSIM_OUT_PATH}/components/
```
## How to use

- [Zephyr guide](https://docs.zephyrproject.org/latest/boards/native/nrf_bsim/doc/nrf52_bsim.html#nrf52-bsim) on babblesim with the nRF52
- [Repo](https://github.com/jori-nordic/bsim-demo) with Babblesim demo of peripheral and central running at the same time:
### Quick Start


```bash
echo "Start PHY"
pushd "${BSIM_OUT_PATH}/bin"
./bs_2G4_phy_v1 -s=my-sim-id -D=3 &

echo "Slow down sim"
# Slow down the simulation: clamp speed to 10x real-time
pushd "${BSIM_COMPONENTS_PATH}/device_handbrake"
./bs_device_handbrake -s=my-sim-id -d=2 -r=10 &

echo "Start two devices"
$peripheral -s=my-sim-id -d=1 &
$central -s=my-sim-id -d=0
```
Build like any other board:
```sh
west build -b nrf52_bsim samples/hello_world
```
And run like the native sim but with an additional flag:
```sh
./build/zephyr/zephyr.exe -nosim
```
The `-nosim` command line option indicates you want to run it detached from a BabbleSim
simulation. This is possible only while there is no radio activity.
But is perfectly fine for most Zephyr samples and tests.

When you want to run a simulation with radio activity you need to run also the BableSim 2G4 (2.4GHz) physical layer simulation (phy).

For example, if you would like to run a simple case with a BLE Heart-rate Monitor (Central) sample application connecting to a BLE Heart-rate Monitor (Peripheral) sample application: Build the Heart-rate Monitor (Central) application targeting this board and
copy the resulting executable to the simulator bin folder with a sensible name:

```sh
west build -b nrf52_bsim samples/bluetooth/central_hr

cp build/zephyr/zephyr.exe \
    {BSIM_OUT_PATH}/bin/bs_nrf52_bsim_samples_bluetooth_central_hr
```

Do the same for the Heart-rate Monitor (Peripheral) sample app:

```sh
west build -b nrf52_bsim samples/bluetooth/peripheral_hr

cp build/zephyr/zephyr.exe \
{BSIM_OUT_PATH}/bin/bs_nrf52_bsim_samples_bluetooth_peripheral_hr
```
And then run them together with BabbleSim’s 2G4 physical layer simulation:

```sh
cd ${BSIM_OUT_PATH}/bin/
./bs_nrf52_bsim_samples_bluetooth_peripheral_hr -s=trial_sim -d=0 &
./bs_nrf52_bsim_samples_bluetooth_central_hr -s=trial_sim -d=1 &
./bs_2G4_phy_v1 -s=trial_sim -D=2 -sim_length=10e6 &

#Optional plug-in simulation effects in the form of devices
#Slowdown effect
./bs_device_handbrake -s=hello_world -d=0 -r=10 &
# Time monitoring plugin
./bs_device_time_monitor -s=hello_world -d=1 -interval=100e3
```

Where:
- `-s`   option provides a string which uniquely identifies this
simulation; 
- `-D` option tells the Phy how many devices will be run in this simulation;
- `-d` option tells each device which is its device number in the simulation;
- `-sim_length` option specifies the length of the simulation in microseconds..
- - The handbrake device is run as the first (`-d=0`) device which connects to the Phy. This device slows down a simulation to a given real time speed ratio. In this case, we set the ratio to 10x with `-r=10`.
- The time monitor device is run as the second (`-d=1`) device in the simulation. This device will monitor the speed of the simulation. We configure it to monitor with a 100ms interval (`-interval=100e3`).
Use `-help` for more information.

> [!note] Simultaneous Programs Running; One per Device + Base Simulation 
> 
> each of these devices is a separate program, run independently. Each of them could have been run from a separate terminal. All that is required for them to find each other, is that they are run by the same user, in the same workstation, and share the simulation ID string.
> 
> Note that until the last device has joined the simulation, the Phy is blocking the 1st device as necessary. So devices can be started at arbitrary times without affecting the result. As a demonstration this is what happens whe same device ID is assigned : 
> 
> ```sh
> ./bs_2G4_phy_v1 -s=hello_world -D=2 -sim_length=50e6 &
> ./bs_device_handbrake -s=hello_world -d=0 -r=10 &
> ./bs_device_time_monitor -s=hello_world -d=0 -interval=100e3 &
> ```
> 
> . The 2nd device will realize about this, warn you, and stop. But, the phy and the 1st device, are still waiting for the simulation to start.

You can find more information about how to run BabbleSim simulations in this [BabbleSim example](https://babblesim.github.io/example_2g4.html).

#### Stoping a running/pending simulation

Use the `stop_bsim.sh` script. You will find it in`${BSIM_COMPONENTS_PATH}/common/stop_bsim.sh`. You can either run the script directly, which will stop all your ongoing simulations, or provide to it a simulation ID as its only paramter, in which case it will only stop the processes linked to that simulation.