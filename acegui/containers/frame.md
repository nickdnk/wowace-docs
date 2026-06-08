---
description: "The AceGUI-3.0 Frame container: a movable, resizable top-level window with a title bar, status bar and Close button for hosting child widgets"
---

# Frame

A movable, resizable top-level window with a title bar, a status bar, and a Close button.

Create with `AceGUI:Create("Frame")`. This is a **container**; it inherits
the [Common Widget API and container methods](/acegui/widget-api) (`AddChild`, `SetLayout`, `ReleaseChildren`, etc.).

**Widget type:** `Frame`

## Methods

````apimethod
name: container:SetTitle
params:
  - { name = "title", type = "string", desc = "The title string. Passing `nil`/no argument clears it." }
---
Set the text shown in the frame's title bar. The title-bar background texture is resized to fit the text (text width + 10).
````

````apimethod
name: container:SetStatusText
params:
  - { name = "text", type = "string", desc = "The status string. Passing `nil`/no argument clears it." }
---
Set the text shown in the status bar along the bottom-left of the frame.
````

````apimethod
name: container:SetStatusTable
params:
  - { name = "status", type = "table", desc = "An external table (asserted to be of type `table`) used to store and restore position and size." }
---
Supply an external table in which the frame stores and restores its position and size (`width`, `height`, `top`, `left`). When set, the frame immediately applies any values present in the table. Use this to persist window geometry between sessions.
````

````apimethod
name: container:ApplyStatus
---
Apply the current status table (external, or the internal `localstatus`) to the frame: sets its width (default `700`) and height (default `500`) and positions it. If `top` and `left` are present it anchors to those coordinates, otherwise it centers the frame.
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
Fired when the frame is shown.
````

````apimethod
name: OnClose
kind: callback
---
Fired when the frame is hidden, including when the user clicks the built-in Close button, which calls [`Hide()`](#hide).
````

````apimethod
name: OnEnterStatusBar
kind: callback
---
Fired when the mouse enters the status-bar region.
````

````apimethod
name: OnLeaveStatusBar
kind: callback
---
Fired when the mouse leaves the status-bar region.
````

## Layout notes

Like all containers, the frame defaults to the `"List"` layout; switch with `SetLayout` (commonly `"Flow"`). The content
region is inset from the frame edges (34 px horizontally, 57 px vertically) to leave room for the title bar, status bar,
and Close button. The frame is movable by dragging the title bar and resizable via the grips; minimum size is 400×200.

## Example

```lua
local frame = AceGUI:Create("Frame")
frame:SetTitle("My Addon")
frame:SetStatusText("Ready")
frame:SetLayout("Flow")
frame:SetCallback("OnClose", function(widget) AceGUI:Release(widget) end)

local label = AceGUI:Create("Label")
label:SetText("Hello from a Frame container!")
label:SetFullWidth(true)
frame:AddChild(label)
```
