(function (root) {
	"use strict";

	function View () {}

	// Initialize the view
	View.prototype.init = function (options) {
		// DOM element that will contain the view
		this.$el = (options && options.el) ? 
			document.getElementById(options.el) : 
			document.getElementsByTagName("body")[0];

		// A link to the parent view (if nested view)
		this.parent = options && options.parent || null;

		// Data passed to the view
		this.data = options && options.data || {};

		// Get the data + render the view
		this.getData(this.queries, this.render);
	};

	// Get the data
	View.prototype.getData = function (queries, callback) {
		// Retrieve all the queries in an array
		var calls = [];		
		queries.forEach((query) => {
			calls.push(
				getJSON({
					url: "data/" + query + ".json"
				})
				.then(function (json) {
					this.data[query] = json;
				}.bind(this))
				.catch(function (code, text) {
					window.alert("Error " + code + ": " + text);
				})
			);
		}, this);

		// Once all the data is retrieve, call the callback
		Promise.all(calls).then(callback.bind(this));

		// Promise wrapper around the xhr ajax call
		function getJSON (options) {
			return new Promise(function (resolve, reject) {
				var req = new XMLHttpRequest();
				req.open("GET", options.url);

				req.onload = function () {
					if (req.status === 200) {
						resolve(JSON.parse(req.response));
					}
					else {
						reject(req.status, req.statusText);
					}
				};

				req.onerror = function () {
					reject(req.status, req.statusText);
				};

				req.send();
			});
		}
	};

	View.prototype.render = function () {
		// Render the template
		this.$el.innerHTML = this.template(this.data);

		// Attach the event listeners
		this.attachEventListeners(this.events);
	};

	View.prototype.attachEventListeners = function (events) {
		var body = document.getElementsByTagName("body");

		Object.keys(events).forEach((key) => {
			var type = key.split(" ")[0];
			var target = key.split(" ")[1];
			var callback = this.events[key];

			// Attach the event to the body (event delegation)
			body.addEventListener(type, function (e) {
				if (e.target &&
					// Looking for a class
					((target.charAt(0) === "." &&
						e.target.className.indexOf(target.slice(0, 1)) > -1) ||
					// Looking for an id
					(target.charAt(0) === "#" &&
						e.target.id.indexOf(target.slice(0, 1)) > -1) ||
					// Looking for a tag name
					(e.target.tagName.indexOf(target) > -1))) {

					// Callback
					callback.call(this, e);
				}
			});
		});
	};

	// Save a reference to the global object
	root.View = View.prototype;

}(this));