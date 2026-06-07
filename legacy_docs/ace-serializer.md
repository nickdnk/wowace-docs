# AceSerializer-3.0

AceSerializer-3.0 can serialize any variable (except functions or userdata) into a string format, that can be send over the addon comm channel.

AceSerializer was designed to keep all data intact, especially very large numbers or floating point numbers, and table structures. The only caveat currently is, that multiple references to the same table will be send individually.

AceSerializer-3.0 can be embeded into your addon, either explicitly by calling `AceSerializer:Embed(MyAddon)` or by specifying it as an embeded library in your AceAddon. All functions will be available on your addon object and can be accessed directly, without having to explicitly call AceSerializer itself.

It is recommended to embed AceSerializer, otherwise you'll have to specify a custom `self` on all calls you make into AceSerializer.

## API Reference

### `AceSerializer:Deserialize(str)`

Deserializes the data into its original values.

Accepts serialized data, ignoring all control characters and whitespace.

**Parameters**

- `str` — The serialized data (from `:Serialize`)

**Returns**

- `true` followed by a list of values, OR `false` followed by an error message

### `AceSerializer:Serialize(...)`

Serialize the data passed into the function.

Takes a list of values (strings, numbers, booleans, nils, tables) and returns it in serialized form (a string). May throw errors on invalid data types.

**Parameters**

- `...` — List of values to serialize

**Returns**

- The data in its serialized form (string)
