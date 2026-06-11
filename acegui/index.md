---
description: "AceGUI-3.0 is a pooled widget toolkit for building World of Warcraft addon GUIs, used by AceConfigDialog and usable on its own to create custom interfaces"
---

# AceGUI-3.0

AceGUI-3.0 provides access to numerous widgets which can be used to create GUIs.

AceGUI is used by [`AceConfigDialog`](/api/ace-config-dialog) to create the option GUIs, but you can use it by itself to
create any custom GUI.

::: warning
When using AceGUI-3.0 directly, **do not modify the underlying frames of the widgets**. Any "unknown" change to a widget
will cause addons that later pull it from the widget pool to misbehave. If some part of a widget needs to be modifiable,
open a ticket so a proper API can be added; do not reach into the frame yourself.
:::

## Widgets & Containers

Widgets are the individual controls you place in a GUI (buttons, editboxes, sliders, and so on). Containers are special
widgets that hold and lay out other widgets, such as frames and tab groups.

- **Widgets:** see
  the [Button](/acegui/widgets/button), [CheckBox](/acegui/widgets/checkbox), [EditBox](/acegui/widgets/editbox),
- [Slider](/acegui/widgets/slider) pages and the rest of the Widgets section in the sidebar.
- **Containers:** see [Frame](/acegui/containers/frame), [TabGroup](/acegui/containers/tabgroup), and the rest of the
  Containers section.
- **Common Widget API:** methods shared by every widget are documented on the [Common Widget API](/acegui/widget-api)
  page.
