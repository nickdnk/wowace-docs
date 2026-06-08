---
description: "AceComm-3.0 sends addon-channel messages of unlimited length, splitting and reassembling them automatically and using ChatThrottleLib to avoid disconnects"
---

# AceComm-3.0

<Embeddable />

AceComm-3.0 allows you to send messages of unlimited length over the addon communication channels.
It automatically splits the messages into multiple parts and rebuilds them on the receiving end.
`ChatThrottleLib` is of course being used to avoid being disconnected by the server.

## Usage

### Sending messages to other clients

Send data with [`:SendCommMessage`](#sendcommmessage): give it a `prefix` tag, the `text` to send (any length; it's
split and reassembled for you), and a `distribution` channel:

```lua
MyAddon:SendCommMessage("MyPrefix", "the data to send", "RAID")
MyAddon:SendCommMessage("MyPrefix", "more data to send", "WHISPER", "charname")
```

::: tip
The valid distributions (`"PARTY"`, `"RAID"`, `"GUILD"`, `"WHISPER"`, …) are defined by the game's
[`C_ChatInfo.SendAddonMessage`](https://warcraft.wiki.gg/wiki/API_C_ChatInfo.SendAddonMessage) API and vary by client
version.
:::

### Receiving messages

Register the prefix you want to listen for. The default handler is `OnCommReceived`:

```lua
MyAddon:RegisterComm("prefix")
MyAddon:RegisterComm("prefix2", "MySecondCommHandler")

function MyAddon:OnCommReceived(prefix, message, distribution, sender)
    -- process the incoming message
end
```

The handler receives `prefix`, `message`, `distribution`, and `sender`.

## API Reference

````apimethod
name: AceComm:Embed
returns: { type = "table", desc = "The target object, now embedded with the AceComm methods." }
params:
  - { name = "target", type = "table", desc = "The object to embed AceComm-3.0 into." }
---
Copies AceComm's methods onto `target` so you can call them on it directly. See [The `:Embed` method](/api/ace-addon#the-embed-method).
````

````apimethod
name: AceComm:RegisterComm
returns: { type = "table", desc = "The registration object returned by [CallbackHandler](/api/callback-handler) (used internally to track the callback)." }
params:
  - { name = "prefix", type = "string", desc = "A printable character (\\032-\\255) classification of the message (typically AddonName or AddonNameEvent), max 16 characters. Registering a prefix longer than 16 characters raises an error." }
  - { name = "method", type = "function|string", default = "\"OnCommReceived\"", desc = "Callback to call on message reception: function reference, or method name to call on self. The callback receives prefix, message, distribution, and sender." }
---
Register for Addon Traffic on a specified prefix. The prefix is also registered with the client's addon-message prefix system (`C_ChatInfo.RegisterAddonMessagePrefix`) so the game will deliver [`CHAT_MSG_ADDON`](https://warcraft.wiki.gg/wiki/CHAT_MSG_ADDON) events for it. Multipart messages are automatically reassembled before the callback fires.

---

```lua
self:RegisterComm("MyPrefix")

function MyAddon:OnCommReceived(prefix, message, distribution, sender)
    -- process the incoming message
end
```
````

````apimethod
name: AceComm:SendCommMessage
params:
  - { name = "prefix", type = "string", desc = "A printable character (\\032-\\255) classification of the message (typically AddonName or AddonNameEvent)." }
  - { name = "text", type = "string", desc = "Data to send, nils (\\000) not allowed. Any length." }
  - { name = "distribution", type = "string", desc = "Addon channel, e.g. \"RAID\", \"GUILD\", etc; see SendAddonMessage API." }
  - { name = "target", type = "string|number", optional = true, desc = "Destination for some distributions (e.g. the recipient name for \"WHISPER\"); see SendAddonMessage API." }
  - { name = "prio", type = "string", default = "\"NORMAL\"", desc = "ChatThrottleLib priority, \"BULK\", \"NORMAL\" or \"ALERT\". The same priority is used for every chunk of a multipart message to guarantee in-order delivery." }
  - { name = "callbackFn", type = "function", optional = true, desc = "Callback function called as each chunk is sent. Receives 3 args: the user-supplied arg (see next), the number of bytes sent so far, and the number of bytes total to send." }
  - { name = "callbackArg", type = "any", optional = true, desc = "First arg to the callback function. Nil will be passed if not specified." }
---
Send a message over the Addon Channel.

Text of any length is supported: messages up to 255 bytes are sent in a single addon message, while longer text is automatically split into chunks (each tagged so the receiving side can reassemble it in order). A leading control character (`\001`-`\009`) in the text is transparently escaped. All sends go through `ChatThrottleLib` using the given priority to avoid being disconnected by the server. `prefix`, `text`, and `distribution` are required; passing arguments of the wrong type (or an invalid `prio`) raises a usage error.
````

````apimethod
name: AceComm:UnregisterComm
params:
  - { name = "prefix", type = "string", desc = "The prefix to stop listening for." }
---
Unregister a comm callback previously registered with [`:RegisterComm`](#registercomm) for the given prefix. This method is generated by CallbackHandler.
````

````apimethod
name: AceComm:UnregisterAllComm
---
Unregister all comm callbacks registered by this addon object (or custom `self`). This method is generated by CallbackHandler and is also called automatically when an embedded AceComm is disabled.
````
