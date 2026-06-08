---
description: "AceHook-3.0 offers safe hooking and unhooking of functions, methods and frame scripts, keeping the hook chain intact when you restore the original"
---

# AceHook-3.0

<Embeddable />

AceHook-3.0 offers safe Hooking/Unhooking of functions, methods and frame scripts. Using AceHook-3.0 is recommended when
you need to unhook your hooks again, so the hook chain isn't broken when you manually restore the original function.

## Usage

Embedding as a mixin is best, so hooks are cleaned up automatically if the user disables your addon:

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceHook-3.0")
```

### Standard (pre-) hooks

A standard hook runs before the original and automatically calls the original afterward. Specify a function name, or an
object + method name:

```lua
MyAddon:Hook("APIFunctionName")
MyAddon:Hook(TargetObject, "TargetMethod")
```

By default the call is routed to a same-named method on your addon. Provide a custom handler if you prefer:

```lua
MyAddon:Hook("APIFunctionName", handlerFunc)
MyAddon:Hook("APIFunctionName", "handlerMethod")
```

To hook a secure function despite the tainting risk, pass `true` as the final argument:

```lua
MyAddon:Hook("APISecureFunctionName", handlerFunc, true)
```

### Raw hooks

A raw hook completely replaces the original: you must call it yourself (via `self.hooks`) if you want it to run:

```lua
MyAddon:RawHook("APIFunctionName")

function MyAddon:APIFunctionName(...)
    -- call the original through self.hooks
    self.hooks["APIFunctionName"](...)
end
```

### Secure (post-) hooks

Secure hooks run *after* the original; return values are ignored. Use these for protected Blizzard UI elements to avoid
taint:

```lua
MyAddon:SecureHook("APISecureFunctionName")
```

### Hooking scripts

Hook frame scripts with the `*Script` variants:

```lua
MyAddon:HookScript(TargetFrame, "ScriptName")
MyAddon:RawHookScript(TargetFrame, "ScriptName")
MyAddon:SecureHookScript(TargetFrame, "ScriptName")
```

### Checking for an existing hook

```lua
local hookexists, hookhandler = MyAddon:IsHooked("APIFunctionName")
```

## API Reference

````apimethod
name: AceHook:Embed
kind: method
params:
  - { name = "target", type = "table", desc = "Target object to embed AceHook in." }
returns: { type = "table", desc = "The `target` object that was embedded." }
---
Copies AceHook's methods onto `target` so you can call them on it directly. See [The `:Embed` method](/api/ace-addon#the-embed-method).
````

````apimethod
name: AceHook:Hook
params:
  - { name = "object", type = "table", optional = true, desc = "The object to hook a method from." }
  - { name = "method", type = "string", desc = "The name of the method (if `object` is given), or the name of the function to hook." }
  - { name = "handler", type = "function|methodname", optional = true, desc = "The handler for the hook, a funcref or a method name. (Defaults to the name of the hooked function)." }
  - { name = "hookSecure", type = "boolean", optional = true, desc = "If true, AceHook will allow hooking of secure functions." }
---
Hook a function or a method on an object.

The hook created will be a "safe hook", that means that your handler will be called before the hooked function ("Pre-Hook"), and you don't have to call the original function yourself, however you cannot stop the execution of the function, or modify any of the arguments/return values.

This type of hook is typically used if you need to know if some function got called, and don't want to modify it.

---

```lua
function MyAddon:OnEnable()
    -- Hook ActionButton_UpdateHotkeys, overwriting the secure status
    self:Hook("ActionButton_UpdateHotkeys", true)
end

function MyAddon:ActionButton_UpdateHotkeys(button, type)
    print(button:GetName() .. " is updating its HotKey")
end
```
````

````apimethod
name: AceHook:RawHook
params:
  - { name = "object", type = "table", optional = true, desc = "The object to hook a method from." }
  - { name = "method", type = "string", desc = "The name of the method (if `object` is given), or the name of the function to hook." }
  - { name = "handler", type = "function|methodname", optional = true, desc = "The handler for the hook, a funcref or a method name. (Defaults to the name of the hooked function)." }
  - { name = "hookSecure", type = "boolean", optional = true, desc = "If true, AceHook will allow hooking of secure functions." }
---
RawHook a function or a method on an object.

The hook created will be a "raw hook", that means that your handler will completely replace the original function, and your handler has to call the original function (or not, depending on your intentions).

The original function will be stored in `self.hooks[object][method]` or `self.hooks[functionName]` respectively.

This type of hook can be used for all purposes, and is usually the most common case when you need to modify arguments or want to control execution of the original function.

---

```lua
function MyAddon:OnEnable()
    -- Hook ActionButton_UpdateHotkeys, overwriting the secure status
    self:RawHook("ActionButton_UpdateHotkeys", true)
end

function MyAddon:ActionButton_UpdateHotkeys(button, type)
    if button:GetName() == "MyButton" then
        -- do stuff here
    else
        self.hooks.ActionButton_UpdateHotkeys(button, type)
    end
