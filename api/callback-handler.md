---
description: "CallbackHandler-1.0 is the dispatch engine powering callbacks and messages across the Ace3 suite: registering handlers and firing events into a registry"
---

# CallbackHandler-1.0

CallbackHandler-1.0 is the small dispatch engine that powers the "callback" and "message" systems across the Ace
suite: [AceEvent-3.0](/api/ace-event), [AceComm-3.0](/api/ace-comm), [AceBucket-3.0](/api/ace-bucket),
[AceDB-3.0](/api/ace-db#callbacks)'s profile callbacks, and [AceConfigRegistry-3.0](/api/ace-config-registry) all build
on it. You rarely call it directly, but understanding it explains how those callbacks behave.

It has two sides: **addon authors** register handlers on a library that exposes CallbackHandler methods, and **library
authors** create a registry to fire events into.

## For addon authors

When a library is "powered by CallbackHandler", it exposes registration methods, by convention
[`RegisterCallback`](#registercallback), [`UnregisterCallback`](#unregistercallback), and
[`UnregisterAllCallbacks`](#unregisterallcallbacks). These are **called with a dot** and an explicit first argument
(your object, or a string addon id) that identifies you as the owner of the registration:

```lua
-- e.g. AceDB exposes these on the db object
self.db.RegisterCallback(self, "OnProfileChanged", "RefreshConfig")

function MyAddon:RefreshConfig(event, ...)
    -- event == "OnProfileChanged", followed by any args the library fired
end
```

::: tip Why the dot, and the explicit `self`
[`RegisterCallback`](#registercallback) is not called with `:`; you pass your `self` (or an `"addonId"` string)
explicitly as the first argument. CallbackHandler uses it both as the `self` for method-style handlers and as the key to
unregister you later. Calling it as `lib:RegisterCallback(...)` (passing the library as `self`) is an error.
:::

How your handler is invoked:

- **`method` as a string** → called as `self[method](self, event, ...)`.
- **`method` as a function** → called as `method(event, ...)`.
- If you supplied an **`arg`**, it is inserted *before* the event name: `self[method](self, arg, event, ...)` /
  `method(arg, event, ...)`.

The first value your handler receives is always the **event name** (handy for sharing one handler across several
events); the firing library's own arguments follow.

````apimethod
name: obj.RegisterCallback
params:
  - { name = "self", type = "table|string", desc = "Your object (used as the handler's `self` and as the unregister key), or an `\"addonId\"` string when registering a plain function." }
  - { name = "eventname", type = "string", desc = "The event/message to listen for." }
  - { name = "method", type = "string|function", optional = true, desc = "A method name on `self`, or a function reference. Defaults to `eventname` (i.e. a method named after the event)." }
  - { name = "arg", type = "any", optional = true, desc = "Optional value passed to the handler *before* the event name." }
---
Register a handler for an event on a CallbackHandler-powered object. Called with a dot and an explicit `self`/addon id (see above).
````

````apimethod
name: obj.UnregisterCallback
params:
  - { name = "self", type = "table|string", desc = "The same object/addon id used to register." }
  - { name = "eventname", type = "string", desc = "The event to stop listening for." }
---
Remove a previously registered handler for `eventname`.
````

````apimethod
name: obj.UnregisterAllCallbacks
params:
  - { name = "self", type = "table|string", desc = "The object/addon id whose registrations should all be removed." }
---
Remove every callback registered by the given owner. A library may choose not to publish this method.
````

## For library authors

Embed the registration API into your library and get back a **registry** to fire events through.

````apimethod
name: CallbackHandler:New
returns: { type = "table", desc = "The registry object (with [`:Fire`](#fire), and optional `OnUsed`/`OnUnused` hooks you can set)." }
params:
  - { name = "target", type = "table", desc = "The object to embed the public registration methods into." }
  - { name = "RegisterName", type = "string", default = "RegisterCallback", desc = "Name of the register method to publish." }
  - { name = "UnregisterName", type = "string", default = "UnregisterCallback", desc = "Name of the unregister method to publish." }
  - { name = "UnregisterAllName", type = "string|boolean", default = "UnregisterAllCallbacks", desc = "Name of the unregister-all method, or `false` to not publish it." }
---
Create a callback registry and embed `RegisterName`/`UnregisterName`/`UnregisterAllName` onto `target`.

---

```lua
local CallbackHandler = LibStub("CallbackHandler-1.0")

local MyLib = {}
MyLib.callbacks = CallbackHandler:New(MyLib)
-- MyLib.RegisterCallback / UnregisterCallback / UnregisterAllCallbacks now exist
```
````

````apimethod
name: registry:Fire
params:
  - { name = "eventname", type = "string", desc = "The event/message to dispatch." }
  - { name = "...", type = "any", desc = "Arguments forwarded to every registered handler (after the event name)." }
---
Fire an event into the registry, invoking every handler registered for `eventname`.

Registering or unregistering from *inside* a handler is safe: CallbackHandler queues the change and applies it once the current dispatch finishes.

---

```lua
function MyLib:DoThing()
    self.callbacks:Fire("OnThingDone", "some", "data")
end
-- a listener's handler receives: (event, "some", "data")
```
````

### Lazy activation hooks

The registry exposes two optional hooks you can assign. They let a library do expensive setup only while something is
actually listening; this is how AceEvent only registers a game event with the client while at least one handler wants
it:

- **`registry.OnUsed(registry, target, eventname)`**: called when `eventname` gets its **first** handler.
- **`registry.OnUnused(registry, target, eventname)`**: called when `eventname` loses its **last** handler.

```lua
function MyLib.callbacks:OnUsed(target, eventname)
    -- start producing eventname (e.g. hook a frame, register a game event)
end
function MyLib.callbacks:OnUnused(target, eventname)
    -- stop producing eventname
end
```
