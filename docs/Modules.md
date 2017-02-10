## Modules

Tipsy is broken out into many isolated modules that should do one thing or many
related things well.  It is authored in the ES6 module specification flavor.
A good reference and learning resource is: http://jsmodules.io/

### Creating a new module

A simple module could be a file that looks like this:

``` javascript
export var someVariable = 'someValue';
```

A module can also import other files.  Use relative paths to import:

``` javascript
import someValue from './some-file';
```

You may see the syntax:

``` javascript
import { someValue } from './some-file';
```

This allows you to pull a specific exported property from the module.