end
```
````

````apimethod
name: AceHook:SecureHook
params:
  - { name = "object", type = "table", optional = true, desc = "The object to hook a method from." }
  - { name = "method", type = "string", desc = "The name of the method (if `object` is given), or the name of the function to hook." }
  - { name = "handler", type = "function|methodname", optional = true, desc = "The handler for the hook, a funcref or a method name. (Defaults to the name of the hooked function)." }
---
SecureHook a function or a method on an object.

This function is a wrapper around the [`hooksecurefunc`](https://warcraft.wiki.gg/wiki/API_hooksecurefunc) function in the WoW API. Using AceHook extends the functionality of secure hooks, and adds the ability to unhook once the hook isn't required anymore, or the addon is being disabled.

Secure Hooks should be used if the secure-status of the function is vital to its function, and taint would block execution. Secure Hooks are always called after the original function was called ("Post Hook"), and you cannot modify the arguments, return values or control the execution.

---

```lua
function MyAddon:OnEnable()
    -- run our handler after the original UseAction fires
    self:SecureHook("UseAction", "OnUseAction")
end

function MyAddon:OnUseAction(slot)
    print("Action slot used: " .. slot)
end
```
````

````apimethod
name: AceHook:HookScript
params:
  - { name = "frame", type = "table", desc = "The Frame to hook the script on." }
  - { name = "script", type = "string", desc = "The script to hook." }
  - { name = "handler", type = "function|methodname", optional = true, desc = "The handler for the hook, a funcref or a method name. (Defaults to the name of the hooked script)." }
---
Hook a script handler on a frame.

The hook created will be a "safe hook", that means that your handler will be called before the hooked script ("Pre-Hook"), and you don't have to call the original function yourself, however you cannot stop the execution of the function, or modify any of the arguments/return values.

This is the frame script equivalent of the [`:Hook`](#hook) safe-hook. It would typically be used to be notified when a certain event happens to a frame.

---

```lua
function MyAddon:OnEnable()
    -- Hook the OnShow of FriendsFrame
    self:HookScript(FriendsFrame, "OnShow", "FriendsFrameOnShow")
end

function MyAddon:FriendsFrameOnShow(frame)
    print("The FriendsFrame was shown!")
end
```
````

````apimethod
name: AceHook:RawHookScript
params:
  - { name = "frame", type = "table", desc = "The Frame to hook the script on." }
  - { name = "script", type = "string", desc = "The script to hook." }
  - { name = "handler", type = "function|methodname", optional = true, desc = "The handler for the hook, a funcref or a method name. (Defaults to the name of the hooked script)." }
---
RawHook a script handler on a frame.

The hook created will be a "raw hook", that means that your handler will completely replace the original script, and your handler has to call the original script (or not, depending on your intentions).

The original script will be stored in `self.hooks[frame][script]`.

This type of hook can be used for all purposes, and is usually the most common case when you need to modify arguments or want to control execution of the original script.

---

```lua
function MyAddon:OnEnable()
    -- Hook the OnShow of FriendsFrame
    self:RawHookScript(FriendsFrame, "OnShow", "FriendsFrameOnShow")
end

function MyAddon:FriendsFrameOnShow(frame)
    -- Call the original function
    self.hooks[frame].OnShow(frame)
    -- Do our processing
    -- .. stuff
end
```
````

````apimethod
name: AceHook:SecureHookScript
params:
  - { name = "frame", type = "table", desc = "The Frame to hook the script on." }
  - { name = "script", type = "string", desc = "The script to hook." }
  - { name = "handler", type = "function|methodname", optional = true, desc = "The handler for the hook, a funcref or a method name. (Defaults to the name of the hooked script)." }
---
SecureHook a script handler on a frame.

This function is a wrapper around the [`frame:HookScript`](https://warcraft.wiki.gg/wiki/API_ScriptObject_HookScript) function in the WoW API. Using AceHook extends the functionality of secure hooks, and adds the ability to unhook once the hook isn't required anymore, or the addon is being disabled.

Secure Hooks should be used if the secure-status of the function is vital to its function, and taint would block execution. Secure Hooks are always called after the original function was called ("Post Hook"), and you cannot modify the arguments, return values or control the execution.

---

```lua
function MyAddon:OnEnable()
    -- run after the FriendsFrame's OnShow script
    self:SecureHookScript(FriendsFrame, "OnShow", "FriendsFrameOnShow")
end

function MyAddon:FriendsFrameOnShow(frame)
    print("The FriendsFrame was shown!")
end
```
````

````apimethod
name: AceHook:Unhook
returns: { type = "boolean", desc = "`true` if a hook was removed, `false` if there was no active hook to remove." }
params:
  - { name = "obj", type = "table", optional = true, desc = "The object or frame to unhook from." }
  - { name = "method", type = "string", desc = "The name of the method, function or script to unhook from." }
---
Unhook from the specified function, method or script.
````

````apimethod
name: AceHook:UnhookAll
---
Unhook all existing hooks for this addon.

---

```lua
function MyAddon:OnDisable()
    self:UnhookAll()
end
```
````

````apimethod
name: AceHook:IsHooked
returns:
  - { type = "isHooked", desc = "Boolean: `true` if the function/method/script is hooked, otherwise `false`." }
  - { type = "handler", desc = "Function|methodname: the registered handler if hooked, otherwise `nil`." }
params:
  - { name = "obj", type = "table", optional = true, desc = "The object or frame to check." }
  - { name = "method", type = "string", desc = "The name of the method, function or script to check." }
---
Check if the specific function, method or script is already hooked.
````
