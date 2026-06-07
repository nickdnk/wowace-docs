---
description: "AceTimer-3.0 is a central facility for registering one-shot and repeating timers, with handles for cancelling and efficient rescheduling at any time"
---

# AceTimer-3.0

<Embeddable />

AceTimer-3.0 provides a central facility for registering timers.

AceTimer supports one-shot timers and repeating timers. All timers are stored in an efficient data structure that allows easy dispatching and fast rescheduling. Timers can be registered or canceled at any time, even from within a running timer, without conflict or large overhead.

AceTimer is currently limited to firing timers at a frequency of 0.01s as this is what the WoW timer API restricts us to.

All `:Schedule` functions will return a handle to the current timer, which you will need to store if you need to cancel the timer you just registered.

## API Reference

````apimethod
name: AceTimer:Embed
kind: method
params:
  - { name = "target", type = "table", desc = "Target object to embed AceTimer in." }
returns: { type = "table", desc = "The `target` object that was embedded." }
---
Copies AceTimer's methods onto `target` so you can call them on it directly. See [The `:Embed` method](/api/ace-addon#the-embed-method).
````

````apimethod
name: AceTimer:ScheduleTimer
returns: { type = "string", desc = "The timer handle, used to cancel the timer with [`:CancelTimer`](#canceltimer)." }
params:
  - { name = "func", type = "function|methodname", desc = "Callback function for the timer pulse (funcref or method name)." }
  - { name = "delay", type = "number", desc = "Delay for the timer, in seconds." }
  - { name = "...", type = "any", desc = "An optional, unlimited amount of arguments to pass to the callback function." }
---
Schedule a new one-shot timer.

The timer will fire once in `delay` seconds, unless canceled before.

---

```lua
function MyAddon:OnEnable()
    self:ScheduleTimer("TimerFeedback", 5)
end

function MyAddon:TimerFeedback()
    print("5 seconds passed")
end
```
````

````apimethod
name: AceTimer:ScheduleRepeatingTimer
returns: { type = "string", desc = "The timer handle, used to cancel the timer with [`:CancelTimer`](#canceltimer)." }
params:
  - { name = "func", type = "function|methodname", desc = "Callback function for the timer pulse (funcref or method name)." }
  - { name = "delay", type = "number", desc = "Delay for the timer, in seconds." }
  - { name = "...", type = "any", desc = "An optional, unlimited amount of arguments to pass to the callback function." }
---
Schedule a repeating timer.

The timer will fire every `delay` seconds, until canceled.

---

```lua
function MyAddon:OnEnable()
    -- store the handle so the timer can be cancelled later
    self.pulseTimer = self:ScheduleRepeatingTimer("Pulse", 5)
end

function MyAddon:Pulse()
    -- runs every 5 seconds until cancelled
end
```
````

````apimethod
name: AceTimer:CancelTimer
returns: { type = "boolean", desc = "`true` if the timer was successfully cancelled, `false` if the id was invalid or the timer already fired/was cancelled." }
params:
  - { name = "id", type = "string", desc = "The id of the timer, as returned by [`:ScheduleTimer`](#scheduletimer) or [`:ScheduleRepeatingTimer`](#schedulerepeatingtimer)." }
---
Cancels a timer with the given id, registered by the same addon object as used for [`:ScheduleTimer`](#scheduletimer).

Both one-shot and repeating timers can be canceled with this function, as long as the `id` is valid and the timer has not fired yet or was canceled before.

---

```lua
function MyAddon:OnEnable()
    self.timer = self:ScheduleRepeatingTimer("Pulse", 1)
end

function MyAddon:StopPulse()
    self:CancelTimer(self.timer)
end
```
````

````apimethod
name: AceTimer:CancelAllTimers
---
Cancels all timers registered to the current addon object (`self`).
````

````apimethod
name: AceTimer:TimeLeft
returns: { type = "number", desc = "The time left on the timer." }
params:
  - { name = "id", type = "string", desc = "The id of the timer, as returned by [`:ScheduleTimer`](#scheduletimer) or [`:ScheduleRepeatingTimer`](#schedulerepeatingtimer)." }
---
Returns the time left for a timer with the given id, registered by the current addon object (`self`).

This function will return 0 when the id is invalid.
````
