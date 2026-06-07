---
description: "Reference for AceConfig-3.0 options tables, the declarative Lua format describing an addon's options and commands that become a GUI and slash commands"
---

# AceConfig-3.0 Options Tables

An options table is a standardized, declarative description of an addon's options and commands. Instead of building UI widgets or parsing slash commands yourself, you describe *what* options exist as a plain Lua table, and AceConfig turns that description into a dialog window, a dropdown menu, and a command-line interface.

This page documents the table format. To register an options table and display it as a GUI or slash command, see [AceConfig-3.0](/api/ace-config).

A minimal example:

```lua
myOptionsTable = {
    type = "group",
    args = {
        enable = {
            name = "Enable",
            desc = "Enables / disables the addon",
            type = "toggle",
            set = function(info, val) MyAddon.enabled = val end,
            get = function(info) return MyAddon.enabled end,
        },
        moreoptions = {
            name = "More Options",
            type = "group",
            args = {
                -- more options go here
            },
        },
    },
}
```

## The Basics

Every option table has to start with a head **group** node. It can have a `name` and an `icon`, but only the `type = "group"` and the `args` table are required.

You can nest groups as deep as you need them to be, and include options on any level. Of course, not everything makes sense from a UI design perspective.

Nearly all parameters can be **inherited** through the table tree. For example, you can define one `get` handler on a group, and all member nodes (and member nodes of sub-groups) will use it unless overridden.

Currently inherited are: `set`, `get`, `func`, `confirm`, `validate`, `disabled`, `hidden`.

To declare that an inherited value is NOT to be used even though a parent has it, set it to `false`.

The keys used in the option tables can contain all printable characters. If you use spaces in the keys and intend to use your option table with a command-line interface like [AceConfigCmd-3.0](/api/ace-config-cmd), make sure your keys do not collide: [AceConfigCmd-3.0](/api/ace-config-cmd) maps spaces to underscores, so `"foo bar"` and `"foo_bar"` would collide.

