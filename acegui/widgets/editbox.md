---
description: "The AceGUI-3.0 EditBox widget: a single-line text input with an optional label and accept button, supporting item, spell, macro and chat-link drag-and-drop"
---

# EditBox

A single-line text input built on [`InputBoxTemplate`](https://warcraft.wiki.gg/wiki/Widget_API), with an optional label and an accept button (`"OK"`). Supports drag-and-drop of items, spells, macros, and chat-link insertion.

Create with `AceGUI:Create("EditBox")`. It inherits the [Common Widget API](/acegui/widget-api).

**Widget type:** `EditBox` · **Version:** 29

## Methods
````apimethod
name: widget:SetText
params:
  - { name = "text", type = "string", optional = true, desc = "The string to display, or `nil` for empty." }
---
Sets the contents of the edit box, resets the cursor to the start, and hides the accept button. Also updates the internally tracked "last text" so the change does not refire [`OnTextChanged`](#ontextchanged).
````

````apimethod
name: widget:GetText
returns: { type = "string", desc = "The current text in the edit box." }
---
Returns the current text in the edit box.
````

````apimethod
name: widget:SetLabel
params:
  - { name = "text", type = "string", optional = true, desc = "The label string, or `nil`/`\"\"` to hide the label." }
---
Sets an optional label above the input. When a label is present the widget grows to height 44; when cleared it shrinks to height 26 and the input moves to the top.
````

````apimethod
name: widget:DisableButton
params:
  - { name = "disabled", type = "boolean", desc = "`true` to suppress the accept button." }
---
Controls whether the inline `"OK"` accept button is shown when the text is edited. When disabled the button stays hidden.
````

````apimethod
name: widget:SetMaxLetters
params:
  - { name = "num", type = "number", optional = true, desc = "Maximum letters; `0` (or `nil`) means no limit." }
---
Sets the maximum number of characters the user can enter.
````

````apimethod
name: widget:SetFocus
---
Gives keyboard focus to the edit box. If the frame is not yet shown, focus is applied the next time it shows.
````

````apimethod
name: widget:ClearFocus
---
Removes keyboard focus from the edit box and cancels any pending focus-on-show.
````

````apimethod
name: widget:HighlightText
params:
  - { name = "from", type = "number", desc = "Start position of the selection." }
  - { name = "to", type = "number", desc = "End position of the selection." }
---
Highlights a range of the text.
````

````apimethod
name: widget:SetDisabled
params:
  - { name = "disabled", type = "boolean", desc = "`true` to disable, `false` to enable." }
---
Enables or disables the input. A disabled box ignores the mouse, drops focus, and greys the text and label.
````

## Defaults

On acquire the widget resets to: width 200, not disabled, no label, empty text, accept button enabled, and no max-letter limit. On release it clears focus.

## Callbacks
````apimethod
name: OnEnterPressed
kind: callback
params:
  - { name = "text", type = "string", desc = "The current value (or the dragged-in name)." }
---
Fired when the user presses Enter, clicks the accept (`"OK"`) button, or drops an item/spell/macro onto the box. If your handler returns a truthy value, the change is treated as cancelled: the accept sound is not played and the accept button stays visible. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnTextChanged
kind: callback
params:
  - { name = "text", type = "string", desc = "The new value." }
---
Fired whenever the text changes and differs from the previous value. Shows the accept button. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnEnter
kind: callback
---
Fired when the mouse enters the input. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnLeave
kind: callback
---
Fired when the mouse leaves the input. Subscribe with `widget:SetCallback`.
````

## Example
```lua
local eb = AceGUI:Create("EditBox")
eb:SetLabel("Player name")
eb:SetMaxLetters(12)
eb:SetCallback("OnEnterPressed", function(widget, event, text)
    db.name = text
    print("Saved name:", text)
end)
```
