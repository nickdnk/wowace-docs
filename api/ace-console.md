---
description: "AceConsole-3.0 registers slash commands to your addon functions, parses their arguments with GetArgs, and prints formatted output to the chat frame"
---

# AceConsole-3.0

<Embeddable />

AceConsole-3.0 provides registration facilities for slash commands. You can register slash commands to your custom
functions and use the [`GetArgs`](#getargs) function to parse them to your addons individual needs.

## Usage

### Output

Call [`:Print`](#print) with the text to output. As a mixin it's available on your addon object:

```lua
-- AceConsole used as a mixin
MyAddon:Print("Hello, world!")

-- print to a specific chat frame
MyAddon:Print(ChatFrame1, "Hello, World!")
```

### Slash commands

Register a command (without the leading slash) and a handler (a method name or a function):

```lua
MyAddon:RegisterChatCommand("myslash", "MySlashProcessorFunc")

function MyAddon:MySlashProcessorFunc(input)
    -- 'input' contains whatever follows the slash command
end
```

In many cases it's simpler to let [AceConfig](/api/ace-config) generate slash commands automatically.

## API Reference

````apimethod
name: AceConsole:Embed
kind: method
params:
  - { name = "target", type = "table", desc = "Target object to embed AceConsole in." }
returns: { type = "table", desc = "The `target` object that was embedded." }
---
Copies AceConsole's methods onto `target` so you can call them on it directly. See [The `:Embed` method](/api/ace-addon#the-embed-method).

---

```lua
LibStub("AceConsole-3.0"):Embed(MyObject)
```
````

````apimethod
name: AceConsole:GetArgs
kind: method
params:
  - { name = "str", type = "string", desc = "The raw argument string." }
  - { name = "numargs", type = "number", default = "1", desc = "How many arguments to get." }
  - { name = "startpos", type = "number", default = "1", desc = "Where in the string to start scanning." }
returns:
  - { type = "string", desc = "One value per requested argument (`numargs` in total), in order. A missing argument is returned as `nil`." }
  - { name = "nextposition", type = "number", desc = "Returned after the arguments: the position in the string just after the last parsed argument, to feed back as `startpos`. Returned as `1e9` once the end of the string is reached." }
---
Retrieve one or more space-separated arguments from a string.

Treats quoted strings and itemlinks as non-spaced.

---

```lua
function MyAddon:MySlashProcessorFunc(input)
    local arg1, arg2 = self:GetArgs(input, 2)
end
```
````

````apimethod
name: AceConsole:IterateChatCommands
kind: method
returns: { type = "function", desc = "Iterator (`pairs`) over all commands." }
---
Get an iterator over all Chat Commands registered with AceConsole.

---

```lua
for command in self:IterateChatCommands() do
    self:Print(command)
end
```
````

````apimethod
name: AceConsole:Print
kind: method
params:
  - { name = "chatframe", type = "table", optional = true, desc = "Custom ChatFrame to print to (or any frame with an `.AddMessage` function)." }
  - { name = "...", type = "any", desc = "List of any values to be printed." }
---
Print to [`DEFAULT_CHAT_FRAME`](https://warcraft.wiki.gg/wiki/DEFAULT_CHAT_FRAME) or given ChatFrame (anything with an `.AddMessage` function).

`chatframe` is not a true positional argument: `Print` takes only `...` and inspects the first value. If it is a table with an `.AddMessage` method it is used as the target frame; otherwise it is treated as the first value to print and output goes to `DEFAULT_CHAT_FRAME`.
````

````apimethod
name: AceConsole:Printf
kind: method
params:
  - { name = "chatframe", type = "table", optional = true, desc = "Custom ChatFrame to print to (or any frame with an `.AddMessage` function)." }
  - { name = "format", type = "string", desc = "Format string - same syntax as standard Lua `format()`." }
  - { name = "...", type = "any", desc = "Arguments to the format string." }
---
Formatted (using [`format()`](https://warcraft.wiki.gg/wiki/Format)) print to `DEFAULT_CHAT_FRAME` or given ChatFrame (anything with an `.AddMessage` function).

As with [`:Print`](#print), `chatframe` is detected by type rather than position: the first argument is used as the target frame only if it is a table with an `.AddMessage` method, otherwise it is taken as the format string.
````

````apimethod
name: AceConsole:RegisterChatCommand
kind: method
params:
  - { name = "command", type = "string", desc = "Chat command to be registered WITHOUT leading \"/\"." }
  - { name = "func", type = "funcref|methodname", desc = "Function to call when the slash command is being used." }
  - { name = "persist", type = "boolean", default = "true", desc = "When `false`, the command is tied to your addon's enabled state: AceConsole registers it when the addon (or module) is enabled and unregisters it when disabled. This only takes effect when AceConsole is embedded as a mixin, since the enable/disable hooks come from AceAddon. The default `true` keeps the command registered for the whole session." }
returns: { type = "boolean", desc = "`true` on successful registration." }
---
Register a simple chat command. Sets up the [`SlashCmdList`](https://warcraft.wiki.gg/wiki/World_of_Warcraft_API) entry and the `SLASH_*1` global for the command. If `func` is a string it is treated as a method name and invoked on the embedding object (`self`); otherwise it is used directly as the handler. Non-persisting commands are tracked so they can be re-registered/unregistered as the addon is enabled/disabled.

---

```lua
function MyAddon:OnEnable()
    self:RegisterChatCommand("myslash", "MySlashProcessorFunc")
end
```
````

````apimethod
name: AceConsole:UnregisterChatCommand
kind: method
params:
  - { name = "command", type = "string", desc = "Chat command to be unregistered WITHOUT leading \"/\"." }
---
Unregister a chatcommand.
````
