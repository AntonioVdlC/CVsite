"use strict";

var RandomFactsView = Object.create(View, {
	queries: {
		value: ["randomFacts"]
	},

	template: {
		value: ({randomFacts}) => _t`
			<p id="random-fact" class="text">
				${randomFacts[Math.floor(Math.random() * randomFacts.length)].text}
			</p>
			<p id="new-random-fact">
				New random fact?
			</p>
		`
	},

	events: {
		value: {
			"click #new-random-fact": function newRandomFact () {
				document.getElementById("random-fact").innerHTML = 
					this.data.randomFacts[Math.floor(Math.random() * this.data.randomFacts.length)].text;
			}
		}
	}
});