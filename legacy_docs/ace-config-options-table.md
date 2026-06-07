# AceConfig-3.0 Options Tables

The AceOptions table format is a standardized way of representing the commands available to control an addon.

An example table, very minimalistic:

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

Every option table has to start with a head group node. It can have a name and an icon, but only the group-type and the args table are required.

You can nest groups as deep as you need them to be, and include any options on any level. Of course not everything makes sense from a UI design perspective.

Nearly all parameters can be inherited through the table tree. For example, you can define one get handler on the group, and all member nodes (or member nodes of sub-groups) will use this get handler, unless overriden.

Currently inherited are: set, get, func, confirm, validate, disabled, hidden

The keys used in the option tables can contain all printable chars. If you use spaces in the keys, and intend to use your option table with a Command Line interface like AceConfigCmd-3.0, make sure your keys do not collide, as AceConfigCmd-3.0 maps the spaces to underscores, so "foo bar" and "foo_bar" would collide.

Most parameters can also be a function reference, which is called when the value is requested. Every function called by AceConfig will be called with an info table as its first parameter. The info table contains information about the current position in the tree, the type of UI displaying the options, and the options table itself.

For more details on the info table, see Callback Arguments.

## Common Parameters

The following parameters apply to all types of nodes and groups, and control the general layout of the options.

- `name` (string|function) - Display name for the option
- `desc` (string|function) - description for the option (or nil for a self-describing name)
- `descStyle` (string) - "inline" if you want the description to show below the option in a GUI (rather than as a tooltip). Currently only supported by AceGUI "Toggle".
- `validate` (methodname|function|false) - validate the input/value before setting it. return a string (error message) to indicate error.
- `confirm` (methodname|function|boolean) - prompt for confirmation before changing a value
  - true - display "name - desc", or contents of `.confirmText`
  - function - return a string (prompt to display) or true (as above), or false to skip the confirmation step
- `confirmText` (string) - the text to display in the confirmation prompt when `confirm` is true.
- `order` (number|methodname|function) - relative position of item (default = 100, 0=first, -1=last)
- `disabled` (methodname|function|boolean) - disabled but visible
- `hidden` (methodname|function|boolean) - hidden (but usable if you can get to it, i.e. via commandline)
- `guiHidden` (methodname|function|boolean) - hide this from graphical UIs (dialog, dropdown)
- `dialogHidden` (methodname|function|boolean) - hide this from dialog UIs
- `dropdownHidden` (methodname|function|boolean) - hide this from dropdown UIs
- `cmdHidden` (methodname|function|boolean) - hide this from commandline
- `icon` (string|number|function) - path to icon texture
- `iconCoords` (table|methodname|function) - arguments to pass to SetTexCoord, e.g. {0.1,0.9,0.1,0.9}.
- `tooltipHyperlink` (string|function) - a hyperlink to embed in the option's tooltip.
- `handler` (table) - object on which getter/setter functions are called if they are declared as strings rather than function references
- `type` (string) - "execute", "input", "group", etc; see below
- `width` (string|number) - "double", "half", "full", "normal", or numeric, in a GUI provide a hint for how wide this option needs to be. (optional support in implementations)
  - default is nil (not set)
  - double, half - increase / decrease the size of the option
  - full - make the option the full width of the window
  - normal - use the default widget width defined for the implementation (useful to overwrite widgets that default to "full")
  - any number - multiplier of the default width, ie. 0.5 equals "half", 2.0 equals "double"
- `relWidth` (number) - relative width (as a fraction of the available space) hint for the option.

## Item Types

### execute

A execute option will simply run 'func'. In a GUI, this would be a button. If image is set, it'll display a clickable image instead of a default GUI button.

- `func` (function|methodname) - function to execute
- `image` (string|number|function) - path to image texture, if this is a function it can optionally return the width and height of the image as the 2nd and 3rd value, these will be used instead of imageWidth and imageHeight.
- `imageCoords` (table|methodname|function) - arguments to pass to SetTexCoord, e.g. {0.1,0.9,0.1,0.9}.
- `imageWidth` (number) - Width of the displayed image
- `imageHeight` (number) - Height of the displayed image

