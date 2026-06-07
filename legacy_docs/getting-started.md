# Getting Started

Ace3 is designed to be **modular** — not every addon needs every part of it. Pick the libraries that suit your addon and skip the sections for the bits you don't need.

This guide is rebuilt from an older tutorial. Mechanics were checked against the bundled Ace3 source, but version-specific values (TOC fields, available chat channels, etc.) change with the game client — always confirm against the source you ship and the current WoW build.

## Basic Addon File Setup

Create a folder for your addon in `<WoW Directory>\Interface\AddOns`. The name must be unique; pick something descriptive. Inside it you'll create a few text files.

### The `.toc` file

Name it the same as the folder, with `.toc` appended (e.g. `MyAddon/MyAddon.toc`). It tells WoW about your addon and which files to load:

```toc
## Interface: 110000
## Title: My Addon's Title
## Notes: Some notes about this addon.
## Author: Your Name Here
## Version: 0.1
## SavedVariables: MyAddonDB

embeds.xml

Core.lua
```

Lines beginning with `##` are metadata. `## Interface` is the interface version your addon targets.

The `## Interface` value must match the game build you target (the example `110000` is illustrative). Older docs show `40000` (Cataclysm). Use the number for the current client — for retail it changes every patch.

After the `##` lines, the rest of the file lists the files that make up the addon. A common convention is a separate `embeds.xml` to declare embedded libraries, plus a main Lua file (often `Core.lua` or named after the addon).

### `embeds.xml`

Declare the libraries to load, typically by `Include`-ing each library's own XML file. Example using LibStub and two Ace3 libraries from a `Libs` subdirectory:

```xml
<Ui xsi:schemaLocation="http://www.blizzard.com/wow/ui/ ..\FrameXML\UI.xsd">
  <Script file="Libs\LibStub\LibStub.lua"/>
  <Include file="Libs\AceAddon-3.0\AceAddon-3.0.xml"/>
  <Include file="Libs\AceConsole-3.0\AceConsole-3.0.xml"/>
</Ui>
```

Add more libraries with additional `Include` lines. You could reference each library's XML directly in the `.toc` instead, but `embeds.xml` keeps a clear separation between your addon's code and shared libraries.

### `Core.lua`

Your main code file — any `.lua` name works as long as it's listed in the `.toc`. See [Using AceAddon-3.0](#using-aceaddon-3-0) below for the basics of a fully Ace3-based addon.

## Using AceAddon-3.0

### Creating an addon object

Once LibStub and AceAddon-3.0 are referenced, your main Lua file creates an addon instance:

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon")
```

You can mix in other libraries by listing them — for example, adding AceConsole for chat/slash-command abilities:

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceConsole-3.0")
```

### Standard methods

AceAddon calls up to three methods on your addon object at different points in its lifecycle:

```lua
function MyAddon:OnInitialize()
    -- Runs once when the addon is first loaded. Good place to set up your DB.
end

function MyAddon:OnEnable()
    -- Runs when the addon is enabled (can happen multiple times).
end

function MyAddon:OnDisable()
    -- Runs when the addon is disabled.
end
```

`OnInitialize` runs once at load. `OnEnable`/`OnDisable` may run multiple times without a full UI reload.

See [AceAddon-3.0](/api/ace-addon) for the full API.

## Using AceConsole-3.0

### Including AceConsole

The easiest way is as a mixin when creating the addon object:

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceConsole-3.0")
```

Or access it as a separate object:

```lua
MyConsole = LibStub("AceConsole-3.0")
```

### Output

Call `:Print` with the text to output. As a mixin it's available on your addon object:

```lua
-- AceConsole used as a mixin
MyAddon:Print("Hello, world!")

-- print to a specific chat frame
MyAddon:Print(ChatFrame1, "Hello, World!")
```

### Slash commands

Register a command (without the leading slash) and a handler — a method name or a function:

```lua
MyAddon:RegisterChatCommand("myslash", "MySlashProcessorFunc")

function MyAddon:MySlashProcessorFunc(input)
    -- 'input' contains whatever follows the slash command
end
```

In many cases it's simpler to let AceConfig generate slash commands automatically (below).

See [AceConsole-3.0](/api/ace-console) for the full API.

## Using AceConfig-3.0

### Defining an options table and handlers

AceConfig generates the configuration interface for you — you describe the options and how to read/write them in a table:

```lua
local options = {
    name = "MyAddon",
    handler = MyAddon,
    type = "group",
    args = {
        msg = {
            type = "input",
            name = "My Message",
            desc = "The message for my addon",
            set = "SetMyMessage",
            get = "GetMyMessage",
        },
    },
}
```

`get`/`set` may be method names on the `handler` object (or full functions):

```lua
function MyAddon:GetMyMessage(info)
    return myMessageVar
