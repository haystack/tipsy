### DOM

![](https://raw.githubusercontent.com/tbranyen/tipsy/more-documentation/docs/_assets/dom.png)

#### Overview

A lightweight abstraction that provides Document querying with selectors.

#### Purpose

- The content script should do its best to not affect other scripts on a given
  page.  This script provides the necessary lookups to avoid a library like
  jQuery.

#### Notes

This module is completely standalone and should realistically only be depended
on by the content script.  Early on in development, it was attempted to avoid
jQuery (which turned out to be a bad idea, backfilling jQuery is a pain), so
there may be other modules that are still using some functions.

In the case of `selectAll` the return value will always be an Array, instead of
a NodeList, which is beneficial for Array operations.

Both methods allow the passing of a context object, which is a DOM Element that
will scope the lookups.

#### Exported properties

Name       | Type     | Description
---------- | -------- | -----------
select     | function | Selects a single element (first) found for a selector.
selectAll  | function | Selects all elements found for a selector.
