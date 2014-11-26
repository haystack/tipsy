### Component

![](https://raw.githubusercontent.com/tbranyen/tipsy/more-documentation/docs/_assets/component.png)

#### Overview

This module is responsible for modifying the internal tab tracking cache and
the log object inside the storage engine.

This module does not do any monitoring or tracking itself.  That happens within
the watcher module.

#### Purpose

- To start and stop tab activity recording.

#### Notes

It may be required to convert the explicit storage dependency to be injected
allowing for alternative implementations to be used.  Although it's possible
that this storage mechanism will be useful to other extensions as well.

If querying is necessary, a new function `query` could be introduced.  This is
not necessary for this extension, but might be useful.

#### Exported properties

Name       | Type     | Description
---------- | -------- | -----------
initialize | function | Ensures a log object in the storage engine is present.
start      | function | Activates a tab to be tracked internally.
stop       | function | Deactivates and saves the recorded tab information.

