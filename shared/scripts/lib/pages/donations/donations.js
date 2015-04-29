'use strict';

import Component from '../../component';
import storage from '../../storage';
import calculate from '../../utils/calculate';
import { inject as injectDwolla } from '../../processors/dwolla';
import { getDwollaButton as dwollaBtn } from '../../processors/dwolla';
import { inject as injectPaypal } from '../../processors/paypal';
import { defaults } from '../../defaults';

function DonationsPage() {
  Component.prototype.constructor.apply(this, arguments);

  // Set the default table data.
  this.data = {
    entries: [],
    details: []
  };

  // Always attempt to render the inner table.
  this.renderTable();
  
  this.hidden = true;

  // Whenever the data changes re-render the table.
  storage.onChange(this.renderTable.bind(this));
  
  var component = this;
  
  
  this.entryDonation = this.fetch('pages/donations/entry-donation.html')
  
    .then(function(contents) {
      var template = combyne(contents);
      
      [].concat(component.filters).forEach(function(filter) {
        template.registerFilter(filter, component[filter]);  
      });
      return template;
    });
}

DonationsPage.prototype = {
  template: 'pages/donations/donations.html',

  events: {
    'keyup input': 'filterInput',
    'blur .amount': 'formatAndSave',
    'change .amount': 'formatAndSave',
    'click .remove': 'remove',
    'click .hide': 'toggleHidden',
    'click tbody tr td.clickable ': 'toggleEntryDonation'
   // 'click .entry-donation': 'cancelEvent'
  },

  filters: [
    'timeSpent',
    'or'
  ],

  or: function(one, other) {
    return one || other;
  },
  
  sorter: function(a, b) {
    if (Number(a.estimatedAmount) > Number(b.estimatedAmount)) {
      return -1;
    }
    if (Number(a.estimatedAmount) < Number(b.estimatedAmount)) {
      return 1;
    }
    return 0;    
  },
  
  toggleEntryDonation: function(ev) {
    var component = this;
    //console.log($(ev.currentTarget));
    var tr = $(($(ev.currentTarget)).parents()[0]);
    
    if (tr.parents('th').length) {
      return false;
    } 
    
    if (!tr.hasClass('entry')) {
      return false;
    }

    tr.toggleClass('active');
    
    this.entryDonation.then(function(template) {
      var host = tr.data('host');

      if (tr.is('.active') && component.data.details[0]) {
        var current = [];
        current.data = [];
        current.data.details = [];
        current.data.details = component.data.details.filter(function(entry) {
          return entry.author.hostname == host;
        });
        tr.after(template.render({entry: current.data}));
        new Tablesort(component.$('tr.entry-donation table')[0], {
          descending: true
        });
      
        component.$('tr.subentry').each(function() {
          var component = this;
          var $component = $(component);
          // Extract the estimated value.
          var amount = $component.find('.amount').val().slice(1);

          // The payment container.
          var payment = $component.find('.payment');

          var dwollaToken = $component.attr('data-dwolla');
          var paypalToken = $component.attr('data-paypal');

          // Hide the no processors text.
          if (dwollaToken || paypalToken) {
            payment.empty();
          }

          // Only inject if the author has dwolla.
          if (dwollaToken) {
            $component.data().dwolla = injectDwolla(payment, amount, dwollaToken);
          }

          // Only inject if the author has paypal.
          if (paypalToken) {
            $component.data().paypal = injectPaypal(payment, amount, paypalToken);
         }
         
         if (dwollaToken && !payment.hasClass("d-btn")) {
           payment.prepend(dwollaBtn(payment, amount, dwollaToken))
         }
      });
      } else {
        tr.next('tr.entry-donation').remove();
      }
    });
  },
  
  toggleHidden: function(ev) {
    this.hidden = !this.hidden;
    if (this.hidden === true) {
      $(".hide").text("Show more");
    } else if (this.hidden === false) {
      $(".hide").text("Hide")  ;    
    }
    //this.renderTable();
    if (this.hidden) {
      $(".hidden").hide();
    } else {
      $(".hidden").show();
    } 
  },

  /**
   * timeSpent
   *
   * @param val
   * @return
   */
  timeSpent: function(val) {
    return moment.duration(val, 'milliseconds').humanize();
  },

  remove: function(ev) {
    if (window.confirm('Are you sure you want to remove this entry from your contributions? This action cannot be undone.')) {
      var el = $(ev.currentTarget).closest('tr');
      var row = el.data();
      var host = row.host;
      var url = row.url;
      if (el.hasClass('entry')) {
        storage.get('settings').then(function(settings) {
          storage.get('log').then(function(resp) {
          // Filter out these items.
            resp[host] = resp[host].filter(function(entry) {
              if (entry.tab) {
                return entry.author.hostname !== host;
              } else {
                return entry;
              }
            });
  
            return storage.set('log', resp);
          });
        });
      } else if (el.hasClass('subentry')) {
        storage.get('settings').then(function(settings) {
          storage.get('log').then(function(resp) {
          // Filter out these items.
            resp[host] = resp[host].filter(function(entry) {
              if (entry.tab) {
                return entry.tab.url !== url;
              } else {
                return entry;
              }
            });
  
            return storage.set('log', resp);
          });
        });        
      }
    }
  },

  /**
   * Render the donations table.
   *
   * @return
   */
  renderTable: function() {
    var component = this;

    // Render with the data found from the log.
    storage.get('settings').then(function(settings) {
      storage.get('log').then(function(resp) {
        var filteredAndSorted = component
          // Convert the log Object to a filterable/sortable Array.
          .toArray(resp, settings, true)
          // Sort and filter passing along the log component instance as
          // context.
          .filter(component.filter, component);

        return filteredAndSorted;
      }).then(function(entries) {
        entries = entries.sort(component.sorter);
        var ents = entries;
        if (component.hidden) {
          var sortedNums = ents.map(function(o) {return Number(o.estimatedAmount);});
          for (var i = 0; i < entries.length; i++) {
            if (sortedNums.indexOf(Number(entries[i].estimatedAmount)) >= defaults.maxDonationsTableSize) {
              entries[i].hidden = true;
            }
          }

        }
        component.data.hidden = component.hidden;
        component.data.entries = entries;
        // This page hasn't been officially rendered yet.
        if (component.__rendered__) {
          component.render();
        }
            
        var tableSize = $('.pure-table tbody tr').length;
        if (tableSize <=1 ){
          $('#text').html("Nobody to pay yet, get browsing!");
        }
      }).catch(function(ex) {
        console.log(ex);
        console.log(ex.stack);
      });
    });
    
    storage.get('settings').then(function(settings) {
      storage.get('log').then(function(resp) {
        var filteredAndSorted = component
          // Convert the log Object to a filterable/sortable Array.
          .toArray(resp, settings, false)
          // Sort and filter passing along the log component instance as
          // context.
          .filter(component.filter, component);

        return filteredAndSorted;
      }).then(function(entries) {
        entries = entries.sort(component.sorter);
        var ents = entries;
 
        component.data.details = entries;
        // This page hasn't been officially rendered yet.
        /*
        if (component.__rendered__) {
          component.render();
        }
        */
            
        var tableSize = $('.pure-table tbody tr').length;

      }).catch(function(ex) {
        console.log(ex);
        console.log(ex.stack);
      });
    });
  },

  serialize: function() {
    return {
      entries: this.data.entries,
      hidden: this.data.hidden,
      details: this.data.details
    };
  },

  filterInput: function(ev) {
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    this.$(ev.currentTarget).val('$' + val);
  },

  formatAndSave: function(ev) {
    var val = ev.target.value.replace(/[^0-9.]/g, '');
    var currency = '$' + parseFloat(val).toFixed(2);

    this.$(ev.currentTarget).val(currency);

    // Update any payment methods on this element.
    var row = $(ev.currentTarget).closest('tr.entry').data();
    if (!row) {
      row = $(ev.currentTarget).closest('tr.subentry').data();
    }

    if (row.dwolla) {

      row.dwolla.update(currency);
    }

    if (row.paypal) {
      row.paypal.update(currency);
    }
  },

  /**
   * toArray
   *
   * @param resp
   * @return
   */
  toArray: function(resp, settings, isDetailed) {
    var entries = [];
    var component = this;

    // Reset the data entries.
    if (isDetailed === false) {
      this.data.entries = [];
    } else {
      this.data.details = []
    }
    // Resp is an object that is broken down by domain to list of entries
    // visited.  The most useful way to
    Object.keys(resp).forEach(function(key) {
      var calculated = resp[key]
        // Condense down the page logic.
        .reduce(function(memo, current) {
          // Used to determine if we're adding for the first time, or updating
          // an existing entry.
          var isUpdated = false;

          // Check if this url was already added.
          memo.forEach(function(entry) {
            // make sure it's not the daysVisited
            entry.host = key;
            if (entry.tab && !entry.paid) {
              // If there is already an entry with the same url, update it.
              if (isDetailed === true) {
                if (entry.author.hostname === current.author.hostname) {
                  entry.timeSpent += current.timeSpent;
                  isUpdated = true;
                }
              } else if (isDetailed === false){
                if (entry.tab.url === current.tab.url) {
                  entry.timeSpent += current.timeSpent;
                  isUpdated = true;
                }
              }
            }
          });

          // If the current entry was not appended to a previous entry, push
          // it as a new item, since this is a page not yet tracked.
          if (!isUpdated) {
            memo.push(current);
          }
          return memo;
        }, [])
        // Calculate the estimated amount for each entry.
        .map(function(entry) {
          return calculate(settings, entry);
        })
        // Ensure we're only working with estimated amounts greater than `0`.
        .filter(function(entry) {
          return parseFloat(entry.estimatedAmount) > 0;
        });

      // Condense into a single array.
      var condensed = calculated.reduce(function(memo, current) {
        // Make sure there is author information.
        if (component.hasPaymentInfo(current)) {
          memo.push(current);
        }

        return memo;
      }, []);
      
      entries.push.apply(entries, condensed);
    }, this);

    return entries;
  },

  hasPaymentInfo: function(entry) {
    return (entry.author && entry.author.list && entry.author.list[0] &&
            (entry.author.list[0].bitcoin || entry.author.list[0].dwolla ||
             entry.author.list[0].paypal || entry.author.list[0].stripe));
  },

  filter: function(entry) {
    return entry.author && entry.author.list.length && !entry.paid;
  },

  afterRender: function() {

    var tableSize = $('.pure-table tbody tr').length;
    if (tableSize <= defaults.maxDonationsTableSize) {
      $("#moreButton").hide() ;
    } else  {
      $("#moreButton").show();
    }
    
    
    this.$('.payment').on('mouseup', function(ev) {
      var tr = $(ev.currentTarget).closest('tr').data();

      // Need to synchronously save the current url & host.
      window.localStorage.url = tr.url;
      window.localStorage.host = tr.host;

      //window.alert('You will now be redirected to the payment site.');
    });

    // Inject payment information for each entry.

    var component_1 = this;
    storage.get('settings').then(function(settings) {

      component_1.$('tr.entry').each(function() {
        var component = this;
        var $component = $(component);
        // Extract the estimated value.
        var amount = $component.find('.amount').val().slice(1);

        // The payment container.
        var payment = $component.find('.payment');

        var dwollaToken = $component.attr('data-dwolla');
        var paypalToken = $component.attr('data-paypal');

        // Hide the no processors text.
        if (dwollaToken || paypalToken) {
          payment.empty();
        }

        // Only inject if the author has dwolla.
        if (dwollaToken) {
          $component.data().dwolla = injectDwolla(payment, amount, dwollaToken);
         
        }

        // Only inject if the author has paypal.
        if (paypalToken) {
          $component.data().paypal = injectPaypal(payment, amount, paypalToken);
        }

      });

      //return storage.set('settings', settings);
    }).catch(function(ex) {
      console.log(ex);
      console.log(ex.stack);
    });

    // Enable table sorting.
    this.tablesort = new Tablesort(this.$('table')[0], {
      descending: true

    });

  }
};

DonationsPage.prototype.__proto__ = Component.prototype;

export default DonationsPage;
