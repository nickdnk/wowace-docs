# AceComm-3.0

AceComm-3.0 allows you to send messages of unlimited length over the addon comm channels.
It'll automatically split the messages into multiple parts and rebuild them on the receiving end.
ChatThrottleLib is of course being used to avoid being disconnected by the server.

AceComm-3.0 can be embeded into your addon, either explicitly by calling AceComm:Embed(MyAddon) or by specifying it as an embeded library in your AceAddon. All functions will be available on your addon object and can be accessed directly, without having to explicitly call AceComm itself.
It is recommended to embed AceComm, otherwise you'll have to specify a custom `self` on all calls you make into AceComm.

## API Reference

### `AceComm:RegisterComm(prefix, method)`

Register for Addon Traffic on a specified prefix

**Parameters**

- `prefix` — A printable character (\032-\255) classification of the message (typically AddonName or AddonNameEvent), max 16 characters
- `method` — Callback to call on message reception: Function reference, or method name (string) to call on self. Defaults to "OnCommReceived"

### `AceComm:SendCommMessage(prefix, text, distribution, target, prio, callbackFn, callbackArg)`

Send a message over the Addon Channel

**Parameters**

- `prefix` — A printable character (\032-\255) classification of the message (typically AddonName or AddonNameEvent)
- `text` — Data to send, nils (\000) not allowed. Any length.
- `distribution` — Addon channel, e.g. "RAID", "GUILD", etc; see SendAddonMessage API
- `target` — Destination for some distributions; see SendAddonMessage API
- `prio` — OPTIONAL: ChatThrottleLib priority, "BULK", "NORMAL" or "ALERT". Defaults to "NORMAL".
- `callbackFn` — OPTIONAL: callback function to be called as each chunk is sent. receives 3 args: the user supplied arg (see next), the number of bytes sent so far, and the number of bytes total to send.
- `callbackArg` — OPTIONAL: first arg to the callback function. nil will be passed if not specified.
