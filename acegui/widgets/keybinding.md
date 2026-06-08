---
description: "The AceGUI-3.0 Keybinding widget: a button that captures a key combination, recording the next key, mouse button or gamepad input for config UIs"
---

# Keybinding

A button for capturing a key combination, used to set keybindings in a config UI. Clicking it enters a capture mode that
records the next key, mouse button, or gamepad input.

Create with `AceGUI:Create("Keybinding")`. It inherits the [Common Widget API](/acegui/widget-api).

**Widget type:** `Keybinding`

## Methods

````apimethod
name: widget:SetKey
params:
  - { name = "key", type = "string", optional = true, desc = "The binding string (e.g. `\"SHIFT-F\"`), or `\"\"`/`nil` to show as unbound." }
---
Sets the displayed binding. An empty/`nil` key shows the localized [`NOT_BOUND`](https://warcraft.wiki.gg/wiki/FrameXML_functions) text in the normal font; a non-empty key is shown highlighted.
````

````apimethod
name: widget:GetKey
returns: { type = "string", desc = "The current binding string, or `nil` if the button shows the unbound (`NOT_BOUND`) text." }
---
Returns the current binding string, or `nil` if the button shows the unbound (`NOT_BOUND`) text.
````

````apimethod
name: widget:SetLabel
params:
  - { name = "label", type = "string", optional = true, desc = "The label text, or `\"\"`/`nil` for no label." }
---
Sets the descriptive label above the button. A non-empty label sets the widget height to 44 and an align offset of 30; an empty label sets height 24 with no offset.
````

````apimethod
name: widget:SetDisabled
params:
  - { name = "disabled", type = "boolean", desc = "`true` to disable, `false` to enable." }
---
Enables or disables the button. When disabled, the button cannot be clicked and the label is greyed out.
````

## Defaults

On acquire the widget resets to: width 200, empty label, empty key, not waiting for a key, hidden prompt message, not
disabled, and keyboard/mouse-wheel/gamepad capture turned off until the button is clicked.

## Behavior

Clicking the button with the left or right mouse button toggles capture mode (a prompt frame appears). While capturing,
the next key/mouse-button/wheel/gamepad input is recorded as the binding (combining `SHIFT-`, `CTRL-`, `ALT-`
modifiers). Pressing `ESCAPE` clears the binding. Certain keys (`BUTTON1`, `BUTTON2`, `UNKNOWN`, and the bare modifier
keys) are ignored.

## Callbacks

````apimethod
name: OnKeyChanged
kind: callback
params:
  - { name = "key", type = "string", desc = "The new binding string (`\"\"` if cleared with ESCAPE)." }
---
Fired after a new binding is captured (unless the widget is disabled), after the key has already been applied via [`SetKey`](#setkey). Subscribe with `widget:SetCallback`.
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
local kb = AceGUI:Create("Keybinding")
kb:SetLabel("Open menu")
kb:SetKey("SHIFT-M")
kb:SetCallback("OnKeyChanged", function(widget, event, key)
    print("New binding:", key)
end)
```
