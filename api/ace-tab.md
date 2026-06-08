---
description: "AceTab-3.0 adds tab-completion to chat edit boxes, registering completion sets with optional prematch preconditions, cycling, and usage statements"
---

# AceTab-3.0

AceTab-3.0 provides support for tab-completion in chat edit boxes. It lets you register sets of completions that fire
when the user presses Tab in a monitored EditBox, optionally gated behind a "prematch" precondition string, with support
for cycling through multiple matches, usage statements, and post-processing of matched words.

## API Reference

````apimethod
name: AceTab:RegisterTabCompletion
params:
  - { name = "descriptor", type = "string", desc = "Unique identifier for this tab completion set." }
  - { name = "prematches", type = "string|table|nil", desc = "The string match(es) AFTER which this tab completion applies; AceTab ignores tabs not preceded by the string(s). If nil (or an empty string), the set is treated as a fallback that only applies when no more-specific completion has a match." }
  - { name = "wordlist", type = "function|table", desc = "A table of candidate completion strings, or a function that is passed a table to fill with candidate strings. The function also receives the full editbox text, the start position of the word being completed, and the uncompleted partial word as its second, third, and fourth arguments (for pre-filtering or conditional formatting)." }
  - { name = "usagefunc", type = "function|boolean", optional = true, desc = "Usage statement function. Defaults to printing the wordlist, one entry per line. A boolean true squelches usage output." }
  - { name = "listenframes", type = "string|table", optional = true, desc = "The EditFrame(s) to monitor, given as frame references or frame names. Defaults to the chat frame edit boxes (ChatFrame1EditBox … ChatFrameNEditBox)." }
  - { name = "postfunc", type = "function", optional = true, desc = "Post-processing function applied to each match after it has been identified, producing the displayed/inserted form of the match." }
  - { name = "pmoverwrite", type = "boolean|number", optional = true, desc = "Offsets the beginning of the inserted completion to overwrite part of the prematch. Boolean true overwrites the entire prematch string; a number overwrites that many characters before the cursor. Useful when the prematch is an indicator character you don't want to keep." }
---
Register a tab completion set.

Once registered, pressing Tab in any monitored EditBox will attempt to complete the word before the cursor against the provided wordlist (subject to the `prematches` precondition, if any). If multiple completions match, the entered text is replaced with the greatest common substring of all matches, and repeated Tab presses cycle through the individual matches.

```lua
local AceTab = LibStub("AceTab-3.0")

local greetings = { "hello", "howdy", "hey", "heya" }

-- Complete words that follow "greet " typed in a chat edit box.
AceTab:RegisterTabCompletion("MyGreetings", "greet ", greetings)
```

---

```lua
-- Using a wordlist function for dynamic candidates.
AceTab:RegisterTabCompletion("MyPlayers", "to ", function(candidates, fulltext, wordStart, partial)
    for name in pairs(myRosterTable) do
        candidates[#candidates + 1] = name
    end
end)
```
````

````apimethod
name: AceTab:IsTabCompletionRegistered
returns: { type = "table|nil", desc = "The stored registry entry for the descriptor (a truthy value) if registered, otherwise nil." }
params:
  - { name = "descriptor", type = "string", desc = "The unique identifier used at registration." }
---
Check whether a tab completion set has been registered under the given descriptor.
````

````apimethod
name: AceTab:UnregisterTabCompletion
params:
  - { name = "descriptor", type = "string", desc = "The unique identifier used at registration." }
---
Remove a previously registered tab completion set. Clears the descriptor's registry entry along with its internal prematch-overwrite, fallback, and non-fallback bookkeeping.
````

````apimethod
name: AceTab:OnTabPressed
kind: callback
returns: { type = "boolean|nil", desc = "True to let the default/original Tab handling proceed (e.g. when there is no text or a completion could not be applied); otherwise nothing, indicating AceTab handled the key." }
params:
  - { name = "editbox", type = "table", desc = "The EditBox in which Tab was pressed. (Named `this` in the source, after the legacy WoW convention for the frame in a script handler.)" }
---
Internal handler invoked when Tab is pressed in a monitored EditBox; it builds matches, performs insertion, and drives match cycling. AceTab hooks this onto the relevant frame scripts automatically when you register a completion, so addons normally do not call it directly.
````
