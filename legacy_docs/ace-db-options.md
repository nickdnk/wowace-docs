# AceDBOptions-3.0

AceDBOptions-3.0 provides a universal AceConfig options screen for managing AceDB-3.0 profiles.

## API Reference

### `AceDBOptions:GetOptionsTable(db, noDefaultProfiles)`

Get/Create a option table that you can use in your addon to control the profiles of AceDB-3.0.

**Parameters**

- `db` — The database object to create the options table for.
- `noDefaultProfiles` — if true, the commonly used default profile suggestions ("char - realm", "realm", "class", "Default") are not offered in the profile list

**Returns**

- The options table to be used in AceConfig-3.0

**Usage**

```lua
-- Assuming `options` is your top-level options table and `self.db` is your database:
options.args.profiles = LibStub("AceDBOptions-3.0"):GetOptionsTable(self.db)
```
