---
description: "Register for and respond to game events and inter-addon messages with AceEvent-3.0, the event-handling mixin for Ace3 addons built on CallbackHandler-1.0"
---

# AceEvent-3.0

<Embeddable />

AceEvent-3.0 provides event registration and secure dispatching. All dispatching is done using [CallbackHandler-1.0](/api/callback-handler). AceEvent is a simple wrapper around CallbackHandler, and dispatches all game events or addon message to the registrees.

## Usage

### Subscribing to events

```lua
MyAddon:RegisterEvent("NAME_OF_EVENT")

function MyAddon:NAME_OF_EVENT()
    -- process the event
end
```

Specify a handler method/function instead of the default name:

```lua
MyAddon:RegisterEvent("NAME_OF_EVENT", "MyHandlerMethod")
MyAddon:RegisterEvent("NAME_OF_OTHER_EVENT", function() doSomethingSpiffy() end)
```

The first argument to a handler is always the event name, then the event's own arguments:

```lua
function MyAddon:NAME_OF_EVENT(eventName, arg1, arg2, arg3)
    -- ...
end
```

### Inter-addon messages

Messages work like events but are fired by addons rather than the client:

```lua
MyAddon:RegisterMessage("NAME_OF_MESSAGE")
MyAddon:SendMessage("NAME_OF_MESSAGE")
MyAddon:SendMessage("NAME_OF_OTHER_MESSAGE", arg1, arg2)
```

Messages are local to the client. To talk between players' addons, use [AceComm](/api/ace-comm).

## API Reference

````apimethod
name: AceEvent:Embed
kind: method
params:
  - { name = "target", type = "table", desc = "Target object to embed AceEvent in." }
returns: { type = "table", desc = "The `target` object that was embedded." }
---
Copies AceEvent's methods onto `target` so you can call them on it directly. See [The `:Embed` method](/api/ace-addon#the-embed-method).
````

````apimethod
name: AceEvent:RegisterEvent
kind: method
params:
  - { name = "event", type = "string", desc = "The event to register for." }
  - { name = "callback", type = "funcref|methodname", optional = true, desc = "The callback function to call when the event is triggered (defaults to a method with the event name)." }
  - { name = "arg", type = "any", optional = true, desc = "An optional argument to pass to the callback function." }
---
Register for a Blizzard [Event](https://warcraft.wiki.gg/wiki/Events).

The callback will be called with the optional `arg` as the first argument (if supplied), and the event name as the second (or first, if no arg was supplied). Any arguments to the event will be passed on after that.

---

```lua
function MyAddon:OnEnable()
    self:RegisterEvent("BAG_UPDATE", "UpdateBags")
end

function MyAddon:UpdateBags(event, bagID)
    -- ...
end
```
````

````apimethod
name: AceEvent:RegisterMessage
kind: method
params:
  - { name = "message", type = "string", desc = "The message to register for." }
  - { name = "callback", type = "funcref|methodname", optional = true, desc = "The callback function to call when the message is triggered (defaults to a method with the event name)." }
  - { name = "arg", type = "any", optional = true, desc = "An optional argument to pass to the callback function." }
---
Register for a custom AceEvent-internal message.

The callback will be called with the optional `arg` as the first argument (if supplied), and the event name as the second (or first, if no arg was supplied). Any arguments to the event will be passed on after that.
````

````apimethod
name: AceEvent:SendMessage
kind: method
params:
  - { name = "message", type = "string", desc = "The message to send." }
  - { name = "...", type = "any", desc = "Any arguments to the message." }
---
Send a message over the AceEvent-3.0 internal message system to other addons registered for this message.

---

```lua
function MyAddon:SetFontSize(size)
    self:SendMessage("MyAddon_ConfigChanged", "fontSize", size)
end
```
````

````apimethod
name: AceEvent:UnregisterEvent
kind: method
params:
  - { name = "event", type = "string", desc = "The event to unregister." }
---
Unregister an event.
````

````apimethod
name: AceEvent:UnregisterMessage
kind: method
params:
  - { name = "message", type = "string", desc = "The message to unregister." }
---
Unregister a message.
````

````apimethod
name: AceEvent:UnregisterAllEvents
kind: method
---
Unregister all events registered by this addon object (or custom "self").

---

```lua
function MyAddon:OnDisable()
    self:UnregisterAllEvents()
end
```
````

````apimethod
name: AceEvent:UnregisterAllMessages
kind: method
---
Unregister all messages registered by this addon object (or custom "self").

---

```lua
function MyAddon:OnDisable()
    self:UnregisterAllMessages()
end
```
````