end

function MyAddon:SetMyMessage(info, input)
    myMessageVar = input
end
```

For all option types and modifiers, see the AceConfig-3.0 options table reference.

### Registering the options

Register the table with AceConfig, optionally tying it to slash command(s):

```lua
LibStub("AceConfig-3.0"):RegisterOptionsTable("MyAddonName", options, { "myslash", "myslashtwo" })
```

Pass `nil` as the third argument if you don't want a slash command (e.g. GUI-only config).

See [AceConfig-3.0](/api/ace-config).

## Using AceDB-3.0

### Preparing SavedVariables

To persist data between sessions, declare a SavedVariables table in the `.toc`. A common convention is the addon name with a `DB` suffix:

```toc
## SavedVariables: MyAddonDB
```

### Initializing AceDB

AceDB sits on top of SavedVariables, so it must be created **after** SavedVariables have loaded — in `OnInitialize`, not the main chunk:

```lua
function MyAddon:OnInitialize()
    self.db = LibStub("AceDB-3.0"):New("MyAddonDB")
end
```

The first argument is the SavedVariables name from the TOC. You may also pass a defaults table and a default profile.

### Persisting data values

AceDB exposes subtables: `char`, `realm`, `class`, `race`, `faction`, `factionrealm`, `profile`, and `global`. Values in each are shared by all loads that match that scope (e.g. everything in `realm` is shared by all characters on the same realm):

```lua
function MyAddon:MyFunction()
    self.db.char.myVal = "My character-specific saved value"
    self.db.global.myOtherVal = "My global saved value"
end
```

### Working with profiles

Profiles let users swap between sets of values in `db.profile`:

```lua
db:SetProfile("NewActiveProfile")

local activeProfile = db:GetCurrentProfile()
local possibleProfiles, numProfiles = db:GetProfiles()
```

Copying, deleting and resetting profiles are also available — see [AceDB-3.0](/api/ace-db).

## Using AceDBOptions-3.0

AceDBOptions provides a ready-made profile-management options table for AceDB + AceConfig:

```lua
options.args.profile = LibStub("AceDBOptions-3.0"):GetOptionsTable(db)
```

Call it just before passing your options table to AceConfig; `db` is your AceDB object.

The generated options table is shared between all addons that use it — do not modify it.

See [AceDBOptions-3.0](/api/ace-db-options).

## Using AceEvent-3.0

### Including AceEvent

Recommended as a mixin:

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceEvent-3.0")
```

Or embed into any table, or use as a separate object:

```lua
LibStub("AceEvent-3.0"):Embed(MyObject)
local AceEvent = LibStub("AceEvent-3.0")
```

Not embedding loses conveniences such as automatic event de-registration on disable and better error reporting.

### Subscribing to events

```lua
MyAddon:RegisterEvent("NAME_OF_EVENT")

function MyAddon:NAME_OF_EVENT()
    -- process the event
end
```

Specify a handler method/function instead of the default name:

```lua
MyAddon:RegisterEvent("NAME_OF_EVENT", "MyHandlerMethod")
MyAddon:RegisterEvent("NAME_OF_OTHER_EVENT", function() doSomethingSpiffy() end)
```

The first argument to a handler is always the event name, then the event's own arguments:

```lua
function MyAddon:NAME_OF_EVENT(eventName, arg1, arg2, arg3)
    -- ...
end
```

### Inter-addon messages

Messages work like events but are fired by addons rather than the client:

```lua
MyAddon:RegisterMessage("NAME_OF_MESSAGE")
MyAddon:SendMessage("NAME_OF_MESSAGE")
MyAddon:SendMessage("NAME_OF_OTHER_MESSAGE", arg1, arg2)
```

Messages are local to the client. To talk between players' addons, use AceComm.

See [AceEvent-3.0](/api/ace-event).

## Using AceComm-3.0

### Including AceComm

Mix in, embed, or use separately (pick one):

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceComm-3.0")
LibStub("AceComm-3.0"):Embed(MyObject)
local AceComm = LibStub("AceComm-3.0")
```

### Sending messages to other clients

Use `SendCommMessage(prefix, text, distribution[, target])`:

| Parameter | Description |
| --- | --- |
| `prefix` | A string tag recipients watch for. Printable characters only (`\032`–`\255`). |
| `text` | The data to send. Any characters except `nil` (`\000`); any length — long data is split and reassembled automatically. |
| `distribution` | The channel to send to, e.g. `"PARTY"`, `"RAID"`, `"INSTANCE_CHAT"`, `"GUILD"`, `"OFFICER"`, `"WHISPER"`, `"CHANNEL"`. |
| `target` | The recipient when `distribution` is `"WHISPER"` (`"Name"` or `"Name-Realm"`) or the channel index for `"CHANNEL"`. |

```lua
MyAddon:SendCommMessage("MyPrefix", "the data to send", "RAID")
MyAddon:SendCommMessage("MyPrefix", "more data to send", "WHISPER", "charname")
```

The exact set of valid distributions is defined by the game's `SendAddonMessage` / `C_ChatInfo.SendAddonMessage` API and varies by client version — verify against the current build.

### Receiving messages

Register the prefix you want to listen for. The default handler is `OnCommReceived`:

```lua
MyAddon:RegisterComm("prefix")
MyAddon:RegisterComm("prefix2", "MySecondCommHandler")

