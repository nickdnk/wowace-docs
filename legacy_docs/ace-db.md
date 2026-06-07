# AceDB-3.0

AceDB-3.0 manages the SavedVariables of your addon. It offers profile management, smart defaults and namespaces for modules.

Data can be saved in different data-types, depending on its intended usage. The most common data-type is the `profile` type, which allows the user to choose the active profile, and manage the profiles of all of his characters. The following data types are available:

- `char` — Character-specific data. Every character has its own database.
- `realm` — Realm-specific data. All of the players characters on the same realm share this database.
- `class` — Class-specific data. All of the players characters of the same class share this database.
- `race` — Race-specific data. All of the players characters of the same race share this database.
- `faction` — Faction-specific data. All of the players characters of the same faction share this database.
- `factionrealm` — Faction and realm specific data. All of the players characters on the same realm and of the same faction share this database.
- `locale` — Locale specific data, based on the locale of the players game client.
- `global` — Global Data. All characters on the same account share this database.
- `profile` — Profile-specific data. All characters using the same profile share this database. The user can control which profile should be used.

Creating a new Database using the `:New` function will return a new DBObject. A database will inherit all functions of the DBObjectLib listed here.

If you create a new namespaced child-database (`:RegisterNamespace`), you'll get a DBObject as well, but note that the child-databases cannot individually change their profile, and are linked to their parents profile - and because of that, the profile related APIs are not available. Only `:RegisterDefaults` and `:ResetProfile` are available on child-databases.

For more details on how to use AceDB-3.0, see the AceDB-3.0 Tutorial.

You may also be interested in LibDualSpec-1.0 to do profile switching automatically when switching specs.

## Example

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("DBExample")

-- declare defaults to be used in the DB
local defaults = {
    profile = {
        setting = true,
    }
}

function MyAddon:OnInitialize()
    -- Assuming the .toc says ## SavedVariables: MyAddonDB
    self.db = LibStub("AceDB-3.0"):New("MyAddonDB", defaults, true)
end
```

## API Reference

### `AceDB:New(tbl, defaults, defaultProfile)`

Creates a new database object that can be used to handle database settings and profiles.

By default, an empty DB is created, using a character specific profile.

You can override the default profile used by passing any profile name as the third argument, or by passing `true` as the third argument to use a globally shared profile called "Default".

Note that there is no token replacement in the default profile name, passing a defaultProfile as "char" will use a profile named "char", and not a character-specific profile.

**Parameters**

- `tbl` — The name of variable, or table to use for the database
- `defaults` — A table of database defaults
- `defaultProfile` — The name of the default profile. If not set, a character specific profile will be used as the default. You can also pass `true` to use a shared global profile called "Default".

**Usage**

```lua
-- Create an empty DB using a character-specific default profile.
self.db = LibStub("AceDB-3.0"):New("MyAddonDB")
-- Create a DB using defaults and using a shared default profile
self.db = LibStub("AceDB-3.0"):New("MyAddonDB", defaults, true)
```

### `DBObjectLib:CopyProfile(name, silent)`

Copies a named profile into the current profile, overwriting any conflicting settings.

**Parameters**

- `name` — The name of the profile to be copied into the current profile
- `silent` — If true, do not raise an error when the profile does not exist

### `DBObjectLib:DeleteProfile(name, silent)`

Deletes a named profile.

This profile must not be the active profile.

**Parameters**

- `name` — The name of the profile to be deleted
- `silent` — If true, do not raise an error when the profile does not exist

### `DBObjectLib:GetCurrentProfile()`

Returns the current profile name used by the database.

### `DBObjectLib:GetNamespace(name, silent)`

Returns an already existing namespace from the database object.

**Parameters**

- `name` — The name of the new namespace
- `silent` — if true, the addon is optional, silently return nil if its not found

**Returns**

- the namespace object if found

**Usage**

```lua
local namespace = self.db:GetNamespace('namespace')
```

### `DBObjectLib:GetProfiles(tbl)`

Returns a table with the names of the existing profiles in the database.

You can optionally supply a table to re-use for this purpose.

**Parameters**

- `tbl` — A table to store the profile names in (optional)

### `DBObjectLib:RegisterDefaults(defaults)`

Sets the defaults table for the given database object by clearing any that are currently set, and then setting the new defaults.

**Parameters**

- `defaults` — A table of defaults for this database

### `DBObjectLib:RegisterNamespace(name, defaults)`

Creates a new database namespace, directly tied to the database.

This is a full scale database in it's own rights other than the fact that it cannot control its profile individually.

**Parameters**

- `name` — The name of the new namespace
- `defaults` — A table of values to use as defaults

### `DBObjectLib:ResetDB(defaultProfile)`

Resets the entire database, using the string defaultProfile as the new default profile.

**Parameters**

- `defaultProfile` — The profile name to use as the default

### `DBObjectLib:ResetProfile(noChildren, noCallbacks)`

Resets the current profile to the default values (if specified).

**Parameters**

- `noChildren` — if set to true, the reset will not be populated to the child namespaces of this DB object
- `noCallbacks` — if set to true, won't fire the OnProfileReset callback

### `DBObjectLib:SetProfile(name)`

Changes the profile of the database and all of it's namespaces to the supplied named profile.

**Parameters**

- `name` — The name of the profile to set as the current profile
