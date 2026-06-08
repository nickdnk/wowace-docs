---
description: "The AceGUI-3.0 Heading widget: a horizontal divider with optional centered title text used to separate sections of a layout"
---

# Heading

A horizontal divider with optional centered title text, used to separate sections of a layout.

Create with `AceGUI:Create("Heading")`. It inherits the [Common Widget API](/acegui/widget-api).

**Widget type:** `Heading`

## Methods

````apimethod
name: widget:SetText
params:
  - { name = "text", type = "string", optional = true, desc = "The heading text, or `nil`/`\"\"` for a plain divider line." }
---
Sets the heading's centered title. When text is present, the divider line is split into a left and right segment around the label. When the text is empty or `nil`, the right segment is hidden and the left line spans the full width.
````

## Defaults

On acquire the heading resets to: empty text, full width, and height 18.

## Callbacks

This widget fires no callbacks.

## Example

```lua
local heading = AceGUI:Create("Heading")
heading:SetText("Display Options")
container:AddChild(heading)
```
