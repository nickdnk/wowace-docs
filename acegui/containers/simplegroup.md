---
description: "The AceGUI-3.0 SimpleGroup container: a minimal container that just groups child widgets, adding no methods beyond the common container API"
---

# SimpleGroup

A plain container that just groups widgets, with no decoration of its own.

Create with `AceGUI:Create("SimpleGroup")`. This is a **container**; it inherits the [Common Widget API and container methods](/acegui/widget-api) (`AddChild`, `SetLayout`, `ReleaseChildren`, etc.).

**Widget type:** `SimpleGroup` · **Version:** 20

## Methods

SimpleGroup adds no methods of its own; use the common container methods.

The content region fills the group's frame exactly (no insets, no border, no title). On acquire, the group defaults to 300×100. When its layout finishes, the group automatically sizes its height to match the content height unless `self.noAutoHeight` is set to a truthy value.

## Callbacks

This container fires no callbacks of its own.

## Layout notes

Like all containers, the group defaults to the `"List"` layout; switch with `SetLayout` (commonly `"Flow"`). Because the content region exactly matches the frame, SimpleGroup is the lightest way to nest a sub-layout inside another container. Height automatically grows to fit content unless `noAutoHeight` is set.

## Example
```lua
local group = AceGUI:Create("SimpleGroup")
group:SetFullWidth(true)
group:SetLayout("Flow")

local label = AceGUI:Create("Label")
label:SetText("Grouped content")
label:SetFullWidth(true)
group:AddChild(label)
```
