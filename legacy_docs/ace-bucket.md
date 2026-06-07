# AceBucket-3.0

A bucket to catch events in.
AceBucket-3.0 provides throttling of events that fire in bursts and your addon only needs to know about the full burst.

This Bucket implementation works as follows:
Initially, no schedule is running, and its waiting for the first event to happen.
The first event will start the bucket, and get the scheduler running, which will collect all events in the given interval. When that interval is reached, the bucket is pushed to the callback and a new schedule is started. When a bucket is empty after its interval, the scheduler is stopped, and the bucket is only listening for the next event to happen, basically back in its initial state.

In addition, the buckets collect information about the "arg1" argument of the events that fire, and pass those as a table to your callback. This functionality was mostly designed for the UNIT_* events.
The table will have the different values of "arg1" as keys, and the number of occurances as their value, e.g.

```lua
{ ["player"] = 2, ["target"] = 1, ["party1"] = 1 }
```

AceBucket-3.0 can be embeded into your addon, either explicitly by calling AceBucket:Embed(MyAddon) or by specifying it as an embeded library in your AceAddon. All functions will be available on your addon object and can be accessed directly, without having to explicitly call AceBucket itself.
It is recommended to embed AceBucket, otherwise you'll have to specify a custom `self` on all calls you make into AceBucket.

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

### `AceBucket:RegisterBucketEvent(event, interval, callback)`

Register a Bucket for an event (or a set of events)

**Parameters**

- `event` — The event to listen for, or a table of events.
- `interval` — The Bucket interval (burst interval)
- `callback` — The callback function, either as a function reference, or a string pointing to a method of the addon object.

**Returns**

- The handle of the bucket (for unregistering)

**Usage**

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceBucket-3.0")
MyAddon:RegisterBucketEvent("BAG_UPDATE", 0.2, "UpdateBags")

function MyAddon:UpdateBags()
    -- do stuff
end
```

### `AceBucket:RegisterBucketMessage(message, interval, callback)`

Register a Bucket for an AceEvent-3.0 addon message (or a set of messages)

**Parameters**

- `message` — The message to listen for, or a table of messages.
- `interval` — The Bucket interval (burst interval)
- `callback` — The callback function, either as a function reference, or a string pointing to a method of the addon object.

**Returns**

- The handle of the bucket (for unregistering)

**Usage**

```lua
MyAddon = LibStub("AceAddon-3.0"):NewAddon("MyAddon", "AceBucket-3.0")
MyAddon:RegisterBucketEvent("SomeAddon_InformationMessage", 0.2, "ProcessData")

function MyAddon:ProcessData()
    -- do stuff
end
```

### `AceBucket:UnregisterAllBuckets()`

Unregister all buckets of the current addon object (or custom "self").

### `AceBucket:UnregisterBucket(handle)`

Unregister any events and messages from the bucket and clear any remaining data.

**Parameters**

- `handle` — The handle of the bucket as returned by RegisterBucket*
