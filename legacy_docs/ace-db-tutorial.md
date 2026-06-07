# AceDB-3.0 Tutorial

AceDB-3.0 is a library to manage the SavedVariables of an addon. It offers
profile management, smart defaults and child-databases for modules.

## Getting Started

First, we need to make sure that we have the table we want to use to store our
DB in defined in the addon's `.toc`, like this:

```
## SavedVariables: AceDBExampleDB
```

Now we can register our table with AceDB-3.0 and start writing our addon.

> **Note:** You have to register the table after the `ADDON_LOADED` event (e.g.
> in `OnInitialize`) or the table will be overridden when the real SV loads.

```lua
AceDBExample = LibStub("AceAddon-3.0"):NewAddon("AceDBExample")

function AceDBExample:OnInitialize()
    self.db = LibStub("AceDB-3.0"):New("AceDBExampleDB")
end
```

## Accessing/Storing Data

Of course we want to store and access data in our new DB. We'll have to choose a
data-type first, we'll use `profile` for now, and discuss the other options
later.

The `profile` data type allows the user to choose which profile is active for
every character. It's the most commonly used data-type in AceDB-3.0.

Let's say we want to check if `optionA` is enabled, and if it is, store the
player's name in the DB. We're extending our previous snippet with an `OnEnable`
function to do this.

```lua
function AceDBExample:OnEnable()
    if self.db.profile.optionA then
        self.db.profile.playerName = UnitName("player")
    end
end
```

You can see in this example how we used the `profile` data-type, and accessed
the profile DB. Using this method, you can save any data in the DB - strings,
numbers, complete tables.

If you want to organize the content of your DB a bit more, you can of course
create tables in it, and store the data in there. You can access any content of
the DB like any other table.

## Defaults

Now that we have the basics done, we can look at setting some default values for
the DB. Defaults are defined as a table, and follow the same layout as you would
want your DB to look like in the end.

Let's start off with a small example:

```lua
AceDBExample = LibStub("AceAddon-3.0"):NewAddon("AceDBExample")

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

As you can see, we defined the defaults table pretty similar to how our DB
should look like. You'll see the `profile` data-type there again; as we can use
one defaults table for all data-types at once, you'll have to specify the
data-type in the defaults table. Additionally, we supplied the defaults table as
the second argument to the AceDB-3.0 call.

### Advanced Defaults

We talked about smart defaults before. What we talked about in the previous
section certainly is useful, but not particularly smart.

There are two "magic" keys you can use in the default table. The first is
`['*']`. Let us look at an example defaults table, and see how it works.

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

The `['*']` key defines a default table for any key that was not explicitly
defined in the defaults. For example, using the above defaults I could access
`self.db.profile.modules.moduleA.enabled` and I would get `true`. Because
`moduleA` was not explicitly defined in the defaults table, it'll use the
defaults provided by the `['*']` key. Any key that was explicitly defined in the
options table will not inherit any of the values defined in the `['*']` key.

The second magic key is `['**']`. It works similar to the `['*']` key, except
that it'll also be inherited by all the keys in the same table. Using the above
example:

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

As you see, the `visible` attribute in the `moduleB` table has been commented.
However, you can still access `self.db.profile.modules.moduleB.visible` and it
will still be `true`, because it was defined to default to `true` in the `['**']`
key.

The difference between `['*']` and `['**']` is small, but defining. In many
cases you will want the inheritance provided by the latter, but there are cases
where you'll only want `['*']`.

Of course the default value provided by `['*']` can also be a plain value, and
not only a table. The common use would be a section where you store the state of
your modules. The whole table would have a `['*'] = false` key, and every module
that is enabled an explicit `true` key (or vice versa).

## Data Types

We've only used the `profile` data type before, but there is a whole set of
other data types.

The following data types are available:

- `char` — Character-specific data. Every character has its own database.
- `realm` — Realm-specific data. All of the player's characters on the same
  realm share this database.
- `class` — Class-specific data. All of the player's characters of the same
  class share this database.
- `race` — Race-specific data. All of the player's characters of the same race
  share this database.
- `faction` — Faction-specific data. All of the player's characters of the same
  faction share this database.
- `factionrealm` — Faction and realm specific data. All of the player's
  characters on the same realm and of the same faction share this database.
- `global` — Global Data. All characters on the same account share this
  database.
- `profile` — Profile-specific data. All characters using the same profile share
  this database. The user can control which profile should be used.

You can use all of those at the same time:

```lua
local charName = UnitName("player")

function MyAddon:OnInitialize()
    self.db = LibStub("AceDB-3.0"):New("MyAddonDB")
    self.db.char.money = GetMoney()
    self.db.global.money[charName] = GetMoney()
end
```

## Callbacks

AceDB offers a set of callbacks through CallbackHandler-1.0 which notify you of
all important changes to the database.

All callbacks have the database as their first argument, and most callbacks
provide additional information in their arguments.

The following callbacks are currently implemented:

- **`OnNewProfile` (db, profile)** — Fires when a new profile is created,
  usually used to apply custom defaults that cannot be handled through AceDB.
- **`OnProfileChanged` (db, newProfile)** — Fires after changing the profile.
- **`OnProfileDeleted` (db, profile)** — Fires after a profile has been deleted.
- **`OnProfileCopied` (db, sourceProfile)** — Fires after a profile has been
  copied into the current active profile.
- **`OnProfileReset` (db)** — Fires after the current profile has been reset.
- **`OnDatabaseReset` (db)** — Fires after the whole database has been reset.
  (Note: `OnProfileChanged` will fire as well.)
- **`OnProfileShutdown` (db)** — Fires before changing the profile.
- **`OnDatabaseShutdown` (db)** — Fires when logging out, just before the
  database is about to be cleaned of all AceDB metadata.

When using the `profile` data type, a common use of the callbacks would be:

```lua
function MyAddon:OnInitialize()
    self.db = LibStub("AceDB-3.0"):New("MyAddonDB", defaults)
    self.db.RegisterCallback(self, "OnProfileChanged", "RefreshConfig")
    self.db.RegisterCallback(self, "OnProfileCopied", "RefreshConfig")
    self.db.RegisterCallback(self, "OnProfileReset", "RefreshConfig")
end

function MyAddon:RefreshConfig()
    -- would do some stuff here
end
```

The three callbacks in the snippet above all basically mean the same: the active
profile changed. The user changed it to another profile, another profile was
copied into the active profile, or it was reset to the default values. Either
way, we need to refresh our settings.

Every addon that uses profiles should use those 3 callbacks to be notified about
any change in the active profile, for a consistent and smooth transition between
profiles.
