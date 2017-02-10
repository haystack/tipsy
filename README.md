Tipsy
-----

[![Build Status](https://travis-ci.org/haystack/tipsy.png?branch=master)](https://travis-ci.org/haystack/tipsy)


### Developing ###

If you wish to work on Tipsy, you can find instructions on getting started
below.  It uses [Node](http://nodejs.org) to install and run the extension.

At the moment the build process and tests only work in Linux.

#### Installing Node and dependencies ####

Go to the [Node](http://nodejs.org) homepage and install for your platform.

Next, open a command line prompt and enter the project directory.  You will
install all development dependencies with one command:

``` bash
npm install
```

### Working on Chrome extension ###

To build the Chrome extension, you will need [Google
Chrome](http://chrome.com/) installed.

Once it is installed and configured you can build the extension with:

``` bash
npm run build-chrome
```

#### Loading the unpacked extension ####

The source code necessary to run the extension as unpacked lives in the
*dist/tipsy* directory and can be dragged into the Extensions tab within
Chrome.

#### Watching the filesystem for changes ####

You can have the extension automatically recompiled with:

``` shell
npm run watch-chrome
```

#### Extension url ####

chrome-extension://ajcjbhihdfmefgbenbkpgalkjglcbmmp/html/index.html

### Working on Firefox extension ###

Build the *.crx* file with:

``` shell
npm run build-firefox
```

#### Watching the filesystem for changes ####

You can have the extension automatically recompiled with:

``` shell
npm run watch-firefox
```

#### Extension url ####

resource://jid1-onbkbcx9o5ylwa-at-jetpack/tipsy/data/html/index.html

### Working on both Chrome and Firefox ###

To build both extensions you will need to ensure that you can build them
individually per the instructions above.  Then the following command should
work:

``` shell
npm run build
```

#### Watching the filesystem for changes ####

You can have both extensions automatically recompiled with:

``` shell
npm run watch
```
