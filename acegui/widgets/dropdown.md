---
description: "The AceGUI-3.0 Dropdown widget: a labelled dropdown menu with a scrollable pullout supporting both single-select and multi-select checkbox modes"
---

# Dropdown

A dropdown menu built on [`UIDropDownMenuTemplate`](https://warcraft.wiki.gg/wiki/UIDropDownMenuTemplate) with an
optional label. It opens a scrollable pullout of selectable items and supports both single-select and multi-select (
checkbox) modes.

Create with `AceGUI:Create("Dropdown")`. It inherits the [Common Widget API](/acegui/widget-api).

**Widget type:** `Dropdown`

> The pullout and its individual entries (`Dropdown-Pullout`, `Dropdown-Item-Toggle`, `Dropdown-Item-Execute`, etc.) are
> internal helper widgets created automatically. You normally only interact with the `Dropdown` widget's own methods
> below.

## Methods

````apimethod
name: widget:SetList
params:
  - { name = "list", type = "table", optional = true, desc = "A `value → text` table. Passing `nil` empties the list." }
  - { name = "order", type = "table", optional = true, desc = "Array of keys giving the display order. If omitted, keys are sorted automatically (numeric keys/strings numerically, everything else as strings)." }
  - { name = "itemType", type = "string", default = "\"Dropdown-Item-Toggle\"", desc = "Widget type for each entry. An invalid type raises an error." }
---
Replaces the menu contents from a table. Clears any existing items (and the auto-added close button) and rebuilds the pullout.
````

````apimethod
name: widget:AddItem
params:
  - { name = "value", type = "any", desc = "The item's value/key." }
  - { name = "text", type = "string", desc = "The displayed text." }
  - { name = "itemType", type = "string", default = "\"Dropdown-Item-Toggle\"", desc = "Item widget type." }
---
Adds a single entry to the existing list (also stored in the list table).
````

````apimethod
name: widget:SetValue
params:
  - { name = "value", type = "any", desc = "The key to select." }
---
Selects a value: sets the displayed text from the list entry for that value and stores it as the current value. (Single-select use.)
````

````apimethod
name: widget:GetValue
returns: { type = "any", desc = "The currently selected value." }
---
Returns the currently selected value.
````

````apimethod
name: widget:SetText
params:
  - { name = "text", type = "string", optional = true, desc = "The string to display, or `nil` for empty." }
---
Sets the text shown in the closed dropdown directly, without changing the selected value.
````

````apimethod
name: widget:SetLabel
params:
  - { name = "text", type = "string", optional = true, desc = "The label string, or `nil`/`\"\"` to hide it." }
---
Sets an optional label above the dropdown. With a label the widget height becomes 40; without it, 26.
````

````apimethod
name: widget:SetMultiselect
params:
  - { name = "multi", type = "boolean", desc = "`true` for multi-select (checkbox) mode, `false` for single-select." }
---
Switches between single-select and multi-select (checkbox) mode. In multi-select mode the closed text shows the comma-joined list of checked entries and a `"Close"` button is appended to the pullout.
````

````apimethod
name: widget:GetMultiselect
returns: { type = "boolean", desc = "Whether multi-select mode is enabled." }
---
Returns whether multi-select mode is enabled.
````

````apimethod
name: widget:SetItemValue
params:
  - { name = "item", type = "any", desc = "The value/key identifying the entry." }
  - { name = "value", type = "boolean", desc = "The checked state to apply." }
---
In multi-select mode, sets the checked state of a specific entry and refreshes the displayed multi-text. No-op when not in multi-select mode.
````

````apimethod
name: widget:SetItemDisabled
params:
  - { name = "item", type = "any", desc = "The value/key identifying the entry." }
  - { name = "disabled", type = "boolean", desc = "`true` to disable, `false` to enable." }
---
Enables or disables a specific entry in the pullout.
````

````apimethod
name: widget:SetPulloutWidth
params:
  - { name = "width", type = "number", optional = true, desc = "Pixel width, or `nil` to auto-match the dropdown's own width." }
---
Overrides the width of the opened pullout. When `nil`, the pullout matches the dropdown's own width.
````

````apimethod
name: widget:SetDisabled
params:
  - { name = "disabled", type = "boolean", desc = "`true` to disable, `false` to enable." }
---
Enables or disables the dropdown. A disabled dropdown greys its text/label and cannot be opened.
````

````apimethod
name: widget:ClearFocus
---
Closes the pullout if it is open.
````

## Defaults

On acquire the widget resets to: height 44, width 200, no label, auto pullout width, and an empty list. On release it
closes and releases its pullout and clears text, value, disabled, and multiselect state.

## Callbacks

````apimethod
name: OnValueChanged
kind: callback
params:
  - { name = "value", type = "any", desc = "The selected/toggled entry's value." }
  - { name = "checked", type = "boolean", optional = true, desc = "The entry's new checked state. Multi-select only; omitted in single-select mode." }
---
Fired when the user selects/toggles an entry. In single-select mode the handler receives just the newly selected `value` and the pullout then closes. In multi-select mode it also receives the toggled entry's `checked` state. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnOpened
kind: callback
---
Fired when the pullout opens. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnClosed
kind: callback
---
Fired when the pullout closes. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnEnter
kind: callback
---
Fired when the mouse enters the dropdown (also locks the button highlight). Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnLeave
kind: callback
---
Fired when the mouse leaves the dropdown. Subscribe with `widget:SetCallback`.
````

## Example

```lua
local dd = AceGUI:Create("Dropdown")
dd:SetLabel("Choose a class")
dd:SetList({
    WARRIOR = "Warrior",
    MAGE    = "Mage",
    PRIEST  = "Priest",
}, { "WARRIOR", "MAGE", "PRIEST" })
dd:SetValue(db.class)
dd:SetCallback("OnValueChanged", function(widget, event, value)
    db.class = value
end)
```
