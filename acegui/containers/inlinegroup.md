---
description: "The AceGUI-3.0 InlineGroup container: a visible box with an optional title that groups and lays out child widgets inline"
---

# InlineGroup

A container that draws a visible box with an optional title around its children.

Create with `AceGUI:Create("InlineGroup")`. This is a **container**; it inherits
the [Common Widget API and container methods](/acegui/widget-api) (`AddChild`, `SetLayout`, `ReleaseChildren`, etc.).

**Widget type:** `InlineGroup`

## Methods

````apimethod
name: container:SetTitle
params:
  - { name = "title", type = "string", desc = "The title string." }
---
Set the caption text shown above the box's border. On acquire the title is set to an empty string.
````

The group draws a bordered, shaded "box" (a `PaneBackdrop`) with the title rendered above it. On acquire, it defaults to
300×100. The content region is inset 10 px on each side within the border; the border itself is offset to leave 17 px at
the top for the title. When its layout finishes, the group automatically sizes its height to the content height plus 40
px (to account for the title and border) unless `self.noAutoHeight` is set to a truthy value.

## Callbacks

This container fires no callbacks of its own.

## Layout notes

Like all containers, the group defaults to the `"List"` layout; switch with `SetLayout` (commonly `"Flow"`). Use
InlineGroup when you want a labeled, visually-bounded section inside a larger container. Height automatically grows to
fit content (+40 px) unless `noAutoHeight` is set.

## Example

```lua
local group = AceGUI:Create("InlineGroup")
group:SetTitle("Options")
group:SetFullWidth(true)
group:SetLayout("Flow")

local check = AceGUI:Create("CheckBox")
check:SetLabel("Enable feature")
group:AddChild(check)
```
