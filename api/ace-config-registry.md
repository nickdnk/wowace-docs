---
description: "AceConfigRegistry-3.0 handles central registration of AceConfig options tables for addons and modules and notifies consumers when those tables change"
---

# AceConfigRegistry-3.0

AceConfigRegistry-3.0 handles central registration of options tables in use by addons and modules. Options tables can be registered as raw tables, OR as function refs that return a table. Such functions receive three arguments: `uiType`, `uiName`, `appName`.

Valid `uiType` values: `"cmd"`, `"dropdown"`, `"dialog"`. This is verified by the library at call time. The `uiName` field is expected to contain the full name of the calling addon, including version, e.g. `"FooBar-1.0"`. This is verified by the library at call time. The `appName` field is the options table name as given at registration time.

[`:IterateOptionsTables()`](#iterateoptionstables) (and [`:GetOptionsTable()`](#getoptionstable) if only given one argument) return a function reference that the requesting config handling addon must call with valid `uiType`, `uiName`.

## API Reference

````apimethod
name: AceConfigRegistry:GetOptionsTable
params:
  - { name = "appName", type = "string", desc = "The application name as given to [`:RegisterOptionsTable()`](#registeroptionstable)." }
  - { name = "uiType", type = "string", optional = true, desc = "The type of UI to get the table for, one of `\"cmd\"`, `\"dropdown\"`, `\"dialog\"`." }
  - { name = "uiName", type = "string", optional = true, desc = "The name of the library/addon querying for the table, e.g. `\"MyLib-1.0\"`." }
returns:
  - { type = "table|function", desc = "If only `appName` is given, a function is returned which you can call with (`uiType`, `uiName`) to get the table. If `uiType` & `uiName` are given, the table is returned. `nil` if no options table has been registered under `appName`." }
---
Query the registry for a specific options table.

If only `appName` is given, a function is returned which you can call with (`uiType`, `uiName`) to get the table. If `uiType` & `uiName` are given, the table is returned.

Returns `nil` if no options table has been registered under `appName`.
````

````apimethod
name: AceConfigRegistry:IterateOptionsTables
returns:
  - { type = "function", desc = "An iterator (`pairs`) over `[\"appName\"] = funcref` pairs." }
---
Returns an iterator of `["appName"] = funcref` pairs.

---

```lua
for appName, getTable in LibStub("AceConfigRegistry-3.0"):IterateOptionsTables() do
    -- getTable("dialog", "MyAddon-1.0") returns the options table
end
```
````

````apimethod
name: AceConfigRegistry:NotifyChange
params:
  - { name = "appName", type = "string", desc = "The application name as given to [`:RegisterOptionsTable()`](#registeroptionstable)." }
---
Fires a `"ConfigTableChange"` callback for those listening in on it, allowing config GUIs to refresh.

You should call this function if your options table changed from any outside event, like a game event or a timer.
````

````apimethod
name: AceConfigRegistry:RegisterOptionsTable
params:
  - { name = "appName", type = "string", desc = "The application name as given to `:RegisterOptionsTable()`." }
  - { name = "options", type = "table|function", desc = "The options table, OR a function reference that generates it on demand. See the top of the page for info on arguments passed to such functions." }
  - { name = "skipValidation", type = "boolean", optional = true, desc = "Skip options table validation (primarily useful for extremely huge options, with a noticeable slowdown)." }
---
Register an options table with the config registry.
````

````apimethod
name: AceConfigRegistry:ValidateOptionsTable
params:
  - { name = "options", type = "table", desc = "The table to be validated." }
  - { name = "name", type = "string", desc = "The name of the table to be validated (shown in any error message)." }
  - { name = "errlvl", type = "number", optional = true, default = "0", desc = "A non-negative integer added to the Lua `error()` level used to report validation failures; it controls which stack frame the error is blamed on. `0` (the default) points the error at the function that called `:ValidateOptionsTable`; raise it by `1` for each additional wrapper frame you want the error to skip past so it blames your caller instead." }
---
Validates basic structure and integrity of an options table.

Does NOT verify that `get`/`set` etc actually exist, since they can be defined at any depth.
````