Most parameters can also be a function reference, which is called when the value is requested. Every function called by AceConfig receives an `info` table as its first parameter, describing the current position in the tree, the type of UI displaying the options, and the options table itself. See [Callback Arguments](#callback-arguments).

## Common Parameters

The following parameters apply to all types of nodes and groups, and control the general layout of the options.

| Parameter | Type | Description |
|---|---|---|
| `name` | string \| function | Display name for the option. |
| `desc` | string \| function | Description for the option (or `nil` for a self-describing name). |
| `descStyle` | string | `"inline"` to show the description below the option in a GUI rather than as a tooltip. Currently only supported by AceGUI "Toggle". |
| `validate` | methodname \| function \| false | Validate the input/value before setting it. Return a string (error message) to indicate an error. |
| `confirm` | methodname \| function \| boolean | Prompt for confirmation before changing a value. `true` displays "name - desc" (or `confirmText`); a function may return a prompt string, `true`, or `false` to skip confirmation. |
| `order` | number \| methodname \| function | Relative position of item (default = 100, `0` = first, `-1` = last). |
| `disabled` | methodname \| function \| boolean | Disabled but visible. |
| `hidden` | methodname \| function \| boolean | Hidden (but still usable if you can reach it, e.g. via commandline). |
| `guiHidden` | methodname \| function \| boolean | Hide this from graphical UIs (dialog, dropdown). |
| `dialogHidden` | methodname \| function \| boolean | Hide this from dialog UIs. |
| `dropdownHidden` | methodname \| function \| boolean | Hide this from dropdown UIs. |
| `cmdHidden` | methodname \| function \| boolean | Hide this from the commandline. |
| `icon` | string \| number \| function | Path to icon texture. |
| `iconCoords` | table \| methodname \| function | Arguments to pass to [`SetTexCoord`](https://warcraft.wiki.gg/wiki/API_Texture_SetTexCoord), e.g. `{0.1, 0.9, 0.1, 0.9}`. |
| `handler` | table | Object on which getter/setter functions are called if they are declared as strings (methodnames) rather than function references. |
| `type` | string | The option type: `"execute"`, `"input"`, `"group"`, etc. See [Item Types](#item-types). |
| `width` | string \| number | GUI hint for how wide the option should be (optional support). One of `"double"`, `"half"`, `"full"`, `"normal"`, or a number. Default is `nil` (not set). See below. |

`width` sub-values:

- `"double"`, `"half"`: increase / decrease the size of the option.
- `"full"`: make the option the full width of the window.
- `"normal"`: use the default widget width for the implementation (useful to override widgets that default to `"full"`).
- any number: a multiplier of the default width, e.g. `0.5` equals `"half"`, `2.0` equals `"double"`.

::: tip Note
Only `hidden` can be a function; the specialized `guiHidden` / `dialogHidden` / `dropdownHidden` / `cmdHidden` cases were historically documented as booleans, but the current Ace3 source accepts a methodname, function, or boolean for all of them.
:::

The current Ace3 source also accepts these additional common parameters: `confirmText` (string, the confirmation prompt text when `confirm` is `true`), `tooltipHyperlink` (string|function, a hyperlink embedded in the option's tooltip), and `relWidth` (number, a relative-width hint as a fraction of the available space).

## Item Types

### execute

Runs `func`. In a GUI this is a button; if `image` is set, it displays a clickable image instead of a default button.

| Field | Type | Description |
| --- | --- | --- |
| `func` | `function\|methodname` | Function to execute. |
| `image` | `string\|number\|function` | Path to image texture; if a function, it may optionally return the image width and height as the 2nd and 3rd values, used instead of `imageWidth`/`imageHeight`. |
| `imageCoords` | `table\|methodname\|function` | Arguments to pass to `SetTexCoord`, e.g. `{0.1, 0.9, 0.1, 0.9}`. |
| `imageWidth` | `number` | Width of the displayed image. |
| `imageHeight` | `number` | Height of the displayed image. |

### input

A simple text input, with an optional validation pattern or function.

| Field | Type | Description |
| --- | --- | --- |
| `get` | `function\|methodname` | Getter function. |
| `set` | `function\|methodname` | Setter function. |
| `multiline` | `boolean\|integer` | If `true`, shown as a multiline editbox in dialog implementations (integer = number of lines). |
| `pattern` | `string` | Optional validation pattern. (Use `validate` for more advanced checks.) |
| `usage` | `string` | Usage string, displayed if the pattern mismatches and in console help messages. |

For checks a `pattern` can't express, use a `validate` function (a [common parameter](#common-parameters)). Return an error string to reject the value, or `true` to accept it:

```lua
maxTargets = {
    type = "input",
    name = "Max targets",
    usage = "a number between 1 and 40",
    get = function(info) return tostring(MyAddon.db.profile.maxTargets) end,
    set = function(info, value) MyAddon.db.profile.maxTargets = tonumber(value) end,
    validate = function(info, value)
        local n = tonumber(value)
        if not n or n < 1 or n > 40 then
            return "Max targets must be a number between 1 and 40."
        end
        return true
    end,
}
```

### toggle

A simple checkbox.

| Field | Type | Description |
| --- | --- | --- |
| `get` | `function\|methodname` | Getter function. |
| `set` | `function\|methodname` | Setter function. |
| `tristate` | `boolean` | Make it a tri-state checkbox. Values cycle through unchecked (`false`), checked (`true`), greyed (`nil`), in that order. |
| `image` | `string\|number\|function` | Optional image texture displayed next to the checkbox in a dialog UI. |
| `imageCoords` | `table\|methodname\|function` | Arguments to pass to `SetTexCoord` for `image`, e.g. `{0.1, 0.9, 0.1, 0.9}`. |

### range

Configures a numeric value in a specific range. In a GUI, a slider.

| Field | Type | Description |
| --- | --- | --- |
| `min` | `number` | Minimum value. |
| `max` | `number` | Maximum value. |
| `softMin` | `number` | "Soft" minimum, used by the UI as a convenient limit while still allowing manual input up to `min`/`max`. |
| `softMax` | `number` | "Soft" maximum, used by the UI as a convenient limit while still allowing manual input up to `min`/`max`. |
| `step` | `number` | Step value used to validate numeric input (default = no stepping limit). |
| `bigStep` | `number` | A more generally-useful step size. Support in UIs is optional. |
| `get` | `function\|methodname` | Getter function. |
| `set` | `function\|methodname` | Setter function. |
| `isPercent` | `boolean` | Represent e.g. `1.0` as `100%` (default `false`). |

::: warning Note
The `step` checking only works if you specify valid `min` and `max` values. Even when using `softMin`/`softMax`, `min` and `max` are still required for `step` to function. If no `min` or `max` are specified, the manual input of the range control will accept any and all values.
:::

### select

Only one value can be selected. In a dropdown UI this is likely a radio group; in a dialog, likely a combobox.

| Field | Type | Description |
| --- | --- | --- |
| `values` | `table\|function` | `[key]=value` pair table; the key is passed to `set`, the value is the string displayed. |
| `sorting` | `table\|function` | Optional array-style table of the keys of `values`, defining their display order. |
| `get` | `function\|methodname` | Getter function. |
| `set` | `function\|methodname` | Setter function. |
| `style` | `string` | `"dropdown"` or `"radio"` (optional support in implementations). |
| `itemControl` | `string` | Name of a custom AceGUI item widget to use for the dropdown entries (dialog UI only). |

### multiselect

Multiple `toggle` elements condensed into a group of checkboxes (or something else that makes sense in the interface).

| Field | Type | Description |
| --- | --- | --- |
| `values` | `table\|function` | `[key]=value` pair table; the key is passed to `set`, the value is the string displayed. |
| `get` | `function\|methodname` | Called for every key in `values`, with the key name as the last parameter. |
| `set` | `function\|methodname` | Called with `keyname, state` as parameters. |
| `style` | `string` | Optional UI style hint. |
| `tristate` | `boolean` | Make the checkmarks tri-state. Values cycle through unchecked (`false`), checked (`true`), greyed (`nil`), in that order. |

Unlike most types, `get` and `set` operate **per key**: AceConfig calls `get` once for every key in `values` (passing that key), and calls `set` with the key and its new state.

```lua
track = {
    type = "multiselect",
    name = "Track mob types",
    values = {
        elite = "Elite mobs",
        rare  = "Rare mobs",
        boss  = "Bosses",
    },
    -- called once per key; return whether that key is enabled
    get = function(info, key) return MyAddon.db.profile.track[key] end,
    -- called with the toggled key and its new on/off state
    set = function(info, key, state) MyAddon.db.profile.track[key] = state end,
}
```

### color

Opens a color picker (in a GUI, possibly via a button).

| Field | Type | Description |
| --- | --- | --- |
| `get` | `function\|methodname` | Getter function. |
| `set` | `function\|methodname` | Setter function. |
| `hasAlpha` | `boolean\|methodname\|function` | Indicate if alpha is adjustable (default `false`). |

Getter/setter functions use 4 arguments/returns: `r, g, b, a`. If `hasAlpha` is `false`/`nil`, alpha is always set as `1.0`.

```lua
barColor = {
    type = "color",
    name = "Bar color",
    hasAlpha = true,
    -- return four numbers: red, green, blue, alpha (each 0-1)
    get = function(info)
        local c = MyAddon.db.profile.barColor
        return c.r, c.g, c.b, c.a
    end,
    -- receives the same four values back
    set = function(info, r, g, b, a)
        local c = MyAddon.db.profile.barColor
        c.r, c.g, c.b, c.a = r, g, b, a
    end,
}
```

### keybinding

| Field | Type | Description |
| --- | --- | --- |
| `get` | `function\|methodname` | Getter function. |
| `set` | `function\|methodname` | Setter function. |

### header

A heading. In commandline and dropdown UIs it shows as a heading; in a dialog UI it additionally provides a break in the layout.

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | The text to display in the heading. |

### description

A paragraph of text appearing alongside other options, optionally with an image in front of it.

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | The text to display. |
| `fontSize` | `string\|function` | Size of the text: `"large"`, `"medium"`, or `"small"` (default `"small"`). |
| `image` | `string\|number\|function` | Path to image texture; if a function, it may optionally return width and height as the 2nd and 3rd values, used instead of `imageWidth`/`imageHeight`. |
| `imageCoords` | `table\|methodname\|function` | Arguments to pass to `SetTexCoord`, e.g. `{0.1, 0.9, 0.1, 0.9}`. |
| `imageWidth` | `number` | Width of the displayed image. |
| `imageHeight` | `number` | Height of the displayed image. |

### group

The first table in an AceOptions table is implicitly a group. Add more levels by nesting tables with `type = "group"` under an `args` table.

| Field | Type | Description |
| --- | --- | --- |
| `args` | `table` | Subtable with more items/groups in it. |
| `plugins` | `table` | Named subtables, each containing more args. This lets modules and libraries add content to an addon's options table (see example below). |
| `childGroups` | `string` | How child groups are displayed: `"tree"` (the default) as child nodes in a tree control, `"tab"` as tabs, or `"select"` as a dropdown list. Only dialog-driven UIs are assumed to behave differently for all types. |
| `inline` | `boolean` | Show as a bordered box in a dialog UI, or at the parent's level with a separate heading in commandline and dropdown UIs. |
| `cmdInline` | `boolean` | As `inline`, only obeyed by commandline. |
| `guiInline` | `boolean` | As `inline`, only obeyed by graphical UIs. |
| `dropdownInline` | `boolean` | As `inline`, only obeyed by dropdown UIs. |
| `dialogInline` | `boolean` | As `inline`, only obeyed by dialog UIs. |

The `plugins` field lets modules and libraries inject their own args into an addon's options table:

```lua
plugins["myPlugin"] = {
    option1 = {...}, option2 = {...}, group1 = {...},
}
plugins["otherPlugin"] = {...}
```

## Callback Handling

For each `set`/`get`/`func`/`validate`/`confirm` callback attempted, the tree is ALWAYS traversed toward the root until such a directive is found. Similarly, if callbacks are given as strings (methodnames), the tree is traversed to find a `handler` argument.

To declare that an inherited value is NOT to be used even though a parent has it, set it to `false`. This is primarily useful for `validate` and `confirm`, but is allowed for all inherited values including `handler`.

This inheritance lets you define `handler`, `get` and `set` **once** on the root group and have every option use them. When the callbacks are strings, they are looked up as methods on the `handler` object (called as `handler:Method(info, ...)`). Because `info[#info]` is the leaf option's key, a single getter/setter pair can serve the whole table:

```lua
local options = {
    type = "group",
    handler = MyAddon,   -- string callbacks resolve to methods on this object
    get = "GetValue",    -- inherited by every child unless overridden
    set = "SetValue",
    args = {
        enabled = { type = "toggle", name = "Enabled", order = 1 },
        scale   = { type = "range", name = "Scale", min = 0.5, max = 2, step = 0.1, order = 2 },
        sound = {
            type = "toggle", name = "Play sound", order = 3,
            set = "SetSound",   -- override the inherited setter for this one option
        },
    },
}

-- One pair of methods services every option, keyed by info[#info]:
function MyAddon:GetValue(info)
    return self.db.profile[info[#info]]
end
function MyAddon:SetValue(info, value)
    self.db.profile[info[#info]] = value
end
function MyAddon:SetSound(info, value)
    self.db.profile.sound = value
    self:UpdateSoundState()   -- extra work only this option needs
end
```

## Callback Arguments

All callbacks receive a standardized set of arguments:

```lua
(info, value[, value2, ...])
```

In detail, the `info` table contains:

- An `options` member pointing at the root of the options table.
- An `appName` member: the application name the options table was registered under. The same value is also stored at position `0`. (When invoked from a slash command, `info[0]` is the slash command instead, without the leading slash.)
- The name of the first group traversed into at position `1`.
- The node name at position `n` (may be `1` if at the root level).
  - Hint: use `info[#info]` to get the leaf node name, `info[#info-1]` for the parent, and so on.
- An `arg` member, if set in the node.
- A `handler` member: the handler object for the current option.
- A `type` member: the type of the current option.
- An `option` member pointing at the current option.
- `uiType` and `uiName` members: the same values passed when retrieving the options table from [AceConfigRegistry-3.0](/api/ace-config-registry).

The callback may not assume ownership of the `info` table; the config parser is assumed to reuse it. It may also contain more members, but these are outside the spec and may change at any time; do not rely on undocumented `info` members.

Callbacks of the form `handler:"methodname"` are of course passed the handler object as the first (`self`) argument.

Example:

```lua
local function mySetterFunc(info, value)
    db[info[#info]] = value   -- we use the db names in our settings
    print("The " .. info[#info] .. " was set to: " .. tostring(value))
end
```

## Custom Controls

You can register your own AceGUI-3.0 widget and tell [AceConfigDialog-3.0](/api/ace-config-dialog) to use it for an option, via the `dialogControl` attribute (the `control` attribute works too). It is supported for the simple control types, but not for groups. For `select`, a custom control only applies to the default dropdown style; `style = "radio"` builds its own checkbox group and ignores `dialogControl`.

```lua
-- LibSharedMedia-3.0 and AceGUI-3.0-SharedMediaWidgets are third-party
-- libraries, not part of Ace3. They are shown here only to illustrate a
-- real custom control.
local media = LibStub("LibSharedMedia-3.0")
self.options = {
    type = "group",
    args = {
        texture = {
            type = "select",
            name = "Texture",
            desc = "Set the statusbar texture.",
            values = media:HashTable("statusbar"),
            dialogControl = "LSM30_Statusbar", -- a custom AceGUI widget from SharedMediaWidgets
        },
    },
}
```

### What AceConfigDialog expects of a custom widget

AceConfigDialog creates the widget with `AceGUI:Create(dialogControl)`. If that fails (the type isn't registered) it logs an error and falls back to the built-in widget for the option type, so your control must be a properly registered AceGUI-3.0 widget.

On **every** control, AceConfigDialog:

- calls `:SetDisabled(disabled)` if that method exists;
- sets its width with `:SetWidth(pixels)` or `:SetRelativeWidth(fraction)`, or honours `widget.width = "fill"`;
- calls `:SetCustomData(arg)` if the method exists and the option has an `arg`;
- registers `OnEnter` / `OnLeave` callbacks (for the option tooltip) and `OnRelease` (for cleanup), so your widget must fire `OnEnter` / `OnLeave`.

Beyond that, the methods called and the callback AceConfigDialog listens for depend on the option type. Your widget needs to implement the ones for the type(s) it replaces, and fire the listed callback with the new value(s) as arguments (that callback argument is exactly what gets passed to the option's `set`).

| Option type | Built-in fallback | Methods called on the widget | Callback fired by the widget |
| --- | --- | --- | --- |
| `execute` | Button (Icon if `image` set) | `SetLabel`/`SetText`, `SetImage`, `SetImageSize` | `OnClick` |
| `input` | EditBox (MultiLineEditBox if `multiline`) | `SetLabel`, `SetText`, `SetNumLines` (multiline) | `OnEnterPressed(value)` |
| `toggle` | CheckBox | `SetLabel`, `SetValue`, `SetTriState`, `SetDescription` (inline desc), `SetImage` | `OnValueChanged(value)` |
| `range` | Slider | `SetLabel`, `SetSliderValues`, `SetIsPercent`, `SetValue` | `OnValueChanged(value)`, `OnMouseUp(value)` |
| `select` | Dropdown | `SetLabel`, `SetList(values, sorting)`, `SetValue` | `OnValueChanged(key)` |
| `multiselect` | (CheckBox group) | `SetMultiselect(true)`, `SetLabel`, `SetList(values)`, `SetDisabled`, `SetItemValue(key, value)` | `OnValueChanged(key, state)`, `OnClosed` |
| `color` | ColorPicker | `SetLabel`, `SetHasAlpha`, `SetColor(r, g, b, a)` | `OnValueChanged(r,g,b,a)`, `OnValueConfirmed(r,g,b,a)` |
| `keybinding` | Keybinding | `SetLabel`, `SetKey` | `OnKeyChanged(value)` |
| `header` | Heading | `SetText` | (none) |
| `description` | Label | `SetText`, `SetFontObject`, `SetImage`, `SetImageSize` | (none) |
