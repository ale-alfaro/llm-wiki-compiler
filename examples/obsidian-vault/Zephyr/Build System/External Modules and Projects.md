---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
To have an external repo integrate with zephyr and be able to add it to the West
manifest and automatically be in the build system the repo needs to be structured as an
external module.

```
tree
└── zephyr
    ├── CMakeLists.txt
    ├── Kconfig 
    └── module.yml < -- Must be present
```

The module.yml tells zephyr where to find the Kconfig and CMake file to build.

Good starter article:
<https://blog.golioth.io/how-to-turn-helper-code-into-a-zephyr-module/>

Good examples:

- <https://github.com/golioth/libostentus/blob/main/CMakeLists.txt> (simple integration)

- <https://github.com/yashi/module-sample/blob/main/CMakeLists.txt> (More complex,
  including how to on header-only libs)

Real world example: ETL <https://github.com/ETLCPP/etl/tree/20.42.0>

Special care needs to be taken with how the CMakeLists.txt that the module.yml points to
add the lib to Zephyr.

```cmake title:simple_example
if (CONFIG_LIB_OSTENTUS)
 zephyr_library()
 zephyr_syscall_header(${ZEPHYR_LIBOSTENTUS_MODULE_DIR}/include/libostentus.h)
 zephyr_include_directories(include)
 zephyr_library_sources(libostentus.c)
endif (CONFIG_LIB_OSTENTUS)
```

```cmake header_only_example

# Main CMakeLists.txt in root of the repo
project(etl VERSION ${ETL_VERSION} LANGUAGES CXX)

option(BUILD_TESTS "Build unit tests" OFF)
option(NO_STL "No STL" OFF)

add_library(${PROJECT_NAME} INTERFACE)
# This allows users which use the add_subdirectory or FetchContent
# to use the same target as users which use find_package
add_library(etl::etl ALIAS ${PROJECT_NAME})

include(GNUInstallDirs)

target_include_directories(${PROJECT_NAME} ${INCLUDE_SPECIFIER} INTERFACE
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
        $<INSTALL_INTERFACE:${CMAKE_INSTALL_INCLUDEDIR}>
        )

target_link_libraries(${PROJECT_NAME} INTERFACE)
# .......


#CMakeLists.txt pointed by the module.yml file
if(CONFIG_ETL)
  add_subdirectory(${CMAKE_CURRENT_LIST_DIR}/.. etl)
  zephyr_link_libraries(etl::etl)

  zephyr_compile_definitions_ifdef(CONFIG_ETL_DEBUG ETL_DEBUG)
  zephyr_compile_definitions_ifdef(CONFIG_ETL_CHECK_PUSH_POP ETL_CHECK_PUSH_POP)
  zephyr_compile_definitions_ifdef(CONFIG_ETL_LOG_ERRORS ETL_LOG_ERRORS)
endif()
```
