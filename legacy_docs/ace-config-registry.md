# AceConfigRegistry-3.0

AceConfigRegistry-3.0 handles central registration of options tables in use by addons and modules. Options tables can be registered as raw tables, OR as function refs that return a table. Such functions receive three arguments: "uiType", "uiName", "appName".

Valid uiTypes: "cmd", "dropdown", "dialog". This is verified by the library at call time. The uiName field is expected to contain the full name of the calling addon, including version, e.g. "FooBar-1.0". This is verified by the library at call time. The appName field is the options table name as given at registration time.

`:IterateOptionsTables()` (and `:GetOptionsTable()` if only given one argument) return a function reference that the requesting config handling addon must call with valid "uiType", "uiName".

## API Reference

### `AceConfigRegistry:GetOptionsTable(appName, uiType, uiName)`

Query the registry for a specific options table.

If only appName is given, a function is returned which you can call with (uiType,uiName) to get the table. If uiType&uiName are given, the table is returned.

**Parameters**

- `appName` — The application name as given to `:RegisterOptionsTable()`
- `uiType` — The type of UI to get the table for, one of "cmd", "dropdown", "dialog"
- `uiName` — The name of the library/addon querying for the table, e.g. "MyLib-1.0"

### `AceConfigRegistry:IterateOptionsTables()`

Returns an iterator of `["appName"]=funcref` pairs.

### `AceConfigRegistry:NotifyChange(appName)`

Fires a "ConfigTableChange" callback for those listening in on it, allowing config GUIs to refresh.

You should call this function if your options table changed from any outside event, like a game event or a timer.

**Parameters**

- `appName` — The application name as given to `:RegisterOptionsTable()`

### `AceConfigRegistry:RegisterOptionsTable(appName, options, skipValidation)`

Register an options table with the config registry.

**Parameters**

- `appName` — The application name as given to `:RegisterOptionsTable()`
- `options` — The options table, OR a function reference that generates it on demand. See the top of the page for info on arguments passed to such functions.
- `skipValidation` — Skip options table validation (primarily useful for extremely huge options, with a noticeable slowdown)

### `AceConfigRegistry:ValidateOptionsTable(options, name, errlvl)`

Validates basic structure and integrity of an options table.

Does NOT verify that get/set etc actually exist, since they can be defined at any depth.

**Parameters**

- `options` — The table to be validated
- `name` — The name of the table to be validated (shown in any error message)
- `errlvl` — (optional number) error level offset, default 0 (=errors point to the function calling :ValidateOptionsTable)
