---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---

# Depending on other plugins

According to [docs](https://happytest.readthedocs.io/en/latest/writing_plugins/#accessing-another-plugin-by-name)  you can access a plugin from another plugin with:
```python get_plugin.py
plugin = config.pluginmanager.get_plugin("name_of_plugin")
```