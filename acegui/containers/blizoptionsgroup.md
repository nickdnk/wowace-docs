---
description: "The AceGUI-3.0 BlizOptionsGroup container integrates an AceGUI layout into the Blizzard Interface Options panel via the okay, cancel and refresh hooks"
---

# BlizOptionsGroup

A container that embeds AceGUI options into the Blizzard Interface Options panel.

Create with `AceGUI:Create("BlizOptionsGroup")`. This is a **container**; it inherits the [Common Widget API and container methods](/acegui/widget-api).

**Widget type:** `BlizOptionsGroup` · **Version:** 26

This container's frame is parented to the Blizzard Interface Options panel container and exposes the hooks Blizzard expects ([`okay`](#okay)/[`cancel`](#cancel)/[`default`](#default)/[`refresh`](#refresh), plus the version 10.0 aliases `OnCommit`/`OnDefault`/`OnRefresh`). It is typically registered with [`InterfaceOptions_AddCategory`](https://warcraft.wiki.gg/wiki/InterfaceOptions_AddCategory) or `Settings.RegisterCanvasLayoutCategory` via its `frame`.

## Methods
````apimethod
name: container:SetName
params:
  - { name = "name", type = "string", desc = "The category name shown in the options list." }
  - { name = "parent", type = "string", optional = true, desc = "Parent category name (for nesting as a sub-panel)." }
---
Set the panel's name and (optional) parent category as used by the Blizzard options registration. These map onto `frame.name` and `frame.parent`.
````

````apimethod
name: container:SetTitle
params:
  - { name = "title", type = "string", desc = "Heading string, or `nil`/`\"\"` for none." }
---
Set the large heading shown at the top of the panel. A non-empty title shifts the content area down to make room; an empty or nil title removes the heading and tightens the layout.
````

> The container also defines `OnWidthSet` and `OnHeightSet` for layout.

## Callbacks
````apimethod
name: OnShow
kind: callback
---
Fired when the panel's frame is shown (the user opens this options category).
````

````apimethod
name: OnHide
kind: callback
---
Fired when the panel's frame is hidden.
````

````apimethod
name: okay
kind: callback
---
Fired when Blizzard calls the panel's `okay` handler (settings accepted or Okay button clicked). Also reached via the version 10.0 `OnCommit` alias.
````

````apimethod
name: cancel
kind: callback
---
Fired when Blizzard calls the panel's `cancel` handler (changes discarded). Note: the `cancel` handler was removed in the version 10.0 settings system, so it may not fire on modern clients.
````

````apimethod
name: default
kind: callback
---
Fired when Blizzard calls the panel's `default` handler (restore defaults). Also reached via the version 10.0 `OnDefault` alias.
````

````apimethod
name: refresh
kind: callback
---
Fired when Blizzard calls the panel's `refresh` handler (the panel needs to re-read current values). Also reached via the version 10.0 `OnRefresh` alias.
````

## Example
```lua
local AceGUI = LibStub("AceGUI-3.0")

local panel = AceGUI:Create("BlizOptionsGroup")
panel:SetName("My Addon")
panel:SetTitle("My Addon Options")
panel:SetLayout("Flow")

local cb = AceGUI:Create("CheckBox")
cb:SetLabel("Enable feature")
panel:AddChild(cb)

panel:SetCallback("refresh", function(container, event)
    cb:SetValue(MyAddonDB.enabled)
end)
panel:SetCallback("okay", function(container, event)
    -- settings accepted; persist if needed
end)

-- register the panel's frame with the Blizzard options UI
local category = Settings.RegisterCanvasLayoutCategory(panel.frame, "My Addon")
Settings.RegisterAddOnCategory(category)
```
