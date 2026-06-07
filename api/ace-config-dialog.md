---
description: "AceConfigDialog-3.0 generates AceGUI-3.0 windows from option tables and adds them to the Blizzard Interface Options panel for World of Warcraft addons"
---

# AceConfigDialog-3.0

AceConfigDialog-3.0 generates [AceGUI-3.0](/acegui/) based windows based on option tables.

## API Reference

````apimethod
name: AceConfigDialog:AddToBlizOptions
params:
  - { name = "appName", type = "string", desc = "The application name as given to [`:RegisterOptionsTable`](/api/ace-config#registeroptionstable)." }
  - { name = "name", type = "string", optional = true, desc = "A descriptive name to display in the options tree (defaults to appName)." }
  - { name = "parent", type = "string", optional = true, desc = "The parent to use in the interface options tree." }
  - { name = "...", type = "any", desc = "The path in the options table to feed into the interface options panel." }
returns:
  - { type = "frame", desc = "The reference to the frame registered into the Interface Options." }
  - { type = "any", desc = "The category ID to pass to `Settings.OpenToCategory`." }
---
Add an option table into the [Blizzard Interface Options panel](https://warcraft.wiki.gg/wiki/FrameXML_functions).

You can optionally supply a descriptive `name` to use and a `parent` frame to use, as well as a path in the options table. If no `name` is specified, the `appName` will be used instead.

If you specify a proper `parent` (by name), the interface options will generate a tree layout. Note that only one level of children is supported, so the `parent` always has to be a head-level node.

This function returns a reference to the container frame registered with the Interface Options, as well as the registered ID. You can use the ID to open the options with the API function [`Settings.OpenToCategory`](https://warcraft.wiki.gg/wiki/API_Settings.OpenToCategory).

---

```lua
local frame, categoryID = LibStub("AceConfigDialog-3.0"):AddToBlizOptions("MyAddon")
```
````

````apimethod
name: AceConfigDialog:Close
params:
  - { name = "appName", type = "string", desc = "The application name as given to [`:RegisterOptionsTable`](/api/ace-config#registeroptionstable)." }
---
Close a specific options window.
````

````apimethod
name: AceConfigDialog:CloseAll
---
Close all open options windows.
````

````apimethod
name: AceConfigDialog:Open
params:
  - { name = "appName", type = "string", desc = "The application name as given to [`:RegisterOptionsTable`](/api/ace-config#registeroptionstable)." }
  - { name = "container", type = "table", optional = true, desc = "An optional container frame to feed the options into." }
  - { name = "...", type = "any", desc = "The path to open after creating the options window (see [`:SelectGroup`](#selectgroup) for details)." }
---
Open an option window at the specified path (if any).

This function can optionally feed the group into a pre-created `container` instead of creating a new container frame.
````

````apimethod
name: AceConfigDialog:SelectGroup
params:
  - { name = "appName", type = "string", desc = "The application name as given to [`:RegisterOptionsTable`](/api/ace-config#registeroptionstable)." }
  - { name = "...", type = "any", desc = "The path to the key that should be selected." }
---
Selects the specified path in the options window.

The path specified has to match the keys of the groups in the table.

---

```lua
LibStub("AceConfigDialog-3.0"):SelectGroup("MyAddon", "display", "colors")
```
````

````apimethod
name: AceConfigDialog:SetDefaultSize
params:
  - { name = "appName", type = "string", desc = "The application name as given to [`:RegisterOptionsTable`](/api/ace-config#registeroptionstable)." }
  - { name = "width", type = "number", desc = "The default width." }
  - { name = "height", type = "number", desc = "The default height." }
---
Sets the default size of the options window for a specific application.
````

````apimethod
name: AceConfigDialog:GetStatusTable
params:
  - { name = "appName", type = "string", desc = "The application name as given to [`:RegisterOptionsTable`](/api/ace-config#registeroptionstable)." }
  - { name = "path", type = "table", optional = true, desc = "The path of group keys identifying a node in the options tree; omit for the root." }
returns: { type = "table", desc = "The status table for that node, created on first access." }
---
Get the table AceConfigDialog uses to persist the open window's UI state (such as the selected group or tab) for `appName` at the given `path`. Read it to inspect the dialog, or seed it to control the initial state.
````
