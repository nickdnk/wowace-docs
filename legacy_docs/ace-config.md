# AceConfig-3.0

AceConfig-3.0 wrapper library.

Provides an API to register an options table with the config registry, as well as associate it with a slash command.

## API Reference

### `AceConfig:RegisterOptionsTable(appName, options [, slashcmd])`

Register a option table with the AceConfig registry.

You can supply a slash command (or a table of slash commands) to register with AceConfigCmd directly.

**Parameters**

- `appName` — The application name for the config table.
- `options` — The option table (or a function to generate one on demand). http://www.wowace.com/addons/ace3/pages/ace-config-3-0-options-tables/
- `slashcmd` — A slash command to register for the option table, or a table of slash commands.

**Usage**

```lua
local AceConfig = LibStub("AceConfig-3.0")
AceConfig:RegisterOptionsTable("MyAddon", myOptions, {"/myslash", "/my"})
```
