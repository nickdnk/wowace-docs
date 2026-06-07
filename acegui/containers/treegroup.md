---
description: "The AceGUI-3.0 TreeGroup container: groups widgets and switches between them using a hierarchical tree control on the side"
---

# TreeGroup

A container that switches between groups of widgets using a tree control.

Create with `AceGUI:Create("TreeGroup")`. This is a **container**; it inherits the [Common Widget API and container methods](/acegui/widget-api).

**Widget type:** `TreeGroup` · **Version:** 49

## Methods
````apimethod
name: container:SetTree
params:
  - { name = "tree", type = "table", desc = "Array of node tables (may contain nested `children`). Asserted to be a table when non-nil. See [Tree node format](#tree-node-format)." }
  - { name = "filter", type = "boolean", optional = true, desc = "When truthy, branches and leaves whose `visible` is `false` are hidden, and branches are only shown if they contain at least one visible descendant." }
---
Set the tree to display and refresh it. See [Tree node format](#tree-node-format) for the structure of `tree`.
````

````apimethod
name: container:SelectByPath
params:
  - { name = "...", type = "string", desc = "The sequence of node `value`s from the top level to the target node (e.g. `\"parentValue\", \"childValue\"`)." }
---
Select a node by its path of `value`s from the root down, expanding every ancestor group along the way and scrolling the selection into view. Fires [`OnGroupSelected`](#ongroupselected).
````

````apimethod
name: container:SelectByValue
params:
  - { name = "uniquevalue", type = "string", desc = "The unique value string, e.g. `\"parentValue\\001childValue\"`." }
---
Select a node by its full unique value (the path components joined by `\001`). Splits on `\001` to derive the path, expands ancestors, scrolls into view, and fires [`OnGroupSelected`](#ongroupselected).
````

````apimethod
name: container:Select
params:
  - { name = "uniquevalue", type = "string", desc = "The unique value to mark as selected." }
  - { name = "...", type = "string", desc = "The path components used to expand ancestor groups." }
---
Lower-level selection method used by [`SelectByPath`](#selectbypath)/[`SelectByValue`](#selectbyvalue). Disables filtering, expands every group along the path, sets the selection, refreshes (scrolling to the selection), and fires [`OnGroupSelected`](#ongroupselected).
````

````apimethod
name: container:SetSelected
params:
  - { name = "value", type = "string", desc = "The unique value of the node to select." }
---
Set the selected node to `value` (the node's unique value). Only fires [`OnGroupSelected`](#ongroupselected) if the selection actually changed. Does not expand ancestors or scroll.
````

````apimethod
name: container:SetStatusTable
params:
  - { name = "status", type = "table", desc = "A table you own and keep alive (asserted to be of type `table`)." }
---
Supply an external table for persisting tree state. The container stores/reads `groups` (expanded-state map keyed by unique value), `scrollvalue`, `treewidth`, `treesizable`, and `selected`. Missing keys are initialized. After setting, applies the stored tree width and refreshes.
````

````apimethod
name: container:SetTreeWidth
params:
  - { name = "treewidth", type = "number|boolean", optional = true, desc = "Width in pixels (default 175), or a boolean to set only `resizable`." }
  - { name = "resizable", type = "boolean", optional = true, desc = "When true, the drag handle is enabled." }
---
Set the width of the tree pane and whether the user may drag-resize it. `treewidth` may be omitted or boolean: if a boolean is passed as the first argument, it is treated as `resizable` and the width defaults to 175. Stores the values in the status table.
````

````apimethod
name: container:GetTreeWidth
returns: { type = "number", desc = "The current tree-pane width (defaults to 175 if unset)." }
---
Returns the current tree-pane width (defaults to 175 if unset).
````

````apimethod
name: container:EnableButtonTooltips
params:
  - { name = "enable", type = "boolean", desc = "Whether the built-in hover tooltip is shown." }
---
Enable or disable the built-in tooltip shown when hovering over a tree button (the tooltip text is the button label). Enabled by default on acquire.
````

````apimethod
name: container:RefreshTree
params:
  - { name = "scrollToSelection", type = "boolean", optional = true, desc = "Pass `true` to scroll the selected node into view." }
  - { name = "fromOnUpdate", type = "boolean", optional = true, desc = "Internal flag set when called from the first-frame OnUpdate handler." }
---
Rebuild the visible button list from the current tree and status tables. Called automatically after most mutations; call directly if you mutate the tree table in place.
````

> The container also defines `CreateButton`, `BuildLevel`, and `ShowScroll` as internal helpers, plus `OnWidthSet`/`OnHeightSet`/`LayoutFinished` for layout.

## Callbacks
````apimethod
name: OnGroupSelected
kind: callback
params:
  - { name = "uniquevalue", type = "string", desc = "The selected node's unique value (path components joined by `\\001`)." }
---
Fired when the selected node changes (via [`SetSelected`](#setselected), [`Select`](#select), [`SelectByPath`](#selectbypath), [`SelectByValue`](#selectbyvalue), or clicking a button). Release and rebuild the content here.
````

````apimethod
name: OnClick
kind: callback
params:
  - { name = "uniquevalue", type = "string", desc = "The clicked node's unique value." }
  - { name = "selected", type = "boolean", desc = "The button's selected state at click time." }
---
Fired when a tree button is clicked, before selection is applied.
````

````apimethod
name: OnButtonEnter
kind: callback
params:
  - { name = "uniquevalue", type = "string", desc = "The node's unique value." }
  - { name = "buttonFrame", type = "Button", desc = "The underlying tree button." }
---
Fired when the mouse enters a tree button.
````

````apimethod
name: OnButtonLeave
kind: callback
params:
  - { name = "uniquevalue", type = "string", desc = "The node's unique value." }
  - { name = "buttonFrame", type = "Button", desc = "The underlying tree button." }
---
Fired when the mouse leaves a tree button.
````

````apimethod
name: OnTreeResize
kind: callback
params:
  - { name = "width", type = "number", desc = "The new tree width in pixels." }
---
Fired after the user finishes drag-resizing the tree pane.
````

## Tree node format

[`SetTree`](#settree) takes an array of node tables. Each node recognizes the following fields (read from the source `addLine`/`UpdateButton`):

- `value`: the node's identifier within its level. The full path of `value`s (joined by `\001`) forms the node's **unique value**, which is what [`OnGroupSelected`](#ongroupselected)/[`OnClick`](#onclick) report and what [`SelectByValue`](#selectbyvalue) expects. Sibling node values must be unique within their parent.
- `text`: the label shown for the node.
- `icon`: optional texture (path or file ID) drawn left of the text.
- `iconCoords`: optional table of texture coordinates `{left, right, top, bottom}` (passed to [`SetTexCoord`](https://warcraft.wiki.gg/wiki/API_Texture_SetTexCoord)).
- `disabled`: if truthy, the node is greyed out and not mouse-interactive.
- `children`: optional array of child node tables. A node with `children` is a collapsible branch whose expanded state is tracked per unique value in the status table.
- `visible`: optional boolean. When the tree is set with a `filter`, nodes with `visible = false` are hidden (and empty branches are pruned).

## Example
```lua
local AceGUI = LibStub("AceGUI-3.0")

local tree = AceGUI:Create("TreeGroup")
tree:SetFullWidth(true)
tree:SetFullHeight(true)
tree:SetLayout("Flow")

tree:SetTree({
    {
        value = "combat",
        text  = "Combat",
        children = {
            { value = "melee",  text = "Melee"  },
            { value = "ranged", text = "Ranged" },
        },
    },
    {
        value = "ui",
        text  = "Interface",
        icon  = "Interface\\Icons\\INV_Misc_Gear_01",
        children = {
            { value = "frames", text = "Frames" },
            { value = "fonts",  text = "Fonts", disabled = true },
        },
    },
})

tree:SetCallback("OnGroupSelected", function(container, event, uniquevalue)
    container:ReleaseChildren()
    -- uniquevalue is e.g. "combat\001melee"
    local lbl = AceGUI:Create("Label")
    lbl:SetText("Selected: " .. uniquevalue)
    container:AddChild(lbl)
end)

-- expand "combat" and select its "melee" child
tree:SelectByPath("combat", "melee")
```
