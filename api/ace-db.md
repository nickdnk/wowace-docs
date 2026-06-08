---
description: "AceDB-3.0 manages your addon's SavedVariables with profiles, smart defaults, module namespaces and per-character, realm, class and global data scopes"
---

# AceDB-3.0

AceDB-3.0 manages the `SavedVariables` of your addon. It offers profile management, smart defaults and namespaces for modules.

Creating a new Database using the [`:New`](#new) function will return a new `DBObject`. A database will inherit all functions of the `DBObjectLib` listed here.

If you create a new namespaced child-database ([`:RegisterNamespace`](#registernamespace)), you'll get a `DBObject` as well, but note that the child-databases cannot individually change their profile, and are linked to their parents profile - and because of that, the profile related APIs are not available. Only [`:RegisterDefaults`](#registerdefaults) and [`:ResetProfile`](#resetprofile) are available on child-databases.

## Tutorial

This walk-through covers the core concepts (profiles, smart defaults and namespaces) with examples. For exact method signatures and parameters, follow the links into the [API reference](#api-reference) below.

### Getting Started

First, declare the `SavedVariables` table in your addon's `.toc` file:

```toc
## SavedVariables: AceDBExampleDB
```

Then create the database object with [`:New`](#new), passing the name of that table.

::: warning
You must create the database **after** the [`ADDON_LOADED`](https://warcraft.wiki.gg/wiki/ADDON_LOADED) event has fired for your addon (that is, in [`OnInitialize`](/api/ace-addon#oninitialize)); otherwise the table you read will be replaced when the real `SavedVariables` loads.
:::

```lua
AceDBExample = LibStub("AceAddon-3.0"):NewAddon("AceDBExample")

function AceDBExample:OnInitialize()
    self.db = LibStub("AceDB-3.0"):New("AceDBExampleDB")
end
```

### Accessing & Storing Data

A database object exposes its data through several scopes (see [Scopes](#scopes) below). The most commonly used is `profile`, which lets each character choose which named profile is active.

Reading and writing is just plain table access; you can store strings, numbers, or whole nested tables:

```lua
function AceDBExample:OnEnable()
    if self.db.profile.optionA then
        self.db.profile.playerName = UnitName("player")
        -- You're not limited to `profile`: read and write any scope the same way, and you can mix them freely on one database
        self.db.char.money = GetMoney()    -- per-character
        self.db.global.installed = true    -- account-wide
    end
end
```

To organize your settings, nest tables however you like; they behave like any other Lua table.

### Defaults

Defaults are defined as a table laid out exactly like you want your database to look. You pass them to [`:New`](#new) as the second argument (or set them later with [`:RegisterDefaults`](#registerdefaults)). Because one defaults table covers every scope at once, the top-level keys are the scope names (`profile`, `char`, `global`, ...).

```lua
local defaults = {
    profile = {
        optionA = true,
        optionB = false,
        suboptions = {
            subOptionA = false,
            subOptionB = true,
        },
    }
}

function AceDBExample:OnInitialize()
    self.db = LibStub("AceDB-3.0"):New("AceDBExampleDB", defaults)
end
```

Defaults are served transparently when a key has not been set, and they are never written to the `SavedVariables` file, so users only persist values they have actually changed.

#### Smart Defaults

There are two "magic" keys you can use inside a defaults table.

The first is `['*']`, which provides a default for **any key that was not explicitly defined**:

```lua
local defaults = {
    profile = {
        modules = {
            ['*'] = {
                enabled = true,
                visible = true,
            },
            moduleB = {
                enabled = false,
                visible = true,
            },
        }
    }
}
```

With these defaults, reading `self.db.profile.modules.moduleA.enabled` returns `true`: `moduleA` was never declared, so it inherits the `['*']` table. Keys that *are* explicitly defined (like `moduleB`) do **not** inherit anything from `['*']`.

The second magic key is `['**']`. It works like `['*']`, except it is **also inherited by the sibling keys in the same table**:

```lua
local defaults = {
    profile = {
        modules = {
            ['**'] = {
                enabled = true,
                visible = true,
            },
            moduleB = {
                enabled = false,
                --visible = true,
            },
        }
    }
}
```

Here `visible` is commented out of `moduleB`, yet `self.db.profile.modules.moduleB.visible` still returns `true`, because the explicitly-defined `moduleB` inherits the missing field from `['**']`.

::: tip
The difference is subtle but important: `['*']` only fills in *undefined* sibling keys, while `['**']` is also merged into *defined* siblings. Use `['**']` when you want every entry to share a base set of fields.
:::

A `['*']` value can also be a plain value rather than a table; for example `['*'] = false` for a table that tracks which modules are enabled, with an explicit `true` for the ones that are on.

### Reacting to Profile Changes

When the active profile changes, the values behind `self.db.profile` change too, so anything you derived from those settings (frame positions, visibility, options panels) needs to be refreshed. AceDB tells you this happened through callbacks, fired via [CallbackHandler-1.0](/api/callback-handler).

Three callbacks all signal "the active profile changed": the user switched profiles, copied a profile into the active one, or reset it. Register the same handler for all three:

```lua
function MyAddon:OnInitialize()
    self.db = LibStub("AceDB-3.0"):New("MyAddonDB")
    self.db.RegisterCallback(self, "OnProfileChanged", "RefreshConfig")
    self.db.RegisterCallback(self, "OnProfileCopied", "RefreshConfig")
    self.db.RegisterCallback(self, "OnProfileReset", "RefreshConfig")
end

function MyAddon:RefreshConfig()
    -- re-read self.db.profile and reapply your settings here
end
```

::: tip
Every addon that uses profiles should handle these three callbacks for a smooth, consistent transition whenever the active profile changes.
:::

For the complete list of callbacks and their arguments, see the [Callbacks](#callbacks) section below.

## Scopes

Data can be saved in different scopes, depending on its intended usage. The following scopes are available:

- `char`: Character-specific data. Every character has its own database.
- `realm`: Realm-specific data. All of the players characters on the same realm share this database.
- `class`: Class-specific data. All of the players characters of the same class share this database.
- `race`: Race-specific data. All of the players characters of the same race share this database.
- `faction`: Faction-specific data. All of the players characters of the same faction share this database.
- `factionrealm`: Faction and realm specific data. All of the players characters on the same realm and of the same faction share this database.
- `locale`: Locale specific data, based on the locale of the players game client.
- `global`: Global Data. All characters on the same account share this database.
- `profile`: Profile-specific data, and the most commonly used scope. All characters using the same profile share this database; the user can choose the active profile and manage the profiles of all of their characters.

Each of these is a **live view into the saved table for the relevant key**. You read and write them like ordinary Lua tables and AceDB persists the correct slice automatically.

Profiles work a little differently, because the user can switch which one is active:

- **`db.profile`** is the table of the **currently active profile**: the one whose name [`:GetCurrentProfile`](#getcurrentprofile) returns. This is what your addon reads and writes for ordinary settings (`db.profile.fontSize = 12`).
- Which profile is active is tracked **per character**: AceDB keeps a `character → profile name` map in the SavedVariables, so every character remembers its own choice. A character with no stored choice falls back to the default profile: the `defaultProfile` you passed to [`:New`](#new) (`"Default"` if you passed `true`), or a character-specific profile if you passed nothing.
- **`db.profiles`** is the table of **all** profiles, keyed by profile name (every profile that exists in the database, shared across the account). [`:GetProfiles`](#getprofiles) lists their names; [`:SetProfile`](#setprofile) switches the active one (creating it if the name is new), which re-points `db.profile` at that profile's table and stores the choice for the current character. [`:CopyProfile`](#copyprofile), [`:DeleteProfile`](#deleteprofile) and [`:ResetProfile`](#resetprofile) manage them. Changing the profile fires the [profile callbacks](#callbacks) so your addon can re-apply settings.

So in a typical addon, `self.db.profile` is "the user's current settings", `self.db.profiles` is "every saved settings set", and the active selection is remembered separately for each character.

## API Reference

````apimethod
name: AceDB:New
params:
  - { name = "tbl", type = "string|table", desc = "The name of the variable, or table to use for the database." }
  - { name = "defaults", type = "table", optional = true, desc = "A table of database defaults." }
  - { name = "defaultProfile", type = "string|boolean", optional = true, desc = "The name of the default profile. If not set, each character defaults to its own profile named `\"CharacterName - RealmName\"` (for example, `\"Thrall - Silvermoon\"`). Pass `true` to instead default to a single shared profile named `\"Default\"`." }
returns: { type = "table", desc = "The new database object." }
---
Creates a new database object that can be used to handle database settings and profiles.

By default, an empty DB is created, using a character specific profile.

You can override the default profile used by passing any profile name as the third argument, or by passing `true` as the third argument to use a globally shared profile called "Default".

Note that there is no token replacement in the default profile name, passing a defaultProfile as "char" will use a profile named "char", and not a character-specific profile.

---

```lua
-- Create an empty DB using a character-specific default profile.
self.db = LibStub("AceDB-3.0"):New("MyAddonDB")

-- ...or with a defaults table and a shared "Default" profile:
local defaults = { profile = { enabled = true } }
self.db = LibStub("AceDB-3.0"):New("MyAddonDB", defaults, true)
```
````

````apimethod
name: DBObjectLib:CopyProfile
params:
  - { name = "name", type = "string", desc = "The name of the profile to be copied into the current profile." }
  - { name = "silent", type = "boolean", optional = true, desc = "If `true`, do not raise an error when the profile does not exist." }
---
Copies a named profile into the current profile, overwriting any conflicting settings.
````

````apimethod
name: DBObjectLib:DeleteProfile
params:
  - { name = "name", type = "string", desc = "The name of the profile to be deleted." }
  - { name = "silent", type = "boolean", optional = true, desc = "If `true`, do not raise an error when the profile does not exist." }
---
Deletes a named profile.

This profile must not be the active profile.
````

````apimethod
name: DBObjectLib:GetCurrentProfile
returns: { type = "string", desc = "The current profile name used by the database." }
---
Returns the current profile name used by the database.
````

````apimethod
name: DBObjectLib:GetNamespace
params:
  - { name = "name", type = "string", desc = "The name of the namespace." }
  - { name = "silent", type = "boolean", optional = true, desc = "If `true`, the namespace is optional; silently return `nil` if it is not found." }
returns: { type = "table", desc = "The namespace object if found." }
---
Returns an already existing namespace from the database object.
````

````apimethod
name: DBObjectLib:GetProfiles
params:
  - { name = "tbl", type = "table", optional = true, desc = "A table to store the profile names in." }
returns:
  - { name = "profiles", type = "table", desc = "The table of profile names." }
  - { name = "count", type = "number", desc = "The number of profiles in the table." }
---
Returns a table with the names of the existing profiles in the database.

You can optionally supply a table to re-use for this purpose.

---

```lua
local profiles, count = self.db:GetProfiles()
```
````

````apimethod
name: DBObjectLib:RegisterDefaults
params:
  - { name = "defaults", type = "table", desc = "A table of defaults for this database." }
---
Sets the defaults table for the given database object by clearing any that are currently set, and then setting the new defaults.
````

````apimethod
name: DBObjectLib:RegisterNamespace
params:
  - { name = "name", type = "string", desc = "The name of the new namespace." }
  - { name = "defaults", type = "table", optional = true, desc = "A table of values to use as defaults." }
returns: { type = "table", desc = "The new namespace database object." }
---
Creates a new database namespace, directly tied to the database.

This is a full scale database in its own rights other than the fact that it cannot control its profile individually.

---

```lua
local module = self.db:RegisterNamespace("MyModule", { profile = { enabled = true } })
```
````

````apimethod
name: DBObjectLib:ResetDB
params:
  - { name = "defaultProfile", type = "string|boolean", optional = true, desc = "The profile name to use as the default. May also be `true` for a shared global profile called \"Default\"." }
returns: { type = "table", desc = "The database object." }
---
Resets the entire database, using the string defaultProfile as the new default profile.
````

````apimethod
name: DBObjectLib:ResetProfile
params:
  - { name = "noChildren", type = "boolean", optional = true, desc = "If set to `true`, the reset will not be populated to the child namespaces of this DB object." }
  - { name = "noCallbacks", type = "boolean", optional = true, desc = "If set to `true`, won't fire the [`OnProfileReset`](#onprofilereset) callback." }
---
Resets the current profile to the default values (if specified).
````

````apimethod
name: DBObjectLib:SetProfile
params:
  - { name = "name", type = "string", desc = "The name of the profile to set as the current profile." }
---
Changes the profile of the database and all of it's namespaces to the supplied named profile.
````

## Callbacks

AceDB fires a set of callbacks through [CallbackHandler-1.0](/api/callback-handler), notifying you of all
important changes to the database. The CallbackHandler API is embedded directly
on the database object, so you register a callback with:

```lua
db.RegisterCallback(target, "EventName", "method")
```

where `target` is the object to call back on (commonly `self`), `"EventName"` is
one of the callbacks below, and `"method"` is the name of the method to invoke on
`target` (it may be omitted to call a method of the same name as the event).
`db.UnregisterCallback(target, "EventName")` and
`db.UnregisterAllCallbacks(target)` are also available.

All callbacks receive the database object as their first argument; most provide
additional information in further arguments.

````apimethod
name: OnNewProfile
kind: callback
params:
  - { name = "db", type = "table", desc = "The database object the callback fires on." }
  - { name = "profile", type = "string", desc = "The key of the new profile." }
---
Fires when a new profile is created. Commonly used to apply custom defaults that
cannot be handled through AceDB's defaults table.
````

````apimethod
name: OnProfileChanged
kind: callback
params:
  - { name = "db", type = "table", desc = "The database object the callback fires on." }
  - { name = "newProfile", type = "string", desc = "The key of the now-active profile." }
---
Fires after the active profile has been changed (including as part of a database
reset).
````

````apimethod
name: OnProfileDeleted
kind: callback
params:
  - { name = "db", type = "table", desc = "The database object the callback fires on." }
  - { name = "profile", type = "string", desc = "The key of the deleted profile." }
---
Fires after a profile has been deleted.
````

````apimethod
name: OnProfileCopied
kind: callback
params:
  - { name = "db", type = "table", desc = "The database object the callback fires on." }
  - { name = "sourceProfile", type = "string", desc = "The key of the profile that was copied from." }
---
Fires after a profile has been copied into the current active profile.
````

````apimethod
name: OnProfileReset
kind: callback
params:
  - { name = "db", type = "table", desc = "The database object the callback fires on." }
---
Fires after the current profile has been reset to its default values.
````

````apimethod
name: OnDatabaseReset
kind: callback
params:
  - { name = "db", type = "table", desc = "The database object the callback fires on." }
---
Fires after the whole database has been reset. Note that [`OnProfileChanged`](#onprofilechanged) is
fired immediately afterwards as well.
````

````apimethod
name: OnProfileShutdown
kind: callback
params:
  - { name = "db", type = "table", desc = "The database object the callback fires on." }
---
Fires before the active profile is changed, allowing you to save any pending
state to the outgoing profile.
````

````apimethod
name: OnDatabaseShutdown
kind: callback
params:
  - { name = "db", type = "table", desc = "The database object the callback fires on." }
---
Fires on logout ([`PLAYER_LOGOUT`](https://warcraft.wiki.gg/wiki/PLAYER_LOGOUT)), just before the database is cleaned of all
AceDB metadata and defaults are stripped from the `SavedVariables`.
````
