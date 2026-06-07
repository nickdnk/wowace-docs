---
description: "AceConfig-3.0 is the wrapper library that registers an options table with the config registry and associates it with a slash command in one call"
---

# AceConfig-3.0

AceConfig-3.0 wrapper library.

Provides an API to register an options table with the config registry, as well as associate it with a slash command.

## Usage

### Defining an options table and handlers

You describe your options as a declarative table; see the [options table reference](/api/ace-config-options) for the full format. The part AceConfig relies on is how each option reads and writes its value, through `get`/`set` directives. These can be plain functions, or method names resolved on the table's `handler` object:

```lua
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
```

### Registering the options

Register the table with AceConfig, optionally tying it to slash command(s) (handled via [AceConfigCmd-3.0](/api/ace-config-cmd), which uses [AceConsole-3.0](/api/ace-console) to register the command):

```lua
LibStub("AceConfig-3.0"):RegisterOptionsTable("MyAddonName", options, { "myslash", "myslashtwo" })
```

Pass `nil` as the `slashcmd` argument if you don't want a slash command (e.g. GUI-only config).

### Displaying the options

Registering builds the slash command (if you passed one), but the GUI is rendered by [AceConfigDialog-3.0](/api/ace-config-dialog) on demand, using the **same application name**. Add the options to the Blizzard "Settings" panel, open them as a standalone window, or both:

```lua
local AceConfigDialog = LibStub("AceConfigDialog-3.0")

-- Add a panel to the Blizzard interface options ("Settings").
AceConfigDialog:AddToBlizOptions("MyAddonName", "My Addon")

-- Or open the same options as a standalone window (e.g. from a button).
AceConfigDialog:Open("MyAddonName")
```

### Putting it together

The application name (`"MyAddonName"`) is the thread that ties everything together: you pass it to [`:RegisterOptionsTable`](#registeroptionstable), and the same name to [`AceConfigDialog:Open`](/api/ace-config-dialog#open) or [`AceConfigDialog:AddToBlizOptions`](/api/ace-config-dialog#addtoblizoptions). A typical addon does all of this once, at load:

```lua
function MyAddon:OnInitialize()
    -- options = the table described above (and in the options reference)
    LibStub("AceConfig-3.0"):RegisterOptionsTable("MyAddonName", options, "myslash")
    LibStub("AceConfigDialog-3.0"):AddToBlizOptions("MyAddonName", "My Addon")
end
```

## API Reference

````apimethod
name: AceConfig:RegisterOptionsTable
params:
  - { name = "appName", type = "string", desc = "The application name for the config table." }
  - { name = "options", type = "table|function", desc = "The option table (or a function to generate one on demand). See [Options Tables](/api/ace-config-options) for the format." }
  - { name = "slashcmd", type = "string|table", optional = true, desc = "A slash command to register for the option table, or a table of slash commands." }
---
Register an option table with the AceConfig registry.

You can supply a slash command (or a table of slash commands) to register with AceConfigCmd directly.

---

```lua
local AceConfig = LibStub("AceConfig-3.0")
AceConfig:RegisterOptionsTable("MyAddon", myOptions, {"myslash", "my"})
```
````
