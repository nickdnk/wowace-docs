---
description: "The AceGUI-3.0 CheckBox widget: a checkbox or radio button with an optional label, description and image, supporting a tri-state mode"
---

# CheckBox

A checkbox or radio button control with an optional label, description, and image. Supports a tri-state mode.

Create with `AceGUI:Create("CheckBox")`. It inherits the [Common Widget API](/acegui/widget-api).

**Widget type:** `CheckBox`

## Methods

````apimethod
name: widget:SetValue
params:
  - { name = "value", type = "boolean", optional = true, desc = "`true` (checked), `false` (unchecked), or `nil` (only meaningful in tri-state mode)." }
---
Sets the checked state and updates the check texture. In tri-state mode, a `nil` value shows a desaturated check to represent the "unknown/mixed" state; `false` hides the check; any truthy value shows the normal check.
````

````apimethod
name: widget:GetValue
returns: { type = "boolean", desc = "The current checked state (`true`, `false`, or `nil` for the tri-state unknown value)." }
---
Returns the current checked state.
````

````apimethod
name: widget:ToggleChecked
---
Cycles the value. In normal mode it flips between `true`/`false`. In tri-state mode it cycles in the order `true` → `nil` → `false` → `true`.
````

````apimethod
name: widget:SetTriState
params:
  - { name = "enabled", type = "boolean", desc = "`true` to allow the third (`nil`) state." }
---
Enables or disables tri-state behavior, then re-applies the current value so the display updates.
````

````apimethod
name: widget:SetType
params:
  - { name = "type", type = "string", optional = true, desc = "`\"radio\"` for radio-button textures (16px), or anything else / `nil` for the default checkbox textures (24px)." }
---
Switches the visual style between a checkbox and a radio button.
````

````apimethod
name: widget:SetLabel
params:
  - { name = "label", type = "string", optional = true, desc = "The label string." }
---
Sets the text shown next to the box.
````

````apimethod
name: widget:SetDescription
params:
  - { name = "desc", type = "string", optional = true, desc = "The description text, or `nil`/`\"\"` to remove it." }
---
Sets an optional supplementary description line beneath the label. Passing a value creates the description font string (if needed) and grows the widget height to fit it; passing `nil`/`""` removes it and resets the height to 24.
````

````apimethod
name: widget:SetImage
params:
  - { name = "path", type = "string|number", optional = true, desc = "Texture path or file ID. `nil` clears the image." }
  - { name = "...", type = "number", desc = "Optional tex-coords. Pass 4 values (for [`SetTexCoord(left, right, top, bottom)`](https://warcraft.wiki.gg/wiki/API_Texture_SetTexCoord)) or 8 values for the full corner form; otherwise the full texture (`0, 1, 0, 1`) is used." }
---
Sets an optional icon texture shown before the label and realigns the label accordingly.
````

````apimethod
name: widget:SetDisabled
params:
  - { name = "disabled", type = "boolean", desc = "`true` to disable, `false` to enable." }
---
Enables or disables the control. When disabled the label/description are greyed and the check is desaturated. When enabled, the check is desaturated only in tri-state mode with a `nil` value.
````

````apimethod
name: widget:OnWidthSet
params:
  - { name = "width", type = "number", desc = "The new width." }
---
Internal layout hook called when the width changes; re-wraps the description text and recomputes the height. Not normally called directly.
````

## Defaults

On acquire the control resets to: checkbox type (not radio), value `false`, tri-state off, width 200, no image, not
disabled, and no description.

## Callbacks

````apimethod
name: OnValueChanged
kind: callback
params:
  - { name = "checked", type = "boolean", optional = true, desc = "The new value (`true`, `false`, or `nil` in tri-state)." }
---
Fired when the user clicks the box (mouse up) and the value is toggled. A check-on/check-off sound is played first. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnEnter
kind: callback
---
Fired when the mouse enters the control. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnLeave
kind: callback
---
Fired when the mouse leaves the control. Subscribe with `widget:SetCallback`.
````

## Example

```lua
local cb = AceGUI:Create("CheckBox")
cb:SetLabel("Enable feature")
cb:SetDescription("Turns the feature on or off for this character.")
cb:SetValue(db.enabled)
cb:SetCallback("OnValueChanged", function(widget, event, checked)
    db.enabled = checked
end)
```
