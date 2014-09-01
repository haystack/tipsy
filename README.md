Tipsy
-----

[![Build Status](https://travis-ci.org/haystack/tipsy.png?branch=master)](https://travis-ci.org/haystack/tipsy)


### Developing ###

If you wish to work on Tipsy, you can find instructions on getting started
below.  It uses [Node](http://nodejs.org) to install and run the extension.

#### Installing Node and dependencies ####

Go to the [Node](http://nodejs.org) homepage and install for your platform.

Next, open a command line prompt and enter the project directory.  The rest of
the commands are run in that directory.

### Installing dependencies ###

Node comes packaged with a package manager that you can use to install modules.

``` bash
# Install all dependencies.
npm install
```

#### Client side dependencies ####

The third party client side assets are versioned and managed by Bower, they are
not checked in to prevent noisy diffs and conflicts.

You can read more about Bower here: http://bower.io/

They are automatically installed when you run `npm install` so typically there
is no need to manually update the dependencies.  If you find yourself changing
the dependencies, run:

``` bash
bower install
```

### Working on Chrome extension ###

To build the Chrome extension, you will need [Google
Chrome](http://chrome.com/) installed.

Once it is installed and configured you can build the extension with:

``` bash
npm run build
```

or more specifically:

``` bash
grunt chrome-extension
```

#### Loading the unpacked extension ####

The source code necessary to run the extension as unpacked lives in the
*dist/tipsy* directory and can be dragged into the Extensions tab within
Chrome.

#### Automatically reload the extension ####

During development it is advantageous to automatically reload the extension
window while developing.

Once you have launched Chrome, ensure that you have loaded the unpacked
extension and open the main entry point:

chrome-extension://ajcjbhihdfmefgbenbkpgalkjglcbmmp/html/index.html

Finally run `grunt watch:chrome-extension` to monitor the filesystem.
