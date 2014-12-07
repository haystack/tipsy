### Creating a new Page

Pages are simply Components inside the extension.  They are registered once
each, using the `Component.registerPage` method.

``` javascript
Component.registerPage("#my-page", MyPageConstructor);
```

You will need to import your constructor before using:

``` javascript
import MyPageConstructor from './pages/my-page/my-page';
```

There is, however, a better mechanism in place which is used for registering
pages.  Inside: `shared/scripts/lib/index.js` you will see a pages object
near the top of the file.  Add the id of the page and the component
constructor; the code following will automatically register and render when
applicable.

Once you have added this code you will need to modify the
`shared/html/index.html` file to add in your page placeholder.  Open this file
and you'll see `<section>` tags that contain `id`'s that match the id's
assigned above.  Add your page placeholder here:

``` html
<section id="my-page"></section>
```

You may also want to add your page to the navigation list in the `<nav>`
element.
