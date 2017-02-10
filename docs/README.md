Tipsy is architected in a way that allows for a shared codebase between any
browser extension platform.  Currently it supports Chrome and Firefox.

At a high level, the folder structure breaks down into:

- `/build`
- `/docs`
- `/chrome-extension`
- `/firefox-extension`
- `/shared`
- `/test`

#### Build

The build directory contains one committed folder and one ignored folder.  The
committed folder is where all Grunt task configuration lives.  These tasks are
authored in CoffeeScript.  You can read more about this design decision here:

http://tbranyen.com/post/coffeescript-has-the-ideal-syntax-for-configurations

The second directory that is ignored, is `/build/tools`, which contains the
tooling necessary to build the Firefox Addon.  These tools are fetched during
the `npm install` stage and therefore not committed into the repository.

#### Documentation

The `/docs` folder Contains the documentation you are currently reading.

#### Chrome extension

The chrome-extension directory contains the unique files and folders that
cannot be shared.  These items include the `_locales` folder and the key to
sign the extension.  This also contains the extension manifest file.

The distribution directory, `dist`, contains the unpacked built extension and
the signed `.crx` file.

The `test` directory contains configuration for the Webdriver test runner which
allows it to load and navigate to the extension.

#### Firefox extension

The firefox-extension directory does not need any unique files or folders to
build.  Firefox infers almost everything it needs from the source code and
everything else is loaded from the package.json.

The distribution directory, `dist`, contains the unpacked built extension and
the `.xpi` file.

The `test` directory contains configuration for the Webdriver test runner which
allows it to load and navigate to the extension.

#### Shared assets

This folder contains all the markup, images, source code, and styles for the
extension.  The styles and images are consistent between the extensions.  The
markup and source code need to resolve differences so there is branching logic
involved.

The markup is processed using the
[grunt-targethtml](https://github.com/changer/grunt-targethtml) task.  This
task is able to remove the vendor script tags from the page within Firefox as
they are dynamically injected. This is to overcome limitations with addons.

The source is organized into three distinct pieces that can be often reused
and shared.  The associated graphs visualize the dependency structure.

![](https://raw.githubusercontent.com/tbranyen/tipsy/more-documentation/docs/_assets/overview.png)

##### Background script

This code runs "eternally" so long as the extension is installed.  It starts up
whenever the browser is open and is responsible for tracking tab activity and
communicating with the content script and extension library.

##### Content script

This script is injected into individual tabs to communicate with the the
background script.  It can track mouse movement and media activity.  It also
locates the `<link>` tag which is used to identify if a page has opt'd into
Tipsy.

##### Extension library

Located within the `/shared/scripts/lib` folder, and starting with `index.js`,
this library source is what powers the actual extension UI/UX.

#### Tests

The tests directory is broken down into unit and integration parts.  The unit
tests are written with Mocha and ES6 Module Loader and loaded via Grunt.  The
integration tests are necessary to test extension behavior that must happen
within a real browser.
