---
description: "The AceGUI-3.0 Icon widget: a clickable icon button that displays a texture with an optional caption beneath it"
---

# Icon

A clickable icon button that displays a texture with an optional caption beneath it.

Create with `AceGUI:Create("Icon")`. It inherits the [Common Widget API](/acegui/widget-api).

**Widget type:** `Icon`

## Methods

````apimethod
name: widget:SetLabel
params:
  - { name = "text", type = "string", optional = true, desc = "The caption to display, or `nil`/`\"\"` to hide it." }
---
Sets the caption shown below the icon. Passing a non-empty string shows the label and sizes the widget to the image height plus 25px; passing `nil` or an empty string hides the label and sizes to the image height plus 10px.
````

````apimethod
name: widget:SetImage
params:
  - { name = "path", type = "string|number", optional = true, desc = "Texture path or file ID. `nil` clears the image." }
  - { name = "...", type = "number", desc = "Optional texture coordinates: either 4 (`left, right, top, bottom`) or 8 values. Any other count falls back to the full texture." }
---
Sets the icon texture. If texture coordinates are supplied as the trailing arguments, they are applied; otherwise the full texture (`0, 1, 0, 1`) is used.
````

````apimethod
name: widget:SetImageSize
params:
  - { name = "width", type = "number", desc = "Texture width in pixels." }
  - { name = "height", type = "number", desc = "Texture height in pixels." }
---
Sets the displayed size of the icon texture and adjusts the widget height accordingly (image height plus 25px when a label is shown, plus 10px otherwise).
````

````apimethod
name: widget:SetDisabled
params:
  - { name = "disabled", type = "boolean", desc = "`true` to disable, `false` to enable." }
---
Enables or disables the icon. When disabled, the button stops responding and the label and image are greyed out.
````

## Defaults

On acquire the icon resets to: width 110, height 110, no label, no image, image size 64×64, and not disabled.

::: tip Deprecated
`SetText` is a deprecated alias for [`SetLabel`](#setlabel) and prints a warning. Use [`SetLabel`](#setlabel) instead.
:::

## Callbacks

````apimethod
name: OnClick
kind: callback
params:
  - { name = "button", type = "string", desc = "The mouse button that was pressed (e.g. `\"LeftButton\"`)." }
---
Fired when the icon is clicked; AceGUI clears focus afterward. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnEnter
kind: callback
---
Fired when the mouse enters the icon. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnLeave
kind: callback
---
Fired when the mouse leaves the icon. Subscribe with `widget:SetCallback`.
````

## Example

```lua
local icon = AceGUI:Create("Icon")
icon:SetImage("Interface\\Icons\\INV_Misc_QuestionMark")
icon:SetImageSize(48, 48)
icon:SetLabel("Help")
icon:SetCallback("OnClick", function(widget, event, button)
    print("Clicked with", button)
end)
```