function MyAddon:OnCommReceived(prefix, message, distribution, sender)
    -- process the incoming message
end
```

The handler receives `prefix`, `message`, `distribution`, and `sender`.

See [AceComm-3.0](/api/ace-comm).

## Using AceHook-3.0

### Including AceHook

Best as a mixin, so hooks are cleaned up automatically if the user disables your addon:

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceHook-3.0")
```

### Standard (pre-) hooks

A standard hook runs before the original and automatically calls the original afterward. Specify a function name, or an object + method name:

```lua
MyAddon:Hook("APIFunctionName")
MyAddon:Hook(TargetObject, "TargetMethod")
```

By default the call is routed to a same-named method on your addon. Provide a custom handler if you prefer:

```lua
MyAddon:Hook("APIFunctionName", handlerFunc)
MyAddon:Hook("APIFunctionName", "handlerMethod")
```

To hook a secure function despite the tainting risk, pass `true` as the final argument:

```lua
MyAddon:Hook("APISecureFunctionName", handlerFunc, true)
```

### Raw hooks

A raw hook completely replaces the original — you must call it yourself (via `self.hooks`) if you want it to run:

```lua
MyAddon:RawHook("APIFunctionName")

function MyAddon:APIFunctionName(...)
    -- call the original through self.hooks
    self.hooks["APIFunctionName"](...)
end
```

### Secure (post-) hooks

Secure hooks run *after* the original; return values are ignored. Use these for protected Blizzard UI elements to avoid taint:

```lua
MyAddon:SecureHook("APISecureFunctionName")
```

### Hooking scripts

Hook frame scripts with the `*Script` variants:

```lua
MyAddon:HookScript(TargetFrame, "ScriptName")
MyAddon:RawHookScript(TargetFrame, "ScriptName")
MyAddon:SecureHookScript(TargetFrame, "ScriptName")
```

### Checking for an existing hook

```lua
local hookexists, hookhandler = MyAddon:IsHooked("APIFunctionName")
```

See [AceHook-3.0](/api/ace-hook).

## Using AceLocale-3.0

### Registering translations

Create one Lua file per locale and list it in the `.toc` **before** your main code. Fetch a locale table at the top:

```lua
-- enUS.lua
local L = LibStub("AceLocale-3.0"):NewLocale("MyAddon", "enUS", true)
if L then
    L["identifier"] = "Translation for that identifier"
    L["something"] = "Translation for something"
end
```

The third argument marks the default locale (usually `true` for `enUS`, `false` elsewhere). `NewLocale` returns `nil` if that locale isn't needed for the current client, so guard with `if L then`.

### Using translations

In your main file, fetch the active locale table:

```lua
local L = LibStub("AceLocale-3.0"):GetLocale("MyAddon", true)

function MyAddon:MyFunction()
    self:Print(L["identifier"])
end
```

The second argument silences the error if locale info is missing.

### Variable substitution

Use functions for strings that mix in variables, so word order can differ per language:

```lua
-- enUS:
L["Added X DKP to player Y."] = function(X, Y)
    return "Added " .. X .. " DKP for player " .. Y .. "."
end
-- usage:
self:Print(L["Added X DKP to player Y."](dkp_value, playername))
```

See [AceLocale-3.0](/api/ace-locale).

## Using AceSerializer-3.0

Mix in or use separately:

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceSerializer-3.0")
```

Serialize any values into a string:

```lua
local MyVal1 = 23
local MyVal2 = "some text"
local MyVal3 = { "foo", 42, "bar" }

local serializedData = MyAddon:Serialize(MyVal1, MyVal2, MyVal3)
```

Deserialize — the first return is a success boolean; on success the original values follow, on failure an error message:

```lua
local success, v1, v2, v3 = MyAddon:Deserialize(serializedData)
if not success then
    -- handle error (v1 is the error message)
end
```

Combine with AceComm to send structured data between clients. See [AceSerializer-3.0](/api/ace-serializer).
