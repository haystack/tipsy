### Adding a new Component

Components inside Tipsy are defined in: shared/scripts/lib/components/.  You
will see existing components already in here that you can base new
functionality off of.

Creating a new component:

- Add a folder to `shared/scripts/lib/components/` named after the component.
  You should only use lowercase and hyphen separated.
  Example: reminder-threshold
- You could copy the reminders component wholesale and then make the necessary
  tweaks to get started.
- Add HTML, JS, and Stylus files inside here named after the component.
  - `components/reminder-threshold/reminder-treshold.html`
  - `components/reminder-threshold/reminder-treshold.js`
  - `components/reminder-threshold/reminder-treshold.styl`
- Once you've done this, you'll need to register it in the page (or globally
  with Component.register).
  - To register in a given page, look at components/settings/settings.js for
    inspiration.  You will import calls like:

    ``` javascript
    import RemindersComponent from '../../components/reminders/reminders';
    ```

    Add one to match your component:

    ``` javascript
    import ReminderThresholdComponent from '../../components/reminder-threshold/reminder-threshold';
    ```

  - You'll notice that the Component is rendered immediately after the page
    has finished rendering inside `afterRender`.

    ``` javascript
    new RemindersComponent(select('set-reminders', this.el)).render();
    ```

    Your code would look something like:

    ``` javascript
    new ReminderThresholdComponent(select('reminder-threshold', this.el)).render();
    ```

- Add the markup for the component inside the settings page markup
  (settings/settings.html):

  ``` html
  <fieldset>
    <reminder-threshold></reminder-threshold>
  </fieldset>
  ```

- (Optionally) Add the styles file to: `shared/styles/indx.styl`.
  - Under `// Components` around line 17 you'll see a convention for adding
    new component styles.
  - Adding reminder-threshold would look something like:

    ``` stylus
    reminder-threshold
      display block
      @import '../scripts/lib/components/reminder-threshold/reminder-threshold.styl'
    ```

- (Optionally) Add content to the markup file:
  `components/reminder-threshold/reminder-threshold.html`.  This is the
  template that will be rendered in place of the settings page markup.

- Now you need to add the code for the Component:

  ``` javascript
  'use strict';

  import Component from '../../component';

  function ReminderThresholdComponent() {
    Component.prototype.constructor.apply(this, arguments);
  }

  RemindersComponent.prototype = {
    template: 'components/reminder-threshold/reminder-threshold.html',

    events: {
      'click': 'handleClick'
    },

    handleClick: function(ev) {
      console.log('Component was clicked', ev);
    },

    afterRender: function() {
      // Do something with this.$el (jQuery element) after the view is
      // rendered.
    }
  };

  ReminderThresholdComponent.prototype.__proto__ = Component.prototype;

  export default ReminderThresholdComponent;
  ```

- Look to other components for inspiration.
