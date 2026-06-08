---
description: "Common World of Warcraft addon tasks and how to do them with Ace3: saving settings, options screens, events, timers, hooks, addon messaging, localization and custom UI."
---

# Common Tasks

A quick map from "how do I…" to the Ace3 library that does it. Each entry links to the full reference; start
with [Getting Started](/getting-started) if you are setting up your first addon.

## How do I structure an addon and split it into modules?

Use [AceAddon-3.0](/api/ace-addon). It gives your addon an object with a clean lifecycle
([`OnInitialize`](/api/ace-addon#oninitialize), [`OnEnable`](/api/ace-addon#onenable),
[`OnDisable`](/api/ace-addon#ondisable)) and lets you split features into [modules](/api/ace-addon#newmodule).

## How do I save settings between sessions?

Use [AceDB-3.0](/api/ace-db). It wraps your `SavedVariables` with [scopes](/api/ace-db#scopes) (per-character,
per-realm, account-wide, and more), plus smart [defaults](/api/ace-db#defaults) that are never written to disk.

## How do I let users switch, copy and reset profiles?

Drop in [AceDBOptions-3.0](/api/ace-db-options): [`:GetOptionsTable`](/api/ace-db-options#getoptionstable) returns a
ready-made profile-management group you slot into your options table.

## How do I build an options screen and slash commands?

Describe your options once as an [options table](/api/ace-config-options), then register it
with [AceConfig-3.0](/api/ace-config#registeroptionstable). AceConfig builds both a settings GUI (
via [AceConfigDialog-3.0](/api/ace-config-dialog)) and slash commands (via [AceConfigCmd-3.0](/api/ace-config-cmd)) from
the same table.

## How do I react to a game event?

Use [AceEvent-3.0](/api/ace-event): [`:RegisterEvent`](/api/ace-event#registerevent) calls your handler when the event
fires, and registrations are cleaned up automatically when your addon is disabled.

## How do I handle events that fire in rapid bursts?

Use [AceBucket-3.0](/api/ace-bucket) to collect a burst of events and fire your callback once per interval instead of
once per event.

## How do I run code after a delay or on a repeat?

Use [AceTimer-3.0](/api/ace-timer): [`:ScheduleTimer`](/api/ace-timer#scheduletimer) for one-shot and
[`:ScheduleRepeatingTimer`](/api/ace-timer#schedulerepeatingtimer) for recurring work, both cancellable.

## How do I safely hook a Blizzard function?

Use [AceHook-3.0](/api/ace-hook). It tracks your hooks so they can be cleanly removed, keeping the hook chain intact
when you unhook.

## How do I print to chat or add a simple slash command?

Use [AceConsole-3.0](/api/ace-console): [`:Print`](/api/ace-console#print)/[`:Printf`](/api/ace-console#printf) for
output and [`:RegisterChatCommand`](/api/ace-console#registerchatcommand) for a quick command. For a full options-driven
command, prefer AceConfig above.

## How do I send data to other players running my addon?

Use [AceComm-3.0](/api/ace-comm) to send messages of any length over the addon channels,
and [AceSerializer-3.0](/api/ace-serializer) to turn Lua tables into strings to send (and back again on receipt).

## How do I translate or localize my addon?

Use [AceLocale-3.0](/api/ace-locale): register a base locale and per-language tables, then look up translated strings by
key.

## How do I build a custom window or UI?

Use [AceGUI-3.0](/acegui/), a pooled widget toolkit. Create a [container](/acegui/containers/frame) such as a `Frame`,
add [widgets](/acegui/widgets/button) (buttons, editboxes, sliders, dropdowns, trees, tabs), and release it when done so
the frames return to the pool.

## How do I add tab-completion to a slash command?

Use [AceTab-3.0](/api/ace-tab) to register completions that fire when the user presses Tab in a chat command.