- New to AceGUI? Start with the [Tutorial](#tutorial) below.

## Frame pooling

The WoW API has **no way to destroy a frame**. Once you call
[`CreateFrame`](https://warcraft.wiki.gg/wiki/API_CreateFrame), that frame exists for the rest of the session. You can
[`Hide`](https://warcraft.wiki.gg/wiki/API_ScriptRegion_Hide) it, but it keeps consuming memory and stays referenced by
the client. Addons that build UI dynamically (rebuilding a list every update, opening the same window repeatedly) and
create fresh frames each time **leak frames** for the whole session.

AceGUI solves this with a **widget pool**. Every widget type has a pool of reusable instances:

- [`AceGUI:Create(type)`](#create) takes a widget from that type's pool if one is free, and only calls `CreateFrame`
  when the pool is empty. On reuse, it calls the widget's [`OnAcquire`](#widget-lifecycle-onacquire-onrelease) to reset
  it to defaults.
- [`AceGUI:Release(widget)`](#release) does **not** destroy the widget; it wipes the widget's data, hides it, and
  returns it to the pool so the next [`Create`](#create) of that type can reuse it. Releasing a container also releases
  all of its children.

So instead of leaking a frame per redraw, you [`Create`](#create) widgets when you need them and [`Release`](#release)
them when you're done; the underlying frames are recycled, across your addon *and* every other addon using AceGUI. The
practical rules:

- Release a window in its [`OnClose`](/acegui/containers/frame#onclose) callback (`AceGUI:Release(widget)`).
- Call [`container:ReleaseChildren`](/acegui/widget-api#releasechildren) before redrawing a group's contents, rather
  than creating new child widgets each time.
- If you never release, the pool never gets anything back and your addon's frame usage grows just like manual
  `CreateFrame` would.

### Widget lifecycle: OnAcquire & OnRelease

Each widget type defines two internal lifecycle hooks that the pool drives:

- **[`OnAcquire`](/acegui/widget-api#onacquire)**: called by [`AceGUI:Create`](#create) every time a widget is handed
  out (whether freshly created or reused from the pool). It resets the widget to its default state (size, text, value,
  etc.) so a recycled widget never carries over data from its previous user.
- **[`OnRelease`](/acegui/widget-api#onrelease)**: called by [`AceGUI:Release`](#release) before the widget returns to
  the pool. It clears the widget's data and hides it.

These are implementation details of each widget, not something you call yourself; you create widgets, set them up
through their public methods, and release them. They explain *why* a freshly created widget always starts from defaults
and why you re-apply your settings after each `Create`.

## Example

```lua
local AceGUI = LibStub("AceGUI-3.0")
-- Create a container frame
local f = AceGUI:Create("Frame")
f:SetCallback("OnClose", function(widget) AceGUI:Release(widget) end)
f:SetTitle("AceGUI-3.0 Example")
f:SetStatusText("Status Bar")
f:SetLayout("Flow")
-- Create a button
local btn = AceGUI:Create("Button")
btn:SetWidth(170)
btn:SetText("Button !")
btn:SetCallback("OnClick", function() print("Click!") end)
-- Add the button to the container
f:AddChild(btn)
```

## Tutorial

This walk-through builds a simple UI, explains how the layouts work, and shows several widgets in action. All snippets
assume a local `AceGUI` reference:

```lua
local AceGUI = LibStub("AceGUI-3.0")
```

### A Container Frame

Every UI starts with a container. You can use your own container frames to place controls in, but for this tutorial we
start with a simple AceGUI `Frame` container widget.

Let's create an empty container frame and fill some of its attributes:

```lua
local frame = AceGUI:Create("Frame")
frame:SetTitle("Example Frame")
frame:SetStatusText("AceGUI-3.0 Example Container Frame")
```

You'll see the frame on screen. Every `Frame` widget comes with a heading, a status bar and a close button, as well as
some artwork to make it look like a proper frame. This frame can be freely resized by the user using the drag-handle in
the bottom-right corner, or by dragging the bottom or right border.

Your code can set a size and position for the frame as well, using the
default [`SetWidth`](https://warcraft.wiki.gg/wiki/API_Region_SetWidth),
[`SetHeight`](https://warcraft.wiki.gg/wiki/API_Region_SetHeight) and
[`SetPoint`](https://warcraft.wiki.gg/wiki/API_Region_SetPoint) frame functions.

::: tip
To learn more about the `Frame` widget or containers in general, see
the [Frame container reference](/acegui/containers/frame) and the rest of the Containers section, plus
the [Common Widget API](/acegui/widget-api).
:::

### Placing Widgets on the Frame

We'll create a simple button and an editbox on our frame. This is as simple as asking AceGUI to create them, and adding
them as child frames to the container.

```lua
local frame = AceGUI:Create("Frame")
frame:SetTitle("Example Frame")
frame:SetStatusText("AceGUI-3.0 Example Container Frame")
frame:SetCallback("OnClose", function(widget) AceGUI:Release(widget) end)
frame:SetLayout("Flow")

local editbox = AceGUI:Create("EditBox")
editbox:SetLabel("Insert text:")
editbox:SetWidth(200)
frame:AddChild(editbox)

local button = AceGUI:Create("Button")
button:SetText("Click Me!")
button:SetWidth(200)
frame:AddChild(button)
```

::: warning
**Always set a width** for widgets, or they might inherit the width of their previous use in the widget pool, making
your UI look inconsistent. Don't rely on the default values.
:::

Notice the creation of the `Frame` container has changed slightly: every container requires you to set a layout.
AceGUI-3.0 ships with four (`Flow`, `List`, `Fill` and `Table`) described under [Layouts](#layouts) below; `Flow` is
usually the best general-purpose choice.

We also set an `OnClose` callback on the `Frame` widget, which releases the container once it's closed. Releasing AceGUI
frames returns them to the widget pool and allows them to be reused by other addons without creating new frames,
reducing overall memory use. Releasing a container widget always releases its child frames as well, so we don't have to
release them separately.

::: warning
Always release your frames once your UI no longer needs them (e.g. in dynamic lists), or the memory consumption of your
addon will increase a lot.
:::

### Adding Functionality

We have a nice frame with an input box and a button, but it's not doing much yet. Let's make clicking the button print
the contents of the editbox.

```lua
local textStore

local frame = AceGUI:Create("Frame")
frame:SetTitle("Example Frame")
frame:SetStatusText("AceGUI-3.0 Example Container Frame")
frame:SetCallback("OnClose", function(widget) AceGUI:Release(widget) end)
frame:SetLayout("Flow")

local editbox = AceGUI:Create("EditBox")
editbox:SetLabel("Insert text:")
editbox:SetWidth(200)
editbox:SetCallback("OnEnterPressed", function(widget, event, text) textStore = text end)
frame:AddChild(editbox)

local button = AceGUI:Create("Button")
button:SetText("Click Me!")
button:SetWidth(200)
button:SetCallback("OnClick", function() print(textStore) end)
frame:AddChild(button)
```

AceGUI widgets usually do **not** have a "get" function to read their contents; instead they fire a callback that
notifies the addon of any changes to their data. `OnEnterPressed` is the callback of an `EditBox` that notifies us of a
change to the text; we save that text in our `textStore` variable. In the `OnClick` callback of the button we print this
variable.

::: tip
All callbacks in AceGUI-3.0 always receive the widget that issued the callback as the first parameter, and the name of
the callback as the second. Any data provided by the widget follows after that.
:::

### Adding a Group Control

The ability to have different groups of controls on a frame is something most half-complex UIs will need. We'll
demonstrate it with a `TabGroup`.

The concept:

1. Set the frame to the `Fill` layout.
2. Create a `TabGroup` widget and add it as the only child of the frame.
3. Use `:SetTabs` to define which tabs should be displayed.
4. Select the initial tab with `:SelectTab`.
5. Handle the `OnGroupSelected` callback to know when to redraw content: release all old child frames and draw the new
   widgets on the container passed by the event.

```lua
-- function that draws the widgets for the first tab
local function DrawGroup1(container)
    local desc = AceGUI:Create("Label")
    desc:SetText("This is Tab 1")
    desc:SetFullWidth(true)
    container:AddChild(desc)

    local button = AceGUI:Create("Button")
    button:SetText("Tab 1 Button")
    button:SetWidth(200)
    container:AddChild(button)
end

-- function that draws the widgets for the second tab
local function DrawGroup2(container)
    local desc = AceGUI:Create("Label")
    desc:SetText("This is Tab 2")
    desc:SetFullWidth(true)
    container:AddChild(desc)

    local button = AceGUI:Create("Button")
    button:SetText("Tab 2 Button")
    button:SetWidth(200)
    container:AddChild(button)
end

-- Callback function for OnGroupSelected
local function SelectGroup(container, event, group)
    container:ReleaseChildren()
    if group == "tab1" then
        DrawGroup1(container)
    elseif group == "tab2" then
        DrawGroup2(container)
    end
end

-- Create the frame container
local frame = AceGUI:Create("Frame")
frame:SetTitle("Example Frame")
frame:SetStatusText("AceGUI-3.0 Example Container Frame")
frame:SetCallback("OnClose", function(widget) AceGUI:Release(widget) end)
-- Fill Layout - the TabGroup widget will fill the whole frame
frame:SetLayout("Fill")

-- Create the TabGroup
local tab = AceGUI:Create("TabGroup")
tab:SetLayout("Flow")
-- Setup which tabs to show
tab:SetTabs({ { text = "Tab 1", value = "tab1" }, { text = "Tab 2", value = "tab2" } })
-- Register callback
tab:SetCallback("OnGroupSelected", SelectGroup)
-- Set initial Tab (this will fire the OnGroupSelected callback)
tab:SelectTab("tab1")

-- add to the frame container
frame:AddChild(tab)
```

::: tip
More details on the widgets and their callbacks are in the [Widgets](/acegui/widgets/button)
and [Containers](/acegui/containers/tabgroup) sections, and the shared methods on
the [Common Widget API](/acegui/widget-api) page.
:::

## API Reference

````apimethod
name: AceGUI:Create
returns: { type = "table", desc = "The newly created widget." }
params:
  - { name = "type", type = "string", desc = "The widget type to create: one of the registered Widgets or Containers (see below)." }
---
Create a new Widget of the given type.

This function will instantiate a new widget (or use one from the widget pool), and call the [`OnAcquire`](#widget-lifecycle-onacquire-onrelease) function on it, before returning. The widget is given the default `List` layout.

The returned widget supports the [Common Widget API](/acegui/widget-api) (the methods available on *every* widget and container) plus the methods specific to its own type. See the [Widgets](/acegui/widgets/button) and [Containers](/acegui/containers/frame) sections for the valid `type` values and their type-specific methods.

---

```lua
local btn = AceGUI:Create("Button")
```
````

````apimethod
name: AceGUI:Release
params:
  - { name = "widget", type = "table", desc = "The widget to release." }
---
Releases a widget Object.

This function calls [`OnRelease`](#widget-lifecycle-onacquire-onrelease) on the widget and places it back in the widget pool. Any data on the widget is being erased, and the widget will be hidden. If this widget is a Container-Widget, all of its Child-Widgets will be released as well.
````

````apimethod
name: AceGUI:IsReleasing
returns: { type = "boolean", desc = "`true` if the widget or one of its parents is being released, otherwise `false`." }
params:
  - { name = "widget", type = "table", desc = "The widget to check." }
---
Check if a widget is currently in the process of being released.

This function checks if this widget, or any of its parents (in which case it will be released shortly as well), are currently being released. This allows addons to handle any callbacks accordingly.

---

```lua
if not AceGUI:IsReleasing(widget) then
  -- safe to interact with the widget
end
```
````

````apimethod
name: AceGUI:SetFocus
params:
  - { name = "widget", type = "table", desc = "The widget that should be focused." }
---
Called when a widget has taken focus, e.g. Dropdowns opening, EditBoxes gaining keyboard focus. Any previously focused widget has its focus cleared.
````

````apimethod
name: AceGUI:ClearFocus
---
Called when something has happened that could cause widgets with focus to drop it, e.g. the titlebar of a frame being clicked.
````

````apimethod
name: AceGUI:RegisterWidgetType
params:
  - { name = "Name", type = "string", desc = "The name of the widget." }
  - { name = "Constructor", type = "function", desc = "The widget constructor function." }
  - { name = "Version", type = "number", desc = "The version of the widget." }
---
Registers a widget Constructor. The constructor returns a new instance of the widget. If a widget with the same name and an equal or higher version is already registered, the call is ignored.
````

````apimethod
name: AceGUI:RegisterLayout
params:
  - { name = "Name", type = "string", desc = "The name of the layout." }
  - { name = "LayoutFunc", type = "function", desc = "Reference to the layout function." }
---
Registers a Layout Function. String names are stored upper-cased, so layout lookups are case-insensitive.
````

````apimethod
name: AceGUI:GetLayout
returns: { type = "function|nil", desc = "The layout function, or `nil` if it is not registered." }
params:
  - { name = "Name", type = "string", desc = "The name of the layout." }
---
Get a Layout Function from the registry.
````

````apimethod
name: AceGUI:RegisterAsWidget
returns: { type = "table", desc = "The widget." }
params:
  - { name = "widget", type = "table", desc = "The widget class." }
---
Register a widget-class as a widget. Sets up the widget's `userdata`, `events`, and base metatable. Call this once on each widget instance as part of its creation process.
````

````apimethod
name: AceGUI:RegisterAsContainer
returns: { type = "table", desc = "The widget." }
params:
  - { name = "widget", type = "table", desc = "The widget class." }
---
Register a widget-class as a container for newly created widgets. Sets up the container's `children`, `userdata`, `events`, base metatable, and the default `List` layout. Call this once on each container instance as part of its creation process.
````

````apimethod
name: AceGUI:GetNextWidgetNum
returns: { type = "number", desc = "The next number for this widget type." }
params:
  - { name = "type", type = "string", desc = "The widget type." }
---
A type-based counter to count the number of widgets created. The counter is incremented on each call.

This is used by widgets that require a named frame, e.g. when a Blizzard Template requires it.
````

````apimethod
name: AceGUI:GetWidgetCount
returns: { type = "number", desc = "The current count for this widget type." }
params:
  - { name = "type", type = "string", desc = "The widget type." }
---
Return the number of created widgets for this type.

In contrast to [`GetNextWidgetNum`](#getnextwidgetnum), the number is not incremented.
````

````apimethod
name: AceGUI:GetWidgetVersion
returns: { type = "number", desc = "The registered version number." }
params:
  - { name = "type", type = "string", desc = "The widget type." }
---
Return the version of the currently registered widget type.
````

## Layouts

AceGUI-3.0 registers four layouts in the source. A container's layout is set with
[`container:SetLayout("<name>")`](/acegui/widget-api#setlayout); names are case-insensitive.

- **List**: A very simple layout. Children are stacked on top of each other down the left side of the container.
- **Fill**: A single control (the first child) fills the whole content area. Useful for placing one container inside
  another.
- **Flow**: Children fill one row, then flow onto the next row when there isn't enough horizontal space left. This is
  usually the best general-purpose layout.
- **Table**: Arranges children into a grid with configurable columns, spacing, alignment, and colspan/rowspan. Column
  widths can be fixed, relative, content-based, or weight-distributed. Configure it via the container's `table` user
  data (e.g. `container:SetUserData("table", { columns = { 1, 1 }, space = 4 })`).
