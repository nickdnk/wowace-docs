---
description: "The AceGUI-3.0 TabGroup container groups widgets and switches between them using a row of selectable tabs along the top of the container"
---

# TabGroup

A container that switches between groups of widgets using tabs along the top.

Create with `AceGUI:Create("TabGroup")`. This is a **container**; it inherits the [Common Widget API and container methods](/acegui/widget-api).

**Widget type:** `TabGroup` · **Version:** 38

## Methods
````apimethod
name: container:SetTabs
params:
  - { name = "tabs", type = "table", desc = "Array of tab descriptor tables. Each entry recognizes `value` (the value passed to [`SelectTab`](#selecttab) / reported by [`OnGroupSelected`](#ongroupselected) when this tab is clicked, required to identify the tab), `text` (the label shown on the tab), and `disabled` (if truthy, the tab is drawn greyed out and cannot be clicked)." }
---
Set the list of tabs to display along the top and rebuild the tab strip. Each call replaces the previous tab list.
````

````apimethod
name: container:SelectTab
params:
  - { name = "value", type = "string", desc = "The `value` of the tab to select." }
---
Mark the tab whose `value` matches as selected (and deselect all others). If a matching tab is found, fires [`OnGroupSelected`](#ongroupselected) with that value. The handler is responsible for releasing the previous children and adding the new group's widgets.
````

````apimethod
name: container:SetTitle
params:
  - { name = "text", type = "string", desc = "Title string, or `nil`/`\"\"` for none." }
---
Set the title text drawn above the tab strip. Passing `nil` or `""` clears it and tightens the layout. Rebuilds the tabs.
````

````apimethod
name: container:SetStatusTable
params:
  - { name = "status", type = "table", desc = "A table you own and keep alive (asserted to be of type `table`)." }
---
Supply an external table in which the container stores its state (currently the `selected` tab value). Use this to persist the selected tab across acquire/release.
````

````apimethod
name: container:BuildTabs
---
Recompute the tab strip layout (sizes, rows, anchoring). Called internally by [`SetTabs`](#settabs)/[`SetTitle`](#settitle)/resize; rarely needs to be called directly.
````

> The container also defines `CreateTab`, `OnWidthSet`, `OnHeightSet`, and `LayoutFinished` as internal layout helpers.

## Callbacks
````apimethod
name: OnGroupSelected
kind: callback
params:
  - { name = "value", type = "string", desc = "The selected tab's `value`." }
---
Fired by [`SelectTab`](#selecttab) (including the tab's own click handler) when a tab matching the given value is selected.
````

````apimethod
name: OnTabEnter
kind: callback
params:
  - { name = "value", type = "string", desc = "The tab's value." }
  - { name = "tabFrame", type = "Button", desc = "The underlying tab Button." }
---
Fired when the mouse enters a tab button.
````

````apimethod
name: OnTabLeave
kind: callback
params:
  - { name = "value", type = "string", desc = "The tab's value." }
  - { name = "tabFrame", type = "Button", desc = "The underlying tab Button." }
---
Fired when the mouse leaves a tab button.
````

## Example
```lua
local AceGUI = LibStub("AceGUI-3.0")

local tab = AceGUI:Create("TabGroup")
tab:SetTitle("Settings")
tab:SetLayout("Flow")
tab:SetFullWidth(true)

tab:SetTabs({
    { value = "general", text = "General" },
    { value = "audio",   text = "Audio"   },
    { value = "about",   text = "About", disabled = true },
})

tab:SetCallback("OnGroupSelected", function(container, event, group)
    container:ReleaseChildren()
    if group == "general" then
        local cb = AceGUI:Create("CheckBox")
        cb:SetLabel("Enable addon")
        container:AddChild(cb)
    elseif group == "audio" then
        local lbl = AceGUI:Create("Label")
        lbl:SetText("Audio options go here")
        container:AddChild(lbl)
    end
end)

-- select an initial tab (this fires OnGroupSelected)
tab:SelectTab("general")
```
