---
description: "Build your first World of Warcraft addon on Ace3: set up the folder and .toc, create an addon object, and learn which library handles each task"
---

# Getting Started

New to World of Warcraft addons? You're in the right place. This guide takes you from an empty folder to a working addon
built on **Ace3**, and explains the pieces as it goes.

## What is Ace3, and why use it?

Ace3 is the most widely used **addon framework** for World of Warcraft: a set of small, focused libraries that handle
the repetitive parts of addon development so you can focus on what your addon does. It isn't one monolithic library; you
**embed only the pieces you need** and ignore the rest. What that buys you:

- **Less boilerplate**: a clean addon lifecycle (`OnInitialize` / `OnEnable` / `OnDisable`) instead of hand-wiring
  [`ADDON_LOADED`](https://warcraft.wiki.gg/wiki/ADDON_LOADED).
- **Settings that just work**: [AceDB-3.0](/api/ace-db) stores `SavedVariables` with per-character profiles and smart
  defaults.
- **Configuration for free**: describe your options once and [AceConfig-3.0](/api/ace-config) builds both a settings GUI
  *and* slash commands from it.
- **Event handling**: [AceEvent-3.0](/api/ace-event) registers and dispatches game events and inter-addon messages, with
  throttling for bursty events via [AceBucket-3.0](/api/ace-bucket).
- **Leak-free custom UI**: [AceGUI-3.0](/acegui/) builds windows from a pool of recycled widgets, so rebuilding your
  interface never leaks frames for the session.
- **Addon communication**: [AceComm-3.0](/api/ace-comm) sends messages of any length to other copies of your addon
  across the group or guild.
- **…and more**: timers ([AceTimer-3.0](/api/ace-timer)), data serialization ([AceSerializer-3.0](/api/ace-serializer)),
  localization ([AceLocale-3.0](/api/ace-locale)), safe function hooks ([AceHook-3.0](/api/ace-hook)) and other
  utilities.

The rest of this page walks through setting up an addon and points you at the library for each task.

## Download

Get the latest Ace3 release:

<a class="download-btn" href="https://www.wowace.com/projects/ace3/files/latest">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  Download Ace3
</a>

Ace3 is a bundle of libraries you **embed inside your own addon**; there's no separate install for players. Unzip the
libraries you need into a `Libs/` subdirectory of your addon folder and reference them from your `.toc` or
`embeds.xml` (see [load order](#basic-addon-file-setup) below). You only need to ship the libraries you actually use.

## Basic Addon File Setup

Create a folder for your addon in `<WoW Directory>\Interface\AddOns`. The name must be unique; pick something
descriptive. Inside it you'll create a few text files.

### The `.toc` file

Name it the same as the folder, with `.toc` appended (e.g. `MyAddon/MyAddon.toc`). Lines beginning with `##` are
metadata; the rest is the list of files to load. The key field is `## Interface`, which declares the game build(s) your
addon supports:

```toc
## Interface: 11508, 20505
## Title: My Addon's Title
## Notes: Some notes about this addon.
## Author: Your Name Here
## Version: 0.1
## SavedVariables: MyAddonDB
```

::: tip Interface numbers & supporting multiple versions
Each interface number identifies a game version, and it increases as the game is patched. `## Interface` accepts a *
*comma-separated list**, so one `.toc` can support several client flavors at once. The example targets two:

- **`11508`**: Classic Era, patch 1.15.8
- **`20505`**: Burning Crusade Classic (Anniversary), patch 2.5.5

Add the current retail number too (`120005` at the time of writing) to cover retail in the same file:

```toc
## Interface: 11508, 20505, 120005
```

Each listed client loads the addon and reports its own number; read it at runtime from
[`GetBuildInfo`](https://warcraft.wiki.gg/wiki/API_GetBuildInfo) (the `interfaceVersion` return, the 4th value, not the
build number).

The alternative to a CSV list is shipping a **separate TOC per flavor**, named with a suffix WoW recognizes:

- `MyAddon_Mainline.toc`: retail
- `MyAddon_Vanilla.toc`: Classic Era
- `MyAddon_TBC.toc`: Burning Crusade Classic
- `MyAddon_Wrath.toc`: Wrath Classic
- `MyAddon_Cata.toc`: Cataclysm Classic
- `MyAddon_Mists.toc`: Mists of Pandaria Classic

`_Mainline`/`_Classic` are lower priority than expansion-specific suffixes, so a `_Cata.toc` wins over `_Classic.toc` on
a Cataclysm Classic client. The CSV approach keeps everything in one file.

For the complete list of fields and flavor suffixes, see
the [TOC format reference](https://warcraft.wiki.gg/wiki/TOC_format).
:::

### Loading the libraries

After the metadata, the `.toc` lists the files to load, top to bottom. There are **two equivalent ways** to pull in the
Ace3 libraries; pick one. With the **direct** approach the library files are listed in the `.toc` itself; with the
**embeds.xml** approach that list moves to a separate file (the `embeds.xml` tab below), keeping your own code visually
separate. Either way, `LibStub` loads first.

::: code-group

```toc [MyAddon.toc (direct)]
## Interface: 11508, 20505
## Title: My Addon's Title
## SavedVariables: MyAddonDB

# load each library (LibStub first), then your own code
Libs\LibStub\LibStub.lua
Libs\CallbackHandler-1.0\CallbackHandler-1.0.xml
Libs\AceAddon-3.0\AceAddon-3.0.xml
Core.lua
```

```toc [MyAddon.toc (with embeds.xml)]
## Interface: 11508, 20505
## Title: My Addon's Title
## SavedVariables: MyAddonDB

embeds.xml
Core.lua
```

```xml [embeds.xml]

<Ui xmlns="http://www.blizzard.com/wow/ui/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.blizzard.com/wow/ui/ ..\FrameXML\UI.xsd">
    <Script file="Libs\LibStub\LibStub.lua"/>
    <Include file="Libs\CallbackHandler-1.0\CallbackHandler-1.0.xml"/>
    <Include file="Libs\AceAddon-3.0\AceAddon-3.0.xml"/>
</Ui>
```

:::

The **embeds.xml** tab pairs with the **with embeds.xml** `.toc`: that `.toc` loads `embeds.xml`, which in turn
`Include`s each library. Whichever approach you choose, libraries must load **before** the code that uses them:

::: warning Load order matters
WoW loads the files **in the exact order they are listed** in the `.toc` (and `embeds.xml`), top to bottom. A file can
only use code that was already loaded above it, so order dependencies correctly:

1. **`LibStub`** first: the shared version stub every Ace library registers with, and that you call as
   `LibStub("AceX-3.0")` to fetch one.
2. **Libraries** next, before any of your code that calls `LibStub(...)` for them.
3. **Locale files** ([AceLocale](/api/ace-locale)) before the code that reads the translations.
4. **Your main code** (e.g. `Core.lua`) last, once its dependencies exist.

Getting this wrong gives `nil`/"attempt to index" errors at load because a library or value isn't available yet.
:::

### Your code files

`Core.lua` is just a conventional name. **WoW doesn't require any particular file name.** Name your `.lua` files
whatever you like and split your code across as many as you want; all that matters is that each file is listed in the
`.toc` (or an `embeds.xml`) and appears in the correct [load order](#basic-addon-file-setup) relative to the things it
depends on.

A common starting point is a single main file (named `Core.lua`, or after the addon)
using [AceAddon-3.0](/api/ace-addon), which gives your addon an object with an `OnInitialize`/`OnEnable`/`OnDisable`
lifecycle to hang the rest of your code on.

## A complete example

Here is a tiny but complete addon, **MyAddon**, that uses [AceAddon-3.0](/api/ace-addon) for its
lifecycle, [AceConsole-3.0](/api/ace-console) for output and a slash command, [AceEvent-3.0](/api/ace-event) to react to
a game event, [AceDB-3.0](/api/ace-db) to save settings, and [AceGUI-3.0](/acegui/) to open a small window. The folder
looks like this:

```
MyAddon/
├── MyAddon.toc
├── embeds.xml
├── Core.lua
└── Libs/
    ├── LibStub/
    ├── CallbackHandler-1.0/
    ├── AceAddon-3.0/
    ├── AceConsole-3.0/
    ├── AceEvent-3.0/
    ├── AceDB-3.0/
    └── AceGUI-3.0/
```

::: code-group

```toc [MyAddon.toc]
## Interface: 11508, 20505
## Title: MyAddon
## Notes: A tiny example addon built on Ace3.
## Author: Your Name
## Version: 1.0
## SavedVariables: MyAddonDB

embeds.xml
Core.lua
```

```xml [embeds.xml]

<Ui xmlns="http://www.blizzard.com/wow/ui/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.blizzard.com/wow/ui/ ..\FrameXML\UI.xsd">
    <Script file="Libs\LibStub\LibStub.lua"/>
    <Include file="Libs\CallbackHandler-1.0\CallbackHandler-1.0.xml"/>
    <Include file="Libs\AceAddon-3.0\AceAddon-3.0.xml"/>
    <Include file="Libs\AceConsole-3.0\AceConsole-3.0.xml"/>
    <Include file="Libs\AceEvent-3.0\AceEvent-3.0.xml"/>
    <Include file="Libs\AceDB-3.0\AceDB-3.0.xml"/>
    <Include file="Libs\AceGUI-3.0\AceGUI-3.0.xml"/>
</Ui>
```

```lua [Core.lua]
-- Create the addon object, mixing in AceConsole and AceEvent so their
-- methods are available directly on MyAddon (called via self).
local MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceConsole-3.0", "AceEvent-3.0")

-- AceGUI isn't embeddable; fetch it directly when you need it.
local AceGUI = LibStub("AceGUI-3.0")

-- Default settings. AceDB serves these until the user changes a value, and
-- never writes them to disk, so SavedVariables stays small.
local defaults = {
    profile = {
        greeting = "Hello from the button!",
        timesOpened = 0,
    },
}

-- Runs once, after this addon's SavedVariables have loaded.
function MyAddon:OnInitialize()
    -- AceDB isn't embeddable; create the database here, matching the
    -- "## SavedVariables: MyAddonDB" line in the TOC.
    self.db = LibStub("AceDB-3.0"):New("MyAddonDB", defaults)
    self:RegisterChatCommand("myaddon", "OpenWindow")   -- /myaddon
    self:Print("loaded. Type /myaddon to open the window.")
end

-- Runs when the addon is enabled (first during PLAYER_LOGIN).
function MyAddon:OnEnable()
    self:RegisterEvent("PLAYER_ENTERING_WORLD", "OnEnteringWorld")
end

-- Handlers receive the event name first, then the event's own arguments.
function MyAddon:OnEnteringWorld(event, isInitialLogin, isReloadingUi)
    if isInitialLogin then
        self:Print("Welcome!")
    end
end

-- Slash-command handler: build and show a small AceGUI window.
function MyAddon:OpenWindow()
    -- self.db.profile is the active profile's saved settings; this count
    -- persists across reloads and sessions.
    self.db.profile.timesOpened = self.db.profile.timesOpened + 1

    local frame = AceGUI:Create("Frame")
    frame:SetTitle("MyAddon")
    frame:SetStatusText(("Opened %d time(s)"):format(self.db.profile.timesOpened))
    frame:SetLayout("Flow")
    -- release the widget back to the pool when the window is closed
    frame:SetCallback("OnClose", function(widget) AceGUI:Release(widget) end)

    local button = AceGUI:Create("Button")
    button:SetText("Say hi")
    button:SetWidth(140)
    button:SetCallback("OnClick", function()
        -- read a saved value back out
        MyAddon:Print(MyAddon.db.profile.greeting)
    end)
    frame:AddChild(button)
end
```

:::

Drop this into `<WoW>\Interface\AddOns\MyAddon\` (with the libraries unzipped into `Libs/`), reload, and `/myaddon`
opens the window.

## The Ace3 libraries

Each library is independent; embed only what you need. Every page has a **Usage** guide (purpose + examples) followed by
its full API reference.

**Addon Structure**

- [AceAddon-3.0](/api/ace-addon): addon object with `OnInitialize`/`OnEnable`/`OnDisable` lifecycle and modules.
- [AceConsole-3.0](/api/ace-console): chat output and slash commands.
- [AceEvent-3.0](/api/ace-event): register for game events and inter-addon messages.
- [AceBucket-3.0](/api/ace-bucket): throttle bursts of events into a single callback.
- [AceHook-3.0](/api/ace-hook): safely hook functions and frame scripts.
- [AceTimer-3.0](/api/ace-timer): one-shot and repeating timers.

**Persisting Data**

- [AceDB-3.0](/api/ace-db): `SavedVariables` with profiles, smart defaults and namespaces.
- [AceDBOptions-3.0](/api/ace-db-options): a ready-made profile-management options table.

**Configuration**

- [AceConfig-3.0](/api/ace-config): turn a single options table into a GUI and slash commands.
- [AceConfigCmd-3.0](/api/ace-config-cmd): command-line access to an options table.
- [AceConfigDialog-3.0](/api/ace-config-dialog): AceGUI dialog windows generated from an options table.
- [AceConfigRegistry-3.0](/api/ace-config-registry): central options-table registry and change notifications.
- [Options Tables](/api/ace-config-options): the options-table format reference.

**Communication & Data**

- [AceComm-3.0](/api/ace-comm): send addon messages of any length between clients.
- [AceSerializer-3.0](/api/ace-serializer): encode values to a string for transport or storage.
- [AceLocale-3.0](/api/ace-locale): localization with fallback to a base locale.
- [AceTab-3.0](/api/ace-tab): tab-completion for chat input.
- [CallbackHandler-1.0](/api/callback-handler): the callback/message dispatch engine the other libraries build on.

**Design & Presentation**

- [AceGUI-3.0](/acegui/): a pooled widget toolkit for building custom GUIs.