### input

A simple text input, with an optional validate string or function to match the text against.

- `get` (function|methodname) - getter function
- `set` (function|methodname) - setter function
- `multiline` (boolean|integer) - if true will be shown as a multiline editbox in dialog implementations (Integer = # of lines in editbox)
- `pattern` (string) - optional validation pattern. (Use the validate field for more advanced checks!)
- `usage` (string) - usage string (displayed if pattern mismatches and in console help messages)

### toggle

A simple checkbox.

- `get` (function|methodname) - getter function
- `set` (function|methodname) - setter function
- `tristate` (boolean) - Make the toggle a tri-state checkbox. Values are cycled through unchecked (false), checked (true), greyed (nil) - in that order.

### range

A option for configuring numeric values in a specific range. In a GUI, a slider.

- `min` (number) - min value
- `max` (number) - max value
- `softMin` (number) - "soft" minimal value, used by the UI for a convenient limit while allowing manual input of values up to min/max
- `softMax` (number) - "soft" maximal value, used by the UI for a convenient limit while allowing manual input of values up to min/max
- `step` (number) - step value: "smaller than this will break the code" (default=no stepping limit)
- `bigStep` (number) - a more generally-useful step size. Support in UIs is optional.
- `get` (function|methodname) - getter function
- `set` (function|methodname) - setter function
- `isPercent` (boolean) - represent e.g. 1.0 as 100%, etc. (default=false)

Note:

- The "step" checking will only work if you specify valid values for "min" and "max". Especially when using "softMin" and "softMax", "min" and "max" are still required for "step" to function!
- If no "min" or "max" are specified, the manual input of the range control will accept any and all values!

### select

Only one of the values can be selected. In a dropdown menu implementation it would likely be a radio group, in a dialog likely a dropdown combobox.

- `values` (table|function) - [key]=value pair table to choose from, key is the value passed to "set", value is the string displayed
- `sorting` (table|function) - Optional sorted array-style table with the keys of the values table as values to sort the options.
- `get` (function|methodname) - getter function
- `set` (function|methodname) - setter function
- `style` (string) - "dropdown", "radio" (optional support in implementations)

### multiselect

Basically multiple "toggle" elements condensed into a group of checkboxes, or something else that makes sense in the interface.

- `values` (table|function) - [key]=value pair table to choose from, key is the value passed to "set", value is the string displayed
- `get` (function|methodname) - will be called for every key in values with the key name as last parameter
- `set` (function|methodname) - will be called with keyname, state as parameters
- `style` (string) - optional UI style hint
- `tristate` (boolean) - Make the checkmarks tri-state. Values are cycled through unchecked (false), checked (true), greyed (nil) - in that order.

### color

Opens a color picker form, in GUI possibly a button to open that.

- `get` (function|methodname) - getter function
- `set` (function|methodname) - setter function
- `hasAlpha` (boolean) - indicate if alpha is adjustable (default false)

Getter/setter functions use 4 arguments/returns: r,g,b,a. If hasAlpha is false/nil, alpha will always be set() as 1.0.

### keybinding

- `get` (function|methodname) - getter function
- `set` (function|methodname) - setter function

### header

A heading. In commandline and dropdown UIs shows as a heading, in a dialog UI it will additionaly provide a break in the layout.

`name` is the text to display in the heading.

### description

A paragraph of text to appear next to other options in the config, optionally with an image in front of it.

- `name` is the text to display
- `fontSize` is the size of the text. Three pre-defined values are allowed: "large", "medium", "small". Defaults to "small".
- `image` (string|number|function) - path to image texture, if this is a function it can optionally return the width and height of the image as the 2nd and 3rd value, these will be used instead of imageWidth and imageHeight.
- `imageCoords` (table|methodname|function) - arguments to pass to SetTexCoord, e.g. {0.1,0.9,0.1,0.9}.
- `imageWidth` (number) - Width of the displayed image
- `imageHeight` (number) - Height of the displayed image

### group

The first table in an AceOptions table is implicitly a group. You can have more levels of groups by simply adding another table with type="group" under the first args table.

- `args` - subtable with more items/groups in it
- `plugins` - subtable, containing named tables with more args in them, e.g.

```lua
plugins["myPlugin"] = {
    option1 = {...}, option2 = {...}, group1 = {...},
}
plugins["otherPlugin"] = {...}
```

This allows modules and libraries to easily add more content to an addon's options table.

- `childGroups` - decides how children groups of this group are displayed:
  - "tree" (the default) - as child nodes in a tree control
  - "tab" - as tabs
  - "select" - as a dropdown list

Only dialog-driven UIs are assumed to behave differently for all types.

- `inline` (boolean) - show as a bordered box in a dialog UI, or at the parent's level with a separate heading in commandline and dropdown UIs.
- `cmdInline` (boolean) - as above, only obeyed by commandline
- `guiInline` (boolean) - as above, only obeyed by graphical UIs
- `dropdownInline` (boolean) - as above, only obeyed by dropdown UIs
- `dialogInline` (boolean) - as above, only obeyed by dialog UIs

## Callback Handling

For each set/get/func/validate/confirm callback attempted, the tree will ALWAYS be traversed toward the root until such a directive is found. Similarly, if callbacks are given as strings, the tree will be traversed to find a "handler" argument.

To declare that an inherited value is NOT to be used even though a parent has it, set it to false. This is primarily useful for validate and confirm, but is allowed for all inherited values including "handler".

## Callback Arguments

All callbacks receive a standardized set of arguments:

```lua
(info, value[, value2, ...])
```

In detail, the info table contains:

- An "options" member pointing at the root of the options table
- The name of the slash command at position 0, or empty string ("") if not a slash.
- The name of the first group traversed into at position 1
- The node name at position n (may be 1 if at the root level)
  - Hint: Use info[#info] to get the leaf node name, info[#info-1] for the parent, and so on!
- An "arg" member if set in the node.
- A "handler" member which is the handler object for the current option.
- A "type" member which is the type of the current option.
- An "option" member pointing at the current option.
- "uiType" and "uiName" members, which are the same as the parameters passed when retrieving the options table from AceConfigRegistry-3.0

The callback may not assume ownership of the infotable. The config parser is assumed to reuse it. It may also contain more members, but these are outside the spec and may change at any time - do not use information in undocumented infotable members.

Callbacks on the form `handler:"methodname"` will of course be passed the handler object as the first ("self") argument.

Callback Example:

```lua
local function mySetterFunc(info, value)
    db[info[#info]] = value   -- we use the db names in our settings for Zzz
    print("The " .. info[#info] .. " was set to: " .. tostring(value))
end
```

## Custom Controls

You can register a custom control with AceGUI and use it in an AceConfigDialog displayed table. This is currently supported for almost all simple control types, except "select" with style="radio", but not for groups or other complex types.

This method is currently only supported in AceConfigDialog-3.0, using the dialogControl attribute.

Example usage with AceGUI-3.0-SharedMediaWidgets:

```lua
local media = LibStub("LibSharedMedia-3.0")
self.options = {
    type = "group",
    args = {
        texture = {
            type = "select",
            name = "Texture",
            desc = "Set the statusbar texture.",
            values = media:HashTable("statusbar"),
            dialogControl = "LSM30_Statusbar",
        },
    },
}
```

Widget API required to be implemented by custom AceGUI widgets when used with AceConfigDialog-3.0 (this part of the spec is not finalised):

```lua
type = 'input'
:SetDisabled(disabled)
    -- disabled - boolean, whether the control is disabled
:SetLabel(text)
    -- text - string, the name of the option to be displayed
:SetText(text)
    -- text - string, the contents of the EditBox.
-- Callback OnEnterPressed(text), fired when the text has changed and should be saved.

type = 'select'
:SetDisabled(disabled)
    -- disabled - boolean, whether the control is disabled
:SetValue(value)
    -- value - string, the value that is currently selected.
:SetList(list)
    -- list - table, a { value = text } table of the options to be displayed.
:SetLabel(text)
    -- text - string, the name of the option to be displayed
-- Callback OnValueChanged(value), fired when a value is selected, this must be a key from the list table.
```

Both should also fire OnEnter and OnLeave callbacks for tooltips to work.
