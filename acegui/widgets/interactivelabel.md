---
description: "The AceGUI-3.0 InteractiveLabel widget: a Label that responds to the mouse, adding a highlight texture and click and hover callbacks"
---

# InteractiveLabel

A [Label](/acegui/widgets/label) that responds to mouse interaction, adding a highlight texture and click/hover
callbacks.

Create with `AceGUI:Create("InteractiveLabel")`. It inherits the [Common Widget API](/acegui/widget-api). It is built on
top of the `Label` widget and supports all of [Label's methods](/acegui/widgets/label#methods) (`SetText`, `SetImage`,
`SetColor`, `SetFontObject`, etc.) in addition to the methods below.

**Widget type:** `InteractiveLabel`

## Methods

````apimethod
name: widget:SetHighlight
params:
  - { name = "...", type = "any", desc = "Arguments forwarded to the highlight texture's [`SetTexture`](https://warcraft.wiki.gg/wiki/API_Texture_SetTexture) (e.g. a texture path or file ID); pass nothing to clear the highlight." }
---
Sets the texture shown when the label is hovered.
````

````apimethod
name: widget:SetHighlightTexCoord
params:
  - { name = "...", type = "number", desc = "Either 4 (`left, right, top, bottom`) or 8 coordinate values. Any other count falls back to the full texture (`0, 1, 0, 1`)." }
---
Sets the texture coordinates of the highlight texture.
````

````apimethod
name: widget:SetDisabled
params:
  - { name = "disabled", type = "boolean", desc = "`true` to disable, `false` to enable." }
---
Enables or disables interaction. When disabled, the frame stops accepting mouse input and the text is greyed out.
````

## Defaults

On acquire the interactive label runs the inherited Label acquire (resetting text, image, color, font, and
justification), then clears the highlight texture and tex-coords and sets the widget enabled.

## Callbacks

In addition to any callbacks inherited from Label, the following are fired:

````apimethod
name: OnClick
kind: callback
params:
  - { name = "button", type = "string", desc = "The mouse button that was pressed (e.g. `\"LeftButton\"`)." }
---
Fired when the label is clicked (on mouse down); AceGUI clears focus afterward. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnEnter
kind: callback
---
Fired when the mouse enters the label. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnLeave
kind: callback
---
Fired when the mouse leaves the label. Subscribe with `widget:SetCallback`.
````

## Example

```lua
local label = AceGUI:Create("InteractiveLabel")
label:SetText("Click me")
label:SetHighlight("Interface\\QuestFrame\\UI-QuestTitleHighlight")
label:SetCallback("OnClick", function(widget, event, button)
    print("Clicked with", button)
end)
```
