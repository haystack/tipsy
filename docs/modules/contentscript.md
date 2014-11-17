### Content script

#### Overview

This script is injected into individual tabs to communicate with the the
background script.  It can track mouse movement and media activity.  It also
locates the `<link>` tag which is used to identify if a page has opt'd into
Tipsy.

#### Purpose

- Locate `<link rel=author>` tags and parse them for relevant Tipsy data.
- Communicate with the background script when the tag is parsed and when
  events occur that affect the idle.
- Parses out the domain from the page, which excludes the subdomain.
- Hooks up browser based events that should trigger an idle.

#### Notes

The domain parsing is a bit of a hack that utilizes cookies to find the most
generic allowed domain name, excluding subdomains.
