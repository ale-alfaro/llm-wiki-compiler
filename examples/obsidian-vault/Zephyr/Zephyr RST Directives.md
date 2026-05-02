---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

### Application build commands

..zephyr-app-commands::[](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-zephyr-app-commands "Link to this definition")

Generate consistent documentation of the shell commands needed to manage (build, flash, etc.) an application

For example, to generate commands to build `samples/hello_world` for `qemu_x86` use:

```
.. zephyr-app-commands::
   :zephyr-app: samples/hello_world
   :board: qemu_x86
   :goals: build
```

This will render as:

> ```shell
> # From the root of the zephyr repository
> west build -b qemu_x86 samples/hello_world
> ```

Options

:tool:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-tool "Link to this definition")

Which tool to use. Valid options are currently `cmake`, `west` and `all`. The default is `west`.

:app:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-app "Link to this definition")

Path to the application to build.

:zephyr-app:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-zephyr-app "Link to this definition")

Path to the application to build, this is an app present in the upstream zephyr repository. Mutually exclusive with `:app:`.

:cd-into:*(no value)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-cd-into "Link to this definition")

If set, build instructions are given from within the `:app:` folder, instead of outside of it.

:generator:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-generator "Link to this definition")

Which build system to generate.

Valid options are currently `ninja` and `make`. The default is `ninja`. This option is not case sensitive.

:host-os:[](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-host-os "Link to this definition")

Which host OS the instructions are for.

Valid options are `unix`, `win` and `all`. The default is `all`.

:board:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-board "Link to this definition")

If set, build commands will target the given board.

:shield:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-shield "Link to this definition")

If set, build commands will target the given shield.

Multiple shields can be provided in a comma separated list.

:conf:[](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-conf "Link to this definition")

If set, build commands will use the given configuration file(s).

If multiple configuration files are provided, enclose the space-separated list of files with double quotes, e.g., “a.conf b.conf”.

:gen-args:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-gen-args "Link to this definition")

If set, indicates additional arguments to the CMake invocation.

:build-args:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-build-args "Link to this definition")

If set, indicates additional arguments to the build invocation.

:west-args:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-west-args "Link to this definition")

If set, additional arguments to the west invocation (ignored for `:tool: cmake`).

:flash-args:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-flash-args "Link to this definition")

If set, additional arguments to the flash invocation.

:debug-args:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-debug-args "Link to this definition")

If set, additional arguments to the debug invocation.

:debugserver-args:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-debugserver-args "Link to this definition")

If set, additional arguments to the debugserver invocation.

:attach-args:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-attach-args "Link to this definition")

If set, additional arguments to the attach invocation.

:snippets:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-snippets "Link to this definition")

If set, indicates the application should be compiled with the listed snippets.

Multiple snippets can be provided in a comma separated list.

:build-dir:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-build-dir "Link to this definition")

If set, the application build directory will *APPEND* this relative, Unix-separated, path to the standard build directory. This is mostly useful for distinguishing builds for one application within a single page.

:build-dir-fmt:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-build-dir-fmt "Link to this definition")

If set, assume that west config build.dir-fmt\` has been set to this path.

Exclusive with `:build-dir:` and depends on `:tool: west`.

:goals:*(string)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-goals "Link to this definition")

A whitespace-separated list of what to do with the app (any of `build`, `flash`,`debug`, `debugserver`, `run`).

Commands to accomplish these tasks will be generated in the right order.

:maybe-skip-config:*(no value)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-maybe-skip-config "Link to this definition")

If set, this indicates the reader may have already created a build directory and changed there, and will tweak the text to note that doing so again is not necessary.

:compact:*(no value)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-app-commands-compact "Link to this definition")

If set, the generated output is a single code block with no additional comment lines.

### Cross-referencing files in the Zephyr tree

Special roles are available to reference files in the Zephyr tree. For example, referencing this very file can be done using the role.

:zephyr\_file:[](https://docs.zephyrproject.org/latest/contribute/documentation/#role-zephyr_file "Link to this definition")

This role is used to reference a file in the Zephyr tree. For example:

```
Check out :zephyr_file:\`doc/contribute/documentation/guidelines.rst\` for more information.
```

Will render as:

