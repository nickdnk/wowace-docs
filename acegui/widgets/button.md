---
description: "The AceGUI-3.0 Button widget: a graphical push button built on Blizzard's UIPanelButtonTemplate, with text and an OnClick callback"
---

# Button

A graphical push button built on Blizzard's
[`UIPanelButtonTemplate`](https://warcraft.wiki.gg/wiki/UIPanelButtonTemplate).

Create with `AceGUI:Create("Button")`. It inherits the [Common Widget API](/acegui/widget-api).

**Widget type:** `Button`

## Methods

````apimethod
name: widget:SetText
params:
  - { name = "text", type = "string", optional = true, desc = "The label to display. Passing `nil` clears the text." }
---
Sets the button's caption. If auto-width is enabled, the button is resized to fit the text (string width + 30px padding).
````

````apimethod
name: widget:SetAutoWidth
params:
  - { name = "autoWidth", type = "boolean", desc = "`true` to size the button to its text, `false` to keep the fixed width." }
---
Toggles automatic width sizing. When enabled, the button immediately resizes to its current text width plus 30px, and every subsequent [`SetText`](#settext) re-fits the width.
````

````apimethod
name: widget:SetDisabled
params:
  - { name = "disabled", type = "boolean", desc = "`true` to disable, `false` to enable." }
---
Enables or disables the button. A disabled button cannot be clicked and is greyed out by the template.
````

## Defaults

On acquire the button resets to: height 24, width 200, not disabled, auto-width off, and empty text.

## Callbacks

````apimethod
name: OnClick
kind: callback
params:
  - { name = "...", type = "any", desc = "The native button click args forwarded from the frame's `OnClick` (e.g. the mouse `button` and `down` state)." }
---
Fired when the button is clicked. Before firing, AceGUI clears focus and plays the menu-option click sound. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnEnter
kind: callback
---
Fired when the mouse enters the button. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnLeave
kind: callback
---
Fired when the mouse leaves the button. Subscribe with `widget:SetCallback`.
````

## Example

```lua
local btn = AceGUI:Create("Button")
btn:SetText("Apply")
btn:SetAutoWidth(true)
btn:SetCallback("OnClick", function(widget)
    print("Apply clicked")
end)
```
