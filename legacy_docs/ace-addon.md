# AceAddon-3.0

AceAddon-3.0 provides a template for creating addon objects.
It'll provide you with a set of callback functions that allow you to simplify the loading process of your addon.

Callbacks provided are:

- OnInitialize, which is called directly after the addon is fully loaded.
- OnEnable which gets called during the PLAYER_LOGIN event, when most of the data provided by the game is already present.
- OnDisable, which is only called when your addon is manually being disabled.

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

### `addon:Disable()`

Disables the Addon, if possible, return true or false depending on success.
This internally calls AceAddon:DisableAddon(), thus dispatching a OnDisable callback and disabling all modules of the addon.
:Disable() also sets the internal `enableState` variable to false

**Usage**

```lua
-- Disable MyAddon
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
MyAddon:Disable()
```

### `addon:DisableModule(name)`

Disables the Module, if possible, return true or false depending on success.
Short-hand function that retrieves the module via `:GetModule` and calls `:Disable` on the module object.

**Usage**

```lua
-- Disable MyModule using :GetModule
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
MyModule = MyAddon:GetModule("MyModule")
MyModule:Disable()

-- Disable MyModule using the short-hand
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
MyAddon:DisableModule("MyModule")
```

### `addon:Enable()`

Enables the Addon, if possible, return true or false depending on success.
This internally calls AceAddon:EnableAddon(), thus dispatching a OnEnable callback and enabling all modules of the addon (unless explicitly disabled).
:Enable() also sets the internal `enableState` variable to true

**Usage**

```lua
-- Enable MyModule
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
MyModule = MyAddon:GetModule("MyModule")
MyModule:Enable()
```

### `addon:EnableModule(name)`

Enables the Module, if possible, return true or false depending on success.
Short-hand function that retrieves the module via `:GetModule` and calls `:Enable` on the module object.

**Usage**

```lua
-- Enable MyModule using :GetModule
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
MyModule = MyAddon:GetModule("MyModule")
MyModule:Enable()

-- Enable MyModule using the short-hand
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
MyAddon:EnableModule("MyModule")
```

### `addon:GetModule(name[, silent])`

Return the specified module from an addon object.
Throws an error if the addon object cannot be found (except if silent is set)

**Parameters**

- `name` — unique name of the module
- `silent` — if true, the module is optional, silently return nil if its not found (optional)

**Usage**

```lua
-- Get the Addon
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
-- Get the Module
MyModule = MyAddon:GetModule("MyModule")
```

### `addon:GetName()`

Returns the real name of the addon or module, without any prefix.

**Usage**

```lua
print(MyAddon:GetName())
-- prints "MyAddon"
```

### `addon:IsEnabled()`

Query the enabledState of an addon.

**Usage**

```lua
if MyAddon:IsEnabled() then
    MyAddon:Disable()
end
```

### `addon:IterateModules()`

Return an iterator of all modules associated to the addon.

**Usage**

```lua
-- Enable all modules
for name, module in MyAddon:IterateModules() do
    module:Enable()
end
```

### `addon:NewModule(name[, prototype|lib[, lib, ...]])`

Create a new module for the addon.
The new module can have its own embeded libraries and/or use a module prototype to be mixed into the module.
A module has the same functionality as a real addon, it can have modules of its own, and has the same API as an addon object.

**Parameters**

- `name` — unique name of the module
- `prototype` — object to derive this module from, methods and values from this table will be mixed into the module (optional)
- `lib` — List of libraries to embed into the addon

**Usage**

```lua
-- Create a module with some embeded libraries
MyModule = MyAddon:NewModule("MyModule", "AceEvent-3.0", "AceHook-3.0")

-- Create a module with a prototype
local prototype = { OnEnable = function(self) print("OnEnable called!") end }
MyModule = MyAddon:NewModule("MyModule", prototype, "AceEvent-3.0", "AceHook-3.0")
```

### `addon:SetDefaultModuleLibraries(lib[, lib, ...])`

Set the default libraries to be mixed into all modules created by this object.
Note that you can only change the default module libraries before any module is created.

**Parameters**

- `lib` — List of libraries to embed into the addon

**Usage**

```lua
-- Create the addon object
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon")
-- Configure default libraries for modules (all modules need AceEvent-3.0)
MyAddon:SetDefaultModuleLibraries("AceEvent-3.0")
-- Create a module
MyModule = MyAddon:NewModule("MyModule")
```

### `addon:SetDefaultModulePrototype(prototype)`

Set the default prototype to use for new modules on creation.
Note that you can only change the default prototype before any module is created.

**Parameters**

- `prototype` — Default prototype for the new modules (table)

**Usage**

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

### `addon:SetDefaultModuleState(state)`

Set the default state in which new modules are being created.
Note that you can only change the default state before any module is created.

**Parameters**

- `state` — Default state for new modules, true for enabled, false for disabled

**Usage**

```lua
-- Create the addon object
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon")
-- Set the default state to "disabled"
MyAddon:SetDefaultModuleState(false)
-- Create a module and explicilty enable it
MyModule = MyAddon:NewModule("MyModule")
MyModule:Enable()
```

### `addon:SetEnabledState(state)`

Set the state of an addon or module This should only be called before any enabling actually happend, e.g.
in/before OnInitialize.

**Parameters**

- `state` — the state of an addon or module (enabled=true, disabled=false)

### `AceAddon:GetAddon(name, silent)`

Get the addon object by its name from the internal AceAddon registry.
Throws an error if the addon object cannot be found (except if silent is set).

**Parameters**

- `name` — unique name of the addon object
- `silent` — if true, the addon is optional, silently return nil if its not found

**Usage**

```lua
-- Get the Addon
MyAddon = LibStub("AceAddon-3.0"):GetAddon("MyAddon")
```

### `AceAddon:IterateAddonStatus()`

Get an iterator over the internal status registry.

**Usage**

```lua
-- Print a list of all enabled addons
for name, status in AceAddon:IterateAddonStatus() do
    if status then
        print("EnabledAddon: " .. name)
    end
end
```

### `AceAddon:IterateAddons()`

Get an iterator over all registered addons.

**Usage**

```lua
-- Print a list of all installed AceAddon's
for name, addon in AceAddon:IterateAddons() do
    print("Addon: " .. name)
end
```

### `AceAddon:NewAddon([object ,]name[, lib, ...])`

Create a new AceAddon-3.0 addon.
Any libraries you specified will be embeded, and the addon will be scheduled for its OnInitialize and OnEnable callbacks. The final addon object, with all libraries embeded, will be returned.

**Parameters**

- `object` — Table to use as a base for the addon (optional)
- `name` — Name of the addon object to create
- `lib` — List of libraries to embed into the addon

**Usage**

```lua
-- Create a simple addon object
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceEvent-3.0")

-- Create a Addon object based on the table of a frame
local MyFrame = CreateFrame("Frame")
MyAddon = LibStub("AceAddon-3.0"):NewAddon(MyFrame, "MyAddon", "AceEvent-3.0")
```
