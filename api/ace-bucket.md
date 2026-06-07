---
description: "AceBucket-3.0 throttles events that fire in bursts, collecting them over an interval and delivering them to your callback as a single grouped table"
---

# AceBucket-3.0

<Embeddable />

A bucket to catch events in.
AceBucket-3.0 provides throttling of events that fire in bursts and your addon only needs to know about the full burst.

This Bucket implementation works as follows:
Initially, no schedule is running, and its waiting for the first event to happen.
The first event will start the bucket, and get the scheduler running, which will collect all events in the given interval. When that interval is reached, the bucket is pushed to the callback and a new schedule is started. When a bucket is empty after its interval, the scheduler is stopped, and the bucket is only listening for the next event to happen, basically back in its initial state.

In addition, the buckets collect information about the `arg1` argument of the events that fire, and pass those as a table to your callback. This functionality was mostly designed for the [`UNIT_*`](https://warcraft.wiki.gg/wiki/Events) events.
The table will have the different values of `arg1` as keys, and the number of occurrences as their value, e.g.

```lua
{ ["player"] = 2, ["target"] = 1, ["party1"] = 1 }
```

AceBucket-3.0 requires [AceEvent-3.0](/api/ace-event) and [AceTimer-3.0](/api/ace-timer) to be available.

## Example

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("BucketExample", "AceBucket-3.0")

function MyAddon:OnEnable()
    -- Register a bucket that listens to all the HP related events,
    -- and fires once per second
    self:RegisterBucketEvent({"UNIT_HEALTH", "UNIT_MAXHEALTH"}, 1, "UpdateHealth")
end

function MyAddon:UpdateHealth(units)
    if units.player then
        print("Your HP changed!")
    end
end
```

## API Reference

````apimethod
name: AceBucket:Embed
kind: method
params:
  - { name = "target", type = "table", desc = "Target object to embed AceBucket in." }
returns: { type = "table", desc = "The `target` object that was embedded." }
---
Copies AceBucket's methods onto `target` so you can call them on it directly. See [The `:Embed` method](/api/ace-addon#the-embed-method).
````

````apimethod
name: AceBucket:RegisterBucketEvent
returns: { type = "string", desc = "The handle of the bucket (for unregistering)." }
params:
  - { name = "event", type = "string|table", desc = "The event to listen for, or a table of events." }
  - { name = "interval", type = "number", desc = "The Bucket interval (burst interval), in seconds." }
  - { name = "callback", type = "function|methodname", optional = true, desc = "The callback function, either as a function reference, or a string pointing to a method of the addon object. May be omitted only when `event` is a single string, in which case the event name is used as the method name." }
---
Register a Bucket for an event (or a set of events).

The first matching event starts the bucket and schedules a timer for `interval` seconds (via [AceTimer-3.0](/api/ace-timer)). All events that fire during the interval are collected, and when the interval elapses the `callback` is fired once with a table mapping each distinct `arg1` value to its number of occurrences (a `nil` `arg1` is stored under the key `"nil"`). If the bucket collected events, a new interval is scheduled; if it was empty, the timer is stopped and the bucket waits for the next event. Requires [AceEvent-3.0](/api/ace-event) and AceTimer-3.0 to be loaded.

---

```lua
MyAddon:RegisterBucketEvent("BAG_UPDATE", 0.2, "UpdateBags")

function MyAddon:UpdateBags()
    -- do stuff
end
```
````

````apimethod
name: AceBucket:RegisterBucketMessage
returns: { type = "string", desc = "The handle of the bucket (for unregistering)." }
params:
  - { name = "message", type = "string|table", desc = "The message to listen for, or a table of messages." }
  - { name = "interval", type = "number", desc = "The Bucket interval (burst interval), in seconds." }
  - { name = "callback", type = "function|methodname", optional = true, desc = "The callback function, either as a function reference, or a string pointing to a method of the addon object. May be omitted only when `message` is a single string, in which case the message name is used as the method name." }
---
Register a Bucket for an [AceEvent-3.0](/api/ace-event) addon message (or a set of messages).

Behaves identically to [`RegisterBucketEvent`](#registerbucketevent), except it listens for AceEvent-3.0 inter-addon messages instead of game events. Bursts of messages within `interval` seconds are coalesced and delivered to `callback` as a single table keyed by the distinct `arg1` values with their occurrence counts.

---

```lua
MyAddon:RegisterBucketMessage("SomeAddon_InformationMessage", 0.2, "ProcessData")

function MyAddon:ProcessData()
    -- do stuff
end
```
````

````apimethod
name: AceBucket:UnregisterBucket
params:
  - { name = "handle", type = "string", desc = "The handle of the bucket as returned by [`RegisterBucketEvent`](#registerbucketevent) or [`RegisterBucketMessage`](#registerbucketmessage)." }
---
Unregister any events and messages from the bucket and clear any remaining data.

Unregisters all events/messages the bucket was listening to, clears any data collected but not yet delivered, cancels the pending interval timer (if one is running), and recycles the internal bucket object for reuse.

---

```lua
function MyAddon:OnEnable()
    self.bucket = self:RegisterBucketEvent("BAG_UPDATE", 0.2, "UpdateBags")
end

function MyAddon:StopWatching()
    self:UnregisterBucket(self.bucket)
end
```
````

````apimethod
name: AceBucket:UnregisterAllBuckets
---
Unregister all buckets of the current addon object (or custom `self`). Iterates the registered buckets and calls [`UnregisterBucket`](#unregisterbucket) on each one whose owner is this object; buckets belonging to other objects are left untouched. This is called automatically when an embedding addon is disabled.
````
