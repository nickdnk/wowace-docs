# AceConsole-3.0

AceConsole-3.0 provides registration facilities for slash commands. You can register slash commands to your custom functions and use the `GetArgs` function to parse them to your addons individual needs.

AceConsole-3.0 can be embeded into your addon, either explicitly by calling `AceConsole:Embed(MyAddon)` or by specifying it as an embeded library in your AceAddon. All functions will be available on your addon object and can be accessed directly, without having to explicitly call AceConsole itself.

It is recommended to embed AceConsole, otherwise you'll have to specify a custom `self` on all calls you make into AceConsole.

## API Reference

### `AceConsole:GetArgs(str, numargs, startpos)`

Retreive one or more space-separated arguments from a string.

Treats quoted strings and itemlinks as non-spaced.

**Parameters**

- `str` — The raw argument string
- `numargs` — How many arguments to get (default 1)
- `startpos` — Where in the string to start scanning (default 1)

**Returns**

- Returns `arg1, arg2, ..., nextposition`. Missing arguments will be returned as nils. `nextposition` is returned as `1e9` at the end of the string.

### `AceConsole:IterateChatCommands()`

Get an iterator over all Chat Commands registered with AceConsole.

**Returns**

- Iterator (`pairs`) over all commands

### `AceConsole:Print([chatframe ,] ...)`

Print to `DEFAULT_CHAT_FRAME` or given ChatFrame (anything with an `.AddMessage` function).

**Parameters**

- `chatframe` — Custom ChatFrame to print to (or any frame with an `.AddMessage` function)
- `...` — List of any values to be printed

### `AceConsole:Printf([chatframe ,] "format"[, ...])`

Formatted (using `format()`) print to `DEFAULT_CHAT_FRAME` or given ChatFrame (anything with an `.AddMessage` function).

**Parameters**

- `chatframe` — Custom ChatFrame to print to (or any frame with an `.AddMessage` function)
- `format` — Format string - same syntax as standard Lua `format()`
- `...` — Arguments to the format string

### `AceConsole:RegisterChatCommand(command, func, persist)`

Register a simple chat command.

**Parameters**

- `command` — Chat command to be registered WITHOUT leading "/"
- `func` — Function to call when the slash command is being used (funcref or methodname)
- `persist` — if false, the command will be soft disabled/enabled when aceconsole is used as a mixin (default: true)

### `AceConsole:UnregisterChatCommand(command)`

Unregister a chatcommand.

**Parameters**

- `command` — Chat command to be unregistered WITHOUT leading "/"
