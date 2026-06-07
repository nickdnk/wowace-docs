---
description: "The AceGUI-3.0 DropdownGroup container groups widgets and switches between groups using a dropdown menu placed at the top"
---

# DropdownGroup

A container that switches between groups of widgets using a dropdown at the top.

Create with `AceGUI:Create("DropdownGroup")`. This is a **container**; it inherits the [Common Widget API and container methods](/acegui/widget-api).

**Widget type:** `DropdownGroup` · **Version:** 22

> Note: although this file is named `AceGUIContainer-DropDownGroup.lua`, the registered widget type is `DropdownGroup` (lowercase "down"). Use that exact string with `AceGUI:Create`.

## Methods
````apimethod
name: container:SetGroupList
params:
  - { name = "list", type = "table", desc = "Table mapping each group's value to its display text (`[value] = text`)." }
  - { name = "order", type = "table", optional = true, desc = "Array of values defining the display order of the entries." }
---
Populate the dropdown that selects between groups. The arguments are forwarded directly to the internal Dropdown's `SetList`.
````

````apimethod
name: container:SetGroup
params:
  - { name = "group", type = "string", desc = "The value (key from `list`) of the group to select." }
---
Select a group programmatically by setting the dropdown value, recording it in the status table, and firing [`OnGroupSelected`](#ongroupselected).
````

````apimethod
name: container:SetTitle
params:
  - { name = "title", type = "string", desc = "Title string, or `\"\"` for none." }
---
Set the title text. With a non-empty title, the dropdown is anchored to the top-right; with an empty title, it is anchored to the top-left.
````

````apimethod
name: container:SetDropdownWidth
params:
  - { name = "width", type = "number", desc = "Width in pixels." }
---
Set the width of the dropdown selector (defaults to 200 pixels on acquire).
````

````apimethod
name: container:SetStatusTable
params:
  - { name = "status", type = "table", desc = "A table you own and keep alive (asserted to be of type `table`)." }
---
Supply an external table for persisting state (the `selected` group value).
````

> The container also defines `OnWidthSet`, `OnHeightSet`, and `LayoutFinished` for layout.

## Callbacks
````apimethod
name: OnGroupSelected
kind: callback
params:
  - { name = "value", type = "string", desc = "The selected group's value." }
---
Fired when a group is selected, either by the user via the dropdown or programmatically through [`SetGroup`](#setgroup). The handler should release and rebuild the content.
````

## Example
```lua
local AceGUI = LibStub("AceGUI-3.0")

local group = AceGUI:Create("DropdownGroup")
group:SetTitle("Profile")
group:SetFullWidth(true)
group:SetLayout("Flow")

group:SetGroupList(
    { default = "Default", raid = "Raid", pvp = "PvP" },
    { "default", "raid", "pvp" }   -- explicit order
)

group:SetCallback("OnGroupSelected", function(container, event, key)
    container:ReleaseChildren()
    local lbl = AceGUI:Create("Label")
    lbl:SetText("Editing profile: " .. key)
    container:AddChild(lbl)
end)

-- select an initial group (this fires OnGroupSelected)
group:SetGroup("default")
```
