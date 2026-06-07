---
description: "The AceGUI-3.0 ScrollFrame container: a plain container that scrolls its content rather than growing in height as children are added"
---

# ScrollFrame

A container that scrolls its content vertically and does not grow in height.

Create with `AceGUI:Create("ScrollFrame")`. This is a **container**; it inherits the [Common Widget API and container methods](/acegui/widget-api) (`AddChild`, `SetLayout`, `ReleaseChildren`, etc.).

**Widget type:** `ScrollFrame` · **Version:** 26

## Methods
````apimethod
name: container:SetScroll
params:
  - { name = "value", type = "number", desc = "Scroll position from `0` (top) to `1000` (bottom)." }
---
Scroll the content to a position. `value` runs from `0` (top) to `1000` (bottom); the method converts it to a pixel offset based on the difference between content height and visible height. If the content fits entirely, the offset is forced to `0`. Stores `offset` and `scrollvalue` in the status table.
````

````apimethod
name: container:MoveScroll
params:
  - { name = "value", type = "number", desc = "Mouse-wheel delta; sign determines scroll direction." }
---
Scroll incrementally, as triggered by the mouse wheel. Only acts when the scroll bar is shown. The sign of `value` chooses direction; the step is scaled relative to the overflow amount and clamped to the `0`–`1000` range.
````

````apimethod
name: container:FixScroll
---
Recompute whether the scroll bar is needed and synchronize all components. If the content fits (within a 2 px margin), it hides the scroll bar, restores the content width, and re-lays out; otherwise, it shows the scroll bar, reserves 20 px of width for it, re-lays out, and updates the bar value to match the current offset. Guarded by an internal `updateLock` to prevent re-entrancy. Called automatically on size changes and after layout.
````

````apimethod
name: container:SetStatusTable
params:
  - { name = "status", type = "table", desc = "An external table (asserted to be of type `table`) in which the scroll state is stored (`scrollvalue`, `offset`)." }
---
Supply an external table in which the scroll state is stored (`scrollvalue`, `offset`). Initializes `scrollvalue` to `0` if absent. Use this to persist scroll position.
````

## Callbacks

This container fires no callbacks of its own.

## Layout notes

Like all containers, the ScrollFrame defaults to the `"List"` layout; switch with `SetLayout` (commonly `"Flow"`). Unlike auto-growing groups, ScrollFrame keeps a fixed visible size and scrolls its content vertically; the content height comes from the layout (`LayoutFinished`) while the frame's own height remains unchanged. A vertical scroll bar appears only when content overflows, automatically reserving 20 px of width when shown. Mouse-wheel scrolling is enabled. Give the ScrollFrame a fixed or full height (for example, via a parent layout) so there is a defined viewport to scroll within.

## Example
```lua
local scroll = AceGUI:Create("ScrollFrame")
scroll:SetFullWidth(true)
scroll:SetFullHeight(true)
scroll:SetLayout("List")

for i = 1, 50 do
    local label = AceGUI:Create("Label")
    label:SetText("Row " .. i)
    label:SetFullWidth(true)
    scroll:AddChild(label)
end
```
