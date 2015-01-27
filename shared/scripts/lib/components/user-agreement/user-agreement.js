'use strict';

import Component from '../../component';
import storage from '../../storage';

function UserAgreementComponent() {
  Component.prototype.constructor.apply(this, arguments);
  var component = this;
  storage.get('settings').then(function(settings) {
    component.userAgrees = settings.userAgrees;
  
  }).catch(function(ex) {
    console.log(ex);
    console.log(ex.stack);
  });
}

UserAgreementComponent.prototype = {
  template: 'components/user-agreement/user-agreement.html',
  
  events: {
    'change input[type=checkbox]' : 'agreementChanged'
  },
  
  agreementChanged: function(ev) {
    this.updateUserAgreement(this.$('#userAgreementCheckbox').prop('checked'));
  },
  
  updateUserAgreement: function(userAgrees) {
    if (userAgrees) {
      this.$('#userAgreementCheckbox').prop('checked', true);
      this.$('.userAgreementCheckbox').addClass('active');
    } else {
      this.$('#userAgreementCheckbox').prop('checked', false);
      this.$('.userAgreementCheckbox').removeClass('active');
    }
    
    storage.get('settings').then(function(settings) {
      settings.userAgrees = userAgrees;
      return storage.set('settings', settings);
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });
  },
  
  afterRender: function() {
    var component = this;
    storage.get('settings').then(function(settings) {
      component.userAgrees = settings.userAgrees;
      
      if (typeof component.userAgrees === 'undefined') {
        console.error('user agreement not set');
      }
      
      component.updateUserAgreement(component.userAgrees);
    
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });
  
  }
  
};

UserAgreementComponent.prototype.__proto__ = Component.prototype;

export default UserAgreementComponent;
