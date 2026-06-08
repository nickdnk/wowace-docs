---
description: "The AceGUI-3.0 Window container: a movable, resizable top-level window with a title bar and Close button, a lighter alternative to Frame with no status bar"
---

# Window

A movable, resizable top-level window with a title bar and a Close button; a lighter-weight alternative to `Frame`,
without a status bar.

Create with `AceGUI:Create("Window")`. This is a **container**; it inherits
the [Common Widget API and container methods](/acegui/widget-api) (`AddChild`, `SetLayout`, `ReleaseChildren`, etc.).

**Widget type:** `Window`

## Methods

````apimethod
name: container:SetTitle
params:
  - { name = "title", type = "string", desc = "The title string." }
---
Set the text shown in the window's title bar.
````

````apimethod
name: container:SetStatusText
params:
  - { name = "text", type = "string", desc = "Ignored." }
---
No-op. Window has no status bar; the method exists for API compatibility with `Frame` but does nothing (the body is commented out in source).
````

````apimethod
name: container:SetStatusTable
params:
  - { name = "status", type = "table", desc = "An external table (asserted to be of type `table`) used to store and restore position and size." }
---
Supply an external table in which the window stores and restores its position and size (`width`, `height`, `top`, `left`). Applies the table immediately. Use this to persist window geometry between sessions.
````

````apimethod
name: container:ApplyStatus
---
Apply the current status table (external, or the internal `localstatus`): sets width (default `700`) and height (default `500`) and positions the window. If `top` and `left` are present it anchors to those coordinates, otherwise it centers the window.
````

````apimethod
name: container:EnableResize
params:
  - { name = "state", type = "boolean", desc = "Truthy shows the resize grips; falsy hides them." }
---
Show or hide the three resize grips (bottom-right, bottom, right edges), enabling or disabling user resizing.
````

````apimethod
name: container:Show
---
Show the underlying frame.
````

````apimethod
name: container:Hide
---
Hide the underlying frame. (Hiding fires [`OnClose`](#onclose); see Callbacks.)
````

## Callbacks

````apimethod
name: OnShow
kind: callback
---
Fired when the window is shown.
````

````apimethod
name: OnClose
kind: callback
---
Fired when the window is hidden, including when the user clicks the built-in Close button, which calls [`Hide()`](#hide).
````

## Layout notes

Like all containers, the window defaults to the `"List"` layout; switch with `SetLayout` (commonly `"Flow"`). The
content region is inset from the window edges (34 px horizontally, 57 px vertically). The window is movable by dragging
the title bar and resizable via the grips; minimum size is 240×240, default size 700×500.

## Example

```lua
local window = AceGUI:Create("Window")
window:SetTitle("My Window")
window:SetLayout("List")
window:SetCallback("OnClose", function(widget) AceGUI:Release(widget) end)

local label = AceGUI:Create("Label")
label:SetText("Content inside a Window container.")
label:SetFullWidth(true)
window:AddChild(label)
```
