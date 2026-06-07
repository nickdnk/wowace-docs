---
description: "AceDBOptions-3.0 provides a ready-made AceConfig options screen for managing AceDB-3.0 profiles, including switching, copying, resetting and deleting them"
---

# AceDBOptions-3.0

AceDBOptions-3.0 provides a universal AceConfig options screen for managing [AceDB-3.0](/api/ace-db) profiles.

## Usage

[`:GetOptionsTable`](#getoptionstable) returns a ready-made profile-management group in the standard [AceConfig-3.0 options table](/api/ace-config-options) format. You slot it into your own options table as one sub-group, then register the whole table with [AceConfig-3.0](/api/ace-config) as usual:

```lua
local options = {
    type = "group",
    name = "My Addon",
    args = {
        -- your own options go here...

        -- profile management, handled for you:
        profiles = LibStub("AceDBOptions-3.0"):GetOptionsTable(self.db),
    },
}

LibStub("AceConfig-3.0"):RegisterOptionsTable("MyAddon", options)
```

`self.db` is your AceDB object, so call this once the database exists (e.g. in `OnInitialize`); the only requirement is that the group is in your options table before you register it. The profile list it shows is queried live each time the panel opens, so it always reflects the current profiles. The returned group handles switching, copying, resetting and deleting profiles, so you don't write any of that UI yourself.

::: warning
The generated options table is shared between all addons that use it; do not modify it.
:::

## API Reference

````apimethod
name: AceDBOptions:GetOptionsTable
params:
  - { name = "db", type = "table", desc = "The database object to create the options table for." }
  - { name = "noDefaultProfiles", type = "boolean", optional = true, desc = "If `true`, the commonly used default profile suggestions (\"char - realm\", \"realm\", \"class\", \"Default\") are not offered in the profile list." }
returns: { type = "table", desc = "The options table to be used in AceConfig-3.0." }
---
Get/Create a option table that you can use in your addon to control the profiles of [AceDB-3.0](/api/ace-db).

---

```lua
-- Assuming `options` is your top-level options table and `self.db` is your database:
options.args.profiles = LibStub("AceDBOptions-3.0"):GetOptionsTable(self.db)
```
````
