---
description: "AceSerializer-3.0 serializes Lua values into a string for sending over the addon communication channel, preserving large numbers and table structures"
---

# AceSerializer-3.0

<Embeddable />

AceSerializer-3.0 can serialize any variable (except functions or userdata) into a string format that can be sent over the addon communication channel.

AceSerializer was designed to keep all data intact, especially very large numbers or floating point numbers, and table structures. The only caveat currently is, that multiple references to the same table will be send individually.

## Usage

Mix it in when creating your addon object:

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceSerializer-3.0")
```

Serialize any values into a string:

```lua
local MyVal1 = 23
local MyVal2 = "some text"
local MyVal3 = { "foo", 42, "bar" }

local serializedData = MyAddon:Serialize(MyVal1, MyVal2, MyVal3)
```

Deserialize. The first return is a success boolean; on success the original values follow, on failure an error message:

```lua
local success, v1, v2, v3 = MyAddon:Deserialize(serializedData)
if not success then
    -- handle error (v1 is the error message)
end
```

Combine with [AceComm-3.0](/api/ace-comm) to send structured data between clients.

## API Reference

````apimethod
name: AceSerializer:Embed
params:
  - { name = "target", type = "table", desc = "The target object to embed AceSerializer into." }
returns: { type = "table", desc = "The target object." }
---
Copies AceSerializer's methods onto `target` so you can call them on it directly. See [The `:Embed` method](/api/ace-addon#the-embed-method).
````

````apimethod
name: AceSerializer:Serialize
params:
  - { name = "...", type = "any", desc = "List of values to serialize (strings, numbers, booleans, `nil`s, tables)." }
returns: { type = "string", desc = "The data in its serialized form." }
---
Serialize the data passed into the function.

Takes a list of values (strings, numbers, booleans, `nil`s, tables) and returns it in serialized form (a string). May throw errors on invalid data types.
````

````apimethod
name: AceSerializer:Deserialize
params:
  - { name = "str", type = "string", desc = "The serialized data (from [`:Serialize`](#serialize))." }
returns:
  - { name = "success", type = "boolean", desc = "`true` on success, `false` on failure." }
  - { name = "...", type = "any", desc = "On success, the deserialized list of values; on failure, the error message (string)." }
---
Deserializes the data into its original values.

Accepts serialized data, ignoring all control characters and whitespace.

---

```lua
local ok, value = self:Deserialize(payload)
if ok then
    -- use value
end
```
````
