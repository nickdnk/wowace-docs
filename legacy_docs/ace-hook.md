# AceHook-3.0

AceHook-3.0 offers safe Hooking/Unhooking of functions, methods and frame scripts. Using AceHook-3.0 is recommended when you need to unhook your hooks again, so the hook chain isn't broken when you manually restore the original function.

AceHook-3.0 can be embeded into your addon, either explicitly by calling `AceHook:Embed(MyAddon)` or by specifying it as an embeded library in your AceAddon. All functions will be available on your addon object and can be accessed directly, without having to explicitly call AceHook itself.

It is recommended to embed AceHook, otherwise you'll have to specify a custom `self` on all calls you make into AceHook.

## API Reference

### `AceHook:Hook([object], method, [handler], [hookSecure])`

Hook a function or a method on an object.

The hook created will be a "safe hook", that means that your handler will be called before the hooked function ("Pre-Hook"), and you don't have to call the original function yourself, however you cannot stop the execution of the function, or modify any of the arguments/return values.

This type of hook is typically used if you need to know if some function got called, and don't want to modify it.

**Parameters**

- `object` — The object to hook a method from
- `method` — If object was specified, the name of the method, or the name of the function to hook.
- `handler` — The handler for the hook, a funcref or a method name. (Defaults to the name of the hooked function)
- `hookSecure` — If true, AceHook will allow hooking of secure functions.

**Usage**

```lua
-- create an addon with AceHook embeded
MyAddon = LibStub("AceAddon-3.0"):NewAddon("HookDemo", "AceHook-3.0")

function MyAddon:OnEnable()
    -- Hook ActionButton_UpdateHotkeys, overwriting the secure status
    self:Hook("ActionButton_UpdateHotkeys", true)
end

function MyAddon:ActionButton_UpdateHotkeys(button, type)
    print(button:GetName() .. " is updating its HotKey")
end
```

### `AceHook:HookScript(frame, script, [handler])`

Hook a script handler on a frame.

The hook created will be a "safe hook", that means that your handler will be called before the hooked script ("Pre-Hook"), and you don't have to call the original function yourself, however you cannot stop the execution of the function, or modify any of the arguments/return values.

This is the frame script equivalent of the `:Hook` safe-hook. It would typically be used to be notified when a certain event happens to a frame.

**Parameters**

- `frame` — The Frame to hook the script on
- `script` — The script to hook
- `handler` — The handler for the hook, a funcref or a method name. (Defaults to the name of the hooked script)

**Usage**

```lua
-- create an addon with AceHook embeded
MyAddon = LibStub("AceAddon-3.0"):NewAddon("HookDemo", "AceHook-3.0")

function MyAddon:OnEnable()
    -- Hook the OnShow of FriendsFrame
    self:HookScript(FriendsFrame, "OnShow", "FriendsFrameOnShow")
end

function MyAddon:FriendsFrameOnShow(frame)
    print("The FriendsFrame was shown!")
end
```

### `AceHook:IsHooked([obj], method)`

Check if the specific function, method or script is already hooked.

**Parameters**

- `obj` — The object or frame to unhook from
- `method` — The name of the method, function or script to unhook from.

### `AceHook:RawHook([object], method, [handler], [hookSecure])`

RawHook a function or a method on an object.

The hook created will be a "raw hook", that means that your handler will completly replace the original function, and your handler has to call the original function (or not, depending on your intentions).

The original function will be stored in `self.hooks[object][method]` or `self.hooks[functionName]` respectively.

This type of hook can be used for all purposes, and is usually the most common case when you need to modify arguments or want to control execution of the original function.

**Parameters**

- `object` — The object to hook a method from
- `method` — If object was specified, the name of the method, or the name of the function to hook.
- `handler` — The handler for the hook, a funcref or a method name. (Defaults to the name of the hooked function)
- `hookSecure` — If true, AceHook will allow hooking of secure functions.

**Usage**

```lua
-- create an addon with AceHook embeded
MyAddon = LibStub("AceAddon-3.0"):NewAddon("HookDemo", "AceHook-3.0")

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

### `AceHook:RawHookScript(frame, script, [handler])`

RawHook a script handler on a frame.

The hook created will be a "raw hook", that means that your handler will completly replace the original script, and your handler has to call the original script (or not, depending on your intentions).

The original script will be stored in `self.hooks[frame][script]`.

This type of hook can be used for all purposes, and is usually the most common case when you need to modify arguments or want to control execution of the original script.

**Parameters**

- `frame` — The Frame to hook the script on
- `script` — The script to hook
- `handler` — The handler for the hook, a funcref or a method name. (Defaults to the name of the hooked script)

**Usage**

```lua
-- create an addon with AceHook embeded
MyAddon = LibStub("AceAddon-3.0"):NewAddon("HookDemo", "AceHook-3.0")

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

### `AceHook:SecureHook([object], method, [handler])`

SecureHook a function or a method on an object.

This function is a wrapper around the `hooksecurefunc` function in the WoW API. Using AceHook extends the functionality of secure hooks, and adds the ability to unhook once the hook isn't required anymore, or the addon is being disabled.

Secure Hooks should be used if the secure-status of the function is vital to its function, and taint would block execution. Secure Hooks are always called after the original function was called ("Post Hook"), and you cannot modify the arguments, return values or control the execution.

**Parameters**

- `object` — The object to hook a method from
- `method` — If object was specified, the name of the method, or the name of the function to hook.
- `handler` — The handler for the hook, a funcref or a method name. (Defaults to the name of the hooked function)

### `AceHook:SecureHookScript(frame, script, [handler])`

SecureHook a script handler on a frame.

This function is a wrapper around the `frame:HookScript` function in the WoW API. Using AceHook extends the functionality of secure hooks, and adds the ability to unhook once the hook isn't required anymore, or the addon is being disabled.

Secure Hooks should be used if the secure-status of the function is vital to its function, and taint would block execution. Secure Hooks are always called after the original function was called ("Post Hook"), and you cannot modify the arguments, return values or control the execution.

**Parameters**

- `frame` — The Frame to hook the script on
- `script` — The script to hook
- `handler` — The handler for the hook, a funcref or a method name. (Defaults to the name of the hooked script)

### `AceHook:Unhook([obj], method)`

Unhook from the specified function, method or script.

**Parameters**

- `obj` — The object or frame to unhook from
- `method` — The name of the method, function or script to unhook from.

### `AceHook:UnhookAll()`

Unhook all existing hooks for this addon.
