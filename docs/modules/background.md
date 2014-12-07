### Background script

![](https://raw.githubusercontent.com/tbranyen/tipsy/more-documentation/docs/_assets/background.png)

#### Overview

This code runs "eternally" so long as the extension is installed.  It starts up
whenever the browser is open and is responsible for tracking tab activity and
communicating with the content script and extension library.

#### Purpose

- Hooks up the extension icon and handles opening the extension in a new tab.
- Initializes the activity logging.
- Injects the content script.
- Ensures the event watcher is loaded.

#### Notes

You should update this file whenever high level dependencies change.  The
scripts array contains all global dependencies from `node_modules` and the
extension library script.  This is required to inject into Firefox.
