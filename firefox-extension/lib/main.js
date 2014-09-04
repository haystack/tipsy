var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var data = require("sdk/self").data;

var button = buttons.ActionButton({
  id: 'mozilla-link',
  label: 'Visit Mozilla',
  icon: {
    '16': './icon-16.png',
    '32': './icon-32.png',
    '64': './icon-64.png'
  },
  onClick: handleClick
});

function handleClick(state) {
  tabs.open(data.url('html/index.html'));
}
