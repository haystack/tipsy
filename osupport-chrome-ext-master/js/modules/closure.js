define([
	"jquery",
	],
	function($) {

		var countB = 0;
		var counterB = function() {
			console.log(this);     // bound to obj with counterA and counterB functions
			var that = this;
			return function() {
				console.log(this); // this bound to global window?
				countB += 1;       // expected to have to use that.countB ?
				return countB;
			}
		}

		var counterC = function() {
			return function() {
				countB += 2;
				return countB;
			}
		}

		return {
			counterA: function() {
				var countA = 0;
				console.log(this);  // bound to obj with counterA and counterB functions
				return function() {
					console.log(this);  // this bound to global window
					countA += 1;
					return countA;
				}
			},
			counterB: counterB,
			counterC: counterC,
		}
	}
);