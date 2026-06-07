# AceConfigDialog-3.0

AceConfigDialog-3.0 generates AceGUI-3.0 based windows based on option tables.

## API Reference

### `AceConfigDialog:AddToBlizOptions(appName, name, parent, ...)`

Add an option table into the Blizzard Interface Options panel.

You can optionally supply a descriptive name to use and a parent frame to use, as well as a path in the options table. If no name is specified, the appName will be used instead.

If you specify a proper `parent` (by name), the interface options will generate a tree layout. Note that only one level of children is supported, so the parent always has to be a head-level note.

This function returns a reference to the container frame registered with the Interface Options, as well as the registered ID. You can use the ID to open the options with the API function `Settings.OpenToCategory`.

**Parameters**

- `appName` — The application name as given to `:RegisterOptionsTable()`
- `name` — A descriptive name to display in the options tree (defaults to appName)
- `parent` — The parent to use in the interface options tree.
- `...` — The path in the options table to feed into the interface options panel.

**Returns**

- The reference to the frame registered into the Interface Options.
- The registered category ID, for `Settings.OpenToCategory`

### `AceConfigDialog:Close(appName)`

Close a specific options window.

**Parameters**

- `appName` — The application name as given to `:RegisterOptionsTable()`

### `AceConfigDialog:CloseAll()`

Close all open options windows.

### `AceConfigDialog:Open(appName [, container][, ...])`

Open an option window at the specified path (if any).

This function can optionally feed the group into a pre-created container instead of creating a new container frame.

**Parameters**

- `appName` — The application name as given to `:RegisterOptionsTable()`
- `container` — An optional container frame to feed the options into
- `...` — The path to open after creating the options window (see `:SelectGroup` for details)

### `AceConfigDialog:SelectGroup(appName, ...)`

Selects the specified path in the options window.

The path specified has to match the keys of the groups in the table.

**Parameters**

- `appName` — The application name as given to `:RegisterOptionsTable()`
- `...` — The path to the key that should be selected

### `AceConfigDialog:SetDefaultSize(appName, width, height)`

Sets the default size of the options window for a specific application.

**Parameters**

- `appName` — The application name as given to `:RegisterOptionsTable()`
- `width` — The default width
- `height` — The default height
