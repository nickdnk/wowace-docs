# AceTimer-3.0

AceTimer-3.0 provides a central facility for registering timers.

AceTimer supports one-shot timers and repeating timers. All timers are stored in an efficient data structure that allows easy dispatching and fast rescheduling. Timers can be registered or canceled at any time, even from within a running timer, without conflict or large overhead.

AceTimer is currently limited to firing timers at a frequency of 0.01s as this is what the WoW timer API restricts us to.

All `:Schedule` functions will return a handle to the current timer, which you will need to store if you need to cancel the timer you just registered.

AceTimer-3.0 can be embeded into your addon, either explicitly by calling `AceTimer:Embed(MyAddon)` or by specifying it as an embeded library in your AceAddon. All functions will be available on your addon object and can be accessed directly, without having to explicitly call AceTimer itself.

It is recommended to embed AceTimer, otherwise you'll have to specify a custom `self` on all calls you make into AceTimer.

## API Reference

### `AceTimer:CancelAllTimers()`

Cancels all timers registered to the current addon object (`self`).

### `AceTimer:CancelTimer(id)`

Cancels a timer with the given id, registered by the same addon object as used for `:ScheduleTimer`.

Both one-shot and repeating timers can be canceled with this function, as long as the `id` is valid and the timer has not fired yet or was canceled before.

**Parameters**

- `id` — The id of the timer, as returned by `:ScheduleTimer` or `:ScheduleRepeatingTimer`

### `AceTimer:ScheduleRepeatingTimer(func, delay, ...)`

Schedule a repeating timer.

The timer will fire every `delay` seconds, until canceled.

**Parameters**

- `func` — Callback function for the timer pulse (funcref or method name).
- `delay` — Delay for the timer, in seconds.
- `...` — An optional, unlimited amount of arguments to pass to the callback function.

**Usage**

```lua
MyAddOn = LibStub("AceAddon-3.0"):NewAddon("MyAddOn", "AceTimer-3.0")

function MyAddOn:OnEnable()
    self.timerCount = 0
    self.testTimer = self:ScheduleRepeatingTimer("TimerFeedback", 5)
end

function MyAddOn:TimerFeedback()
    self.timerCount = self.timerCount + 1
    print(("%d seconds passed"):format(5 * self.timerCount))
    -- run 30 seconds in total
    if self.timerCount == 6 then
        self:CancelTimer(self.testTimer)
    end
end
```

### `AceTimer:ScheduleTimer(func, delay, ...)`

Schedule a new one-shot timer.

The timer will fire once in `delay` seconds, unless canceled before.

**Parameters**

- `func` — Callback function for the timer pulse (funcref or method name).
- `delay` — Delay for the timer, in seconds.
- `...` — An optional, unlimited amount of arguments to pass to the callback function.

**Usage**

```lua
MyAddOn = LibStub("AceAddon-3.0"):NewAddon("MyAddOn", "AceTimer-3.0")

function MyAddOn:OnEnable()
    self:ScheduleTimer("TimerFeedback", 5)
end

function MyAddOn:TimerFeedback()
    print("5 seconds passed")
end
```

### `AceTimer:TimeLeft(id)`

Returns the time left for a timer with the given id, registered by the current addon object (`self`).

This function will return 0 when the id is invalid.

**Parameters**

- `id` — The id of the timer, as returned by `:ScheduleTimer` or `:ScheduleRepeatingTimer`

**Returns**

- The time left on the timer.
