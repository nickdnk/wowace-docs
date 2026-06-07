---
description: "The AceGUI-3.0 Label widget: displays text and an optional icon, sizing its height dynamically to fit the content"
---

# Label

Displays text and optionally an icon, sizing its height dynamically to fit the content.

Create with `AceGUI:Create("Label")`. It inherits the [Common Widget API](/acegui/widget-api).

**Widget type:** `Label` · **Version:** 28

## Methods
````apimethod
name: widget:SetText
params:
  - { name = "text", type = "string", optional = true, desc = "The text to display. Passing `nil` clears it; zero-height labels are forced to 1px so they can serve as spacers." }
---
Sets the label's text and re-lays out the text/image anchors.
````

````apimethod
name: widget:SetColor
params:
  - { name = "r", type = "number", optional = true, desc = "Red component in the range `0`–`1`. Defaults to white (`1, 1, 1`) if any component is missing." }
  - { name = "g", type = "number", optional = true, desc = "Green component in the range `0`–`1`." }
  - { name = "b", type = "number", optional = true, desc = "Blue component in the range `0`–`1`." }
---
Sets the vertex color of the label text. If any component is missing, the color defaults to white (`1, 1, 1`).
````

````apimethod
name: widget:SetImage
params:
  - { name = "path", type = "string|number", optional = true, desc = "Texture path or file ID, or `nil` to remove the image." }
  - { name = "...", type = "number", desc = "Optional texture coordinates: either 4 (`left, right, top, bottom`) or 8 values. Any other count falls back to the full texture." }
---
Sets an optional image displayed alongside the text. When set, the image appears on the left if there is at least 200px of room for the text; otherwise it is centered on top. Passing a nil or invalid texture hides the image.
````

````apimethod
name: widget:SetImageSize
params:
  - { name = "width", type = "number", desc = "Image width in pixels." }
  - { name = "height", type = "number", desc = "Image height in pixels." }
---
Sets the displayed size of the image and re-lays out the widget.
````

````apimethod
name: widget:SetFont
params:
  - { name = "font", type = "string", desc = "Font file path." }
  - { name = "height", type = "number", desc = "Font height in pixels." }
  - { name = "flags", type = "string", desc = "Font flags string (e.g. `\"OUTLINE\"`)." }
---
Sets the label font using an internal, lazily-created font object.
````

````apimethod
name: widget:SetFontObject
params:
  - { name = "font", type = "table", optional = true, desc = "A font object, or `nil` for the default ([`GameFontHighlightSmall`](https://warcraft.wiki.gg/wiki/Widget_API))." }
---
Sets the label's font from an existing font object. Defaults to [`GameFontHighlightSmall`](https://warcraft.wiki.gg/wiki/Widget_API) when `nil`.
````

````apimethod
name: widget:SetJustifyH
params:
  - { name = "justifyH", type = "string", desc = "`\"LEFT\"`, `\"CENTER\"`, or `\"RIGHT\"`." }
---
Sets horizontal text justification.
````

````apimethod
name: widget:SetJustifyV
params:
  - { name = "justifyV", type = "string", desc = "`\"TOP\"`, `\"MIDDLE\"`, or `\"BOTTOM\"`." }
---
Sets vertical text justification.
````

````apimethod
name: widget:OnWidthSet
params:
  - { name = "width", type = "number", desc = "The new width." }
---
Layout hook called by AceGUI when the width changes; re-anchors the text and image. Not normally called directly.
````

## Defaults

On acquire the label resets to: width 200, empty text, no image, image size 16×16, white color, default font object, horizontal justify `LEFT`, and vertical justify `TOP`. Height is always derived from the text and image.

## Callbacks

This widget fires no widget-specific callbacks.

## Example
```lua
local label = AceGUI:Create("Label")
label:SetText("Status: ready")
label:SetColor(0, 1, 0)
label:SetImage("Interface\\Icons\\INV_Misc_QuestionMark")
label:SetImageSize(20, 20)
```
