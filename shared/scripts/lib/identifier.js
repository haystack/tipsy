import storage from './storage';

export function giveUniqueIdentifier() {
  storage.get('settings').then(function(settings) {
    if (!settings.userId) {
      var token = createRandomToken(32);
      settings.userId = token;
      return storage.set('settings', settings);
    }
  }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
  });
}

function createRandomToken(nums) {
  var ar = new Uint8Array(nums);
  crypto.getRandomValues(ar);
  var token = '';
  for (var i = 0; i < ar.length; ++i) {
    token += ar[i].toString(16);
  }
  return token;
}
