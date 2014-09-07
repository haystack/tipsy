var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var data = require("sdk/self").data;

var button = buttons.ActionButton({
  id: 'mozilla-link',
  label: 'Visit Mozilla',
  icon: {
    '19': './img/logo19.png',
    '48': './img/logo48.png',
    '64': './img/logo64.png'
  },
  onClick: handleClick
});

function handleClick(state) {
  tabs.open(data.url('html/index.html'));
}
