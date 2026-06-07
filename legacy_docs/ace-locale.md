# AceLocale-3.0

AceLocale-3.0 manages localization in addons, allowing for multiple locale to be registered with fallback to the base locale for untranslated strings.

## API Reference

### `AceLocale:GetLocale(application, silent)`

Returns localizations for the current locale (or default locale if translations are missing).

Errors if nothing is registered (spank developer, not just a missing translation).

**Parameters**

- `application` — Unique name of addon / module
- `silent` — If true, the locale is optional, silently return nil if it's not found (defaults to false, optional)

**Returns**

- The locale table for the current language.

### `AceLocale:NewLocale(application, locale[, isDefault[, silent]])`

Register a new locale (or extend an existing one) for the specified application.

`:NewLocale` will return a table you can fill your locale into, or nil if the locale isn't needed for the players game locale.

**Parameters**

- `application` — Unique name of addon / module
- `locale` — Name of the locale to register, e.g. "enUS", "deDE", etc.
- `isDefault` — If this is the default locale being registered (your addon is written in this language, generally enUS)
- `silent` — If true, the locale will not issue warnings for missing keys. Must be set on the first locale registered. If set to "raw", nils will be returned for unknown keys (no metatable used).

**Returns**

- Locale Table to add localizations to, or nil if the current locale is not required.

**Usage**

```lua
-- enUS.lua
local L = LibStub("AceLocale-3.0"):NewLocale("TestLocale", "enUS", true)
L["string1"] = true
```

```lua
-- deDE.lua
local L = LibStub("AceLocale-3.0"):NewLocale("TestLocale", "deDE")
if not L then return end
L["string1"] = "Zeichenkette1"
```
