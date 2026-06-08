---
description: "The Common Widget API shared by every AceGUI-3.0 widget and container, including sizing, layout, callbacks and user-data methods inherited from WidgetBase"
---

# Common Widget API

Every [AceGUI-3.0](/acegui/) widget inherits a common set of methods from `WidgetBase`. Containers inherit an additional
set from `WidgetContainerBase` (which itself extends `WidgetBase`).

The per-widget pages in this section document **only the methods and callbacks specific to that widget**; the methods
below are available on *every* widget and are not repeated there.

## Widget Methods

Available on every widget and container.

````apimethod
name: widget:SetWidth
params:
  - { name = "width", type = "number", desc = "The width in pixels." }
---
Set the widget's width in pixels. Fires the widget's internal [`OnWidthSet`](#onwidthset) hook if it defines one.
````

````apimethod
name: widget:SetHeight
params:
  - { name = "height", type = "number", desc = "The height in pixels." }
---
Set the widget's height in pixels. Fires the widget's internal [`OnHeightSet`](#onheightset) hook if it defines one.
````

````apimethod
name: widget:SetRelativeWidth
params:
  - { name = "width", type = "number", desc = "Fraction of the parent's width; must be greater than `0` and at most `1`." }
---
Set the width as a fraction of the parent container's width. `width` must be greater than `0` and at most `1` (e.g. `0.5` for half width). Errors on an invalid value.
````

````apimethod
name: widget:SetFullWidth
params:
  - { name = "isFull", type = "boolean", desc = "Truthy to fill the full row width; falsy to clear." }
---
When `isFull` is truthy, the widget fills the full width of its container row. Pass a falsy value to clear it.
````

````apimethod
name: widget:IsFullWidth
returns: { type = "boolean", desc = "`true` if the widget is set to full width." }
---
Returns `true` if the widget is set to full width.
````

````apimethod
name: widget:SetFullHeight
params:
  - { name = "isFull", type = "boolean", desc = "Truthy to fill the full available height; falsy to clear." }
---
When `isFull` is truthy, the widget fills the full available height. Pass a falsy value to clear it.
````

````apimethod
name: widget:IsFullHeight
returns: { type = "boolean", desc = "`true` if the widget is set to full height." }
---
Returns `true` if the widget is set to full height.
````

````apimethod
name: widget:SetPoint
params:
  - { name = "...", type = "any", desc = "Anchoring arguments forwarded to the frame's `SetPoint`." }
---
Passes through to the underlying frame's [`SetPoint`](https://warcraft.wiki.gg/wiki/API_ScriptRegionResizing_SetPoint). Manual anchoring is generally unnecessary; let the container's layout position the widget.
````

````apimethod
name: widget:ClearAllPoints
---
Passes through to the underlying frame's [`ClearAllPoints`](https://warcraft.wiki.gg/wiki/API_ScriptRegionResizing_ClearAllPoints).
````

````apimethod
name: widget:GetPoint
params:
  - { name = "...", type = "any", desc = "Arguments forwarded to the frame's `GetPoint`." }
---
Passes through to the underlying frame's [`GetPoint`](https://warcraft.wiki.gg/wiki/API_ScriptRegionResizing_GetPoint).
````

````apimethod
name: widget:GetNumPoints
returns: { type = "number", desc = "The number of anchor points on the underlying frame." }
---
Passes through to the underlying frame's [`GetNumPoints`](https://warcraft.wiki.gg/wiki/API_ScriptRegionResizing_GetNumPoints).
````

````apimethod
name: widget:SetCallback
params:
  - { name = "name", type = "string", desc = "The callback/event name (e.g. \"OnClick\")." }
  - { name = "func", type = "function", desc = "Handler; called as (widget, event, ...). Non-functions are ignored." }
---
Register a callback handler for one of the widget's events. `func` is called with the widget as its first argument and the callback name as its second, followed by any event-specific arguments. Passing a non-function is ignored.

---

```lua
button:SetCallback("OnClick", function(widget, event) print("clicked") end)
```
````

````apimethod
name: widget:Fire
returns: { type = "any", desc = "The handler's return value, if it ran successfully." }
params:
  - { name = "name", type = "string", desc = "The callback/event name to fire." }
  - { name = "...", type = "any", desc = "Extra arguments passed along to the handler." }
---
Fire a registered callback by name, passing along any extra arguments. The handler is invoked with the widget and the event name prepended to the arguments. If the handler ran successfully, its return value is returned. Used internally by widgets; you normally consume callbacks via [`SetCallback`](#setcallback) rather than calling `Fire` yourself.
````

````apimethod
name: widget:SetUserData
params:
  - { name = "key", type = "any", desc = "The key under which to store the value." }
  - { name = "value", type = "any", desc = "The value to store." }
---
Store arbitrary data on the widget under `key`. Useful for associating application state with a widget instance.
````

````apimethod
name: widget:GetUserData
returns: { type = "any", desc = "The previously stored value, or `nil`." }
params:
  - { name = "key", type = "any", desc = "The key to look up." }
---
Retrieve a value previously stored with [`SetUserData`](#setuserdata).
````

````apimethod
name: widget:GetUserDataTable
returns: { type = "table", desc = "The widget's full user-data table." }
---
Returns the widget's full user-data table.
````

````apimethod
name: widget:SetParent
params:
  - { name = "parent", type = "table", desc = "The widget whose content frame becomes the new parent." }
---
Reparents the widget to another widget's content frame. Containers call this for you in [`AddChild`](#addchild).
````

````apimethod
name: widget:IsVisible
returns: { type = "boolean", desc = "The underlying frame's visibility." }
---
Returns the underlying frame's visibility (via [`IsVisible`](https://warcraft.wiki.gg/wiki/API_ScriptRegion_IsVisible)).
````

````apimethod
name: widget:IsShown
returns: { type = "boolean", desc = "The underlying frame's shown state." }
---
Returns the underlying frame's shown state (via [`IsShown`](https://warcraft.wiki.gg/wiki/API_ScriptRegion_IsShown)).
````

````apimethod
name: widget:Release
---
Releases the widget back to the widget pool (shortcut for `AceGUI:Release(widget)`).
````

````apimethod
name: widget:IsReleasing
returns: { type = "boolean", desc = "`true` if the widget is currently being released." }
---
Returns `true` if the widget is currently being released.
````

## Container Methods

Available on every container widget in addition to the widget methods above.

````apimethod
name: container:AddChild
params:
  - { name = "child", type = "table", desc = "The child widget to add." }
  - { name = "beforeWidget", type = "table", optional = true, desc = "An existing sibling to insert the child before." }
---
Add a child widget to the container and lay it out. If `beforeWidget` is supplied, the child is inserted before that existing sibling instead of appended.
````

````apimethod
name: container:AddChildren
params:
  - { name = "...", type = "table", desc = "One or more child widgets to add." }
---
Add multiple child widgets at once, then perform a single layout pass.
````

````apimethod
name: container:ReleaseChildren
---
Release all child widgets back to the pool and clear the container's child list. Commonly called before redrawing a group's contents.
````

````apimethod
name: container:SetLayout
params:
  - { name = "layout", type = "string", desc = "The registered layout name: `\"List\"`, `\"Flow\"`, `\"Fill\"` or `\"Table\"`." }
---
Set the layout function used to arrange children, by registered name: `"List"`, `"Flow"`, `"Fill"` or `"Table"`.
````

````apimethod
name: container:DoLayout
---
Lay out the container's children. Called automatically by [`AddChild`](#addchild)/[`AddChildren`](#addchildren); call it manually after changing children outside those methods.
````

````apimethod
name: container:PerformLayout
---
Runs the layout function immediately (unless layout is paused). [`DoLayout`](#dolayout) is the usual entry point.
````

````apimethod
name: container:PauseLayout
---
Suspend automatic layout. Useful when adding many children in a loop to avoid a layout pass per child.
````

````apimethod
name: container:ResumeLayout
---
Resume automatic layout after [`PauseLayout`](#pauselayout). Follow with [`DoLayout`](#dolayout) to apply.

---

```lua
container:PauseLayout()
for _, item in ipairs(items) do
    local w = AceGUI:Create("Label")
    w:SetText(item)
    container:AddChild(w)
end
container:ResumeLayout()
container:DoLayout()
```
````

````apimethod
name: container:SetAutoAdjustHeight
params:
  - { name = "adjust", type = "boolean", desc = "Truthy (the default) to auto-resize height to fit content; `false` to keep a fixed height." }
---
When `adjust` is truthy (the default), the container automatically resizes its height to fit its content. Pass `false` to keep a fixed height.
````

## Internal hooks

These are optional members a **widget implementation** may define; AceGUI calls them for you. Addon authors don't call
or register them (consume widgets through their public methods); they matter when you build a custom widget.
[`OnAcquire`](#onacquire) and [`OnRelease`](#onrelease) are driven by the [widget pool](/acegui/#frame-pooling);
[`OnWidthSet`](#onwidthset) / [`OnHeightSet`](#onheightset) by sizing; and [`LayoutFinished`](#layoutfinished) by the
layout pass.

````apimethod
name: widget:OnAcquire
kind: callback
---
Called by [`AceGUI:Create`](/acegui/#create) when the widget is handed out (whether freshly created or reused from the pool) to reset it to its default state (size, text, value, …). This is why a recycled widget never carries over data from its previous user.
````

````apimethod
name: widget:OnRelease
kind: callback
---
Called by [`AceGUI:Release`](/acegui/#release) before the widget returns to the pool. Clears the widget's data and hides it.
````

````apimethod
name: widget:OnWidthSet
kind: callback
params:
  - { name = "width", type = "number", desc = "The new width in pixels." }
---
Called by [`SetWidth`](#setwidth) after the frame is resized, if the widget defines it. A widget implementation uses this to re-lay-out its contents for the new width. Use this rather than the frame's own `OnSizeChanged`; AceGUI already manages that.
````

````apimethod
name: widget:OnHeightSet
kind: callback
params:
  - { name = "height", type = "number", desc = "The new height in pixels." }
---
Called by [`SetHeight`](#setheight) after the frame is resized, if the widget defines it. A widget implementation uses this to re-lay-out its contents for the new height. Use this rather than the frame's own `OnSizeChanged`; AceGUI already manages that.
````

````apimethod
name: widget:LayoutFinished
kind: callback
params:
  - { name = "width", type = "number", desc = "Width of the area used by the laid-out controls, or `nil` if the layout used the existing size." }
  - { name = "height", type = "number", desc = "Height of the area used by the laid-out controls, or `nil` if the layout used the existing size." }
---
Called on a container after a layout pass finishes. A container implementation uses this to size itself to its content; auto-growing groups add their content height here.
````