> Check out [doc/contribute/documentation/guidelines.rst](https://github.com/zephyrproject-rtos/zephyr/blob/main/doc/contribute/documentation/guidelines.rst) for more information.

You can reference specific lines or line ranges in a file by appending `#L*line_number*` or `#L*start_line*-L*end_line*` to the file path:

```
See :zephyr_file:\`doc/contribute/documentation/guidelines.rst#L3\` for the main heading of
this document.
```

Will render as:

> See [doc/contribute/documentation/guidelines.rst#L3](https://github.com/zephyrproject-rtos/zephyr/blob/main/doc/contribute/documentation/guidelines.rst?plain=1#L3) for the main heading of this document.

The role automatically verifies that the referenced file exists in the Zephyr tree and will generate a warning during documentation build if the file is not found.

Note

Use the line references sparingly as keeping them accurate over time can be challenging as the content of the linked file is subject to change.

You may use the role instead if you want to reference the “raw” content.

:zephyr\_raw:[](https://docs.zephyrproject.org/latest/contribute/documentation/#role-zephyr_raw "Link to this definition")

This role is used to reference the raw content of a file in the Zephyr tree. For example:

```
Check out :zephyr_raw:\`doc/contribute/documentation/guidelines.rst\` for more information.
```

Will render as:

> Check out [doc/contribute/documentation/guidelines.rst](https://github.com/zephyrproject-rtos/zephyr/raw/main/doc/contribute/documentation/guidelines.rst) for more information.

:module\_file:[](https://docs.zephyrproject.org/latest/contribute/documentation/#role-module_file "Link to this definition")

This role is used to reference a module in the Zephyr tree. For example:

```
Check out :module_file:\`hal_stm32:CMakeLists.txt\` for more information.
```

Will render as:

> Check out [hal\_stm32:CMakeLists.txt](https://github.com/zephyrproject-rtos/hal_stm32/blob/57803da28e985e1cbc32a7ea993578f7267d0935/CMakeLists.txt) for more information.

Similar to , you can reference specific lines or line ranges in a file.

### Cross-referencing GitHub issues and pull requests

:github:[](https://docs.zephyrproject.org/latest/contribute/documentation/#role-github "Link to this definition")

This role is used to reference a GitHub issue or pull request.

For example, to reference issue #1234:

```
Check out :github:\`1234\` for more background about this known issue.
```

This will render as:

> Check out [GitHub #1234](https://github.com/zephyrproject-rtos/zephyr/issues/1234) for more background about this known issue.

### Doxygen API documentation

..doxygengroup::name [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-doxygengroup "Link to this definition")

This directive is used to output a short description of a Doxygen group and a link to the corresponding Doxygen-generated documentation.

All the code samples (declared using the directive) indicating the group as relevant will automatically be list and referenced in the rendered output.

For example:

```
.. doxygengroup:: can_interface
```

Will render as:

> [CAN](https://docs.zephyrproject.org/latest/doxygen/html/group__can__interface.html)

Options

:project:*(project name (optional))* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-doxygengroup-project "Link to this definition")

Associated Doxygen project. This can be useful when multiple Doxygen projects are configured.

:c:group:[](https://docs.zephyrproject.org/latest/contribute/documentation/#role-c-group "Link to this definition")

This role is used to reference a Doxygen group in the Zephyr tree. In the HTML documentation, they are rendered as links to the corresponding Doxygen-generated documentation for the group. For example:

```
Check out :c:group:\`gpio_interface\` for more information.
```

Will render as:

> Check out [GPIO](https://docs.zephyrproject.org/latest/doxygen/html/group__gpio__interface.html) for more information.

You may provide a custom link text, similar to the built-in `ref` role.

### Kconfig options

If you want to reference a Kconfig option from a document, you can use the role and provide the name of the option you want to reference. The role will automatically generate a link to the documentation of the Kconfig option when building HTML output.

Make sure to use the full name of the Kconfig option, including the `CONFIG_` prefix.

:kconfig:option:[](https://docs.zephyrproject.org/latest/contribute/documentation/#role-kconfig-option "Link to this definition")

This role is used to reference a Kconfig option in the Zephyr tree. For example:

```
Check out :kconfig:option:\`CONFIG_GPIO\` for more information.
```

Will render as:

> Check out [`CONFIG_GPIO`](https://docs.zephyrproject.org/latest/kconfig.html#CONFIG_GPIO "CONFIG_GPIO") for more information.

:kconfig:option-regex:[](https://docs.zephyrproject.org/latest/contribute/documentation/#role-kconfig-option-regex "Link to this definition")

This role is used to create links to regex searches for Kconfig options. It generates a link to the Kconfig search page with the provided regex pattern automatically filled in as the search query. It is useful for referencing multiple Kconfig options that share a common prefix, or belong to a common category. For example:

```
Check out :kconfig:option-regex:\`CONFIG_SECURE_STORAGE_ITS_(STORE|TRANSFORM)_.*_CUSTOM\` for
the various customization possibilities.
```

Will render as:

> Check out [`CONFIG_SECURE_STORAGE_ITS_(STORE|TRANSFORM)_.*_CUSTOM`](https://docs.zephyrproject.org/latest/kconfig.html#!CONFIG_SECURE_STORAGE_ITS_\(STORE|TRANSFORM\)_.*_CUSTOM) for the various customization possibilities.

It is encouraged to provide a custom link text to make the reference more readable. For example:

```
Check out the :kconfig:option-regex:\`ITS Kconfig options <CONFIG_SECURE_STORAGE_ITS_.*>\`
for more information.
```

Will render as:

> Check out the [ITS Kconfig options](https://docs.zephyrproject.org/latest/kconfig.html#!CONFIG_SECURE_STORAGE_ITS_.*) for more information.

### Devicetree bindings

If you want to reference a Devicetree binding from a document, you can use the role and provide the compatible string of the binding you want to reference. The role will automatically generate a link to the documentation of the binding when building HTML output.

:dtcompatible:[](https://docs.zephyrproject.org/latest/contribute/documentation/#role-dtcompatible "Link to this definition")

This role can be used inline to make a reference to the generated documentation for the Devicetree compatible given as argument.

There may be more than one page for a single compatible. For example, that happens if a binding behaves differently depending on the bus the node is on. If that occurs, the reference points at a “disambiguation” page which links out to all the possibilities, similarly to how Wikipedia disambiguation pages work. Example:

```
Check out :dtcompatible:\`zephyr,input-longpress\` for more information.
```

Will render as:

> Check out [`zephyr,input-longpress`](https://docs.zephyrproject.org/latest/build/dts/api/bindings/input/zephyr%2Cinput-longpress.html#std-dtcompatible-zephyr-input-longpress) for more information.

### Code samples

..zephyr:code-sample::id [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-zephyr-code-sample "Link to this definition")

This directive is used to describe a code sample, including which noteworthy APIs it may be exercising.

For example:

```
.. zephyr:code-sample:: blinky
   :name: Blinky
   :relevant-api: gpio_interface

   Blink an LED forever using the GPIO API.
```

The content of the directive is used as the description of the code sample.

Options

:name:*(text)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-code-sample-name "Link to this definition")

Indicates the human-readable short name of the sample.

:relevant-api:*(text)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-code-sample-relevant-api "Link to this definition")

Optional space-separated list of Doxygen group names that correspond to the APIs exercised by the code sample.

:zephyr:code-sample:[](https://docs.zephyrproject.org/latest/contribute/documentation/#role-zephyr-code-sample "Link to this definition")

This role is used to reference a code sample described using .

For example:

```
Check out :zephyr:code-sample:\`blinky\` for more information.
```

Will render as:

> Check out [Blinky](https://docs.zephyrproject.org/latest/samples/basic/blinky/README.html#blinky "Blink an LED forever using the GPIO API.") for more information.

This can be used exactly like the built-in `ref` role, i.e. you may provide a custom link text. For example:

```
Check out :zephyr:code-sample:\`blinky code sample <blinky>\` for more information.
```

Will render as:

> Check out [blinky code sample](https://docs.zephyrproject.org/latest/samples/basic/blinky/README.html#blinky "Blink an LED forever using the GPIO API.") for more information.

..zephyr:code-sample-category::id [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-zephyr-code-sample-category "Link to this definition")

This directive is used to define a category for grouping code samples.

For example:

The contents of the directive is used as the description of the category. It can contain any valid reStructuredText content.

Options

:name:*(text)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-code-sample-category-name "Link to this definition")

Indicates the human-readable name of the category.

:show-listing:*(flag)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-code-sample-category-show-listing "Link to this definition")

If set, a listing of code samples in the category will be shown. The listing is automatically generated based on all code samples found in the subdirectories of the current document.

:glob:*(text)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-code-sample-category-glob "Link to this definition")

A glob pattern to match the files to include in the listing. The default is \*/\* but it can be overridden e.g. when samples may be found in directories not sitting directly under the category directory.

:zephyr:code-sample-category:[](https://docs.zephyrproject.org/latest/contribute/documentation/#role-zephyr-code-sample-category "Link to this definition")

This role is used to reference a code sample category described using.

For example:

```
Check out :zephyr:code-sample-category:\`cloud\` samples for more information.
```

Will render as:

> Check out [IoT Cloud](https://docs.zephyrproject.org/latest/samples/net/cloud/README.html#cloud) samples for more information.

..zephyr:code-sample-listing::[](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-zephyr-code-sample-listing "Link to this definition")

This directive is used to show a listing of all code samples found in one or more categories.

For example:

```
.. zephyr:code-sample-listing::
   :categories: cloud
```

Will render as:

> - [AWS IoT Core MQTT](https://docs.zephyrproject.org/latest/samples/net/cloud/aws_iot_mqtt/README.html#aws-iot-mqtt "Connect to AWS IoT Core and publish messages using MQTT.") Connect to AWS IoT Core and publish messages using MQTT.
> - [Microsoft Azure IoT Hub MQTT](https://docs.zephyrproject.org/latest/samples/net/cloud/mqtt_azure/README.html#mqtt-azure "Connect to Azure IoT Hub and publish messages using MQTT.") Connect to Azure IoT Hub and publish messages using MQTT.
> - [TagoIO HTTP Post](https://docs.zephyrproject.org/latest/samples/net/cloud/tagoio_http_post/README.html#tagoio-http-post "Send random temperature values to TagoIO IoT Cloud Platform using HTTP.") Send random temperature values to TagoIO IoT Cloud Platform using HTTP.

Options

:categories:*(text)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-code-sample-listing-categories "Link to this definition")

A space-separated list of category IDs for which to show the listing.

:live-search:*(flag)* [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-option-zephyr-code-sample-listing-live-search "Link to this definition")

A flag to include a search box right above the listing. The search box allows users to filter the listing by code sample name/description, which can be useful for categories with a large number of samples. This option is only available in the HTML builder.

### Boards

..zephyr:board::name [](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-zephyr-board "Link to this definition")

This directive is used at the beginning of a document to indicate it is the main documentation page for a board whose name is given as the directive argument.

For example:

```
.. zephyr:board:: wio_terminal
```

The metadata for the board is read from various config files and used to automatically populate some sections of the board documentation. A board documentation page that uses this directive can be linked to using the role.

:zephyr:board:[](https://docs.zephyrproject.org/latest/contribute/documentation/#role-zephyr-board "Link to this definition")

This role is used to reference a board documented using .

For example:

```
Check out :zephyr:board:\`wio_terminal\` for more information.
```

Will render as:

> Check out [Wio Terminal](https://docs.zephyrproject.org/latest/boards/seeed/wio_terminal/doc/index.html#wio_terminal) for more information.

..zephyr:board-catalog::[](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-zephyr-board-catalog "Link to this definition")

This directive is used to generate a catalog of Zephyr-supported boards that can be used to quickly browse the list of all supported boards and filter them according to various criteria.

:zephyr:board-catalog:[](https://docs.zephyrproject.org/latest/contribute/documentation/#role-zephyr-board-catalog "Link to this definition")

This role is used to reference the board catalog page, optionally with filter parameters. For example:

```
Check out :zephyr:board-catalog:\`\` for more information.
```

Will render as:

> Check out:zephyr:board-catalog:\`\` for more information.

This role can be used exactly like the built-in `ref` role, i.e. you may provide a custom link text. For example:

```
Check out the :zephyr:board-catalog:\`boards using this compatible <#compatibles=ti,hdc2080>\`
for more information.
```

Will render as:

> Check out the [boards using this compatible](https://docs.zephyrproject.org/latest/boards/index.html#compatibles=ti,hdc2080) for more information.

..zephyr:board-supported-hw::[](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-zephyr-board-supported-hw "Link to this definition")

This directive is used to show supported hardware features for all the targets of the board documented in the current page. The tables are automatically generated based on the board’s Devicetree.

The directive must be used in a document that also contains a directive, as it relies on the board information to generate the table.

Note

This directive requires that the documentation is built with hardware features generation enabled (`zephyr_generate_hw_features` config option set to `True`). If disabled, a warning message will be shown instead of the hardware features tables.

It is possible to limit the hardware features generation to boards from a specific list of vendors to speed up documentation builds without completely disabling the hardware features table. Set the config option `zephyr_hw_features_vendor_filter` to the list of vendors to generate features for. If the option is empty, hardware features are generated for all boards from all vendors.

..zephyr:board-supported-runners::[](https://docs.zephyrproject.org/latest/contribute/documentation/#directive-zephyr-board-supported-runners "Link to this definition")

This directive is used to show the supported runners for the board documented in the current page, including which runner is the default for flashing and debugging.

The directive must be used in a document that also contains a directive, as it relies on the board information to generate the table.

Note

Similar to , this directive requires hardware features generation to be enabled (`zephyr_generate_hw_features` config option set to `True`) to produce a complete table. If disabled, a warning message will be shown instead of the runners tables.
