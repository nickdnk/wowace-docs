---
description: "The AceGUI-3.0 MultiLineEditBox widget: a scrollable multi-line text input with an optional label and Accept button, supporting chat links and dragging"
---

# MultiLineEditBox

A scrollable, multi-line text input with an optional label and an `"Accept"` button. Supports inserting chat links and
dragging spells/items into the box.

Create with `AceGUI:Create("MultiLineEditBox")`. It inherits the [Common Widget API](/acegui/widget-api).

**Widget type:** `MultiLineEditBox`

## Methods

````apimethod
name: widget:SetText
params:
  - { name = "text", type = "string", optional = true, desc = "The text to place in the box." }
---
Sets the contents of the edit box. Setting text programmatically clears the highlight, resets the cursor, and disables the Accept button.
````

````apimethod
name: widget:GetText
returns: { type = "string", desc = "The current contents of the edit box." }
---
Returns the current contents of the edit box.
````

````apimethod
name: widget:SetLabel
params:
  - { name = "text", type = "string", optional = true, desc = "The label text, or `\"\"`/`nil` to hide it." }
---
Sets the label shown above the box. A non-empty label is shown (reserving 10px of header height); an empty/`nil` label is hidden. Triggers a re-layout.
````

````apimethod
name: widget:SetNumLines
params:
  - { name = "value", type = "number", default = "4", desc = "Number of visible lines; values below 4 are clamped to 4." }
---
Sets the visible height of the box in lines (minimum 4). Triggers a re-layout.
````

````apimethod
name: widget:SetMaxLetters
params:
  - { name = "num", type = "number", default = "0", desc = "Maximum character count; `0` (the default) means no limit." }
---
Limits the number of characters the box accepts.
````

````apimethod
name: widget:DisableButton
params:
  - { name = "disabled", type = "boolean", desc = "`true` hides the button, `false` shows it." }
---
Shows or hides the Accept button. Triggers a re-layout (the box is taller when the button is hidden).
````

````apimethod
name: widget:SetFocus
---
Gives keyboard focus to the edit box. If the frame is not yet shown, focus is applied on its next [`OnShow`](https://warcraft.wiki.gg/wiki/UIHANDLER_OnShow).
````

````apimethod
name: widget:ClearFocus
---
Removes keyboard focus from the edit box and cancels any pending focus-on-show.
````

````apimethod
name: widget:HighlightText
params:
  - { name = "from", type = "number", desc = "Start character index." }
  - { name = "to", type = "number", desc = "End character index." }
---
Highlights a range of characters in the edit box.
````

````apimethod
name: widget:GetCursorPosition
returns: { type = "number", desc = "The current cursor position in the edit box." }
---
Returns the current cursor position in the edit box.
````

````apimethod
name: widget:SetCursorPosition
params:
  - { name = "...", type = "number", desc = "Arguments forwarded to the edit box's `SetCursorPosition` (the cursor index)." }
---
Sets the cursor position in the edit box.
````

````apimethod
name: widget:SetDisabled
params:
  - { name = "disabled", type = "boolean", desc = "`true` to disable, `false` to enable." }
---
Enables or disables the editbox. When disabled it drops focus, ignores the mouse, greys the text and label, and disables the accept button.
````

## Defaults

On acquire the widget resets to: empty text, not disabled, width 200, Accept button shown, 4 visible lines, not "
entered", and no character limit. On release it clears focus.

## Callbacks

````apimethod
name: OnEnterPressed
kind: callback
params:
  - { name = "text", type = "string", desc = "The full box contents." }
---
Fired when the Accept button is clicked (focus is cleared first). If no handler returns a truthy value, the Accept button is disabled afterward. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnTextChanged
kind: callback
params:
  - { name = "text", type = "string", desc = "The current contents." }
---
Fired on user input (not programmatic [`SetText`](#settext)); also enables the Accept button. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnEditFocusGained
kind: callback
---
Fired when the edit box gains keyboard focus. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnEditFocusLost
kind: callback
---
Fired when the edit box loses keyboard focus. Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnEnter
kind: callback
---
Fired when the mouse enters the edit box or scroll area (once, until it leaves). Subscribe with `widget:SetCallback`.
````

````apimethod
name: OnLeave
kind: callback
---
Fired when the mouse leaves the edit box or scroll area. Subscribe with `widget:SetCallback`.
````

## Example

```lua
local edit = AceGUI:Create("MultiLineEditBox")
edit:SetLabel("Notes")
edit:SetNumLines(8)
edit:SetText("Type your notes here...")
edit:SetCallback("OnEnterPressed", function(widget, event, text)
    print("Saved:", text)
end)
```
