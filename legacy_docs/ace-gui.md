# AceGUI-3.0

AceGUI-3.0 provides access to numerous widgets which can be used to create GUIs.

AceGUI is used by AceConfigDialog to create the option GUIs, but you can use it by itself to create any custom GUI. There are more extensive examples in the test suite in the Ace3 stand-alone distribution.

> Note: When using AceGUI-3.0 directly, please do not modify the frames of the widgets directly, as any "unknown" change to the widgets will cause addons that get your widget out of the widget pool to misbehave. If you think some part of a widget should be modifiable, please open a ticket, and we'll implement a proper API to modify it.

## Example

```lua
local AceGUI = LibStub("AceGUI-3.0")
-- Create a container frame
local f = AceGUI:Create("Frame")
f:SetCallback("OnClose", function(widget) AceGUI:Release(widget) end)
f:SetTitle("AceGUI-3.0 Example")
f:SetStatusText("Status Bar")
f:SetLayout("Flow")
-- Create a button
local btn = AceGUI:Create("Button")
btn:SetWidth(170)
btn:SetText("Button !")
btn:SetCallback("OnClick", function() print("Click!") end)
-- Add the button to the container
f:AddChild(btn)
```

## API Reference

### `AceGUI:ClearFocus()`

Called when something has happened that could cause widgets with focus to drop it e.g. titlebar of a frame being clicked.

### `AceGUI:Create(type)`

Create a new Widget of the given type.

This function will instantiate a new widget (or use one from the widget pool), and call the OnAcquire function on it, before returning.

**Parameters**

- `type` — The type of the widget.

**Returns**

- The newly created widget.

### `AceGUI:GetLayout(Name)`

Get a Layout Function from the registry.

**Parameters**

- `Name` — The name of the layout

### `AceGUI:GetNextWidgetNum(type)`

A type-based counter to count the number of widgets created.

This is used by widgets that require a named frame, e.g. when a Blizzard Template requires it.

**Parameters**

- `type` — The widget type

### `AceGUI:GetWidgetCount(type)`

Return the number of created widgets for this type.

In contrast to GetNextWidgetNum, the number is not incremented.

**Parameters**

- `type` — The widget type

### `AceGUI:GetWidgetVersion(type)`

Return the version of the currently registered widget type.

**Parameters**

- `type` — The widget type

### `AceGUI:RegisterAsContainer(widget)`

Register a widget-class as a container for newly created widgets.

**Parameters**

- `widget` — The widget class

### `AceGUI:RegisterAsWidget(widget)`

Register a widget-class as a widget.

**Parameters**

- `widget` — The widget class

### `AceGUI:RegisterLayout(Name, LayoutFunc)`

Registers a Layout Function.

**Parameters**

- `Name` — The name of the layout
- `LayoutFunc` — Reference to the layout function

### `AceGUI:RegisterWidgetType(Name, Constructor, Version)`

Registers a widget Constructor, this function returns a new instance of the Widget.

**Parameters**

- `Name` — The name of the widget
- `Constructor` — The widget constructor function
- `Version` — The version of the widget

### `AceGUI:Release(widget)`

Releases a widget Object.

This function calls OnRelease on the widget and places it back in the widget pool. Any data on the widget is being erased, and the widget will be hidden. If this widget is a Container-Widget, all of its Child-Widgets will be releases as well.

**Parameters**

- `widget` — The widget to release

### `AceGUI:SetFocus(widget)`

Called when a widget has taken focus, e.g. Dropdowns opening, Editboxes gaining kb focus.

**Parameters**

- `widget` — The widget that should be focused
