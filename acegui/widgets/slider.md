---
description: "The AceGUI-3.0 Slider widget: a horizontal slider for picking a numeric value within a range, with an editable value box and low and high range labels"
---

# Slider

A graphical horizontal slider for selecting a numeric value within a range, with an editable value box and low/high range labels.

Create with `AceGUI:Create("Slider")`. It inherits the [Common Widget API](/acegui/widget-api).

**Widget type:** `Slider` · **Version:** 23

## Methods
````apimethod
name: widget:SetValue
params:
  - { name = "value", type = "number", desc = "The number to set as the current value (does not fire [`OnValueChanged`](#onvaluechanged))." }
---
Sets the current value of the slider, moving the thumb and updating the value editbox. This sets the value directly and does not fire [`OnValueChanged`](#onvaluechanged).
````

````apimethod
name: widget:GetValue
returns: { type = "number", desc = "The slider's current value." }
---
Returns the slider's current value.
````

````apimethod
name: widget:SetSliderValues
params:
  - { name = "min", type = "number", default = "0", desc = "Minimum value." }
  - { name = "max", type = "number", default = "100", desc = "Maximum value." }
  - { name = "step", type = "number", default = "1", desc = "Increment between selectable values. When `> 0`, values chosen by dragging are snapped to the nearest step." }
---
Configures the slider's range and step increment, updates the low/high range labels, and re-applies the current value to the new range.
````

````apimethod
name: widget:SetLabel
params:
  - { name = "text", type = "string", optional = true, desc = "The label text." }
---
Sets the descriptive label shown above the slider.
````

````apimethod
name: widget:SetIsPercent
params:
  - { name = "value", type = "boolean", optional = true, desc = "Truthy to display as a percentage, `nil`/`false` for a plain number." }
---
Toggles percent display mode. When enabled, the value box and range labels are formatted as percentages (the stored value is multiplied by 100 for display and divided by 100 when typed).
````

````apimethod
name: widget:SetDisabled
params:
  - { name = "disabled", type = "boolean", desc = "`true` to disable, `false` to enable." }
---
Enables or disables the slider. When disabled, the slider and value editbox stop accepting mouse input and are greyed out.
````

## Defaults

On acquire the slider resets to: width 200, height 44, not disabled, percent mode off, range `0`–`100` with step `1`, value `0`, and mouse wheel scrolling disabled (it is enabled once the frame is clicked).

## Callbacks
````apimethod
name: OnValueChanged
kind: callback
params:
  - { name = "value", type = "number", desc = "The new value, after step snapping." }
---
Fired when the value changes via dragging or the mouse wheel (after step snapping), provided the new value differs from the current one and the widget is not disabled. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnMouseUp
kind: callback
params:
  - { name = "value", type = "number", desc = "The committed value." }
---
Fired when the user releases the mouse on the slider, and also when a value is committed by pressing Enter in the value editbox. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnEnter
kind: callback
---
Fired when the mouse enters the slider. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnLeave
kind: callback
---
Fired when the mouse leaves the slider. Subscribe with `widget:SetCallback`.
````

## Example
```lua
local slider = AceGUI:Create("Slider")
slider:SetLabel("Opacity")
slider:SetSliderValues(0, 1, 0.05)
slider:SetIsPercent(true)
slider:SetValue(0.75)
slider:SetCallback("OnValueChanged", function(widget, event, value)
    print("Opacity set to", value)
end)
```
