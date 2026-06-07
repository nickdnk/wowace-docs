---
description: "The AceGUI-3.0 ColorPicker widget: a color swatch with an optional label that opens Blizzard's ColorPickerFrame, with optional alpha (opacity) support"
---

# ColorPicker

A color swatch with an optional label that opens Blizzard's [`ColorPickerFrame`](https://warcraft.wiki.gg/wiki/ColorPickerFrame) when clicked, with optional alpha (opacity) support.

Create with `AceGUI:Create("ColorPicker")`. It inherits the [Common Widget API](/acegui/widget-api).

**Widget type:** `ColorPicker` · **Version:** 28

## Methods
````apimethod
name: widget:SetColor
params:
  - { name = "r", type = "number", desc = "Red component in the `0`–`1` range." }
  - { name = "g", type = "number", desc = "Green component in the `0`–`1` range." }
  - { name = "b", type = "number", desc = "Blue component in the `0`–`1` range." }
  - { name = "a", type = "number", default = "1", desc = "Alpha in the `0`–`1` range." }
---
Stores the current color and tints the swatch texture to match.
````

````apimethod
name: widget:SetHasAlpha
params:
  - { name = "HasAlpha", type = "boolean", desc = "`true` to allow editing the alpha channel." }
---
Controls whether the color picker exposes the opacity slider. When alpha is disabled, the widget forces alpha to `1` in its callbacks.
````

````apimethod
name: widget:SetLabel
params:
  - { name = "text", type = "string", optional = true, desc = "The label string, or `nil` to clear." }
---
Sets the text shown to the right of the swatch.
````

````apimethod
name: widget:SetDisabled
params:
  - { name = "disabled", type = "boolean", desc = "`true` to disable, `false` to enable." }
---
Enables or disables the swatch. A disabled swatch will not open the color picker and its label is greyed.
````

## Defaults

On acquire the widget resets to: height 24, width 200, alpha disabled, color black opaque (`0, 0, 0, 1`), not disabled, and no label.

## Callbacks
````apimethod
name: OnValueChanged
kind: callback
params:
  - { name = "r", type = "number", desc = "Red component in the `0`–`1` range." }
  - { name = "g", type = "number", desc = "Green component in the `0`–`1` range." }
  - { name = "b", type = "number", desc = "Blue component in the `0`–`1` range." }
  - { name = "a", type = "number", desc = "Alpha in the `0`–`1` range." }
---
Fired live while the `ColorPickerFrame` is open and the color is changed (and not equal to the previous value). Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnValueConfirmed
kind: callback
params:
  - { name = "r", type = "number", desc = "Red component in the `0`–`1` range." }
  - { name = "g", type = "number", desc = "Green component in the `0`–`1` range." }
  - { name = "b", type = "number", desc = "Blue component in the `0`–`1` range." }
  - { name = "a", type = "number", desc = "Alpha in the `0`–`1` range." }
---
Fired once after the color picker is closed (on the final alpha callback), to signal the user committed a value, including via cancel which restores the original color. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnEnter
kind: callback
---
Fired when the mouse enters the swatch. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnLeave
kind: callback
---
Fired when the mouse leaves the swatch. Subscribe with `widget:SetCallback`.
````

## Example
```lua
local cp = AceGUI:Create("ColorPicker")
cp:SetLabel("Bar color")
cp:SetHasAlpha(true)
cp:SetColor(db.r, db.g, db.b, db.a)
cp:SetCallback("OnValueConfirmed", function(widget, event, r, g, b, a)
    db.r, db.g, db.b, db.a = r, g, b, a
end)
```
