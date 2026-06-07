# AceConfigCmd-3.0

AceConfigCmd-3.0 handles access to an options table through the "command line" interface via the ChatFrames.

## API Reference

### `AceConfigCmd:CreateChatCommand(slashcmd, appName)`

Utility function to create a slash command handler.

Also registers tab completion with AceTab.

**Parameters**

- `slashcmd` — The slash command WITHOUT leading slash (only used for error output)
- `appName` — The application name as given to `:RegisterOptionsTable()`

### `AceConfigCmd:GetChatCommandOptions(slashcmd)`

Utility function that returns the options table that belongs to a slashcommand.

Designed to be used for the AceTab interface.

**Parameters**

- `slashcmd` — The slash command WITHOUT leading slash (only used for error output)

**Returns**

- The options table associated with the slash command (or nil if the slash command was not registered)

### `AceConfigCmd:HandleCommand(slashcmd, appName, input)`

Handle the chat command.

This is usually called from a chat command handler to parse the command input as operations on an aceoptions table. AceConfigCmd uses this function internally when a slash command is registered with `:CreateChatCommand`.

**Parameters**

- `slashcmd` — The slash command WITHOUT leading slash (only used for error output)
- `appName` — The application name as given to `:RegisterOptionsTable()`
- `input` — The commandline input (as given by the WoW handler, i.e. without the command itself)

**Usage**

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
