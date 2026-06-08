---
description: "AceAddon-3.0 provides a template for creating addon objects, with OnInitialize, OnEnable and OnDisable lifecycle callbacks and embeddable library mixins"
---

# AceAddon-3.0

AceAddon-3.0 provides a template for creating addon objects. It gives you a set of lifecycle callbacks ([`OnInitialize`](#oninitialize), [`OnEnable`](#onenable), [`OnDisable`](#ondisable)) that simplify the loading process of your addon; see [Callbacks](#callbacks).

## Usage

### Creating an addon object

Once LibStub and AceAddon-3.0 are referenced, your main Lua file creates an addon instance:

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon")
```

You can mix in other libraries by listing them; for example, adding AceConsole for chat/slash-command abilities:

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceConsole-3.0")
```

### Mixins vs. on-demand libraries

The extra arguments to [`:NewAddon`](#newaddon) (and [`:NewModule`](#newmodule)) are libraries to **mix in** (embed). Embedding copies that library's methods onto your addon object, so you call them on `self`:

```lua
local MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceEvent-3.0", "AceConsole-3.0")

function MyAddon:OnEnable()
    self:RegisterEvent("PLAYER_REGEN_DISABLED")  -- from AceEvent, now a method on MyAddon
    self:Print("Enabled!")                        -- from AceConsole
end
```

The library uses your addon as its `self`, so it tracks registrations *per addon*, and AceAddon automatically cleans them up when your addon is disabled (events unregistered, hooks removed, timers cancelled).

Contrast this with grabbing a library **on demand** via `LibStub`, which returns the single shared library object:

```lua
local AceEvent = LibStub("AceEvent-3.0")
-- not embedded: you must supply your own 'self' and manage cleanup yourself
AceEvent.RegisterEvent(MyAddon, "PLAYER_REGEN_DISABLED")
```

#### The `:Embed` method

Every embeddable library has an `:Embed(target)` method that copies its methods onto the table you pass, so you can then call them on that table.

You normally never call it yourself. Listing a library in [`:NewAddon`](#newaddon) or [`:NewModule`](#newmodule) calls `:Embed` on your addon for you, and the copying is identical either way. The reason to let AceAddon do it is **cleanup**: AceAddon knows when your addon is enabled and disabled, so it can tell each embedded library to tear down its registrations (events, hooks, timers) when the addon is disabled. A table you embed into by hand is not an addon AceAddon manages, so nothing cleans it up.

In short: use `:NewAddon`/`:NewModule` to embed; call `:Embed` directly only to add a library's methods to an object that isn't an Ace addon.

Use mixins for the embeddable libraries you call throughout your addon (**AceConsole, AceEvent, AceBucket, AceHook, AceComm, AceTimer, AceSerializer**): it's less typing and you get automatic cleanup. Libraries that produce their own objects or tables (**AceDB**, **AceConfig**/**AceConfigDialog**, **AceGUI**, **AceLocale**, **AceDBOptions**) are not embeddable; fetch them with `LibStub(...)` when you need them.

::: tip
For modules, [`:SetDefaultModuleLibraries`](#setdefaultmodulelibraries) lets you embed the same set of libraries into every module the addon creates, without repeating them on each [`:NewModule`](#newmodule) call.
:::

### Standard methods

AceAddon calls up to three lifecycle callbacks on your addon object: [`OnInitialize`](#oninitialize), [`OnEnable`](#onenable) and [`OnDisable`](#ondisable). [`OnInitialize`](#oninitialize) runs once at load; [`OnEnable`](#onenable)/[`OnDisable`](#ondisable) may run multiple times without a full UI reload. The [Example](#example) below uses all three.

## Example

```lua
-- A small (but complete) addon, that doesn't do anything,
-- but shows usage of the callbacks.
local MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon")

function MyAddon:OnInitialize()
    -- do init tasks here, like loading the Saved Variables,
    -- or setting up slash commands.
end

function MyAddon:OnEnable()
    -- Do more initialization here, that really enables the use of your addon.
    -- Register Events, Hook functions, Create Frames, Get information from
    -- the game that wasn't available in OnInitialize
end

function MyAddon:OnDisable()
    -- Unhook, Unregister Events, Hide frames that you created.
    -- You would probably only use an OnDisable if you want to
    -- build a "standby" mode, or be able to toggle modules on/off.
end
```

## API Reference

````apimethod
name: MyAddon:Disable
kind: method
returns: { type = "boolean", desc = "`true` or `false` depending on whether the addon was successfully disabled." }
---
Disables the addon if possible. Returns `true` or `false` depending on whether it succeeded.
This internally calls `AceAddon:DisableAddon()`, thus dispatching a [`OnDisable`](#ondisable) callback and disabling all modules of the addon.
`:Disable()` also sets the internal `enabledState` variable to false.

---

```lua
-- Disable MyAddon
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
MyAddon:Disable()
```
````

````apimethod
name: MyAddon:DisableModule
kind: method
params:
  - { name = "name", type = "string", desc = "Unique name of the module to disable." }
returns: { type = "boolean", desc = "`true` or `false` depending on whether the module was successfully disabled." }
---
Disables the module if possible. Returns `true` or `false` depending on whether it succeeded.
Short-hand function that retrieves the module via [`:GetModule`](#getmodule) and calls [`:Disable`](#disable) on the module object.

---

```lua
-- Disable MyModule using :GetModule
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
MyModule = MyAddon:GetModule("MyModule")
MyModule:Disable()

-- Disable MyModule using the short-hand
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
MyAddon:DisableModule("MyModule")
```
````

````apimethod
name: MyAddon:Enable
kind: method
returns: { type = "boolean", desc = "`true` or `false` depending on whether the addon was successfully enabled (`nil` if enabling was deferred because the addon is still queued for initialization)." }
---
Enables the addon if possible. Returns `true` or `false` depending on whether it succeeded.
This internally calls `AceAddon:EnableAddon()`, thus dispatching a [`OnEnable`](#onenable) callback and enabling all modules of the addon (unless explicitly disabled).
`:Enable()` also sets the internal `enabledState` variable to true. If the addon is still queued for initialization, enabling is deferred until after the init process completes.

---

```lua
-- Enable MyModule
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
MyModule = MyAddon:GetModule("MyModule")
MyModule:Enable()
```
````

````apimethod
name: MyAddon:EnableModule
kind: method
params:
  - { name = "name", type = "string", desc = "Unique name of the module to enable." }
returns: { type = "boolean", desc = "`true` or `false` depending on whether the module was successfully enabled." }
---
Enables the module if possible. Returns `true` or `false` depending on whether it succeeded.
Short-hand function that retrieves the module via [`:GetModule`](#getmodule) and calls [`:Enable`](#enable) on the module object.

---

```lua
-- Enable MyModule using :GetModule
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
MyModule = MyAddon:GetModule("MyModule")
MyModule:Enable()

-- Enable MyModule using the short-hand
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
MyAddon:EnableModule("MyModule")
```
````

````apimethod
name: MyAddon:GetModule
kind: method
params:
  - { name = "name", type = "string", desc = "Unique name of the module." }
  - { name = "silent", type = "boolean", optional = true, desc = "If true, the module is optional, silently return nil if its not found." }
returns: { type = "table", desc = "The module object, or `nil` if it could not be found and `silent` is set." }
---
Return the specified module from an addon object.
Throws an error if the addon object cannot be found (except if silent is set)

---

```lua
-- Get the Addon
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
-- Get the Module
MyModule = MyAddon:GetModule("MyModule")
```
````

````apimethod
name: MyAddon:GetName
kind: method
returns: { type = "string", desc = "The name of the addon or module." }
---
Returns the real name of the addon or module, without any prefix. For modules this returns the module's own name rather than the internal `parent_module` composite name.
````

````apimethod
name: MyAddon:IsEnabled
kind: method
returns: { type = "boolean", desc = "The current `enabledState` (`true` if enabled, `false` if disabled)." }
---
Query the enabledState of an addon.

---

```lua
if MyAddon:IsEnabled() then
    MyAddon:Disable()
end
```
````

````apimethod
name: MyAddon:IterateModules
kind: method
returns: { type = "function", desc = "A `pairs` iterator over the addon's modules (yielding `name, module`)." }
---
Return an iterator of all modules associated to the addon.

---

```lua
-- Enable all modules
for name, module in MyAddon:IterateModules() do
    module:Enable()
end
```
````

````apimethod
name: MyAddon:IterateEmbeds
kind: method
returns: { type = "function", desc = "A `pairs` iterator over the list of library names embedded in the addon." }
---
Returns an iterator of all libraries embedded in the addon.

---

```lua
for _, lib in MyAddon:IterateEmbeds() do
    print("Embedded: " .. lib)
end
```
````

````apimethod
name: MyAddon:NewModule
kind: method
params:
  - { name = "name", type = "string", desc = "Unique name of the module." }
  - { name = "prototype|lib", type = "table|string", optional = true, desc = "A prototype table to mix into the module, or a library name to embed. If a table, its methods and values are mixed into the module; if a string, it is treated as the first library to embed." }
  - { name = "...", type = "string", desc = "Additional libraries to embed into the module." }
returns: { type = "table", desc = "The newly created module object." }
---
Create a new module for the addon.
The new module can have its own embedded libraries and/or use a module prototype to be mixed into the module.
A module has the same functionality as a real addon, it can have modules of its own, and has the same API as an addon object.

---

```lua
-- Create a module with some embeded libraries
MyModule = MyAddon:NewModule("MyModule", "AceEvent-3.0", "AceHook-3.0")

-- Create a module with a prototype
local prototype = { OnEnable = function(self) print("OnEnable called!") end }
MyModule = MyAddon:NewModule("MyModule", prototype, "AceEvent-3.0", "AceHook-3.0")
```
````

````apimethod
name: MyAddon:SetDefaultModuleLibraries
kind: method
params:
  - { name = "...", type = "string", desc = "Names of libraries to embed into every module created by this object." }
---
Set the default libraries to be mixed into all modules created by this object.
Note that you can only change the default module libraries before any module is created.

---

```lua
-- Create the addon object
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon")
-- Configure default libraries for modules (all modules need AceEvent-3.0)
MyAddon:SetDefaultModuleLibraries("AceEvent-3.0")
-- Create a module
MyModule = MyAddon:NewModule("MyModule")
```
````

````apimethod
name: MyAddon:SetDefaultModulePrototype
kind: method
params:
  - { name = "prototype", type = "table", desc = "Default prototype for the new modules." }
---
Set the default prototype to use for new modules on creation.
Note that you can only change the default prototype before any module is created.

---

```lua
-- Define a prototype
local prototype = { OnEnable = function(self) print("OnEnable called!") end }
-- Set the default prototype
MyAddon:SetDefaultModulePrototype(prototype)
-- Create a module and explicitly Enable it
MyModule = MyAddon:NewModule("MyModule")
MyModule:Enable()
-- should print "OnEnable called!" now
```

**See also:** [NewModule]
````

````apimethod
name: MyAddon:SetDefaultModuleState
kind: method
params:
  - { name = "state", type = "boolean", desc = "Default state for new modules, true for enabled, false for disabled." }
---
Set the default state in which new modules are being created.
Note that you can only change the default state before any module is created.

---

```lua
-- Create the addon object
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon")
-- Set the default state to "disabled"
MyAddon:SetDefaultModuleState(false)
-- Create a module and explicitly enable it
MyModule = MyAddon:NewModule("MyModule")
MyModule:Enable()
```
````

````apimethod
name: MyAddon:SetEnabledState
kind: method
params:
  - { name = "state", type = "boolean", desc = "The state of an addon or module (enabled=true, disabled=false)." }
---
Set the state of an addon or module. This sets the internal `enabledState` and should only be called before any enabling actually happens, e.g. in/before [`OnInitialize`](#oninitialize).

---

```lua
function MyAddon:OnInitialize()
    -- start disabled until the user opts in
    self:SetEnabledState(false)
end
```
````

````apimethod
name: AceAddon:GetAddon
kind: method
params:
  - { name = "name", type = "string", desc = "Unique name of the addon object." }
  - { name = "silent", type = "boolean", optional = true, desc = "If true, the addon is optional, silently return nil if its not found." }
returns: { type = "table", desc = "The addon object, or `nil` if it could not be found and `silent` is set." }
---
Get the addon object by its name from the internal AceAddon registry.
Throws an error if the addon object cannot be found (except if silent is set).
````

````apimethod
name: AceAddon:IterateAddonStatus
kind: method
returns: { type = "function", desc = "A `pairs` iterator over the status registry (yielding `name, status`)." }
---
Get an iterator over the internal status registry.

---

```lua
-- Print a list of all enabled addons
for name, status in AceAddon:IterateAddonStatus() do
    if status then
        print("EnabledAddon: " .. name)
    end
end
```
````

````apimethod
name: AceAddon:IterateAddons
kind: method
returns: { type = "function", desc = "A `pairs` iterator over all registered addons (yielding `name, addon`)." }
---
Get an iterator over all registered addons.

---

```lua
-- Print a list of all installed AceAddon's
for name, addon in AceAddon:IterateAddons() do
    print("Addon: " .. name)
end
```
````

````apimethod
name: AceAddon:NewAddon
kind: method
params:
  - { name = "object", type = "table", optional = true, desc = "Table to use as a base for the addon." }
  - { name = "name", type = "string", desc = "Name of the addon object to create." }
  - { name = "...", type = "string", desc = "Names of libraries to embed into the addon." }
returns: { type = "table", desc = "The new addon object, with all specified libraries embedded." }
---
Create a new AceAddon-3.0 addon.
Any libraries you specified will be embedded, and the addon will be scheduled for its [`OnInitialize`](#oninitialize) and [`OnEnable`](#onenable) callbacks. The final addon object, with all libraries embedded, will be returned.

`object` is not a true positional argument: the first argument is used as the base object only if it is a table, otherwise it is taken as the `name` and a fresh object is created. So `NewAddon("MyAddon", ...)` and `NewAddon(myTable, "MyAddon", ...)` are both valid.

---

```lua
-- Create a simple addon object
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceEvent-3.0")

-- Create a Addon object based on the table of a frame
local MyFrame = CreateFrame("Frame")
MyAddon = LibStub("AceAddon-3.0"):NewAddon(MyFrame, "MyAddon", "AceEvent-3.0")
```
````

## Callbacks

AceAddon calls these lifecycle methods on your addon (and module) objects if you define them. They aren't fired through CallbackHandler; you simply declare them as methods on the object returned by [`:NewAddon`](#newaddon)/[`:NewModule`](#newmodule).

````apimethod
name: MyAddon:OnInitialize
kind: callback
---
Called once, directly after the addon is fully loaded, after its `SavedVariables` are available. The place to create your database, register options, set up slash commands, and do other one-time setup. Runs exactly once per session.
````

````apimethod
name: MyAddon:OnEnable
kind: callback
---
Called when the addon is enabled: the first time during the [`PLAYER_LOGIN`](https://warcraft.wiki.gg/wiki/PLAYER_LOGIN) event, when most game data is available. Register events, apply hooks, create frames and read game state here. May run more than once if the addon is toggled off and on (it is **not** tied to a UI reload).
````

````apimethod
name: MyAddon:OnDisable
kind: callback
---
Called when the addon is disabled. Undo what [`OnEnable`](#onenable) did: unregister events, remove hooks, hide frames. Only happens when the addon (or module) is explicitly disabled, so most addons that are never disabled won't need it.
````

````apimethod
name: MyAddon:OnModuleCreated
kind: callback
params:
  - { name = "module", type = "table", desc = "The newly created module object." }
---
Called on the parent addon each time it creates a module (via [`:NewModule`](#newmodule)), if the addon defines it. Handy for applying shared setup to every module as it is created.
````
