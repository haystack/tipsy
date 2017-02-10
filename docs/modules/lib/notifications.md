### Extension

![](https://raw.githubusercontent.com/tbranyen/tipsy/more-documentation/docs/_assets/extension.png)

#### Overview

This module exports a single variable that indicates the current environment.

#### Purpose

- To let other modules know what environment the extension is in.

#### Notes

It's a very cheap lookup that simply checks if `chrome` is a global variable.
If it is not, it is assumed the environment is Firefox.

#### Exported properties

Name        | Type   | Description
----------- | ------ | -----------
environment | string | Either 'chrome' or 'firefox' depending on environment.


