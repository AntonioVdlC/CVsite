// -- Global View -- \\

import scrollTo from "./../utils/scrollTo.js";

export default {
	events: events
};

function events () {
	// Window scrolling
	window.addEventListener("scroll", function (e) {
		var height = window.innerHeight;
		var scroll = window.scrollY;

		// Scroll to info
		if (scroll === height - 1) {
			scrollTo(document.getElementById("info"));
		}

		// Scroll to about
		else if (scroll === 1) {
			scrollTo(document.getElementById("about"));
		}
	});
}