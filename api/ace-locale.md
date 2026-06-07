---
description: "AceLocale-3.0 manages addon localization, letting you register multiple locales with automatic fallback to the base locale for untranslated strings"
---

# AceLocale-3.0

AceLocale-3.0 manages localization in addons, allowing for multiple locale to be registered with fallback to the base locale for untranslated strings.

## Usage

### Registering translations

Create one Lua file per locale and list it in the `.toc` **before** your main code (see the [Getting Started](/getting-started) load-order note). Fetch a locale table at the top:

```lua
-- enUS.lua (default locale)
local L = LibStub("AceLocale-3.0"):NewLocale("MyAddon", "enUS", true)
if L then
    L["HELLO"] = "Hello!"
    L["CONFIG_DESC"] = "Opens the configuration window"
end
```

The third argument marks the default locale (usually `true` for `enUS`, `false` elsewhere). [`:NewLocale`](#newlocale) returns `nil` if that locale isn't needed for the current client, so guard with `if L then`.

#### Default locale: explicit values vs. the `true` shorthand

In the **default** locale you can declare each entry two ways:

**Explicit English value (recommended).** Use a stable identifier as the key and put the English wording in the value:

```lua
-- enUS.lua (default locale)
local L = LibStub("AceLocale-3.0"):NewLocale("MyAddon", "enUS", true)
L["HELLO"] = "Hello!"
```

`L["HELLO"]` returns `"Hello!"`. Because the displayed text lives only in the value, you can fix the English wording (`"Hello!"` → `"Hi!"`) without changing the key, so no other locale file and no code referencing `L["HELLO"]` breaks.

**`true` shorthand.** Assigning `true` tells AceLocale to use the key *itself* as the value, so you write the English text once, as the key:

```lua
-- enUS.lua (default locale)
local L = LibStub("AceLocale-3.0"):NewLocale("MyAddon", "enUS", true)
L["Hello!"] = true
```

`L["Hello!"]` returns `"Hello!"`. This is only valid in the default locale (it's how AceLocale avoids you typing the string twice). The cost: the key *is* the English text, so every other locale must key off `"Hello!"` and your code must call `L["Hello!"]`. Correcting the English wording changes the key, breaking every lookup and translation that referenced the old text.

::: tip
Both are valid; prefer **constant keys with explicit values** for anything you may reword later. The `true` shorthand is convenient for short, stable strings where the English text is unlikely to change.
:::

### Using translations

In your main file, fetch the active locale table:

```lua
local L = LibStub("AceLocale-3.0"):GetLocale("MyAddon", true)

function MyAddon:MyFunction()
    self:Print(L["HELLO"])
end
```

The second argument silences the error if locale info is missing.

### Variable substitution

Use functions for strings that mix in variables, so word order can differ per language:

```lua
-- enUS:
L["ADDED_DKP"] = function(amount, player)
    return "Added " .. amount .. " DKP for player " .. player .. "."
end
-- usage:
self:Print(L["ADDED_DKP"](dkpValue, playerName))
```

## API Reference

````apimethod
name: AceLocale:NewLocale
returns: { type = "table|nil", desc = "Locale table to add localizations to, or nil if the current game locale is not required." }
params:
  - { name = "application", type = "string", desc = "Unique name of addon / module." }
  - { name = "locale", type = "string", desc = "Name of the locale to register, e.g. \"enUS\", \"deDE\", etc." }
  - { name = "isDefault", type = "boolean", optional = true, desc = "If this is the default locale being registered (your addon is written in this language, generally enUS)." }
  - { name = "silent", type = "boolean|string", optional = true, desc = "If true, the locale will not issue warnings for missing keys. Must be set on the first locale registered. If set to \"raw\", nils will be returned for unknown keys (no metatable used)." }
---
Register a new locale (or extend an existing one) for the specified application.

`:NewLocale` will return a table you can fill your locale into, or `nil` if the locale isn't needed for the player's game locale.

---

```lua
-- enUS.lua (default locale)
local L = LibStub("AceLocale-3.0"):NewLocale("TestLocale", "enUS", true)
L["HELLO"] = "Hello!"
L["GOODBYE"] = "Goodbye!"
```

Stable constant keys (`HELLO`) with the wording in the value let you fix the English text without changing the key. Other locales translate the same keys:

```lua
-- deDE.lua
local L = LibStub("AceLocale-3.0"):NewLocale("TestLocale", "deDE")
if not L then return end
L["HELLO"] = "Hallo!"
L["GOODBYE"] = "Auf Wiedersehen!"
```
````

````apimethod
name: AceLocale:GetLocale
returns: { type = "table|nil", desc = "The locale table for the current language, or nil if silent is true and no locale is registered for the application." }
params:
  - { name = "application", type = "string", desc = "Unique name of addon / module." }
  - { name = "silent", type = "boolean", default = "false", desc = "If true, the locale is optional; silently return nil if it's not found." }
---
Returns localizations for the current locale (or default locale if translations are missing).

Errors if nothing is registered for the application (indicating a developer misconfiguration, not a missing translation), unless `silent` is set.
````
