# AceGUI-3.0 Tutorial

AceGUI-3.0 is a library designed to simplify UI creation. This tutorial focuses on the basics of creating a very simple UI, explaining how the different layouts work, and showing most of the widgets in action.

In all examples and code snippets in this tutorial, we assume you have a local `AceGUI` variable containing the reference to an AceGUI-3.0 instance, as returned by LibStub:

```lua
local AceGUI = LibStub("AceGUI-3.0")
```

## A Container Frame

Every UI starts with a container. You can use your own container frames to place controls in, but for this tutorial we start with a simple AceGUI `Frame` container widget.

Let's create an empty container frame and fill some of its attributes:

```lua
local frame = AceGUI:Create("Frame")
frame:SetTitle("Example Frame")
frame:SetStatusText("AceGUI-3.0 Example Container Frame")
```

You'll see the frame on screen. Every `Frame` widget comes with a heading, a status bar and a close button, as well as some artwork to make it look like a proper frame. This frame can be freely resized by the user using the drag-handle in the bottom-right corner, or by dragging the bottom or right border.

Your code can set a size and position for the frame as well, using the default `SetWidth`, `SetHeight` and `SetPoint` frame functions.

> To learn more about the APIs of the `Frame` widget or containers in general, see the AceGUI-3.0 Widgets — Containers reference.

## Placing Widgets on the Frame

We'll create a simple button and an editbox on our frame. This is as simple as asking AceGUI to create them, and adding them as child frames to the container.

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

> **Always set a width** for widgets, or they might inherit the width of their previous use in the widget pool, making your UI look inconsistent. Don't rely on the default values.

Notice the creation of the `Frame` container has changed slightly: every container requires you to set a layout to use.

### Layouts

AceGUI-3.0 ships with the following layouts:

- **Flow** — Lets widgets fill one row, then flow into the next row when there isn't enough space left. Usually the best layout to use.
- **List** — Stacks all widgets on top of each other on the left side of the container.
- **Fill** — Uses the first widget in the list and fills the whole container with it. Only useful for containers within containers (shown later).
- **Table** — Arranges widgets into a grid with configurable column counts and sizing.

> **Note:** Older documentation states only three layouts (List, Fill, Flow) exist. The current Ace3 source also registers a **Table** layout — verify against the installed version before relying on it.

We also set an `OnClose` callback on the `Frame` widget, which releases the container once it's closed. Releasing AceGUI frames returns them to the widget pool and allows them to be reused by other addons without creating new frames — reducing overall memory use. Releasing a container widget always releases its child frames as well, so we don't have to release them separately.

> Always release your frames once your UI no longer needs them (e.g. in dynamic lists), or the memory consumption of your addon will increase a lot.

## Adding Functionality

We have a nice frame with an input box and a button, but it's not doing much yet. Let's make clicking the button print the contents of the editbox.

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

AceGUI widgets usually do **not** have a "get" function to read their contents — instead they fire a callback that notifies the addon of any changes to their data. `OnEnterPressed` is the callback of an `EditBox` that notifies us of a change to the text; we save that text in our `textStore` variable. In the `OnClick` callback of the button we print this variable.

> All callbacks in AceGUI-3.0 always receive the widget that issued the callback as the first parameter, and the name of the callback as the second. Any data provided by the widget follows after that.

## Adding a Group Control

The ability to have different groups of controls on a frame is something most half-complex UIs will need. We'll demonstrate it with a `TabGroup`.

The concept:

1. Set the frame to the `Fill` layout.
2. Create a `TabGroup` widget and add it as the only child of the frame.
3. Use `:SetTabs` to define which tabs should be displayed.
4. Select the initial tab with `:SelectTab`.
5. Handle the `OnGroupSelected` callback to know when to redraw content — release all old child frames and draw the new widgets on the container passed by the event.

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

> More details on the APIs of the widgets and their available callbacks can be found on the AceGUI-3.0 Widgets page.
