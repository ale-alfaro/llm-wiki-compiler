---
id: Shell
aliases:
  - Python Approach
tags:
  - zephyr
  - shell
  - testing
  - automation
title: Python Approach
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
---

# Python Approach

[[../Python/Libs/Bleak]]

# References

[Best article that goes over how to add it to the FW\
build:](https://adafruit-playground.com/u/SamBlenny/pages/zephyr-shell-over-usb-or-ble-bluefruit-connect)

## BLE NUS Client

BT Shell client python script available in the Nordic SDK:

- BLE NUS Console script - Requires a DK
  - nRF Connect SDK Desktop app also has this integrated

- Bluez Desktop app - Linux only

- Additionally there's the iOS and Android nRF apps

Links to other material:

- Zephyr 2024 Presentation\
  [Blog](https://www.croxel.com/insights/presentation-eoss-shell-ble)\
  ![Slides](https://www.croxel.com/files/presentation-eoss-2024-shell-over-ble.pdf)

# How to ..

## Setup

- doc/services/shell/index.rst covers the core shell. Enable CONFIG*SHELL and pick a backend (UART default; telnet CONFIG_SHELL_BACKEND_TELNET; USB CDC -S cdc-acm-console; BLE NUS -S nus-console; RTT\
  CONFIG_USE_SEGGER_RTT + CONFIG_SHELL_BACKEND_RTT; SMP/MQTT/RPMsg also supported). Built-ins and UX features (Tab, history, wildcards, meta keys) are gated by CONFIG_SHELL*\* options.
- Command tree is static or dynamic. Key APIs from include/zephyr/shell/shell.h: register root commands with SHELL_CMD_REGISTER / SHELL_CMD_ARG_REGISTER (conditional variants available); build subcommand sets\
  with SHELL_STATIC_SUBCMD_SET_CREATE, SHELL_SUBCMD_DICT_SET_CREATE, SHELL_DYNAMIC_CMD_CREATE; define commands with SHELL_CMD, SHELL_CMD_ARG etc. Handlers use signature (const struct shell \*sh, size_t argc,\
  char \*\*argv) and print via shell_print/shell_info/shell_warn/shell_error (avoid interrupt context).
- Execute commands programmatically with shell_execute_cmd(). Example modules live in samples/subsys/shell/shell_module/ (static/dynamic/dict commands, obscured input/login).
- Use CONFIG_SHELL_LOG_BACKEND if you want shell as a log backend; tune queue size/timeout carefully when mixing backends.

### Getting Started Quickly

- Pick backend and enable CONFIG_SHELL; build a sample such as samples/subsys/shell/shell_module or a subsystem app (tests/bluetooth/shell, tests/bluetooth/mesh_shell, hello_world with CONFIG_CAN_SHELL/\
  CONFIG_EEPROM_SHELL).
- Connect to the prompt, run subsystem init commands (bt init, mesh init), then exercise the provided command groups.
- For custom modules, include zephyr/shell/shell.h, create handlers, define subcommand sets, and register with SHELL*CMD_REGISTER (conditional variants if needed). Use shell_execute_cmd to script commands, and\
  leverage Tab/help/history features by enabling the matching CONFIG_SHELL*\* options.

## Test-driven Shell

- Automate commands directly in your app/tests with shell_execute_cmd(). Pass NULL to use the default backend (great with the dummy backend), or a backend pointer (e.g., shell_backend_uart_get_ptr()) to target\
  a specific transport. This lets you run a sequence of shell commands from ztests or init code without a terminal.
- For automated/unit tests, enable the dummy backend: CONFIG_SHELL=y + CONFIG_SHELL_BACKEND_DUMMY=y (no transport I/O, deterministic, works in emulation/CI). Disable heavy UX options to cut RAM/flash:\
  CONFIG_SHELL_MINIMAL=y and only enable features you need (CONFIG_SHELL_CMDS=n if you don't want the built-ins, or keep help/history/tab as required).
- For "end-to-end" UART/Telnet/RTT exercising, keep the normal backend (CONFIG_SHELL_BACKEND_UART etc.) and drive it via host scripts (Robot Framework, pexpect) that send commands and parse replies; this is\
  how the Zephyr sample tests do it.
- When testing a module's custom commands, register them with SHELL_CMD_REGISTER/SHELL_CMD_ARG_REGISTER in your module, then:
  1. In unit tests, call shell_execute_cmd(NULL, "mycmd arg1 arg2") with the dummy backend to check handler behavior/output.
  2. In system tests, connect over the chosen backend and issue the same commands to verify integration (init sequences, logging interleaving, etc.).

### Recommended Configs for Testing

- Headless/unit tests: CONFIG_SHELL_BACKEND_DUMMY=y, CONFIG_SHELL_CMDS=n (unless you need them), CONFIG_SHELL_MINIMAL=y, and any module-specific Kconfig enabling your command group.
- Interactive/system tests: keep the real backend (CONFIG_SHELL_BACKEND_UART or RTT/telnet/USB) plus the features you want to validate (Tab/help/history, CONFIG_SHELL_LOG_BACKEND if you need log muxing).
- If you need to script the shell while keeping logs separate, use RTT with different channels (CONFIG_SHELL_BACKEND_RTT_BUFFER vs CONFIG_LOG_BACKEND_RTT_BUFFER).

In-tree examples to copy

- samples/subsys/shell/shell_module/: canonical custom shell module (static/dynamic/dictionary commands, login/obscured input). It includes automated tests:
  - shell_module.robot (Robot Framework) drives the UART shell and asserts output.
  - test_shell.yml lists commands/expected regexes for scripted checks.
  - Multiple prj\*.conf variants show minimal/RTT/login/getopt configurations for test coverage.
- tests/subsys/shell/shell/: core shell coverage with many minimal config variants (shell_min\*.conf) to prove features compile and basic functionality works; good templates for trimming test configs.
- tests/subsys/shell/shell_backend\*, shell_history, shell_device, etc.: focused tests on specific shell features/backends.
- Subsystem-focused shell tests: tests/bluetooth/mesh_shell/ (mesh shell app), tests/drivers/rtc/shell/ (driver shell), showing how a module exposes shell commands and is exercised in CI.

# Example Shell Setup

This recipe tailored to your process_thread:

1. Add a shell command group in your module

- Include zephyr/shell/shell.h.
- Register a root command (e.g., prs) with subcommands that map to the actions you care about: enqueueing messages into g_process_thread_in_msg_q, starting/stopping timers, dumping state, injecting synthetic\
  sensor/segno events, toggling flags, printing queue depth/stack usage.
- Keep handlers thin: validate args, build prs::process_in_msg_t, call existing helpers (route_sensor_event, process_segno_data, process_raw_data_all, etc.) or queue messages exactly as your runtime would.
- Example (sketch):

```C
static int cmd_prs_state(const struct shell *sh, size_t argc, char **argv)
{
      shell_print(sh, "state=%s", state_to_str(process_thread::cur_state));
      return 0;
}

static int cmd_prs_inject_evt(const struct shell *sh, size_t argc, char **argv)
{
      /* inject a synthetic sensor event */
      sensor_event_t evt = {};
      evt.message_type = sensor_event_type::SENSOR_FAILURE;
      evt.data.failed_sensor = 1;
      evt.len = sizeof(evt.data.failed_sensor);
      evt.timestamp = app_time::time::get_time(app_time::time_domain::EPOCH);
      prs::process_in_msg_t msg = {};
      msg.from_ipc = prs::ipc_from::PROCESS;
      msg.from_process_msg.msg_type = prs::process_msg_type::SENSOR_EVENT;
      memcpy(msg.from_process_msg.payload, &evt, sizeof(evt));
      msg.from_process_msg.payload_len = sizeof(evt);
      k_msgq_put(&g_process_thread_in_msg_q, &msg, K_NO_WAIT);
      return 0;
}

SHELL_STATIC_SUBCMD_SET_CREATE(sub_prs,
      SHELL_CMD(state, NULL, "Show process state", cmd_prs_state),
      SHELL_CMD_ARG(inject_evt, NULL, "Inject SENSOR_FAILURE", cmd_prs_inject_evt, 1, 0),
      SHELL_SUBCMD_SET_END
);
SHELL_CMD_REGISTER(prs, &sub_prs, "Process-thread test commands", NULL);
```

1. Best configs for testing this way

- Headless/unit style: CONFIG_SHELL=y, CONFIG_SHELL_BACKEND_DUMMY=y, optionally CONFIG_SHELL_MINIMAL=y, and keep only the features you need. Then call shell_execute_cmd(NULL, "prs state") or\
  shell_execute_cmd(NULL, "prs inject_evt …") from your ztests.
- Integration/interactive: keep your normal backend (CONFIG_SHELL_BACKEND_UART or RTT/telnet). Use Robot/pexpect to send prs commands and check logs/side effects. If logs interleave, consider separate RTT\
  channels for log vs shell (CONFIG_SHELL_BACKEND_RTT_BUFFER vs CONFIG_LOG_BACKEND_RTT_BUFFER).
- If you need to drive the module without a transport, prefer the dummy backend; it avoids timing from terminals and keeps output capturable via shell_execute_cmd return codes.

1. Where to put the commands

- Co-locate in a small process_shell.c that includes only Zephyr + your module headers (avoid non-Zephyr deps). Register during system init or in your module's init(), after message queues are ready.
- If you need to poke internal state (e.g., cur_state, queue lengths, timers), add small getters or friend functions in your module rather than reaching into static vars from the shell file.

1. Good patterns to mirror

- samples/subsys/shell/shell_module/: shows registering commands, logging, and automated shell tests (shell_module.robot, test_shell.yml).
- tests/subsys/shell/shell/: minimal configs for shell; copy the pattern for dummy-backend unit tests.
- For backend-less command execution, see shell_execute_cmd example in doc/services/shell/index.rst (dummy backend enabled by CONFIG_SHELL_BACKEND_DUMMY).

1. Suggested subcommands for your module

- `prs state `→ print proc_state and maybe queue depth/stack usage.
- `prs inject_evt <type> `→ create sensor_event_t variants (TEMP high/normal, sensor failure, flash failure).
- `prs inject_raw <sensor_id> <type> <hexdata> `→ build a fake sensor_raw_data buffer and call process_raw_data_all.
- `prs segno <start|stop> [monitor] `→ call use_segno_if_needed() / stop_segno_thread().
- `prs timer <on|off> `→ start/stop vital_timer.
- `prs mem <start|stop> `→ call send_memory_mgr_start_session/stop_session with canned payloads.
- `prs qdepth `→ k_msgq_num_used_get(&g_process_thread_in_msg_q).

1. Minimal test harness approach

- Enable dummy backend; write ztest that boots your module, then:

```sh
  zassert_ok(shell_execute_cmd(NULL, "prs state"));
  zassert_ok(shell_execute_cmd(NULL, "prs inject_evt"));
  /* Assert side effects, e.g., queue length, state transitions, log hooks */
```

- For integration, run your board with UART shell, send the same commands over serial, and watch logs or add prs subcommands that print the key counters/flags you need to verify.

This gives you a thin shell front to exercise the module's real pathways (message queues, FSM transitions, segno/network/mem_mgr calls) without pulling in non-Zephyr dependencies.

# Appendix

## Examples or Reference Tests in Zephyr Project

Bluetooth Shells

- doc/connectivity/bluetooth/bluetooth-shell.rst: Build/flash tests/bluetooth/shell/, connect over serial (uart:~$). First run bt init to bring up the stack; adjust runtime logging with log status|enable|\
  disable. Additional command sets live under doc/connectivity/bluetooth/shell/ (audio, GAP/GATT/ISO/L2CAP, Classic).
- doc/connectivity/bluetooth/api/mesh/shell.rst: Single mesh root. Always run mesh init after boot. Provision with mesh prov local 0 0x0001 or enable beacons via mesh prov pb-adv/pb-gatt. Set transmission\
  context with mesh target dst/net/app; self-configure via mesh models cfg …. Send test payloads with mesh test net-send <hex>; change dst to 0xffff for broadcast. Parameters accept decimal/hex ints,\
  hexstrings, and on/off booleans.

Networking Shells

- doc/connectivity/networking/api/net_shell.rst: net root command exposes status/diagnostics (net iface, net stats, net mem, net sockets, net events) and actions (net ping, net dns, net tcp, net capture). Each\
  command is gated by its Kconfig (e.g., DNS resolver, IPv6, TCP, VLAN, packet filter).
- doc/connectivity/networking/api/tls_credentials_shell.rst: cred command manages TLS credentials. Workflow: accumulate data with cred buf <DATA> (or clear), store with cred add <SECTAG> <TYPE> DEFAULT\
  <FORMAT> [DATA], inspect with cred get <SECTAG> <TYPE> <FORMAT>, delete with cred del, list with cred list [sectag|any] [TYPE]. Types include CA_CERT, SERVER_CERT/SELF_CERT/CLIENT, PRIVATE_KEY,\
  PRE_SHARED_KEY, PRE_SHARED_KEY_ID. Formats: BIN/BINT (base64 raw, optional NULL), STR/STRT (literal text, optional NULL).

Peripheral Shells

- doc/hardware/peripherals/can/shell.rst: Enable CONFIG_CAN, CONFIG_CAN_SHELL (plus optional CAN_FD_MODE, CAN_RX_TIMESTAMP, CAN_STATS, CAN_MANUAL_RECOVERY_MODE). Use can show <dev> to inspect; configure\
  bitrate (can bitrate / dbitrate), raw timing (can timing/dtiming), mode (can mode …), start/stop the controller. Add RX filters with can filter add, receive printed frames, transmit with can send, recover\
  bus with can recover (if enabled). Device name is first arg; tab-completion works; device list helps find names.
- doc/hardware/peripherals/eeprom/shell.rst: Enable CONFIG_EEPROM and CONFIG_EEPROM_SHELL. Commands: eeprom size <dev>, eeprom write <dev> <offset> <bytes…>, eeprom fill <dev> <offset> <len> <pattern>,\
  eeprom read <dev> <offset> <len>. Device name first; built-in help via -h/--help.
