---
description: "AceConfigCmd-3.0 exposes an AceConfig options table through the chat command line, turning your options into slash commands with tab completion"
---

# AceConfigCmd-3.0

AceConfigCmd-3.0 handles access to an options table through the "command line" interface via the ChatFrames.

## API Reference

````apimethod
name: AceConfigCmd:CreateChatCommand
params:
  - { name = "slashcmd", type = "string", desc = "The slash command WITHOUT leading slash (only used for error output)." }
  - { name = "appName", type = "string", desc = "The application name as given to `:RegisterOptionsTable()`." }
---
Utility function to create a slash command handler.

Also registers tab completion with AceTab.
````

````apimethod
name: AceConfigCmd:GetChatCommandOptions
params:
  - { name = "slashcmd", type = "string", desc = "The slash command WITHOUT leading slash (only used for error output)." }
returns:
  - { type = "table", desc = "The options table associated with the slash command (or `nil` if the slash command was not registered)." }
---
Utility function that returns the options table that belongs to a slashcommand.

Designed to be used for the AceTab interface.
````

````apimethod
name: AceConfigCmd:HandleCommand
params:
  - { name = "slashcmd", type = "string", desc = "The slash command WITHOUT leading slash (only used for error output)." }
  - { name = "appName", type = "string", desc = "The application name as given to `:RegisterOptionsTable()`." }
  - { name = "input", type = "string", desc = "The commandline input (as given by the [WoW handler](https://warcraft.wiki.gg/wiki/World_of_Warcraft_API), i.e. without the command itself)." }
---
Handle the chat command.

This is usually called from a chat command handler to parse the `input` as operations on an aceoptions table. AceConfigCmd uses this function internally when a slash command is registered with [`:CreateChatCommand`](#createchatcommand).

---

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceConsole-3.0")
-- Use AceConsole-3.0 to register a Chat Command
MyAddon:RegisterChatCommand("mychat", "ChatCommand")

-- Show the GUI if no input is supplied, otherwise handle the chat input.
function MyAddon:ChatCommand(input)
    -- Assuming "MyOptions" is the appName of a valid options table
    if not input or input:trim() == "" then
        LibStub("AceConfigDialog-3.0"):Open("MyOptions")
    else
        LibStub("AceConfigCmd-3.0").HandleCommand(MyAddon, "mychat", "MyOptions", input)
    end
end
```

::: tip Dot Call vs. Colon Call
`HandleCommand`'s first parameter is the `self` the command runs against. The dot call passes `MyAddon` explicitly as that `self`, so the options table's `get`/`set`/`handler` resolve in your addon's context. Calling `:HandleCommand(...)` would bind `self` to the AceConfigCmd library instead.
:::
````
