---
description: "AceConfig-3.0 is the wrapper library that registers an options table with the config registry and associates it with a slash command in one call"
---

# AceConfig-3.0

Provides an API to register an options table with the config registry, optionally associating it with a slash command.

## Usage

Describe your options as a declarative table (see the [options table reference](/api/ace-config-options) for the full
format), then register and display them in `OnInitialize`. `get`/`set` can be plain functions or method names resolved
on the `handler` object:

```lua
local myMessageVar = ""

local options = {
    name = "MyAddon",
    handler = MyAddon,   -- "GetMyMessage"/"SetMyMessage" resolve to methods on this object
    type = "group",
    args = {
        msg = {
            type = "input",
            name = "My Message",
            desc = "The message for my addon",
            get = "GetMyMessage",
            set = "SetMyMessage",
        },
    },
}

function MyAddon:GetMyMessage(info)
    return myMessageVar
end

function MyAddon:SetMyMessage(info, input)
    myMessageVar = input
end

function MyAddon:OnInitialize()
    -- Pass slash commands as the third arg; omit for GUI-only config.
    LibStub("AceConfig-3.0"):RegisterOptionsTable("MyAddon", options, "myaddon")
    LibStub("AceConfigDialog-3.0"):AddToBlizOptions("MyAddon", "My Addon")
end

function MyAddon:OpenOptions()
    -- Example function; bound to an "Open Options" button.
    LibStub("AceConfigDialog-3.0"):Open("MyAddon")
end
```

## API Reference

````apimethod
name: AceConfig:RegisterOptionsTable
params:
  - { name = "appName", type = "string", desc = "The application name for the config table." }
  - { name = "options", type = "table|function", desc = "The option table (or a function to generate one on demand). See [Options Tables](/api/ace-config-options) for the format." }
  - { name = "slashcmd", type = "string|table", optional = true, desc = "A slash command (without leading `/` — AceConsole prepends it) to register for the option table, or a table of slash commands." }
---
Register an option table with the AceConfig registry.

---

```lua
local AceConfig = LibStub("AceConfig-3.0")
AceConfig:RegisterOptionsTable("MyAddon", myOptions, {"myaddon", "ma"})
```
````
